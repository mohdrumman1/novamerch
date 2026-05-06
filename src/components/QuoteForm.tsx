"use client";

import { useState } from "react";

const productOptions = [
  "Drink Bottles",
  "Caps & Apparel",
  "Pens & Office Merch",
  "Tote Bags",
  "Corporate Gift Packs",
  "Sports Club Merch",
  "Not sure yet, help me choose",
];

const budgetOptions = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not sure yet",
];

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("https://formspree.io/f/xvzlrlnv", {
      method: "POST",
      body: new FormData(e.currentTarget),
      headers: { Accept: "application/json" },
    });

    setLoading(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError(true);
    }
  }

  return (
    <section id="quote" className="bg-white py-20 px-6 border-t border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Left: copy */}
          <div>
            <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">
              Get started
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-5">
              Ready to get branded merch sorted?
            </h2>
            <p className="text-[#475569] leading-relaxed mb-8">
              Fill in the form and we will follow up with product options matched to your brief. No commitment needed to get a quote.
            </p>

            <div className="space-y-4 mb-10">
              {[
                "Free product shortlist. No commitment required.",
                "We recommend options suited to your budget",
                "Based in Newcastle, available for local enquiries",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="10" height="10" fill="none" viewBox="0 0 10 10">
                      <path stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 4.5-4.5" />
                    </svg>
                  </div>
                  <p className="text-[#475569] text-sm">{point}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-[#E2E8F0]">
              <p className="text-[#94A3B8] text-xs mb-1">Prefer to email directly?</p>
              <a
                href="mailto:support@novamerchau.com"
                className="text-[#475569] hover:text-[#0F172A] text-sm transition-colors"
              >
                support@novamerchau.com
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {submitted ? (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-10 h-full flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-[#2563EB]/10 rounded-full flex items-center justify-center mb-5">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-[#0F172A] font-bold text-xl mb-2">Enquiry sent.</h3>
                <p className="text-[#475569] text-sm">
                  We will be in touch with product options and a quote. Usually within one business day.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#0F172A] text-xs font-semibold mb-2 uppercase tracking-wider">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Jane Smith"
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#CBD5E1] text-sm outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F172A] text-xs font-semibold mb-2 uppercase tracking-wider">
                      Business or club name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      placeholder="Newcastle FC"
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#CBD5E1] text-sm outline-none transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#0F172A] text-xs font-semibold mb-2 uppercase tracking-wider">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jane@company.com"
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#CBD5E1] text-sm outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F172A] text-xs font-semibold mb-2 uppercase tracking-wider">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0400 000 000"
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#CBD5E1] text-sm outline-none transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#0F172A] text-xs font-semibold mb-2 uppercase tracking-wider">
                    Product type
                  </label>
                  <select
                    name="product"
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] rounded-xl px-4 py-3 text-[#0F172A] text-sm outline-none transition-colors duration-200 cursor-pointer"
                  >
                    {productOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#0F172A] text-xs font-semibold mb-2 uppercase tracking-wider">
                      Approx. quantity
                    </label>
                    <input
                      type="text"
                      name="quantity"
                      placeholder="e.g. 50, 200+"
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#CBD5E1] text-sm outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F172A] text-xs font-semibold mb-2 uppercase tracking-wider">
                      Budget range
                    </label>
                    <select
                      name="budget"
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] rounded-xl px-4 py-3 text-[#0F172A] text-sm outline-none transition-colors duration-200 cursor-pointer"
                    >
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#0F172A] text-xs font-semibold mb-2 uppercase tracking-wider">
                    Anything else to add?
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Event date, logo details, specific requirements..."
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#CBD5E1] text-sm outline-none transition-colors duration-200 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">
                    Something went wrong. Please email us at support@novamerchau.com
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors duration-200 text-base shadow-lg shadow-blue-200"
                >
                  {loading ? "Sending..." : "Send My Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
