import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PerfilPCD() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // esperando o formato { tipo: "pcd", dados: { ... } }
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
    dados.modalidade_preferida ||
    dados.preferencia_modalidade ||
    "Não informado";

  const preferenciaLocalidade =
    dados.localidade_preferida ||
    dados.preferencia_localidade ||
    "Não informado";

  const email = dados.email || "—";
  const idCandidato = dados.id_candidato || "—";
  const cpf = dados.cpf || "Não informado";

  // Laudo (caso backend envie uma URL ou algo similar)
  const laudoUrl = dados.laudo_url || dados.laudo || null;
  const textoLaudo = laudoUrl
    ? "Laudo médico enviado. As empresas poderão visualizar conforme as regras da plataforma."
    : "Nenhum laudo enviado. O envio é opcional e pode ser feito no cadastro ou atualização do perfil.";

  // Apresentação / descrição do perfil (para empresas verem)
  const descricaoPerfil =
    dados.descricao_perfil || dados.apresentacao || "";

  // Recursos de acessibilidade necessários
  let recursosNecessarios: string[] = [];
  if (Array.isArray(dados.recursos_necessarios)) {
    recursosNecessarios = dados.recursos_necessarios;
  } else if (typeof dados.recursos_necessarios === "string") {
    recursosNecessarios = dados.recursos_necessarios
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  const handleLogout = () => {
    logout();
    navigate("/login/pcd");
  };

  const primeiraLetra = (nomeCompleto || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      {/* TOPO */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
          {/* Linha de cima: voltar + sair */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
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
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
            >
              Sair
            </button>
          </div>

          {/* Título / subtítulo */}
          <div className="flex flex-col gap-1">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900">
              Meu perfil e preferências de vaga
            </h1>
            <p className="text-[11px] text-slate-600 max-w-md">
              Essas informações ajudam as empresas a entenderem melhor seu
              perfil, necessidades de acessibilidade e preferências de trabalho.
            </p>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* GRID PRINCIPAL: perfil + resumo */}
        <section className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr),minmax(0,1.1fr)] gap-4">
          {/* CARD PERFIL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            {/* Topo: avatar + infos principais */}
            <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-base shadow-md">
                  {primeiraLetra}
                </div>
                {/* Ícone de imagem (placeholder para foto de perfil) */}
                <button
                  type="button"
                  disabled
                  title="Em breve você poderá adicionar sua foto de perfil"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[11px] shadow-sm text-slate-600"
                >
                  📷
                </button>
              </div>

              <div className="flex-1 space-y-1">
                <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                  {nomeCompleto}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Perfil PCD conectado para buscar vagas com acessibilidade.
                </p>

                <div className="flex flex-wrap gap-1.5 mt-1 text-[10px]">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    PCD · {tipoDeficiencia}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                    ID #{idCandidato}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    E-mail cadastrado
                  </span>
                </div>
              </div>
            </div>

            {/* Dados pessoais */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-700">
                Dados pessoais
              </h3>
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
                    ID do candidato
                  </p>
                  <p className="text-slate-800 text-sm">{idCandidato}</p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    CPF
                  </p>
                  <p className="text-slate-800 text-sm">{cpf}</p>
                </div>
              </div>

              {/* Laudo médico */}
              <div className="mt-1">
                <p className="text-[11px] font-medium text-slate-500 mb-1">
                  Laudo médico
                </p>
                <p className="text-[11px] text-slate-600">{textoLaudo}</p>
              </div>
            </div>

            {/* Acessibilidade & saúde */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-semibold text-slate-700">
                Acessibilidade & saúde
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    Tipo de deficiência
                  </p>
                  <p className="text-slate-800 text-sm">
                    {tipoDeficiencia}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    Subtipo / descrição
                  </p>
                  <p className="text-slate-800 text-sm">
                    {subtipoDeficiencia}
                  </p>
                </div>
              </div>
            </div>

            {/* Recursos de acessibilidade necessários */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-semibold text-slate-700">
                Recursos de acessibilidade necessários
              </h3>

              {recursosNecessarios.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {recursosNecessarios.map((rec) => (
                    <span
                      key={rec}
                      className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700"
                    >
                      {rec}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-600">
                  Em versões futuras, você poderá selecionar itens como{" "}
                  <strong>elevador</strong>, <strong>rampa de acesso</strong>,{" "}
                  <strong>intérprete de Libras</strong>,{" "}
                  <strong>piso tátil</strong>, entre outros. Essas escolhas
                  serão usadas para recomendar vagas que tenham as adaptações
                  necessárias.
                </p>
              )}
            </div>

            {/* Preferências de vaga */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-semibold text-slate-700">
                Preferências de vaga
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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

                <div className="sm:col-span-2">
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    Áreas de interesse
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Em breve você poderá informar áreas desejadas, como
                    tecnologia, atendimento, administrativo, operação, entre
                    outras.
                  </p>
                </div>
              </div>
            </div>

            {/* Apresentação / Sobre mim */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-700">
                  Apresentação / Sobre mim
                </h3>
                <span className="text-[10px] text-slate-500">
                  Esse texto pode ser exibido para as empresas nas suas
                  candidaturas.
                </span>
              </div>

              <p className="text-[11px] text-slate-600 whitespace-pre-line">
                {descricaoPerfil
                  ? descricaoPerfil
                  : "Você ainda não possui uma apresentação cadastrada. Em futuras versões, será possível editar aqui um texto sobre você, suas experiências, habilidades e o tipo de ambiente em que gosta de trabalhar."}
              </p>
            </div>
          </div>

          {/* CARD RESUMO / STATUS PERFIL */}
          <aside className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-fit space-y-4">
            <h3 className="text-xs font-semibold text-slate-700">
              Resumo do perfil
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Completo para uso básico</span>
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
                  Em breve você poderá completar mais campos para aumentar a
                  qualidade das recomendações e das vagas sugeridas.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-[11px] text-slate-600">
                  Dica: mantenha seus dados atualizados e, futuramente, marque
                  os recursos de acessibilidade que você precisa para receber
                  vagas mais aderentes à sua realidade.
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* CANDIDATURAS */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Minhas candidaturas
            </h2>
            <span className="text-[11px] text-slate-500">
              Em breve: histórico completo
            </span>
          </div>

          <div className="border border-dashed border-slate-300 rounded-xl px-4 py-4 text-xs text-slate-600 bg-slate-50/60">
            <p>
              Futuramente, aqui você verá todas as vagas em que se candidatou,
              com status como <strong>“Em análise”</strong>,{" "}
              <strong>“Entrevista marcada”</strong> e{" "}
              <strong>“Contratado(a)”</strong>.
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Por enquanto, continue explorando vagas na tela de Explorer. 💙
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
