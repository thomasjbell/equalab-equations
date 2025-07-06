import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "EquaLab Equations",
  description: "Interactive equation solver and calculator",
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