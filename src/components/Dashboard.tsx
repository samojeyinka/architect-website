import { useEffect, useState, type ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { database, type Session } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import './Dashboard.css';

type Profile = { id: string; full_name: string; role: 'client' | 'architect' | 'admin' };
type Brief = { id: string; project_type: string; location: string; budget_range: string | null; timeline: string | null; notes: string; created_at: string };
type Architect = { id: string; studio_name: string; city: string | null; specialty: string | null; bio: string | null; slug: string | null; application_status: string };
type Request = { id: string; status: string; created_at: string; architect_profiles?: { studio_name: string } | null; project_briefs?: { project_type: string } | null };

export function Dashboard() {
  const { session, profile, loading } = useAuth();
  if (loading) return <main className="workspace loading">Loading your workspace…</main>;
  if (!session || !profile) return <Navigate to="/account" replace />;
  return profile.role === 'admin' ? <AdminDashboard session={session} profile={profile} /> : profile.role === 'architect' ? <ArchitectDashboard session={session} profile={profile} /> : <ClientDashboard session={session} profile={profile} />;
}

function Shell({ children, profile, session }: { children: ReactNode; profile: Profile; session: Session }) {
  const { signOut } = useAuth();
  const signout = async () => { await signOut(); };
  return <main className="workspace"><header className="workspace-nav"><Link className="logo" to="/">form<span>line</span></Link><div><span className="role-label">{profile.role} workspace</span><button onClick={signout}>Sign out</button></div></header>{children}</main>;
}

function ClientDashboard({ profile, session }: { profile: Profile; session: Session }) {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  useEffect(() => {
    database.select<Brief>('project_briefs', `select=*&client_id=eq.${profile.id}&order=created_at.desc`, session.access_token).then(setBriefs);
    database.select<Request>('consultation_requests', `select=id,status,created_at,architect_profiles(studio_name),project_briefs(project_type)&client_id=eq.${profile.id}&order=created_at.desc`, session.access_token).then(setRequests);
  }, [profile.id, session.access_token]);
  return <Shell profile={profile} session={session}><section className="workspace-hero"><p className="mono">[ CLIENT WORKSPACE ]</p><h1>Welcome back,<br /><em>{profile.full_name?.split(' ')[0] || 'there'}.</em></h1><p>Keep your project thinking in one place, then introduce the right brief to the right practice.</p><Link className="dark-button" to="/start-project">Create a new brief →</Link></section><section className="workspace-grid"><div><div className="workspace-title"><h2>Your briefs</h2><Link to="/start-project">+ New brief</Link></div>{briefs.length ? <div className="brief-list">{briefs.map(brief => <article key={brief.id}><p className="mono">{brief.location}</p><h3>{brief.project_type}</h3><p>{brief.notes}</p><div><span>{brief.budget_range || 'Budget to be discussed'}</span><Link to={`/architects?brief=${brief.id}`}>Find an architect →</Link></div></article>)}</div> : <Empty title="Your first brief starts here." text="Add the project, place and priorities that matter to you." action="Create a brief" to="/start-project" />}</div><div><div className="workspace-title"><h2>Consultations</h2></div>{requests.length ? <div className="request-list">{requests.map(request => <article key={request.id}><span className={`status ${request.status}`}>{request.status.replace('_', ' ')}</span><h3>{request.architect_profiles?.studio_name || 'Architect'}</h3><p>For: {request.project_briefs?.project_type || 'your project'} · {new Date(request.created_at).toLocaleDateString()}</p></article>)}</div> : <Empty title="No consultations yet." text="When you request an introduction, it will appear here with its status." />}</div></section></Shell>;
}

function ArchitectDashboard({ profile, session }: { profile: Profile; session: Session }) {
  const [architect, setArchitect] = useState<Architect | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  useEffect(() => {
    database.select<Architect>('architect_profiles', `select=*&id=eq.${profile.id}`, session.access_token).then(rows => { setArchitect(rows[0] || null); if (rows[0]) database.select<Request>('consultation_requests', `select=id,status,created_at,project_briefs(project_type)&architect_id=eq.${profile.id}&order=created_at.desc`, session.access_token).then(setRequests); });
  }, [profile.id, session.access_token]);
  const status = architect?.application_status || 'draft';
  const editable = status === 'draft' || status === 'changes_requested';
  const locked = !editable;
  const heading = status === 'approved' ? 'Your profile is live.' : status === 'submitted' ? 'Your application is under review.' : status === 'changes_requested' ? 'Our team asked for a few changes.' : status === 'under_review' ? 'Your application is under review.' : 'Complete your application.';
  const copy = status === 'approved' ? 'Clients can now discover your practice in the Formline directory.' : locked ? 'This application is with the review team and cannot be edited until they respond.' : status === 'changes_requested' ? 'Review the notes and refine your application so it can move forward.' : 'Finish the essentials so the review team can get to know your practice.';
  return <Shell profile={profile} session={session}><section className="workspace-hero"><p className="mono">[ ARCHITECT WORKSPACE ]</p><h1>{architect?.studio_name || 'Your practice'}<br /><em>in progress.</em></h1><p>Manage your Formline application and consultations from one quiet, focused place.</p><span className={`status ${status}`}>{status.replace('_', ' ')}</span></section><section className="workspace-grid"><div><div className="workspace-title"><h2>Application</h2></div>{architect ? <article className="application-card"><h3>{heading}</h3><p>{copy}</p>{locked ? <><Link className="dark-button" to="/apply">View application →</Link>{status === 'approved' && <Link className="text-button" to="/architects">See your directory listing ↗</Link>}</> : <Link className="dark-button" to="/apply">{status === 'changes_requested' ? 'Address requested changes' : 'Continue application'} →</Link>}</article> : <Empty title="Start your application." text="Share your practice, perspective and working preferences for review." action="Apply as an architect" to="/apply" />}</div><div><div className="workspace-title"><h2>Consultation requests</h2></div>{requests.length ? <div className="request-list">{requests.map(request => <article key={request.id}><span className={`status ${request.status}`}>{request.status}</span><h3>{request.project_briefs?.project_type || 'Project brief'}</h3><p>A client is waiting for your response.</p></article>)}</div> : <Empty title="Nothing waiting yet." text="Approved profiles receive relevant client consultation requests here." />}</div></section></Shell>;
}

function AdminDashboard({ profile, session }: { profile: Profile; session: Session }) {
  const [applications, setApplications] = useState<Architect[]>([]);
  const [error, setError] = useState('');
  const load = () => database.select<Architect>('architect_profiles', 'select=*&application_status=in.(submitted,under_review,changes_requested)&order=submitted_at.asc', session.access_token).then(setApplications).catch(e => setError(e.message));
  useEffect(() => { load(); }, [session.access_token]);
  const update = async (id: string, status: string) => { await database.update('architect_profiles', `id=eq.${id}`, { application_status: status, reviewed_at: new Date().toISOString(), reviewed_by: profile.id }, session.access_token); load(); };
  return <Shell profile={profile} session={session}><section className="workspace-hero"><p className="mono">[ ADMIN ]</p><h1>Keep the<br /><em>standard clear.</em></h1><p>Review every architect application before it becomes visible in the Formline directory.</p></section><section className="admin-list"><div className="workspace-title"><h2>Review queue</h2><span>{applications.length} waiting</span></div>{error && <p className="form-error">{error}</p>}{applications.map(app => <article key={app.id}><div><p className="mono">{app.city || 'Location not added'} · {app.specialty || 'Speciality not added'}</p><h3>{app.studio_name}</h3><p>{app.bio || 'No practice statement yet.'}</p></div><div className="admin-actions"><button onClick={() => update(app.id, 'changes_requested')}>Request changes</button><button className="approve" onClick={() => update(app.id, 'approved')}>Approve</button></div></article>)}{!applications.length && !error && <Empty title="Your review queue is clear." text="New architect submissions will appear here." />}</section></Shell>;
}

function Empty({ title, text, action, to }: { title: string; text: string; action?: string; to?: string }) { return <article className="empty"><h3>{title}</h3><p>{text}</p>{action && to && <Link className="dark-button" to={to}>{action} →</Link>}</article>; }