import { useState, useEffect } from "react";

export default function ImageSlider({ images }) {
    const [active, setActive] = useState(0);

    // auto advance
    useEffect(()=>{
        const id = setInterval(()=>{
            setActive(a => (a + 1) % images.length);
        }, 4000);
        return ()=> clearInterval(id);
    }, [images.length]);

    return (
        <div className="w-full max-w-xl flex flex-col items-center">
            <div className="w-full aspect-[4/3] bg-white flex items-center justify-center rounded-xl overflow-hidden border border-gray-200">
                <img src={images[active]} alt="slide" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-row gap-3 mt-6">
                {images.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Go to slide ${i+1}`}
                        onClick={()=> setActive(i)}
                        className={`w-2.5 h-2.5 rounded-full transition ${active===i? 'bg-red-600 scale-110' : 'bg-neutral-600 hover:bg-red-500'}`}
                    />
                ))}
            </div>
        </div>
    );
}