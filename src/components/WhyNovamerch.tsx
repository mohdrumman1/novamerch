const reasons = [
  {
    icon: "💰",
    title: "Better prices",
    description:
      "We source direct from manufacturer. No middlemen, no inflated margins. You get more for your budget.",
  },
  {
    icon: "⚡",
    title: "Mockups in 24 hours",
    description:
      "Send an enquiry today, get a free design mockup tomorrow. See exactly what your merch will look like before you commit.",
  },
  {
    icon: "📍",
    title: "NSW-based",
    description:
      "We know the Newcastle and Sydney market. Easy to reach, fast to respond, and accountable if anything goes wrong.",
  },
  {
    icon: "✅",
    title: "No minimum order nonsense",
    description:
      "Order what you need. Whether you need 10 caps or 500 hoodies, we make it work.",
  },
];

export default function WhyNovamerch() {
  return (
    <section className="bg-[#080808] py-24 px-6 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: heading and CTA */}
          <div>
            <p className="text-[#005FFF] font-semibold text-sm tracking-widest uppercase mb-3">
              Why Novamerch
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Built for businesses
              <br />
              that move fast.
            </h2>
            <p className="text-white/50 leading-relaxed mb-8">
              You should not have to chase a supplier for weeks just to put your
              logo on a cap. We make it fast, affordable, and actually worth
              your time.
            </p>
            <a
              href="#quote"
              className="inline-flex items-center justify-center bg-[#005FFF] hover:bg-[#0052e0] text-white font-bold px-8 py-4 rounded-full transition-colors duration-200"
            >
              Get a Free Quote
            </a>
          </div>

          {/* Right: reasons grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6"
              >
                <div className="text-2xl mb-3">{reason.icon}</div>
                <h3 className="text-white font-bold mb-2">{reason.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
