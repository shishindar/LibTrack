import { useState, useEffect } from "react";

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

  const [member, setMember] = useState(emptyMember);

  useEffect(() => {
    if (editingMember) {
      setMember({
        full_name: editingMember.full_name || "",
        email: editingMember.email || "",
        phone: editingMember.phone || "",
        address: editingMember.address || "",
        membership_no: editingMember.membership_no || "",
        is_active: editingMember.is_active ?? 1,
      });
    } else {
      setMember(emptyMember);
    }
  }, [editingMember]);

  function handleChange(e) {
    const { name, value } = e.target;

    setMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!member.full_name || !member.email) {
      alert("Full Name and Email are required.");
      return;
    }

    onSubmit(member);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            value={member.full_name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={member.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="john@email.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Phone
          </label>

          <input
            type="text"
            name="phone"
            value={member.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="9876543210"
          />
        </div>

        {/* Membership Number */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Membership No
          </label>

          <input
            type="text"
            name="membership_no"
            value={member.membership_no}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="MEM001"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Address
          </label>

          <textarea
            rows="4"
            name="address"
            value={member.address}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter address"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Status
          </label>

          <select
            name="is_active"
            value={member.is_active}
            onChange={handleChange}
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
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          {isEditing ? "Update Member" : "Save Member"}
        </button>

      </div>
    </form>
  );
}