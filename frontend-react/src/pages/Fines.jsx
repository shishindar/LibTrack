import { useEffect, useMemo, useState } from "react";
import { finesApi } from "../api/fines";

export default function Fines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFines();
  }, []);

  async function fetchFines() {
    try {
      const res = await finesApi.getAll();

      console.log("Fines:", res);

      setFines(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load fines.");
    } finally {
      setLoading(false);
    }
  }

  async function payFine(id) {

    if (!window.confirm("Mark this fine as paid?"))
      return;

    try {

      await finesApi.payFine(id);

      alert("Fine marked as paid.");

      await fetchFines();

    } catch (err) {

      console.error(err);

      alert(err.message);

    }
  }

  const filteredFines = useMemo(() => {

    const keyword = search.toLowerCase();

    return fines.filter((fine) =>

      fine.member_name?.toLowerCase().includes(keyword) ||

      fine.book_title?.toLowerCase().includes(keyword) ||

      fine.reason?.toLowerCase().includes(keyword)

    );

  }, [fines, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-lg text-gray-600">
            Loading Fines...
          </p>

        </div>

      </div>
    );
  }
  return (
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          💰 Fines Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage library fines and payments
        </p>
      </div>

    </div>

    {/* Statistics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

      {/* Total */}
      <div className="bg-white rounded-xl shadow p-6">

        <h3 className="text-gray-500 font-medium">
          Total Fines
        </h3>

        <p className="text-3xl font-bold text-blue-600 mt-3">
          ₹
          {filteredFines
            .reduce(
              (sum, fine) => sum + Number(fine.amount),
              0
            )
            .toFixed(2)}
        </p>

      </div>

      {/* Unpaid */}
      <div className="bg-white rounded-xl shadow p-6">

        <h3 className="text-gray-500 font-medium">
          Unpaid
        </h3>

        <p className="text-3xl font-bold text-red-600 mt-3">
          {
            filteredFines.filter(
              (fine) => !Number(fine.paid)
            ).length
          }
        </p>

      </div>

      {/* Paid */}
      <div className="bg-white rounded-xl shadow p-6">

        <h3 className="text-gray-500 font-medium">
          Paid
        </h3>

        <p className="text-3xl font-bold text-green-600 mt-3">
          {
            filteredFines.filter(
              (fine) => Number(fine.paid)
            ).length
          }
        </p>

      </div>

    </div>

    {/* Search */}
    <div className="bg-white rounded-xl shadow p-5 mb-6">

      <input
        type="text"
        placeholder="🔍 Search Member, Book or Reason..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

    </div>
        {/* Fines Table */}
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="px-5 py-3 text-left">#</th>

              <th className="px-5 py-3 text-left">Member</th>

              <th className="px-5 py-3 text-left">Book</th>

              <th className="px-5 py-3 text-left">Amount</th>

              <th className="px-5 py-3 text-left">Reason</th>

              <th className="px-5 py-3 text-center">Status</th>

              <th className="px-5 py-3 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredFines.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-10 text-gray-500"
                >
                  💰 No Fines Found
                </td>

              </tr>

            ) : (

              filteredFines.map((fine, index) => (

                <tr
                  key={fine.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="px-5 py-4">
                    {index + 1}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    {fine.member_name}
                  </td>

                  <td className="px-5 py-4">
                    {fine.book_title}
                  </td>

                  <td className="px-5 py-4 font-semibold text-red-600">
                    ₹{Number(fine.amount).toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    {fine.reason}
                  </td>

                  <td className="px-5 py-4 text-center">

                    {Number(fine.paid) ? (

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Paid
                      </span>

                    ) : (

                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        Unpaid
                      </span>

                    )}

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-center">

                      {!Number(fine.paid) && (

                        <button
                          onClick={() => payFine(fine.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Mark Paid
                        </button>

                      )}

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