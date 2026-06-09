import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, LogOut, ChevronRight, Save, Camera } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";
import { UserAvatar } from "@/components/UserAvatar";

const AVATAR_COLORS = ["#e8102a", "#00c8ff", "#9900ff", "#ff9900", "#39ff14", "#ff00ff", "#00ff88", "#ff6600"];

function compressImage(file: File, maxSize = 400, quality = 0.85): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const max = maxSize;
        if (width > max || height > max) {
          if (width > height) { height = (height * max) / width; width = max; }
          else { width = (width * max) / height; height = max; }
        }
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function SettingsPage() {
  const { currentUser, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState(currentUser?.username || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [selectedColor, setSelectedColor] = useState(currentUser?.avatarColor || "#e8102a");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentUser?.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifFollows, setNotifFollows] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "notifications" | "privacy">("profile");

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const compressed = await compressImage(file);
      setAvatarUrl(compressed);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger l'image." });
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const removePhoto = () => setAvatarUrl(undefined);

  const saveProfile = async () => {
    if (!currentUser) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateUser({ ...currentUser, username, bio, avatarColor: selectedColor, avatarUrl });
    setSaving(false);
    toast({ title: "✦ Profil mis à jour !", description: "Vos modifications ont été sauvegardées." });
  };

  if (!currentUser) return null;

  const previewUser = { ...currentUser, username, avatarColor: selectedColor, avatarUrl };
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", color: "#e8e8f0" };
  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = "rgba(0,200,255,0.5)"; e.target.style.boxShadow = "0 0 12px rgba(0,200,255,0.15)"; };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = "rgba(0,200,255,0.2)"; e.target.style.boxShadow = "none"; };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold gradient-text mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Paramètres</h1>

        <div className="flex gap-2 mb-6">
          {([
            { id: "profile" as const, icon: User, label: "Profil" },
            { id: "notifications" as const, icon: Bell, label: "Notifications" },
            { id: "privacy" as const, icon: Shield, label: "Confidentialité" },
          ]).map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActiveSection(id)} data-testid={`tab-settings-${id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: activeSection === id ? "linear-gradient(135deg, #e8102a, #c8001f)" : "rgba(255,255,255,0.05)", color: activeSection === id ? "white" : "rgba(232,232,240,0.6)", boxShadow: activeSection === id ? "0 0 12px rgba(232,16,42,0.4)" : "none" }}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {activeSection === "profile" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 rounded-2xl" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>

              {/* Avatar preview + photo upload */}
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <UserAvatar user={previewUser} size="xl" square style={{ boxShadow: `0 0 24px ${selectedColor}60` }} />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 14px rgba(232,16,42,0.5)", border: "2px solid #06060d" }}
                    title="Changer la photo"
                  >
                    {uploadingPhoto ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-3.5 h-3.5 text-white" />
                    )}
                  </motion.button>
                  <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#e8e8f0]">@{username}</p>
                  <p className="text-xs text-[#e8e8f0]/40 mt-0.5">Aperçu de votre profil</p>
                  <div className="flex gap-2 mt-2.5">
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{ background: "rgba(0,200,255,0.08)", color: "#00c8ff", border: "1px solid rgba(0,200,255,0.2)" }}
                    >
                      {avatarUrl ? "Changer la photo" : "Ajouter une photo"}
                    </button>
                    {avatarUrl && (
                      <button
                        onClick={removePhoto}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                        style={{ background: "rgba(232,16,42,0.08)", color: "#e8102a", border: "1px solid rgba(232,16,42,0.2)" }}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#e8e8f0]/60 mb-1.5 uppercase tracking-wider">Nom d'utilisateur</label>
                  <input value={username} onChange={e => setUsername(e.target.value)} data-testid="input-edit-username" className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#e8e8f0]/60 mb-1.5 uppercase tracking-wider">Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} data-testid="input-edit-bio" rows={3} placeholder="Parlez-nous de vous..." className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all" style={inputStyle} onFocus={focusStyle as any} onBlur={blurStyle as any} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#e8e8f0]/60 mb-2 uppercase tracking-wider">Couleur de profil</label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_COLORS.map(color => (
                      <button key={color} onClick={() => setSelectedColor(color)} className="w-9 h-9 rounded-full transition-all" style={{ backgroundColor: color, boxShadow: selectedColor === color ? `0 0 14px ${color}, 0 0 28px ${color}50` : "none", transform: selectedColor === color ? "scale(1.2)" : "scale(1)", border: selectedColor === color ? "2px solid white" : "2px solid transparent" }} />
                    ))}
                  </div>
                  <p className="text-[10px] text-[#e8e8f0]/25 mt-1.5">Utilisée comme couleur d'accent et fond si pas de photo</p>
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveProfile} disabled={saving} data-testid="button-save-profile" className="w-full mt-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all" style={{ background: saving ? "rgba(232,16,42,0.5)" : "linear-gradient(135deg, #e8102a, #c8001f)", boxShadow: saving ? "none" : "0 0 16px rgba(232,16,42,0.4)" }}>
                <Save className="w-4 h-4" />{saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
              </motion.button>
            </div>

            <div className="p-4 rounded-2xl text-center" style={{ background: "rgba(17,17,24,0.4)", border: "1px solid rgba(0,200,255,0.05)" }}>
              <p className="text-xs text-[#e8e8f0]/30">PlayQuest v2.0.0</p>
              <p className="text-xs mt-1">
                <span className="text-yellow-400" style={{ filter: "drop-shadow(0 0 4px rgba(250,204,21,0.6))" }}>✦</span>
                <span className="gradient-text font-medium"> PlayQuest</span>
                <span className="text-[#e8e8f0]/30"> by </span>
                <span className="text-[#00c8ff]/50">varnox•prime</span>
              </p>
            </div>
          </motion.div>
        )}

        {activeSection === "notifications" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>
            <div className="space-y-4">
              {[
                { label: "J'aimes sur vos publications", value: notifLikes, set: setNotifLikes, id: "notif-likes" },
                { label: "Commentaires sur vos publications", value: notifComments, set: setNotifComments, id: "notif-comments" },
                { label: "Nouveaux abonnés", value: notifFollows, set: setNotifFollows, id: "notif-follows" },
              ].map(({ label, value, set, id }) => (
                <div key={id} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "rgba(0,200,255,0.06)" }}>
                  <span className="text-sm text-[#e8e8f0]/80">{label}</span>
                  <button onClick={() => set(!value)} data-testid={id} className="relative w-12 h-6 rounded-full transition-all" style={{ background: value ? "#e8102a" : "rgba(255,255,255,0.1)", boxShadow: value ? "0 0 10px rgba(232,16,42,0.5)" : "none" }}>
                    <div className="absolute top-1 h-4 w-4 rounded-full bg-white transition-all" style={{ left: value ? "calc(100% - 20px)" : "4px" }} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === "privacy" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-6 rounded-2xl" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-[#e8e8f0]/80">Compte privé</p>
                  <p className="text-xs text-[#e8e8f0]/40 mt-0.5">Seuls vos abonnés voient vos publications</p>
                </div>
                <button onClick={() => setPrivateAccount(!privateAccount)} data-testid="toggle-private" className="relative w-12 h-6 rounded-full transition-all" style={{ background: privateAccount ? "#e8102a" : "rgba(255,255,255,0.1)", boxShadow: privateAccount ? "0 0 10px rgba(232,16,42,0.5)" : "none" }}>
                  <div className="absolute top-1 h-4 w-4 rounded-full bg-white transition-all" style={{ left: privateAccount ? "calc(100% - 20px)" : "4px" }} />
                </button>
              </div>
            </div>

            <button onClick={logout} data-testid="button-logout" className="w-full flex items-center justify-between p-4 rounded-2xl text-sm font-medium transition-all group" style={{ background: "rgba(232,16,42,0.06)", border: "1px solid rgba(232,16,42,0.15)", color: "#e8102a" }}>
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                Se déconnecter
              </div>
              <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
