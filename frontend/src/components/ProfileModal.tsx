import { X, Image as ImageIcon, Trash2, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();

  if (!isOpen) return null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[440px] bg-gray-600 rounded-[10px] border border-gray-500 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5">
          <span className="text-base font-normal text-gray-200">Perfil</span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-5 px-7 pt-7 pb-8 border-t border-b border-gray-500">
          {/* Avatar & Actions */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-base flex items-center justify-center text-gray-600 font-bold text-lg uppercase shrink-0">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-7 px-2.5 bg-gray-500 rounded-[5px] flex items-center gap-2 text-xs font-bold text-feedback-done hover:bg-gray-400 transition-colors cursor-pointer"
              >
                <ImageIcon size={14} className="text-gray-200" />
                Nova imagem
              </button>

              <button
                type="button"
                className="w-7 h-7 bg-gray-500 rounded-[5px] flex items-center justify-center text-feedback-danger hover:bg-gray-400 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4">
            {/* Nome */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-1">
                Nome
              </label>
              <div className="h-10 border-b border-gray-500 flex items-center">
                <input
                  type="text"
                  readOnly
                  value={user?.name || "Usuário Cliente"}
                  className="w-full bg-transparent text-base font-bold text-gray-100 focus:outline-none"
                />
              </div>
            </div>

            {/* E-mail */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-1">
                E-mail
              </label>
              <div className="h-10 border-b border-gray-500 flex items-center">
                <input
                  type="email"
                  readOnly
                  value={user?.email || "user.client@test.com"}
                  className="w-full bg-transparent text-base font-bold text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="flex flex-col relative">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-1">
                Senha
              </label>
              <div className="h-10 border-b border-gray-500 flex items-center justify-between pr-20">
                <input
                  type="password"
                  readOnly
                  value="••••••••"
                  className="w-full bg-transparent text-base font-bold text-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="absolute right-0 bottom-1.5 h-7 px-2.5 bg-gray-500 rounded-[5px] flex items-center gap-1.5 text-xs font-bold text-feedback-done hover:bg-gray-400 transition-colors cursor-pointer"
              >
                <Lock size={12} className="text-gray-200" />
                Alterar
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-6 flex items-center justify-center">
          <button
            type="button"
            className="w-full h-10 bg-gray-200 text-gray-600 font-bold text-sm rounded-[5px] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}