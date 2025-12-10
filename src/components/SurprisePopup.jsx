import React, { useState, useEffect, useContext } from 'react';
import { ChristmasContext } from '../context/ChristmasContext';
import './SurprisePopup.css';

export default function SurprisePopup() {
  const { christmasMode } = useContext(ChristmasContext);
  const [popups, setPopups] = useState([]);

  if (!christmasMode) return null;

  const popupMessages = [
    {
      title: '🎄 Flash Deal!',
      message: 'Get 20% OFF on winter collection',
      code: 'FESTIVE20',
      trigger: 'time' // 'time', 'scroll', 'visit'
    },
    {
      title: '🎁 Free Gift',
      message: 'Free shipping on orders over ₨5,000',
      code: 'SHIPFREE',
      trigger: 'scroll'
    },
    {
      title: '❄️ Limited Time',
      message: '25% OFF - Only 2 hours left!',
      code: 'HURRY25',
      trigger: 'time'
    },
    {
      title: '🎅 Santa\'s Pick',
      message: '15% OFF on our bestsellers',
      code: 'SANTASPICK',
      trigger: 'visit'
    }
  ];

  useEffect(() => {
    // Trigger popup on page visit
    const hasSeenWelcome = sessionStorage.getItem('welcome_popup_seen');
    if (!hasSeenWelcome) {
      showRandomPopup();
      sessionStorage.setItem('welcome_popup_seen', 'true');
    }

    // Trigger popup on time interval (every 2 minutes)
    const timeInterval = setInterval(() => {
      showRandomPopup();
    }, 120000);

    // Trigger popup on scroll
    let scrollCount = 0;
    const handleScroll = () => {
      scrollCount++;
      if (scrollCount % 5 === 0) {
        showRandomPopup();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showRandomPopup = () => {
    const popup = popupMessages[Math.floor(Math.random() * popupMessages.length)];
    const id = Math.random();

    setPopups(prev => [...prev, { ...popup, id }]);

    // Auto-remove after 8 seconds
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 8000);
  };

  const closePopup = (id) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="popup-container">
      {popups.map(popup => (
        <div key={popup.id} className="surprise-popup">
          <button 
            className="popup-close"
            onClick={() => closePopup(popup.id)}
          >
            ✕
          </button>

          <div className="popup-content">
            <h3>{popup.title}</h3>
            <p>{popup.message}</p>

            <div className="popup-code">
              <code>{popup.code}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(popup.code);
                  alert('Code copied!');
                }}
                className="copy-btn"
              >
                📋
              </button>
            </div>

            <button 
              onClick={() => closePopup(popup.id)}
              className="popup-action"
            >
              Shop Now →
            </button>
          </div>

          <div className="popup-animation">✨</div>
        </div>
      ))}
    </div>
  );
}
