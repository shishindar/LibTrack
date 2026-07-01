import { api } from "./client";

export const membersApi = {
  getAll() {
    return api.get("/members");
  },

  create(member) {
    return api.post("/members", member);
  },

  update(id, member) {
    return api.put(`/members/${id}`, member);
  },

  remove(id) {
    return api.delete(`/members/${id}`);
  },
};