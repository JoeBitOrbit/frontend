import { useState } from 'react';

import { getItem as safeGetItem, setItem as safeSetItem } from '../../utils/safeStorage';
import { createPromo, listPromos, sendBroadcast } from '../../services/newsletter';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

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



  return (
    <div className='p-8 max-w-4xl'>
      <h1 className='text-2xl font-semibold mb-6 text-white'>Settings</h1>
      <div className='space-y-8'>
        


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
