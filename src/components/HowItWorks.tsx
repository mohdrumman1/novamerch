const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Fill in the quote form below. Takes 2 minutes. Tell us the product, quantity, and any branding details you have.",
  },
  {
    number: "02",
    title: "We send free mockups",
    description:
      "Within 24 hours, you get a free design mockup using your logo and colours. No commitment. No upfront cost.",
  },
  {
    number: "03",
    title: "We deliver",
    description:
      "Once you approve the design, we handle everything. Production, quality checks, and delivery straight to your door.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#0D0D0D] py-24 px-6 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-[#005FFF] font-semibold text-sm tracking-widest uppercase mb-3">
            The Process
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Simple from start
            <br />
            to delivery.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(100%+16px)] w-[calc(100%-32px)] h-px bg-gradient-to-r from-[#2a2a2a] to-transparent" />
              )}

              <div className="text-[#005FFF] font-black text-5xl mb-6 opacity-40">
                {step.number}
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                {step.title}
              </h3>
              <p className="text-white/50 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
