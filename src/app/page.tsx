import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import Products from "@/components/Products";
import Industries from "@/components/Industries";
import ShortlistCTA from "@/components/ShortlistCTA";
import WhyNovamerch from "@/components/WhyNovamerch";
import FAQ from "@/components/FAQ";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <HowItWorks />
      <Products />
      <Industries />
      <ShortlistCTA />
      <WhyNovamerch />
      <FAQ />
      <QuoteForm />
      <Footer />
    </main>
  );
}
