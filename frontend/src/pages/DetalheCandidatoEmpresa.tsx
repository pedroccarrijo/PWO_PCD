import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { candidatoService } from "../api/api";
import { useAuth } from "../context/AuthContext";

interface CandidatoApi {
  id_candidato: number;
  nome?: string;
  sobrenome?: string;
  nm_candidato?: string;
  email?: string;
  telefone?: string;
  deficiencia?: string;
  subtipo?: string;
  cpf?: string;
  descricao?: string;
  apresentacao?: string;
  recursos_necessarios?: string;
  laudo?: string;
  laudo_url?: string;
  foto_perfil?: string;
  modalidade_preferida?: string;
  preferencia_modalidade?: string;
  localidade_preferida?: string;
  preferencia_localidade?: string;
}

interface VagaResumo {
  id_vaga: number;
  nm_vaga?: string;
  localidade?: string | null;
}

type LocationState = {
  candidato?: Partial<CandidatoApi>;
  vaga?: VagaResumo;
};

export default function DetalhesCandidatoEmpresa() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const [candidato, setCandidato] = useState<CandidatoApi | null>(
    state.candidato && state.candidato.id_candidato
      ? (state.candidato as CandidatoApi)
      : null
  );
  const [loading, setLoading] = useState(!candidato);
  const [erro, setErro] = useState("");

  const vaga = state.vaga;

  useEffect(() => {
    const carregar = async () => {
      if (!id) return;
      if (candidato) return; // já veio via state

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleVoltar = () => {
    navigate(-1);
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white/95 border border-slate-300 rounded-2xl px-6 py-4 shadow-sm text-sm text-slate-700">
          ID do candidato não informado.
        </div>
      </div>
    );
  }

  const dados =
    candidato || (state.candidato as CandidatoApi) || ({} as CandidatoApi);

  const nomeCompleto =
    dados.nm_candidato ||
    (dados.nome
      ? `${dados.nome}${dados.sobrenome ? ` ${dados.sobrenome}` : ""}`
      : "") ||
    "Nome não informado";

  const tipoDeficiencia = dados.deficiencia || "Não informado";
  const subtipoDeficiencia = dados.subtipo || "Não informado";

  const email = dados.email || "Não informado";
  const telefone = dados.telefone || "Não informado";
  const cpf = dados.cpf || "Não informado";

  const descricaoFinal =
    dados.descricao ||
    dados.apresentacao ||
    "O candidato ainda não preencheu uma descrição pessoal.";

  const recursosNecessarios: string[] = (dados.recursos_necessarios || "")
    .split(",")
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  const laudo = dados.laudo || dados.laudo_url || "";

  const modalidadePreferida =
    dados.modalidade_preferida ||
    dados.preferencia_modalidade ||
    "Não informado";

  const localidadePreferida =
    dados.localidade_preferida ||
    dados.preferencia_localidade ||
    "Não informado";

  const fotoPerfil: string | null = dados.foto_perfil || null;
  const primeiraLetra = (nomeCompleto || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="border-b border-slate-300 bg-slate-100/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
          {/* Linha superior */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-300">
            <div className="flex items-center gap-2">
              <button
                onClick={handleVoltar}
                className="text-xs text-slate-500 hover:text-blue-700"
              >
                ⟵ Voltar
              </button>

              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                PWO
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm text-slate-900">
                  ConectPCD
                </span>
                <span className="text-[11px] text-slate-500">
                  Detalhes do candidato PCD
                </span>
              </div>
            </div>

            {user?.tipo === "empresa" && (
              <span className="text-[11px] text-slate-500">Área da empresa</span>
            )}
          </div>

          {/* Contexto da vaga (se veio do painel de vagas) */}
          {vaga && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-[11px] text-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-medium text-slate-800">
                  Candidato para a vaga: {vaga.nm_vaga || `#${vaga.id_vaga}`}
                </p>
                <p className="text-[11px] text-slate-600">
                  Localidade: {vaga.localidade || "Não informada"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/vaga/${vaga.id_vaga}`)}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-medium px-3 py-1.5 hover:bg-blue-700 transition"
              >
                Ver detalhes da vaga
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {loading && (
          <div className="bg-white/95 border border-slate-300 rounded-2xl p-4 text-sm text-slate-500 shadow-sm">
            Carregando dados do candidato...
          </div>
        )}

        {erro && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600 shadow-sm">
            {erro}
          </div>
        )}

        {!loading && !erro && (
          <section className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr),minmax(0,1.1fr)] gap-4">
            {/* CARD PRINCIPAL */}
            <div className="bg-slate-50 border border-slate-300 rounded-2xl p-5 shadow-sm space-y-5">
              {/* Topo: avatar + infos principais */}
              <div className="flex items-start gap-4 pb-4 border-b border-slate-300">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-md overflow-hidden">
                  {fotoPerfil ? (
                    <img
                      src={fotoPerfil}
                      alt={nomeCompleto}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{primeiraLetra}</span>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                    {nomeCompleto}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Candidato PCD interessado em oportunidades com acessibilidade.
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-1 text-[10px]">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      PCD · {tipoDeficiencia}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                      Candidato #{dados.id_candidato}
                    </span>
                  </div>
                </div>
              </div>

              {/* BLOCO 1 – Dados de contato */}
              <section className="rounded-2xl border border-slate-300 bg-white px-4 py-4 space-y-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-xs font-semibold text-slate-800">
                    1. Dados de contato
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Informações para contato profissional
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-1">
                      E-mail
                    </p>
                    <p className="text-slate-800 text-sm break-all">{email}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-1">
                      Telefone
                    </p>
                    <p className="text-slate-800 text-sm">{telefone}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-1">
                      CPF
                    </p>
                    <p className="text-slate-800 text-sm">{cpf}</p>
                  </div>
                </div>
              </section>

              {/* BLOCO 2 – Acessibilidade & saúde */}
              <section className="rounded-2xl border border-slate-300 bg-white px-4 py-4 space-y-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-xs font-semibold text-slate-800">
                    2. Acessibilidade & saúde
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Como sua empresa pode se adaptar para recebê-lo(a)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-1">
                      Tipo de deficiência
                    </p>
                    <p className="text-slate-800 text-sm">{tipoDeficiencia}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-1">
                      Subtipo / descrição
                    </p>
                    <p className="text-slate-800 text-sm">
                      {subtipoDeficiencia}
                    </p>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <p className="text-[11px] font-medium text-slate-500 mb-1">
                      Recursos de acessibilidade necessários
                    </p>
                    {recursosNecessarios.length === 0 ? (
                      <p className="text-[11px] text-slate-600">
                        O candidato ainda não listou recursos específicos.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {recursosNecessarios.map((rec, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-700"
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-[11px] font-medium text-slate-500 mb-1">
                      Laudo médico
                    </p>
                    {laudo ? (
                      <p className="text-[11px] text-slate-600 break-all">
                        {laudo.startsWith("http") || laudo.startsWith("https") ? (
                          <a
                            href={laudo}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Abrir laudo em nova aba
                          </a>
                        ) : (
                          <>Laudo informado: {laudo}</>
                        )}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-600">
                        Nenhum laudo informado. Esse campo é opcional para o
                        candidato.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* BLOCO 3 – Preferências & apresentação */}
              <section className="rounded-2xl border border-slate-300 bg-white px-4 py-4 space-y-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-xs font-semibold text-slate-800">
                    3. Preferências de vaga & apresentação
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Contexto de trabalho ideal e perfil profissional
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-1">
                      Modalidade preferida
                    </p>
                    <p className="text-slate-800 text-sm">
                      {modalidadePreferida}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-1">
                      Localidade preferida
                    </p>
                    <p className="text-slate-800 text-sm">
                      {localidadePreferida}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-slate-500">
                    Apresentação / sobre o candidato
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">
                    {descricaoFinal}
                  </p>
                </div>
              </section>
            </div>

            {/* CARD LATERAL – visão rápida para a empresa */}
            <aside className="bg-white/95 border border-slate-300 rounded-2xl p-4 shadow-sm h-fit space-y-4">
              <h3 className="text-xs font-semibold text-slate-700">
                Resumo para a empresa
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Candidato</span>
                  <span className="text-[11px] font-semibold text-slate-900">
                    #{dados.id_candidato}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-slate-500">Adequação PCD</span>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Use as informações acima para entender como adaptar o
                    ambiente e avaliar o encaixe na vaga.
                  </span>
                </div>

                {vaga && (
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <p className="text-[11px] text-slate-600">
                      Este candidato se candidatou para:
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(`/vaga/${vaga.id_vaga}`)}
                      className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-medium px-3 py-2 hover:bg-blue-700 transition"
                    >
                      Ver vaga "{vaga.nm_vaga || `#${vaga.id_vaga}`}"
                    </button>
                  </div>
                )}
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
