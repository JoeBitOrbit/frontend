import React, { useState, useEffect } from 'react';
import { useChristmas } from '../context/ChristmasContext';
import './ChristmasCalendar.css';

const ChristmasCalendar = () => {
  const { christmasMode } = useChristmas();
  const [calendarData, setCalendarData] = useState(null);
  const [userStreak, setUserStreak] = useState(0);
  const [claimedToday, setClaimedToday] = useState(false);
  const [openDay, setOpenDay] = useState(null);

  useEffect(() => {
    if (!christmasMode) return;

    // Initialize calendar data
    const today = new Date();
    const dayOfMonth = today.getDate();

    const storedData = localStorage.getItem('christmasCalendar');
    if (storedData) {
      const data = JSON.parse(storedData);
      setCalendarData(data);
      setUserStreak(data.streak || 0);
      setClaimedToday(data.lastClaimedDay === dayOfMonth);
    } else {
      const newData = {
        streak: 0,
        lastClaimedDay: null,
        claimedDays: [],
        rewards: generateRewards()
      };
      localStorage.setItem('christmasCalendar', JSON.stringify(newData));
      setCalendarData(newData);
    }
  }, [christmasMode]);

  const generateRewards = () => {
    const rewards = [
      { day: 1, reward: '5% OFF', description: 'Welcome to Christmas!' },
      { day: 2, reward: '10% OFF', description: 'Double the cheer!' },
      { day: 3, reward: 'Free Shipping', description: 'On orders over $50' },
      { day: 4, reward: '15% OFF', description: 'Halfway there!' },
      { day: 5, reward: 'Mystery Gift', description: 'Surprise reward!' },
      { day: 6, reward: '20% OFF', description: 'Getting better!' },
      { day: 7, reward: '$10 Credit', description: 'Use anytime!' },
      { day: 8, reward: '25% OFF', description: 'Over a week in!' },
      { day: 9, reward: 'Free Gift Wrap', description: 'For any order' },
      { day: 10, reward: '30% OFF', description: 'Mega savings!' },
      { day: 11, reward: 'Double Points', description: 'On all purchases' },
      { day: 12, reward: '35% OFF', description: 'Almost halfway!' },
      { day: 13, reward: '$25 Credit', description: 'Use on anything!' },
      { day: 14, reward: '40% OFF', description: 'Record discount!' },
      { day: 15, reward: 'VIP Access', description: 'Exclusive sales' },
      { day: 16, reward: '45% OFF', description: 'Incredible deal!' },
      { day: 17, reward: 'Free Express Ship', description: 'Next day delivery' },
      { day: 18, reward: '50% OFF', description: 'HALF OFF!' },
      { day: 19, reward: '$50 Credit', description: 'Use on Christmas' },
      { day: 20, reward: 'Buy 1 Get 1', description: '50% off second' },
      { day: 21, reward: '55% OFF', description: 'Maximum discount!' },
      { day: 22, reward: 'Exclusive Item', description: 'Limited edition' },
      { day: 23, reward: '60% OFF', description: 'ULTIMATE DEAL!' },
      { day: 24, reward: '🎄 MYSTERY', description: 'Something special!' }
    ];
    return rewards;
  };

  const handleClaimReward = (day) => {
    if (claimedToday || !calendarData) return;

    const today = new Date();
    const dayOfMonth = today.getDate();

    if (day > dayOfMonth) {
      alert('This day is not available yet!');
      return;
    }

    const data = JSON.parse(localStorage.getItem('christmasCalendar') || '{}');
    
    // Calculate streak
    let newStreak = data.streak || 0;
    if (data.lastClaimedDay === dayOfMonth - 1 || (dayOfMonth === 1 && data.lastClaimedDay === 24)) {
      newStreak += 1;
    } else if (data.lastClaimedDay !== dayOfMonth) {
      newStreak = 1;
    }

    data.lastClaimedDay = dayOfMonth;
    data.streak = newStreak;
    data.claimedDays = [...(data.claimedDays || []), day];

    localStorage.setItem('christmasCalendar', JSON.stringify(data));
    setUserStreak(newStreak);
    setClaimedToday(true);
    setOpenDay(day);

    setTimeout(() => {
      setOpenDay(null);
    }, 5000);
  };

  if (!christmasMode || !calendarData) return null;

  const today = new Date().getDate();
  const rewards = calendarData.rewards || generateRewards();

  return (
    <div className="christmas-calendar-container">
      <div className="calendar-header">
        <h2 className="calendar-title">🎄 Advent Calendar 🎄</h2>
        <div className="streak-info">
          <span className="streak-badge">🔥 Streak: {userStreak} days</span>
          {claimedToday && <span className="claimed-badge">✓ Claimed Today</span>}
        </div>
      </div>

      <div className="calendar-grid">
        {rewards.map((item) => {
          const isClaimed = calendarData.claimedDays?.includes(item.day);
          const isToday = item.day === today;
          const isAvailable = item.day <= today;
          const isOpen = openDay === item.day;

          return (
            <div
              key={item.day}
              className={`calendar-day ${isClaimed ? 'claimed' : ''} ${isToday ? 'today' : ''} ${isAvailable && !isClaimed ? 'available' : 'locked'}`}
              onClick={() => handleClaimReward(item.day)}
            >
              {isOpen ? (
                <div className="wrap">
                  <span className="animated-text">Merry Christmas</span>
                  <div className="day animated">
                    <div className="reward-content">
                      {item.reward}
                    </div>
                  </div>
                  <div className="left">
                    <div className="panel"></div>
                  </div>
                  <div className="right">
                    <div className="panel"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="day-number">{item.day}</div>
                  {isClaimed && <div className="claimed-checkmark">✓</div>}
                  {isAvailable && !isClaimed && !claimedToday && (
                    <div className="day-info">
                      <div className="day-reward">{item.reward}</div>
                      <div className="day-desc">{item.description}</div>
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="day-info">
                      <span className="locked-text">🔒</span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="calendar-footer">
        <p className="footer-text">Come back each day for greater rewards! Build your streak! 🎁</p>
        {userStreak >= 7 && <p className="bonus-text">🏆 You have a {userStreak}-day streak! Keep it going!</p>}
      </div>
    </div>
  );
};

export default ChristmasCalendar;
