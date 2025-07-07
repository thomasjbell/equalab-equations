import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "EquaLab Equations - Mathematical Equation Solver",
  description: "Interactive equation solver and calculator with exact symbolic computation",
  keywords: "equations, math, calculator, symbolic computation, physics, engineering",
  authors: [{ name: "EquaLab" }],
  creator: "EquaLab",
  publisher: "EquaLab",
  applicationName: "EquaLab Equations",
  metadataBase: new URL('https://equations.equalab.uk'),
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