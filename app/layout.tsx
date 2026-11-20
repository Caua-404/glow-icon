import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const titulo = "Glow Icon | Eduarda Vieira, unhas com assinatura";
const descricao =
  "Glow Icon é o salão de Eduarda Vieira em Canaã dos Carajás: unhas em gel, fibra, tranças, cílios e sobrancelhas. Agende seu horário.";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: titulo,
  description: descricao,
  applicationName: "Glow Icon",
  authors: [{ name: "Eduarda Vieira" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Glow Icon",
    title: "Glow Icon — unhas com assinatura",
    description: descricao,
    images: [
      {
        url: "/og.jpg?v=equipe",
        width: 1200,
        height: 630,
        alt: "Glow Icon — Eduarda, Larissa, Camila e Bianca. Unhas com assinatura em Canaã dos Carajás - PA.",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glow Icon — unhas com assinatura",
    description: descricao,
    images: ["/og.jpg?v=equipe"],
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F3EE" },
    { media: "(prefers-color-scheme: dark)", color: "#17120E" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
