import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Cpu, Network, MapPin } from 'lucide-react';

function useInView(threshold = 0.12) {
  const ref  = useRef<HTMLElement | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis] as const;
}

const CARDS = [
  { icon: GraduationCap, label: 'Education',          value: 'Asia Pacific University', sub: 'Computer Science · AI Track',          accent:'var(--accent)' },
  { icon: Cpu,           label: 'Specialization',     value: 'Multi-Agent AI Systems',  sub: 'LLM Integration & Orchestration',     accent:'rgba(255,255,255,0.75)' },
  { icon: Network,       label: 'Architecture Focus', value: 'Distributed AI Pipelines',sub: 'FastAPI · React · CrewAI · Ollama',   accent:'rgba(255,255,255,0.75)' },
];

export default function About() {
  const [ref, vis] = useInView(0.1);

  return (
    <section
      id="about"
      ref={ref as any}
      className={`reveal ${vis ? 'visible' : ''}`}
      style={{ padding:'clamp(72px,10vw,130px) 0', position:'relative', zIndex:2 }}
    >
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(16px, 4vw, 28px)' }}>

        {/* Label */}
        <div className="section-label">
          <span className="label-text">// About</span>
        </div>

        <div className="about-grid" style={{ display:'grid', alignItems:'start' }}>

          {/* Left – prose */}
          <div>
            <h2 style={{ fontSize:'clamp(1.9rem,3.8vw,3rem)', fontWeight:700, color:'var(--foreground)', letterSpacing:'-0.025em', lineHeight:1.1, marginBottom:30 }}>
              Building AI systems that{' '}
              <span style={{ color:'var(--accent)' }}>think</span>,{' '}
              <span style={{ color:'rgba(255,255,255,0.85)' }}>coordinate</span>, and{' '}
              <span style={{ color:'rgba(255,255,255,0.85)' }}>act</span>.
            </h2>

            {[
              <>I'm an AI Systems Developer studying at{' '}
                <span style={{ color:'rgba(255,255,255,0.86)' }}>Asia Pacific University (APU)</span>, specialising in
                multi-agent AI architectures, LLM integration, and production-grade intelligent systems.</>,
              <>My work lives at the intersection of{' '}
                <span style={{ color:'rgba(255,255,255,0.86)' }}>distributed AI coordination</span>,{' '}
                <span style={{ color:'rgba(255,255,255,0.86)' }}>real-time data pipelines</span>, and{' '}
                <span style={{ color:'rgba(255,255,255,0.86)' }}>full-stack engineering</span>. I don't just fine-tune models —
                I architect the systems around them: agents that coordinate without central controllers,
                pipelines that preprocess raw data into LLM-ready context, and backends that serve predictions at scale.</>,
              <><em>Driven by the belief that the next generation of software isn't just using AI — it <strong style={{ color:'rgba(255,255,255,0.86)' }}>is</strong> AI.</em></>,
            ].map((p, i) => (
              <p key={i} style={{ fontSize:'0.94rem', lineHeight:1.9, color:'var(--foreground-muted)', marginBottom:18 }}>{p}</p>
            ))}

            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10 }}>
              <MapPin size={12} style={{ color:'var(--accent)', flexShrink:0 }} />
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'var(--foreground-muted)', letterSpacing:'0.08em' }}>
                Malaysia · Asia Pacific University
              </span>
            </div>
          </div>

          {/* Right – cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {CARDS.map(({ icon: Icon, label, value, sub, accent }) => (
              <div key={label} className="holo-card" style={{ padding:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:9 }}>
                  <Icon size={14} style={{ color: accent }} />
                  <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'rgba(255,255,255,0.60)', letterSpacing:'0.22em', textTransform:'uppercase' }}>{label}</span>
                </div>
                <p style={{ fontSize:'1.02rem', fontWeight:650, letterSpacing:'-0.02em', color:'var(--foreground)', marginBottom:6, lineHeight:1.2 }}>{value}</p>
                <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:14, color:'rgba(255,255,255,0.68)', lineHeight:1.5 }}>{sub}</p>
              </div>
            ))}

            {/* Mission block (styled like the cards above) */}
            <div className="holo-card" style={{ padding:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:9 }}>
                <Cpu size={14} style={{ color: 'var(--accent)' }} />
                <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'rgba(255,255,255,0.60)', letterSpacing:'0.22em', textTransform:'uppercase' }}>
                  Focus
                </span>
              </div>
              <p style={{ fontSize:'1.02rem', fontWeight:650, letterSpacing:'-0.02em', color:'var(--foreground)', marginBottom:6, lineHeight:1.2 }}>
                Building systems that reason
              </p>
              <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:14, color:'rgba(255,255,255,0.68)', lineHeight:1.5 }}>
                Agent orchestration, retrieval pipelines, and production-grade AI infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
