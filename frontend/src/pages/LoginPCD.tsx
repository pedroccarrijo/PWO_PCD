import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { candidatoService } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPCD() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await candidatoService.login(email, senha);

      login({
        tipo: "pcd",
        dados: response.data,
      });

      navigate("/explorer");
    } catch (error: any) {
      console.error(error);
      const mensagem =
        error?.response?.data ||
        "Não foi possível fazer login. Verifique as credenciais.";
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
      <div className="max-w-3xl w-full mx-4 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-400/30 border border-slate-300 overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]">

          {/* FORMULÁRIO */}
          <div className="p-8 sm:p-10">

            {/* Logo */}
            <div className="flex items-center gap-3 mb-8 border-b border-slate-300 pb-4">
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

            {/* Aba de seleção */}
            <div className="flex mb-6 rounded-full bg-slate-100 border border-slate-300 p-1">
              <button
                className="flex-1 py-2 text-sm font-medium rounded-full bg-white text-blue-600 shadow-sm border border-slate-300"
                type="button"
              >
                PCD
              </button>
              <button
                type="button"
                className="flex-1 py-2 text-sm font-medium rounded-full text-slate-500 hover:text-slate-700"
                onClick={() => navigate("/login/empresa")}
              >
                Empresa
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
              Acesse sua conta PCD
            </h1>
            <p className="text-sm text-slate-600 mb-6">
              Entre para encontrar vagas acessíveis e empresas inclusivas.
            </p>

            {erro && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-300 rounded-lg px-3 py-2">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none bg-white
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="seuemail@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none bg-white
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Sua senha"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium py-2.5 shadow-md shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-4 text-xs sm:text-sm text-slate-600">
              Ainda não tem conta?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/cadastro/pcd")}
              >
                Criar conta PCD
              </button>
            </div>
          </div>

          {/* LADO DIREITO – Texto */}
          <div className="hidden md:flex flex-col justify-between bg-slate-300 border-l border-slate-400 p-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">
                Inclusão que começa pelo acesso.
              </h2>
              <p className="text-sm text-slate-700">
                Com a ConectPCD, você encontra vagas com informações claras
                sobre acessibilidade, adaptações e barreiras existentes.
              </p>
            </div>

            <div className="mt-6 space-y-2 text-xs text-slate-600">
              <p>• Filtre vagas por tipo de deficiência e compatibilidade.</p>
              <p>• Veja empresas realmente comprometidas com inclusão.</p>
              <p>• Centralize suas candidaturas em um único painel.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
