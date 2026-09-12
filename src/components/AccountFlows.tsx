import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { database } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import './AccountFlows.css';

type Application = {
  id: string;
  studio_name: string;
  city: string;
  founded_year: number | null;
  website: string | null;
  bio: string;
  specialty: string | null;
  service_regions: string | null;
  budget_range: string | null;
  availability_note: string | null;
  application_status: string;
  submitted_at: string | null;
};

export function Account({ next, initialRole = 'client', initialMode = 'signup' }: { next?: string; initialRole?: 'client' | 'architect'; initialMode?: 'signup' | 'signin' }) {
  const navigate = useNavigate();
  const { session, profile, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  const [role, setRole] = useState<'client' | 'architect'>(initialRole);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  if (loading) return <main className="account-flow"><section className="loading-lockup">Loading your account…</section></main>;
  if (session) return <Navigate to={next || '/dashboard'} replace />;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    try {
      const email = String(form.get('email'));
      const password = String(form.get('password'));
      if (mode === 'signup') {
        await signUp(email, password, String(form.get('full_name')), role);
        formEl.reset();
        setMode('signin');
        setToast('Account created — welcome to Formline. Please sign in to continue.');
      } else {
        await signIn(email, password);
        navigate(next || '/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not continue.');
    } finally {
      setBusy(false);
    }
  };

  return <main className="account-flow">{toast && <div className="toast" role="status"><span className="toast-dot" />{toast}</div>}<Link className="logo" to="/">form<span>line</span></Link><section><p className="mono">[ {mode === 'signup' ? 'JOIN FORMLINE' : 'WELCOME BACK'} ]</p><h1>{mode === 'signup' ? 'Begin with a good' : 'Continue your'}<br /><em>{mode === 'signup' ? 'beginning.' : 'project.'}</em></h1><p className="flow-intro">{mode === 'signup' ? 'Create your account, then sign in to get started.' : 'Sign in to manage your project, applications and consultations.'}</p><form onSubmit={submit}>{mode === 'signup' && <><label>Your name<input required name="full_name" placeholder="Your full name" /></label><fieldset><button type="button" className={role === 'client' ? 'selected' : ''} onClick={() => setRole('client')}>I’m planning a project</button><button type="button" className={role === 'architect' ? 'selected' : ''} onClick={() => setRole('architect')}>I’m an architect</button></fieldset></>}<label>Email address<input required type="email" name="email" placeholder="you@example.com" /></label><label>Password<input required minLength={8} type="password" name="password" placeholder="At least 8 characters" /></label>{error && <p className="form-error">{error}</p>}<button className="dark-button" disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account →' : 'Sign in →'}</button></form><button className="switch-auth" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>{mode === 'signup' ? 'Already have an account? Sign in' : 'New to Formline? Create an account'}</button></section></main>;
}

const applicationFields: { name: keyof Application; label: string; required?: boolean; type?: string; placeholder: string }[] = [
  { name: 'studio_name', label: 'Studio name', required: true, placeholder: 'e.g. Maison Adebayo' },
  { name: 'website', label: 'Website', type: 'url', placeholder: 'https://yourstudio.com' },
];

const lockedStatuses = ['submitted', 'under_review', 'approved'];

export function ArchitectApply() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const [existing, setExisting] = useState<Application | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!session) return;
    database.select<Application>('architect_profiles', `select=*&id=eq.${session.user.id}`, session.access_token)
      .then(rows => { setExisting(rows[0] || null); })
      .catch(() => setExisting(null))
      .finally(() => setLoaded(true));
  }, [session]);

  if (session && !loaded) return <main className="account-flow"><section className="loading-lockup">Loading your application…</section></main>;
  if (!session) return <Account next="/apply" initialRole="architect" initialMode="signup" />;

  const status = existing?.application_status || 'draft';
  const locked = lockedStatuses.includes(status);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const f = new FormData(e.currentTarget);
    const value: Partial<Application> & { application_status: string; submitted_at: string } = {
      id: session.user.id,
      studio_name: String(f.get('studio_name')),
      city: String(f.get('city')),
      founded_year: Number(f.get('founded_year')) || null,
      website: String(f.get('website')) || null,
      bio: String(f.get('bio')),
      specialty: String(f.get('specialty')) || null,
      service_regions: String(f.get('service_regions')) || null,
      budget_range: String(f.get('budget_range')) || null,
      availability_note: String(f.get('availability_note')) || null,
      application_status: 'submitted',
      submitted_at: new Date().toISOString(),
    };
    try {
      if (existing) await database.update('architect_profiles', `id=eq.${session.user.id}`, value, session.access_token);
      else await database.insert('architect_profiles', value, session.access_token);
      navigate('/application-received');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your application.');
    } finally {
      setBusy(false);
    }
  };

  return <main className="account-flow application"><Link className="logo" to="/">form<span>line</span></Link><section><p className="mono">[ ARCHITECT APPLICATION · 01 / 01 ]</p><h1>{locked ? <>Already<br /><em>submitted.</em></> : <>Let’s meet<br /><em>your practice.</em></>}</h1>
    {locked ? <>
      <p className="flow-intro">{status === 'approved'
        ? 'Your application was approved — your profile is live in the Formline directory and is no longer editable from this page.'
        : 'Your application has been submitted and is under review. It cannot be edited while it is with the Formline team.'}</p>
      <span className={`status ${status}`}>{status.replace('_', ' ')}</span>
      <div className="application-readonly">{applicationFields.map(field => <div key={field.name}><small>{field.label}</small><p>{existing?.[field.name] ? String(existing[field.name]) : '—'}</p></div>)}<div><small>Primary city</small><p>{existing?.city || '—'}</p></div><div><small>Established</small><p>{existing?.founded_year ? String(existing.founded_year) : '—'}</p></div><div><small>What makes your work distinct?</small><p>{existing?.bio || '—'}</p></div><div><small>Main speciality</small><p>{existing?.specialty || '—'}</p></div><div><small>Where do you work?</small><p>{existing?.service_regions || '—'}</p></div><div><small>Typical project budget</small><p>{existing?.budget_range || '—'}</p></div><div><small>Availability</small><p>{existing?.availability_note || '—'}</p></div></div>
      {existing?.submitted_at && <p className="status-note">Submitted on {new Date(existing.submitted_at).toLocaleDateString()}. We’ll email you as soon as there’s an update.</p>}
      <Link className="dark-button" to="/dashboard">Back to my practice →</Link>
    </> : <>
      <p className="flow-intro">Your application is private until our team approves it. You can refine your public profile after approval.</p>
      <form onSubmit={submit}>
        {applicationFields.map(field => <label key={field.name}>{field.label}{field.required && ' *'}{field.type === 'textarea' ? <textarea required name={field.name} placeholder={field.placeholder} defaultValue={existing?.[field.name] ? String(existing[field.name]) : ''} /> : <input required={field.required !== false} name={field.name} type={field.type || 'text'} placeholder={field.placeholder} defaultValue={existing?.[field.name] ? String(existing[field.name]) : ''} />}</label>)}
        <div className="two-fields"><label>Primary city<input required name="city" placeholder="Lagos, Nigeria" defaultValue={existing?.city || ''} /></label><label>Established<input required name="founded_year" type="number" placeholder="2014" defaultValue={existing?.founded_year ? String(existing.founded_year) : ''} /></label></div>
        <label>What makes your work distinct?<textarea required name="bio" placeholder="Tell clients about your design perspective, craft and values…" defaultValue={existing?.bio || ''} /></label>
        <label>Main speciality<input required name="specialty" placeholder="Residential, interiors, hospitality…" defaultValue={existing?.specialty || ''} /></label>
        <label>Where do you work?<input required name="service_regions" placeholder="Nigeria, West Africa, remote…" defaultValue={existing?.service_regions || ''} /></label>
        <div className="two-fields"><label>Typical project budget<input required name="budget_range" placeholder="₦50m – ₦200m" defaultValue={existing?.budget_range || ''} /></label><label>Availability<input required name="availability_note" placeholder="Accepting from November" defaultValue={existing?.availability_note || ''} /></label></div>
        {error && <p className="form-error">{error}</p>}
        <button className="dark-button" disabled={busy}>{busy ? 'Submitting…' : existing ? 'Resubmit for review →' : 'Submit for review →'}</button>
      </form>
    </>}</section></main>;
}

export function ProjectStart() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (session && profile?.role === 'architect') navigate('/dashboard', { replace: true }); }, [session, profile, navigate]);
  if (!session) return <Account next="/start-project" initialRole="client" initialMode="signup" />;
  if (profile?.role === 'architect') return null;
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const f = new FormData(e.currentTarget);
    try {
      await database.insert('project_briefs', { client_id: session.user.id, project_type: String(f.get('project_type')), location: String(f.get('location')), budget_range: String(f.get('budget_range')), timeline: String(f.get('timeline')), notes: String(f.get('notes')) }, session.access_token);
      navigate('/brief-received');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your brief.');
    } finally {
      setBusy(false);
    }
  };
  return <main className="account-flow application"><Link className="logo" to="/">form<span>line</span></Link><section><p className="mono">[ START A PROJECT ]</p><h1>What are you<br /><em>hoping to make?</em></h1><p className="flow-intro">Share the essentials. You can send this brief to architects you love, or keep it to guide a consultation later.</p><form onSubmit={submit}><label>What are you planning?<input required name="project_type" placeholder="New home, renovation, hospitality space…" /></label><div className="two-fields"><label>Project location<input required name="location" placeholder="City or neighbourhood" /></label><label>Indicative budget<input name="budget_range" placeholder="Your comfortable range" /></label></div><label>Ideal timeline<input name="timeline" placeholder="When would you like to begin?" /></label><label>Tell us what matters most<textarea required name="notes" placeholder="Your site, way of living, inspiration and practical needs…" /></label>{error && <p className="form-error">{error}</p>}<button className="dark-button" disabled={busy}>{busy ? 'Saving…' : 'Save my brief →'}</button></form></section></main>;
}

export function Received({ type }: { type: 'application' | 'brief' }) {
  return <main className="account-flow received"><Link className="logo" to="/">form<span>line</span></Link><section><p className="mono">[ {type === 'application' ? 'APPLICATION RECEIVED' : 'BRIEF SAVED'} ]</p><h1>{type === 'application' ? <>We’ll take a<br /><em>thoughtful look.</em></> : <>A good<br /><em>beginning.</em></>}</h1><p className="flow-intro">{type === 'application' ? 'Your practice is now with the Formline team for review. We’ll email you when we have an update.' : 'Your project brief has been saved. Browse verified studios and request a consultation when the fit feels right.'}</p><Link className="dark-button" to={type === 'application' ? '/dashboard' : '/architects'}>{type === 'application' ? 'My workspace' : 'Explore architects'} →</Link></section></main>;
}