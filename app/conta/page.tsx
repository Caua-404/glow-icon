import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Minha conta | Glow Icon",
  robots: { index: false },
};

export default function PaginaConta() {
  return (
    <>
      <Header />
      <main className="container-glow min-h-svh py-28">
        <p className="rotulo">Minha conta</p>
        <h1 className="titulo mt-4 text-[clamp(2.75rem,6vw,5rem)] font-light">Em breve</h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-suave">
          A área da cliente ainda não está no ar. Por agora, agende pelo WhatsApp do salão.
        </p>
        <Link href="/#contato" className="btn-acento mt-10 inline-flex">
          Falar com o salão
        </Link>
      </main>
      <Footer />
    </>
  );
}
