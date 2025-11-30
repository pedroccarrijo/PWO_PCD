import * as DB from "../../database/vaga/query.js";
// ❌ A classe Vaga não é mais necessária
// import { Vaga } from "../class/Vaga.js";

export let postVaga = async (
  body: {
    nm_vaga: string;
    salario: string;
    localidade: string;
    requisitos: string;
    tipo_deficiencia?: string;
    modalidade?: string;
    tipo_contrato?: string;
    carga_horaria?: string;
    beneficios?: string;
    acessibilidade?: string;
  },
  id: number
): Promise<[number, string]> => {
  try {
    // Agora enviamos TODOS os dados diretamente para o DB
    const [status, message] = await DB.insertVaga(body, id);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export let getVagas = async (): Promise<[number, any]> => {
  try {
    let [status, data] = await DB.getVagas();
    return [status, data];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export let deleteVaga = async (id: number): Promise<[number, string]> => {
  try {
    let [status, message] = await DB.deleteVaga(id);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export let updateVaga = async (
  body: {
    nm_vaga: string;
    salario: string;
    localidade: string;
    requisitos: string;
    tipo_deficiencia?: string;
    modalidade?: string;
    tipo_contrato?: string;
    carga_horaria?: string;
    beneficios?: string;
    acessibilidade?: string;
  },
  id: number
): Promise<[number, string]> => {
  try {
    // Enviamos todos os campos assim como no insert
    let [status, message] = await DB.updateVaga(body, id);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

// 🔹 NOVO: buscar vaga por ID
export let getVagaById = async (id: number): Promise<[number, any]> => {
  try {
    let [status, data] = await DB.getVagaById(id);
    return [status, data];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

// 🔹 NOVO: listar candidatos de uma vaga
export let getCandidatosVaga = async (
  vagaId: number
): Promise<[number, any]> => {
  try {
    let [status, data] = await DB.getCandidatosVaga(vagaId);
    return [status, data];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

// 🔹 NOVO: candidato se candidatar à vaga
export let candidatarVaga = async (
  vagaId: number,
  candidatoId: number
): Promise<[number, string]> => {
  try {
    let [status, message] = await DB.candidatarVaga(vagaId, candidatoId);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};
