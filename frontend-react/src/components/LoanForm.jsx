import { useEffect, useState } from "react";
import { booksApi } from "../api/books";
import { membersApi } from "../api/members";

export default function LoanForm({
  onSubmit,
  onCancel,
}) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const [loan, setLoan] = useState({
    book_id: "",
    member_id: "",
    due_date: "",
    notes: "",
  });

  useEffect(() => {
    loadBooks();
    loadMembers();
  }, []);

  async function loadBooks() {
    try {
      const res = await booksApi.getAll();
      setBooks(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load books.");
    }
  }

  async function loadMembers() {
    try {
      const res = await membersApi.getAll();
      setMembers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load members.");
    }
  }

  function handleChange(e) {
    setLoan({
      ...loan,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !loan.book_id ||
      !loan.member_id ||
      !loan.due_date
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onSubmit(loan);
  }
  return (
  <form onSubmit={handleSubmit} className="space-y-6">

    <div className="border-b pb-4">
      <h2 className="text-2xl font-bold">
        📖 Issue Book
      </h2>

      <p className="text-gray-500">
        Select a member and a book.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {/* Member */}
      <div>
        <label className="block mb-2 font-medium">
          Member
        </label>

        <select
          name="member_id"
          value={loan.member_id}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">
            Select Member
          </option>

          {members.map((member) => (
            <option
              key={member.id}
              value={member.id}
            >
              {member.full_name}
            </option>
          ))}
        </select>
      </div>

      {/* Book */}
      <div>
        <label className="block mb-2 font-medium">
          Book
        </label>

        <select
          name="book_id"
          value={loan.book_id}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">
            Select Book
          </option>

          {books.map((book) => (
            <option
              key={book.id}
              value={book.id}
            >
              {book.title}
            </option>
          ))}
        </select>
      </div>

      {/* Due Date */}
      <div>
        <label className="block mb-2 font-medium">
          Due Date
        </label>

        <input
          type="date"
          name="due_date"
          value={loan.due_date}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* Notes */}
      <div className="md:col-span-2">
        <label className="block mb-2 font-medium">
          Notes
        </label>

        <textarea
          rows="4"
          name="notes"
          value={loan.notes}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

    </div>

    <div className="flex justify-end gap-3 border-t pt-6">

      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-3 rounded-lg bg-gray-200 hover:bg-gray-300"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        Issue Book
      </button>

    </div>

  </form>
);
}