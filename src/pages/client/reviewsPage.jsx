import { useState, useEffect } from 'react';
import { getItem, setItem } from '../../utils/safeStorage';

const initialReviews = [
  { id:1, name:'Ava', rating:5, text:'Premium feel and fast delivery. Love the design aesthetics.' },
  { id:2, name:'Liam', rating:4, text:'Quality exceeded expectations. Would like more color options.' },
  { id:3, name:'Noah', rating:5, text:'Sturdy build, looks exactly like the photos. Highly recommended.' }
];

export default function ReviewsPage(){
  const [reviews,setReviews] = useState(initialReviews);
  const [draft,setDraft] = useState({ name:'', text:'', rating:5 });

  useEffect(() => {
    const saved = getItem('reviews');
    if(saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch(e) {
        setReviews(initialReviews);
      }
    }
  }, []);

  function submit(e){
    e.preventDefault();
    if(!draft.name || !draft.text) return;
    const newReview = { id: Date.now(), ...draft };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    setItem('reviews', JSON.stringify(updated));
    setDraft({ name:'', text:'', rating:5 });
  }

  return (
    <div className="w-full h-full overflow-y-auto p-6 md:p-12 lg:p-16 bg-white text-black">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <h1 className="text-4xl font-extrabold">Customer Reviews</h1>
        
        <div className="grid gap-4">
          {reviews.map(r=> (
            <div key={r.id} className="p-6 rounded-lg border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <span className="font-semibold text-lg text-black">{r.name}</span>
                <span className="text-sm text-red-600 font-semibold">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-base text-gray-700 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-6 p-8 md:p-10 rounded-lg border-2 border-red-600 bg-white shadow-lg">
          <h2 className="text-3xl font-bold text-black">Add a Review</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              placeholder="Your name" 
              value={draft.name} 
              onChange={e=> setDraft(d=> ({...d, name:e.target.value}))} 
              className="px-5 py-4 text-base rounded-lg bg-white text-black border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-200 outline-none transition" 
            />
            <div className="flex items-center gap-4">
              <label className="text-base font-semibold whitespace-nowrap">Rating</label>
              <select 
                value={draft.rating} 
                onChange={e=> setDraft(d=> ({...d, rating:Number(e.target.value)}))} 
                className="flex-1 px-4 py-3 text-base rounded-lg bg-white text-black border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-200 outline-none transition"
              >
                {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n} Star{n!==1?'s':''}</option>)}
              </select>
            </div>
          </div>

          <textarea 
            placeholder="Share your experience" 
            value={draft.text} 
            rows={6} 
            onChange={e=> setDraft(d=> ({...d, text:e.target.value}))} 
            className="px-5 py-4 text-base rounded-lg bg-white text-black border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-200 outline-none resize-none transition" 
          />

          <button className="px-8 py-4 text-lg font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition shadow-md">Submit Review</button>
        </form>
      </div>
    </div>
  );
}