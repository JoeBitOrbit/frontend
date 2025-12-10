import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageSlider from '../../components/imageSlider';
import { sendOtp, verifyOtp } from '../../services/newsletter';
import { startSocialProof } from '../../utils/socialProof';
import Type3D from '../../components/Type3D';
import Footer from '../../components/Footer';
import ChristmasCalendar from '../../components/ChristmasCalendar';
import { PiHandSwipeLeftDuotone } from 'react-icons/pi';
import { getItem as safeGetItem, setItem as safeSetItem, getItem } from '../../utils/safeStorage';

const slideImages = ['/slide1.jpg','/slide2.jpg','/slide3.jpg'];

function TestimonialsCarousel(){
  const testimonials = [
    { text: "Aiyo, quality ekak superb! Ape wardrobe ekata perfect fit. Worth every rupee machan!", name: "Nimal P.", rating: 5 },
    { text: "Delivery ekath lassana, packing ekath neat. Next order ekath mehentath karanna one!", name: "Dilini S.", rating: 5 },
    { text: "Meka gatte nattan ekka recommend karala. Design eka modern, comfort eka top class!", name: "Kasun R.", rating: 5 },
    { text: "Colombo ehe boutiques walath meka wage quality naha. Online order karanakota me wage service ekak balaporoththu wenna!", name: "Tharushi M.", rating: 5 },
    { text: "Fit ekath perfect, color ekath exactly photo eke wage. Keep up the good work aiya!", name: "Roshan W.", rating: 5 },
    { text: "Price ekata value eka lassana. Material quality eka හොඳයි, washing walath fade wenawa na!", name: "Sanduni A.", rating: 4 },
    { text: "Mehema quality t-shirts Sri Lanka we ganna amarui. Definitely regular customer kenek wenawa!", name: "Chamara L.", rating: 5 },
    { text: "Mage daughter ta gatte frock eka superb! She's wearing it almost everyday now!", name: "Priyanka F.", rating: 5 },
    { text: "Fast delivery Kandy ta. Material ekath soft, color fade wenna naha. Thanks machang!", name: "Saman J.", rating: 5 },
    { text: "Harima lassanai! My friends are asking where I bought this. Sharing your page now!", name: "Nadeesha R.", rating: 5 },
    { text: "Expat living in Sri Lanka - best local brand I've found. Quality rivals European brands!", name: "Marcus D.", rating: 5 },
    { text: "Stitching eka neat, size chart eka accurate. No regrets at all!", name: "Hasini W.", rating: 5 },
    { text: "Galle ehen order kara. 3 days wala awa! Fast & reliable. Thank you team!", name: "Buddhika S.", rating: 5 },
    { text: "Living in Colombo, ordered 3 items. All perfect! Customer service ekath responsive.", name: "Ayesha M.", rating: 5 },
    { text: "Quality to price ratio is amazing. Been shopping here for 6 months now!", name: "Janith P.", rating: 5 },
    { text: "Me wage service ekak balaporoththu wenna. Keep it up! Will recommend to friends.", name: "Thilini K.", rating: 5 },
    { text: "Material thickness eka perfect, washing වලටත් fade wenne naha. Top quality!", name: "Ruwan H.", rating: 5 },
    { text: "Ordered for my son's birthday. He loved it! Thank you for making his day special.", name: "Malani F.", rating: 5 },
    { text: "British expat here - blown away by the quality. Reminds me of M&S back home!", name: "James K.", rating: 5 },
    { text: "Colors exactly photo eke wage! Size ekath perfect fit. Very happy with purchase.", name: "Chaminda A.", rating: 5 },
    { text: "Return policy ekath fair. Customer care team helped me exchange sizes hassle-free.", name: "Dinusha T.", rating: 4 },
    { text: "Kurunegala ehen order kara. Thought delivery takes long but only 4 days! Great!", name: "Nuwan G.", rating: 5 },
    { text: "Living in Negombo. Fast delivery, great packaging. Items came perfectly wrapped!", name: "Shani B.", rating: 5 },
    { text: "Australian living in SL for work. This is now my go-to clothing store. Fantastic!", name: "Emma L.", rating: 5 },
    { text: "Mage family ekatama order kara. Everyone's happy! Quality consistency is impressive.", name: "Lakshitha D.", rating: 5 },
    { text: "Jaffna ta deliver karanna amarui kiyala hitiya. But awa perfectly! Thanks guys!", name: "Rajesh V.", rating: 5 },
    { text: "Designer quality hoda wage! Instagram walath lassanata look wenna. Love it!", name: "Sachini P.", rating: 5 },
    { text: "Second time ordering. Quality never disappoints. Becoming my favorite brand!", name: "Isuru R.", rating: 5 },
    { text: "Dutch expat - impressed by professionalism. Online shopping in SL finally easy!", name: "Johan V.", rating: 5 },
    { text: "Gift ekak wage pack karala dunna. Presentation ekath හොඳයි. Very thoughtful!", name: "Gayani S.", rating: 5 }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffled, setShuffled] = useState([]);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  useEffect(() => {
    // Check if user has already swiped
    const hasSwiped = safeGetItem('testimonials-swiped');
    if (hasSwiped) {
      setShowSwipeHint(false);
    }
  }, []);

  useEffect(() => {
    const shuffledArray = [...testimonials].sort(() => Math.random() - 0.5);
    setShuffled(shuffledArray);
  }, []);

  useEffect(() => {
    if(shuffled.length === 0 || isDragging) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffled.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [shuffled, isDragging]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    if (showSwipeHint) {
      setShowSwipeHint(false);
      safeSetItem('testimonials-swiped', 'true');
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const current = e.targetTouches[0].clientX;
    setTouchEnd(current);
    setDragOffset(current - touchStart);
  };

  const handleTouchEnd = () => {
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 75) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % shuffled.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + shuffled.length) % shuffled.length);
      }
    }
    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleMouseDown = (e) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
    if (showSwipeHint) {
      setShowSwipeHint(false);
      safeSetItem('testimonials-swiped', 'true');
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const current = e.clientX;
    setTouchEnd(current);
    setDragOffset(current - touchStart);
  };

  const handleMouseUp = () => {
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 75) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % shuffled.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + shuffled.length) % shuffled.length);
      }
    }
    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
  };

  if(shuffled.length === 0) return null;

  const getVisibleTestimonials = () => {
    const result = [];
    for(let i = -2; i <= 2; i++){
      const index = (currentIndex + i + shuffled.length) % shuffled.length;
      result.push({ ...shuffled[index], position: i });
    }
    return result;
  };

  return (
    <section className="px-6 md:px-12 lg:px-20 py-12 overflow-hidden">
      <h2 className="text-3xl font-bold mb-10 text-black text-center">What customers say</h2>
      <div 
        className="relative h-80 flex items-center justify-center cursor-grab active:cursor-grabbing select-none" 
        style={{ 
          perspective: '2000px',
          perspectiveOrigin: '50% 50%'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Swipe hint icon */}
        {showSwipeHint && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 animate-pulse pointer-events-none">
            <PiHandSwipeLeftDuotone className="text-red-600 w-12 h-12" />
          </div>
        )}
        {getVisibleTestimonials().map((item) => {
          const isCenter = item.position === 0;
          const dragInfluence = isDragging ? dragOffset * 0.3 : 0;
          const angle = (item.position * 72) + (dragInfluence * 0.15);
          const radius = 500;
          const translateX = Math.sin(angle * Math.PI / 180) * radius;
          const translateZ = Math.cos(angle * Math.PI / 180) * radius - radius;
          const rotateY = angle;
          const scale = isCenter ? 1 : 0.65;
          const opacity = Math.max(0, 1 - Math.abs(item.position) * 0.4);
          const zIndex = Math.round(20 - Math.abs(translateZ));
          
          return (
            <div
              key={item.name}
              className="absolute"
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                width: '340px',
                transition: isDragging ? 'none' : 'transform 1s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.8s ease-in-out',
                transformStyle: 'preserve-3d',
                pointerEvents: isCenter ? 'auto' : 'none',
                backfaceVisibility: 'hidden'
              }}
            >
              <blockquote className={`p-8 rounded-2xl bg-white border-2 shadow-2xl transition-colors duration-300 ${isCenter ? 'border-red-600' : 'border-gray-200'}`} style={{ transformStyle: 'preserve-3d' }}>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-base leading-relaxed min-h-[100px]">"{item.text}"</p>
                <footer className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {item.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-gray-600">— {item.name}</span>
                </footer>
              </blockquote>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FeaturesCarousel(){
  const [currentIndex, setCurrentIndex] = useState(0);
  const features = [
    {
      title: 'Quality First',
      description: 'We source and craft products with uncompromising attention to detail.'
    },
    {
      title: 'Modern Design',
      description: 'Aesthetic, functional, and timeless pieces for everyday use.'
    },
    {
      title: 'Secure Experience',
      description: 'Protected accounts, encrypted access, and reliable order tracking.'
    }
  ];

  const itemsPerPage = 3;
  const canShowNext = currentIndex < (features.length - itemsPerPage);
  const canShowPrev = currentIndex > 0;

  const goNext = () => {
    if(canShowNext) setCurrentIndex(i => i + 1);
  };

  const goPrev = () => {
    if(canShowPrev) setCurrentIndex(i => i - 1);
  };

  const visibleItems = features.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="px-6 md:px-12 lg:px-20 py-12 mb-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-black">Why Choose Nikola</h2>
        {features.length > itemsPerPage && (
          <div className="flex gap-2 md:hidden">
            <button onClick={goPrev} disabled={!canShowPrev} className="p-2 rounded-full border-2 border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
              ←
            </button>
            <button onClick={goNext} disabled={!canShowNext} className="p-2 rounded-full border-2 border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
              →
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleItems.map((feature, idx) => (
          <div key={idx} className="p-8 rounded-xl border border-gray-200 bg-white hover:border-red-600 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-black">{feature.title}</h3>
            <p className="text-base text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedStrip(){
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(()=>{
    axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products')
      .then(r=> setItems(Array.isArray(r.data) ? r.data.slice(0,12) : []))
      .catch(()=>{});
  },[]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const canShowNext = currentIndex < (items.length - itemsPerPage);
  const canShowPrev = currentIndex > 0;

  const goNext = () => {
    if(canShowNext) setCurrentIndex(i => i + itemsPerPage);
  };

  const goPrev = () => {
    if(canShowPrev) setCurrentIndex(i => Math.max(0, i - itemsPerPage));
  };

  if(!items.length) return null;

  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="px-6 md:px-12 lg:px-20 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-black">Featured Picks</h2>
        {items.length > itemsPerPage && (
          <div className="flex gap-2">
            <button onClick={goPrev} disabled={!canShowPrev} className="p-2 rounded-full border-2 border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
              ←
            </button>
            <button onClick={goNext} disabled={!canShowNext} className="p-2 rounded-full border-2 border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
              →
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleItems.map(it => (
          <a key={it._id} href={`/overview/${it._id}`} className="group overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="relative h-80 overflow-hidden bg-gray-100">
              <img src={it.images?.[0]} alt={it.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-5 bg-white">
              <div className="text-base font-semibold text-black group-hover:text-red-600 transition mb-1">{it.name}</div>
              <div className="text-xs text-gray-500 truncate">{it._id}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function HomeLanding(){
  useEffect(()=>{ const stop = startSocialProof(15000); return ()=> stop && stop(); }, []);
  return (
    <div className="w-full h-full overflow-y-auto bg-white text-black">
      {/* Hero + Slider combined */}
      <section 
        className="w-full px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-12 md:pb-20 flex flex-col md:flex-row items-center gap-12 md:gap-20 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/herobg.png)' }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero Text */}
        <div className="flex-1 max-w-xl order-2 md:order-1 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 flex items-center gap-3 flex-wrap" style={{ color: 'white' }}>
            <span style={{ color: 'white' }}>Elevated Fashion Essentials</span>
            <img src="/logo.png" alt="Nikola" className="h-14 md:h-16 object-contain inline-block" />
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'white' }}>
            Timeless silhouettes. Modern tailoring. Discover statement pieces and everyday styles curated for understated luxury. Explore the new collection now.
          </p>
          <div className="flex flex-row flex-wrap gap-4 relative z-10">
            <a href="/products" className="px-6 md:px-7 py-3 rounded-md bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm tracking-wide transition-colors shadow-sm">
              Shop Collection
            </a>
            <a href="/about-us" className="px-6 md:px-7 py-3 rounded-md border border-white/80 hover:border-white text-white font-semibold text-sm tracking-wide transition-colors bg-white/10 backdrop-blur-sm hover:bg-white/20">
              Our Story
            </a>
            {(typeof window !== 'undefined' && getItem('role') === 'admin') && (
              <a href="/admin" className="px-6 md:px-7 py-3 rounded-md flex items-center gap-2 border border-red-600 bg-white hover:bg-red-50 text-black font-semibold text-sm tracking-wide transition-colors">
                {/* Admin icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2a7 7 0 0 0-7 7v4.764a3 3 0 0 1-.879 2.121L2.5 19.5A1.5 1.5 0 0 0 3.964 22h16.072A1.5 1.5 0 0 0 21.5 19.5l-1.621-3.615A3 3 0 0 1 19 13.764V9a7 7 0 0 0-7-7Zm0 4a1 1 0 0 1 1 1v3.268a2 2 0 1 1-2 0V7a1 1 0 0 1 1-1Z" /></svg>
                Admin Panel
              </a>
            )}
          </div>
        </div>
        {/* Slider */}
        <div className="flex-1 max-w-lg w-full order-1 md:order-2 relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg p-6 md:p-8 flex flex-col items-center justify-center">
            <ImageSlider images={slideImages} />
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <FeaturesCarousel />

      {/* Christmas Advent Calendar */}
      <ChristmasCalendar />

      {/* Featured products */}
      <FeaturedStrip />

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* Newsletter */}
      <section className="px-6 md:px-12 lg:px-20 py-12 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-3 text-black">Join our newsletter</h3>
          <p className="text-gray-600 mb-6">Exclusive drops, early access and special discounts. No spam.</p>
          <NewsletterSignup />
        </div>
      </section>
      <Footer />
    </div>
  );
}

function NewsletterSignup(){
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend(){
    if(!email) return toast.error('Please enter email');
    setLoading(true);
    try{
      await sendOtp(email);
      setOtpSent(true);
      toast.success('OTP sent to your email');
    }catch(e){
      toast.error('Failed to send OTP');
    }finally{ setLoading(false); }
  }

  async function handleVerify(){
    if(!otp) return toast.error('Enter OTP');
    setLoading(true);
    try{
      await verifyOtp(email, otp);
      toast.success('Subscribed to newsletter');
      setEmail(''); setOtp(''); setOtpSent(false);
    }catch(e){
      toast.error(e?.response?.data?.message || 'Failed to verify OTP');
    }finally{ setLoading(false); }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="example@email.com" className="px-6 py-4 rounded-md bg-white border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-600 outline-none flex-1 text-base text-black" />
        {!otpSent ? (
          <button onClick={handleSend} disabled={loading} className="px-8 py-4 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold whitespace-nowrap">{loading ? 'Sending...' : 'Subscribe'}</button>
        ) : (
          <div className="flex gap-2">
            <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter OTP" className="px-4 py-3 rounded-md bg-white border-2 border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-600 outline-none flex-1 text-black" />
            <button onClick={handleVerify} disabled={loading} className="px-6 py-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold whitespace-nowrap">{loading ? 'Verifying...' : 'Verify'}</button>
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-3">By subscribing you agree to receive occasional promotional emails. Unsubscribe anytime.</div>
    </div>
  )
}