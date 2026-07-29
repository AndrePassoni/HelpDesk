import { NavLink } from "react-router-dom";
import { ClipboardList, LogOut, Users, Briefcase, Wrench, Plus } from "lucide-react";
import LogoIcon from "../assets/Logo_IconLight.svg";
import { useAuth } from "../hooks/useAuth";

export function Sidebar() {
  const { user, signOut } = useAuth();

  const role = user?.role || "CLIENT"; // Default para CLIENT caso não encontre

  return (
    <aside className="w-64 bg-gray-100 min-h-screen flex flex-col justify-between border-r border-gray-200">
      
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 p-8 mb-4">
          <img src={LogoIcon} alt="HelpDesk Logo" className="w-8 h-8" />
          <span className="text-2xl font-bold text-gray-600">HelpDesk</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-4">
          
          {/* Chamados: Comum a todos, mas o texto muda para o Admin */}
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

          {/* Cliente: Criar chamado */}
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

          {/* Menus exclusivos do Admin */}
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

      {/* User Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-brand-base flex items-center justify-center text-gray-600 font-bold uppercase shrink-0">
            {user?.name ? user.name.charAt(0) : "U"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-gray-600 truncate">{user?.name || "Usuário Mock"}</span>
            <span className="text-[10px] text-gray-400 truncate uppercase">{role}</span>
          </div>
        </div>
        <button 
          onClick={signOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-feedback-danger font-bold hover:bg-gray-200 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
}
