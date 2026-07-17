import { Footer, Navbar } from "@/components/layout";
import {
  Benefits,
  Faq,
  Features,
  Hero,
  HowItWorks,
  Pricing,
  Statistics,
} from "@/components/sections";
import { getLandingStructuredData } from "@/lib/seo";

export default function HomePage() {
  const structuredData = getLandingStructuredData();

  return (
    <>
      {structuredData.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <Navbar />
      <main id="main-content">
        <Hero />
        <Features />
        <HowItWorks />
        <Statistics />
        <Benefits />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
