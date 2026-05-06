const industries = [
  {
    icon: "⚽",
    name: "Sports Clubs",
    description:
      "Caps, bottles, bags and apparel for football clubs, cricket teams, netball associations and more. Great for member packs and sponsor giveaways.",
  },
  {
    icon: "🏗️",
    name: "Construction Companies",
    description:
      "Hi-vis branded workwear, hard hat stickers, water bottles and safety gear. Keep your crew looking professional on site.",
  },
  {
    icon: "🏠",
    name: "Real Estate Agencies",
    description:
      "Branded gifts for open homes, settlement days and client thank-yous. A simple way to stay front of mind with buyers and vendors.",
  },
  {
    icon: "⚖️",
    name: "Legal & Finance Firms",
    description:
      "Polished branded stationery, corporate gift packs and client welcome kits. Professional products that reflect your firm's standards.",
  },
  {
    icon: "🏥",
    name: "Healthcare Clinics",
    description:
      "Branded pens, notepads, bags and promotional items for clinics, allied health practices and medical teams.",
  },
];

export default function Industries() {
  return (
    <section id="industries" className="bg-[#F8FAFC] py-20 px-6 border-t border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-12">
          <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">
            Who we work with
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
            Built for the businesses and teams around Newcastle.
          </h2>
          <p className="text-[#475569]">
            Whether you run a construction company or a local footy club, we can suggest products that suit your audience and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((ind) => (
            <div
              key={ind.name}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-[#2563EB]/30 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{ind.icon}</div>
              <h3 className="text-[#0F172A] font-bold text-base mb-2">{ind.name}</h3>
              <p className="text-[#475569] text-sm leading-relaxed">{ind.description}</p>
            </div>
          ))}
          {/* CTA card */}
          <div className="bg-[#0F172A] rounded-2xl p-7 flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-white font-bold text-base mb-2">Not on the list?</p>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                We work with all kinds of Newcastle businesses and organisations. Get in touch and we will work out what suits you.
              </p>
            </div>
            <a
              href="#quote"
              className="mt-6 inline-flex items-center gap-1.5 text-[#38BDF8] font-semibold text-sm hover:underline"
            >
              Get a free quote →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
