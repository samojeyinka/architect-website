import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, database, type Session } from './supabase';

export const SESSION_KEY = 'formline_session';

export type Profile = { id: string; full_name: string; role: 'client' | 'architect' | 'admin' };

type Role = Profile['role'];

type AuthValue = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<Session>;
  signUp: (email: string, password: string, fullName: string, role: 'client' | 'architect') => Promise<Session | null>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setRole: (role: Role) => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export const getSession = (): Session | null => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') as Session | null; } catch { return null; }
};

export const saveSession = (session: Session) => localStorage.setItem(SESSION_KEY, JSON.stringify(session));

export const clearSession = () => localStorage.removeItem(SESSION_KEY);

const decodeExp = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')) as string);
    return typeof json.exp === 'number' ? json.exp * 1000 : null;
  } catch { return null; }
};

export const refreshIfNeeded = async (stored: Session): Promise<Session | null> => {
  const exp = decodeExp(stored.access_token);
  if (exp && exp - Date.now() > 30_000) return stored;
  try {
    const refreshed = await auth.refresh(stored.refresh_token);
    saveSession(refreshed);
    return refreshed;
  } catch {
    clearSession();
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const setSession = (next: Session | null) => {
    setSessionState(next);
    if (next) saveSession(next);
    else { clearSession(); setProfile(null); }
  };

  const refreshProfile = async () => {
    const active = getSession();
    if (!active) { setProfile(null); return; }
    try {
      const rows = await database.select<Profile>('profiles', `select=id,full_name,role&id=eq.${active.user.id}`, active.access_token);
      setProfile(rows[0] || { id: active.user.id, full_name: '', role: 'client' });
    } catch { setProfile({ id: active.user.id, full_name: '', role: 'client' }); }
  };

  useEffect(() => {
    (async () => {
      const stored = getSession();
      if (!stored) { setLoading(false); return; }
      const active = await refreshIfNeeded(stored);
      setSessionState(active);
      if (active) await refreshProfile();
      setLoading(false);
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    const active = await auth.signIn(email, password);
    setSessionState(active);
    saveSession(active);
    await refreshProfile();
    return active;
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'client' | 'architect') => {
    const result = await auth.signUp(email, password, fullName, role);
    if (result.session) {
      try { await database.update('profiles', `id=eq.${result.session.user.id}`, { role }, result.session.access_token); } catch { /* profile may be seeded via trigger; ignore */ }
      return result.session;
    }
    return null;
  };

  const signOut = async () => {
    const active = getSession();
    try { if (active) await auth.signOut(active.access_token); } catch { /* ignore */ }
    setSession(null);
  };

  const setRole = (role: Role) => setProfile((p) => (p ? { ...p, role } : p));

  const value: AuthValue = { session, profile, loading, signIn, signUp, signOut, refreshProfile, setRole };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}