import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ClipboardList, LogOut, User, Plus, Users, Briefcase, Wrench } from "lucide-react";
import LogoIcon from "../assets/Logo_IconLight.svg";
import { useAuth } from "../hooks/useAuth";

export function Sidebar() {
  const { user, signOut } = useAuth();
  const role = user?.role || "CLIENT";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <aside className="w-64 bg-gray-100 min-h-screen flex flex-col justify-between border-r border-gray-200">
      <div>
        <div className="flex items-center gap-3 p-8 mb-4">
          <img src={LogoIcon} alt="HelpDesk Logo" className="w-8 h-8" />
          <span className="text-2xl font-bold text-gray-600">HelpDesk</span>
        </div>

        <nav className="flex flex-col gap-2 px-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${
                isActive ? "bg-brand-dark text-gray-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            <ClipboardList size={20} />
            <span className="text-sm">{role === "ADMIN" ? "Chamados" : "Meus chamados"}</span>
          </NavLink>

          {role === "CLIENT" && (
            <NavLink
              to="/new-ticket"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${
                  isActive ? "bg-brand-dark text-gray-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                }`
              }
            >
              <Plus size={20} />
              <span className="text-sm">Criar chamado</span>
            </NavLink>
          )}

          {role === "ADMIN" && (
            <>
              <NavLink
                to="/technicians"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${
                    isActive ? "bg-brand-dark text-gray-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                  }`
                }
              >
                <Users size={20} />
                <span className="text-sm">Técnicos</span>
              </NavLink>

              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${
                    isActive ? "bg-brand-dark text-gray-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                  }`
                }
              >
                <Briefcase size={20} />
                <span className="text-sm">Clientes</span>
              </NavLink>

              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${
                    isActive ? "bg-brand-dark text-gray-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                  }`
                }
              >
                <Wrench size={20} />
                <span className="text-sm">Serviços</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 relative">
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="flex items-center gap-3 px-2 py-2 w-full rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-brand-base flex items-center justify-center text-gray-600 font-bold uppercase shrink-0">
            {user?.name ? user.name.charAt(0) : "U"}
          </div>
          <div className="flex flex-col overflow-hidden items-start">
            <span className="text-sm font-bold text-gray-600 truncate">{user?.name || "Usuário Mock"}</span>
            <span className="text-[10px] text-gray-400 truncate uppercase">{role}</span>
          </div>
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute left-[calc(100%+8px)] bottom-2 z-50 w-48 bg-gray-100 rounded-xl shadow-lg p-3"
          >
            <span className="block px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">opções</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-normal text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <User size={20} />
              Perfil
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-normal text-feedback-danger hover:bg-gray-200 transition-colors"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}