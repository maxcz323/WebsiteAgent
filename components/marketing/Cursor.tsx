'use client';

import { useEffect, useRef, useState } from 'react';

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -300, y: -300 });
  const cur     = useRef({ x: -300, y: -300 });
  const raf     = useRef<number | undefined>(undefined);
  const [scale, setScale]   = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
      }
      if (!visible) setVisible(true);
    };

    const onEnter = () => setScale(2.2);
    const onLeave = () => setScale(1);

    window.addEventListener('mousemove', onMove, { passive: true });

    const attach = () => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    const tick = () => {
      cur.current.x += (pos.current.x - cur.current.x) * 0.09;
      cur.current.y += (pos.current.y - cur.current.y) * 0.09;
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${cur.current.x}px,${cur.current.y}px) translate(-50%,-50%)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      mo.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Lagging ring */}
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9998,
        pointerEvents: 'none',
        width: '34px', height: '34px',
        borderRadius: '50%',
        border: '1.5px solid rgba(96,165,250,0.6)',
        opacity: visible ? 1 : 0,
        transform: `scale(${scale})`,
        transition: `opacity 0.3s, border-color 0.2s`,
        willChange: 'transform',
      }} />
      {/* Instant dot */}
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999,
        pointerEvents: 'none',
        width: '5px', height: '5px',
        borderRadius: '50%',
        background: '#60a5fa',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
        willChange: 'transform',
      }} />
    </>
  );
}
