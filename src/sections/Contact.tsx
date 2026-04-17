import React, { useEffect, useRef, useState } from 'react';
import { Mail, Github, Linkedin, Send, CheckCircle } from 'lucide-react';

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

const LINKS = [
  { icon: Mail,     label:'Email',    value:'azizkhuja2005@gmail.com',            href:'mailto:azizkhuja2005@gmail.com',                accent:'var(--accent)' },
  { icon: Github,   label:'GitHub',   value:'github.com/Azi6060',                 href:'https://github.com/Azi6060',                     accent:'rgba(255,255,255,0.75)' },
  { icon: Linkedin, label:'LinkedIn', value:'azizkhudzha-azizov',                 href:'https://www.linkedin.com/in/azizkhudzha-azizov', accent:'rgba(255,255,255,0.75)' },
];

export default function Contact() {
  const [ref, vis] = useInView(0.08);
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [sent, setSent] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 900px)');
    if (!mq) return;
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub  = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:azizkhuja2005@gmail.com?subject=${sub}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section
      id="contact"
      ref={ref as any}
      className={`reveal ${vis ? 'visible' : ''}`}
      style={{ padding:'clamp(72px,10vw,130px) 0', position:'relative', zIndex:2 }}
    >
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(16px, 4vw, 28px)' }}>

        <div className="section-label">
          <span className="label-text">// Contact</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:22, alignItems:'start' }}>

          {/* Header */}
          <div className="holo-card" style={{ padding: 22 }}>
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:700, color:'var(--foreground)', letterSpacing:'-0.025em', lineHeight:1.1, marginBottom:18 }}>
              Let's Build Something{' '}
              <span style={{ color:'var(--accent)' }}>Intelligent.</span>
            </h2>
            <p style={{ fontSize:'0.94rem', color:'var(--foreground-muted)', lineHeight:1.85, marginBottom:36 }}>
              Open to collaborations, internships, and full-time roles in AI systems engineering.
              If you're building something ambitious — I want to hear about it.
            </p>
          </div>

          {/* Grid: links + form */}
          <div style={{ display:'grid', gridTemplateColumns: isNarrow ? '1fr' : '1.25fr 2fr', gap:14, alignItems:'start' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {/* Contact links */}
              <div className="holo-card" style={{ padding: 18 }}>
                <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.72)', letterSpacing:'0.08em', marginBottom:14, textTransform:'uppercase' }}>[CONTACT]</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {LINKS.map(({ icon: Icon, label, value, href, accent }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="holo-card"
                      style={{
                        display:'flex',
                        alignItems:'center',
                        gap:14,
                        padding:'14px 16px',
                        textDecoration:'none',
                        transition:'all 0.3s',
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          display:'flex',
                          alignItems:'center',
                          justifyContent:'center',
                          border:`1px solid rgba(255,255,255,0.10)`,
                          background:`rgba(255,255,255,0.04)`,
                          flexShrink:0,
                          borderRadius: 12,
                          boxShadow: '0 0 0 1px rgba(255,255,255,0.04)',
                        }}
                      >
                        <Icon size={14} style={{ color: accent }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:13, color:'rgba(255,255,255,0.68)', letterSpacing:'-0.01em', marginBottom:2 }}>
                          {label}
                        </p>
                        <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:15, fontWeight:550, color:'rgba(255,255,255,0.86)', letterSpacing:'-0.01em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability (no dot) */}
              <div className="holo-card" style={{ padding: 18 }}>
                <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.72)', letterSpacing:'0.08em', marginBottom:10, textTransform:'uppercase' }}>[AVAILABILITY]</p>
                <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:15, color:'rgba(255,255,255,0.78)', lineHeight:1.6, margin:0 }}>
                  Typically replies within <span style={{ color:'rgba(255,255,255,0.92)' }}>24 hours</span>.
                </p>
                <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:14, color:'rgba(255,255,255,0.64)', lineHeight:1.6, marginTop:8 }}>
                  Open to internships, collaborations, and full‑time roles.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="holo-card" style={{ padding: 22 }}>
              <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.72)', letterSpacing:'0.08em', marginBottom:18, textTransform:'uppercase' }}>[SEND MESSAGE]</p>

            {sent ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 0', gap:14, textAlign:'center' }}>
                <CheckCircle size={42} style={{ color:'#00FF88' }} />
                <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:16, fontWeight:650, color:'var(--foreground)' }}>Message sent via mail client.</p>
                <p style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:14, color:'rgba(255,255,255,0.68)' }}>I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
                <div className="contact-name-email-grid" style={{ display:'grid', gap:16 }}>
                  {(['name','email'] as const).map(field => (
                    <div key={field}>
                      <label style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:13, color:'rgba(255,255,255,0.70)', letterSpacing:'-0.01em', display:'block', marginBottom:8 }}>
                        {field === 'name' ? 'Name' : 'Email'}
                      </label>
                      <input
                        required
                        type={field === 'email' ? 'email' : 'text'}
                        value={form[field]}
                        onChange={e => setForm({ ...form, [field]: e.target.value })}
                        placeholder={field === 'name' ? 'Your name' : 'your@email.com'}
                        className="input-neon"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:13, color:'rgba(255,255,255,0.70)', letterSpacing:'-0.01em', display:'block', marginBottom:8 }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project or opportunity..."
                    className="input-neon"
                    style={{ resize:'none' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Send Message <Send size={13} />
                </button>
              </form>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
