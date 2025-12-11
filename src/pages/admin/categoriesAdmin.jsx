import { useEffect, useState } from 'react';
import { getItem } from '../../utils/safeStorage';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';

export default function CategoriesAdmin(){
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const token = getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  function load(){
    axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products/categories')
      .then(r => setCategories(r.data))
      .catch(() => toast.error('Failed to load categories'));
  }

  useEffect(() => { 
    load(); 
  }, []);

  function add(){
    if(!name.trim()) return toast.error('Name required');
    axios.post(import.meta.env.VITE_BACKEND_URL + '/api/products/categories', { name, description }, { headers })
      .then(r => { 
        toast.success('Category added'); 
        setName(''); 
        setDescription(''); 
        load(); 
      })
      .catch(err => toast.error(err?.response?.data?.message || 'Failed to add category'));
  }

  function del(id){
    setCategoryToDelete(id);
    setDeleteModalOpen(true);
  }

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-semibold mb-6'>Categories</h1>
      <div className='flex flex-col md:flex-row gap-4 mb-8'>
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder='Category name' 
          className='h-11 px-4 rounded-md bg-white border-2 focus:ring-2 outline-none text-sm text-black' 
          style={{ borderColor: '#8C0009' }}
        />
        <input 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder='Description (optional)' 
          className='h-11 px-4 flex-1 rounded-md bg-white border-2 focus:ring-2 outline-none text-sm text-black' 
          style={{ borderColor: '#8C0009' }}
        />
        <button 
          onClick={add} 
          className='px-6 h-11 rounded-md text-sm font-semibold hover:opacity-90' 
          style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', color: '#ffffff' }}
        >
          Add
        </button>
      </div>
      <div className='grid md:grid-cols-3 gap-6'>
        {categories.map(c => (
          <div 
            key={c._id} 
            className='p-5 rounded-xl bg-white border border-gray-200 transition group' 
            style={{ borderColor: '#e5e7eb' }} 
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8C0009'} 
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            <div className='flex justify-between items-center mb-2'>
              <h2 className='font-semibold'>{c.name}</h2>
              {!c.isDefault && (
                <button 
                  onClick={() => del(c._id)} 
                  className='text-xs px-2 py-1 rounded hover:opacity-90' 
                  style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', color: '#ffffff' }}
                >
                  Delete
                </button>
              )}
            </div>
            <p className='text-xs text-neutral-700 min-h-[32px]'>{c.description || 'No description'}</p>
            <span className='text-[10px] mt-3 inline-block px-2 py-1 rounded bg-gray-100 border border-gray-200 text-black'>
              {c.slug}
            </span>
            {c.isDefault && (
              <span className='text-[10px] mt-2 ml-2 inline-block px-2 py-1 rounded bg-blue-100 border border-blue-200 text-blue-700'>
                Default
              </span>
            )}
          </div>
        ))}
        {!categories.length && <p className='text-sm opacity-70'>No categories yet.</p>}
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={() => {
          if (categoryToDelete) {
            axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/products/categories/${categoryToDelete}`, { headers })
              .then(() => { 
                toast.success('Category deleted'); 
                load(); 
              })
              .catch(() => toast.error('Failed to delete category'))
              .finally(() => {
                setDeleteModalOpen(false);
                setCategoryToDelete(null);
              });
          }
        }}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
}
