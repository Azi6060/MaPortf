import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const NAV = ['About','Skills','Projects','Contact'];

export default function Footer() {
  return (
    <footer style={{
      position:'relative', zIndex:2,
      borderTop:'1px solid rgba(255,255,255,0.06)',
      background:'rgba(2,2,3,0.82)',
      padding:'64px 0 36px',
    }}>
      {/* Top gradient line */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:1,
        background:'linear-gradient(to right,transparent,rgba(255,255,255,0.12),rgba(94,106,210,0.30),rgba(255,255,255,0.12),transparent)',
      }} />

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', gap:48, marginBottom:52 }}>

          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <div style={{
                width:32, height:32, flexShrink:0,
                background:'linear-gradient(135deg, rgba(94,106,210,1), rgba(129,140,248,1))',
                clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 0 22px rgba(94,106,210,0.28)',
              }}>
                <span style={{ fontFamily:'Space Mono,monospace', fontSize:12, fontWeight:700, color:'#000' }}>A</span>
              </div>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:13, letterSpacing:'0.1em', color:'var(--foreground)' }}>
                AZIZ<span style={{ color:'var(--accent)' }}>.DEV</span>
              </span>
            </div>

            <p style={{ fontSize:'0.9rem', color:'var(--foreground-muted)', lineHeight:1.8, maxWidth:320, marginBottom:24 }}>
              AI Systems Developer building production-grade intelligent systems.
              Multi-agent architectures, LLM integration, full-stack AI.
            </p>

            <div style={{ display:'flex', gap:10 }}>
              {[
                { href:'https://github.com/Azi6060',                           Icon: Github,   accent:'#00D4FF' },
                { href:'https://www.linkedin.com/in/azizkhudzha-azizov',       Icon: Linkedin, accent:'#7C3AED' },
                { href:'mailto:azizkhuja2005@gmail.com',                       Icon: Mail,     accent:'#FF006E' },
              ].map(({ href, Icon, accent }) => (
                <a
                  key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{
                    width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center',
                    border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)',
                    color:'rgba(255,255,255,0.65)', transition:'all 220ms ease', textDecoration:'none',
                    borderRadius: 12,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color       = accent;
                    (e.currentTarget as HTMLElement).style.borderColor = `${accent}44`;
                    (e.currentTarget as HTMLElement).style.background  = `${accent}0D`;
                    (e.currentTarget as HTMLElement).style.boxShadow   = `0 0 16px ${accent}22`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color       = '#52527A';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.background  = 'rgba(255,255,255,0.03)';
                    (e.currentTarget as HTMLElement).style.boxShadow   = 'none';
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'rgba(255,255,255,0.60)', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:20 }}>
              Navigation
            </h4>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {NAV.map(n => (
                <button
                  key={n}
                  onClick={() => scrollTo(n.toLowerCase())}
                  style={{
                    fontFamily:'Inter, system-ui, sans-serif', fontSize:13, color:'rgba(255,255,255,0.70)',
                    background:'none', border:'none', cursor:'pointer', padding:0,
                    textAlign:'left', transition:'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.92)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.70)'}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Contact block */}
          <div>
            <h4 style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'rgba(255,255,255,0.60)', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:20 }}>
              Contact
            </h4>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <a href="mailto:azizkhuja2005@gmail.com" style={{ fontFamily:'Inter, system-ui, sans-serif', fontSize:13, color:'rgba(255,255,255,0.70)', textDecoration:'none', transition:'color 220ms ease' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.92)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.70)'}
              >azizkhuja2005@gmail.com</a>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'var(--foreground-muted)' }}>Malaysia · UTC+8</span>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
                <span className="status-dot" style={{ width:6, height:6, background: 'var(--accent)', boxShadow: '0 0 18px rgba(94,106,210,0.45)' }} />
                <span style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:'var(--foreground-muted)' }}>Available for hire</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop:'1px solid rgba(255,255,255,0.04)', paddingTop:24,
          display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12,
        }}>
          <p style={{ fontFamily:'Space Mono,monospace', fontSize:12, color:'var(--foreground-muted)' }}>
            © {new Date().getFullYear()} Azizkhudzha Azizov — AI Systems Developer
          </p>
        </div>
      </div>
    </footer>
  );
}
