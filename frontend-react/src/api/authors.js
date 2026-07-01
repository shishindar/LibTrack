import { api } from "./client";

export const authorsApi = {

  getAll() {
    return api.get("/authors");
  },

  getById(id) {
    return api.get(`/authors/${id}`);
  },

  create(author) {
    return api.post("/authors", author);
  },

  update(id, author) {
    return api.put(`/authors/${id}`, author);
  },

  remove(id) {
    return api.delete(`/authors/${id}`);
  }

};