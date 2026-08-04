import { api } from "./client";

export const profileApi = {
  getProfile: () => api.get("/profile"),

  updateProfile: (data) =>
    api.put("/profile", data),

  changePassword: (data) =>
    api.put("/profile/password", data),

  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    return api.put("/profile/photo", formData);
  },

  removePhoto: () => {
    return api.delete("/profile/photo");
  },
};