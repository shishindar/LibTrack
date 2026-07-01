import { useEffect, useMemo, useState } from "react";
import { booksApi } from "../api/books";
import BookForm from "../components/BookForm";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const res = await booksApi.getAll();
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load books.");
    } finally {
      setLoading(false);
    }
  }

  async function saveBook(book) {
    try {
      if (isEditing) {
        await booksApi.update(editingBook.id, book);
        alert("Book Updated Successfully!");
      } else {
        await booksApi.create(book);
        alert("Book Added Successfully!");
      }

      setShowForm(false);
      setEditingBook(null);
      setIsEditing(false);

      fetchBooks();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  function editBook(book) {
    setEditingBook(book);
    setIsEditing(true);
    setShowForm(true);
  }

  async function deleteBook(id) {
    if (!window.confirm("Delete this book?")) return;

    try {
      await booksApi.remove(id);
      alert("Book Deleted Successfully!");
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const keyword = search.toLowerCase();

      return (
        book.title?.toLowerCase().includes(keyword) ||
        book.genre?.toLowerCase().includes(keyword) ||
        book.author_name?.toLowerCase().includes(keyword) ||
        book.isbn?.toLowerCase().includes(keyword)
      );
    });
  }, [books, search]);

  if (loading) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-gray-600 text-lg">
          Loading Books...
        </p>
      </div>
    </div>
  );
}

return (
  <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          📚 Books Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your library books
        </p>
      </div>

      <button
        onClick={() => {
          setEditingBook(null);
          setIsEditing(false);
          setShowForm(true);
        }}
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow font-medium transition"
      >
        + Add Book
      </button>

    </div>

    {/* Search Card */}
    <div className="bg-white rounded-xl shadow p-5 mb-6">

      <input
        type="text"
        placeholder="🔍 Search by Title, ISBN, Author or Genre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-xl border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

    </div>

    {/* Modal */}
    {showForm && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 p-4 md:p-6 max-h-[90vh] overflow-y-auto">

          <BookForm
            book={editingBook}
            isEditing={isEditing}
            onSubmit={saveBook}
            onCancel={() => {
              setShowForm(false);
              setEditingBook(null);
              setIsEditing(false);
            }}
          />

        </div>

      </div>
    )}

    <div className="bg-white rounded-xl shadow overflow-hidden">
  <div className="overflow-x-auto">

    <table className="min-w-[950px]">

      <thead className="bg-blue-600 text-white">

        <tr>

          <th className="px-5 py-3 text-left whitespace-nowrap">#</th>

          <th className="px-5 py-3 text-left whitespace-nowrap">Title</th>

          <th className="px-5 py-3 text-left whitespace-nowrap">Author</th>

          <th className="px-5 py-3 text-left whitespace-nowrap">Genre</th>

          <th className="px-5 py-3 text-center whitespace-nowrap">
            Copies
          </th>

          <th className="px-5 py-3 text-center whitespace-nowrap">
            Status
          </th>

          <th className="px-5 py-3 text-center whitespace-nowrap">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {filteredBooks.length === 0 ? (

          <tr>

            <td
              colSpan="7"
              className="text-center py-10 text-gray-500"
            >
              📚 No Books Found
            </td>

          </tr>

        ) : (

          filteredBooks.map((book, index) => (

            <tr
              key={book.id}
              className="border-b hover:bg-gray-50 transition"
            >

              <td className="px-5 py-4 whitespace-nowrap">
                {index + 1}
              </td>

              <td className="px-5 py-4 font-semibold max-w-xs">
                {book.title}
              </td>

              <td className="px-5 py-4 whitespace-nowrap">
                {book.author_name || book.author_id}
              </td>

              <td className="px-5 py-4 whitespace-nowrap">
                {book.genre}
              </td>

              <td className="px-5 py-4 text-center whitespace-nowrap">
                {book.total_copies}
              </td>

              <td className="px-5 py-4 text-center whitespace-nowrap">

                {book.available_copies > 0 ? (

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Available
                  </span>

                ) : (

                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </span>

                )}

              </td>

              <td className="px-5 py-4 whitespace-nowrap">

                <div className="flex flex-col sm:flex-row justify-center gap-2">

                  <button
                    onClick={() => editBook(book)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteBook(book.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

</div>

  </div>
);
}