import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ClipboardList, LogOut, User, Plus, Users, Briefcase, Wrench } from "lucide-react";
import LogoIcon from "../assets/Logo_IconLight.svg";
import { useAuth } from "../hooks/useAuth";
import { ProfileModal } from "./ProfileModal";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();
  const role = user?.role || "CLIENT";

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
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

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "U";

  const avatarUrl = user?.imageUrl
    ? `http://localhost:3333/files/${user.imageUrl}`
    : null;

  return (
    <>
      {/* Backdrop para fechar o menu no mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed left-0 top-0 z-50 w-64 min-h-screen bg-gray-100 flex flex-col justify-between border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center gap-3 px-4 py-6 mb-4">
            <img src={LogoIcon} alt="HelpDesk Logo" className="w-11 h-11" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-600 tracking-tight">HelpDesk</span>
              <span className="text-[10px] font-bold text-brand-light tracking-wider">
                {role === "CLIENT" ? "cliente" : role.toLowerCase()}
              </span>
            </div>
          </div>

          <nav className="flex flex-col gap-2 px-4">
            <NavLink
              to="/"
              onClick={onClose}
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
                onClick={onClose}
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
                  onClick={onClose}
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
                  onClick={onClose}
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
                  onClick={onClose}
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
            <div className="w-8 h-8 rounded-full bg-brand-base flex items-center justify-center text-gray-600 font-bold uppercase shrink-0 relative overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || "Avatar"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-[14px] tracking-[1.4px]">{initials}</span>
              )}
            </div>
            <div className="flex flex-col overflow-hidden items-start">
              <span className="text-sm font-normal text-gray-600 truncate leading-[1.4] w-full text-left">
                {user?.name || "Usuário Cliente"}
              </span>
              <span className="text-xs font-normal text-gray-400 truncate leading-[1.4] w-full text-left">
                {user?.email || "user.client@test.com"}
              </span>
            </div>
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute left-[calc(100%+8px)] bottom-0 z-50 w-49.5 bg-gray-100 rounded-xl shadow-lg p-4 md:left-[calc(100%+8px)] sm:left-4 sm:bottom-[calc(100%+8px)]"
            >
              <span className="block px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.6px] leading-[1.4]">
                opções
              </span>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onClose();
                  setProfileModalOpen(true);
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
          )}
        </div>

        <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      </aside>
    </>
  );
}