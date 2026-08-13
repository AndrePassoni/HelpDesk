import { useState, useRef } from "react";
import { X, Upload, Trash2, Lock, Loader2, Check } from "lucide-react";
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
      <div className="w-full max-w-110 bg-white rounded-[10px] shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-lg font-bold text-gray-100">Perfil</span>
          <button
            onClick={handleCloseAll}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-5 px-6 pt-6 pb-8 border-t border-b border-gray-600">
          {/* Avatar & Actions */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-brand-base flex items-center justify-center text-gray-600 font-bold text-xl uppercase shrink-0 relative overflow-hidden">
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
                className="h-8 px-3 bg-gray-600 rounded-md flex items-center gap-2 text-xs font-bold text-gray-100 hover:bg-gray-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 size={14} className="animate-spin text-gray-400" /> : <Upload size={14} className="text-gray-100" />}
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
                className="w-8 h-8 bg-gray-600 rounded-md flex items-center justify-center text-feedback-danger hover:bg-gray-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4 mt-2">
            {/* Nome */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Nome
              </label>
              <div className="h-10 border-b border-gray-600 flex items-center pb-2">
                <input
                  type="text"
                  readOnly
                  value={userData.name || "Usuário Cliente"}
                  className="w-full bg-transparent text-sm md:text-base font-normal text-gray-100 focus:outline-none"
                />
              </div>
            </div>

            {/* E-mail */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                E-mail
              </label>
              <div className="h-10 border-b border-gray-600 flex items-center pb-2">
                <input
                  type="email"
                  readOnly
                  value={userData.email || "user.client@test.com"}
                  className="w-full bg-transparent text-sm md:text-base font-normal text-gray-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="flex flex-col relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Senha
              </label>
              <div className="h-10 border-b border-gray-600 flex items-center justify-between pr-20 pb-2">
                <input
                  type="password"
                  readOnly
                  value="••••••••"
                  className="w-full bg-transparent text-base font-bold text-gray-100 focus:outline-none tracking-widest"
                />
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => setShowPasswordModal(true)}
                className="absolute right-0 bottom-3 h-7 px-3 bg-gray-600 rounded-md flex items-center text-xs font-bold text-gray-100 hover:bg-gray-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Alterar
              </button>
            </div>
          </div>
        </div>

        {/* Availability Section - Technician Only */}
        {isTechnician && availableHours.length > 0 && (
          <div className="flex flex-col gap-3 px-7 py-5 border-t border-gray-600">
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
                  className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold text-gray-400 border border-gray-600"
                >
                  {hour}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-6 flex items-center justify-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasChanges || saved}
            className={`w-full py-3.5 rounded-md font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
              saving
                ? "bg-gray-500 text-gray-200 cursor-not-allowed"
                : saved
                ? "bg-feedback-done text-gray-100 cursor-not-allowed"
                : hasChanges
                ? "bg-gray-100 text-white hover:bg-gray-200"
                : "bg-gray-100 text-white opacity-50 cursor-not-allowed"
            }`}
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