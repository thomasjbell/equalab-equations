import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";
import { Inter } from "next/font/google";
import { icons } from "lucide-react";
import { url } from "inspector";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EquaLab Equations - Mathematical Equation Solver",
  description:
    "Interactive equation solver and calculator with exact symbolic computation",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",

  keywords:
    "equations, math, calculator, symbolic computation, physics, engineering",
  authors: [{ name: "EquaLab" }],
  creator: "EquaLab",
  publisher: "EquaLab",
  applicationName: "EquaLab Equations",
  metadataBase: new URL("https://equations.equalab.uk"),
  openGraph: {
    title: "EquaLab Equations",
    description: "Interactive equation solver and calculator",
    siteName: "EquaLab Equations",
    url: "https://equations.equalab.uk",
    type: "website",
  },
  alternates: {
    canonical: "https://equations.equalab.uk",
  },
};

// Structured data for Google sitelinks searchbox
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EquaLab Equations",
  alternateName: "EquaLab Mathematical Equation Solver",
  description:
    "Interactive equation solver and calculator with exact symbolic computation for mathematics, physics, and engineering",
  url: "https://equations.equalab.uk",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://equations.equalab.uk/?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "EquaLab",
    url: "https://equalab.uk",
  },
  mainEntity: {
    "@type": "WebApplication",
    name: "EquaLab Equations",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    description:
      "Mathematical equation solver with symbolic computation capabilities",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="favicon.svg" type="image/svg+xml" />

        {/* Structured Data for Google Sitelinks Searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Additional meta tags for better SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta
          name="google-site-verification"
          content="your-verification-code"
        />
      </head>
      <body className={`dark:bg-gray-900 ${inter.className}`}>
        <AuthProvider>
          <SettingsProvider>
            <Navbar />
            {children}
            <Footer />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
