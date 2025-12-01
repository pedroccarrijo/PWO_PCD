import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-200">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-slate-100/90 backdrop-blur border-b border-slate-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
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

          {/* Ações header */}
          <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              className="text-sm text-slate-700 hover:text-blue-600 transition"
              onClick={() => navigate("/login/pcd")}
            >
              Login PCD
            </button>
            <button
              className="text-sm text-slate-700 hover:text-blue-600 transition"
              onClick={() => navigate("/login/empresa")}
            >
              Login Empresa
            </button>

            <button
              className="px-3 py-1.5 text-xs sm:text-sm rounded-full border border-blue-500 text-blue-600 bg-slate-50 hover:bg-slate-100 transition"
              onClick={() => navigate("/cadastro/pcd")}
            >
              Criar conta PCD
            </button>
            <button
              className="px-3 py-1.5 text-xs sm:text-sm rounded-full border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
              onClick={() => navigate("/cadastro/empresa")}
            >
              Criar conta Empresa
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-stretch justify-center px-4 py-8 sm:py-12">
        <section className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 items-stretch">
          
          {/* CARD TEXTO PRINCIPAL */}
          <div className="space-y-5 bg-white/90 rounded-3xl shadow-lg shadow-slate-400/20 p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-snug">
              Conectando{" "}
              <span className="text-blue-600">talentos PCD</span> a empresas
              realmente inclusivas.
            </h1>

            <p className="text-sm sm:text-base text-slate-700 max-w-xl">
              Encontre vagas acessíveis, empresas preparadas e oportunidades
              pensadas especialmente para pessoas com deficiência. Tudo em um
              único lugar.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition"
                onClick={() => navigate("/login/pcd")}
              >
                Sou PCD – entrar
              </button>
              <button
                className="px-4 py-2.5 rounded-full border border-blue-600 bg-white text-blue-600 text-sm font-medium hover:bg-blue-50 transition"
                onClick={() => navigate("/login/empresa")}
              >
                Sou empresa – entrar
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
              <span>Não tem conta?</span>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/cadastro/pcd")}
              >
                Criar conta PCD
              </button>
              <span>•</span>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/cadastro/empresa")}
              >
                Criar conta Empresa
              </button>
            </div>
          </div>

          {/* CARD LATERAL */}
          <div className="bg-white/90 rounded-3xl shadow-lg shadow-slate-400/20 p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Por que a ConectPCD?
            </h2>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                <div className="text-base font-semibold text-slate-900">
                  +120 vagas
                </div>
                <div className="text-xs text-slate-600">
                  Oportunidades com acessibilidade mapeada para PCD.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                <div className="text-base font-semibold text-slate-900">
                  +40 empresas
                </div>
                <div className="text-xs text-slate-600">
                  Parceiras comprometidas com inclusão e diversidade.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
                <div className="text-base font-semibold text-blue-700">
                  Foco em acessibilidade
                </div>
                <div className="text-xs text-blue-700/80">
                  Informações sobre adaptações, barreiras e recursos de apoio.
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              Projeto acadêmico • Conectando PCDs e empresas de forma justa,
              humana e acessível.
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-3 text-center text-[11px] text-slate-600 border-t border-slate-300 bg-slate-100/90">
        © {new Date().getFullYear()} ConectPCD — Projeto acadêmico.
      </footer>
    </div>
  );
}
