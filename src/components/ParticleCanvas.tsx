import { useEffect, useRef } from 'react';

const COLORS = ['#5E6AD2', '#6872D9', '#818CF8'];

export default function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) return;

    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    type P = { x: number; y: number; vx: number; vy: number; r: number; color: string };
    let pts: P[] = [];

    const init = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.floor((canvas.width * canvas.height) / 16000);
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const n = pts.length;
      for (let i = 0; i < n; i++) {
        const p = pts[i];
        p.x = (p.x + p.vx + canvas.width)  % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;

        for (let j = i + 1; j < n; j++) {
          const q = pts[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(94,106,210,${(1 - d / 140) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + 'AA';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', init);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.26 }}
    />
  );
}
