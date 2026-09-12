import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
const menu=[{label:'Architects',to:'/architects'},{label:'For architects',to:'/apply'}];
export function Layout({children}:{children:ReactNode}) {
  const [open,setOpen]=useState(false);
  const navigate=useNavigate();
  const {session,profile,signOut}=useAuth();
  const firstName=(profile?.full_name||session?.user.email||'').split(/[@\s]/)[0].trim();
  const role=profile?.role;
  const dashboardLabel=role==='architect'?'My practice':'My account';
  const cta=session&&role?{label:role==='architect'?'Your workspace':'Start a project',to:role==='architect'?'/dashboard':'/start-project'}:{label:'Start a project',to:'/start-project'};
  const links=[...menu,...(session&&profile?[{label:dashboardLabel,to:'/dashboard'}]:[])];
  const signOutAll=async()=>{await signOut();navigate('/');};
  return <><nav className="site-nav"><Link to="/" className="logo">form<span>line</span></Link><div className="nav-links">{links.map(link=><Link key={link.label} to={link.to}>{link.label}</Link>)}</div><div className="nav-actions">{session&&profile?<span className="nav-user" title={`Signed in as ${role}`}><span className="nav-user-dot"/>Signed in · {firstName||'you'}</span>:<Link to="/account">My account</Link>}<Link to={cta.to} className="nav-cta">{cta.label} <ArrowUpRight size={15}/></Link>{session&&<button className="nav-signout" onClick={signOutAll}>Sign out</button>}<button className="menu-button" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={18}/></button></div></nav>{open&&<div className="mobile-menu"><button onClick={()=>setOpen(false)} aria-label="Close menu"><X/></button>{links.map(link=><Link key={link.label} onClick={()=>setOpen(false)} to={link.to}>{link.label}</Link>)}{session?<><span className="nav-user"><span className="nav-user-dot"/>Signed in · {firstName||'you'}</span><button onClick={signOutAll}>Sign out</button></>:<Link onClick={()=>setOpen(false)} to="/account">My account</Link>}<Link onClick={()=>setOpen(false)} to={cta.to}>{cta.label}</Link></div>}{children}<footer><div><Link to="/" className="logo">form<span>line</span></Link><small>© 2026 FORMLINE</small></div></footer></>
}