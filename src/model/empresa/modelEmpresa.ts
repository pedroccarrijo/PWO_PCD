import * as DB from "../../database/empresa/query.js";

export let postEmpresa = async (body: {
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email: string;
  telefone?: string;
  senha: string;
}): Promise<[number, string]> => {
  try {
    // Antes usava new Empresa(...), mas a classe não é mais necessária
    const [status, message] = await DB.insertUser(body);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export let getEmpresas = async (): Promise<[number, any]> => {
  try {
    const [status, data] = await DB.getEmpresas();
    return [status, data];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

// 🔹 NOVO: buscar empresa por ID
export let getEmpresaById = async (
  id: number
): Promise<[number, any]> => {
  try {
    const [status, data] = await DB.getEmpresas();

    if (status !== 200) {
      return [status, data];
    }

    const empresas = data as any[];
    const empresa = empresas.find((e) => e.id_empresa === id);

    if (!empresa) {
      return [404, "Empresa não encontrada"];
    }

    return [200, empresa];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export let deleteEmpresa = async (
  id: number
): Promise<[number, string]> => {
  try {
    const [status, message] = await DB.deleteEmpresa(id);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
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
    const [status, message] = await DB.updateEmpresa(body, id);
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
    return await DB.loginEmpresa(email, senha);
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};
