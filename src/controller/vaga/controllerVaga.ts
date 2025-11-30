import * as Model from "../../model/vaga/modelVaga.js";

export let postVaga = async (
  body: {
    nm_vaga: string;
    salario: string;
    localidade: string;
    requisitos: string;
  },
  id: number // id da empresa
): Promise<[number, string]> => {
  try {
    let [status, message] = await Model.postVaga(body, id);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Erro"];
  }
};

export let getVagas = async (): Promise<[number, any]> => {
  try {
    let [status, data] = await Model.getVagas();
    return [status, data];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

export let deleteVaga = async (id: number): Promise<[number, string]> => {
  try {
    let [status, message] = await Model.deleteVaga(id);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

export let updateVaga = async (
  body: {
    nm_vaga: string;
    salario: string;
    localidade: string;
    requisitos: string;
  },
  id: number
): Promise<[number, string]> => {
  try {
    let [status, message] = await Model.updateVaga(body, id);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

// 🔹 NOVO: buscar vaga por ID (para /get/vaga/:id)
export let getVagaById = async (id: number): Promise<[number, any]> => {
  try {
    let [status, data] = await Model.getVagaById(id);
    return [status, data];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

// 🔹 NOVO: listar candidatos de uma vaga (para /get/vaga/:id/candidatos)
export let getCandidatosVaga = async (
  vagaId: number
): Promise<[number, any]> => {
  try {
    let [status, data] = await Model.getCandidatosVaga(vagaId);
    return [status, data];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

// 🔹 NOVO: candidato se candidatar à vaga (para /post/candidatar/:vagaId/:candidatoId)
export let candidatarVaga = async (
  vagaId: number,
  candidatoId: number
): Promise<[number, string]> => {
  try {
    let [status, message] = await Model.candidatarVaga(vagaId, candidatoId);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};
