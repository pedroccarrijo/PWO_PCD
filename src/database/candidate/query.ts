import { pool } from "../../config/connect";

type NovoCandidato = {
  nome: string;
  sobrenome: string;
  cpf: string;               // 🔹 NOVO
  dt_aniversario: string;
  email: string;
  telefone?: string;
  deficiencia: string;
  subtipo: string;
  laudo?: string | null;     // 🔹 NOVO
  senha: string;
};

export const insertUser = async (
  body: NovoCandidato
): Promise<[number, string]> => {
  try {
    const query = `
      INSERT INTO tb_candidatos 
        (nome, sobrenome, cpf, dt_aniversario, email, telefone, deficiencia, subtipo, laudo, senha)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    await pool.query(query, [
      body.nome,
      body.sobrenome,
      body.cpf,
      body.dt_aniversario,
      body.email,
      body.telefone ?? null,
      body.deficiencia,
      body.subtipo,
      body.laudo ?? null,
      body.senha,
    ]);
    return [201, "Candidato criado com sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

export const getCandidatos = async (): Promise<[number, any]> => {
  try {
    const query = `
      SELECT 
        id_candidato,
        nome,
        sobrenome,
        cpf,
        dt_aniversario,
        email,
        telefone,
        deficiencia,
        subtipo,
        laudo
      FROM tb_candidatos
      WHERE fg_ativo = TRUE
    `;
    const response = await pool.query(query);
    return [200, response.rows];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

export const deleteCandidato = async (
  id: number
): Promise<[number, string]> => {
  try {
    const query = `
      UPDATE tb_candidatos 
      SET fg_ativo = FALSE 
      WHERE id_candidato = $1
    `;
    const response = await pool.query(query, [id]);

    if (response.rowCount === 0) {
      return [404, "Candidato não encontrado"];
    }

    return [200, "Candidato desativado com sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

export const updateCandidato = async (
  body: NovoCandidato,
  id: number
): Promise<[number, string]> => {
  try {
    const query = `
      UPDATE tb_candidatos
      SET nome = $1,
          sobrenome = $2,
          cpf = $3,
          dt_aniversario = $4,
          email = $5,
          telefone = $6,
          deficiencia = $7,
          subtipo = $8,
          laudo = $9
      WHERE id_candidato = $10
    `;
    const response = await pool.query(query, [
      body.nome,
      body.sobrenome,
      body.cpf,
      body.dt_aniversario,
      body.email,
      body.telefone ?? null,
      body.deficiencia,
      body.subtipo,
      body.laudo ?? null,
      id,
    ]);

    if (response.rowCount === 0) {
      return [404, "Candidato não encontrado"];
    }

    return [200, "Candidato atualizado com sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

// 🔐 LOGIN CANDIDATO
export const loginCandidato = async (
  email: string,
  senha: string
): Promise<[number, any]> => {
  try {
    const query = `
      SELECT 
        id_candidato,
        nome,
        sobrenome,
        cpf,
        email,
        telefone,
        deficiencia,
        subtipo,
        laudo
      FROM tb_candidatos
      WHERE email = $1 AND senha = $2 AND fg_ativo = TRUE
    `;
    const response = await pool.query(query, [email, senha]);

    if (response.rowCount === 0) {
      return [401, "E-mail ou senha inválidos"];
    }

    return [200, response.rows[0]];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

export const getCandidatoById = async (
  id: number
): Promise<[number, any]> => {
  try {
    const query = `
      SELECT 
        id_candidato,
        nome,
        sobrenome,
        cpf,
        dt_aniversario,
        email,
        telefone,
        deficiencia,
        subtipo,
        laudo
      FROM tb_candidatos
      WHERE id_candidato = $1 AND fg_ativo = TRUE
    `;
    const response = await pool.query(query, [id]);

    if (response.rowCount === 0) {
      return [404, "Candidato não encontrado"];
    }

    return [200, response.rows[0]];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};
