import React, { useEffect, useState } from 'react';

const NAV = [
  { id: 'about',           label: 'About'          },
  { id: 'skills',          label: 'Skills'         },
  { id: 'certifications',  label: 'Certifications' },
  { id: 'projects',        label: 'Projects'       },
  { id: 'contact',         label: 'Contact'        },
];

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    requestAnimationFrame(() => scrollTo(id));
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
      background:     scrolled ? 'rgba(5,5,6,0.85)' : 'transparent',
      borderBottom:   scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
    }}>
      {/* Top bar */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '16px clamp(16px, 4vw, 28px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <button onClick={() => handleNav('hero')} style={{
          display:'flex', alignItems:'center', gap:10,
          background:'none', border:'none', cursor:'pointer', padding: 0,
        }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, rgba(94,106,210,1), rgba(129,140,248,1))',
            clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(94,106,210,0.32)', flexShrink: 0,
          }}>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:13, fontWeight:700, color:'#000', lineHeight:1 }}>A</span>
          </div>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:13, letterSpacing:'0.1em', color:'var(--foreground)' }}>
            AZIZ<span style={{ color:'var(--accent)' }}>.DEV</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="navbar-links" style={{ alignItems:'center', gap:36 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => handleNav(n.id)} className="nav-link">{n.label}</button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '6px 12px',
            cursor: 'pointer', color: 'var(--foreground)',
            fontSize: 18, lineHeight: 1,
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}
        style={{
          flexDirection: 'column',
          background: 'rgba(5,5,6,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '8px 0 16px',
        }}
      >
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => handleNav(n.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--foreground)', textAlign: 'left',
              padding: '14px clamp(16px, 4vw, 28px)',
              fontSize: 16, width: '100%',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {n.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
