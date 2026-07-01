import { api } from "./client";

export const statsApi = {
  getDashboard() {
    return api.get("/stats");
  },
};