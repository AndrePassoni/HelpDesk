import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Menu } from "lucide-react";
import LogoIcon from "../assets/Logo_IconLight.svg";
import { useAuth } from "../hooks/useAuth";

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const role = user?.role || "CLIENT";
  
  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "U";

  const avatarUrl = user?.imageUrl
    ? `http://localhost:3333/files/${user.imageUrl}`
    : null;

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 h-screen overflow-hidden">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-gray-100 px-4 py-3 shrink-0">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 hover:text-gray-600 transition-colors bg-gray-200 rounded-lg">
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-2">
          <img src={LogoIcon} alt="HelpDesk Logo" className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="text-base font-bold text-gray-600 tracking-tight leading-none mt-0.5">HelpDesk</span>
            <span className="text-[9px] font-bold text-brand-light tracking-wider leading-none mt-1">
              {role === "CLIENT" ? "cliente" : role.toLowerCase()}
            </span>
          </div>
        </div>

        <div className="w-9 h-9 rounded-full bg-brand-base flex items-center justify-center text-gray-600 font-bold uppercase shrink-0 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={user?.name || "Avatar"} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-xs tracking-[1px]">{initials}</span>
          )}
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main area */}
      <main className="flex-1 md:ml-64 pt-3 flex flex-col min-h-0 relative z-10">
        {/* Rounded panel */}
        <div className="flex-1 min-h-0 bg-gray-600 rounded-tl-[15px] rounded-tr-[15px] md:rounded-tr-none md:rounded-tl-[20px] overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar p-4 md:px-12 md:py-12">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}