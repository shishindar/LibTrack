import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

import { booksApi } from "../api/books";
import { membersApi } from "../api/members";

export default function LoanForm({
  onSubmit,
  onCancel,
}) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const validationSchema = Yup.object({

  member_id: Yup.string()
    .required("Please select a member"),

  book_id: Yup.string()
    .required("Please select a book"),

  due_date: Yup.date()
    .required("Due Date is required")
    .min(
      new Date().toISOString().split("T")[0],
      "Due Date cannot be in the past"
    ),

  notes: Yup.string()

});
const formik = useFormik({

  initialValues: {
    member_id: "",
    book_id: "",
    due_date: "",
    notes: "",
  },

  validationSchema,

  onSubmit: async (values, { resetForm }) => {

    await onSubmit(values);

    resetForm();

  }

});

  useEffect(() => {
    loadBooks();
    loadMembers();
  }, []);

  const isDisabled =
  formik.isSubmitting ||
  (!formik.isValid && formik.submitCount > 0);

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

  return (
  <form onSubmit={formik.handleSubmit} className="space-y-6">

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
  value={formik.values.member_id}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
         {formik.touched.member_id && formik.errors.member_id && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.member_id}
  </p>
)}
      </div>

      {/* Book */}
      <div>
        <label className="block mb-2 font-medium">
          Book
        </label>

        <select
  name="book_id"
  value={formik.values.book_id}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
        {formik.touched.book_id && formik.errors.book_id && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.book_id}
  </p>
)}
      </div>

      {/* Due Date */}
      <div>
        <label className="block mb-2 font-medium">
          Due Date
        </label>

        <input
  type="date"
  name="due_date"
  value={formik.values.due_date}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>
{formik.touched.due_date && formik.errors.due_date && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.due_date}
  </p>
)}
      </div>

      {/* Notes */}
      <div className="md:col-span-2">
        <label className="block mb-2 font-medium">
          Notes
        </label>

        <textarea
  rows="4"
  name="notes"
  value={formik.values.notes}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
  disabled={isDisabled}
  className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
    isDisabled
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {formik.isSubmitting ? "Issuing..." : "Issue Book"}
</button>


    </div>

  </form>
);
} 