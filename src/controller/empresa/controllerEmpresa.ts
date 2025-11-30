import * as Model from "../../model/empresa/modelEmpresa.js";

export let postEmpresa = async (body: {
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email: string;
  telefone?: string;
  senha: string;
}): Promise<[number, string]> => {
  try {
    const [status, message] = await Model.postEmpresa(body);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Erro"];
  }
};

export let getEmpresas = async (): Promise<[number, any]> => {
  try {
    const [status, data] = await Model.getEmpresas();
    return [status, data];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

// 🔹 NOVO: buscar empresa por ID
export let getEmpresaById = async (
  id: number
): Promise<[number, any]> => {
  try {
    const [status, data] = await Model.getEmpresaById(id);
    return [status, data];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

export let deleteEmpresa = async (
  id: number
): Promise<[number, string]> => {
  try {
    const [status, message] = await Model.deleteEmpresa(id);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

export let updateEmpresa = async (
  body: {
    razao_social: string;
    nome_fantasia: string;
    cnpj: string;
    email?: string;
    telefone?: string;
  },
  id: number
): Promise<[number, string]> => {
  try {
    const [status, message] = await Model.updateEmpresa(body, id);
    return [status, message];
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
