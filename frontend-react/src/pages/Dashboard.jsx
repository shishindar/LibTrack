import { useEffect, useState } from "react";
import { statsApi } from "../api/stats";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
  totalBooks: 0,
  totalMembers: 0,
  booksIssued: 0,
  overdueBooks: 0,
  recentActivity: []
});

useEffect(() => {
  loadStats();
}, []);

async function loadStats() {
  try {
    const res = await statsApi.getDashboard();

    setStats(res.data);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

if (loading) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">

        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-lg text-gray-600">
          Loading Dashboard...
        </p>

      </div>
    </div>
  );
}

const cards = [
  {
    title: "Total Books",
    value: stats.totalBooks,
    color: "bg-blue-500",
    icon: "📚",
  },
  {
    title: "Members",
    value: stats.totalMembers,
    color: "bg-green-500",
    icon: "👥",
  },
  {
    title: "Books Issued",
    value: stats.booksIssued,
    color: "bg-yellow-500",
    icon: "📖",
  },
  {
    title: "Overdue",
    value: stats.overdueBooks,
    color: "bg-red-500",
    icon: "⚠️",
  },
];

const hour = new Date().getHours();

let greeting = "";

if (hour < 12) {
  greeting = "Good Morning";
} else if (hour < 17) {
  greeting = "Good Afternoon";
} else {
  greeting = "Good Evening";
}

  return (
    <div className="space-y-6">

      {/* Header */}
<div className="bg-white rounded-xl shadow-md p-6">
  <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
    {greeting}, {user?.full_name}! 👋
  </h1>

  <p className="text-slate-500 mt-2">
    Welcome! Here's an overview of your library.
  </p>
</div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-slate-500">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`${card.color} text-white text-3xl md:text-4xl w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center`}
              >
                {card.icon}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-2xl font-semibold mb-5">
          Recent Activity
        </h2>
      <div className="overflow-x-auto w-full">
        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left px-4 py-3">Book</th>
              <th className="text-left px-4 py-3">Member</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-center px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
     
  {stats.recentActivity.length === 0 ? (

    <tr>
      <td
        colSpan="4"
        className="text-center py-6 text-gray-500"
      >
        No recent activity
      </td>
    </tr>

  ) : (

    stats.recentActivity.map((activity) => (

      <tr
        key={activity.checked_out_at + activity.book_title}
        className="border-b"
      >

        <td className="py-3 max-w-xs">
          {activity.book_title}
        </td>

        <td className="py-3 whitespace-nowrap">
          {activity.member_name}
          </td>
          
          <td className="py-3 whitespace-nowrap">
            {new Date(activity.checked_out_at).toLocaleDateString()}
            </td>
            
            <td className="py-3 whitespace-nowrap">

        {activity.status === "returned" ? (
         
         <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Returned
          </span>

        ) : activity.status === "active" ? (
          
          new Date(activity.due_date) < new Date() ? (
          
           <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            Overdue
           </span>

        ) : (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Issued
          </span>
        
      )
    ) : (
    
           <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            Unknown
           </span>
    )}

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