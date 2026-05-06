const productCards = [
  {
    icon: "💧",
    name: "Drink Bottles",
    tag: "Most popular",
    bg: "from-blue-50 to-sky-100",
    accent: "#2563EB",
  },
  {
    icon: "🧢",
    name: "Caps & Apparel",
    tag: "Sports clubs",
    bg: "from-slate-50 to-slate-100",
    accent: "#0F172A",
  },
  {
    icon: "🖊️",
    name: "Pens & Office",
    tag: "Corporate",
    bg: "from-indigo-50 to-indigo-100",
    accent: "#4338CA",
  },
  {
    icon: "👜",
    name: "Tote Bags",
    tag: "Events",
    bg: "from-teal-50 to-teal-100",
    accent: "#0D9488",
  },
  {
    icon: "📦",
    name: "Gift Packs",
    tag: "Premium",
    bg: "from-amber-50 to-amber-100",
    accent: "#D97706",
  },
];

export default function Hero() {
  return (
    <section className="relative bg-[#F8FAFC] overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Subtle blue glow top-right */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2563EB] opacity-[0.06] rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 border border-[#2563EB]/25 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#2563EB] rounded-full" />
              <span className="text-[#2563EB] text-sm font-semibold">
                Newcastle, NSW
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-[#0F172A] leading-[1.05] tracking-tight mb-5">
              Branded merchandise for{" "}
              <span className="text-[#2563EB]">Newcastle businesses.</span>
            </h1>

            <p className="text-lg text-[#475569] leading-relaxed mb-8 max-w-lg">
              NovaMerch helps local businesses, sports clubs and teams source
              custom branded products including bottles, caps, pens, tote bags,
              apparel and corporate gifts. No hassle, no confusing suppliers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#quote"
                className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-base px-8 py-4 rounded-full transition-colors duration-200 shadow-lg shadow-blue-200"
              >
                Get a Free Merch Quote
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center border-2 border-[#E2E8F0] hover:border-[#2563EB] text-[#0F172A] font-semibold text-base px-8 py-4 rounded-full transition-colors duration-200"
              >
                View Product Ideas
              </a>
            </div>

            {/* Trust line */}
            <p className="text-sm text-[#94A3B8] mt-6">
              Carefully sourced products · Matched to your budget · Managed for you
            </p>
          </div>

          {/* Right: product cards grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {productCards.map((card, i) => (
                <div
                  key={card.name}
                  className={`bg-gradient-to-br ${card.bg} rounded-2xl p-5 shadow-sm border border-white ${
                    i === 4 ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <p className="text-[#0F172A] font-bold text-sm mb-1">{card.name}</p>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${card.accent}18`,
                      color: card.accent,
                    }}
                  >
                    {card.tag}
                  </span>
                </div>
              ))}
              {/* 6th card: CTA card */}
              <div className="bg-[#0F172A] rounded-2xl p-5 shadow-sm flex flex-col justify-between col-span-1">
                <p className="text-white font-bold text-sm mb-2">
                  Not sure what to order?
                </p>
                <a
                  href="#quote"
                  className="text-[#38BDF8] text-sm font-semibold hover:underline"
                >
                  Get a free shortlist →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
