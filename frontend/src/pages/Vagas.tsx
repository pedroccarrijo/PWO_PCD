import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { vagaService } from "../api/api";
import { useAuth } from "../context/AuthContext";

interface VagaApi {
  id_vaga: number;
  nm_vaga: string;
  salario: string | null;
  localidade: string | null;
  requisitos: string | null;
  id_empresa?: number;
  tipo_deficiencia?: string | null;
  modalidade?: string | null;
  acessibilidade?: string | null; // texto ou lista de recursos da empresa
}

export default function Vagas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vagas, setVagas] = useState<VagaApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // === 1. DADOS DO USUÁRIO PCD ===
  const deficienciaUsuario: string =
    user?.tipo === "pcd" ? (user?.dados?.deficiencia || "") : "";

  // recursos_necessarios vem como string "Elevador, Rampa de acesso, ..."
  const recursosNecessarios: string[] =
    user?.tipo === "pcd"
      ? String(user?.dados?.recursos_necessarios || "")
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0)
      : [];

  // função para normalizar tipo de deficiência (motora, visual, auditiva, etc.)
  const normalizarDeficiencia = (texto: string): string => {
    const lower = texto.toLowerCase();

    if (lower.includes("motor")) return "motora";
    if (lower.includes("fisic")) return "motora";
    if (lower.includes("visual") || lower.includes("visão")) return "visual";
    if (lower.includes("audit")) return "auditiva";
    if (lower.includes("surdez") || lower.includes("surd")) return "auditiva";
    if (lower.includes("intelectual")) return "intelectual";
    if (lower.includes("psicos") || lower.includes("mental")) return "psicossocial";
    if (lower.includes("múltipla") || lower.includes("multipla")) return "multipla";

    return lower.trim();
  };

  const defNormalizada = useMemo(
    () => (deficienciaUsuario ? normalizarDeficiencia(deficienciaUsuario) : ""),
    [deficienciaUsuario]
  );

  // === 2. CARREGA VAGAS DO BACK ===
  useEffect(() => {
    const loadVagas = async () => {
      try {
        setLoading(true);
        setErro("");
        const resp = await vagaService.getAll();
        setVagas(resp.data || []);
      } catch (err: any) {
        console.error("Erro ao carregar vagas:", err);
        const msg =
          err?.response?.data ||
          "Não foi possível carregar as vagas no momento.";
        setErro(msg);
      } finally {
        setLoading(false);
      }
    };

    loadVagas();
  }, []);

  // === 3. CÁLCULO DO MATCH / SCORE ===
  type VagaComScore = VagaApi & { scoreMatch: number };

  const vagasFiltradas: VagaComScore[] = useMemo(() => {
    const temFiltroDef = !!defNormalizada;
    const temFiltroRec = recursosNecessarios.length > 0;

    if (!temFiltroDef && !temFiltroRec) {
      return vagas.map((v) => ({ ...v, scoreMatch: 0 }));
    }

    const calcularScore = (vaga: VagaApi): number => {
      let score = 0;

      const textoVaga =
        (
          (vaga.nm_vaga || "") +
          " " +
          (vaga.localidade || "") +
          " " +
          (vaga.requisitos || "") +
          " " +
          (vaga.acessibilidade || "")
        )
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

      // 1) compatibilidade de deficiência
      if (temFiltroDef) {
        const tipoVaga = normalizarDeficiencia(String(vaga.tipo_deficiencia || ""));

        if (!tipoVaga || tipoVaga === "" || tipoVaga.includes("todas")) {
          score += 1;
        } else if (tipoVaga === defNormalizada) {
          score += 3;
        } else if (textoVaga.includes(defNormalizada)) {
          score += 2;
        }
      }

      // 2) recursos de acessibilidade
      if (temFiltroRec) {
        let recursosMatch = 0;
        const textoAcess =
          (
            String(vaga.acessibilidade || "") +
            " " +
            String(vaga.requisitos || "")
          )
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        recursosNecessarios.forEach((rec) => {
          const recNorm = rec
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          if (recNorm && textoAcess.includes(recNorm)) {
            recursosMatch += 1;
          }
        });

        if (recursosMatch > 0) {
          score += recursosMatch;
        }
      }

      return score;
    };

    const comScore: VagaComScore[] = vagas.map((vaga) => ({
      ...vaga,
      scoreMatch: calcularScore(vaga),
    }));

    const filtradas = comScore.filter((v) => v.scoreMatch > 0);

    if (filtradas.length === 0) {
      return comScore;
    }

    filtradas.sort((a, b) => b.scoreMatch - a.scoreMatch);
    return filtradas;
  }, [vagas, defNormalizada, recursosNecessarios]);

  const temFiltroAtivo =
    !!defNormalizada || (recursosNecessarios && recursosNecessarios.length > 0);

  return (
    <div className="min-h-screen bg-slate-200">
      {/* Topo */}
      <header className="bg-slate-100/90 backdrop-blur-md border-b border-slate-300 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/explorer")}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              ⟵ Voltar
            </button>

            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              PWO
            </div>

            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm text-slate-900">
                ConectPCD
              </span>
              <span className="text-[11px] text-slate-500">
                Vagas recomendadas para você
              </span>
            </div>
          </div>

          {deficienciaUsuario && (
            <div className="hidden sm:flex flex-col items-end bg-white/80 border border-slate-300 rounded-xl px-3 py-2 shadow-sm">
              <span className="text-[11px] text-slate-500">Perfil PCD</span>
              <span className="text-xs font-medium text-slate-800">
                Deficiência: {deficienciaUsuario}
              </span>
              {recursosNecessarios.length > 0 && (
                <span className="text-[10px] text-slate-500">
                  Recursos marcados: {recursosNecessarios.join(" · ")}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* bloco de introdução em card */}
        <div className="mb-4 bg-white/90 border border-slate-300 rounded-2xl p-4 shadow-sm space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">
            Vagas alinhadas ao seu perfil
          </h1>
          <p className="text-xs text-slate-600">
            {temFiltroAtivo
              ? "Estamos priorizando vagas que combinam com o seu tipo de deficiência e com os recursos de acessibilidade que você marcou no cadastro."
              : "Como seu perfil ainda não tem deficiência ou recursos de acessibilidade preenchidos, estamos exibindo todas as vagas disponíveis."}
          </p>
        </div>

        {loading && (
          <p className="text-sm text-slate-600 bg-white/90 border border-slate-300 rounded-2xl px-4 py-3 shadow-sm">
            Carregando vagas...
          </p>
        )}

        {erro && !loading && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-300 rounded-2xl px-4 py-3 shadow-sm">
            {erro}
          </p>
        )}

        {!loading && !erro && vagasFiltradas.length === 0 && (
          <div className="bg-white/90 border border-slate-300 rounded-2xl p-4 shadow-sm text-sm text-slate-600">
            <p className="mb-1">
              Não encontramos nenhuma vaga que mencione explicitamente
              acessibilidade relacionada ao seu tipo de deficiência ou aos
              recursos que você informou.
            </p>
            <p className="text-xs text-slate-500">
              Você ainda pode explorar todas as vagas na aba geral do Explorer.
              Recomende às empresas que descrevam claramente as adaptações
              (como elevador, rampa, intérprete de Libras, etc.) ao cadastrar
              as vagas.
            </p>
          </div>
        )}

        {/* Cards de vaga */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vagasFiltradas.map((vaga) => (
            <div
              key={vaga.id_vaga}
              onClick={() =>
                navigate(`/vaga/${vaga.id_vaga}`, { state: { vaga } })
              }
              className="bg-white/95 border border-slate-300 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-400 transition relative"
            >
              {/* badge de match se houver score */}
              {temFiltroAtivo && vaga.scoreMatch > 0 && (
                <div className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                  Match {vaga.scoreMatch}/{5}
                </div>
              )}

              <h2 className="text-base font-semibold text-slate-900 mb-1">
                {vaga.nm_vaga}
              </h2>
              <p className="text-[11px] text-slate-500 mb-2">
                {vaga.localidade || "Localidade não informada"}
              </p>

              {vaga.tipo_deficiencia && (
                <p className="text-[11px] text-emerald-700 mb-1">
                  Foco em: {vaga.tipo_deficiencia}
                </p>
              )}

              <p className="text-xs text-slate-600 line-clamp-3 mb-2">
                {vaga.requisitos ||
                  "A empresa não detalhou os requisitos da vaga."}
              </p>

              {vaga.acessibilidade && (
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                  Acessibilidade: {vaga.acessibilidade}
                </p>
              )}

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {vaga.salario
                    ? `Faixa salarial: ${vaga.salario}`
                    : "Salário não informado"}
                </span>
                <span className="text-blue-600 font-medium">
                  Ver detalhes →
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
