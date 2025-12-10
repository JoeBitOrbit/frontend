import React, { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChristmasContext } from '../context/ChristmasContext';
import './GiftFinder.css';

function GiftFinderContent() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    recipient: null,
    style: null,
    priceRange: null,
    size: null
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      question: 'Who is this gift for?',
      key: 'recipient',
      options: ['Men', 'Women', 'Kids', 'Unisex']
    },
    {
      question: 'What\'s their style?',
      key: 'style',
      options: ['Classic', 'Modern', 'Sporty', 'Bold']
    },
    {
      question: 'Budget?',
      key: 'priceRange',
      options: ['Under ₨5,000', '₨5,000-10,000', '₨10,000-20,000', '₨20,000+']
    },
    {
      question: 'Size preference?',
      key: 'size',
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    }
  ];

  const handleAnswer = (answer) => {
    const newAnswers = {
      ...answers,
      [questions[step].key]: answer
    };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Find matching products
      findGifts(newAnswers);
    }
  };

  const findGifts = async (filterAnswers) => {
    setLoading(true);
    try {
      // Map answers to search parameters
      let query = `${filterAnswers.recipient || ''} ${filterAnswers.style || ''}`.trim();
      
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/search/${query}`
      );

      // Filter by price range
      let filtered = res.data || [];
      
      const priceMap = {
        'Under $50': { min: 0, max: 50 },
        '$50-100': { min: 50, max: 100 },
        '$100-200': { min: 100, max: 200 },
        '200+': { min: 200, max: 999999 }
      };

      const priceRange = priceMap[filterAnswers.priceRange];
      if (priceRange) {
        filtered = filtered.filter(p => 
          p.price >= priceRange.min && p.price <= priceRange.max
        );
      }

      setResults(filtered.slice(0, 6));
      toast.success(`Found ${filtered.length} perfect gifts!`);
    } catch (error) {
      toast.error('Could not find gifts');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({ recipient: null, style: null, priceRange: null, size: null });
    setResults([]);
  };

  if (results.length > 0) {
    return (
      <div className="gift-finder-results">
        <div className="results-header">
          <h2>🎁 Perfect Gifts Found!</h2>
          <button onClick={handleReset} className="new-quiz-btn">Start Over</button>
        </div>
        <div className="results-grid">
          {results.map(product => (
            <div key={product._id} className="result-card">
              <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} />
              <h4>{product.name}</h4>
              <p className="price">${product.price}</p>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="gift-finder-container">
      <div className="gift-finder-header">
        <h2>🎄 Gift Finder Quiz</h2>
        <p>Answer a few questions to find the perfect gift</p>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Finding perfect gifts...</p>
        </div>
      ) : (
        <div className="quiz-question">
          <h3>{questions[step].question}</h3>
          <div className="options-grid">
            {questions[step].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className={`option-button ${
                  answers[questions[step].key] === option ? 'selected' : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          
          {step > 0 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="back-button"
            >
              ← Back
            </button>
          )}
        </div>
      )}

      <div className="quiz-info">
        <p>Step {step + 1} of {questions.length}</p>
      </div>
    </div>
  );
}

export default function GiftFinder() {
  const { christmasMode } = useContext(ChristmasContext);
  
  if (!christmasMode) return null;
  
  return <GiftFinderContent />;
}
