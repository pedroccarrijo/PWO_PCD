import * as DB from "../../database/candidate/query.js";

type NovoCandidato = {
  nome: string;
  sobrenome: string;
  dt_aniversario: string;
  email: string;
  telefone?: string;
  deficiencia: string;
  subtipo: string;
  senha: string;
  cpf: string;                 // NOVO
  recursos_necessarios?: string; // NOVO
  laudo?: string | null;     // NOVO
};

export const postCandidato = async (
  body: NovoCandidato
): Promise<[number, string]> => {
  try {
    const [status, message] = await DB.insertUser(body);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export const getCandidatos = async (): Promise<[number, any]> => {
  try {
    const [status, data] = await DB.getCandidatos();
    return [status, data];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export const getCandidatoById = async (
  id: number
): Promise<[number, any]> => {
  try {
    return await DB.getCandidatoById(id);
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export const deleteCandidato = async (
  id: number
): Promise<[number, string]> => {
  try {
    const [status, message] = await DB.deleteCandidato(id);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export const updateCandidato = async (
  body: NovoCandidato,
  id: number
): Promise<[number, string]> => {
  try {
    const [status, message] = await DB.updateCandidato(body, id);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export const login = async (
  email: string,
  senha: string
): Promise<[number, any]> => {
  try {
    const [status, data] = await DB.loginCandidato(email, senha);
    return [status, data];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export const updateDescricaoCandidato = async (
  id: number,
  descricao: string
): Promise<[number, string]> => {
  try {
    return await DB.updateDescricaoCandidato(id, descricao);
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};
