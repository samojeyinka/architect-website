import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { database } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Account } from './AccountFlows';
import './AccountFlows.css';
type Brief = { id: string; project_type: string; location: string };
type Architect = { id: string; studio_name: string; city: string | null; specialty: string | null; bio: string | null };

export function ConsultationRequest() {
  const { architectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselect = searchParams.get('brief') || '';
  const { session } = useAuth();
  const token = session?.access_token || '';
  const [architect, setArchitect] = useState<Architect | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [intent, setIntent] = useState(false);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [chosen, setChosen] = useState(preselect);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!architectId) return;
    database.select<Architect>('architect_profiles', `select=id,studio_name,city,specialty,bio&id=eq.${architectId}`, token)
      .then(rows => { if (!rows[0]) setNotFound(true); else setArchitect(rows[0]); })
      .catch(() => setNotFound(true));
    if (!session) return;
    setBriefs([]);
    setChosen(preselect);
    database.select<Brief>('project_briefs', `select=id,project_type,location&client_id=eq.${session.user.id}&order=created_at.desc`, session.access_token).then(rows => {
      setBriefs(rows);
      if (preselect && rows.some(b => b.id === preselect)) setChosen(preselect);
      else if (!preselect && rows.length && !chosen) setChosen(rows[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [architectId, token, preselect, session]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !architectId) return;
    setBusy(true);
    setError('');
    const f = new FormData(e.currentTarget);
    try {
      await database.insert('consultation_requests', { brief_id: String(f.get('brief_id')), architect_id: architectId, client_id: session.user.id, message: String(f.get('message')) || null }, session.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send this request.');
    } finally {
      setBusy(false);
    }
  };

  const guest = !session && !intent;

  if (!session && intent) return <Account next={`/consult/${architectId || ''}${preselect ? `?brief=${preselect}` : ''}`} initialRole="client" initialMode="signup" />;

  if (notFound && !architect) return <main className="account-flow application"><Link className="logo" to="/architects">arco<span>nnet</span></Link><section><p className="mono">[ NOT FOUND ]</p><h1>This practice<br /><em>isn’t here.</em></h1><p className="flow-intro">The studio you’re looking for may no longer be part of the Arconnet directory.</p><Link className="dark-button" to="/architects">Browse all architects →</Link></section></main>;

  return <main className="account-flow application"><Link className="logo" to="/architects">arco<span>nnet</span></Link>
    <section className="consult-profile">
      <a className="mono back" href="/architects">← ALL ARCHITECTS</a>
      <div className="consult-profile-body">
        <div><p className="mono">{architect?.city || 'Location coming soon'}{architect?.specialty ? ` · ${architect.specialty}` : ''}</p><h1>{architect?.studio_name || 'A thoughtful practice'}<br /><em>{architect ? 'at a glance.' : ''}</em></h1></div>
        <div className="consult-profile-bio"><p>{architect?.bio || 'A verified Arconnet practice, ready for considered new enquiries.'}</p>{architect && <span className="consult-verified"><span className="nav-user-dot" />Verified by Arconnet</span>}</div>
      </div>
      {guest ? <div className="consult-gate"><div><h3>Request a consultation with {architect?.studio_name || 'this studio'}.</h3><p>Sign in to your account, then send this studio one of your saved briefs — or write a fresh one.</p></div><button className="dark-button" onClick={() => setIntent(true)}>Sign in to request a consultation <ArrowUpRight size={15} /></button></div>
        : <form className="consult-form" onSubmit={submit}><p className="mono">[ REQUEST A CONSULTATION ]</p><h2>Send a thoughtful<br /><em>introduction.</em></h2>
          {!briefs.length ? <><p className="form-error">Create a project brief before requesting a consultation.</p><Link className="dark-button" to="/start-project">Create a brief →</Link></>
            : <><label>Choose a brief<span className="hint">You already have {briefs.length} saved brief{briefs.length === 1 ? '' : 's'} — go with one of these or add a new one.</span></label><div className="brief-options">{briefs.map(brief => <button type="button" key={brief.id} className={chosen === brief.id ? 'brief-option selected' : 'brief-option'} onClick={() => setChosen(brief.id)}><input type="radio" name="brief_id" value={brief.id} checked={chosen === brief.id} onChange={() => setChosen(brief.id)} /><span><b>{brief.project_type}</b><small>{brief.location}</small></span></button>)}</div><Link className="text-button" to="/start-project">or create a new brief →</Link><label>A short note to the studio <textarea name="message" placeholder="Why does this practice feel right for your project?" /></label>{error && <p className="form-error">{error}</p>}<button className="dark-button" disabled={busy || !chosen}>{busy ? 'Sending…' : 'Send consultation request →'}</button></>}
        </form>}
    </section></main>;
}