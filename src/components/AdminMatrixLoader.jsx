import { useEffect, useRef } from 'react';
import { MdAdminPanelSettings } from 'react-icons/md';
import ChristmasStarLoader from './ChristmasStarLoader';
import { useChristmas } from '../context/ChristmasContext';

export default function AdminMatrixLoader() {
  const { christmasMode } = useChristmas();
  
  if(christmasMode) return <ChristmasStarLoader />;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center" style={{ zIndex: 99999 }}>
      <canvas ref={canvasRef} className="absolute inset-0"></canvas>
      <div className="relative z-10 flex flex-col items-center">
        <MdAdminPanelSettings className="admin-icon-3d text-6xl text-green-400" />
        <div className="mt-4 h-[2px] w-64 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
      </div>
    </div>
  );
}
