"use client";

import { useState, FormEvent } from "react";

const productOptions = [
  "Hoodies and Tees",
  "Caps and Hats",
  "Drink Bottles",
  "Bags",
  "Pens and Stationery",
  "Gift and Brand Boxes",
  "Other / Not sure yet",
];

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    // Replace YOUR_FORM_ID with your Formspree form ID
    const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    setLoading(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("Something went wrong. Please email us at support@novamerchau.com");
    }
  }

  return (
    <section
      id="quote"
      className="bg-[#0D0D0D] py-24 px-6 border-t border-[#1a1a1a]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Copy */}
          <div>
            <p className="text-[#005FFF] font-semibold text-sm tracking-widest uppercase mb-3">
              Get Started
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Get a free quote
              <br />
              in 24 hours.
            </h2>
            <p className="text-white/50 leading-relaxed mb-8">
              Tell us what you are after. We will get back to you within 24
              hours with a quote and some design ideas. No pressure, no
              obligation.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#005FFF]/20 flex items-center justify-center mt-0.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#005FFF]" />
                </div>
                <p className="text-white/60 text-sm">
                  Free mockup, no commitment required
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#005FFF]/20 flex items-center justify-center mt-0.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#005FFF]" />
                </div>
                <p className="text-white/60 text-sm">
                  Response within 24 hours, usually same day
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#005FFF]/20 flex items-center justify-center mt-0.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#005FFF]" />
                </div>
                <p className="text-white/60 text-sm">
                  Direct pricing, no hidden fees
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-[#2a2a2a]">
              <p className="text-white/30 text-xs mb-1">Prefer to email us directly?</p>
              <a
                href="mailto:support@novamerchau.com"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                support@novamerchau.com
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div className="bg-[#111111] border border-[#005FFF]/30 rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-[#005FFF]/10 rounded-full flex items-center justify-center mb-5">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">
                  Enquiry sent.
                </h3>
                <p className="text-white/50 text-sm">
                  We will be in touch within 24 hours with a quote and some
                  ideas.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="John Smith"
                      className="w-full bg-[#0D0D0D] border border-[#2a2a2a] focus:border-[#005FFF] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      placeholder="Acme Pty Ltd"
                      className="w-full bg-[#0D0D0D] border border-[#2a2a2a] focus:border-[#005FFF] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john@company.com"
                      className="w-full bg-[#0D0D0D] border border-[#2a2a2a] focus:border-[#005FFF] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0400 000 000"
                      className="w-full bg-[#0D0D0D] border border-[#2a2a2a] focus:border-[#005FFF] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                    Product Interest
                  </label>
                  <select
                    name="product"
                    className="w-full bg-[#0D0D0D] border border-[#2a2a2a] focus:border-[#005FFF] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors duration-200 appearance-none cursor-pointer"
                  >
                    {productOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#111111]">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                    Tell us more
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Quantity, colours, any branding details you have..."
                    className="w-full bg-[#0D0D0D] border border-[#2a2a2a] focus:border-[#005FFF] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors duration-200 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#005FFF] hover:bg-[#0052e0] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors duration-200 text-base"
                >
                  {loading ? "Sending..." : "Send My Enquiry"}
                </button>

                <p className="text-white/20 text-xs text-center">
                  We will not spam you. Ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
