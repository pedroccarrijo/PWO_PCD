import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { empresaService, vagaService } from "../api/api";
import { useAuth } from "../context/AuthContext";

type Empresa = {
  id_empresa: number;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  email: string;
  telefone?: string;
};

type Vaga = {
  id_vaga: number;
  id_empresa: number;
  nm_vaga: string;
  salario?: string;
  localidade?: string;
  tipo_deficiencia?: string;
  modalidade?: string;
};

export default function EmpresasPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErro("");
        setLoading(true);

        const [empRes, vagasRes] = await Promise.all([
          empresaService.getAll(),
          vagaService.getAll(),
        ]);

        setEmpresas(empRes.data || []);
        setVagas(vagasRes.data || []);
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar as empresas no momento.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getVagasDaEmpresa = (empresaId: number) =>
    vagas.filter((v) => v.id_empresa === empresaId);

  const nomeUsuario =
    user?.tipo === "candidato"
      ? user?.dados?.nm_candidato ?? "usuário"
      : "usuário";

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4">

          {/* Linha de cima */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
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
                  Empresas parceiras e vagas inclusivas
                </span>
              </div>
            </div>

            <div className="hidden sm:flex text-[11px] text-slate-500">
              Olá, <span className="font-medium text-slate-700 ml-1">{nomeUsuario}</span>
            </div>
          </div>

          {/* Título */}
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-semibold text-slate-900">
              Empresas inclusivas cadastradas
            </h1>
            <p className="text-[11px] text-slate-600 max-w-xl">
              Conheça empresas preparadas para receber profissionais com deficiência,
              veja informações importantes e explore vagas abertas.
            </p>
          </div>
        </div>
      </header>

      {/* CONTEÚDO EM DUAS COLUNAS */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <section className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr),minmax(0,1.1fr)] gap-4">

          {/* COLUNA PRINCIPAL – LISTA DE EMPRESAS */}
          <div className="space-y-4">
            {erro && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {erro}
              </div>
            )}

            {loading && (
              <div className="text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                Carregando empresas...
              </div>
            )}

            {!loading && !erro && empresas.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-500 shadow-sm">
                Ainda não há empresas cadastradas.
              </div>
            )}

            {!loading && !erro && empresas.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-800">
                    Empresas parceiras
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    {empresas.length} empresa(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {empresas.map((empresa) => {
                    const vagasDaEmpresa = getVagasDaEmpresa(empresa.id_empresa);

                    return (
                      <article
                        key={empresa.id_empresa}
                        className="relative bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-400 transition overflow-hidden"
                      >
                        {/* Faixa lateral */}
                        <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-sky-400 to-emerald-400" />

                        <div className="pl-3 flex flex-col gap-3">
                          {/* Cabeçalho */}
                          <div className="pb-3 border-b border-slate-100 space-y-1">
                            <h3 className="text-sm font-semibold text-slate-900">
                              {empresa.nome_fantasia || empresa.razao_social}
                            </h3>

                            <p className="text-[11px] text-slate-500">
                              CNPJ: {empresa.cnpj}
                            </p>

                            {empresa.telefone && (
                              <p className="text-[11px] text-slate-500">
                                Telefone: {empresa.telefone}
                              </p>
                            )}

                            <p className="text-[11px] text-slate-500">
                              E-mail: {empresa.email}
                            </p>
                          </div>

                          {/* Chips de vagas */}
                          {vagasDaEmpresa.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              <span className="text-[11px] font-medium text-slate-600">
                                Vagas abertas:
                              </span>

                              <div className="flex flex-wrap gap-1.5">
                                {vagasDaEmpresa.map((vaga) => (
                                  <div
                                    key={vaga.id_vaga}
                                    className="inline-flex flex-col gap-0.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200"
                                  >
                                    <span className="text-[11px] font-medium text-slate-800 line-clamp-1">
                                      {vaga.nm_vaga}
                                    </span>

                                    <span className="text-[10px] text-slate-500">
                                      {vaga.localidade || "Local não informado"}
                                    </span>

                                    <span className="text-[10px] text-slate-500">
                                      {vaga.modalidade || "Modalidade não informada"}
                                      {vaga.tipo_deficiencia &&
                                        ` · foco: ${vaga.tipo_deficiencia}`}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-500">
                              Esta empresa não possui vagas ativas no momento.
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* COLUNA LATERAL – RESUMO */}
          <aside className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-fit space-y-3">
            <h3 className="text-xs font-semibold text-slate-700">
              Sobre as empresas cadastradas
            </h3>

            <div className="flex flex-col gap-2 text-[11px] text-slate-600">
              <p>
                Aqui você encontra empresas comprometidas com acessibilidade e
                inclusão no mercado de trabalho.
              </p>

              <p>
                Cada card exibe informações importantes como vagas ativas,
                modalidades e locais.
              </p>

              <p>
                Explore os detalhes das vagas acessando o Explorer ou clicando em
                uma vaga na tela principal.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
