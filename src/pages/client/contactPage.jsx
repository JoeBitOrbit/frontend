import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Footer from '../../components/Footer';

export default function ContactPage(){
  const [form,setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [loading,setLoading] = useState(false);
  const [sent,setSent] = useState(false);

  function update(field, value){ setForm(f=> ({...f,[field]:value})) }

  async function submit(e){
    e.preventDefault();
    if(!form.name || !form.email || !form.subject || !form.message){
      toast.error('All fields are required');
      return;
    }
    if(!form.email.includes('@')){
      toast.error('Please enter a valid email');
      return;
    }
    setLoading(true);
    try{
      await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/tickets', form);
      toast.success('Message sent successfully');
      setForm({ name:'', email:'', subject:'', message:'' });
      setSent(true);
    }catch(err){
      toast.error('Failed to send message');
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-white text-black">
      <div className="p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Nikola</h1>
          <p className="mb-8 text-sm text-gray-600">Questions, feedback, or support requests—drop us a message and we will get back to you soon.</p>
        <form onSubmit={submit} className="grid gap-6 w-full">
          <div className="grid grid-cols-2 gap-6 w-full">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Name *</label>
              <input value={form.name} onChange={e=> update('name', e.target.value)} className="w-full px-4 py-4 text-base rounded-md bg-white text-black border-2 border-red-600 focus:border-red-700 outline-none" required/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email *</label>
              <input type="email" value={form.email} onChange={e=> update('email', e.target.value)} className="w-full px-4 py-4 text-base rounded-md bg-white text-black border-2 border-red-600 focus:border-red-700 outline-none" required/>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium">Subject *</label>
            <input value={form.subject} onChange={e=> update('subject', e.target.value)} className="w-full px-4 py-4 text-base rounded-md bg-white text-black border-2 border-red-600 focus:border-red-700 outline-none" required/>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium">Message *</label>
            <textarea value={form.message} onChange={e=> update('message', e.target.value)} rows={8} className="w-full px-4 py-4 text-base rounded-md bg-white text-black border-2 border-red-600 focus:border-red-700 outline-none resize-y" required/>
          </div>
          <div className="flex items-center gap-4">
            <button disabled={loading} className="px-6 py-3 rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold transition shadow-md">
              {loading? 'Sending...' : 'Send Message'}
            </button>
            {sent && <span className="text-sm text-green-600">Delivered ✓</span>}
          </div>
        </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}