import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
    if (reduceMotion || coarsePointer) return;

    let mx = 0, my = 0, rx = 0, ry = 0, raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.current!.style.left = mx + 'px';
      dot.current!.style.top  = my + 'px';
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      rx = lerp(rx, mx, 0.1);
      ry = lerp(ry, my, 0.1);
      ring.current!.style.left = rx + 'px';
      ring.current!.style.top  = ry + 'px';
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    tick();
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dot}  className="cursor-dot"  />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}
