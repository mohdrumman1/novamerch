export default function ShortlistCTA() {
  return (
    <section className="bg-[#2563EB] py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Not sure what to order? Start with a free merch shortlist.
        </h2>
        <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Send us your logo, business type and rough budget. We will suggest 3 to 5 branded product ideas that suit your audience, quantity and price range.
        </p>
        <a
          href="#quote"
          className="inline-flex items-center justify-center bg-white text-[#2563EB] font-bold text-base px-8 py-4 rounded-full hover:bg-blue-50 transition-colors duration-200 shadow-lg"
        >
          Request My Free Shortlist
        </a>
        <p className="text-blue-200 text-sm mt-4">No commitment. No upfront cost.</p>
      </div>
    </section>
  );
}
