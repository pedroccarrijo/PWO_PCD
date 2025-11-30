import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { empresaService } from "../api/api";

export default function CadastroEmpresa() {
  const navigate = useNavigate();

  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [segmento, setSegmento] = useState(""); // opcional, se quiser usar
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
      const payload = {
        razao_social: nomeEmpresa,   // 👈 MAPEANDO PARA O BACK
        nome_fantasia: nomeFantasia || segmento, // usa fantasia ou segmento
        cnpj,
        email,
        telefone,
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-300/60 border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1.1fr]">
          {/* Lado esquerdo: formulário */}
          <div className="p-8 sm:p-10">
            {/* Logo + título */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                PWO
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-slate-900 text-base">
                  ConectPCD
                </span>
                <span className="text-xs text-slate-500">
                  Inclusão &amp; Empregabilidade
                </span>
              </div>
            </div>

            {/* Abinhas PCD / Empresa */}
            <div className="flex mb-6 rounded-full bg-slate-100 p-1">
              <button
                type="button"
                className="flex-1 py-2 text-sm font-medium rounded-full text-slate-500 hover:text-slate-700"
                onClick={() => navigate("/cadastro/pcd")}
              >
                Cadastro PCD
              </button>
              <button
                type="button"
                className="flex-1 py-2 text-sm font-medium rounded-full bg-white text-blue-600 shadow-sm"
              >
                Cadastro Empresa
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
              Cadastre sua empresa
            </h1>
            <p className="text-sm text-slate-500 mb-4">
              Informe os dados da sua empresa para divulgar vagas inclusivas para pessoas com deficiência.
            </p>

            {erro && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="mb-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {sucesso}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-3 max-h-[60vh] overflow-y-auto pr-1"
            >
              {/* Razão social + Nome fantasia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Razão social
                  </label>
                  <input
                    type="text"
                    required
                    value={nomeEmpresa}
                    onChange={(e) => setNomeEmpresa(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="Nome da empresa (legal)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nome fantasia
                  </label>
                  <input
                    type="text"
                    required
                    value={nomeFantasia}
                    onChange={(e) => setNomeFantasia(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="Nome fantasia"
                  />
                </div>
              </div>

              {/* Segmento (opcional) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Segmento da empresa (opcional)
                </label>
                <input
                  type="text"
                  value={segmento}
                  onChange={(e) => setSegmento(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Ex.: Tecnologia, Varejo, Educação..."
                />
              </div>

              {/* CNPJ */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  CNPJ
                </label>
                <input
                  type="text"
                  required
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              {/* Email + telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="Repita a senha"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium py-2.5 shadow-md shadow-blue-500/40 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {loading ? "Criando conta..." : "Criar conta empresa"}
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
          <div className="hidden md:flex flex-col justify-between bg-gradient-to-b from-blue-600 to-blue-700 text-white p-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Conecte sua empresa a talentos PCD.
              </h2>
              <p className="text-sm text-blue-100">
                Divulgue vagas com informações claras sobre acessibilidade e
                mostre o compromisso real com inclusão.
              </p>
            </div>
            <div className="mt-6 space-y-2 text-xs text-blue-100">
              <p>• Alcance candidatos alinhados às adaptações da sua empresa.</p>
              <p>• Fortaleça sua marca empregadora inclusiva.</p>
              <p>• Centralize e acompanhe candidaturas PCD em um só lugar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
