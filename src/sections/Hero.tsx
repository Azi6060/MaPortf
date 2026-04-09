import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

const ROLES = [
  'AI Systems Developer',
  'Multi-Agent Engineer',
  'LLM Integration Specialist',
  'Full-Stack AI Developer',
];

function Typewriter() {
  const [text,     setText]     = useState('');
  const [roleIdx,  setRoleIdx]  = useState(0);
  const [charIdx,  setCharIdx]  = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const role = ROLES[roleIdx];
    let t: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < role.length) {
      t = setTimeout(() => { setText(role.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, 58);
    } else if (!deleting && charIdx === role.length) {
      t = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIdx > 0) {
      t = setTimeout(() => { setText(role.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, 30);
    } else {
      setDeleting(false);
      setRoleIdx(i => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(t);
  }, [charIdx, deleting, roleIdx]);

  return (
    <span style={{ fontFamily: 'Space Mono,monospace', color: 'var(--accent)', fontSize:'1.05rem', letterSpacing:'0.04em' }}>
      &gt;&nbsp;{text}
      <span style={{ animation:'blink 1s step-end infinite', color:'var(--accent)' }}>█</span>
    </span>
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [isShort, setIsShort] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(max-height: 780px)');
    if (mq) {
      const update = () => setIsShort(mq.matches);
      update();
      mq.addEventListener?.('change', update);
      return () => mq.removeEventListener?.('change', update);
    }
    return;
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) return;

    const onScroll = () => {
      const y = window.scrollY;
      const t = Math.min(1, y / (window.innerHeight * 0.55));
      const heroY = Math.round(t * 100);
      const heroScale = (1 - t * 0.05).toFixed(4);
      const heroOpacity = (1 - t * 1.0).toFixed(4);
      el.style.setProperty('--hero-y', `${heroY}px`);
      el.style.setProperty('--hero-scale', `${heroScale}`);
      el.style.setProperty('--hero-opacity', `${heroOpacity}`);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={rootRef as any}
      id="hero"
      className="grid-bg"
      style={{
        minHeight:'100svh',
        display:'flex',
        alignItems:'center',
        position:'relative',
        zIndex:2,
        paddingTop: 88,
        paddingBottom: 64,
      }}
    >

      <div className="hero-parallax" style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px', width:'100%' }}>

        {/* Status badge */}
        <div
          style={{
            display:'inline-flex',
            alignItems:'center',
            gap:10,
            border:'1px solid rgba(255,255,255,0.10)',
            background:'linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
            padding:'10px 14px',
            marginBottom:28,
            fontFamily:'Inter, system-ui, sans-serif',
            fontSize:13,
            fontWeight:500,
            color:'rgba(255,255,255,0.76)',
            letterSpacing:'-0.01em',
            borderRadius: 999,
            boxShadow:'0 0 0 1px rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.35)',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: 'rgba(94,106,210,0.85)',
              boxShadow: '0 0 0 3px rgba(94,106,210,0.16)',
            }}
          />
          <span>
            Open to roles <span style={{ opacity: 0.6 }}>—</span> Asia Pacific University <span style={{ opacity: 0.6 }}>·</span> Malaysia
          </span>
        </div>

        {/* Name — glitch */}
        <h1 style={{ fontSize:'clamp(3.0rem,9.5vw,6.6rem)', fontWeight:700, lineHeight:0.92, letterSpacing:'-0.03em', marginBottom:12, color:'var(--foreground)' }}>
          <span
            className="glitch"
            data-text="Azizkhudzha"
            style={{ display:'block' }}
          >
            Azizkhudzha
          </span>
          <span className="grad-text" style={{ display:'block' }}>
            Azizov
          </span>
        </h1>

        {/* Typewriter */}
        <div style={{ height:32, display:'flex', alignItems:'center', marginBottom:18 }}>
          <Typewriter />
        </div>

        {/* Tagline */}
        <p style={{ maxWidth:680, fontSize: isShort ? '0.98rem' : '1.02rem', lineHeight:1.78, color:'var(--foreground-muted)', marginBottom:18 }}>
          Building intelligent systems at the intersection of{' '}
          <span style={{ color:'rgba(255,255,255,0.86)' }}>multi-agent AI</span>,{' '}
          <span style={{ color:'rgba(255,255,255,0.86)' }}>LLM orchestration</span>, and{' '}
          <span style={{ color:'rgba(255,255,255,0.86)' }}>full-stack engineering</span>.
          Architecting production-grade pipelines that think, coordinate, and act.
        </p>

        {/* Stats (moved up + larger) */}
        <div
          style={{
            display:'grid',
            gridTemplateColumns:'repeat(2, minmax(0, 1fr))',
            gap: 12,
            maxWidth: 680,
            marginBottom: 18,
          }}
        >
          {[
            { v:'3+',  l:'AI systems shipped' },
            { v:'Multi‑agent', l:'architecture focus' },
            { v:'LLM', l:'integration & orchestration' },
            { v:'APU', l:'CS · AI track' },
          ].map((s, i) => (
            <div
              key={s.l}
              className="holo-card"
              style={{
                padding: isShort ? 13 : 14,
                display:'flex',
                flexDirection:'column',
                gap: 6,
              }}
            >
              <div
                style={{
                  fontSize: isShort ? '1.05rem' : '1.1rem',
                  fontWeight:650,
                  letterSpacing:'-0.02em',
                  color:'var(--foreground)',
                  lineHeight: 1.05,
                }}
              >
                <span style={{ color: i === 0 ? 'var(--accent)' : 'var(--foreground)' }}>{s.v}</span>
              </div>
              <div style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize: isShort ? 12 : 13, color:'rgba(255,255,255,0.68)', lineHeight: 1.3 }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom: 0 }}>
          <button
            className="btn-primary"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior:'smooth' })}
          >
            View Projects <ArrowRight size={13} />
          </button>
          <a
            href="https://github.com/Azi6060"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            GitHub ↗
          </a>
          <button
            className="btn-outline"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior:'smooth' })}
          >
            Contact Me
          </button>
        </div>

        {/* Removed old tiny stats row (replaced above) */}
      </div>

      {/* Scroll cue */}
      <div style={{
        position:'absolute', bottom:22, left:'50%', transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:8, color:'rgba(255,255,255,0.55)',
      }}>
        <span style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:12, letterSpacing:'-0.01em' }}>Scroll</span>
        <ChevronDown size={14} style={{ animation:'float-y 2s ease-in-out infinite' }} />
      </div>
    </section>
  );
}
