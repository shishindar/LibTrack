import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { booksApi } from "../api/books";
import BookForm from "../components/BookForm";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    setLoading(true);

    try {
      const res = await booksApi.getAll();
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load books.");
    } finally {
      setLoading(false);
    }
  }

  async function saveBook(book) {
  try {
    if (isEditing) {
      await booksApi.update(editingBook.id, book);

      await Swal.fire({
        icon: "success",
        title: "Book Updated",
        text: "Book updated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

    } else {
      await booksApi.create(book);

      await Swal.fire({
        icon: "success",
        title: "Book Added",
        text: "Book added successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    }

    setShowForm(false);
    setEditingBook(null);
    setIsEditing(false);

    fetchBooks();

  } catch (err) {
    console.error(err);

    toast.error(
      err.response?.data?.error ||
      "Something went wrong."
    );
  }
}

  function editBook(book) {
    setEditingBook(book);
    setIsEditing(true);
    setShowForm(true);
  }

  async function deleteBook(id) {

  const result = await Swal.fire({
    title: "Delete Book?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {

    await booksApi.remove(id);

    await Swal.fire({
      icon: "success",
      title: "Deleted",
      text: "Book deleted successfully.",
      timer: 1800,
      showConfirmButton: false,
    });

    fetchBooks();

  } catch (err) {

    console.error(err);

    toast.error(
      err.response?.data?.error ||
      "Delete failed."
    );
  }
}

  const filteredBooks = useMemo(() => {
    const keyword = search.toLowerCase();

    return books.filter((book) => {
      return (
        book.title?.toLowerCase().includes(keyword) ||
        book.author?.toLowerCase().includes(keyword) ||
        book.genre?.toLowerCase().includes(keyword) ||
        book.isbn?.toLowerCase().includes(keyword)
      );
    });
  }, [books, search]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;

  const currentBooks = filteredBooks.slice(
    indexOfFirstBook,
    indexOfLastBook
  );

  const totalPages = Math.ceil(
    filteredBooks.length / booksPerPage
  );

  function handleSearch() {
    setSearch(searchText);
    setCurrentPage(1);
  }

  function clearSearch() {
    setSearch("");
    setSearchText("");
    setCurrentPage(1);
  }
  return (
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Books Management
        </h1>

        <p className="text-gray-500">
          Manage all library books from one place
        </p>
      </div>

      <button
        onClick={() => {
          setEditingBook(null);
          setIsEditing(false);
          setShowForm(true);
        }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
      >
        <FaPlus />

        Add Book
      </button>

    </div>

    {/* Search Card */}

    <div className="bg-white rounded-xl shadow-md p-5 mb-6">

      <div className="flex flex-col md:flex-row gap-3">

        <input
          type="text"
          placeholder="Search by Title, ISBN, Author or Genre..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="flex-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          <FaSearch />

          Search
        </button>

        <button
          onClick={clearSearch}
          className="flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-lg"
        >
          <FaTimes />

          Clear
        </button>

      </div>

    </div>

    {/* Modal */}

    {showForm && (

      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 p-6 max-h-[90vh] overflow-y-auto">

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

    <table className="min-w-full">

      <thead className="bg-blue-600 text-white">

        <tr>

          <th className="px-5 py-4 text-center">
            Cover
            </th>

          <th className="px-5 py-4 text-left">#</th>

          <th className="px-5 py-4 text-left">Title</th>

          <th className="px-5 py-4 text-left">Author</th>

          <th className="px-5 py-4 text-left">Genre</th>

          <th className="px-5 py-4 text-center">
            Total
          </th>

          <th className="px-5 py-4 text-center">
            Available
          </th>

          <th className="px-5 py-4 text-center">
            Status
          </th>

          <th className="px-5 py-4 text-center">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {currentBooks.length === 0 ? (

          <tr>

            <td
              colSpan="9"
              className="text-center py-12 text-gray-500"
            >
              📚 No Books Found
            </td>

          </tr>

        ) : (

          currentBooks.map((book, index) => (

            <tr
              key={book.id}
              className="border-b hover:bg-gray-50 transition"
            >

              <td className="px-5 py-4">

                {indexOfFirstBook + index + 1}

              </td>

              <td className="px-5 py-4 text-center">
  {book.cover_url ? (
    <img
      src={`http://localhost:5000${book.cover_url}`}
      alt={book.title}
      className="w-14 h-20 object-cover rounded shadow mx-auto"
    />
  ) : (
    <div className="w-14 h-20 bg-gray-200 rounded flex items-center justify-center mx-auto text-gray-400 text-xs">
      No Image
    </div>
  )}
</td>

              <td className="px-5 py-4 font-semibold">

                {book.title}

              </td>

              <td className="px-5 py-4">

                {book.author}

              </td>

              <td className="px-5 py-4">

                {book.genre || "-"}

              </td>

              <td className="px-5 py-4 text-center">

                {book.total_copies}

              </td>

              <td className="px-5 py-4 text-center">

                {book.available_copies}

              </td>

              <td className="px-5 py-4 text-center">

                {book.available_copies > 0 ? (

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                    Available

                  </span>

                ) : (

                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

                    Out of Stock

                  </span>

                )}

              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => editBook(book)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteBook(book.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
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
<div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">

  <p className="text-gray-600">
    Showing {filteredBooks.length === 0 ? 0 : indexOfFirstBook + 1}
    {" - "}
    {Math.min(indexOfLastBook, filteredBooks.length)}
    {" of "}
    {filteredBooks.length} Books
  </p>

  <div className="flex items-center gap-2 flex-wrap justify-center">

    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
    >
      Previous
    </button>

    {Array.from({ length: totalPages }, (_, i) => {
      const page = i + 1;

      if (
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 2 && page <= currentPage + 2)
      ) {
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-10 h-10 rounded-lg transition ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        );
      }

      if (
        page === currentPage - 3 ||
        page === currentPage + 3
      ) {
        return (
          <span
            key={page}
            className="px-2 text-gray-500"
          >
            ...
          </span>
        );
      }

      return null;
    })}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
    >
      Next
    </button>

  </div>

</div>

</div>
);
}