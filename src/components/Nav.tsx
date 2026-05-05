"use client";

import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#2a2a2a]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-white font-black text-xl tracking-widest">
          NOVAMERCH
        </a>
        <a
          href="#quote"
          className="bg-[#005FFF] hover:bg-[#0052e0] text-white font-bold text-sm px-6 py-3 rounded-full transition-colors duration-200"
        >
          Get a Free Quote
        </a>
      </div>
    </nav>
  );
}
