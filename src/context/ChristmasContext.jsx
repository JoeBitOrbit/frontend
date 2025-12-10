import React, { createContext, useState, useEffect } from 'react';
import { getChristmasStatus } from '../services/christmas';

export const ChristmasContext = createContext();

export function ChristmasProvider({ children }) {
  const [christmasMode, setChristmasMode] = useState(false);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getChristmasStatus();
        setChristmasMode(response.data.enabled);
        setDiscount(response.data.discount);
        localStorage.setItem('christmasMode', JSON.stringify(response.data));
      } catch (error) {
        console.log('Could not fetch Christmas status, checking localStorage');
        const stored = localStorage.getItem('christmasMode');
        if (stored) {
          try {
            const data = JSON.parse(stored);
            setChristmasMode(data.enabled);
            setDiscount(data.discount);
          } catch (e) {
            // Default to Christmas mode enabled for development
            setChristmasMode(true);
            setDiscount(25);
          }
        } else {
          // Default to Christmas mode enabled for development
          setChristmasMode(true);
          setDiscount(25);
        }
      }
    };

    fetchStatus();

    // Check every 30 seconds for updates
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ChristmasContext.Provider value={{ christmasMode, discount }}>
      {children}
    </ChristmasContext.Provider>
  );
}

export function useChristmas() {
  return React.useContext(ChristmasContext);
}
