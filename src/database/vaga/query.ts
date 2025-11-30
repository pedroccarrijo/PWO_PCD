import { pool } from "../../config/connect";

export let insertVaga = async (
  body: {
    nm_vaga: string;
    salario: string;
    localidade: string;
    requisitos: string;
    tipo_deficiencia?: string;
    modalidade?: string;
    tipo_contrato?: string;
    carga_horaria?: string;
    beneficios?: string;
    acessibilidade?: string;
  },
  id: number // id_empresa
): Promise<[number, string]> => {
  try {
    const query = `
      INSERT INTO tb_vagas (
        nm_vaga,
        salario,
        localidade,
        requisitos,
        tipo_deficiencia,
        modalidade,
        tipo_contrato,
        carga_horaria,
        beneficios,
        acessibilidade,
        id_empresa
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    await pool.query(query, [
      body.nm_vaga,
      body.salario,
      body.localidade,
      body.requisitos,
      body.tipo_deficiencia || null,
      body.modalidade || null,
      body.tipo_contrato || null,
      body.carga_horaria || null,
      body.beneficios || null,
      body.acessibilidade || null,
      id, // id_empresa
    ]);

    return [201, "Criado com Sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};


export let getVagas = async (): Promise<[number, any]> => {
  try {
    let query: string = "SELECT * FROM tb_vagas WHERE fg_ativo = true";
    let response = await pool.query(query);
    return [200, response.rows];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

export let deleteVaga = async (id: number): Promise<[number, string]> => {
  try {
    let query: string =
      "UPDATE tb_vagas SET fg_ativo = false WHERE id_vaga = $1";
    let response = await pool.query(query, [id]);

    if (response.rowCount === 0) {
      return [404, "Vaga não encontrada"];
    }

    return [200, "Vaga desativada com sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

export let updateVaga = async (
  body: {
    nm_vaga: string;
    salario: string;
    localidade: string;
    requisitos: string;
    tipo_deficiencia?: string;
    modalidade?: string;
    tipo_contrato?: string;
    carga_horaria?: string;
    beneficios?: string;
    acessibilidade?: string;
  },
  id: number // id_vaga
): Promise<[number, string]> => {
  try {
    const query = `
      UPDATE tb_vagas
      SET
        nm_vaga = $1,
        salario = $2,
        localidade = $3,
        requisitos = $4,
        tipo_deficiencia = $5,
        modalidade = $6,
        tipo_contrato = $7,
        carga_horaria = $8,
        beneficios = $9,
        acessibilidade = $10
      WHERE id_vaga = $11
    `;

    const response = await pool.query(query, [
      body.nm_vaga,
      body.salario,
      body.localidade,
      body.requisitos,
      body.tipo_deficiencia || null,
      body.modalidade || null,
      body.tipo_contrato || null,
      body.carga_horaria || null,
      body.beneficios || null,
      body.acessibilidade || null,
      id,
    ]);

    if (response.rowCount === 0) {
      return [404, "Vaga não encontrada"];
    }

    return [200, "Vaga atualizada com sucesso"];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};


/* 🔹 NOVO: buscar vaga por ID */
export let getVagaById = async (id: number): Promise<[number, any]> => {
  try {
    const query =
      "SELECT * FROM tb_vagas WHERE id_vaga = $1 AND fg_ativo = true";
    const response = await pool.query(query, [id]);

    if (response.rowCount === 0) {
      return [404, "Vaga não encontrada"];
    }

    return [200, response.rows[0]];
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

/* 🔹 NOVO: listar candidatos de uma vaga */
export let getCandidatosVaga = async (
  vagaId: number
): Promise<[number, any]> => {
  try {
    const query = `
      SELECT c.*
      FROM tb_candidatos c
      INNER JOIN tb_candidaturas cand
        ON cand.id_candidato = c.id_candidato
      WHERE cand.id_vaga = $1
        AND c.fg_ativo = true
    `;
    const response = await pool.query(query, [vagaId]);

    return [200, response.rows]; // pode ser lista vazia, não é erro
  } catch (error) {
    console.log(error);
    return [500, String(error)];
  }
};

/* 🔹 NOVO: candidato se candidatar à vaga */
export let candidatarVaga = async (
  vagaId: number,
  candidatoId: number
): Promise<[number, string]> => {
  try {
    const query = `
      INSERT INTO tb_candidaturas (id_vaga, id_candidato)
      VALUES ($1, $2)
    `;
    const response = await pool.query(query, [vagaId, candidatoId]);

    return [201, "Candidatura registrada com sucesso"];
  } catch (error: any) {
    console.log(error);

    // se quiser tratar erro de duplicidade, dá pra checar código de erro aqui
    return [500, String(error)];
  }
};
