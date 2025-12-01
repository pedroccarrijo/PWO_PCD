import axios from "axios";
import { Candidato, Empresa, Vaga, Acessibilidade, Barreira, Subtipo } from "../types";

export const api = axios.create({
  baseURL: "http://localhost:3000", 
});

// ==============================
// CANDIDATO (PCD)
// ==============================
export const candidatoService = {
  create: (data: Candidato) => api.post("/post/candidato", data),
  getAll: () => api.get("/get/candidato"), // manter igual ao backend
  getById: (id: number) => api.get(`/get/candidato/${id}`),
  update: (id: number, data: Candidato) => api.put(`/update/candidato/${id}`, data),
  delete: (id: number) => api.delete(`/delete/candidato/${id}`),
  updateDescricao(id_candidato: number, descricao: string) {
  return api.put(`/update/candidato/${id_candidato}/descricao`, { descricao });
  },


  // 🔥 LOGIN PCD
  login: (email: string, senha: string) =>
    api.post("/login/candidato", { email, senha }),
};

// ==============================
// EMPRESA
// ==============================
export const empresaService = {
  create: (data: Empresa) => api.post("/post/empresa", data),
  getAll: () => api.get("/get/empresa"),
  getById: (id: number) => api.get(`/get/empresa/${id}`),
  update: (id: number, data: Empresa) => api.put(`/update/empresa/${id}`, data),
  delete: (id: number) => api.delete(`/delete/empresa/${id}`),

  // 🔥 LOGIN EMPRESA
  login: (email: string, senha: string) =>
    api.post("/login/empresa", { email, senha }),
};

// ==============================
// VAGA
// ==============================
export const vagaService = {
  create: (data: Vaga, empresaId: number) =>
    api.post(`/post/vaga/${empresaId}`, data),

  getAll: () => api.get("/get/vaga"),
  getById: (id: number) => api.get(`/get/vaga/${id}`),

  update: (id: number, data: Vaga) =>
    api.put(`/update/vaga/${id}`, data),
    
  delete: (id: number) => api.delete(`/delete/vaga/${id}`),

  // 🔥 candidatos dessa vaga
  getCandidatos: (vagaId: number) => api.get(`/get/vaga/${vagaId}/candidatos`),

  // 🔥 candidato se candidatar à vaga
  candidatar: (vagaId: number, candidatoId: number) =>
    api.post(`/post/candidatar/${vagaId}/${candidatoId}`),
};

// ==============================
// ADMIN
// ==============================
export const adminService = {
  createAcessibilidade: (data: Acessibilidade) =>
    api.post("/post/acessibilidade", data),

  createBarreira: (data: Barreira) =>
    api.post("/post/barreira", data),

  createSubtipo: (data: Subtipo) =>
    api.post("/post/subtipo", data),
};

// api.ts
export const candidaturaService = {
  getCandidaturasByCandidato(id_candidato: number) {
    return api.get(`/get/candidaturas/candidato/${id_candidato}`);
  },

  getCandidaturasByVaga(id_vaga: number) {
    return api.get(`/get/candidaturas/vaga/${id_vaga}`);
  },

  create(payload: any) {
    return api.post("/post/candidatura", payload);
  },
};
