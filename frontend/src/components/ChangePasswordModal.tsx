import { useState } from "react";
import { X, ArrowLeft, Loader2, Check, AlertCircle } from "lucide-react";
import { api } from "../services/api";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onBack: () => void;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onBack, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasMinLength = newPassword.length >= 6;
  const showHelperError = !hasMinLength && newPassword.length > 0;
  const canSave = currentPassword && hasMinLength && !saving && !saved;

  function handleBack() {
    setCurrentPassword("");
    setNewPassword("");
    setSaving(false);
    setSaved(false);
    onBack();
  }

  async function handleSave() {
    if (!canSave) return;

    setSaving(true);

    try {
      await api.put("/profile", {
        old_password: currentPassword,
        password: newPassword,
      });

      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao alterar senha.";
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  function getSaveButtonClasses() {
    if (saving) return "w-full h-10 rounded-[5px] font-bold text-sm transition-colors flex items-center justify-center gap-2 bg-gray-500 text-gray-200 cursor-not-allowed";
    if (saved) return "w-full h-10 rounded-[5px] font-bold text-sm transition-colors flex items-center justify-center gap-2 bg-feedback-done text-gray-600 cursor-not-allowed";
    return "w-full h-10 rounded-[5px] font-bold text-sm transition-colors flex items-center justify-center gap-2 bg-gray-200 text-gray-600 hover:bg-gray-100";
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-110 bg-gray-600 rounded-[10px] border border-gray-500 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-7 pt-5 pb-6">
          <button
            onClick={handleBack}
            disabled={saving}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-400 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="flex-1 text-base font-normal text-gray-200">
            Alterar senha
          </span>
          <button
            onClick={onClose}
            disabled={saving}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-400 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-5 px-7 pt-7 pb-8 border-t border-b border-gray-500">
          <div className="flex flex-col gap-4">
            {/* Current Password */}
            <div className="flex flex-col justify-center">
              <label className="text-[12px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-0.5">
                Senha atual
              </label>
              <div className="h-10 border-b border-black flex items-center px-2">
                <input
                  type="password"
                  placeholder="Digite sua senha atual"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setSaved(false);
                  }}
                  disabled={saving}
                  className="w-full bg-transparent text-base font-normal text-gray-200 placeholder:text-gray-200 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col justify-center">
              <label className="text-[12px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-0.5">
                Nova senha
              </label>
              <div className="h-10 border-b border-black flex items-center gap-2 px-2">
                <input
                  type="password"
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setSaved(false);
                  }}
                  disabled={saving}
                  className="w-full bg-transparent text-base font-normal text-gray-200 placeholder:text-gray-200 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div className="flex items-center gap-1 pt-1.5">
                {showHelperError && (
                  <AlertCircle size={14} className="text-feedback-danger shrink-0" />
                )}
                <span className={`text-[12px] font-bold leading-[1.4] ${showHelperError ? "text-feedback-danger" : "text-gray-400"}`}>
                  Mínimo de 6 dígitos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-6 flex items-center justify-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={getSaveButtonClasses()}
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saved && <Check size={16} />}
            {saving
              ? "Salvando..."
              : saved
              ? "Salvo"
              : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}