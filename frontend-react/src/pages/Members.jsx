import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { membersApi } from "../api/members";
import MemberForm from "../components/MemberForm";
import Swal from "sweetalert2";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

const [search, setSearch] = useState("");
const [searchText, setSearchText] = useState("");

const [currentPage, setCurrentPage] = useState(1);

const membersPerPage = 10;

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
  try {
    const res = await membersApi.getAll();


    setMembers(res.data || []);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load members.");
  } finally {
    setLoading(false);
  }
}

  async function saveMember(member) {
    try {
      if (isEditing) {
        await membersApi.update(editingMember.id, member);

        Swal.fire({
  icon: "success",
  title: "Updated!",
  text: "Member updated successfully.",
  timer: 1800,
  showConfirmButton: false,
});
      } else {
        await membersApi.create(member);

        Swal.fire({
  icon: "success",
  title: "Success!",
  text: "Member added successfully.",
  timer: 1800,
  showConfirmButton: false,
});
      }

      setShowForm(false);
      setEditingMember(null);
      setIsEditing(false);

      await fetchMembers();
    } catch (err) {
      console.error(err);

      Swal.fire({
  icon: "error",
  title: "Error",
  text:
    err.response?.data?.error ||
    "Something went wrong.",
});
    }
  }

  function editMember(member) {
    setEditingMember(member);
    setIsEditing(true);
    setShowForm(true);
  }

  async function deleteMember(id) {

  const result = await Swal.fire({
    title: "Delete Member?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {

    await membersApi.remove(id);

    toast.success("Member deleted successfully");

    fetchMembers();

  } catch (err) {

    console.error(err);

    toast.error(
      err.response?.data?.error ||
      "Delete failed."
    );

  }
}

  const filteredMembers = useMemo(() => {

  const keyword = search.toLowerCase();

  return members.filter((member) =>

    member.full_name?.toLowerCase().includes(keyword) ||

    member.email?.toLowerCase().includes(keyword) ||

    member.phone?.toLowerCase().includes(keyword) ||

    member.membership_no?.toLowerCase().includes(keyword)

  );

}, [members, search]);

const indexOfLastMember = currentPage * membersPerPage;

const indexOfFirstMember =
  indexOfLastMember - membersPerPage;

const currentMembers =
  filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );

const totalPages = Math.ceil(
  filteredMembers.length / membersPerPage
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
  if (loading) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">

        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-lg text-gray-600">
          Loading Members...
        </p>

      </div>
    </div>
  );
}
return (
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          👥 Members Management
        </h1>

        <p className="text-gray-500">
          Manage all library members
        </p>
      </div>

      <button
        onClick={() => {
          setEditingMember(null);
          setIsEditing(false);
          setShowForm(true);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow transition"
      >
        + Add Member
      </button>

    </div>

    {/* Search */}
<div className="bg-white rounded-xl shadow p-5 mb-6">

  <div className="flex flex-col md:flex-row gap-3">

    <div className="relative flex-1">

      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        placeholder="Search by Name, Email, Phone or Membership No..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className="w-full border rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />

    </div>

    <button
      onClick={handleSearch}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
    >
      <FaSearch />
      Search
    </button>

    <button
      onClick={clearSearch}
      className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
    >
      <FaTimes />
      Clear
    </button>

  </div>

</div>

    {/* Modal */}
    {showForm && (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">

          <MemberForm
            member={editingMember}
            isEditing={isEditing}
            onSubmit={saveMember}
            onCancel={() => {
              setShowForm(false);
              setEditingMember(null);
              setIsEditing(false);
            }}
          />

        </div>

      </div>
    )}

    {/* Table */}
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="px-5 py-3 text-left">#</th>
              <th className="px-5 py-3 text-left">Member</th>
              <th className="px-5 py-3 text-left">Membership No</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Phone</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredMembers.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-10 text-gray-500"
                >
                  👥 No Members Found
                </td>

              </tr>

            ) : (

              currentMembers.map((member, index) => (

                <tr
                  key={member.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="px-5 py-4">
                    {indexOfFirstMember + index + 1}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {member.full_name}
                  </td>

                  <td className="px-5 py-4">
                    {member.membership_no}
                  </td>

                  <td className="px-5 py-4">
                    {member.email}
                  </td>

                  <td className="px-5 py-4">
                    {member.phone}
                  </td>

                  <td className="px-5 py-4 text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        Number(member.is_active)
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {Number(member.is_active)
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => editMember(member)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMember(member.id)}
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
    Showing {filteredMembers.length === 0 ? 0 : indexOfFirstMember + 1}
    {" - "}
    {Math.min(indexOfLastMember, filteredMembers.length)}
    {" of "}
    {filteredMembers.length} Members
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