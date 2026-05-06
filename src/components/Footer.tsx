import Image from "next/image";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#quote" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.svg"
                alt="NovaMerch"
                width={28}
                height={36}
                className="h-7 w-auto brightness-0 invert"
              />
              <span className="text-white font-black text-base tracking-widest">
                NOVAMERCH
              </span>
            </div>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Branded merchandise for Newcastle businesses, clubs and teams.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-widest mb-4">
              Navigate
            </p>
            <div className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[#64748B] hover:text-white text-sm transition-colors duration-200"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-widest mb-4">
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:support@novamerchau.com"
                className="text-[#64748B] hover:text-white text-sm transition-colors duration-200"
              >
                support@novamerchau.com
              </a>
              <a
                href="mailto:support@novamerchau.com"
                className="text-[#64748B] hover:text-white text-sm transition-colors duration-200"
              >
                support@novamerchau.com
              </a>
              <p className="text-[#64748B] text-sm">Newcastle, NSW, Australia</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1E293B] flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[#334155] text-xs">
            &copy; {new Date().getFullYear()} NovaMerch. All rights reserved.
          </p>
          <p className="text-[#334155] text-xs">
            Custom branded merchandise Newcastle
          </p>
        </div>
      </div>
    </footer>
  );
}
