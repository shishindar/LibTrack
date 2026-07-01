import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const menuItem =
    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-blue-600 hover:text-white";

  const activeItem = ({ isActive }) =>
    `${menuItem} ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-slate-300"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-full md:min-h-screen
          w-72
          bg-slate-900 text-white
          flex flex-col shadow-xl
          transform transition-transform duration-300 z-50
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* Logo */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-blue-400">
              📚 Library Tracker
            </h1>

            <p className="text-slate-400 text-sm mt-2">
              Library Management System
            </p>
          </div>

          <button
            className="md:hidden text-2xl"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-2">

          <NavLink to="/dashboard" className={activeItem}>
            🏠 Dashboard
          </NavLink>

          <NavLink to="/books" className={activeItem}>
            📚 Books
          </NavLink>

          <NavLink to="/members" className={activeItem}>
            👥 Members
          </NavLink>

          <NavLink to="/loans" className={activeItem}>
            🔄 Loans
          </NavLink>

          <NavLink to="/fines" className={activeItem}>
            💰 Fines
          </NavLink>

        </nav>

        {/* User */}
        <div className="border-t border-slate-700 p-5">

          <div className="mb-5">
            <p className="font-semibold text-lg">
              {user?.name || "Administrator"}
            </p>

            <p className="text-sm text-slate-400">
              {user?.role || "Admin"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg"
          >
            🚪 Logout
          </button>

        </div>

      </aside>
    </>
  );
}