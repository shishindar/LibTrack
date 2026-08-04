import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";



export default function BookForm({
  book: editingBook,
  isEditing,
  onSubmit,
  onCancel,
}) {
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const emptyBook = {
    isbn: "",
    title: "",
    author: "",
    genre: "",
    publisher: "",
    published_year: "",
    total_copies: 1,
    available_copies: 1,
    cover_url: "",
    cover: null,
    description: "",
  };

  const validationSchema = Yup.object({

  isbn: Yup.string()
    .required("ISBN is required")
    .min(10, "ISBN must be at least 10 characters"),

  title: Yup.string()
    .required("Title is required"),

  author: Yup.string()
    .required("Author is required"),

  genre: Yup.string()
    .required("Genre is required"),

  publisher: Yup.string(),

  published_year: Yup.number()
    .required("Published Year is required")
    .min(1900)
    .max(new Date().getFullYear()),

  total_copies: Yup.number()
    .required("Total Copies is required")
    .min(1, "Minimum 1 Copy is required"),

  available_copies: Yup.number()
    .required("Available Copies is required")
    .min(0, "Available Copies cannot be negative")
    .test(
      "copies",
      "Available Copies cannot exceed Total Copies",
      function (value) {
        return value <= this.parent.total_copies;
      }
    ),

  description: Yup.string()

});

const formik = useFormik({

  initialValues: emptyBook,

  validationSchema,

 onSubmit: async (values, { resetForm }) => {

  const formData = new FormData();

  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });

  if (selectedFile) {
    formData.append("cover", selectedFile);
  }

  await onSubmit(formData);

  if (!isEditing) {
    resetForm();
    setSelectedFile(null);
    setPreview("");
  }
}

});


  useEffect(() => {

  if (editingBook) {

    formik.setValues({

      isbn: editingBook.isbn || "",

      title: editingBook.title || "",

      author: editingBook.author || "",

      genre: editingBook.genre || "",

      publisher: editingBook.publisher || "",

      published_year: editingBook.published_year || "",

      total_copies: editingBook.total_copies || 1,

      available_copies:
        editingBook.available_copies || 1,

      cover_url: editingBook.cover_url || "",

      description:
        editingBook.description || ""

    });

  }

  else {

    formik.resetForm();

  }

}, [editingBook]);
const isDisabled =
  formik.isSubmitting ||
  (!formik.isValid && formik.submitCount > 0);

  return (
  <form onSubmit={formik.handleSubmit} className="space-y-6">

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
  value={formik.values.isbn}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  placeholder="978..."
/>

{formik.touched.isbn && formik.errors.isbn && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.isbn}
  </p>
)}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Book Title
        </label>

        <input
  type="text"
  name="title"
  value={formik.values.title}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  placeholder="Book Title"
/>

{formik.touched.title && formik.errors.title && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.title}
  </p>
)}
      </div>

      {/* Author */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Author
  </label>

  <input
  type="text"
  name="author"
  value={formik.values.author}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  placeholder="Enter author name"
/>

{formik.touched.author && formik.errors.author && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.author}
  </p>
)}
</div>

      {/* Genre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Genre
        </label>

        <input
  type="text"
  name="genre"
  value={formik.values.genre}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>

{formik.touched.genre && formik.errors.genre && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.genre}
  </p>
)}
      </div>

      {/* Publisher */}
     <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Publisher
  </label>

  <input
    type="text"
    name="publisher"
    value={formik.values.publisher}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    placeholder="Publisher"
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
  value={formik.values.published_year}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>

{formik.touched.published_year && formik.errors.published_year && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.published_year}
  </p>
)}
      </div>

      {/* Total Copies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Copies
        </label>

        <input
  type="number"
  name="total_copies"
  value={formik.values.total_copies}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>

{formik.touched.total_copies && formik.errors.total_copies && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.total_copies}
  </p>
)}
      </div>

      {/* Available Copies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Copies
        </label>

        <input
  type="number"
  name="available_copies"
  value={formik.values.available_copies}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>

{formik.touched.available_copies && formik.errors.available_copies && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.available_copies}
  </p>
)}
      </div>

      {/* Cover URL */}
      {/* Cover Image */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Book Cover
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];

      if (file) {
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
      }
    }}
    className="w-full border rounded-lg px-4 py-3"
  />

  {preview && (
    <img
      src={preview}
      alt="Preview"
      className="mt-4 h-40 rounded-lg border object-cover"
    />
  )}
</div>

      {/* Description */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>

        <textarea
  rows="5"
  name="description"
  value={formik.values.description}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
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
  disabled={isDisabled}
  className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
    isDisabled
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {formik.isSubmitting
    ? "Saving..."
    : isEditing
    ? "Update Book"
    : "Save Book"}
</button>

    </div>

  </form>
);
}