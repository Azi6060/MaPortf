import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

function useInView(t = 0.08) {
  const ref = useRef<HTMLElement | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return [ref, vis] as const;
}

const ACCENTS = ['var(--accent)', 'rgba(255,255,255,0.75)', 'rgba(255,255,255,0.75)'];

const PROJECTS = [
  {
    title:       'InsightFlow — Enterprise Intelligence Platform',
    subtitle:    'Full-Stack AI · Analytics · ML',
    description: 'A Bloomberg-style AI-powered platform for real-time analytics and decision-making.',
    details: [
      'Multi-agent AI pipeline using CrewAI and local LLMs (Mistral via Ollama)',
      'Data preprocessing system transforming raw datasets into LLM-ready context',
      'ML revenue prediction engine using Gradient Boosting (Scikit-learn)',
      'Full-stack architecture: React frontend + FastAPI async backend',
      'Real-time dashboards with live data across multiple business datasets',
    ],
    tags: ['Python','FastAPI','React','CrewAI','Ollama','Scikit-learn'],
    url: 'https://github.com/Azi6060/insightflow.git',
  },
  {
    title:       'Swarm Rescue v2 — Decentralised Multi-Agent Drone System',
    subtitle:    'Distributed Systems · Swarm AI · Simulation',
    description: 'A decentralised swarm intelligence system with no central controller.',
    details: [
      'Peer-to-peer agent coordination — zero single point of failure',
      'Self-healing architecture with automatic task redistribution on agent loss',
      'FastAPI backend powering real-time simulation and state management',
      'Natural-language control interface via LLM APIs for operator commands',
      'MCP-based AI-to-agent communication protocol for structured messaging',
    ],
    tags: ['Python','FastAPI','Distributed Systems','AI Agents','MCP'],
    url: 'https://github.com/Azi6060/DSI-Decentralised-Swarm-Intelligence-.git',
  },
  {
    title:       'AI-Generated Text Detection System',
    subtitle:    'NLP · Transformers · Classification',
    description: 'A web system for detecting AI-generated content using NLP and transformer models.',
    details: [
      'RoBERTa-based text classification with fine-tuned transformer layers',
      'Ensemble prediction pipeline combining multiple model outputs for higher accuracy',
      'Flask web application with clean API endpoints for batch inference',
      'Full NLP preprocessing pipeline: tokenisation, normalisation, feature extraction',
    ],
    tags: ['Python','Flask','PyTorch','HuggingFace','RoBERTa'],
    url: 'https://github.com/Azi6060',
  },
];

interface CardProps {
  project: typeof PROJECTS[0];
  index:   number;
  delay:   number;
  visible: boolean;
}

function ProjectCard({ project, index, delay, visible }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const accent  = ACCENTS[index % 3];

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current; if (!card) return;
    const r  = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);

    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    card.style.transform = `perspective(1000px) rotateY(${dx * 7}deg) rotateX(${-dy * 7}deg) translateZ(8px)`;
  }, []);

  const onLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
      className="holo-card"
      style={{
        padding: 28,
        cursor: 'pointer',
        transitionDelay: `${delay}ms`,
        opacity:   visible ? 1 : 0,
        transform: visible ? undefined : 'translateY(40px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease, box-shadow 0.35s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <span style={{ fontFamily:'Space Mono,monospace', fontSize:11, color: accent, letterSpacing:'0.2em', opacity:0.7 }}>
          [{String(index + 1).padStart(2, '0')}]
        </span>
        <a
          href={project.url} target="_blank" rel="noopener noreferrer"
          style={{ color:'#52527A', transition:'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = accent}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#52527A'}
        >
          <ExternalLink size={14} />
        </a>
      </div>

      <h3 style={{ fontSize:'1.02rem', fontWeight:650, color:'var(--foreground)', lineHeight:1.35, marginBottom:7 }}>
        {project.title}
      </h3>

      <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:13, color: 'rgba(255,255,255,0.70)', letterSpacing:'-0.01em', textTransform:'none', marginBottom:12 }}>
        {project.subtitle}
      </p>

      <p style={{ fontSize:'0.92rem', color:'var(--foreground-muted)', lineHeight:1.75, marginBottom:16 }}>
        {project.description}
      </p>

      <ul style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:22, flex:1 }}>
        {project.details.map((d, i) => (
          <li key={i} style={{ display:'flex', gap:10, fontSize:'0.86rem', color:'rgba(255,255,255,0.66)', lineHeight:1.6 }}>
            <span style={{ color: accent, flexShrink:0, marginTop:1 }}>›</span>
            {d}
          </li>
        ))}
      </ul>

      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {project.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
      </div>

      {/* Bottom accent line */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:2,
        background:`linear-gradient(to right,transparent,rgba(94,106,210,0.55),transparent)`,
        opacity:0.45,
      }} />
    </div>
  );
}

export default function Projects() {
  const [ref, vis] = useInView(0.06);

  return (
    <section
      id="projects"
      ref={ref as any}
      className={`reveal ${vis ? 'visible' : ''}`}
      style={{ padding:'clamp(72px,10vw,130px) 0', position:'relative', zIndex:2 }}
    >
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(16px, 4vw, 28px)' }}>

        <div className="section-label">
          <span className="label-text">// Projects</span>
        </div>

        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16, marginBottom:48, flexWrap:'wrap' }}>
          <div>
            <h2 style={{ fontSize:'clamp(2.0rem,3.8vw,3.2rem)', fontWeight:700, color:'var(--foreground)', letterSpacing:'-0.025em', marginBottom:10 }}>
              Systems I've Built
            </h2>
            <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:15, color:'rgba(255,255,255,0.68)', maxWidth: 520 }}>
              Production-grade AI architectures · Not toy demos
            </p>
          </div>
          <a
            href="https://github.com/Azi6060" target="_blank" rel="noopener noreferrer"
            className="btn-outline"
            style={{ padding: '12px 18px', fontSize: 14 }}
          >
            View All on GitHub ↗
          </a>
        </div>

        {/* Featured – full width */}
        <div style={{ marginBottom:14 }}>
          <ProjectCard project={PROJECTS[0]} index={0} delay={0} visible={vis} />
        </div>

        {/* Rest – one per line (readability first) */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:14 }}>
          {PROJECTS.slice(1).map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i + 1} delay={(i + 1) * 120} visible={vis} />
          ))}
        </div>
      </div>
    </section>
  );
}
