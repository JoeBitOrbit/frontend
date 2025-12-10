import React from 'react';
import ChristmasStarLoader from './ChristmasStarLoader';
import { useChristmas } from '../context/ChristmasContext';

export default function Loader(){
  const { christmasMode } = useChristmas();
  
  if(christmasMode) return <ChristmasStarLoader />;
  
  // Exclude admin routes: show no normal loader on /admin pages
  if (typeof window !== 'undefined') {
    const path = window.location?.pathname || '';
    if (path.startsWith('/admin')) {
      return null;
    }
  }
  // Simple, explicit Netflix-like N: two solid slanted bars and a diagonal ribbon in the middle
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div style={{ width: 220, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg className="netflix-n" viewBox="0 0 100 140" width="180" height="252" role="img" aria-label="Loading">
          <defs>
            <linearGradient id="nGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff2a2a" />
              <stop offset="40%" stopColor="#e50914" />
              <stop offset="100%" stopColor="#7b0f0f" />
            </linearGradient>
          </defs>

          {/* Three vertical bars: left, middle (longer), right. Center bar slightly taller. */}
          <rect className="n-bar n-bar-left" x="18" y="12" width="14" height="116" rx="2" fill="url(#nGrad)" />
          <rect className="n-bar n-bar-mid"  x="42" y="6"  width="14" height="128" rx="2" fill="url(#nGrad)" />
          <rect className="n-bar n-bar-right" x="66" y="12" width="14" height="116" rx="2" fill="url(#nGrad)" />
        </svg>
      </div>
    </div>
  );
}