import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { vagaService } from "../api/api";

interface VagaApi {
  id_vaga: number;
  nm_vaga: string;
  salario: string | null;
  localidade: string | null;
  requisitos: string | null;
  id_empresa?: number;
  tipo_deficiencia?: string;
  modalidade?: string;
  tipo_contrato?: string;
  carga_horaria?: string;
  beneficios?: string;
  acessibilidade?: string;
}

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

export default function DashboardEmpresa() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const empresa = user?.tipo === "empresa" ? user.dados : null;

  const [vagas, setVagas] = useState<VagaApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [vagaSelecionada, setVagaSelecionada] = useState<number | null>(null);
  const [candidatos, setCandidatos] = useState<CandidatoApi[]>([]);
  const [loadingCandidatos, setLoadingCandidatos] = useState(false);
  const [erroCandidatos, setErroCandidatos] = useState("");

  const [deletandoId, setDeletandoId] = useState<number | null>(null);

  useEffect(() => {
    if (!empresa?.id_empresa) {
      setLoading(false);
      return;
    }

    const carregar = async () => {
      try {
        setLoading(true);
        setErro("");
        const resp = await vagaService.getAll();
        const todas: VagaApi[] = resp.data || [];
        // filtra só as vagas dessa empresa
        const minhas = todas.filter(
          (vaga) => String(vaga.id_empresa) === String(empresa.id_empresa)
        );
        setVagas(minhas);
      } catch (err: any) {
        console.error(err);
        const msg =
          err?.response?.data ||
          "Não foi possível carregar suas vagas no momento.";
        setErro(msg);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [empresa?.id_empresa]);

  const handleLogout = () => {
    logout();
    navigate("/login/empresa");
  };

  const handleVerCandidatos = async (vagaId: number) => {
    if (vagaSelecionada === vagaId) {
      // se clicar de novo na mesma vaga, recolhe a lista
      setVagaSelecionada(null);
      setCandidatos([]);
      setErroCandidatos("");
      return;
    }

    try {
      setVagaSelecionada(vagaId);
      setLoadingCandidatos(true);
      setErroCandidatos("");
      setCandidatos([]);

      const resp = await vagaService.getCandidatos(vagaId);
      const lista: CandidatoApi[] = resp.data || [];
      setCandidatos(lista);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data ||
        "Não foi possível carregar as candidaturas desta vaga.";
      setErroCandidatos(msg);
    } finally {
      setLoadingCandidatos(false);
    }
  };

  const handleExcluirVaga = async (vagaId: number) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir/desativar esta vaga? Essa ação não poderá ser desfeita."
    );
    if (!confirmar) return;

    try {
      setDeletandoId(vagaId);
      setErro("");

      await vagaService.delete(vagaId);

      // remove do estado
      setVagas((prev) => prev.filter((v) => v.id_vaga !== vagaId));

      // se a vaga estava selecionada para ver candidaturas, limpa
      if (vagaSelecionada === vagaId) {
        setVagaSelecionada(null);
        setCandidatos([]);
        setErroCandidatos("");
      }
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data || "Não foi possível excluir esta vaga.";
      setErro(msg);
      alert(msg);
    } finally {
      setDeletandoId(null);
    }
  };

  if (!empresa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-200">
        <div className="bg-white/90 border border-slate-300 rounded-2xl px-6 py-4 shadow-sm text-sm text-slate-700">
          Você não está autenticado como empresa.
        </div>
      </div>
    );
  }

  const totalVagas = vagas.length;

  return (
    <div className="min-h-screen bg-slate-200">
      {/* HEADER */}
      <header className="border-b border-slate-300 bg-slate-100/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">
          {/* Linha superior */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                PWO
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm text-slate-900">
                  ConectPCD · Área da empresa
                </span>
                <span className="text-[11px] text-slate-500">
                  {empresa.nome_fantasia || empresa.razao_social}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                Sair
              </button>
            </div>
          </div>

          {/* Introdução em card */}
          <div className="bg-white/90 border border-slate-300 rounded-2xl p-3 shadow-sm flex flex-col gap-1">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900">
              Painel da sua empresa
            </h1>
            <p className="text-[11px] text-slate-600 max-w-2xl">
              Acompanhe suas vagas inclusivas, visualize candidaturas de pessoas
              com deficiência e mantenha os dados da empresa organizados.
            </p>
          </div>
        </div>
      </header>

      {/* CONTEÚDO EM DUAS COLUNAS */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <section className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr),minmax(0,2fr)] gap-5">
          {/* COLUNA ESQUERDA – PERFIL + RESUMO */}
          <div className="space-y-4">
            {/* Card de perfil da empresa */}
            <section className="bg-white/90 border border-slate-300 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {empresa.nome_fantasia || empresa.razao_social}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    ID empresa: {empresa.id_empresa}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs text-slate-700 mt-2">
                <div>
                  <p className="text-[11px] font-medium text-slate-500">
                    CNPJ
                  </p>
                  <p>{empresa.cnpj}</p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-500">
                    E-mail
                  </p>
                  <p>{empresa.email}</p>
                </div>

                {empresa.telefone && (
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      Telefone
                    </p>
                    <p>{empresa.telefone}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Card de resumo de vagas */}
            <section className="bg-white/90 border border-slate-300 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold text-slate-700">
                Resumo das vagas
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="border border-slate-300 rounded-xl p-3 bg-white/90">
                  <p className="text-[11px] text-slate-500 mb-1">
                    Vagas ativas
                  </p>
                  <p className="text-xl font-semibold text-slate-900">
                    {totalVagas}
                  </p>
                </div>

                <div className="border border-slate-300 rounded-xl p-3 bg-white/90 flex flex-col justify-between">
                  <p className="text-[11px] text-slate-500 mb-1">
                    Ação recomendada
                  </p>
                  <button
                    onClick={() => navigate("/empresa/vagas/nova")}
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-medium px-3 py-1.5 hover:bg-blue-700 transition"
                  >
                    + Criar vaga inclusiva
                  </button>
                </div>
              </div>

              {erro && (
                <p className="mt-2 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {erro}
                </p>
              )}
            </section>
          </div>

          {/* COLUNA DIREITA – MINHAS VAGAS + CANDIDATURAS */}
          <div className="space-y-4">
            <section className="bg-white/90 border border-slate-300 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Minhas vagas
                </h2>
                <button
                  onClick={() => navigate("/empresa/vagas/nova")}
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Nova vaga
                </button>
              </div>

              {loading && (
                <p className="text-xs text-slate-500">Carregando vagas...</p>
              )}

              {!loading && !erro && vagas.length === 0 && (
                <p className="text-xs text-slate-600 bg-slate-50/80 border border-dashed border-slate-300 rounded-xl px-4 py-3">
                  Você ainda não cadastrou nenhuma vaga. Crie uma vaga inclusiva
                  para atrair talentos PCD.
                </p>
              )}

              {/* GRID DE VAGAS */}
              {!loading && !erro && vagas.length > 0 && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vagas.map((vaga) => {
                    const aberta = vagaSelecionada === vaga.id_vaga;
                    const excluindo = deletandoId === vaga.id_vaga;

                    return (
                      <article
                        key={vaga.id_vaga}
                        className="relative bg-white border border-slate-300 rounded-2xl p-4 text-xs shadow-sm hover:shadow-md hover:border-blue-400 transition cursor-pointer"
                        onClick={() =>
                          navigate(`/vaga/${vaga.id_vaga}`, {
                            state: { vaga },
                          })
                        }
                      >
                        {/* faixa lateral */}
                        <span className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-sky-400 to-emerald-400" />

                        <div className="pl-3 flex flex-col gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">
                              {vaga.nm_vaga}
                            </h3>
                            <p className="text-[11px] text-slate-500 mb-1">
                              {vaga.localidade || "Localidade não informada"}
                            </p>
                            <p className="text-[11px] text-slate-600 line-clamp-2">
                              {vaga.requisitos || "Sem descrição detalhada."}
                            </p>
                          </div>

                          {/* chips */}
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {vaga.modalidade && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px]">
                                {vaga.modalidade}
                              </span>
                            )}
                            {vaga.tipo_deficiencia && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px]">
                                Foco PCD: {vaga.tipo_deficiencia}
                              </span>
                            )}
                            {vaga.salario && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px]">
                                💰 {vaga.salario}
                              </span>
                            )}
                          </div>

                          {/* ações */}
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-slate-500">
                              Clique no card para ver detalhes completos
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleVerCandidatos(vaga.id_vaga);
                                }}
                                className="text-[11px] text-slate-700 hover:text-blue-700"
                              >
                                {aberta
                                  ? "Recolher candidaturas"
                                  : "Ver candidaturas"}
                              </button>

                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleExcluirVaga(vaga.id_vaga);
                                }}
                                disabled={excluindo}
                                className="text-[11px] text-red-600 hover:text-red-700 disabled:opacity-60"
                              >
                                {excluindo ? "Excluindo..." : "Excluir"}
                              </button>
                            </div>
                          </div>

                          {/* bloco de candidaturas */}
                          {aberta && (
                            <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                              {loadingCandidatos && (
                                <p className="text-[11px] text-slate-500">
                                  Carregando candidaturas...
                                </p>
                              )}

                              {erroCandidatos && !loadingCandidatos && (
                                <p className="text-[11px] text-red-600">
                                  {erroCandidatos}
                                </p>
                              )}

                              {!loadingCandidatos &&
                                !erroCandidatos &&
                                candidatos.length === 0 && (
                                  <p className="text-[11px] text-slate-500">
                                    Nenhuma candidatura recebida para esta vaga
                                    até o momento.
                                  </p>
                                )}

                              {!loadingCandidatos &&
                                !erroCandidatos &&
                                candidatos.length > 0 && (
                                  <div className="space-y-1.5">
                                    <p className="text-[11px] text-slate-600">
                                      {candidatos.length} candidatura(s)
                                      recebida(s):
                                    </p>
                                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                                      {candidatos.map((c) => {
                                        const nomeCompleto = [
                                          c.nome,
                                          c.sobrenome,
                                        ]
                                          .filter(Boolean)
                                          .join(" ");

                                        return (
                                          <div
                                            key={c.id_candidato}
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              navigate(
                                                `/empresa/candidato/${c.id_candidato}`,
                                                { state: { candidato: c } }
                                              );
                                            }}
                                            className="border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 hover:bg-white hover:border-blue-400 cursor-pointer transition"
                                          >
                                            <p className="text-[11px] font-medium text-slate-800">
                                              {nomeCompleto ||
                                                `Candidato #${c.id_candidato}`}
                                            </p>
                                            <p className="text-[10px] text-slate-500">
                                              {c.email ||
                                                "E-mail não informado"}
                                            </p>
                                            <p className="text-[10px] text-slate-500">
                                              {c.deficiencia
                                                ? `Deficiência: ${c.deficiencia}`
                                                : "Deficiência não informada"}
                                              {c.subtipo
                                                ? ` · Subtipo: ${c.subtipo}`
                                                : ""}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
