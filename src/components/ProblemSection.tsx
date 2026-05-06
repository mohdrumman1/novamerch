const problems = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 6h16M4 10h16M4 14h10" />
      </svg>
    ),
    title: "Too many options",
    description:
      "Endless catalogues with hundreds of products make it hard to know what is actually worth ordering.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Unclear pricing",
    description:
      "Setup fees, screen charges, freight costs. The final invoice rarely matches the quote.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Low-quality products",
    description:
      "Generic promotional items that look cheap and end up in the bin. Not the impression you want to leave.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Too much admin",
    description:
      "Back-and-forth emails, artwork revisions, chasing delivery updates. It takes more time than it should.",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-white py-20 px-6 border-t border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
            Ordering branded merch should not be this hard.
          </h2>
          <p className="text-[#475569]">
            Most branded merchandise experiences are frustrating by design. Here is why businesses put it off.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="text-[#0F172A] font-bold text-base mb-2">{p.title}</h3>
              <p className="text-[#475569] text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
