'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('wa-cookie-consent')) setVisible(true);
  }, []);

  function accept(type: 'all' | 'necessary') {
    localStorage.setItem('wa-cookie-consent', type);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 48px)',
            maxWidth: '780px',
            zIndex: 998,
            background: '#fff',
            border: '1px solid #e3ded7',
            borderRadius: '16px',
            boxShadow: '0 12px 48px rgba(40,85,112,0.12), 0 2px 8px rgba(40,85,112,0.06)',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexWrap: 'wrap',
          }}
        >
          {/* Icon */}
          <div style={{
            flexShrink: 0, width: '38px', height: '38px', borderRadius: '10px',
            background: 'rgba(40,85,112,0.07)', border: '1px solid rgba(40,85,112,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#285570" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="8" r="1" fill="#285570" stroke="none"/>
              <circle cx="8.5" cy="14" r="1" fill="#285570" stroke="none"/>
              <circle cx="15.5" cy="13.5" r="1" fill="#285570" stroke="none"/>
              <circle cx="11" cy="16" r="0.8" fill="#285570" stroke="none"/>
            </svg>
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e3d', marginBottom: '3px', lineHeight: 1.3 }}>
              Tento web používá cookies
            </p>
            <p style={{ fontSize: '12px', color: '#a8a4a0', lineHeight: 1.55, margin: 0 }}>
              Nezbytné cookies zajišťují fungování webu. Analytické nám pomáhají web zlepšovat.
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => accept('necessary')}
              style={{
                fontSize: '12px', fontWeight: 500,
                color: '#6b6560',
                background: 'transparent',
                border: '1px solid #e3ded7',
                borderRadius: '9px', padding: '9px 16px',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#1a2e3d';
                e.currentTarget.style.borderColor = '#cbcac7';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#6b6560';
                e.currentTarget.style.borderColor = '#e3ded7';
              }}
            >
              Pouze nezbytné
            </button>

            <button
              onClick={() => accept('all')}
              style={{
                fontSize: '12px', fontWeight: 600,
                color: '#fff',
                background: '#285570',
                border: '1px solid #285570',
                borderRadius: '9px', padding: '9px 18px',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1a3446'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#285570'; }}
            >
              Přijmout vše
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
