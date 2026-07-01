import { useState, useEffect } from "react";
import { authorsApi } from "../api/authors";

export default function BookForm({
  book: editingBook,
  isEditing,
  onSubmit,
  onCancel,
}) {
  const [authors, setAuthors] = useState([]);

  const emptyBook = {
    isbn: "",
    title: "",
    author_id: "",
    genre: "",
    publisher: "",
    published_year: "",
    total_copies: 1,
    available_copies: 1,
    cover_url: "",
    description: "",
  };

  const [book, setBook] = useState(emptyBook);

  useEffect(() => {
    loadAuthors();
  }, []);

  useEffect(() => {
    if (editingBook) {
      setBook({
        isbn: editingBook.isbn || "",
        title: editingBook.title || "",
        author_id: editingBook.author_id || "",
        genre: editingBook.genre || "",
        publisher: editingBook.publisher || "",
        published_year: editingBook.published_year || "",
        total_copies: editingBook.total_copies || 1,
        available_copies:
          editingBook.available_copies || 1,
        cover_url: editingBook.cover_url || "",
        description: editingBook.description || "",
      });
    } else {
      setBook(emptyBook);
    }
  }, [editingBook]);

  async function loadAuthors() {
    try {
      const res = await authorsApi.getAll();
      setAuthors(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load authors.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
  e.preventDefault();

  if (
    !book.isbn ||
    !book.title ||
    !book.author_id
  ) {
    alert("ISBN, Title and Author are required.");
    return;
  }

  if (!book.published_year) {
    alert("Published Year is required.");
    return;
  }

  if (Number(book.available_copies) > Number(book.total_copies)) {
    alert("Available Copies cannot be greater than Total Copies.");
    return;
  }

  onSubmit(book);
}
  return (
  <form onSubmit={handleSubmit} className="space-y-6">

    {/* Header */}
    <div className="border-b pb-4">
      <h2 className="text-2xl font-bold text-gray-800">
        {isEditing ? "✏️ Edit Book" : "📚 Add New Book"}
      </h2>

      <p className="text-gray-500 mt-1">
        Fill in the details below.
      </p>
    </div>

    {/* Form */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {/* ISBN */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ISBN
        </label>

        <input
          type="text"
          name="isbn"
          value={book.isbn}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="978..."
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Book Title
        </label>

        <input
          type="text"
          name="title"
          value={book.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Book Title"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author
        </label>

        <select
          name="author_id"
          value={book.author_id}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Author</option>

          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>

      {/* Genre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Genre
        </label>

        <input
          type="text"
          name="genre"
          value={book.genre}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Publisher */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Publisher
        </label>

        <input
          type="text"
          name="publisher"
          value={book.publisher}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Published Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Published Year
        </label>

        <input
          type="number"
          name="published_year"
          value={book.published_year}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Total Copies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Copies
        </label>

        <input
          type="number"
          name="total_copies"
          value={book.total_copies}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Available Copies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Copies
        </label>

        <input
          type="number"
          name="available_copies"
          value={book.available_copies}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Cover URL */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Image URL
        </label>

        <input
          type="text"
          name="cover_url"
          value={book.cover_url}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="https://..."
        />
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>

        <textarea
          rows="5"
          name="description"
          value={book.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Book description..."
        />
      </div>

    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-3 border-t pt-6">

      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
      >
        {isEditing ? "Update Book" : "Save Book"}
      </button>

    </div>

  </form>
);
}