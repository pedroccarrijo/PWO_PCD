import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { empresaService } from "../api/api";

export default function CadastroEmpresa() {
  const navigate = useNavigate();

  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        razao_social: razaoSocial,
        nome_fantasia: nomeFantasia || null,
        cnpj,
        email,
        telefone: telefone || null,
        senha,
      };

      await empresaService.create(payload as any);

      setSucesso("Empresa cadastrada com sucesso! Agora você já pode fazer login.");
      setTimeout(() => {
        navigate("/login/empresa");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data ||
        "Não foi possível concluir o cadastro da empresa. Tente novamente mais tarde.";
      setErro(msg);
    } finally {
      setLoading(false);
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
                className="flex-1 py-2 text-sm font-medium rounded-full text-slate-500 hover:text-slate-700"
                onClick={() => navigate("/cadastro/pcd")}
              >
                Cadastro PCD
              </button>
              <button
                type="button"
                className="flex-1 py-2 text-sm font-medium rounded-full bg-white text-blue-600 shadow-sm border border-slate-300"
              >
                Cadastro Empresa
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1">
              Cadastre sua empresa
            </h1>
            <p className="text-sm text-slate-600 mb-4">
              Informe os dados da sua organização para publicar vagas inclusivas
              e receber candidaturas de pessoas com deficiência.
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

            {/* FORM EM BLOCOS */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 max-h-[60vh] overflow-y-auto pr-1"
            >
              {/* BLOCO 1 – Dados da empresa */}
              <section className="rounded-2xl border border-slate-300 bg-white shadow-sm px-5 py-6 space-y-5">
                <div>
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 mb-2" />
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold text-slate-800">
                      1. Dados da empresa
                    </h2>
                    <span className="text-[10px] text-slate-500">
                      Identificação da organização
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Razão social
                    </label>
                    <input
                      type="text"
                      required
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="Nome jurídico da empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nome fantasia (opcional)
                    </label>
                    <input
                      type="text"
                      value={nomeFantasia}
                      onChange={(e) => setNomeFantasia(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="Como a empresa é conhecida pelo público"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      required
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                </div>
              </section>

              {/* BLOCO 2 – Contato */}
              <section className="rounded-2xl border border-slate-300 bg-white shadow-sm px-5 py-6 space-y-5">
                <div>
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-sky-400 mb-2" />
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold text-slate-800">
                      2. Contato
                    </h2>
                    <span className="text-[10px] text-slate-500">
                      Como vamos falar com você?
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      E-mail corporativo
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="contato@empresa.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Telefone (opcional)
                    </label>
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="(11) 4000-0000"
                    />
                  </div>
                </div>
              </section>

              {/* BLOCO 3 – Acesso */}
              <section className="rounded-2xl border border-slate-300 bg-white shadow-sm px-5 py-6 space-y-5">
                <div>
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-slate-500 mb-2" />
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold text-slate-800">
                      3. Dados de acesso
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
                {loading ? "Cadastrando empresa..." : "Cadastrar empresa"}
              </button>
            </form>

            <div className="mt-3 text-xs sm:text-sm text-slate-500">
              Já tem conta?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/login/empresa")}
              >
                Fazer login
              </button>
            </div>
          </div>

          {/* Lado direito: destaque */}
          <div className="hidden md:flex flex-col justify-between bg-slate-300 border-l border-slate-400 text-slate-800 p-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Torne sua empresa mais inclusiva.
              </h2>
              <p className="text-sm text-slate-700">
                Publique vagas com informações claras de acessibilidade e conecte-se
                com talentos PCD alinhados à cultura da sua organização.
              </p>
            </div>
            <div className="mt-6 space-y-2 text-xs text-slate-600">
              <p>• Fortaleça a responsabilidade social da empresa.</p>
              <p>• Amplie a diversidade nos times.</p>
              <p>• Facilite o encontro entre vagas e candidatos PCD.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
