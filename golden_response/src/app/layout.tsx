import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example-pharma.com";
const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Example Pharma";

export const metadata: Metadata = {
  title: `${companyName} Medical Information`,
  description: "Secure medical information request platform for healthcare professionals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: companyName,
    url: siteUrl,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "medical information",
      availableLanguage: ["en"],
    },
  };

  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
