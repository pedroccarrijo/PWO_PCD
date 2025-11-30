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
  acessibilidade?: string | null;
}

export default function Vagas() {
  const navigate = useNavigate();
  const { user } = useAuth();

    // Recursos de acessibilidade que o usuário marcou no cadastro/perfil
  const recursosNecessariosUsuario: string[] = useMemo(() => {
    const dados: any = user?.dados || {};
    const valor = dados.recursos_necessarios || "";

    if (Array.isArray(valor)) return valor;

    if (typeof valor === "string") {
      return valor
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    return [];
  }, [user]);

  const [vagas, setVagas] = useState<VagaApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const deficienciaUsuario: string =
    user?.tipo === "pcd" ? (user?.dados?.deficiencia || "") : "";

  // Mapeia tipo de deficiência para palavras-chave ligadas à acessibilidade
  const keywords = useMemo(() => {
    const base = deficienciaUsuario.toLowerCase().trim();

    const extrasPorTipo: Record<string, string[]> = {
      motora: [
        "cadeirante",
        "cadeira de rodas",
        "elevador",
        "rampa",
        "plataforma elevatória",
        "acesso nivelado",
        "adaptado para mobilidade"
      ],
      visual: [
        "baixa visão",
        "cego",
        "leitor de tela",
        "audiodescrição",
        "contraste",
        "sinalização tátil"
      ],
      auditiva: [
        "intérprete de libras",
        "libras",
        "legendas",
        "transcrição",
        "redução de ruído"
      ]
    };

    let extra: string[] = [];

    if (base.includes("motor")) extra = extrasPorTipo.motora;
    else if (base.includes("visual")) extra = extrasPorTipo.visual;
    else if (base.includes("audit")) extra = extrasPorTipo.auditiva;

    // devolve sempre pelo menos o base (se existir) + extras específicos
    return [base, ...extra.filter(Boolean)].filter((k) => k.trim());
  }, [deficienciaUsuario]);

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

    const vagasFiltradas = useMemo(() => {
    // Se não temos deficiência do usuário E nenhum recurso marcado, devolve todas
    const temDef = !!deficienciaUsuario && keywords.some((k) => k.trim());
    const temRecursos = recursosNecessariosUsuario.length > 0;

    if (!temDef && !temRecursos) {
      return vagas;
    }

    return vagas.filter((vaga) => {
      const textoBase =
        (vaga.nm_vaga || "") +
        " " +
        (vaga.localidade || "") +
        " " +
        (vaga.requisitos || "") +
        " " +
        // se existir campo de acessibilidade na vaga, usamos também
        ((vaga as any).acessibilidade || "");

      const texto = textoBase.toLowerCase();

      const matchDeficiencia = temDef
        ? keywords.some(
            (kw) => kw && texto.includes(kw.toLowerCase().trim())
          )
        : true;

      const matchRecursos = temRecursos
        ? recursosNecessariosUsuario.some((rec) =>
            texto.includes(rec.toLowerCase())
          )
        : true;

      // se tiver deficiência marcada, usamos ela;
      // se tiver recursos, usamos também; se tiver ambos, precisa bater nos dois
      return matchDeficiencia && matchRecursos;
    });
  }, [vagas, deficienciaUsuario, keywords, recursosNecessariosUsuario]);


  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4">
          {/* Linha topo */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/explorer")}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-blue-700"
              >
                ⟵ Voltar
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-md">
                  PWO
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-sm text-slate-900">
                    ConectPCD · Vagas recomendadas
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Focadas na acessibilidade para o seu perfil
                  </span>
                </div>
              </div>
            </div>

            {deficienciaUsuario && (
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[11px] text-slate-500">Perfil PCD</span>
                <span className="text-xs font-medium text-slate-800">
                  Deficiência: {deficienciaUsuario}
                </span>
              </div>
            )}
          </div>

          {/* Título + descrição */}
          <div className="flex flex-col gap-1">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900">
              Vagas alinhadas ao seu perfil
            </h1>
            <p className="text-[11px] text-slate-600 max-w-xl">
              Mostrando vagas com tipo de deficiência compatível ou descrições
              que indicam adaptações e acessibilidade relacionadas ao seu perfil.
            </p>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {loading && (
          <p className="text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
            Carregando vagas...
          </p>
        )}

        {erro && !loading && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 shadow-sm">
            {erro}
          </p>
        )}

        {!loading && !erro && vagasFiltradas.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-sm text-slate-600">
            <p className="mb-1">
              Não encontramos nenhuma vaga que mencione explicitamente
              acessibilidade relacionada ao seu tipo de deficiência.
            </p>
            <p className="text-xs text-slate-500">
              Você ainda pode explorar todas as vagas na aba geral do Explorer.
              Recomende às empresas que descrevam claramente as adaptações
              (como elevador, rampa, intérprete de Libras, etc.) ao cadastrar
              as vagas.
            </p>
          </div>
        )}

        {/* Grid de vagas */}
        {!loading && !erro && vagasFiltradas.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">
                Vagas recomendadas
              </span>
              <span className="text-[11px] text-slate-500">
                {vagasFiltradas.length} vaga(s) encontrada(s)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vagasFiltradas.map((vaga) => (
                <div
                  key={vaga.id_vaga}
                  onClick={() =>
                    navigate(`/vaga/${vaga.id_vaga}`, { state: { vaga } })
                  }
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                >
                  <h2 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">
                    {vaga.nm_vaga}
                  </h2>

                  <p className="text-[11px] text-slate-500 mb-2">
                    {vaga.localidade || "Localidade não informada"}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-2">
                    {vaga.requisitos ||
                      "A empresa não detalhou os requisitos da vaga."}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2 text-[10px]">
                    {vaga.modalidade && (
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700">
                        {vaga.modalidade}
                      </span>
                    )}
                    {vaga.tipo_deficiencia && (
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                        Foco PCD: {vaga.tipo_deficiencia}
                      </span>
                    )}
                  </div>

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
          </>
        )}
      </main>
    </div>
  );
}
