import { useEffect, useState, useRef } from 'react';
import Loader from './loader';
import ChristmasStarLoader from './ChristmasStarLoader';
import { useChristmas } from '../context/ChristmasContext';
import { useLocation } from 'react-router-dom';

export default function GlobalLoader(){
  const christmasContext = useChristmas();
  const christmasMode = christmasContext?.christmasMode || false;
  const location = useLocation();
  const [visible, setVisible] = useState(true); // currently mounted & fading
  const [active, setActive] = useState(true);   // animation phase
  const [cycle, setCycle] = useState(0);        // force remount of Loader for replay

  // prefer-reduced-motion: if user prefers reduced motion, only show a brief loader once
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // initial load sequence
  useEffect(()=>{
    const initialDuration = prefersReduced ? 600 : 1800; // full N animation time
    const hideTimer = setTimeout(()=> setActive(false), initialDuration);
    const safety = setTimeout(()=> { setActive(false); }, 3000);
    return ()=> { clearTimeout(hideTimer); clearTimeout(safety); };
  }, [prefersReduced]);

  // route change re-show (skip first mount)
  useEffect(()=>{
    if(cycle === 0) return; // first cycle already handled by initial effect
    setVisible(true);
    setActive(true);
    const duration = prefersReduced ? 400 : 1000; // shorter for navigation
    const hideTimer = setTimeout(()=> setActive(false), duration);
    const safety = setTimeout(()=> setActive(false), duration + 1000);
    return ()=> { clearTimeout(hideTimer); clearTimeout(safety); };
  }, [location, prefersReduced, cycle]);

  // trigger a new cycle key on location change (after initial mount)
  const mountedRef = useRef(false);
  useEffect(()=>{
    if(!mountedRef.current){
      mountedRef.current = true;
      return;
    }
    setCycle(c => c + 1);
  }, [location.pathname]);

  // show on every route change briefly
  
  // For stability, we only show the loader on initial page load. Remove the
  // route-based reshow to avoid repeated overlays.

  // fade the app-root when visible
  useEffect(()=>{
    const el = document.getElementById('app-root');
    if(!el) return;
    if(active){
      el.style.transition = 'opacity 260ms ease, transform 260ms ease';
      el.style.opacity = '0.18';
      el.style.transform = 'scale(0.995)';
      el.style.filter = 'blur(1px)';
    } else {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    }
  }, [active]);

  // handle fade-out before unmount
    // Custom show/hide events so features can trigger loader on demand
    useEffect(()=>{
      function onShow(e){
        const duration = (e && e.detail && e.detail.duration) || 1000;
        setVisible(true);
        setActive(true);
        // auto-hide after duration unless a manual hide comes first
        const t = setTimeout(()=> setActive(false), duration);
        return ()=> clearTimeout(t);
      }
      function onHide(){ setActive(false); }
      window.addEventListener('loader:show', onShow);
      window.addEventListener('loader:hide', onHide);
      return ()=>{
        window.removeEventListener('loader:show', onShow);
        window.removeEventListener('loader:hide', onHide);
      };
    }, []);
  useEffect(()=>{
    if(!active){
      const fade = setTimeout(()=> setVisible(false), 320); // match CSS fade-out duration
      return ()=> clearTimeout(fade);
    } else {
      if(!visible) setVisible(true); // ensure remount if needed
    }
  }, [active, visible]);

  if(!visible) return null;
  
  if(christmasMode) return <ChristmasStarLoader />;
  
  return (
    <div className={`n-loader-overlay ${active ? 'entering' : 'leaving'}`}>
      <div key={cycle} className="n-loader-wrapper">
        <Loader />
      </div>
    </div>
  );
}
