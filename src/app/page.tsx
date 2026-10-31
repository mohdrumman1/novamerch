import Nav from "@/components/Nav";
import StudioHome from "@/components/StudioHome";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import { faqs } from "@/lib/faqs";

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          }),
        }}
      />
      <Nav />
      <StudioHome />
      <QuoteForm />
      <Footer />
    </main>
  );
}
