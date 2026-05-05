const products = [
  {
    icon: "👕",
    name: "Hoodies and Tees",
    description:
      "Your logo on premium cotton. Perfect for teams, events, and giveaways.",
  },
  {
    icon: "🧢",
    name: "Caps and Hats",
    description:
      "Embroidered or printed. Structured caps, dad hats, beanies. Built to last.",
  },
  {
    icon: "💧",
    name: "Drink Bottles",
    description:
      "Insulated stainless bottles your clients will actually use every day.",
  },
  {
    icon: "🎒",
    name: "Bags",
    description:
      "Tote bags, backpacks, and drawstring bags. Great for events and onboarding kits.",
  },
  {
    icon: "🖊️",
    name: "Pens and Stationery",
    description:
      "Branded pens, notebooks, and desk gear. Simple, practical, always in use.",
  },
  {
    icon: "📦",
    name: "Gift and Brand Boxes",
    description:
      "Custom branded packaging for client gifts, staff packs, and new starter kits.",
  },
];

export default function Products() {
  return (
    <section id="products" className="bg-[#0D0D0D] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-[#005FFF] font-semibold text-sm tracking-widest uppercase mb-3">
            What We Make
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Merch your team will
            <br />
            actually want to wear.
          </h2>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.name}
              className="group bg-[#111111] border border-[#2a2a2a] hover:border-[#005FFF]/40 rounded-2xl p-8 transition-all duration-300"
            >
              <div className="text-4xl mb-5">{product.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">
                {product.name}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-white/40 text-sm mb-4">
            Not seeing what you need? We source almost anything with your
            branding on it.
          </p>
          <a
            href="#quote"
            className="inline-flex items-center gap-2 text-[#005FFF] font-semibold hover:underline text-sm"
          >
            Ask us about a custom product
            <span>&#8594;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
