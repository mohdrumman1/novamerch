const products = [
  {
    icon: "💧",
    name: "Drink Bottles",
    description:
      "Insulated stainless bottles and reusable drink bottles with your logo. A daily-use product that keeps your brand front of mind.",
    tags: ["Sports clubs", "Corporate"],
  },
  {
    icon: "🧢",
    name: "Caps & Apparel",
    description:
      "Embroidered caps, printed tees, hoodies and vests. Product options suited to sports teams, tradies and corporate use.",
    tags: ["Teams", "Uniforms"],
  },
  {
    icon: "🖊️",
    name: "Pens & Office Merch",
    description:
      "Branded pens, notebooks and desk accessories. Simple and practical items that work for client gifts and conference packs.",
    tags: ["Corporate", "Events"],
  },
  {
    icon: "👜",
    name: "Tote Bags",
    description:
      "Cotton and non-woven tote bags with your branding. Useful for events, retail, markets and staff welcome packs.",
    tags: ["Events", "Retail"],
  },
  {
    icon: "📦",
    name: "Corporate Gift Packs",
    description:
      "Curated branded gift sets for clients, new starters and team rewards. We can suggest product combinations that suit your budget.",
    tags: ["Premium", "Gifts"],
  },
  {
    icon: "🏆",
    name: "Sports Club Merch",
    description:
      "Caps, bottles, bags and apparel for clubs and sporting teams. Suitable for training gear, sponsor giveaways and club merchandise.",
    tags: ["Clubs", "Sponsorship"],
  },
];

export default function Products() {
  return (
    <section id="products" className="bg-white py-20 px-6 border-t border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-12">
          <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">
            Product categories
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
            Popular merch for local teams and businesses.
          </h2>
          <p className="text-[#475569]">
            We source product options across all major categories. If you do not see what you need, just ask.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.name}
              className="group bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-[#2563EB]/30 hover:shadow-md rounded-2xl p-7 transition-all duration-300"
            >
              <div className="text-4xl mb-5">{product.icon}</div>
              <h3 className="text-[#0F172A] font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-[#475569] text-sm leading-relaxed mb-4">
                {product.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#94A3B8] text-sm mb-3">
            Looking for something not listed? We can source almost anything with your branding.
          </p>
          <a
            href="#quote"
            className="inline-flex items-center gap-1.5 text-[#2563EB] font-semibold text-sm hover:underline"
          >
            Ask about a custom product →
          </a>
        </div>
      </div>
    </section>
  );
}
