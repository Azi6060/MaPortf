import React, { useEffect, useRef, useState } from 'react';

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

const CERT_GROUPS = [
  {
    issuer: 'IBM',
    accent: 'var(--accent)',
    prefix: '[IBM]',
    certs: [
      { name: 'AI Engineering Professional Certificate', note: '13-course series · ML · Deep Learning · GenAI · LLMs' },
      { name: 'Generative AI Language Modeling with Transformers' },
      { name: 'Generative AI Engineering & Fine-Tuning Transformers' },
      { name: 'Advanced Fine-Tuning for LLMs' },
      { name: 'Foundational Models for NLP' },
      { name: 'LLM Architecture & Data Preparation' },
      { name: 'Deep Learning with PyTorch' },
      { name: 'AI Capstone Project with Deep Learning' },
      { name: 'Fundamentals of AI Agents using RAG & LangChain' },
    ],
  },
  {
    issuer: 'AWS',
    accent: 'rgba(255,255,255,0.70)',
    prefix: '[AWS]',
    certs: [
      { name: 'AWS Cloud Quest – Cloud Practitioner' },
      { name: 'AWS Academy – ML Foundations' },
      { name: 'AWS Academy – Generative AI Foundations' },
      { name: 'AWS Academy – NLP' },
    ],
  },
  {
    issuer: 'Red Hat',
    accent: 'rgba(255,255,255,0.70)',
    prefix: '[REDHAT]',
    certs: [
      { name: 'System Administration I (RH124)' },
    ],
  },
];

export default function Certifications() {
  const [ref, vis] = useInView(0.06);

  return (
    <section
      id="certifications"
      ref={ref as any}
      className={`reveal ${vis ? 'visible' : ''}`}
      style={{ padding: 'clamp(72px,10vw,130px) 0', position: 'relative', zIndex: 2 }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px, 4vw, 28px)' }}>

        <div className="section-label">
          <span className="label-text">// Certifications</span>
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(2.0rem,3.8vw,3.0rem)', fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.025em', marginBottom: 10 }}>
            Credentials & Certifications
          </h2>
          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.70)', letterSpacing: '-0.01em', lineHeight: 1.6, maxWidth: 560 }}>
            Industry-recognised certifications across AI engineering, cloud, and systems
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 14,
          }}
        >
          {CERT_GROUPS.map((group, gi) => (
            <div
              key={group.issuer}
              className="holo-card"
              style={{
                padding: '26px',
                opacity: vis ? 1 : 0,
                transform: vis ? 'none' : 'translateY(32px)',
                transition: `opacity 0.7s ease ${gi * 120}ms, transform 0.7s ease ${gi * 120}ms`,
              }}
            >
              {/* Group header */}
              <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: group.accent, letterSpacing: '0.25em', marginBottom: 6 }}>
                  {group.prefix}
                </p>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 650, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
                  {group.issuer}
                </h3>
              </div>

              {/* Certs list */}
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {group.certs.map((cert) => (
                  <li key={cert.name} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ color: group.accent, fontSize: 10, fontFamily: 'Space Mono,monospace', flexShrink: 0, marginTop: 3, opacity: 0.7 }}>◈</span>
                    <div>
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13.5, color: 'rgba(255,255,255,0.78)', letterSpacing: '-0.01em', lineHeight: 1.5 }}>
                        {cert.name}
                      </span>
                      {'note' in cert && cert.note && (
                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.40)', marginTop: 2, lineHeight: 1.4 }}>
                          {cert.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
