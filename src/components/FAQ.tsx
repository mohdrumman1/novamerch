"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Do you have minimum order quantities?",
    answer:
      "No. We do not have minimum order requirements. Whether you need 5 items or 500, just let us know what you are after and we will work with you.",
  },
  {
    question: "Can you help me choose products?",
    answer:
      "Yes, that is what we do. Tell us your business type, rough budget and what you are trying to achieve. We will suggest 3 to 5 product options that suit your situation. No catalogues to scroll through.",
  },
  {
    question: "Can you work with sports clubs?",
    answer:
      "Absolutely. We work with local sports clubs across Newcastle. Whether you need caps, water bottles, bags or apparel for your team, sponsors or members, we can put together a package that fits your club's budget and branding.",
  },
  {
    question: "Do I need print-ready logo files?",
    answer:
      "A vector file such as AI, EPS or PDF works best, but it is not always required. If you only have a JPEG or PNG, send it through and we will let you know if it will work for the product you have in mind.",
  },
  {
    question: "How long does it take?",
    answer:
      "It depends on the product and quantity. We will give you a rough timeframe when we send your product options. If you have a specific date you need them by, let us know early and we will do our best to make it work.",
  },
  {
    question: "Can you source products that are not listed?",
    answer:
      "In most cases, yes. If you have a specific product in mind that is not shown on the site, send us a description or reference image and we will check whether it can be sourced and branded for you.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-[#F8FAFC] py-20 px-6 border-t border-[#E2E8F0]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[#0F172A]">
            Common questions.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-7 py-5 text-left"
              >
                <span className="text-[#0F172A] font-semibold text-base pr-4">
                  {faq.question}
                </span>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 20 20"
                  className={`shrink-0 text-[#2563EB] transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                >
                  <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M5 7.5l5 5 5-5" />
                </svg>
              </button>
              {open === i && (
                <div className="px-7 pb-6">
                  <p className="text-[#475569] text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
