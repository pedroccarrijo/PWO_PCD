import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { candidatoService } from "../api/api";

interface CandidatoApi {
  id_candidato: number;
  nome?: string;
  sobrenome?: string;
  email?: string;
  telefone?: string;
  deficiencia?: string;
  subtipo?: string;
  cpf?: string;
  laudo_url?: string;
  descricao_perfil?: string;
}

export default function DetalheCandidatoEmpresa() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation() as { state?: { candidato?: CandidatoApi } };

  const [candidato, setCandidato] = useState<CandidatoApi | null>(
    location.state?.candidato || null
  );
  const [loading, setLoading] = useState(!candidato);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregar = async () => {
      if (candidato || !id) return;

      try {
        setLoading(true);
        setErro("");
        const resp = await candidatoService.getById(Number(id));
        setCandidato(resp.data);
      } catch (err: any) {
        console.error(err);
        const msg =
          err?.response?.data ||
          "Não foi possível carregar os dados deste candidato.";
        setErro(msg);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [id, candidato]);

  const nomeCompleto = candidato
    ? [candidato.nome, candidato.sobrenome].filter(Boolean).join(" ")
    : "";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Topo */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="text-xs text-slate-500 hover:text-slate-700 mr-1"
            >
              ⟵ Voltar
            </button>

            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              PWO
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm text-slate-900">
                ConectPCD · Candidato
              </span>
              <span className="text-[10px] text-slate-500">
                Detalhes do perfil PCD
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-500 shadow-sm">
            Carregando informações do candidato...
          </div>
        )}

        {erro && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600 shadow-sm">
            {erro}
          </div>
        )}

        {!loading && !erro && candidato && (
          <>
            {/* Card principal do candidato */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-4">
              {/* “Foto” / avatar simples */}
              <div className="flex sm:flex-col items-center sm:items-start gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center text-lg font-semibold shadow-md">
                  {nomeCompleto
                    ? nomeCompleto.charAt(0).toUpperCase()
                    : "P"}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                    {nomeCompleto || `Candidato #${candidato.id_candidato}`}
                  </h1>
                  <p className="text-xs text-slate-500">
                    Perfil PCD conectado via ConectPCD para vagas inclusivas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      E-mail
                    </p>
                    <p className="text-slate-800 text-sm">
                      {candidato.email || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      Telefone
                    </p>
                    <p className="text-slate-800 text-sm">
                      {candidato.telefone || "Não informado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      Tipo de deficiência
                    </p>
                    <p className="text-slate-800 text-sm">
                      {candidato.deficiencia || "Não informado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      Subtipo / descrição
                    </p>
                    <p className="text-slate-800 text-sm">
                      {candidato.subtipo || "Não informado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      CPF
                    </p>
                    <p className="text-slate-800 text-sm">
                      {candidato.cpf || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Apresentação / descrição do candidato */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Apresentação do candidato
              </h2>
              <p className="text-xs text-slate-600">
                {candidato.descricao_perfil
                  ? candidato.descricao_perfil
                  : "O candidato ainda não preencheu uma apresentação pessoal. Em versões futuras, aqui você poderá ver um resumo das experiências, interesses e objetivos profissionais."}
              </p>
            </section>

            {/* Laudo médico */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Laudo médico / documentação
              </h2>
              {candidato.laudo_url ? (
                <div className="flex items-center justify-between gap-3 text-xs">
                  <p className="text-slate-600">
                    O candidato anexou um laudo médico ou documento de
                    comprovação da deficiência.
                  </p>
                  <a
                    href={candidato.laudo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white px-3 py-1.5 text-[11px] font-medium hover:bg-blue-700 transition"
                  >
                    Ver laudo
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Nenhum laudo foi anexado por este candidato até o momento.
                </p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
