export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0D0D0D] overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Blue glow top-right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#005FFF] opacity-[0.08] rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />

      <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-[#005FFF]/10 border border-[#005FFF]/30 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-[#005FFF] rounded-full animate-pulse" />
            <span className="text-[#005FFF] text-sm font-semibold tracking-wide">
              Newcastle and Sydney
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6">
            Your Brand.
            <br />
            <span className="text-[#005FFF]">On Everything.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-xl">
            Branded merchandise for businesses and sports clubs. Hoodies, caps,
            bottles, bags and more. We handle the design. You get the gear.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#quote"
              className="inline-flex items-center justify-center bg-[#005FFF] hover:bg-[#0052e0] text-white font-bold text-base px-8 py-4 rounded-full transition-colors duration-200"
            >
              Get a Free Mockup
            </a>
            <a
              href="#products"
              className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-colors duration-200"
            >
              See What We Make
            </a>
          </div>

          {/* Social proof strip */}
          <div className="flex flex-wrap gap-6 mt-14 pt-10 border-t border-white/10">
            <div>
              <p className="text-3xl font-black text-white">24hrs</p>
              <p className="text-sm text-white/40 mt-1">Free mockup turnaround</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-3xl font-black text-white">Direct</p>
              <p className="text-sm text-white/40 mt-1">Sourced from manufacturer</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-3xl font-black text-white">NSW</p>
              <p className="text-sm text-white/40 mt-1">Based in Newcastle</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
