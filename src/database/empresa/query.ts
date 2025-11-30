import { pool } from "../../config/connect";

export let insertUser = async (body: {
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email: string;
  telefone?: string;
  senha: string;
}): Promise<[number, string]> => {
  try {
    const query = `
      INSERT INTO tb_empresas
        (razao_social, nome_fantasia, cnpj, email, telefone, senha)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await pool.query(query, [
      body.razao_social,
      body.nome_fantasia,
      body.cnpj,
      body.email,
      body.telefone || null,
      body.senha,
    ]);

    return [201, "Empresa criada com sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

export let getEmpresas = async (): Promise<[number, any]> => {
  try {
    const query = "SELECT * FROM tb_empresas WHERE fg_ativo = true";
    const response = await pool.query(query);
    return [200, response.rows];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

export let deleteEmpresa = async (
  id: number
): Promise<[number, string]> => {
  try {
    const query =
      "UPDATE tb_empresas SET fg_ativo = false WHERE id_empresa = $1";
    const response = await pool.query(query, [id]);

    if (response.rowCount === 0) {
      return [404, "Empresa não encontrada"];
    }

    return [200, "Empresa desativada com sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

export let updateEmpresa = async (
  body: {
    razao_social: string;
    nome_fantasia: string;
    cnpj: string;
    email?: string;
    telefone?: string;
  },
  id: number
): Promise<[number, string]> => {
  try {
    const query = `
      UPDATE tb_empresas
         SET razao_social = $1,
             nome_fantasia = $2,
             cnpj = $3,
             email = $4,
             telefone = $5
       WHERE id_empresa = $6
    `;

    const response = await pool.query(query, [
      body.razao_social,
      body.nome_fantasia,
      body.cnpj,
      body.email || null,
      body.telefone || null,
      id,
    ]);

    if (response.rowCount === 0) {
      return [404, "Empresa não encontrada"];
    }

    return [200, "Empresa atualizada com sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

/* 🔐 LOGIN EMPRESA */
export const loginEmpresa = async (
  email: string,
  senha: string
): Promise<[number, any]> => {
  try {
    const query = `
      SELECT id_empresa, razao_social, nome_fantasia, email
        FROM tb_empresas
       WHERE email = $1
         AND senha = $2
         AND fg_ativo = TRUE
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
