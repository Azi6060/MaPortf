import React, { useEffect, useRef, useState } from 'react';

function useInView(t = 0.1) {
  const ref = useRef<HTMLElement | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return [ref, vis] as const;
}

const CATS = [
  {
    prefix: '[DOMAIN]', label: 'Core Areas', accent: 'var(--accent)',
    items: ['Multi-Agent Systems','LLM Integration','AI Pipeline Design','ML Engineering','Distributed Systems','NLP & Transformers'],
    icon: '⬡',
  },
  {
    prefix: '[STACK]', label: 'Tech Stack', accent: 'rgba(255,255,255,0.70)',
    items: ['Python','React / TypeScript','FastAPI','Flask','PyTorch','Scikit-learn','HuggingFace','PostgreSQL'],
    icon: '◈',
  },
  {
    prefix: '[TOOLS]', label: 'Tools & Platforms', accent: 'rgba(255,255,255,0.70)',
    items: ['CrewAI','Ollama','LangChain','Docker','Git / GitHub','Linux / WSL2','VS Code','Postman'],
    icon: '◇',
  },
];

const BARS = [
  { name: 'Python & AI Frameworks',      pct: 90, accent: 'var(--accent)' },
  { name: 'LLM Integration & Prompting', pct: 87, accent: 'rgba(255,255,255,0.70)' },
  { name: 'Multi-Agent Architecture',    pct: 85, accent: 'var(--accent)' },
  { name: 'FastAPI / Backend',           pct: 82, accent: 'rgba(255,255,255,0.70)' },
  { name: 'React / TypeScript',          pct: 80, accent: 'rgba(255,255,255,0.70)' },
  { name: 'ML / Data Science',           pct: 78, accent: 'rgba(255,255,255,0.70)' },
];

export default function Skills() {
  const [ref, vis] = useInView(0.08);

  return (
    <section
      id="skills"
      ref={ref as any}
      className={`reveal ${vis ? 'visible' : ''}`}
      style={{ padding:'clamp(72px,10vw,130px) 0', position:'relative', zIndex:2 }}
    >
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(16px, 4vw, 28px)' }}>

        <div className="section-label">
          <span className="label-text">// Skills</span>
        </div>

        <div style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:'clamp(2.0rem,3.8vw,3.0rem)', fontWeight:700, color:'var(--foreground)', letterSpacing:'-0.025em', marginBottom:10 }}>
            Technical Arsenal
          </h2>
          <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:16, color:'rgba(255,255,255,0.70)', letterSpacing:'-0.01em', lineHeight:1.6, maxWidth: 640 }}>
            Tools, frameworks, and domains I work in daily
          </p>
        </div>

        {/* Skill categories */}
        <div className="skills-categories-grid" style={{ display:'grid', gap:14, marginBottom:14 }}>
          {CATS.map(cat => (
            <div key={cat.label} className="holo-card" style={{ padding:'26px' }}>
              <div style={{ marginBottom:22, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <p style={{ fontFamily:'Space Mono,monospace', fontSize:9, color: cat.accent, letterSpacing:'0.25em', marginBottom:6 }}>{cat.prefix}</p>
                <h3 style={{ fontSize:'1.05rem', fontWeight:650, letterSpacing:'-0.02em', color:'var(--foreground)' }}>{cat.label}</h3>
              </div>
              <ul style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {cat.items.map(item => (
                  <li key={item} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ color: cat.accent, fontSize:10, fontFamily:'Space Mono,monospace', flexShrink:0, opacity:0.7 }}>{cat.icon}</span>
                    <span style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:14, color:'rgba(255,255,255,0.70)', letterSpacing:'-0.01em' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Proficiency bars */}
        <div className="holo-card" style={{ padding:'30px' }}>
          <p style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'rgba(255,255,255,0.65)', letterSpacing:'0.25em', marginBottom:28 }}>[PROFICIENCY]</p>
          <div className="skills-bars-grid" style={{ display:'grid', gap:'16px 60px' }}>
            {BARS.map(b => (
              <div key={b.name}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                  <span style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:14, color:'rgba(255,255,255,0.70)' }}>{b.name}</span>
                  <span style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:14, color: 'rgba(255,255,255,0.78)' }}>{b.pct}%</span>
                </div>
                <div style={{ height:2, background:'rgba(255,255,255,0.05)', borderRadius:1, overflow:'hidden' }}>
                  <div
                    style={{
                      height:'100%',
                      width: vis ? `${b.pct}%` : '0%',
                      background: `linear-gradient(to right, ${b.accent}, rgba(94,106,210,0.22))`,
                      transition: vis ? 'width 1.5s cubic-bezier(0.16,1,0.3,1)' : 'none',
                      boxShadow: `0 0 12px rgba(94,106,210,0.25)`,
                      borderRadius:1,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
