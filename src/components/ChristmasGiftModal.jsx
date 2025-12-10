import React, { useState, useEffect, useRef } from 'react';
import { useChristmas } from '../context/ChristmasContext';
import './ChristmasGiftModal.css';

const ChristmasGiftModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const canvasRef = useRef(null);
  const presentRef = useRef(null);
  const { christmasMode, discount } = useChristmas();

  const CLICKS_NEEDED = 20;

  useEffect(() => {
    if (!christmasMode) return;

    const hasSeenGift = sessionStorage.getItem('christmasGiftSeen');
    if (!hasSeenGift) {
      setIsOpen(true);
      sessionStorage.setItem('christmasGiftSeen', 'true');
    }
  }, [christmasMode]);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const snowflakes = [];
    const maxSnowflakes = Math.min(100, Math.max(canvas.width / 20, 50));

    class Snowflake {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = Math.random() * 1 + 0.5;
        this.size = Math.random() * 3 + 2;
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;

        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }

        this.draw();
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < maxSnowflakes; i++) {
      snowflakes.push(new Snowflake());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snowflakes.forEach(flake => flake.update());

      if (snowflakes.length < maxSnowflakes && Math.random() > 0.95) {
        snowflakes.push(new Snowflake());
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isOpen]);

  const handleGiftClick = () => {
    if (isOpened) return;

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (presentRef.current) {
      presentRef.current.style.setProperty('--count', Math.ceil(newCount / 2));
      presentRef.current.classList.add('animate');
      setTimeout(() => {
        presentRef.current?.classList.remove('animate');
      }, 300);
    }

    if (newCount >= CLICKS_NEEDED) {
      setTimeout(() => {
        setIsOpened(true);
      }, 300);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || !christmasMode) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] pointer-events-auto overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <style>{`
        @keyframes wiggle {
          0% { transform: translateX(0) rotateX(0); }
          25% { transform: translateX(calc(var(--count) * -1px)) rotateX(calc(var(--count) * 1deg)); }
          50% { transform: translateX(0) rotateX(0); }
          75% { transform: translateX(calc(var(--count) * 1px)) rotateX(calc(var(--count) * -1deg)); }
          100% { transform: translateX(0) rotateX(0); }
        }

        @keyframes present-rotate {
          0% { transform: rotateY(0); }
          100% { transform: rotateY(360deg); }
        }

        @keyframes lid-animation {
          0% { transform: translate3d(0, 0, 0) rotateX(0); }
          5% { transform: translate3d(0, -10px, -5px) rotateX(5deg); }
          10% { transform: translate3d(0, -10px, 5px) rotateX(-5deg); }
          15% { transform: translate3d(0, -10px, -5px) rotateX(5deg); }
          20% { transform: translate3d(0, -10px, 5px) rotateX(-5deg); }
          25% { transform: translate3d(0, -10px, -5px) rotateX(5deg); }
          30% { transform: translate3d(0, 0, 0) rotateX(0); }
        }

        @keyframes confetti {
          0% { transform: translateY(0) rotateZ(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotateZ(720deg); opacity: 0; }
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center justify-center gap-4 md:gap-6 px-4 w-full h-full">
        {/* Headline */}
        <div className="absolute top-10 md:top-20 text-4xl md:text-6xl lg:text-8xl font-bold text-white/15 text-center select-none" style={{ fontFamily: "'Mountains of Christmas', cursive" }}>
          MERRY CHRISTMAS
        </div>

        {/* Instructions */}
        {!isOpened && (
          <div className="absolute top-1/4 text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center select-none animate-pulse" style={{ fontFamily: "'Mountains of Christmas', cursive" }}>
            CHRISTMAS PIÑATA
          </div>
        )}

        {/* 3D Gift Box */}
        {!isOpened ? (
          <div
            ref={presentRef}
            className="gift-present"
            onClick={handleGiftClick}
            style={{
              '--count': Math.ceil(clickCount / 2)
            }}
          >
            <div className="wiggle-container">
              <div className="rotate-container">
                <div className="bottom"></div>
                <div className="front"></div>
                <div className="left"></div>
                <div className="back"></div>
                <div className="right"></div>

                <div className="lid">
                  <div className="lid-top"></div>
                  <div className="lid-front"></div>
                  <div className="lid-left"></div>
                  <div className="lid-back"></div>
                  <div className="lid-right"></div>
                </div>
              </div>
            </div>

            {/* Click Counter */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="text-center">
                <div className="text-white font-bold text-sm md:text-lg">
                  {clickCount}/{CLICKS_NEEDED}
                </div>
                <div className="text-white font-bold text-xs md:text-sm">
                  CLICK ME!
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Opened Gift - Show Discount
          <div className="flex flex-col items-center justify-center gap-4 animate-bounce">
            {/* Explosion Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-6xl md:text-8xl animate-ping">✨</div>
            </div>

            {/* Discount Badge */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-full w-40 h-40 md:w-56 md:h-56 flex flex-col items-center justify-center shadow-2xl border-8 border-yellow-400 relative z-10">
              <div className="text-6xl md:text-8xl font-black text-yellow-300">
                {discount}%
              </div>
              <div className="text-white font-bold text-lg md:text-2xl text-center mt-2">
                OFF
              </div>
              <div className="text-white font-semibold text-sm md:text-base text-center mt-2">
                ALL ITEMS
              </div>
            </div>

            {/* Confetti Animation */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#0000ff'][i % 4],
                  animation: `confetti ${1 + Math.random() * 1}s ease-in forwards`,
                  animationDelay: `${Math.random() * 0.2}s`,
                  marginLeft: `${(Math.random() - 0.5) * 200}px`,
                  marginTop: `${(Math.random() - 0.5) * 200}px`
                }}
              />
            ))}
          </div>
        )}

        {/* Close Button */}
        {isOpened && (
          <button
            onClick={handleClose}
            className="absolute bottom-10 px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 transition shadow-lg text-lg md:text-xl"
          >
            Claim Discount! 🎉
          </button>
        )}

        {/* Skip Button */}
        {!isOpened && (
          <button
            onClick={handleClose}
            className="absolute bottom-10 text-white text-sm md:text-base hover:text-yellow-300 transition underline"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
};

export default ChristmasGiftModal;
