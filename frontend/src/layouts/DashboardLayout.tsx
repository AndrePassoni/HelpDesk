import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function DashboardLayout() {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />

      {/* Main area: fixed height, gap (pt-3) never scrolls */}
      <main className="flex-1 h-screen ml-64 pt-3 flex flex-col">
        {/* Rounded panel: stays fixed in place, clips the scrolling content to its corners */}
        <div className="flex-1 min-h-0 bg-gray-600 rounded-tl-[20px] overflow-hidden">
          {/* Only this inner div actually scrolls */}
          <div className="h-full overflow-y-auto custom-scrollbar px-12 py-12">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}