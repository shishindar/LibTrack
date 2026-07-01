import { useEffect, useMemo, useState } from "react";
import { membersApi } from "../api/members";
import MemberForm from "../components/MemberForm";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
  try {
    const res = await membersApi.getAll();

    console.log("Members Response:", res);

    setMembers(res.data || []);
  } catch (err) {
    console.error(err);
    alert("Failed to load members.");
  } finally {
    setLoading(false);
  }
}

  async function saveMember(member) {
    try {
      if (isEditing) {
        await membersApi.update(editingMember.id, member);

        alert("Member Updated Successfully!");
      } else {
        await membersApi.create(member);

        alert("Member Added Successfully!");
      }

      setShowForm(false);
      setEditingMember(null);
      setIsEditing(false);

      await fetchMembers();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
        "Something went wrong."
      );
    }
  }

  function editMember(member) {
    setEditingMember(member);
    setIsEditing(true);
    setShowForm(true);
  }

  async function deleteMember(id) {
    if (!window.confirm("Delete this member?")) return;

    try {
      await membersApi.remove(id);

      alert("Member Deleted Successfully!");

      fetchMembers();
    } catch (err) {
      console.error(err);

      alert(
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

      <input
        type="text"
        placeholder="🔍 Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />

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

              filteredMembers.map((member, index) => (

                <tr
                  key={member.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="px-5 py-4">
                    {index + 1}
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

  </div>
);
}