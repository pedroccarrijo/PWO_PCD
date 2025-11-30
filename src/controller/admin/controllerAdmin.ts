import * as Model from "../../model/admin/modelAdmin.js";

export let postAcessibilidade = async (body: {
  nm_acessibilidade: string;
  dt_criacao: string;
}): Promise<[number, string]> => {
  try {
    let [status, message] = await Model.postAcessibilidade(body);

    return [status, message];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Erro"];
  }
};
export let postBarreira = async (body: {
  nm_barreira: string;
  dt_criacao: string;
}): Promise<[number, string]> => {
  try {
    let [status, message] = await Model.postBarreira(body);

    return [status, message];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Erro"];
  }
};
export let postSubtipo = async (body: {
  nm_subtipo: string;
  dt_criacao: string;
}): Promise<[number, string]> => {
  try {
    let [status, message] = await Model.postSubtipo(body);

    return [status, message];
  } catch (error) {
    console.log(error);
    return [500, "Internal Server Erro"];
  }
};

