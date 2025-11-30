import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
}

export default function Explorer() {
  const navigate = useNavigate();
  const [vagas, setVagas] = useState<VagaApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroDeficiencia, setFiltroDeficiencia] = useState<string | null>(null);
  const [filtroModalidade, setFiltroModalidade] = useState<string | null>(null);

  useEffect(() => {
    const carregarVagas = async () => {
      try {
        setLoading(true);
        setErro("");
        const response = await vagaService.getAll();
        setVagas(response.data || []);
      } catch (error: any) {
        const msg =
          error?.response?.data ||
          "Não foi possível carregar as vagas no momento.";
        setErro(msg);
      } finally {
        setLoading(false);
      }
    };

    carregarVagas();
  }, []);

  const vagasFiltradas = vagas.filter((vaga) => {
    const texto = (
      (vaga.nm_vaga || "") +
      " " +
      (vaga.localidade || "") +
      " " +
      (vaga.requisitos || "")
    ).toLowerCase();

    const passaBusca = !busca.trim()
      ? true
      : texto.includes(busca.toLowerCase());

    const passaDeficiencia = !filtroDeficiencia
      ? true
      : vaga.tipo_deficiencia?.toLowerCase() === filtroDeficiencia.toLowerCase();

    const passaModalidade = !filtroModalidade
      ? true
      : vaga.modalidade?.toLowerCase() === filtroModalidade.toLowerCase();

    return passaBusca && passaDeficiencia && passaModalidade;
  });

  const toggleFiltroDeficiencia = (tipo: string) => {
    setFiltroDeficiencia((prev) => (prev === tipo ? null : tipo));
  };

  const toggleFiltroModalidade = (tipo: string) => {
    setFiltroModalidade((prev) => (prev === tipo ? null : tipo));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-5">
          
          {/* Linha superior */}
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                PCD
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm text-slate-900">
                  ConectPCD
                </span>
                <span className="text-[11px] text-slate-500">
                  Vagas inclusivas e acessíveis
                </span>
              </div>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => navigate("/vagas")}
                className="px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Minhas vagas
              </button>

              <button
                onClick={() => navigate("/empresas")}
                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Empresas
              </button>

              <button
                onClick={() => navigate("/perfil/pcd")}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                Meu perfil
              </button>
            </div>
          </div>

          {/* Introdução */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Explore vagas pensadas para pessoas com deficiência
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Busque oportunidades por título, localidade e palavra-chave.
                Use filtros de acessibilidade e modalidade para encontrar o que combina com você.
              </p>
            </div>

            {/* Card estatístico */}
            <div className="w-full lg:w-64 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-[11px] text-slate-500 mb-2">Resumo rápido</p>

              <div className="flex justify-between items-end pb-3 border-b border-slate-200">
                <div>
                  <p className="text-xs text-slate-500">Vagas ativas</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {vagas.length}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-blue-600 font-medium">Inclusão</p>
                  <p className="text-[11px] text-slate-500">Ambientes preparados</p>
                </div>
              </div>

              <div className="pt-3">
                <span className="block h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
              </div>
            </div>
          </div>

          {/* Barra de busca */}
          <div className="border-t border-slate-200 pt-4">
            <div className="relative">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar vagas por título, requisitos ou cidade..."
                className="w-full rounded-xl bg-white border border-slate-300 px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                🔍
              </span>
            </div>
          </div>

          {/* FILTROS */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex flex-col gap-2 text-[11px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-600">Foco PCD:</span>

                {["motora", "visual", "auditiva", "intelectual", "psicossocial"].map(
                  (tipo) => {
                    const ativo =
                      filtroDeficiencia &&
                      filtroDeficiencia.toLowerCase() === tipo.toLowerCase();

                    return (
                      <button
                        key={tipo}
                        onClick={() => toggleFiltroDeficiencia(tipo)}
                        className={[
                          "px-3 py-1.5 rounded-full border text-xs transition",
                          ativo
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100",
                        ].join(" ")}
                      >
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Modalidade */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-slate-600">Modalidade:</span>

                {["Remoto", "Presencial", "Híbrido"].map((tipo) => {
                  const ativo =
                    filtroModalidade &&
                    filtroModalidade.toLowerCase() === tipo.toLowerCase();

                  return (
                    <button
                      key={tipo}
                      onClick={() => toggleFiltroModalidade(tipo)}
                      className={[
                        "px-3 py-1.5 rounded-full border text-xs transition",
                        ativo
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      {tipo}
                    </button>
                  );
                })}

                {(filtroDeficiencia || filtroModalidade) && (
                  <button
                    onClick={() => {
                      setFiltroDeficiencia(null);
                      setFiltroModalidade(null);
                    }}
                    className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Status */}
        {loading && (
          <div className="text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            Carregando vagas...
          </div>
        )}

        {erro && !loading && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 shadow-sm">
            {erro}
          </div>
        )}

        {!loading && !erro && vagasFiltradas.length === 0 && (
          <div className="text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-6 shadow-sm">
            <p>Nenhuma vaga encontrada com os filtros atuais.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Tente ajustar filtros ou aguarde novas oportunidades.
            </p>
          </div>
        )}

        {/* GRID DE VAGAS */}
        {!loading && !erro && vagasFiltradas.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                Vagas encontradas
              </h2>
              <span className="text-[11px] text-slate-600">
                {vagasFiltradas.length} vaga(s)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vagasFiltradas.map((vaga) => (
                <article
                  key={vaga.id_vaga}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-400 transition cursor-pointer group"
                  onClick={() =>
                    navigate(`/vaga/${vaga.id_vaga}`, { state: { vaga } })
                  }
                >
                  <div className="flex flex-col gap-3">

                    {/* Título */}
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 line-clamp-2">
                      {vaga.nm_vaga}
                    </h3>

                    <p className="text-[11px] text-slate-500 line-clamp-3">
                      {vaga.requisitos || "Requisitos não informados."}
                    </p>

                    {/* Infos */}
                    <div className="border-t border-slate-100 pt-3 text-[11px] flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200">
                        📍 {vaga.localidade || "Localidade não informada"}
                      </span>

                      {vaga.salario && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200">
                          💰 {vaga.salario}
                        </span>
                      )}

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

                    <button
                      type="button"
                      className="mt-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-medium py-1.5 hover:bg-blue-700 transition"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
