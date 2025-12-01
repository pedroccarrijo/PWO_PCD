import { pool } from "../../config/connect";

type NovoCandidato = {
  nome: string;
  sobrenome: string;
  dt_aniversario: string;
  email: string;
  telefone?: string;
  deficiencia: string;
  subtipo: string;
  senha: string;
  cpf: string;                 // NOVO
  recursos_necessarios?: string; // NOVO
  laudo?: string | null;     // NOVO
};


export const insertUser = async (body: NovoCandidato): Promise<[number, string]> => {
  try {
    const query = `
      INSERT INTO tb_candidatos 
        (nome, sobrenome, dt_aniversario, email, telefone, deficiencia, subtipo, senha, cpf, recursos_necessarios, laudo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
    await pool.query(query, [
      body.nome,
      body.sobrenome,
      body.dt_aniversario,
      body.email,
      body.telefone ?? null,
      body.deficiencia,
      body.subtipo,
      body.senha,
      body.cpf,
      body.recursos_necessarios ?? null,
      body.laudo ?? null,
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
        dt_aniversario,
        email,
        telefone,
        deficiencia,
        subtipo,
        cpf,
        recursos_necessarios,
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
          dt_aniversario = $3,
          email = $4,
          telefone = $5,
          deficiencia = $6,
          subtipo = $7,
          cpf = $8,
          recursos_necessarios = $9,
          laudo = $10
      WHERE id_candidato = $11

    `;
    const response = await pool.query(query, [
     body.nome,
      body.sobrenome,
      body.dt_aniversario,
      body.email,
      body.telefone ?? null,
      body.deficiencia,
      body.subtipo,
      body.senha,
      body.cpf,
      body.recursos_necessarios ?? null,
      body.laudo ?? null,
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
        dt_aniversario,
        email,
        telefone,
        deficiencia,
        subtipo,
        recursos_necessarios,
        laudo,
        descricao
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
        recursos_necessarios,
        laudo,
        descricao
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

export const updateDescricaoCandidato = async (
  id: number,
  descricao: string
): Promise<[number, string]> => {
  try {
    const query = `
      UPDATE tb_candidatos
      SET descricao = $1
      WHERE id_candidato = $2
    `;

    const response = await pool.query(query, [descricao, id]);

    if (response.rowCount === 0) {
      return [404, "Candidato não encontrado"];
    }

    return [200, "Descrição atualizada com sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};
