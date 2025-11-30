import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { vagaService } from "../api/api";

export default function CriarVagaEmpresa() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const empresa = user?.tipo === "empresa" ? user.dados : null;

  const [titulo, setTitulo] = useState("");
  const [salario, setSalario] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [requisitos, setRequisitos] = useState(
    "Descreva a função, requisitos e principalmente as condições de acessibilidade disponíveis (ex.: elevador para cadeirantes, rampas, intérprete de Libras, etc.)."
  );

  // novos campos
  const [tipoDeficiencia, setTipoDeficiencia] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [beneficios, setBeneficios] = useState("");

  const [acessibilidade, setAcessibilidade] = useState<string[]>([]);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  if (!empresa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm text-sm text-slate-700">
          Você não está autenticado como empresa.
        </div>
      </div>
    );
  }

  const toggleAcessibilidade = (item: string) => {
    setAcessibilidade((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!titulo.trim()) {
      setErro("Informe um título para a vaga.");
      return;
    }

    if (!tipoDeficiencia || !modalidade || !tipoContrato) {
      setErro(
        "Selecione ao menos o tipo de deficiência, modalidade de trabalho e tipo de contrato."
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nm_vaga: titulo,
        salario: salario || "",
        localidade,
        requisitos,

        // novos campos enviados para o back
        tipo_deficiencia: tipoDeficiencia, // ex.: "motora", "visual", "auditiva", "intelectual"
        modalidade, // ex.: "Presencial", "Remoto", "Híbrido"
        tipo_contrato: tipoContrato, // ex.: "CLT", "PJ", "Estágio", "Temporário"
        carga_horaria: cargaHoraria, // ex.: "40h semanais"
        beneficios, // texto livre

        acessibilidade: acessibilidade.join(", "), // ex.: "Elevador; Rampa; Banheiro adaptado"
      };

      // se o back-end exigir o id da empresa no body, podemos incluir aqui também:
      // (além do parâmetro na URL)
      // (descomentar se for o caso)
      // (payload as any).id_empresa = empresa.id_empresa;

      await vagaService.create(payload as any, empresa.id_empresa);

      setSucesso("Vaga criada com sucesso!");
      setTimeout(() => {
        navigate("/empresa/dashboard");
      }, 1200);
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Não foi possível criar a vaga. Verifique os campos obrigatórios e tente novamente.";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Topo */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/empresa/dashboard")}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              ⟵ Voltar
            </button>

            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              PWO
            </div>

            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm text-slate-900">
                Nova vaga · {empresa.nome_fantasia || empresa.razao_social}
              </span>
              <span className="text-[11px] text-slate-500">
                Descreva a vaga e as condições de acessibilidade
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900 mb-3">
            Criar nova vaga inclusiva
          </h1>
          <p className="text-xs text-slate-500 mb-4">
            Quanto mais claras forem as informações sobre acessibilidade, mais
            fácil será para pessoas com deficiência entenderem se a vaga é
            adequada ao seu perfil.
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
            className="space-y-4 max-h-[65vh] overflow-y-auto pr-1"
          >
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Título da vaga
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="Ex.: Desenvolvedor(a) Front-end Pleno"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Localidade
                </label>
                <input
                  type="text"
                  value={localidade}
                  onChange={(e) => setLocalidade(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Ex.: São Paulo - SP, Remoto, Híbrido..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Faixa salarial (opcional)
                </label>
                <input
                  type="text"
                  value={salario}
                  onChange={(e) => setSalario(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Ex.: R$ 3.000 a R$ 4.500"
                />
              </div>
            </div>

            {/* novos selects */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tipo de deficiência foco da vaga
                </label>
                <select
                  value={tipoDeficiencia}
                  onChange={(e) => setTipoDeficiencia(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="motora">Motora</option>
                  <option value="visual">Visual</option>
                  <option value="auditiva">Auditiva</option>
                  <option value="intelectual">Intelectual</option>
                  <option value="psicossocial">Psicossocial</option>
                  <option value="multipla">Múltipla</option>
                  <option value="indiferente">Indiferente (vaga aberta para qualquer PCD)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Modalidade de trabalho
                </label>
                <select
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tipo de contrato
                </label>
                <select
                  value={tipoContrato}
                  onChange={(e) => setTipoContrato(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="Estágio">Estágio</option>
                  <option value="Temporário">Temporário</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Carga horária
                </label>
                <input
                  type="text"
                  value={cargaHoraria}
                  onChange={(e) => setCargaHoraria(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Ex.: 40h semanais, 6h/dia..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Benefícios (vale refeição, plano de saúde, etc.)
                </label>
                <input
                  type="text"
                  value={beneficios}
                  onChange={(e) => setBeneficios(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Ex.: VR, VA, plano de saúde, auxílio home office..."
                />
              </div>
            </div>

            {/* checkboxes de acessibilidade */}
            <div>
              <span className="block text-xs font-medium text-slate-700 mb-1">
                Recursos de acessibilidade disponíveis
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {[
                  "Elevador para cadeirantes",
                  "Rampa de acesso",
                  "Banheiro adaptado",
                  "Vaga de estacionamento reservada",
                  "Intérprete de Libras",
                  "Piso tátil",
                  "Ambiente preparado para cão-guia",
                  "Recursos de leitura de tela / softwares de acessibilidade"
                ].map((item) => (
                  <label
                    key={item}
                    className="inline-flex items-center gap-2 text-slate-600"
                  >
                    <input
                      type="checkbox"
                      checked={acessibilidade.includes(item)}
                      onChange={() => toggleAcessibilidade(item)}
                      className="rounded border-slate-300"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Essas informações ajudam o sistema a recomendar melhor sua vaga
                para o perfil de cada pessoa com deficiência.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Descrição da vaga, requisitos e acessibilidade
              </label>
              <textarea
                value={requisitos}
                onChange={(e) => setRequisitos(e.target.value)}
                rows={6}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Dica: mencione itens como elevador para cadeirantes, rampas,
                banheiros adaptados, intérprete de Libras, piso tátil, entre
                outros. Isso ajuda o sistema a recomendar melhor sua vaga.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium py-2.5 shadow-md shadow-blue-500/40 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {loading ? "Salvando vaga..." : "Salvar vaga"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
