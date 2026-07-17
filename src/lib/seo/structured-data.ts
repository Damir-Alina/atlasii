import { FAQ_ITEMS, SITE_CONFIG } from "@/lib/constants";

export function getLandingStructuredData() {
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer",
        name: "Бесплатный план",
        price: "0",
        priceCurrency: "KZT",
      },
      {
        "@type": "Offer",
        name: "Premium",
        price: "2490",
        priceCurrency: "KZT",
      },
    ],
    inLanguage: "ru",
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return [softwareApplication, faqPage];
}
