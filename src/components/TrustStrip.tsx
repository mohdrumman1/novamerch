const items = [
  "Drink Bottles",
  "Caps",
  "Pens",
  "Apparel",
  "Tote Bags",
  "Corporate Gifts",
  "Event Packs",
];

export default function TrustStrip() {
  return (
    <section className="bg-[#0F172A] py-4 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
        <p className="text-[#94A3B8] text-sm font-medium shrink-0 text-center sm:text-left">
          For businesses, teams and clubs across Newcastle
        </p>
        <div className="w-px bg-[#1E293B] hidden sm:block self-stretch" />
        <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
          {items.map((item) => (
            <span
              key={item}
              className="text-[#38BDF8] text-sm font-semibold"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
