import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChristmasContext } from '../context/ChristmasContext';
import './LimitedSpots.css';

function LimitedSpotsContent() {
  const [spotsData, setSpotsData] = useState({ spotsRemaining: 0, spotsTotal: 100 });
  const [loading, setLoading] = useState(false);
  const [entered, setEntered] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    fetchSpots();
    const interval = setInterval(fetchSpots, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSpots = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/christmas-features/contest/spots`
      );
      setSpotsData(res.data);
    } catch (error) {
      console.error('Failed to fetch spots');
    }
  };

  const handleEnterContest = async () => {
    if (loading || entered) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to enter');
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/christmas-features/contest/enter`,
        { method: 'spin' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEntered(true);

      if (response.data.isWinner) {
        setWinner({
          code: response.data.code,
          discount: response.data.discount
        });
        toast.success('🎉 You won a discount code!');
      } else {
        toast.success(`Entry submitted! ${response.data.spotsRemaining} spots left!`);
      }

      // Refresh spots
      await fetchSpots();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to enter');
    } finally {
      setLoading(false);
    }
  };

  const spotsPercentage = (spotsData.spotsRemaining / spotsData.spotsTotal) * 100;
  const filled = spotsData.spotsTotal - spotsData.spotsRemaining;

  return (
    <div className="limited-spots-container">
      <div className="contest-header">
        <h3>🎁 Daily Prize Draw</h3>
        <p>Limited spots available - Enter for your chance to win!</p>
      </div>

      {/* Spots Meter */}
      <div className="spots-meter">
        <div className="meter-label">
          <span>{spotsData.spotsRemaining}</span>
          <span>Spots Remaining</span>
        </div>

        <div className="progress-container">
          <div className="spots-bar">
            <div 
              className="spots-filled"
              style={{ width: `${100 - spotsPercentage}%` }}
            >
              <div className="filled-count">{filled}</div>
            </div>
          </div>
        </div>

        <div className="spots-info">
          {spotsData.spotsRemaining > 50 ? (
            <span className="availability high">✓ Plenty of spots left</span>
          ) : spotsData.spotsRemaining > 20 ? (
            <span className="availability medium">⚠ Getting full</span>
          ) : spotsData.spotsRemaining > 0 ? (
            <span className="availability low">🔥 Only a few left!</span>
          ) : (
            <span className="availability full">✕ Contest full for today</span>
          )}
        </div>
      </div>

      {/* Entry Button */}
      {!winner ? (
        <button
          onClick={handleEnterContest}
          disabled={loading || entered || spotsData.spotsRemaining === 0}
          className={`entry-button ${
            entered ? 'entered' : ''
          } ${spotsData.spotsRemaining === 0 ? 'full' : ''}`}
        >
          {loading && 'Entering...'}
          {!loading && entered && '✓ Entered'}
          {!loading && !entered && spotsData.spotsRemaining > 0 && 'Enter Contest'}
          {!loading && !entered && spotsData.spotsRemaining === 0 && 'Come back tomorrow'}
        </button>
      ) : (
        <div className="winner-card">
          <div className="winner-icon">🎊</div>
          <h4>Congratulations! 🎉</h4>
          <p className="winner-message">You won a discount code!</p>
          <div className="winner-code">{winner.code}</div>
          <p className="discount-value">{winner.discount}% OFF</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(winner.code);
              toast.success('Code copied!');
            }}
            className="copy-code-btn"
          >
            📋 Copy Code
          </button>
        </div>
      )}

      <div className="contest-rules">
        <p>📋 Rules: One entry per person per day • Winners drawn hourly • Code valid 14 days</p>
      </div>
    </div>
  );
}

export default function LimitedSpots() {
  const { christmasMode } = useContext(ChristmasContext);
  
  if (!christmasMode) return null;
  
  return <LimitedSpotsContent />;
}
