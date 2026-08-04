import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Scrollable Main Content */}
      <main className="flex-1 ml-72 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
}