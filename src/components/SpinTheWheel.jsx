import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ChristmasContext } from '../context/ChristmasContext';
import './SpinTheWheel.css';

function SpinTheWheelContent() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [winCode, setWinCode] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const prizes = [
    { label: '5% OFF', color: '#ff6b6b' },
    { label: '10% OFF', color: '#ff8787' },
    { label: '15% OFF', color: '#ffa5a5' },
    { label: '20% OFF', color: '#f06595' },
    { label: '25% OFF', color: '#d6336c' },
    { label: 'FREE SHIP', color: '#b197fc' },
    { label: '₨500 GIFT', color: '#7950f2' },
    { label: 'SPIN AGAIN', color: '#4c6ef5' }
  ];

  const handleSpin = async () => {
    if (isSpinning) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to spin the wheel');
        return;
      }

      setIsSpinning(true);
      
      // Call backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/christmas-features/spin-wheel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Spin animation
      const spins = Math.floor(Math.random() * 5) + 5; // 5-10 full rotations
      const randomAngle = Math.random() * 360;
      const finalRotation = spins * 360 + randomAngle;

      setWheelRotation(finalRotation);

      setTimeout(() => {
        setWinCode(response.data.code);
        setShowModal(true);
        toast.success(`🎉 You won: ${response.data.prize}!`);
        setIsSpinning(false);
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Spin failed');
      setIsSpinning(false);
    }
  };

  return (
    <>
      <div className="spin-wheel-container">
        <h3 className="spin-title">🎡 Spin to Win!</h3>
        <p className="spin-subtitle">Try your luck for amazing discounts</p>

        <div className="wheel-wrapper">
          <div className="wheel-pointer"></div>
          <div 
            className="wheel"
            style={{ 
              transform: `rotate(${wheelRotation}deg)`,
              transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
          >
            {prizes.map((prize, index) => {
              const angle = (360 / prizes.length) * index;
              return (
                <div
                  key={index}
                  className="wheel-segment"
                  style={{
                    background: prize.color,
                    transform: `rotate(${angle}deg)`
                  }}
                >
                  <span className="prize-label">{prize.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`spin-button ${isSpinning ? 'spinning' : ''}`}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
        </button>

        <p className="spin-info">✨ Once per day • Code valid for 3 days</p>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-confetti">🎉🎊🎁</div>
            <h2>🎄 You Won!</h2>
            <p className="win-code">{winCode}</p>
            <p className="win-message">Use this code at checkout for your reward!</p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(winCode);
                toast.success('Code copied!');
              }}
              className="copy-button"
            >
              📋 Copy Code
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="close-button"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function SpinTheWheel() {
  const { christmasMode } = useContext(ChristmasContext);
  
  if (!christmasMode) return null;
  
  return <SpinTheWheelContent />;
}
