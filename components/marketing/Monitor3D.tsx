'use client';

import { useState, useEffect, useRef } from 'react';

export function Monitor3D() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number | undefined>(undefined);
  const targetRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      setMouse(prev => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.04,
        y: prev.y + (targetRef.current.y - prev.y) * 0.04,
      }));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const rx = (mouse.y - 0.5) * -16;
  const ry = (mouse.x - 0.5) * 18;

  return (
    <div className="relative w-full h-[540px] flex items-center justify-center select-none" style={{ userSelect: 'none' }}>
      {/* Floor glow */}
      <div style={{
        position: 'absolute', bottom: '55px', left: '50%',
        transform: 'translateX(-50%)',
        width: '320px', height: '60px',
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.4) 0%, transparent 70%)',
        filter: 'blur(22px)',
        pointerEvents: 'none',
      }} />

      {/* Floating wrapper */}
      <div style={{ animation: 'monitorFloat 5s ease-in-out infinite' }}>
        {/* Perspective container */}
        <div style={{ perspective: '1200px' }}>
          {/* Rotating group */}
          <div style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
            transition: 'transform 0.12s ease-out',
          }}>
            {/* Monitor body */}
            <div style={{
              width: '490px', height: '326px',
              background: 'linear-gradient(155deg, #1e2f50 0%, #0c1626 100%)',
              borderRadius: '16px',
              border: '1.5px solid rgba(100,149,255,0.1)',
              boxShadow: `
                0 50px 100px rgba(0,0,0,0.8),
                0 0 0 0.5px rgba(255,255,255,0.04),
                inset 0 1px 0 rgba(255,255,255,0.06),
                0 0 80px rgba(37,99,235,0.1),
                7px 9px 0 1px rgba(4,8,20,0.85)
              `,
              position: 'relative',
            }}>
              {/* Screen */}
              <div style={{
                position: 'absolute',
                top: '14px', left: '14px', right: '14px', bottom: '18px',
                borderRadius: '8px',
                overflow: 'hidden',
                transform: 'translateZ(4px)',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)',
              }}>
                {/* Browser chrome */}
                <div style={{ height: '26px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '4px', flexShrink: 0 }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff5f57' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28ca41' }} />
                  <div style={{ flex: 1, height: '13px', background: '#f1f5f9', borderRadius: '3px', margin: '0 6px', display: 'flex', alignItems: 'center', padding: '0 5px', gap: '3px' }}>
                    <div style={{ width: '6px', height: '5px', background: '#94a3b8', borderRadius: '1px', flexShrink: 0 }} />
                    <div style={{ flex: 1, height: '4px', background: '#e2e8f0', borderRadius: '2px' }} />
                  </div>
                  <div style={{ width: '30px', height: '13px', background: '#2563eb', borderRadius: '3px' }} />
                </div>

                {/* Website mockup */}
                <div style={{ height: 'calc(100% - 26px)', background: 'linear-gradient(160deg, #eff6ff 0%, #dbeafe 35%, #f8fafc 100%)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '7px', position: 'relative', overflow: 'hidden' }}>
                  {/* dot grid */}
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.25) 1px, transparent 1px)', backgroundSize: '18px 18px', opacity: 0.4 }} />

                  {/* Nav */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                    <div style={{ width: '60px', height: '14px', background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)', borderRadius: '3px' }} />
                    <div style={{ flex: 1 }} />
                    {[36, 46, 38, 42].map((w, i) => <div key={i} style={{ width: `${w}px`, height: '7px', background: '#94a3b8', borderRadius: '2px' }} />)}
                    <div style={{ width: '44px', height: '18px', background: '#1d4ed8', borderRadius: '4px' }} />
                  </div>

                  {/* Heading block */}
                  <div style={{ position: 'relative', paddingTop: '3px' }}>
                    <div style={{ height: '10px', background: '#0f172a', borderRadius: '3px', width: '58%', marginBottom: '4px' }} />
                    <div style={{ height: '10px', background: 'linear-gradient(90deg, #2563eb, #1d4ed8)', borderRadius: '3px', width: '45%', marginBottom: '7px' }} />
                    <div style={{ height: '4px', background: '#cbd5e1', borderRadius: '2px', marginBottom: '3px' }} />
                    <div style={{ height: '4px', background: '#cbd5e1', borderRadius: '2px', width: '82%', marginBottom: '3px' }} />
                    <div style={{ height: '4px', background: '#cbd5e1', borderRadius: '2px', width: '62%', marginBottom: '9px' }} />
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <div style={{ height: '18px', background: '#1d4ed8', borderRadius: '4px', width: '74px' }} />
                      <div style={{ height: '18px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '4px', width: '62px' }} />
                    </div>
                  </div>

                  {/* Stats dark band */}
                  <div style={{ display: 'flex', background: '#0f1629', borderRadius: '6px', padding: '5px 8px', gap: '6px' }}>
                    {[
                      { color: '#60a5fa' },
                      { color: '#a78bfa' },
                      { color: '#34d399' },
                      { color: '#fbbf24' },
                    ].map((s, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                        <div style={{ height: '7px', background: s.color, borderRadius: '2px', width: '55%' }} />
                        <div style={{ height: '3px', background: '#334155', borderRadius: '1px', width: '75%' }} />
                      </div>
                    ))}
                  </div>

                  {/* Service cards */}
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[
                      { color: '#2563eb', bg: '#dbeafe' },
                      { color: '#7c3aed', bg: '#ede9fe' },
                      { color: '#059669', bg: '#d1fae5' },
                    ].map((c, i) => (
                      <div key={i} style={{ flex: 1, background: 'white', borderRadius: '5px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                        <div style={{ height: '2.5px', background: c.color }} />
                        <div style={{ padding: '5px', display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: c.bg, marginBottom: '2px' }} />
                          <div style={{ height: '5px', background: '#0f172a', borderRadius: '1.5px', width: '65%' }} />
                          <div style={{ height: '3px', background: '#cbd5e1', borderRadius: '1.5px' }} />
                          <div style={{ height: '3px', background: '#cbd5e1', borderRadius: '1.5px', width: '82%' }} />
                          <div style={{ marginTop: '3px', height: '7px', background: c.bg, borderRadius: '3px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Screen glare */}
              <div style={{
                position: 'absolute',
                top: '14px', left: '14px', right: '14px',
                height: '38%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)',
                borderRadius: '8px 8px 0 0',
                pointerEvents: 'none',
                transform: 'translateZ(5px)',
              }} />

              {/* Camera dot */}
              <div style={{
                position: 'absolute', bottom: '5px', left: '50%',
                transform: 'translateX(-50%) translateZ(1px)',
                width: '5px', height: '5px', borderRadius: '50%',
                background: '#0c1422',
                border: '1px solid rgba(100,149,255,0.22)',
              }} />
            </div>

            {/* Stand neck */}
            <div style={{
              width: '72px', height: '44px',
              margin: '0 auto',
              background: 'linear-gradient(180deg, #172038 0%, #0d1624 100%)',
              clipPath: 'polygon(25% 0%, 75% 0%, 85% 100%, 15% 100%)',
            }} />

            {/* Stand base */}
            <div style={{
              width: '164px', height: '10px',
              margin: '0 auto',
              background: 'linear-gradient(180deg, #172038 0%, #0d1624 100%)',
              borderRadius: '20px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.55)',
            }} />
          </div>
        </div>
      </div>

      {/* Badge – top right – delivery time */}
      <div style={{
        position: 'absolute', top: '52px', right: '4px',
        background: 'rgba(10,18,36,0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(37,99,235,0.28)',
        borderRadius: '13px',
        padding: '10px 14px',
        animation: 'badge1 4.2s ease-in-out infinite',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'rgba(148,163,184,0.9)', marginBottom: '1px', fontWeight: 500 }}>Dodání webu</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>do 48 hodin</div>
          </div>
        </div>
      </div>

      {/* Badge – bottom left – revenue */}
      <div style={{
        position: 'absolute', bottom: '95px', left: '8px',
        background: 'rgba(10,18,36,0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(5,150,105,0.28)',
        borderRadius: '13px',
        padding: '10px 14px',
        animation: 'badge2 5.4s ease-in-out infinite',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, #059669, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'rgba(148,163,184,0.9)', marginBottom: '1px', fontWeight: 500 }}>Nová poptávka</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#34d399' }}>+14 900 Kč</div>
          </div>
        </div>
      </div>

      {/* Badge – left – rating */}
      <div style={{
        position: 'absolute', top: '44%', left: '12px',
        background: 'rgba(10,18,36,0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(251,191,36,0.28)',
        borderRadius: '13px',
        padding: '8px 12px',
        animation: 'badge3 6s ease-in-out infinite',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ display: 'flex', gap: '1.5px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'white' }}>100% spokojenost</div>
        </div>
      </div>

      <style>{`
        @keyframes monitorFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes badge1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
        }
        @keyframes badge2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-11px); }
        }
        @keyframes badge3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
      `}</style>
    </div>
  );
}
