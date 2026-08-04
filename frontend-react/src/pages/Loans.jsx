import { useEffect, useMemo, useState } from "react";
import { loansApi } from "../api/loans";
import LoanForm from "../components/LoanForm";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

const loansPerPage = 10;

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    try {
      const res = await loansApi.getAll();

      console.log("Loans:", res);

      setLoans(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load loans.");
    } finally {
      setLoading(false);
    }
  }

  async function issueBook(loan) {
    try {
      await loansApi.issueBook(loan);

      Swal.fire({
  icon: "success",
  title: "Book Issued",
  text: "Book issued successfully.",
  timer: 1800,
  showConfirmButton: false,
});

      setShowForm(false);
setCurrentPage(1);

await fetchLoans();
    } catch (err) {
      console.error(err);

      toast.error(
  err.response?.data?.message ||
  err.message ||
  "Failed to issue book."
);
    }
  }

  async function returnBook(id) {

    const result = await Swal.fire({
  title: "Return Book?",
  text: "Confirm returning this book.",
  icon: "question",
  showCancelButton: true,
  confirmButtonText: "Return",
  cancelButtonText: "Cancel",
  confirmButtonColor: "#16a34a",
});

if (!result.isConfirmed) return;

    try {

      await loansApi.returnBook(id);

      Swal.fire({
  icon: "success",
  title: "Returned",
  text: "Book returned successfully.",
  timer: 1800,
  showConfirmButton: false,
});

      await fetchLoans();

    } catch (err) {

      console.error(err);

      toast.error(
  err.response?.data?.message ||
  err.message ||
  "Return failed."
);

    }
  }

  function exportLoans() {
  const data = filteredLoans.map((loan) => ({
    Member: loan.member_name,
    Book: loan.book_title,
    "Issue Date": loan.issued_at
      ? new Date(loan.issued_at).toLocaleDateString()
      : "-",
    "Due Date": loan.due_date
      ? new Date(loan.due_date).toLocaleDateString()
      : "-",
    Status:
      loan.status === "returned"
        ? "Returned"
        : new Date(loan.due_date) < new Date()
        ? "Overdue"
        : "Active",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Loans");

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
    `Loans_Report_${new Date().toISOString().split("T")[0]}.xlsx`
  );
}

  const filteredLoans = useMemo(() => {

    const keyword = search.toLowerCase();

    return loans.filter((loan) =>

      loan.book_title?.toLowerCase().includes(keyword) ||

      loan.member_name?.toLowerCase().includes(keyword) ||

      loan.status?.toLowerCase().includes(keyword)

    );

  }, [loans, search]);

  const indexOfLastLoan = currentPage * loansPerPage;

const indexOfFirstLoan = indexOfLastLoan - loansPerPage;

const currentLoans = filteredLoans.slice(
  indexOfFirstLoan,
  indexOfLastLoan
);

const totalPages = Math.ceil(
  filteredLoans.length / loansPerPage
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
          Loading Loans...
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
      📖 Loans Management
    </h1>

    <p className="text-gray-500 mt-1">
      Issue and return library books
    </p>
  </div>

  <div className="flex gap-3">

    <button
      onClick={exportLoans}
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow transition"
    >
      📥 Download Excel
    </button>

    <button
      onClick={() => {
        setShowForm(true);
        clearSearch();
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow transition"
    >
      + Issue Book
    </button>

  </div>

</div>

    {/* Search */}
    <div className="bg-white rounded-xl shadow p-5 mb-6">

  <div className="flex flex-col md:flex-row gap-3">

    <input
      type="text"
      placeholder="🔍 Search by Book, Member or Status..."
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

  </div>

</div>

    {/* Modal */}
    {showForm && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">

          <LoanForm
            onSubmit={issueBook}
            onCancel={() => setShowForm(false)}
          />

        </div>

      </div>
    )}

    {/* Loans Table */}
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="px-5 py-3 text-left">#</th>
              <th className="px-5 py-3 text-left">Member</th>
              <th className="px-5 py-3 text-left">Book</th>
              <th className="px-5 py-3 text-left">Issue Date</th>
              <th className="px-5 py-3 text-center">Days</th>
              <th className="px-5 py-3 text-left">Due Date</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>

          </thead>

          <tbody>

            {currentLoans.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-10 text-gray-500"
                >
                  📖 No Loans Found
                </td>

              </tr>

            ) : (

              currentLoans.map((loan, index) => (

                <tr
                  key={loan.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="px-5 py-4">
                    {indexOfFirstLoan + index + 1}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    {loan.member_name}
                  </td>

                  <td className="px-5 py-4">
                    {loan.book_title}
                  </td>

                  <td className="px-5 py-4">
  {loan.issued_at
    ? new Date(loan.issued_at).toLocaleDateString()
    : "-"}
</td>

<td className="px-5 py-4 text-center">
  {(() => {
    if (loan.status === "returned") {
      return (
        <span className="text-blue-600 font-medium">
          Returned
        </span>
      );
    }

    const today = new Date();
    const due = new Date(loan.due_date);

    const diff = Math.ceil(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) {
      return (
        <span className="text-red-600 font-bold">
          {Math.abs(diff)} day(s) overdue
        </span>
      );
    }

    if (diff === 0) {
      return (
        <span className="text-yellow-600 font-semibold">
          Due Today
        </span>
      );
    }

    return (
      <span className="text-green-600">
        {diff} day(s) left
      </span>
    );
  })()}
</td>

<td className="px-5 py-4">
  {loan.due_date
    ? new Date(loan.due_date).toLocaleDateString()
    : "-"}
</td>

                  <td className="px-5 py-4 text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
  loan.status === "returned"
    ? "bg-blue-100 text-blue-700"
    : new Date(loan.due_date) < new Date()
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700"
}`}
                    >
                      {loan.status === "returned"
  ? "Returned"
  : new Date(loan.due_date) < new Date()
  ? "Overdue"
  : "Active"}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-center">

                      {loan.status !== "returned" && (

                        <button
                          onClick={() => returnBook(loan.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Return
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
    Showing {filteredLoans.length === 0 ? 0 : indexOfFirstLoan + 1}
    {" - "}
    {Math.min(indexOfLastLoan, filteredLoans.length)}
    {" of "}
    {filteredLoans.length} Loans
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