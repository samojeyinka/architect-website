import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
const menu=[{label:'Architects',to:'/architects'},{label:'About',to:'/about'},{label:'For architects',to:'/apply'}];
const flatPages=['/dashboard','/account','/apply','/start-project','/consult','/application-received','/brief-received'];
export function Layout({children}:{children:ReactNode}) {
  const [open,setOpen]=useState(false);
  const navigate=useNavigate();
  const {pathname}=useLocation();
  const {session,profile,signOut}=useAuth();
  const firstName=(profile?.full_name||session?.user.email||'').split(/[@\s]/)[0].trim();
  const role=profile?.role;
  const dashboardLabel=role==='architect'?'My practice':'My account';
  const cta=session&&role?{label:role==='architect'?'Your workspace':'Start a project',to:role==='architect'?'/dashboard':'/start-project'}:{label:'Start a project',to:'/start-project'};
  const links=[...menu,...(session&&profile?[{label:dashboardLabel,to:'/dashboard'}]:[])];
  const signOutAll=async()=>{await signOut();navigate('/');};
  const isFlat=flatPages.some(p=>pathname.startsWith(p));
  useEffect(() => {
    if (isFlat) return;
    const nav=document.querySelector('.site-nav');
    if(!nav)return;
    let last=window.scrollY;
    let idleTimer:number|undefined;
    const update=()=>{
      const y=window.scrollY;
      const goingDown=y>last+2;
      const nearTop=y<120;
      nav.classList.toggle('nav-hidden', !nearTop && goingDown);
      last=y;
      window.clearTimeout(idleTimer);
      idleTimer=window.setTimeout(()=>{nav.classList.remove('nav-hidden');},260);
    };
    update();
    window.addEventListener('scroll', update, {passive:true});
    return ()=>{window.clearTimeout(idleTimer);window.removeEventListener('scroll', update);};
  }, [isFlat]);
  return <><nav className={`site-nav${isFlat?' site-nav-flat':''}`}><Link to="/" className="logo">arco<span>nnet</span></Link><div className="nav-links">{links.map(link=><Link key={link.label} to={link.to}>{link.label}</Link>)}</div><div className="nav-actions">{session&&profile?<span className="nav-user" title={`Signed in as ${role}`}><span className="nav-user-dot"/>Signed in · {firstName||'you'}</span>:<Link to="/account">My account</Link>}<Link to={cta.to} className="nav-cta">{cta.label} <ArrowUpRight size={15}/></Link>{session&&<button className="nav-signout" onClick={signOutAll}>Sign out</button>}<button className="menu-button" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={18}/></button></div></nav>{open&&<div className="mobile-menu"><button onClick={()=>setOpen(false)} aria-label="Close menu"><X/></button>{links.map(link=><Link key={link.label} onClick={()=>setOpen(false)} to={link.to}>{link.label}</Link>)}{session?<><span className="nav-user"><span className="nav-user-dot"/>Signed in · {firstName||'you'}</span><button onClick={signOutAll}>Sign out</button></>:<Link onClick={()=>setOpen(false)} to="/account">My account</Link>}<Link onClick={()=>setOpen(false)} to={cta.to}>{cta.label}</Link></div>}{children}<footer><div><Link to="/" className="logo">arco<span>nnet</span></Link><small>© 2026 ARCONNET</small></div></footer></>
}