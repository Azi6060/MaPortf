import React, { useEffect, useState } from 'react';

const NAV = [
  { id: 'about',    label: 'About'    },
  { id: 'skills',   label: 'Skills'   },
  { id: 'projects', label: 'Projects' },
  { id: 'contact',  label: 'Contact'  },
];

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      style={{
        position:   'fixed',
        top: 0, left: 0, right: 0,
        zIndex:     100,
        padding:    '18px 0',
        transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
        background:    scrolled ? 'rgba(5,5,6,0.72)' : 'transparent',
        borderBottom:  scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <button onClick={() => scrollTo('hero')} style={{ display:'flex', alignItems:'center', gap:10, background:'none', border:'none', cursor:'pointer' }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, rgba(94,106,210,1), rgba(129,140,248,1))',
            clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(94,106,210,0.32)',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:13, fontWeight:700, color:'#000', lineHeight:1 }}>A</span>
          </div>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:13, letterSpacing:'0.1em', color:'var(--foreground)' }}>
            AZIZ<span style={{ color:'var(--accent)' }}>.DEV</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div style={{ display:'flex', alignItems:'center', gap:36 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => scrollTo(n.id)} className="nav-link">
              {n.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
