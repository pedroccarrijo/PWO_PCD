import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { candidatoService } from "../api/api";

const OPCOES_RECURSOS = [
  "Elevador",
  "Rampa de acesso",
  "Banheiro adaptado",
  "Intérprete de Libras",
  "Piso tátil",
  "Estação de trabalho adaptada",
  "Flexibilidade de horário",
];

export default function CadastroPCD() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  // 👉 continua sendo a string enviada pro backend
  const [deficiencia, setDeficiencia] = useState("");
  // 👉 controla o select (motora, visual, auditiva, outra...)
  const [tipoDeficienciaSelect, setTipoDeficienciaSelect] = useState("");

  const [subtipo, setSubtipo] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [recursos, setRecursos] = useState<string[]>([]);
  const [laudoUrl, setLaudoUrl] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleRecurso = (item: string) => {
    setRecursos((prev) =>
      prev.includes(item) ? prev.filter((r) => r !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    if (!deficiencia.trim()) {
      setErro("Informe o tipo de deficiência.");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        nome,
        sobrenome,
        dt_aniversario: dataNasc,
        email,
        telefone,
        deficiencia, // mantém igual
        subtipo,
        senha,
        cpf,
        recursos_necessarios: recursos.join(", "),
        laudo_url: laudoUrl || null,
      };

      await candidatoService.create(payload as any);

      setSucesso("Conta criada com sucesso! Agora você já pode fazer login.");
      setTimeout(() => {
        navigate("/login/pcd");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data ||
        "Não foi possível concluir o cadastro. Tente novamente mais tarde.";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTipoDeficiencia = (valor: string) => {
    setTipoDeficienciaSelect(valor);

    if (valor === "outra") {
      // deixa livre para a pessoa escrever
      setDeficiencia("");
    } else if (!valor) {
      setDeficiencia("");
    } else {
      // salva diretamente o rótulo escolhido
      setDeficiencia(valor);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 px-4">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-400/30 border border-slate-300 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_0.9fr]">
          {/* Lado esquerdo: formulário */}
          <div className="p-8 sm:p-10 bg-slate-50">
            {/* Logo + título */}
            <div className="flex items-center gap-3 mb-6 border-b border-slate-300 pb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                PWO
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-slate-800 text-base">
                  ConectPCD
                </span>
                <span className="text-xs text-slate-500">
                  Inclusão &amp; Empregabilidade
                </span>
              </div>
            </div>

            {/* Abinhas PCD / Empresa */}
            <div className="flex mb-6 rounded-full bg-slate-100 border border-slate-300 p-1">
              <button
                type="button"
                className="flex-1 py-2 text-sm font-medium rounded-full bg-white text-blue-600 shadow-sm border border-slate-300"
              >
                Cadastro PCD
              </button>
              <button
                type="button"
                className="flex-1 py-2 text-sm font-medium rounded-full text-slate-500 hover:text-slate-700"
                onClick={() => navigate("/cadastro/empresa")}
              >
                Cadastro Empresa
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1">
              Crie sua conta PCD
            </h1>
            <p className="text-sm text-slate-600 mb-4">
              As informações estão divididas em blocos para facilitar o preenchimento.
            </p>

            {erro && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-300 rounded-lg px-3 py-2">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="mb-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {sucesso}
              </div>
            )}

            {/* FORM – blocos com maior destaque visual */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 max-h-[60vh] overflow-y-auto pr-1"
            >
              {/* BLOCO 1 – Dados pessoais */}
              <section className="rounded-2xl border border-slate-300 bg-white shadow-sm px-5 py-6 space-y-5">
                <div>
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 mb-2" />
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold text-slate-800">
                      1. Dados pessoais
                    </h2>
                    <span className="text-[10px] text-slate-500">
                      Quem é você?
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      required
                      value={sobrenome}
                      onChange={(e) => setSobrenome(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="Seu sobrenome"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      required
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Data de nascimento
                    </label>
                    <input
                      type="date"
                      required
                      value={dataNasc}
                      onChange={(e) => setDataNasc(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="seuemail@exemplo.com"
                    />
                  </div>
                </div>
              </section>

              {/* BLOCO 2 – Informações sobre deficiência */}
              <section className="rounded-2xl border border-slate-300 bg-white shadow-sm px-5 py-6 space-y-5">
                <div>
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-sky-400 mb-2" />
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold text-slate-800">
                      2. Informações sobre deficiência
                    </h2>
                    <span className="text-[10px] text-slate-500">
                      Nos ajude a entender seu contexto
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Tipo de deficiência
                    </label>
                    <select
                      value={tipoDeficienciaSelect}
                      onChange={(e) => handleChangeTipoDeficiencia(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="motora">Motora</option>
                      <option value="visual">Visual</option>
                      <option value="auditiva">Auditiva</option>
                      <option value="intelectual">Intelectual</option>
                      <option value="psicossocial">Psicossocial</option>
                      <option value="multipla">Múltipla</option>
                      <option value="outra">Outra</option>
                    </select>
                  </div>

                  {/* Campo livre só quando selecionar "Outra" */}
                  {tipoDeficienciaSelect === "outra" && (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Descreva o tipo de deficiência
                      </label>
                      <input
                        type="text"
                        value={deficiencia}
                        onChange={(e) => setDeficiencia(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        placeholder="Ex.: Deficiência rara X, condição específica, etc."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Subtipo / descrição da deficiência
                    </label>
                    <input
                      type="text"
                      required
                      value={subtipo}
                      onChange={(e) => setSubtipo(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="Ex.: Amputação da perna esquerda, baixa visão, etc."
                    />
                  </div>
                </div>
              </section>

              {/* BLOCO 3 – Acessibilidade no trabalho */}
              <section className="rounded-2xl border border-slate-300 bg-white shadow-sm px-5 py-6 space-y-5">
                <div>
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 mb-2" />
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold text-slate-800">
                      3. Acessibilidade no trabalho
                    </h2>
                    <span className="text-[10px] text-slate-500">
                      O que você precisa na empresa?
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Recursos de acessibilidade necessários
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Selecione os itens que você considera importantes no dia a dia.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {OPCOES_RECURSOS.map((item) => {
                        const ativo = recursos.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleRecurso(item)}
                            className={[
                              "px-3 py-1.5 rounded-full border text-[11px] transition",
                              ativo
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/40"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
                            ].join(" ")}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Laudo médico (opcional)
                    </label>
                    <p className="text-[11px] text-slate-500 mb-1">
                      No futuro você poderá anexar arquivos direto aqui. Por enquanto,
                      se quiser, informe um link (URL) ou deixe em branco.
                    </p>
                    <input
                      type="text"
                      value={laudoUrl}
                      onChange={(e) => setLaudoUrl(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="Link para laudo (opcional)"
                    />
                  </div>
                </div>
              </section>

              {/* BLOCO 4 – Acesso à conta */}
              <section className="rounded-2xl border border-slate-300 bg-white shadow-sm px-5 py-6 space-y-5">
                <div>
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-slate-500 mb-2" />
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold text-slate-800">
                      4. Dados de acesso
                    </h2>
                    <span className="text-[10px] text-slate-500">
                      Você usará esses dados para entrar
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="Crie uma senha"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Confirmar senha
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="Repita a senha"
                    />
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium py-2.5 shadow-md shadow-blue-500/40 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {loading ? "Criando conta..." : "Criar conta PCD"}
              </button>
            </form>

            <div className="mt-3 text-xs sm:text-sm text-slate-500">
              Já tem conta?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/login/pcd")}
              >
                Fazer login
              </button>
            </div>
          </div>

          {/* Lado direito: destaque */}
          <div className="hidden md:flex flex-col justify-between bg-slate-300 border-l border-slate-400 text-slate-800 p-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Seu perfil importa.
              </h2>
              <p className="text-sm text-slate-700">
                Ao detalhar sua deficiência, recursos necessários e preferências,
                você aumenta as chances de encontrar vagas realmente adequadas.
              </p>
            </div>
            <div className="mt-6 space-y-2 text-xs text-slate-600">
              <p>• Destaque suas habilidades e experiências.</p>
              <p>• Encontre empresas preparadas para te receber.</p>
              <p>• Acompanhe suas candidaturas em um só lugar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
