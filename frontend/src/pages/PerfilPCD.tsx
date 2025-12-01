import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { candidaturaService, candidatoService } from "../api/api";

interface CandidaturaApi {
  id_candidatura: number;
  id_vaga: number;
  nm_vaga?: string;
  localidade?: string;
  empresa_nome?: string;
  data_candidatura?: string;
}

export default function PerfilPCD() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const dados: any = user?.dados || {};

  const nomeCompleto =
    dados.nm_candidato ||
    (dados.nome
      ? (dados.nome || "") + (dados.sobrenome ? ` ${dados.sobrenome}` : "")
      : "") ||
    "Seu nome aqui";

  const tipoDeficiencia =
    dados.deficiencia || dados.tipo_deficiencia || "Não informado";

  const subtipoDeficiencia =
    dados.subtipo || dados.subtipo_deficiencia || "Não informado";

  const preferenciaModalidade =
    dados.modalidade_preferida || dados.preferencia_modalidade || "Não informado";

  const preferenciaLocalidade =
    dados.localidade_preferida || dados.preferencia_localidade || "Não informado";

  const email = dados.email || "—";
  const idCandidato = dados.id_candidato || "—";
  const cpf = dados.cpf || "Não informado";

  const descricao =
    dados.descricao ||
    dados.apresentacao ||
    "Você ainda não preencheu uma descrição. No futuro, aqui poderá falar sobre suas experiências, habilidades e objetivos profissionais.";

  const recursosNecessarios: string[] = (dados.recursos_necessarios || "")
    .split(",")
    .map((r: string) => r.trim())
    .filter((r: string) => r.length > 0);

  const laudo = dados.laudo || dados.laudo_url || "";

  const fotoPerfil: string | null = dados.foto_perfil || null;

  const [candidaturas, setCandidaturas] = useState<CandidaturaApi[]>([]);
  const [loadingCandidaturas, setLoadingCandidaturas] = useState(false);
  const [erroCandidaturas, setErroCandidaturas] = useState("");
  // edição da apresentação / descrição
  const [descricaoTexto, setDescricaoTexto] = useState(descricao);
  const [editandoDescricao, setEditandoDescricao] = useState(false);
  const [salvandoDescricao, setSalvandoDescricao] = useState(false);
  const [msgDescricao, setMsgDescricao] = useState("");

  const handleSalvarDescricao = async () => {
    if (!dados.id_candidato) return;

    setMsgDescricao("");

    try {
      setSalvandoDescricao(true);
      await candidatoService.updateDescricao(dados.id_candidato, descricaoTexto);
      setMsgDescricao("Apresentação atualizada com sucesso.");
      setEditandoDescricao(false);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data ||
        "Não foi possível atualizar sua apresentação no momento.";
      setMsgDescricao(msg);
    } finally {
      setSalvandoDescricao(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login/pcd");
  };

  const primeiraLetra = (nomeCompleto || "?").trim().charAt(0).toUpperCase();

  useEffect(() => {
    const carregarCandidaturas = async () => {
      if (!dados.id_candidato) return;

      try {
        setLoadingCandidaturas(true);
        setErroCandidaturas("");
        const resp = await candidaturaService.getCandidaturasByCandidato(
          dados.id_candidato
        );
        const lista: CandidaturaApi[] = resp.data || [];
        setCandidaturas(lista);
      } catch (err: any) {
        console.error(err);
        const msg =
          err?.response?.data ||
          "Não foi possível carregar suas candidaturas no momento.";
        setErroCandidaturas(msg);
      } finally {
        setLoadingCandidaturas(false);
      }
    };

    carregarCandidaturas();
  }, [dados.id_candidato]);

  const totalCandidaturas = candidaturas.length;

  const navigateToVaga = (id_vaga: number) => {
    // DetalhesVaga já tem fallback para buscar vaga por ID
    navigate(`/vaga/${id_vaga}`);
  };

  return (
    <div className="min-h-screen bg-slate-200">
      {/* TOPO */}
      <header className="border-b border-slate-300 bg-slate-100/90 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
          {/* Linha de cima: voltar + sair */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-300">
            <div className="flex items-center gap-2">
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
                  Meu perfil PCD
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-300 bg-white/80 text-slate-600 hover:bg-slate-100"
            >
              Sair
            </button>
          </div>

          {/* Título / subtítulo em card */}
          <div className="bg-white/90 border border-slate-300 rounded-2xl p-3 shadow-sm flex flex-col gap-1">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900">
              Meu perfil, acessibilidade e candidaturas
            </h1>
            <p className="text-[11px] text-slate-600 max-w-md">
              Essas informações ajudam as empresas a entenderem melhor seu
              perfil, necessidades de acessibilidade e histórico de
              candidaturas.
            </p>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* GRID PRINCIPAL: perfil + resumo */}
        <section className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr),minmax(0,1.1fr)] gap-4">
          {/* CARD PERFIL COMPLETO */}
          <div className="bg-white/90 border border-slate-300 rounded-2xl p-5 shadow-sm space-y-5">
            {/* Topo: avatar + infos principais */}
            <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
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
                  Perfil PCD ativo para buscar vagas com acessibilidade.
                </p>

                <div className="flex flex-wrap gap-1.5 mt-1 text-[10px]">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    PCD · {tipoDeficiencia}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                    ID #{idCandidato}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    E-mail confirmado
                  </span>
                </div>
              </div>
            </div>

            {/* BLOCO – Dados pessoais */}
            <section className="rounded-2xl border border-slate-300 bg-white px-4 py-4 space-y-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-xs font-semibold text-slate-800">
                  1. Dados pessoais
                </h3>
                <span className="text-[10px] text-slate-500">
                  Informações básicas do seu cadastro
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    Nome completo
                  </p>
                  <p className="text-slate-800 text-sm">{nomeCompleto}</p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    E-mail
                  </p>
                  <p className="text-slate-800 text-sm break-all">{email}</p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    CPF
                  </p>
                  <p className="text-slate-800 text-sm">{cpf}</p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    ID do candidato
                  </p>
                  <p className="text-slate-800 text-sm">{idCandidato}</p>
                </div>
              </div>
            </section>

            {/* BLOCO – Acessibilidade & saúde */}
            <section className="rounded-2xl border border-slate-300 bg-white px-4 py-4 space-y-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-xs font-semibold text-slate-800">
                  2. Acessibilidade & saúde
                </h3>
                <span className="text-[10px] text-slate-500">
                  Como as empresas podem se preparar para te receber
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
                      Você ainda não informou recursos específicos. No cadastro,
                      é possível selecionar itens como elevador, rampa,
                      intérprete de Libras, entre outros.
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
                      Nenhum laudo informado. Esse campo é opcional.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* BLOCO – Preferências & apresentação */}
            <section className="rounded-2xl border border-slate-300 bg-white px-4 py-4 space-y-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-xs font-semibold text-slate-800">
                  3. Preferências de vaga & apresentação
                </h3>
                <span className="text-[10px] text-slate-500">
                  Como você gosta de trabalhar e quem você é
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    Modalidade preferida
                  </p>
                  <p className="text-slate-800 text-sm">
                    {preferenciaModalidade}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    Localidade preferida
                  </p>
                  <p className="text-slate-800 text-sm">
                    {preferenciaLocalidade}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium text-slate-500">
                    Apresentação / sobre você
                  </p>

                  {!editandoDescricao && (
                    <button
                      type="button"
                      onClick={() => {
                        setDescricaoTexto(descricao);
                        setEditandoDescricao(true);
                        setMsgDescricao("");
                      }}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                  )}
                </div>

                {editandoDescricao ? (
                  <div className="space-y-2">
                    <textarea
                      value={descricaoTexto}
                      onChange={(e) => setDescricaoTexto(e.target.value)}
                      className="w-full min-h-[90px] rounded-xl border border-slate-300 px-3 py-2 text-[11px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                      placeholder="Conte um pouco sobre você, suas experiências, habilidades e objetivos profissionais."
                    />

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDescricaoTexto(descricao);
                          setEditandoDescricao(false);
                          setMsgDescricao("");
                        }}
                        className="px-3 py-1.5 rounded-full border border-slate-200 text-[11px] text-slate-600 hover:bg-slate-100"
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        disabled={salvandoDescricao}
                        onClick={handleSalvarDescricao}
                        className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[11px] font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {salvandoDescricao ? "Salvando..." : "Salvar apresentação"}
                      </button>
                    </div>

                    {msgDescricao && (
                      <p className="text-[11px] text-slate-600">
                        {msgDescricao}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">
                    {descricaoTexto}
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* CARD RESUMO / STATUS PERFIL */}
          <aside className="bg-white/90 border border-slate-300 rounded-2xl p-4 shadow-sm h-fit space-y-4">
            <h3 className="text-xs font-semibold text-slate-700">
              Resumo do perfil
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status do perfil</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">
                  Ativo
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-500">Informações principais</span>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-500">
                  Em breve será possível editar esses dados diretamente nesta
                  tela.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Candidaturas enviadas</span>
                  <span className="text-[11px] font-semibold text-slate-900">
                    {totalCandidaturas}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/explorer")}
                  className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-medium px-3 py-2 hover:bg-blue-700 transition"
                >
                  Explorar novas vagas
                </button>
              </div>
            </div>
          </aside>
        </section>

        {/* CANDIDATURAS */}
        <section className="bg-white/90 border border-slate-300 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Minhas candidaturas
            </h2>
            {totalCandidaturas > 0 && (
              <span className="text-[11px] text-slate-500">
                {totalCandidaturas} candidatura(s) registrada(s)
              </span>
            )}
          </div>

          {loadingCandidaturas && (
            <p className="text-xs text-slate-500">
              Carregando suas candidaturas...
            </p>
          )}

          {erroCandidaturas && !loadingCandidaturas && (
            <p className="text-xs text-red-600">{erroCandidaturas}</p>
          )}

          {!loadingCandidaturas &&
            !erroCandidaturas &&
            totalCandidaturas === 0 && (
              <div className="border border-dashed border-slate-300 rounded-xl px-4 py-4 text-xs text-slate-600 bg-slate-50/60">
                <p>
                  Você ainda não se candidatou a nenhuma vaga pela plataforma.
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Explore as oportunidades no Explorer e envie candidaturas para
                  acompanhar tudo por aqui. 💙
                </p>
              </div>
            )}

          {!loadingCandidaturas &&
            !erroCandidaturas &&
            totalCandidaturas > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidaturas.map((cand) => (
                  <article
                    key={cand.id_candidatura}
                    className="border border-slate-200 rounded-xl p-3 bg-slate-50 hover:bg-white hover:shadow-md hover:border-blue-400 transition cursor-pointer"
                    onClick={() => navigateToVaga(cand.id_vaga)}
                  >
                    <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">
                      {cand.nm_vaga || `Vaga #${cand.id_vaga}`}
                    </h3>
                    <p className="text-[11px] text-slate-500 mb-1">
                      {cand.empresa_nome || "Empresa parceira ConectPCD"}
                    </p>
                    <p className="text-[11px] text-slate-500 mb-2">
                      {cand.localidade || "Localidade não informada"}
                    </p>
                    {cand.data_candidatura && (
                      <p className="text-[10px] text-slate-500 mb-2">
                        Candidatou-se em: {cand.data_candidatura}
                      </p>
                    )}
                    <span className="text-[11px] text-blue-600 font-medium">
                      Ver detalhes da vaga →
                    </span>
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}
