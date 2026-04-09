import React from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import CustomCursor   from './components/CustomCursor';
import Navbar         from './components/Navbar';
import Footer         from './components/Footer';
import AIAssistant    from './components/AIAssistant';
import Hero           from './sections/Hero';
import About          from './sections/About';
import Skills         from './sections/Skills';
import Projects       from './sections/Projects';
import Contact        from './sections/Contact';

export default function App() {
  return (
    <div className="app-bg" style={{ minHeight: '100vh' }}>

      {/* Fixed bg layers */}
      <ParticleCanvas />
      <CustomCursor />

      {/* Plasma orbs — fixed, behind everything */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div
          className="plasma-orb"
          style={{
            width: 900, height: 1400,
            background: 'radial-gradient(circle at 30% 30%, rgba(94,106,210,0.25) 0%, transparent 60%)',
            top: '-520px', left: '10%',
          }}
        />
        <div
          className="plasma-orb"
          style={{
            width: 600, height: 800,
            background: 'radial-gradient(circle at 40% 40%, rgba(124,58,237,0.15) 0%, transparent 62%)',
            top: '18%', left: '-220px',
          }}
        />
        <div
          className="plasma-orb"
          style={{
            width: 500, height: 700,
            background: 'radial-gradient(circle at 60% 60%, rgba(99,102,241,0.12) 0%, transparent 62%)',
            top: '28%', right: '-220px',
          }}
        />
        <div
          className="plasma-orb"
          style={{
            width: 900, height: 700,
            background: 'radial-gradient(circle at 50% 50%, rgba(94,106,210,0.10) 0%, transparent 60%)',
            bottom: '-420px', left: '18%',
          }}
        />
      </div>

      {/* App shell */}
      <Navbar />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
