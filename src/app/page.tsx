import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HeroContent from "@/components/HeroContent";
import TrustStrip from "@/components/TrustStrip";
import WhatYouGet from "@/components/WhatYouGet";
import HowItWorks from "@/components/HowItWorks";
import Products from "@/components/Products";
import Industries from "@/components/Industries";
import ShortlistCTA from "@/components/ShortlistCTA";
import FAQ from "@/components/FAQ";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <HeroContent />
      <TrustStrip />
      <WhatYouGet />
      <HowItWorks />
      <Products />
      <Industries />
      <ShortlistCTA />
      <FAQ />
      <QuoteForm />
      <Footer />
    </main>
  );
}
