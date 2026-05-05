export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#1a1a1a] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand */}
          <div>
            <p className="text-white font-black text-xl tracking-widest mb-2">
              NOVAMERCH
            </p>
            <p className="text-white/30 text-sm">
              Branded merchandise for Newcastle and Sydney businesses.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2 text-sm">
            <a
              href="mailto:support@novamerchau.com"
              className="text-white/50 hover:text-white transition-colors"
            >
              support@novamerchau.com
            </a>
            <a
              href="tel:0422518149"
              className="text-white/50 hover:text-white transition-colors"
            >
              0422 518 149
            </a>
          </div>

          {/* Nav links */}
          <div className="flex gap-6 text-sm">
            <a
              href="#products"
              className="text-white/40 hover:text-white transition-colors"
            >
              Products
            </a>
            <a
              href="#quote"
              className="text-white/40 hover:text-white transition-colors"
            >
              Get a Quote
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} Novamerch. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">Newcastle, NSW, Australia</p>
        </div>
      </div>
    </footer>
  );
}
