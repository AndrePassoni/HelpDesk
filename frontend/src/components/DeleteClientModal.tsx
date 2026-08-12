import { X, Loader2 } from "lucide-react";

interface DeleteClientModalProps {
  isOpen: boolean;
  clientName: string;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteClientModal({ isOpen, clientName, deleting, onClose, onConfirm }: DeleteClientModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-115 bg-gray-600 rounded-[10px] border border-gray-500 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5">
          <span className="text-base font-normal text-gray-200">Excluir cliente</span>
          <button
            onClick={onClose}
            disabled={deleting}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-100 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 px-7 py-7 border-t border-gray-500">
          <p className="text-base font-bold text-gray-100">
            Deseja realmente excluir {clientName}?
          </p>
          <p className="text-sm font-normal text-gray-300 leading-[1.5]">
            Ao excluir, todos os chamados deste cliente serão removidos e esta ação não poderá ser desfeita.
          </p>
        </div>

        {/* Footer */}
        <div className="px-7 py-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 h-10 bg-gray-500 hover:bg-gray-400 text-gray-200 font-bold text-sm rounded-[5px] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 h-10 bg-gray-200 hover:bg-gray-100 text-gray-600 font-bold text-sm rounded-[5px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {deleting && <Loader2 size={16} className="animate-spin" />}
            {deleting ? "Excluindo..." : "Sim, excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
