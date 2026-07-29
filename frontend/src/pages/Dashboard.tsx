import { useAuth } from "../hooks/useAuth";
import { LogOut } from "lucide-react";

export function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-rocket-900 text-gray-100 p-8">
      <header className="flex justify-between items-center bg-[#202024] p-4 rounded-lg shadow-md border border-gray-800">
        <div>
          <h1 className="text-xl font-bold">HelpDesk Dashboard</h1>
          <p className="text-sm text-gray-400">Bem-vindo(a), {user?.name}!</p>
        </div>
        <button 
          onClick={signOut}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 rounded font-bold text-white"
        >
          <LogOut size={18} /> Sair
        </button>
      </header>
      
      <main className="mt-8">
        <div className="bg-[#202024] p-8 rounded-lg border border-gray-800 flex items-center justify-center min-h-[300px]">
          <p className="text-gray-400">Em breve: Listagem de Chamados...</p>
        </div>
      </main>
    </div>
  );
}
