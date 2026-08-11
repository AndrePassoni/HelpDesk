import { useState, useRef } from "react";
import { X, Image as ImageIcon, Trash2, Lock, Loader2, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { ChangePasswordModal } from "./ChangePasswordModal";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasChanges = selectedFile !== null;

  async function handleImageUpload() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione uma imagem válida.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setSaved(false);
  }

  async function handleSave() {
    if (!selectedFile) return;

    setSaving(true);
    setSaved(false);

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      await api.patch("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const profileRes = await api.get("/profile");
      localStorage.setItem("@HelpDesk:user", JSON.stringify(profileRes.data));
      window.dispatchEvent(new CustomEvent("auth-user-updated", { detail: profileRes.data }));

      setSaved(true);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao atualizar foto de perfil.";
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  function handleCloseAll() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setSaved(false);
    setShowPasswordModal(false);
    onClose();
  }

  function handleBackFromPassword() {
    setShowPasswordModal(false);
  }

  const userData = user || { name: "Usuário Cliente", email: "user.client@test.com", imageUrl: null, role: "CLIENT" as const, availableHours: [] as string[] };

  const getSaveButtonClasses = () => {
    if (saving) return "w-full h-10 rounded-[5px] font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 bg-gray-500 text-gray-200 cursor-not-allowed";
    if (saved) return "w-full h-10 rounded-[5px] font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 bg-feedback-done text-gray-100 cursor-not-allowed";
    if (hasChanges) return "w-full h-10 rounded-[5px] font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 bg-gray-200 text-gray-600 hover:bg-gray-100";
    return "w-full h-10 rounded-[5px] font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 bg-gray-500 text-gray-400 cursor-not-allowed";
  };

  const displayImage = previewUrl || (userData.imageUrl ? `http://localhost:3333/files/${userData.imageUrl}` : null);

  const initialsStr = userData.name
    ? userData.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "U";

  const isTechnician = userData.role === "TECHNICIAN";
  const availableHours = [...(userData.availableHours || [])].sort();

  if (!isOpen) return null;

  if (showPasswordModal) {
    return (
      <ChangePasswordModal
        isOpen={true}
        onBack={handleBackFromPassword}
        onClose={handleCloseAll}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-110 bg-gray-600 rounded-[10px] border border-gray-500 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5">
          <span className="text-base font-normal text-gray-200">Perfil</span>
          <button
            onClick={handleCloseAll}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-5 px-7 pt-7 pb-8 border-t border-b border-gray-500">
          {/* Avatar & Actions */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-base flex items-center justify-center text-gray-600 font-bold text-lg uppercase shrink-0 relative overflow-hidden">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={userData.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initialsStr
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={saving}
                className="h-7 px-2.5 bg-gray-500 rounded-[5px] flex items-center gap-2 text-xs font-bold text-feedback-done hover:bg-gray-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 size={14} className="animate-spin text-gray-200" /> : <ImageIcon size={14} className="text-gray-200" />}
                {saving ? "Carregando..." : "Nova imagem"}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => {
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setSaved(false);
                }}
                disabled={saving || !hasChanges}
                className="w-7 h-7 bg-gray-500 rounded-[5px] flex items-center justify-center text-feedback-danger hover:bg-gray-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                  value={userData.name || "Usuário Cliente"}
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
                  value={userData.email || "user.client@test.com"}
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
                disabled={saving}
                onClick={() => setShowPasswordModal(true)}
                className="absolute right-0 bottom-1.5 h-7 px-2.5 bg-gray-500 rounded-[5px] flex items-center gap-1.5 text-xs font-bold text-feedback-done hover:bg-gray-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock size={12} className="text-gray-200" />
                Alterar
              </button>
            </div>
          </div>
        </div>

        {/* Availability Section - Technician Only */}
        {isTechnician && availableHours.length > 0 && (
          <div className="flex flex-col gap-3 px-7 py-5 border-t border-gray-500">
            <div className="flex flex-col">
              <span className="text-sm font-normal text-gray-200 leading-[1.4]">
                Disponibilidade
              </span>
              <span className="text-xs font-normal text-gray-300 leading-[1.4] mt-0.5">
                Horários de atendimento definidos pelo admin
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableHours.map((hour: string) => (
                <span
                  key={hour}
                  className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold text-gray-300 border border-gray-500"
                >
                  {hour}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-7 py-6 flex items-center justify-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasChanges || saved}
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