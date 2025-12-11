import { useEffect, useRef } from 'react';
import './peppermintSlider.css';

export default function PeppermintSlider({ value, onChange, min = 0, max = 100, label, accentColor = '#dc2626' }) {
  const inputRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current && accentColor) {
      sliderRef.current.style.setProperty('--red', accentColor);
    }
  }, [accentColor]);

  useEffect(() => {
    if (inputRef.current) {
      const minVal = +min || 0;
      const maxVal = +max || 100;
      const percent = ((value - minVal) / (maxVal - minVal)) * 100;
      const handleRaw = 1.5 * (1 - percent / 100) - 1.125;
      const handle = +handleRaw.toFixed(4);
      const percentStyle = `calc(${percent}% + ${handle}em)`;
      
      if (sliderRef.current) {
        sliderRef.current.style.setProperty('--percent', percentStyle);
      }
    }
  }, [value, min, max]);

  const handleChange = (e) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className='peppermint-wrapper'>
      {label && <label className='peppermint-label'>{label}</label>}
      <form action="">
        <div className="pm" ref={sliderRef}>
          <label htmlFor={`slider-${value}`} className="pm__sr">Range</label>
          <input 
            ref={inputRef}
            id={`slider-${value}`}
            className="pm__input" 
            type="range" 
            value={value} 
            min={min}
            max={max}
            onChange={handleChange}
          />
          <span className="pm__input-fill"></span>
          <span className="pm__input-handle-shadow"></span>
          <span className="pm__input-handle-bg">
            <span className="pm__input-handle-circle"></span>
            <span className="pm__input-handle-circle"></span>
            <span className="pm__input-handle-circle"></span>
            <span className="pm__input-handle-circle"></span>
            <span className="pm__input-handle-circle"></span>
            <span className="pm__input-handle-circle"></span>
          </span>
        </div>
      </form>
      <div className='peppermint-value'>{value}</div>
    </div>
  );
}
