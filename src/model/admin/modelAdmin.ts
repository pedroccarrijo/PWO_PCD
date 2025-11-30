import * as DB from "../../database/admin/query.js";

export let postAcessibilidade = async (body: {
  nm_acessibilidade: string;
  dt_criacao: string;
}): Promise<[number, string]> => {
  try {
    // Antes criava new Acessibilidade(...), mas a classe não é mais usada
    const [status, message] = await DB.insertAcessibilidade(body);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export let postBarreira = async (body: {
  nm_barreira: string;
  dt_criacao: string;
}): Promise<[number, string]> => {
  try {
    // Antes criava new Barreira(...)
    const [status, message] = await DB.insertBarreira(body);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};

export let postSubtipo = async (body: {
  nm_subtipo: string;
  dt_criacao: string;
}): Promise<[number, string]> => {
  try {
    // Antes criava new Subtipo(...)
    const [status, message] = await DB.insertSubtipo(body);
    return [status, message];
  } catch (error) {
    console.log(error);
    return [400, "Bad Request"];
  }
};
