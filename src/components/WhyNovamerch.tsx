const reasons = [
  "Simple recommendations instead of overwhelming catalogues",
  "Product options matched to your budget and what you need them for",
  "Suitable for small teams, local businesses and growing companies",
  "Clear communication from quote to delivery",
  "Based around Newcastle and focused on local business relationships",
];

export default function WhyNovamerch() {
  return (
    <section className="bg-white py-20 px-6 border-t border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">
              Why NovaMerch
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-5">
              Why local businesses choose NovaMerch.
            </h2>
            <p className="text-[#475569] leading-relaxed mb-8">
              You should not have to chase a supplier for weeks just to put your logo on a product. We keep it simple and handle everything for you.
            </p>
            <a
              href="#quote"
              className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold px-8 py-4 rounded-full transition-colors duration-200 shadow-lg shadow-blue-200"
            >
              Get a Free Quote
            </a>
          </div>

          {/* Right: checklist */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-8 space-y-5">
            {reasons.map((reason) => (
              <div key={reason} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
                    <path stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                  </svg>
                </div>
                <p className="text-[#0F172A] font-medium text-sm leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
