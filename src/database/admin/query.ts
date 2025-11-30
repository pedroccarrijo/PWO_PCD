import { pool } from "../../config/connect";

export let insertAcessibilidade = async (body: {
  nm_acessibilidade: string;
  dt_criacao: string;
}): Promise<[number, string]> => {
  try {
    let query: string =
      "INSERT INTO tb_acessibilidades (nm_acessibilidade, dt_criacao) VALUES ($1, $2)";
    let response = await pool.query(query, [
      body.nm_acessibilidade,
      body.dt_criacao,
    ]);
    return [201, "Criado com Sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};
export let insertBarreira = async (body: {
  nm_barreira: string;
  dt_criacao: string;
}): Promise<[number, string]> => {
  try {
    let query: string =
      "INSERT INTO tb_barreiras (nm_barreira, dt_criacao) VALUES ($1, $2)";
    let response = await pool.query(query, [
      body.nm_barreira,
      body.dt_criacao,
    ]);
    return [201, "Criado com Sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};
export let insertSubtipo = async (body: {
  nm_subtipo: string;
  dt_criacao: string;
}): Promise<[number, string]> => {
  try {
    let query: string =
      "INSERT INTO tb_subtipos_deficiencias (nm_subtipo, dt_criacao) VALUES ($1, $2)";
    let response = await pool.query(query, [
      body.nm_subtipo,
      body.dt_criacao,
    ]);
    return [201, "Criado com Sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};
