import React, { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// POSTER CONFIG
// To add a new poster: push an object to this array.
// To disable a poster: set `enabled: false`.
// `expiresAt`  — set to null to keep it permanent, or a JS Date string.
//                The modal won't show after this date/time.
// `link`       — optional. If set, the poster image becomes clickable.
// `sessionKey` — unique key used in sessionStorage so each poster is only
//                shown once per browser session (clears on tab close).
// ─────────────────────────────────────────────────────────────────────────────
const POSTERS = [
  {
    id: 'gen-ai-workshop-may-2026',
    enabled: true,
    image: 'posters/gen-ai-workshop.jpeg',
    alt: 'Generative AI Workshop – Sunday 31st May 2026',
    link: "https://forms.gle/K3zUG5NGz552rkTb6",
    expiresAt: '2026-06-01T00:00:00+05:30', // Expires after Sunday midnight IST
    sessionKey: 'promo_seen_gen-ai-workshop-may-2026',
  },
  // future posters below
  // {
  //   id: 'next-event',
  //   enabled: false,
  //   image: '/posters/next-event.jpg',
  //   alt: 'Next Event',
  //   link: null,
  //   expiresAt: null,
  //   sessionKey: 'promo_seen_next-event',
  // },
];

// Returns the first poster that is: enabled, not expired, and not yet seen this session.
function getActivePoster() {
  const now = new Date();
  for (const poster of POSTERS) {
    if (!poster.enabled) continue;
    if (poster.expiresAt && now >= new Date(poster.expiresAt)) continue;
    if (sessionStorage.getItem(poster.sessionKey)) continue;
    return poster;
  }
  return null;
}

export default function PromoPosters() {
  const [poster, setPoster] = useState(null);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const active = getActivePoster();
    if (active) {
      setPoster(active);
      // Small delay so page loads first, then poster slides in
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    if (poster) sessionStorage.setItem(poster.sessionKey, '1');
    // Remove from DOM after transition completes
    setTimeout(() => setPoster(null), 400);
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) dismiss();
  };

  // Close on Escape key
  useEffect(() => {
    if (!visible) return;
    const handler = (e) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible]);

  if (!poster) return null;

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: `rgba(0,0,0,${visible ? 0.75 : 0})`,
        backdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
        transition: 'background-color 0.4s ease, backdrop-filter 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Poster card */}
      <div
        style={{
          position: 'relative',
          maxWidth: '480px',
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(0,255,157,0.15), 0 25px 80px rgba(0,0,0,0.6)',
          border: '1px solid rgba(0,255,157,0.2)',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(24px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
        }}
      >
        {/* Glowing accent border top */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00ff9d, transparent)',
          zIndex: 1,
        }} />

        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close poster"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            transition: 'background-color 0.2s, border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(255,60,60,0.5)';
            e.currentTarget.style.borderColor = 'rgba(255,60,60,0.6)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.6)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <X size={15} />
        </button>

        {/* Poster image – optionally clickable */}
        {poster.link ? (
          <a
            href={poster.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', cursor: 'pointer' }}
          >
            <img
              src={poster.image}
              alt={poster.alt}
              onLoad={() => setImgLoaded(true)}
              style={{
                width: '100%',
                display: 'block',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          </a>
        ) : (
          <img
            src={poster.image}
            alt={poster.alt}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: '100%',
              display: 'block',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
        )}

        {/* Skeleton shimmer while image loads */}
        {!imgLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(110deg, #0d0d0d 30%, #1a1a1a 50%, #0d0d0d 70%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite linear',
          }} />
        )}

        {/* Footer strip */}
        <div style={{
          background: 'rgba(0,0,0,0.85)',
          borderTop: '1px solid rgba(0,255,157,0.15)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: '10px',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
          }}>
            TAP OUTSIDE OR <kbd style={{
              padding: '1px 5px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '3px',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.4)',
            }}>ESC</kbd> TO CLOSE
          </span>
          {poster.link && (
            <a
              href={poster.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                fontFamily: 'monospace',
                letterSpacing: '0.12em',
                color: '#00ff9d',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              Register <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
