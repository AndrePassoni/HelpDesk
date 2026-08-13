import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Menu, X, ClipboardList, Plus, Users, Briefcase, Wrench, User, LogOut } from "lucide-react";
import LogoIcon from "../assets/Logo_IconLight.svg";
import { useAuth } from "../hooks/useAuth";
import { ProfileModal } from "../components/ProfileModal";

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { user, signOut } = useAuth();
  const role = user?.role || "CLIENT";
  
  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "U";

  const avatarUrl = user?.imageUrl
    ? `http://localhost:3333/files/${user.imageUrl}`
    : null;

  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsMobileUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 h-screen overflow-hidden">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-gray-100 px-4 py-3 shrink-0 relative z-50 shadow-md">
        <div className="flex-1 relative" ref={menuRef}>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="w-10 h-10 text-gray-500 hover:text-gray-600 transition-colors bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden"
          >
            <Menu 
              size={20} 
              className={`absolute transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
              }`} 
            />
            <X 
              size={20} 
              className={`absolute transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
              }`} 
            />
          </button>

          <div 
            className={`absolute left-0 top-[calc(100%+16px)] w-56 bg-gray-100 rounded-xl shadow-2xl p-4 border border-gray-200/20 origin-top-left transition-all duration-200 ease-out ${
              isMobileMenuOpen ? "opacity-100 scale-100 pointer-events-auto translate-y-0" : "opacity-0 scale-95 pointer-events-none -translate-y-2"
            }`}
          >
            <span className="block px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.6px] leading-[1.4]">
              menu
            </span>
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg font-bold transition-colors text-sm ${
                    isActive ? "bg-brand-dark text-gray-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                  }`
                }
              >
                <ClipboardList size={20} />
                <span>{role === "ADMIN" ? "Chamados" : "Meus chamados"}</span>
              </NavLink>

              {role === "CLIENT" && (
                <NavLink
                  to="/new-ticket"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg font-bold transition-colors text-sm ${
                      isActive ? "bg-brand-dark text-gray-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                    }`
                  }
                >
                  <Plus size={20} />
                  <span>Criar chamado</span>
                </NavLink>
              )}

              {role === "ADMIN" && (
                <>
                  <NavLink
                    to="/technicians"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg font-bold transition-colors text-sm ${
                        isActive ? "bg-brand-dark text-gray-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                      }`
                    }
                  >
                    <Users size={20} />
                    <span>Técnicos</span>
                  </NavLink>

                  <NavLink
                    to="/customers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg font-bold transition-colors text-sm ${
                        isActive ? "bg-brand-dark text-gray-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                      }`
                    }
                  >
                    <Briefcase size={20} />
                    <span>Clientes</span>
                  </NavLink>

                  <NavLink
                    to="/services"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg font-bold transition-colors text-sm ${
                        isActive ? "bg-brand-dark text-gray-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                      }`
                    }
                  >
                    <Wrench size={20} />
                    <span>Serviços</span>
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-3 absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <img src={LogoIcon} alt="HelpDesk Logo" className="w-11 h-11" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-600 tracking-tight leading-none mt-0.5">HelpDesk</span>
            <span className="text-[10px] font-bold text-brand-light tracking-wider leading-none mt-1">
              {role === "CLIENT" ? "cliente" : role.toLowerCase()}
            </span>
          </div>
        </div>

        <div className="flex-1 flex justify-end relative" ref={userMenuRef}>
          <button 
            onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
            className="w-10 h-10 rounded-full bg-brand-base flex items-center justify-center text-gray-600 font-bold uppercase shrink-0 overflow-hidden cursor-pointer outline-none border-none hover:opacity-90 transition-opacity relative z-10"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={user?.name || "Avatar"} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-sm tracking-[1px]">{initials}</span>
            )}
          </button>

          <div 
            className={`absolute right-0 top-[calc(100%+16px)] w-49.5 bg-gray-100 rounded-xl shadow-2xl p-4 border border-gray-200/20 origin-top-right transition-all duration-200 ease-out ${
              isMobileUserMenuOpen ? "opacity-100 scale-100 pointer-events-auto translate-y-0" : "opacity-0 scale-95 pointer-events-none -translate-y-2"
            }`}
          >
            <span className="block px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.6px] leading-[1.4]">
              opções
            </span>
            <button
              onClick={() => {
                setIsMobileUserMenuOpen(false);
                setIsProfileModalOpen(true);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-[5px] text-base font-normal text-gray-500 hover:bg-gray-200 transition-colors leading-[1.4]"
            >
              <User size={20} />
              Perfil
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-[5px] text-base font-normal text-feedback-danger hover:bg-gray-200 transition-colors leading-[1.4]"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </div>

      <Sidebar isOpen={false} onClose={() => {}} />

      {/* Main area */}
      <main className="flex-1 md:ml-64 pt-3 flex flex-col min-h-0 relative z-10">
        <div className="flex-1 min-h-0 bg-gray-600 rounded-tl-[15px] rounded-tr-[15px] md:rounded-tr-none md:rounded-tl-[20px] overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar px-6 pt-7 pb-6 md:px-12 md:py-12">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Profile Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}