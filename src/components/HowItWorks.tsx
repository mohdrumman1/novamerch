const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Fill in the quote form in two minutes. Share your logo, business type, rough quantity and budget. No need to have everything figured out.",
  },
  {
    number: "02",
    title: "We recommend product options",
    description:
      "We suggest 3 to 5 product options that suit your audience, budget and what you are using them for. Simple recommendations, not a catalogue.",
  },
  {
    number: "03",
    title: "You approve and we handle the rest",
    description:
      "Once you are happy with the options, we take care of production and delivery. We keep you updated along the way.",
  },
];

export default function HowItWorks() {
  return (
    <section id="process" className="bg-[#F8FAFC] py-20 px-6 border-t border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
            We make the whole process simple.
          </h2>
          <p className="text-[#475569]">
            Three steps from first enquiry to branded merch in your hands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm"
            >
              {/* Connector arrow on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-8 -right-4 z-10 items-center justify-center w-8 h-8">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </div>
              )}
              <div className="text-[#2563EB] font-black text-4xl mb-5 opacity-30">
                {step.number}
              </div>
              <h3 className="text-[#0F172A] font-bold text-lg mb-3">{step.title}</h3>
              <p className="text-[#475569] text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
