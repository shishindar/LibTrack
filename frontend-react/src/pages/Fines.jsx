import { useEffect, useMemo, useState } from "react";
import { finesApi } from "../api/fines";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Fines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  
  const finesPerPage = 10;

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
      toast.error("Failed to load fines.");
    } finally {
      setLoading(false);
    }
  }

  async function payFine(id) {

  const result = await Swal.fire({
    title: "Mark as Paid?",
    text: "This fine will be marked as paid.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Mark Paid",
  });

  if (!result.isConfirmed) return;

  try {

    await finesApi.payFine(id);

    Swal.fire({
      icon: "success",
      title: "Payment Successful",
      text: "Fine marked as paid.",
      timer: 1800,
      showConfirmButton: false,
    });

    fetchFines();

  } catch (err) {

    console.error(err);

    toast.error(
      err.response?.data?.message ||
      err.message ||
      "Failed to mark fine as paid."
    );

  }

}

function exportFines() {
  const data = filteredFines.map((fine) => ({
    "Fine ID": fine.id,
    Member: fine.member_name,
    Book: fine.book_title,
    Amount: `₹${Number(fine.amount).toFixed(2)}`,
    Reason: fine.reason,
    Status: Number(fine.paid) ? "Paid" : "Unpaid",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Fines"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(
    file,
    `Fines_Report_${new Date().toISOString().split("T")[0]}.xlsx`
  );
}

  const filteredFines = useMemo(() => {

  const keyword = search.toLowerCase();

  return fines.filter((fine) => {

    const matchesSearch =
      fine.member_name?.toLowerCase().includes(keyword) ||
      fine.book_title?.toLowerCase().includes(keyword) ||
      fine.reason?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "paid"
        ? Number(fine.paid)
        : !Number(fine.paid);

    return matchesSearch && matchesStatus;

  });

}, [fines, search, statusFilter]);

const indexOfLastFine = currentPage * finesPerPage;

const indexOfFirstFine =
  indexOfLastFine - finesPerPage;

const currentFines =
  filteredFines.slice(
    indexOfFirstFine,
    indexOfLastFine
  );

const totalPages = Math.ceil(
  filteredFines.length / finesPerPage
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

  <button
    onClick={exportFines}
    className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow transition"
  >
    📥 Download Excel
  </button>

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

    {/* Search & Filter */}
<div className="bg-white rounded-xl shadow p-5 mb-6">

  <div className="flex gap-3 items-center">

    <input
      type="text"
      placeholder="🔍 Search Member, Book or Reason..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      className="flex-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />

    <button
      onClick={handleSearch}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
    >
      Search
    </button>

    <button
      onClick={clearSearch}
      className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-lg transition"
    >
      Clear
    </button>

    <select
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
      }}
      className="border rounded-lg px-4 py-3"
    >
      <option value="all">All</option>
      <option value="paid">Paid</option>
      <option value="unpaid">Unpaid</option>
    </select>

  </div>

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

            {currentFines.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-10 text-gray-500"
                >
                  💰 No Fines Found
                </td>

              </tr>

            ) : (

              currentFines.map((fine, index) => (

                <tr
                  key={fine.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="px-5 py-4">
                    {indexOfFirstFine + index + 1}
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

<div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">

  <p className="text-gray-600">
    Showing {filteredFines.length === 0 ? 0 : indexOfFirstFine + 1}
    {" - "}
    {Math.min(indexOfLastFine, filteredFines.length)}
    {" of "}
    {filteredFines.length} Fines
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