import { pool } from "../../config/connect";

export type NovaCandidatura = {
  id_vaga: number;
  id_candidato: number;
};

// cria uma nova candidatura (opcional, já que hoje você usa a rota de vagas)
export const insertCandidatura = async (
  body: NovaCandidatura
): Promise<[number, string]> => {
  try {
    const query = `
      INSERT INTO tb_candidaturas (id_vaga, id_candidato)
      VALUES ($1, $2)
    `;

    await pool.query(query, [body.id_vaga, body.id_candidato]);

    return [201, "Candidatura registrada com sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

// lista candidaturas de um candidato (para o PerfilPCD)
export const getCandidaturasByCandidato = async (
  id_candidato: number
): Promise<[number, any]> => {
  try {
    const query = `
      SELECT 
        c.id_candidatura,
        c.id_vaga,
        c.id_candidato,
        c.data_candidatura,
        v.nm_vaga,
        v.localidade,
        v.salario
      FROM tb_candidaturas c
      JOIN tb_vagas v ON v.id_vaga = c.id_vaga
      WHERE c.id_candidato = $1
      ORDER BY c.data_candidatura DESC
    `;


    const response = await pool.query(query, [id_candidato]);
    return [200, response.rows];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

// opcional: candidaturas de uma vaga (se quiser centralizar tudo em "candidatura")
export const getCandidaturasByVaga = async (
  id_vaga: number
): Promise<[number, any]> => {
  try {
    const query = `
      SELECT 
        c.id_candidatura,
        c.id_vaga,
        c.id_candidato,
        c.data_candidatura AS data_candidatura,
        v.nm_vaga,
        v.localidade,
        v.salario
      FROM tb_candidaturas c
      JOIN tb_vagas v ON v.id_vaga = c.id_vaga
      WHERE c.id_candidato = $1
      ORDER BY c.data_candidatura DESC

    `;

    const response = await pool.query(query, [id_vaga]);
    return [200, response.rows];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};
