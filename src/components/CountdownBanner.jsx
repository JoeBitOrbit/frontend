import React, { useState, useEffect, useContext } from 'react';
import { ChristmasContext } from '../context/ChristmasContext';
import './CountdownBanner.css';

function CountdownBannerContent() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Christmas 2024 - set to December 25
      const christmasDate = new Date('2024-12-25T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = christmasDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-banner">
      <div className="countdown-content">
        <div className="countdown-text">
          <h3>⏰ Christmas Countdown ⏰</h3>
          <p>Days left to shop and save!</p>
        </div>

        <div className="countdown-timer">
          <div className="time-unit">
            <div className="time-value">{String(timeLeft.days).padStart(2, '0')}</div>
            <div className="time-label">Days</div>
          </div>
          <div className="separator">:</div>
          
          <div className="time-unit">
            <div className="time-value">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="time-label">Hours</div>
          </div>
          <div className="separator">:</div>
          
          <div className="time-unit">
            <div className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="time-label">Mins</div>
          </div>
          <div className="separator">:</div>
          
          <div className="time-unit">
            <div className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="time-label">Secs</div>
          </div>
        </div>

        <div className="countdown-cta">
          <p className="urgency-text">🔥 Limited time offers - Shop Now!</p>
        </div>
      </div>

      {/* Animated background */}
      <div className="banner-animation">
        <div className="snowflake"></div>
        <div className="snowflake"></div>
        <div className="snowflake"></div>
      </div>
    </div>
  );
}

export default function CountdownBanner() {
  const { christmasMode } = useContext(ChristmasContext);
  
  if (!christmasMode) return null;
  
  return <CountdownBannerContent />;
}
