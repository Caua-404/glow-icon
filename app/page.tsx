import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Servicos from "@/components/Servicos";
import Equipe from "@/components/Equipe";
import Estudio from "@/components/Estudio";
import Inspiracoes from "@/components/Inspiracoes";
import ComoFunciona from "@/components/ComoFunciona";
import Contato from "@/components/Contato";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Servicos />
        <Equipe />
        <Estudio />
        <Inspiracoes />
        <ComoFunciona />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
