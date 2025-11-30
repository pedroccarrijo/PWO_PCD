import * as Model from "../../model/candidato/modelCandidato.js";

type NovoCandidato = {
  nome: string;
  sobrenome: string;
  cpf: string;              // 🔹 NOVO
  dt_aniversario: string;
  email: string;
  telefone?: string;
  deficiencia: string;
  subtipo: string;
  laudo?: string | null;    // 🔹 NOVO (opcional)
  senha: string;
};

export const postCandidato = async (
  body: NovoCandidato
): Promise<[number, string]> => {
  try {
    return await Model.postCandidato(body);
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

export const getCandidatos = async (): Promise<[number, any]> => {
  try {
    return await Model.getCandidatos();
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

export const deleteCandidato = async (
  id: number
): Promise<[number, string]> => {
  try {
    return await Model.deleteCandidato(id);
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

export const updateCandidato = async (
  body: NovoCandidato,
  id: number
): Promise<[number, string]> => {
  try {
    return await Model.updateCandidato(body, id);
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

export const login = async (
  email: string,
  senha: string
): Promise<[number, any]> => {
  try {
    return await Model.login(email, senha);
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

export const getCandidatoById = async (
  id: number
): Promise<[number, any]> => {
  try {
    return await Model.getCandidatoById(id);
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};
