"use client";

import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAgendamento } from "./AgendamentoContext";
import { useContaUi } from "./ContaContext";
import { profissionalPorId } from "@/data/equipe";
import { formatarPreco, servicoPorId } from "@/data/servicos";
import { rotuloHora } from "@/lib/agenda";
import { linkWhatsapp } from "@/data/site";
import {
  cancelarVisita,
  dataBr,
  destaqueRetorno,
  habitosDaCliente,
  horaDeVoltar,
  nomeDaProfissional,
  proximoAgendamento,
  sairDaConta,
  useConta,
  type Retorno,
  type Visita,
} from "@/lib/conta";
import { substituirSacola } from "@/lib/sacola";

export default function MinhaConta() {
  const { cliente, visitas } = useConta();
  const { abrir } = useAgendamento();
  const { abrirEntrar } = useContaUi();

  if (!cliente) {
    return (
      <>
        <Header />
        <main className="container-glow min-h-svh py-28">
          <p className="rotulo">Minha conta</p>
          <h1 className="titulo mt-4 text-[clamp(2.75rem,6vw,5rem)] font-light">
            Entre para ver seus horários
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-suave">
            Dados salvos só neste aparelho. Não pedimos senha.
          </p>
          <button type="button" onClick={abrirEntrar} className="btn-acento mt-10">
            Entrar
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const historico = visitas.filter((v) => v.status !== "cancelado");
  const proximo = proximoAgendamento(cliente.id);
  const retornos = horaDeVoltar(cliente.id);
  const habitos = habitosDaCliente(cliente.id);
  const preferida = habitos.profissionalId ? nomeDaProfissional(habitos.profissionalId) : null;

  function repetir(visita: Visita) {
    substituirSacola(
      visita.itens.map((i) => ({ servicoId: i.servicoId, profissionalId: i.profissionalId })),
    );
    abrir();
  }

  function agendarServico(servicoId: string) {
    substituirSacola([{ servicoId }]);
    abrir();
  }

  return (
    <>
      <Header />
      <main className="container-glow py-28">
        <p className="r-md bg-superficie px-4 py-3 text-sm leading-relaxed">
          Simulação: dados salvos só neste aparelho.
        </p>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="rotulo">Minha conta</p>
            <h1 className="titulo mt-3 text-[clamp(2.75rem,6vw,5rem)] font-light">{cliente.nome}</h1>
            <p className="mt-3 text-sm text-suave">
              WhatsApp {cliente.whatsapp.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}
            </p>
          </div>
          <button type="button" onClick={sairDaConta} className="btn-linha">
            Sair
          </button>
        </div>

        <Proximo visita={proximo} onRepetir={repetir} />

        <section className="mt-16 border-t border-linha pt-12">
          <h2 className="titulo text-4xl font-light">Hora de voltar</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-suave">
            Estimativa a partir do último atendimento. Destacamos o que já venceu ou vence em 7
            dias.
          </p>
          {retornos.length === 0 ? (
            <p className="mt-6 text-sm text-suave">Ainda não há retorno para calcular.</p>
          ) : (
            <ul className="mt-8 divide-y divide-[var(--linha)] border-y border-linha">
              {retornos.map((r) => (
                <LinhaRetorno key={r.servicoId} r={r} onAgendar={() => agendarServico(r.servicoId)} />
              ))}
            </ul>
          )}
        </section>

        <section className="mt-16 border-t border-linha pt-12">
          <h2 className="titulo text-4xl font-light">Meus hábitos</h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <Habito rotulo="Dia da semana" valor={habitos.diaSemana ? capitalizar(habitos.diaSemana) : "Ainda sem padrão"} />
            <Habito rotulo="Período" valor={habitos.periodo ? capitalizar(habitos.periodo) : "Ainda sem padrão"} />
            <Habito
              rotulo="Serviços mais pedidos"
              valor={
                habitos.servicos.length === 0
                  ? "Ainda sem padrão"
                  : habitos.servicos.map((s) => s.nome).join(", ")
              }
            />
            <Habito
              rotulo="Intervalo médio entre visitas"
              valor={
                habitos.intervaloMedio == null
                  ? "Ainda sem padrão"
                  : `${habitos.intervaloMedio} dias`
              }
            />
            <Habito rotulo="Profissional preferida" valor={preferida ?? "Ainda sem padrão"} />
          </dl>
        </section>

        <section className="mt-16 border-t border-linha pt-12">
          <h2 className="titulo text-4xl font-light">Histórico</h2>
          {historico.length === 0 ? (
            <p className="mt-6 text-sm text-suave">Nenhuma visita ainda.</p>
          ) : (
            <ul className="mt-8 space-y-6">
              {historico.map((v) => (
                <li key={v.id} className="r-lg sombra-1 bg-card p-5">
                  <p className="text-sm text-suave">
                    {dataBr(v.dia)} · {rotuloHora(v.inicio)} às {rotuloHora(v.fim)}
                    {v.status === "agendado" ? " · marcado" : ""}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {v.itens.map((i) => (
                      <li key={`${v.id}-${i.servicoId}`} className="flex justify-between gap-4 text-sm">
                        <span>
                          {servicoPorId(i.servicoId)?.nome ?? i.servicoId}
                          <span className="text-suave">
                            {" "}
                            · {profissionalPorId(i.profissionalId as never)?.nome ?? i.profissionalId}
                          </span>
                        </span>
                        <span className="shrink-0">
                          {formatarPreco(i.preco)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => repetir(v)} className="btn-linha mt-5">
                    Repetir este pacote
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function Proximo({ visita, onRepetir }: { visita: Visita | null; onRepetir: (v: Visita) => void }) {
  const [pedido, setPedido] = useState<"cancelar" | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  if (!visita) {
    return (
      <section className="mt-14">
        <h2 className="titulo text-4xl font-light">Próximo agendamento</h2>
        <p className="mt-4 text-sm text-suave">Nenhum horário marcado neste aparelho.</p>
      </section>
    );
  }

  const nomes = visita.itens
    .map((i) => servicoPorId(i.servicoId)?.nome ?? i.servicoId)
    .join(", ");
  const mensagem = `Olá! Gostaria de remarcar meu horário de ${dataBr(visita.dia)} às ${rotuloHora(visita.inicio)} (${nomes}).`;

  return (
    <section className="mt-14">
      <h2 className="titulo text-4xl font-light">Próximo agendamento</h2>
      <article className="r-lg sombra-2 mt-6 bg-card p-5 md:p-6">
        <p className="titulo text-3xl font-normal">
          {dataBr(visita.dia)} · {rotuloHora(visita.inicio)}
        </p>
        <p className="mt-2 text-sm text-suave">
          {nomes}, até {rotuloHora(visita.fim)}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={linkWhatsapp(mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-acento"
          >
            Remarcar
          </a>
          {pedido === "cancelar" ? (
            <>
              <button
                type="button"
                onClick={() => {
                  const r = cancelarVisita(visita.id);
                  if (!r.ok) setErro(r.motivo);
                  setPedido(null);
                }}
                className="btn-linha"
              >
                Confirmar cancelamento
              </button>
              <button type="button" onClick={() => setPedido(null)} className="min-h-11 px-4 text-sm">
                Voltar
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setPedido("cancelar")} className="btn-linha">
              Cancelar
            </button>
          )}
          <button type="button" onClick={() => onRepetir(visita)} className="btn-linha">
            Repetir este pacote
          </button>
        </div>
        {erro && (
          <p role="alert" className="mt-3 text-sm">
            {erro}
          </p>
        )}
        <p className="mt-4 text-xs text-suave">O cancelamento vale neste aparelho.</p>
      </article>
    </section>
  );
}

function LinhaRetorno({ r, onAgendar }: { r: Retorno; onAgendar: () => void }) {
  const s = servicoPorId(r.servicoId);
  const destaque = destaqueRetorno(r);
  const prazo =
    r.falta < 0
      ? `venceu há ${Math.abs(r.falta)} ${Math.abs(r.falta) === 1 ? "dia" : "dias"}`
      : r.falta === 0
        ? "vence hoje"
        : `em ${r.falta} ${r.falta === 1 ? "dia" : "dias"}`;

  return (
    <li className={`flex flex-wrap items-center justify-between gap-3 py-4 ${destaque ? "" : ""}`}>
      <div>
        <p className={destaque ? "font-medium" : ""}>{s?.nome ?? r.servicoId}</p>
        <p className="text-sm text-suave">
          Última {dataBr(r.ultima)} · voltar {dataBr(r.prevista)} · {prazo}
        </p>
      </div>
      <button type="button" onClick={onAgendar} className="btn-linha !min-h-10 !px-4">
        Agendar de novo
      </button>
    </li>
  );
}

function Habito({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="rotulo">{rotulo}</dt>
      <dd className="titulo mt-2 text-3xl font-normal">{valor}</dd>
    </div>
  );
}

function capitalizar(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}
