import * as Model from "../../model/candidatura/modelCandidatura.js";

type NovaCandidatura = {
  id_vaga: number;
  id_candidato: number;
};

export const postCandidatura = async (
  body: NovaCandidatura
): Promise<[number, string]> => {
  try {
    return await Model.postCandidatura(body);
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

export const getCandidaturasByCandidato = async (
  id_candidato: number
): Promise<[number, any]> => {
  try {
    return await Model.getCandidaturasByCandidato(id_candidato);
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};

export const getCandidaturasByVaga = async (
  id_vaga: number
): Promise<[number, any]> => {
  try {
    return await Model.getCandidaturasByVaga(id_vaga);
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Error"];
  }
};
