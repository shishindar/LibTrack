import { api } from "./client";

export const loansApi = {
  getAll() {
    return api.get("/loans");
  },

  issueBook(data) {
    return api.post("/loans/issue", data);
  },

  returnBook(loan_id) {
    return api.post("/loans/return", {
      loan_id,
    });
  },
};