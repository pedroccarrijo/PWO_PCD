import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
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

          {/* Ações header */}
          <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              className="text-sm text-slate-600 hover:text-blue-600 transition"
              onClick={() => navigate("/login/pcd")}
            >
              Login PCD
            </button>
            <button
              className="text-sm text-slate-600 hover:text-blue-600 transition"
              onClick={() => navigate("/login/empresa")}
            >
              Login Empresa
            </button>

            <button
              className="px-3 py-1.5 text-xs sm:text-sm rounded-full border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 transition"
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
        <section className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 items-center">
          {/* Texto */}
          <div className="space-y-5">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-snug">
              Conectando{" "}
              <span className="text-blue-600">talentos PCD</span> a empresas
              realmente inclusivas.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              Encontre vagas acessíveis, empresas preparadas e oportunidades
              pensadas especialmente para pessoas com deficiência. Tudo em um
              único lugar.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-500/30 transition"
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

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500">
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

          {/* Card lateral */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Por que a ConectPCD?
            </h2>
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-base font-semibold text-slate-900">
                  +120 vagas
                </div>
                <div className="text-xs text-slate-500">
                  Oportunidades com acessibilidade mapeada para PCD.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-base font-semibold text-slate-900">
                  +40 empresas
                </div>
                <div className="text-xs text-slate-500">
                  Parceiras comprometidas com inclusão e diversidade.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                <div className="text-base font-semibold text-blue-700">
                  Foco em acessibilidade
                </div>
                <div className="text-xs text-blue-700/80">
                  Informações sobre adaptações, barreiras e recursos de apoio
                  disponíveis.
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              Projeto acadêmico • Conectando PCDs e empresas de forma justa,
              humana e acessível.
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-3 text-center text-[11px] text-slate-400 border-t border-slate-200 bg-white/60">
        © {new Date().getFullYear()} ConectPCD — Projeto acadêmico.
      </footer>
    </div>
  );
}
