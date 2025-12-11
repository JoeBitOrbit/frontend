import { useState } from 'react';
import { getItem as safeGetItem, setItem as safeSetItem } from '../../utils/safeStorage';
import { createPromo, listPromos, sendBroadcast } from '../../services/newsletter';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import PeppermintSlider from '../../components/PeppermintSlider';

export default function SettingsAdmin(){
  const [saving,setSaving] = useState(false);
  // placeholder settings local state
  const [storeName,setStoreName] = useState('Nikola');
  const [supportEmail,setSupportEmail] = useState('support@example.com');
  // Theme colors
  const [accent,setAccent] = useState('#dc2626');
  const [bgMain,setBgMain] = useState('#ffffff');
  const [textMain,setTextMain] = useState('#000000');
  const [promoCode, setPromoCode] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(10);
  const [promos, setPromos] = useState([]);
  const [broadcastSubj, setBroadcastSubj] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  // Christmas Settings
  const [christmasEnabled, setChristmasEnabled] = useState(true);
  const [christmasDiscount, setChristmasDiscount] = useState(25);
  const [snowflakesEnabled, setSnowflakesEnabled] = useState(true);
  const [spinWheelEnabled, setSpinWheelEnabled] = useState(true);
  const [giftFinderEnabled, setGiftFinderEnabled] = useState(true);
  const [limitedSpotsEnabled, setLimitedSpotsEnabled] = useState(true);
  const [limitedSpotCount, setLimitedSpotCount] = useState(100);
  const [countdownEnabled, setCountdownEnabled] = useState(true);
  const [countdownDate, setCountdownDate] = useState('2025-12-25');
  const [surprisePopupEnabled, setSurprisePopupEnabled] = useState(true);
  const [surprisePopupFrequency, setSurprisePopupFrequency] = useState(5);
  const [adventCalendarEnabled, setAdventCalendarEnabled] = useState(true);
  const [christmasTheme, setChristmasTheme] = useState('red'); // red, gold, silver, multicolor

  useEffect(()=>{
    listPromos().then(r=> setPromos(r.data)).catch(()=>{});
    // Load theme from storage
    try{
      const raw = safeGetItem('theme');
      const saved = raw ? JSON.parse(raw) : {};
      if(saved.accent) setAccent(saved.accent);
      if(saved.bgMain) setBgMain(saved.bgMain);
      if(saved.textMain) setTextMain(saved.textMain);
    }catch(_){ }
    // Load Christmas settings
    try{
      const christmas = safeGetItem('christmasSettings');
      if(christmas) {
        const parsed = JSON.parse(christmas);
        if(parsed.enabled !== undefined) setChristmasEnabled(parsed.enabled);
        if(parsed.discount !== undefined) setChristmasDiscount(parsed.discount);
        if(parsed.snowflakes !== undefined) setSnowflakesEnabled(parsed.snowflakes);
        if(parsed.spinWheel !== undefined) setSpinWheelEnabled(parsed.spinWheel);
        if(parsed.giftFinder !== undefined) setGiftFinderEnabled(parsed.giftFinder);
        if(parsed.limitedSpots !== undefined) setLimitedSpotsEnabled(parsed.limitedSpots);
        if(parsed.spotCount !== undefined) setLimitedSpotCount(parsed.spotCount);
        if(parsed.countdown !== undefined) setCountdownEnabled(parsed.countdown);
        if(parsed.countdownDate !== undefined) setCountdownDate(parsed.countdownDate);
        if(parsed.popup !== undefined) setSurprisePopupEnabled(parsed.popup);
        if(parsed.popupFreq !== undefined) setSurprisePopupFrequency(parsed.popupFreq);
        if(parsed.advent !== undefined) setAdventCalendarEnabled(parsed.advent);
        if(parsed.theme !== undefined) setChristmasTheme(parsed.theme);
      }
    }catch(_){ }
  },[]);

  function save(){
    setSaving(true);
    try{
      const theme = { accent, bgMain, textMain };
      safeSetItem('theme', JSON.stringify(theme));
      const root = document.documentElement;
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--bg-main', bgMain);
      root.style.setProperty('--text-main', textMain);
      toast.success('Theme updated');
    }catch(e){ toast.error('Failed to save theme'); }
    setTimeout(()=> setSaving(false), 600);
  }

  function saveChristmasSettings(){
    setSaving(true);
    try{
      const christmasSettings = {
        enabled: christmasEnabled,
        discount: christmasDiscount,
        snowflakes: snowflakesEnabled,
        spinWheel: spinWheelEnabled,
        giftFinder: giftFinderEnabled,
        limitedSpots: limitedSpotsEnabled,
        spotCount: limitedSpotCount,
        countdown: countdownEnabled,
        countdownDate: countdownDate,
        popup: surprisePopupEnabled,
        popupFreq: surprisePopupFrequency,
        advent: adventCalendarEnabled,
        theme: christmasTheme
      };
      safeSetItem('christmasSettings', JSON.stringify(christmasSettings));
      window.dispatchEvent(new Event('christmasSettingsUpdated'));
      toast.success('Christmas settings saved');
    }catch(e){ 
      console.error(e);
      toast.error('Failed to save Christmas settings'); 
    }
    setTimeout(()=> setSaving(false), 600);
  }

  return (
    <div className='p-8 max-w-4xl'>
      <h1 className='text-2xl font-semibold mb-6 text-white'>Settings</h1>
      <div className='space-y-8'>
        
        {/* CHRISTMAS SETTINGS SECTION */}
        <div className='bg-gradient-to-r from-red-900 via-red-800 to-red-900 p-6 rounded-lg border-2 border-red-600'>
          <h2 className='text-xl font-bold mb-6 text-white flex items-center gap-2'>
            ❄️ Christmas Mode Settings
          </h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            
            {/* Master Enable */}
            <div>
              <label className='text-sm font-semibold text-white block mb-2'>Enable Christmas Mode</label>
              <div className='flex gap-3'>
                <button 
                  onClick={() => setChristmasEnabled(true)}
                  className={`flex-1 py-2 rounded font-semibold transition ${christmasEnabled ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-700'}`}
                >
                  ✓ ON
                </button>
                <button 
                  onClick={() => setChristmasEnabled(false)}
                  className={`flex-1 py-2 rounded font-semibold transition ${!christmasEnabled ? 'bg-red-500 text-white' : 'bg-gray-400 text-gray-700'}`}
                >
                  ✗ OFF
                </button>
              </div>
            </div>

            {/* Christmas Discount */}
            <div>
              <PeppermintSlider 
                value={christmasDiscount}
                onChange={setChristmasDiscount}
                min={0}
                max={100}
                label="Christmas Discount (%)"
                accentColor="#dc2626"
              />
              <p className='text-xs text-red-200 mt-1'>Applied to all products</p>
            </div>

            {/* Snowflakes */}
            <div>
              <label className='text-sm font-semibold text-white block mb-2'>Falling Snowflakes</label>
              <div className='flex gap-3'>
                <button 
                  onClick={() => setSnowflakesEnabled(true)}
                  className={`flex-1 py-2 rounded font-semibold transition ${snowflakesEnabled ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-700'}`}
                >
                  ✓ ON
                </button>
                <button 
                  onClick={() => setSnowflakesEnabled(false)}
                  className={`flex-1 py-2 rounded font-semibold transition ${!snowflakesEnabled ? 'bg-gray-500 text-white' : 'bg-gray-400 text-gray-700'}`}
                >
                  ✗ OFF
                </button>
              </div>
            </div>

            {/* Christmas Theme */}
            <div>
              <label className='text-sm font-semibold text-white block mb-2'>Color Theme</label>
              <select 
                value={christmasTheme} 
                onChange={e=> setChristmasTheme(e.target.value)}
                className='w-full h-10 rounded-md bg-white border-2 border-red-400 outline-none px-3 text-black font-semibold'
              >
                <option value='red'>🔴 Red & Green</option>
                <option value='gold'>🟡 Gold & Silver</option>
                <option value='silver'>⚪ Frosty Silver</option>
                <option value='multicolor'>🌈 Multicolor</option>
              </select>
            </div>
          </div>

          <div className='mt-6 border-t border-red-500 pt-6'>
            <h3 className='text-lg font-bold text-white mb-4'>🎮 Game Features</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              
              {/* Spin the Wheel */}
              <div className='bg-red-700/30 p-4 rounded'>
                <label className='text-sm font-semibold text-white block mb-2'>Spin the Wheel Game</label>
                <div className='flex gap-2'>
                  <button 
                    onClick={() => setSpinWheelEnabled(true)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${spinWheelEnabled ? 'bg-green-500 text-white' : 'bg-gray-400'}`}
                  >
                    ON
                  </button>
                  <button 
                    onClick={() => setSpinWheelEnabled(false)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${!spinWheelEnabled ? 'bg-red-500 text-white' : 'bg-gray-400'}`}
                  >
                    OFF
                  </button>
                </div>
              </div>

              {/* Gift Finder */}
              <div className='bg-red-700/30 p-4 rounded'>
                <label className='text-sm font-semibold text-white block mb-2'>Gift Finder Quiz</label>
                <div className='flex gap-2'>
                  <button 
                    onClick={() => setGiftFinderEnabled(true)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${giftFinderEnabled ? 'bg-green-500 text-white' : 'bg-gray-400'}`}
                  >
                    ON
                  </button>
                  <button 
                    onClick={() => setGiftFinderEnabled(false)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${!giftFinderEnabled ? 'bg-red-500 text-white' : 'bg-gray-400'}`}
                  >
                    OFF
                  </button>
                </div>
              </div>

              {/* Limited Spots */}
              <div className='bg-red-700/30 p-4 rounded'>
                <label className='text-sm font-semibold text-white block mb-3'>Limited Spots Contest</label>
                <div className='flex gap-2 mb-3'>
                  <button 
                    onClick={() => setLimitedSpotsEnabled(true)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${limitedSpotsEnabled ? 'bg-green-500 text-white' : 'bg-gray-400'}`}
                  >
                    ON
                  </button>
                  <button 
                    onClick={() => setLimitedSpotsEnabled(false)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${!limitedSpotsEnabled ? 'bg-red-500 text-white' : 'bg-gray-400'}`}
                  >
                    OFF
                  </button>
                </div>
                <PeppermintSlider 
                  value={limitedSpotCount}
                  onChange={setLimitedSpotCount}
                  min={1}
                  max={500}
                  label="Daily Spots"
                  accentColor="#ea580c"
                />
              </div>

              {/* Countdown */}
              <div className='bg-red-700/30 p-4 rounded'>
                <label className='text-sm font-semibold text-white block mb-2'>Countdown Timer</label>
                <div className='flex gap-2 mb-2'>
                  <button 
                    onClick={() => setCountdownEnabled(true)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${countdownEnabled ? 'bg-green-500 text-white' : 'bg-gray-400'}`}
                  >
                    ON
                  </button>
                  <button 
                    onClick={() => setCountdownEnabled(false)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${!countdownEnabled ? 'bg-red-500 text-white' : 'bg-gray-400'}`}
                  >
                    OFF
                  </button>
                </div>
                <input 
                  type='date' 
                  value={countdownDate} 
                  onChange={e=> setCountdownDate(e.target.value)}
                  className='w-full h-8 rounded px-2 text-black text-sm'
                />
              </div>

              {/* Surprise Popups */}
              <div className='bg-red-700/30 p-4 rounded'>
                <label className='text-sm font-semibold text-white block mb-3'>Surprise Popups</label>
                <div className='flex gap-2 mb-3'>
                  <button 
                    onClick={() => setSurprisePopupEnabled(true)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${surprisePopupEnabled ? 'bg-green-500 text-white' : 'bg-gray-400'}`}
                  >
                    ON
                  </button>
                  <button 
                    onClick={() => setSurprisePopupEnabled(false)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${!surprisePopupEnabled ? 'bg-red-500 text-white' : 'bg-gray-400'}`}
                  >
                    OFF
                  </button>
                </div>
                <PeppermintSlider 
                  value={surprisePopupFrequency}
                  onChange={setSurprisePopupFrequency}
                  min={1}
                  max={60}
                  label="Trigger every (minutes)"
                  accentColor="#ec4899"
                />
              </div>

              {/* Advent Calendar */}
              <div className='bg-red-700/30 p-4 rounded'>
                <label className='text-sm font-semibold text-white block mb-2'>Advent Calendar</label>
                <div className='flex gap-2'>
                  <button 
                    onClick={() => setAdventCalendarEnabled(true)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${adventCalendarEnabled ? 'bg-green-500 text-white' : 'bg-gray-400'}`}
                  >
                    ON
                  </button>
                  <button 
                    onClick={() => setAdventCalendarEnabled(false)}
                    className={`flex-1 py-1 rounded text-sm font-semibold ${!adventCalendarEnabled ? 'bg-red-500 text-white' : 'bg-gray-400'}`}
                  >
                    OFF
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button 
            disabled={saving} 
            onClick={saveChristmasSettings} 
            className='mt-6 w-full px-6 py-3 rounded-md hover:opacity-90 disabled:opacity-60 text-sm font-semibold bg-green-600 text-white'
          >
            {saving ? 'Saving...' : '💾 Save Christmas Settings'}
          </button>
        </div>

        {/* GENERAL SETTINGS SECTION */}
        <div>
          <h2 className='text-lg font-bold text-white mb-4'>General Settings</h2>
          <div className='space-y-4'>
            <div>
              <label className='text-xs uppercase tracking-wide text-neutral-400'>Store Name</label>
              <input value={storeName} onChange={e=> setStoreName(e.target.value)} className='mt-2 w-full h-11 rounded-md bg-white border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-600 outline-none px-4 text-sm text-black'/>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-2 text-white'>Theme Colors</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                <div>
                  <label className='text-xs uppercase tracking-wide text-neutral-400'>Accent</label>
                  <input type='color' value={accent} onChange={e=> setAccent(e.target.value)} className='mt-2 w-full h-11 rounded-md border-2 border-gray-300'/>
                </div>
                <div>
                  <label className='text-xs uppercase tracking-wide text-neutral-400'>Background</label>
                  <input type='color' value={bgMain} onChange={e=> setBgMain(e.target.value)} className='mt-2 w-full h-11 rounded-md border-2 border-gray-300'/>
                </div>
                <div>
                  <label className='text-xs uppercase tracking-wide text-neutral-400'>Text</label>
                  <input type='color' value={textMain} onChange={e=> setTextMain(e.target.value)} className='mt-2 w-full h-11 rounded-md border-2 border-gray-300'/>
                </div>
              </div>
              <button onClick={save} className='mt-3 px-4 py-2 rounded hover:opacity-90' style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', color: '#ffffff' }}>Save Theme</button>
            </div>
          </div>
        </div>

        {/* PROMOCODES SECTION */}
        <div>
          <h3 className='text-lg font-semibold mb-2 text-white'>Promocodes</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mb-2'>
            <input value={promoCode} onChange={e=>setPromoCode(e.target.value)} placeholder='CODE' className='px-3 py-2 rounded bg-white border-2 outline-none text-black' style={{ borderColor: '#8C0009' }} />
            <input value={promoDiscount} onChange={e=>setPromoDiscount(Number(e.target.value))} placeholder='Discount %' className='px-3 py-2 rounded bg-white border-2 outline-none text-black' style={{ borderColor: '#8C0009' }} />
            <input value={promoDesc} onChange={e=>setPromoDesc(e.target.value)} placeholder='Description' className='px-3 py-2 rounded bg-white border-2 outline-none text-black' style={{ borderColor: '#8C0009' }} />
          </div>
          <button onClick={async ()=>{
            try{
              await createPromo({ code: promoCode, description: promoDesc, discountPercent: promoDiscount });
              toast.success('Promo created');
              const r = await listPromos(); setPromos(r.data);
              setPromoCode(''); setPromoDesc(''); setPromoDiscount(10);
            }catch(e){ toast.error('Failed to create'); }
          }} className='px-4 py-2 rounded hover:opacity-90' style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', color: '#ffffff' }}>Create Promo</button>

          <div className='mt-4'>
            <h4 className='font-semibold mb-2 text-white'>Existing Promos</h4>
            <div className='space-y-2'>
              {promos.map(p=> (
                <div key={p._id} className='p-2 bg-white rounded border border-gray-200 text-black'>
                  <div className='flex justify-between'>
                    <div>
                      <div className='font-semibold'>{p.code}</div>
                      <div className='text-xs text-neutral-400'>{p.description}</div>
                    </div>
                    <div className='text-sm text-neutral-400'>{p.discountPercent}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NEWSLETTER BROADCAST SECTION */}
        <div>
          <h3 className='text-lg font-semibold mb-2 text-white'>Broadcast to Newsletter</h3>
          <input value={broadcastSubj} onChange={e=>setBroadcastSubj(e.target.value)} placeholder='Subject' className='w-full px-3 py-2 rounded bg-white border-2 outline-none text-black mb-2' style={{ borderColor: '#8C0009' }} />
          <textarea value={broadcastMsg} onChange={e=>setBroadcastMsg(e.target.value)} placeholder='Message' className='w-full px-3 py-2 rounded bg-white border-2 outline-none text-black mb-2' rows={4} style={{ borderColor: '#8C0009' }} />
          <button onClick={async ()=>{
            try{
              await sendBroadcast({ subject: broadcastSubj, message: broadcastMsg });
              toast.success('Broadcast sent');
              setBroadcastSubj(''); setBroadcastMsg('');
            }catch(e){ toast.error('Failed to send'); }
          }} className='px-4 py-2 rounded hover:opacity-90' style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', color: '#ffffff' }}>Send Broadcast</button>
        </div>

        {/* SUPPORT SECTION */}
        <div>
          <label className='text-xs uppercase tracking-wide text-neutral-400'>Support Email</label>
          <input value={supportEmail} onChange={e=> setSupportEmail(e.target.value)} className='mt-2 w-full h-11 rounded-md bg-white border-2 focus:ring-2 outline-none px-4 text-sm text-black' style={{ borderColor: '#8C0009' }}/>
        </div>
        <div className='text-xs text-neutral-500'>Supabase URL: {import.meta.env.VITE_SUPABASE_URL?.slice(0,40)}...</div>
      </div>
    </div>
  );
}
