import * as DB from "../../database/candidatura/query.js";
import type { NovaCandidatura } from "../../database/candidatura/query.js";

export const postCandidatura = async (
  body: NovaCandidatura
): Promise<[number, string]> => {
  try {
    return await DB.insertCandidatura(body);
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export const getCandidaturasByCandidato = async (
  id_candidato: number
): Promise<[number, any]> => {
  try {
    return await DB.getCandidaturasByCandidato(id_candidato);
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export const getCandidaturasByVaga = async (
  id_vaga: number
): Promise<[number, any]> => {
  try {
    return await DB.getCandidaturasByVaga(id_vaga);
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};
