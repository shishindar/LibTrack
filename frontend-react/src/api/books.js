import { api } from "./client";

export const booksApi = {

    getAll() {
        return api.get("/books");
    },

    create(formData) {
        return api.post("/books", formData);
    },

   update(id, formData) {
        return api.put(`/books/${id}`, formData);
    },

    remove(id) {
        return api.delete(`/books/${id}`);
    }

};