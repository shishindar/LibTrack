import { api } from "./client";

export const booksApi = {

    getAll() {
        return api.get("/books");
    },

    create(book) {
        return api.post("/books", book);
    },

    update(id, book) {
        return api.put(`/books/${id}`, book);
    },

    remove(id) {
        return api.delete(`/books/${id}`);
    }

};