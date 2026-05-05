import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import HowItWorks from "@/components/HowItWorks";
import WhyNovamerch from "@/components/WhyNovamerch";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Products />
      <HowItWorks />
      <WhyNovamerch />
      <QuoteForm />
      <Footer />
    </main>
  );
}
