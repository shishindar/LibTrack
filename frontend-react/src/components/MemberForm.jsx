import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function MemberForm({
  member: editingMember,
  isEditing,
  onSubmit,
  onCancel,
}) {
  const emptyMember = {
    full_name: "",
    email: "",
    phone: "",
    address: "",
    membership_no: "",
    is_active: 1,
  };

  const validationSchema = Yup.object({

  full_name: Yup.string()
    .required("Full Name is required")
    .min(3, "Full Name must be at least 3 characters"),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must contain exactly 10 digits"),

  address: Yup.string()
    .required("Address is required"),

  membership_no: Yup.string()
    .required("Membership Number is required"),

  is_active: Yup.number().required()

});


const formik = useFormik({

  initialValues: emptyMember,

  validationSchema,

  onSubmit: async (values, { resetForm }) => {

    await onSubmit(values);

    if (!isEditing) {
      resetForm();
    }

  }

});

  useEffect(() => {

  if (editingMember) {

    formik.setValues({

      full_name: editingMember.full_name || "",

      email: editingMember.email || "",

      phone: editingMember.phone || "",

      address: editingMember.address || "",

      membership_no: editingMember.membership_no || "",

      is_active: editingMember.is_active ?? 1

    });

  } else {

    formik.resetForm();

  }

}, [editingMember]);


  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? "✏️ Edit Member" : "👤 Add Member"}
        </h2>

        <p className="text-gray-500 mt-1">
          Enter member information
        </p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Full Name
          </label>

          <input
  type="text"
  name="full_name"
  value={formik.values.full_name}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  placeholder="John Doe"
/>

{formik.touched.full_name && formik.errors.full_name && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.full_name}
  </p>
)}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Email
          </label>

          <input
  type="email"
  name="email"
  value={formik.values.email}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  placeholder="john@email.com"
/>

{formik.touched.email && formik.errors.email && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.email}
  </p>
)}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Phone
          </label>

          <input
  type="text"
  name="phone"
  value={formik.values.phone}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  placeholder="9876543210"
/>

{formik.touched.phone && formik.errors.phone && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.phone}
  </p>
)}
        </div>

        {/* Membership Number */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Membership No
          </label>

          <input
  type="text"
  name="membership_no"
  value={formik.values.membership_no}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  placeholder="MEM001"
/>

{formik.touched.membership_no && formik.errors.membership_no && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.membership_no}
  </p>
)}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Address
          </label>

          <textarea
  rows="4"
  name="address"
  value={formik.values.address}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  placeholder="Enter address"
/>

{formik.touched.address && formik.errors.address && (
  <p className="text-red-500 text-sm mt-1">
    {formik.errors.address}
  </p>
)}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Status
          </label>

          <select
  name="is_active"
  value={formik.values.is_active}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
>
  <option value={1}>Active</option>
  <option value={0}>Inactive</option>
</select>
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
  disabled={formik.isSubmitting}
  className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
    formik.isSubmitting
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {formik.isSubmitting
    ? "Saving..."
    : isEditing
    ? "Update Member"
    : "Save Member"}
</button>

      </div>
    </form>
  );
}