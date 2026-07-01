import { api } from "./client";

export const finesApi = {

  getAll() {
    return api.get("/fines");
  },

  payFine(id) {
    return api.put(`/fines/pay/${id}`);
  }

};