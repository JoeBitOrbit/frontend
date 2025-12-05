import Footer from '../../components/Footer';

export default function AboutPage(){
  return (
    <div className="w-full h-full overflow-y-auto p-8 md:p-14 bg-white text-black">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold text-black">About Nikola</h1>
        <p className="leading-relaxed text-lg text-gray-700">Nikola is a modern collection platform focused on delivering high quality, performance-driven products with a distinctive red & black aesthetic. We combine sustainable sourcing, meticulous manufacturing standards, and contemporary design language to bring you items that last and inspire.</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-md">
            <h3 className="font-semibold mb-2">Mission</h3>
            <p className="text-sm text-gray-600">Empower customers through durable, functional design and transparent practices.</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-md">
            <h3 className="font-semibold mb-2">Values</h3>
            <p className="text-sm text-gray-600">Integrity, innovation, accessibility, and a relentless focus on user experience.</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-md">
            <h3 className="font-semibold mb-2">Sustainability</h3>
            <p className="text-sm text-gray-600">Continuous improvement in material selection, packaging, and logistics to reduce impact.</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-4">Why Choose Us</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
          <li>Curated catalogue with consistent quality benchmarks.</li>
          <li>Responsive support and transparent shipping updates.</li>
          <li>Secure authentication and protected user data flows.</li>
          <li>Forward-looking roadmap including personalization and AI-powered recommendations.</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
}