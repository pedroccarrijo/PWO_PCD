import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { vagaService } from "../api/api";
import { useAuth } from "../context/AuthContext";

interface VagaApi {
  id_vaga: number;
  nm_vaga: string;
  salario: string | null;
  localidade: string | null;
  requisitos: string | null;
  id_empresa?: number;

  // campos extras que já existem no cadastro de vaga
  tipo_deficiencia?: string;
  modalidade?: string;
  tipo_contrato?: string;
  carga_horaria?: string;
  beneficios?: string;
  acessibilidade?: string;
}

export default function DetalhesVaga() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation() as { state?: { vaga?: VagaApi } };

  const [vaga, setVaga] = useState<VagaApi | null>(
    location.state?.vaga || null
  );
  const [loading, setLoading] = useState(!vaga);
  const [erro, setErro] = useState("");
  const [candidatarMsg, setCandidatarMsg] = useState("");
  const [candidatarLoading, setCandidatarLoading] = useState(false);

  // Se não veio pelo state, busca pelo id (fallback simples)
  useEffect(() => {
    const carregarVaga = async () => {
      if (vaga || !id) return;
      setLoading(true);
      setErro("");

      try {
        const response = await vagaService.getAll();
        const lista: VagaApi[] = response.data || [];
        const encontrada = lista.find(
          (v) => String(v.id_vaga) === String(id)
        );
        if (!encontrada) {
          setErro("Vaga não encontrada.");
        } else {
          setVaga(encontrada);
        }
      } catch (error: any) {
        console.error(error);
        const msg =
          error?.response?.data ||
          "Não foi possível carregar os detalhes da vaga.";
        setErro(msg);
      } finally {
        setLoading(false);
      }
    };

    carregarVaga();
  }, [id, vaga]);

  const handleCandidatar = async () => {
    setCandidatarMsg("");

    if (!user || user.tipo !== "pcd") {
      setCandidatarMsg(
        "Apenas usuários PCD autenticados podem se candidatar a vagas."
      );
      return;
    }

    if (!vaga) {
      setCandidatarMsg("Vaga não carregada.");
      return;
    }

    const candidatoId = user?.dados?.id_candidato;
    if (!candidatoId) {
      setCandidatarMsg(
        "Não foi possível identificar seu perfil. Tente fazer login novamente."
      );
      return;
    }

    try {
      setCandidatarLoading(true);
      await vagaService.candidatar(vaga.id_vaga, candidatoId);
      setCandidatarMsg("Candidatura enviada com sucesso! 💙");
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data ||
        "Não foi possível enviar sua candidatura. Tente novamente mais tarde.";
      setCandidatarMsg(msg);
    } finally {
      setCandidatarLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4">
          {/* Linha superior */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="text-xs text-slate-500 hover:text-blue-700"
              >
                ⟵ Voltar
              </button>

              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-md">
                PWO
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm text-slate-900">
                  ConectPCD
                </span>
                <span className="text-[11px] text-slate-500">
                  Detalhes da vaga
                </span>
              </div>
            </div>
          </div>

          {/* Título / subtítulo (ligados à vaga, quando tiver) */}
          {vaga && (
            <div className="flex flex-col gap-1">
              <h1 className="text-base sm:text-lg font-semibold text-slate-900">
                {vaga.nm_vaga}
              </h1>
              <p className="text-[11px] text-slate-600">
                Visualize as informações completas da oportunidade e confira se
                a vaga atende às suas necessidades de acessibilidade.
              </p>
            </div>
          )}
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-600 shadow-sm">
            Carregando detalhes da vaga...
          </div>
        )}

        {erro && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 shadow-sm">
            {erro}
          </div>
        )}

        {!loading && !erro && vaga && (
          <section className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr),minmax(0,1.1fr)] gap-4">
            {/* COLUNA PRINCIPAL – DETALHES */}
            <div className="space-y-4">
              {/* Card principal da vaga */}
              <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                {/* Título e empresa */}
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                    {vaga.nm_vaga}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Empresa:{" "}
                    <span className="font-medium text-slate-700">
                      {/* Futuro: buscar nome da empresa pelo id_empresa */}
                      Empresa parceira ConectPCD
                    </span>
                  </p>
                </div>

                {/* Chips principais */}
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                    📍 {vaga.localidade || "Localidade não informada"}
                  </span>

                  {vaga.modalidade && (
                    <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 text-indigo-700">
                      🧭 {vaga.modalidade}
                    </span>
                  )}

                  {vaga.tipo_contrato && (
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                      📄 {vaga.tipo_contrato}
                    </span>
                  )}

                  {vaga.carga_horaria && (
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                      ⏱ {vaga.carga_horaria}
                    </span>
                  )}

                  {vaga.salario && (
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                      💰 {vaga.salario}
                    </span>
                  )}
                </div>

                {/* Sobre a vaga */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Sobre a vaga
                  </h3>
                  <p className="text-sm text-slate-700 whitespace-pre-line">
                    {vaga.requisitos || "Nenhuma descrição detalhada informada."}
                  </p>
                </div>

                {/* Benefícios, se houver */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Benefícios
                  </h3>
                  <p className="text-sm text-slate-700 whitespace-pre-line">
                    {vaga.beneficios ||
                      "A empresa não detalhou os benefícios desta vaga."}
                  </p>
                </div>

                {/* Botão de candidatura */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button
                    type="button"
                    disabled={candidatarLoading}
                    onClick={handleCandidatar}
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium px-5 py-2.5 shadow-md shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
                  >
                    {candidatarLoading ? "Enviando..." : "Candidatar-se à vaga"}
                  </button>

                  {candidatarMsg && (
                    <span className="text-xs text-slate-600">
                      {candidatarMsg}
                    </span>
                  )}
                </div>
              </section>
            </div>

            {/* COLUNA LATERAL – RESUMO PCD / ACESSIBILIDADE */}
            <aside className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-fit space-y-3 text-xs text-slate-600">
              <h3 className="text-xs font-semibold text-slate-700">
                Resumo para pessoas com deficiência
              </h3>

              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-500">
                    Tipo de deficiência foco
                  </span>
                  <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px]">
                    {vaga.tipo_deficiencia || "Não informado"}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <p className="text-[11px] font-medium text-slate-600">
                    Acessibilidade informada pela empresa
                  </p>
                  <p className="text-[11px] text-slate-600 whitespace-pre-line">
                    {vaga.acessibilidade ||
                      "A empresa ainda não detalhou os recursos de acessibilidade desta vaga. Em versões futuras, será possível ver itens como elevador para cadeirantes, rampas, piso tátil, intérprete de Libras, entre outros."}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <p className="text-[11px] text-slate-600">
                    Dica: sempre que possível, confirme com a empresa sobre
                    recursos de acessibilidade antes da entrevista, especialmente
                    se você precisar de alguma adaptação específica.
                  </p>
                </div>
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
