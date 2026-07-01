import { useEffect, useMemo, useState } from "react";
import { loansApi } from "../api/loans";
import LoanForm from "../components/LoanForm";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

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
      alert("Failed to load loans.");
    } finally {
      setLoading(false);
    }
  }

  async function issueBook(loan) {
    try {
      await loansApi.issueBook(loan);

      alert("Book Issued Successfully!");

      setShowForm(false);

      await fetchLoans();

    } catch (err) {
      console.error(err);

      alert(err.message);
    }
  }

  async function returnBook(id) {

    if (!window.confirm("Return this book?")) return;

    try {

      await loansApi.returnBook(id);

      alert("Book Returned Successfully!");

      await fetchLoans();

    } catch (err) {

      console.error(err);

      alert(err.message);

    }
  }

  const filteredLoans = useMemo(() => {

    const keyword = search.toLowerCase();

    return loans.filter((loan) =>

      loan.book_title?.toLowerCase().includes(keyword) ||

      loan.member_name?.toLowerCase().includes(keyword) ||

      loan.status?.toLowerCase().includes(keyword)

    );

  }, [loans, search]);
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

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow transition"
      >
        + Issue Book
      </button>

    </div>

    {/* Search */}
    <div className="bg-white rounded-xl shadow p-5 mb-6">

      <input
        type="text"
        placeholder="🔍 Search by Book, Member or Status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

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
              <th className="px-5 py-3 text-left">Due Date</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredLoans.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-10 text-gray-500"
                >
                  📖 No Loans Found
                </td>

              </tr>

            ) : (

              filteredLoans.map((loan, index) => (

                <tr
                  key={loan.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="px-5 py-4">
                    {index + 1}
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
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {loan.status || "active"}
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

  </div>
);
}