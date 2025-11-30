export interface Candidato {
  id_candidato?: number;
  nome: string;
  sobrenome: string;
  cpf: string;          // 🔹 NOVO
  dt_aniversario: string;
  email: string;
  telefone?: string;
  deficiencia: string;
  subtipo: string;
  laudo?: string | null; // 🔹 NOVO
  senha?: string;
}


export interface Empresa {
  id?: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
}

export interface Vaga {
  id_vaga?: number;
  nm_vaga: string;
  salario: string;
  localidade: string;
  requisitos: string;
  id_empresa?: number;
}

export interface Acessibilidade {
  id?: number;
  nm_acessibilidade: string;
  dt_criacao: string;
}

export interface Barreira {
  id?: number;
  nm_barreira: string;
  dt_criacao: string;
}

export interface Subtipo {
  id?: number;
  nm_subtipo: string;
  dt_criacao: string;
}

