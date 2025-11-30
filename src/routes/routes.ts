/**
 * Definição das rotas da aplicação para as operações CRUD
 * e funcionalidades específicas, organizadas por entidade.
 */

// Rotas para o recurso Candidato
export let postCandidato: string = "/post/candidato";
export let getCanditado: string = "/get/candidato";
export let getCandidatoById: string = "/get/candidato/:id";   // ✅ ADD
export let deleteCanditado: string = "/delete/candidato/:id";
export let updateCanditado: string = "/update/candidato/:id";

// Rotas para o recurso Empresa
export let postEmpresa: string = "/post/empresa";
export let getEmpresa: string = "/get/empresa";
export let getEmpresaById: string = "/get/empresa/:id";       // ✅ ADD
export let deleteEmpresa: string = "/delete/empresa/:id";
export let updateEmpresa: string = "/update/empresa/:id";


// Rotas para o recurso Vaga, com ID como parâmetro
export let postVaga: string = "/post/vaga/:id";               // id = empresaId
export let getVagas: string = "/get/vaga";
export let getVagaById: string = "/get/vaga/:id";
export let updateVAga: string = "/update/vaga/:id";
export let deleteVaga: string = "/delete/vaga/:id";

// candidatos de uma vaga específica
export let getCandidatosVaga: string = "/get/vaga/:id/candidatos";

// rota para o candidato se candidatar à vaga
export let candidatarVaga: string = "/post/candidatar/:vagaId/:candidatoId";


//  Rotas para Login
export let loginCandidato: string = "/login/candidato";
export let loginEmpresa: string = "/login/empresa";
export let loginAdmin: string = "/login/admin";

// Rotas Para Acessibilidade

export let postAcessibilidade: string = "/post/acessibilidade";
export let postBarreira: string = "/post/barreira";
export let postSubtipo: string = "/post/subtipo";
