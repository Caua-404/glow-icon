"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatarTelefone } from "@/lib/agenda";
import {
  CODIGO_DEMO,
  cadastrarCliente,
  entrarComWhatsapp,
  whatsappDemoExibido,
} from "@/lib/conta";

type Modo = "entrar" | "cadastrar";

type Props = { aberto: boolean; onFechar: () => void };

export default function EntrarModal({ aberto, onFechar }: Props) {
  return <AnimatePresence>{aberto && <Painel onFechar={onFechar} />}</AnimatePresence>;
}

function Painel({ onFechar }: { onFechar: () => void }) {
  const dialogo = useRef<HTMLDivElement>(null);
  const [modo, setModo] = useState<Modo>("entrar");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [codigo, setCodigo] = useState("");
  const [aniversario, setAniversario] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogo.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const r =
      modo === "entrar"
        ? entrarComWhatsapp(whatsapp, codigo)
        : cadastrarCliente({ nome, whatsapp, aniversario });
    if (!r.ok) {
      setErro(r.motivo);
      return;
    }
    onFechar();
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[color-mix(in_srgb,var(--tinta)_55%,transparent)] sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onFechar}
    >
      <motion.div
        ref={dialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby="entrar-titulo"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onFechar()}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="sombra-3 flex max-h-[92svh] w-full max-w-md flex-col overflow-hidden rounded-t-[var(--r-lg)] bg-fundo outline-none sm:rounded-[var(--r-lg)]"
      >
        <div className="flex items-center justify-between border-b border-linha px-5 py-3 sm:px-8">
          <p className="rotulo">Conta</p>
          <button type="button" onClick={onFechar} className="min-h-11 px-2 text-sm">
            Fechar
          </button>
        </div>
        <p className="border-b border-linha bg-superficie px-5 py-3 text-xs leading-relaxed text-suave sm:px-8">
          Simulação: dados salvos só neste aparelho. Não pedimos senha.
        </p>

        <form onSubmit={enviar} noValidate className="overflow-y-auto px-5 py-8 sm:px-8">
          <h2 id="entrar-titulo" className="titulo text-4xl font-light">
            {modo === "entrar" ? "Entrar" : "Criar conta"}
          </h2>

          <div className="mt-6 space-y-5">
            {modo === "cadastrar" && (
              <Campo
                id="conta-nome"
                rotulo="Nome"
                type="text"
                autoComplete="name"
                value={nome}
                onChange={setNome}
              />
            )}
            <Campo
              id="conta-whats"
              rotulo="WhatsApp"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(00) 00000-0000"
              value={whatsapp}
              onChange={(v) => setWhatsapp(formatarTelefone(v))}
            />
            {modo === "entrar" && (
              <div>
                <label htmlFor="conta-codigo" className="rotulo block">
                  Código de acesso
                </label>
                <input
                  id="conta-codigo"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="r-md mt-2 min-h-12 w-full border border-linha bg-card px-4 text-base outline-none focus:border-polish focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--polish)_30%,transparent)]"
                />
                <p className="mt-2 text-xs leading-relaxed text-suave">
                  O código é {CODIGO_DEMO}. Para ver a conta de exemplo, use o WhatsApp{" "}
                  {whatsappDemoExibido()}.
                </p>
              </div>
            )}
            {modo === "cadastrar" && (
              <Campo
                id="conta-niver"
                rotulo="Data de aniversário (opcional)"
                type="date"
                value={aniversario}
                onChange={setAniversario}
              />
            )}
          </div>

          {erro && (
            <p role="alert" className="mt-4 text-sm">
              {erro}
            </p>
          )}

          <button type="submit" className="btn-acento mt-8 w-full">
            {modo === "entrar" ? "Entrar" : "Criar conta"}
          </button>
          <button
            type="button"
            onClick={() => {
              setErro(null);
              setModo(modo === "entrar" ? "cadastrar" : "entrar");
            }}
            className="btn-linha mt-3 w-full"
          >
            {modo === "entrar" ? "Criar conta" : "Já tenho conta"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Campo({
  id,
  rotulo,
  value,
  onChange,
  ...rest
}: {
  id: string;
  rotulo: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id">) {
  return (
    <div>
      <label htmlFor={id} className="rotulo block">
        {rotulo}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="r-md mt-2 min-h-12 w-full border border-linha bg-card px-4 text-base outline-none focus:border-polish focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--polish)_30%,transparent)]"
        {...rest}
      />
    </div>
  );
}
