import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Bell, Shield, LogOut, ChevronRight, Save, Camera, Lock, Eye, EyeOff,
  HelpCircle, Info, Star, Download, Trash2, Globe, Moon, Smartphone, AtSign,
  Heart, MessageCircle, UserPlus, Volume2, Link2, Copy, CheckCircle2, AlertTriangle,
  QrCode, CreditCard, Bookmark, Users, X
} from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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

type Section = "main" | "profile" | "account" | "privacy" | "notifications" | "security" | "appearance" | "about" | "help";

const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all text-[#e8e8f0]";
const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,200,255,0.2)" };

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="relative w-12 h-6 rounded-full transition-all flex-shrink-0" style={{ background: on ? "#e8102a" : "rgba(255,255,255,0.1)", boxShadow: on ? "0 0 10px rgba(232,16,42,0.5)" : "none" }}>
      <div className="absolute top-1 h-4 w-4 rounded-full bg-white transition-all" style={{ left: on ? "calc(100% - 20px)" : "4px" }} />
    </button>
  );
}

function SettingRow({ icon: Icon, label, sub, color = "#e8e8f0", onClick, rightEl, danger }: { icon: any; label: string; sub?: string; color?: string; onClick?: () => void; rightEl?: React.ReactNode; danger?: boolean }) {
  return (
    <motion.button whileTap={{ scale: 0.99 }} onClick={onClick} className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all group" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.035)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: danger ? "rgba(232,16,42,0.12)" : `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color: danger ? "#e8102a" : color }} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className={`text-sm font-medium ${danger ? "text-[#e8102a]" : "text-[#e8e8f0]"}`}>{label}</p>
        {sub && <p className="text-[11px] text-[#e8e8f0]/35 mt-0.5 truncate">{sub}</p>}
      </div>
      {rightEl || (
        onClick ? <ChevronRight className="w-4 h-4 text-[#e8e8f0]/25 group-hover:text-[#e8e8f0]/50 flex-shrink-0" /> : null
      )}
    </motion.button>
  );
}

export default function SettingsPage() {
  const { currentUser, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [section, setSection] = useState<Section>("main");
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Profile
  const [username, setUsername] = useState(currentUser?.username || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [website, setWebsite] = useState("");
  const [selectedColor, setSelectedColor] = useState(currentUser?.avatarColor || "#e8102a");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentUser?.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Privacy
  const [privateAccount, setPrivateAccount] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [storyReplies, setStoryReplies] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);
  const [allowTags, setAllowTags] = useState(true);
  const [showLikeCount, setShowLikeCount] = useState(true);

  // Notifications
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifFollows, setNotifFollows] = useState(true);
  const [notifDMs, setNotifDMs] = useState(true);
  const [notifMentions, setNotifMentions] = useState(true);
  const [notifStories, setNotifStories] = useState(true);
  const [notifLive, setNotifLive] = useState(false);
  const [notifEmail, setNotifEmail] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  // Security
  const [showPassword, setShowPassword] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [savedLogin, setSavedLogin] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Appearance
  const [darkMode, setDarkMode] = useState(true);

  // Copied state
  const [copied, setCopied] = useState(false);

  if (!currentUser) return null;

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try { setAvatarUrl(await compressImage(file)); }
    catch { toast({ title: "Erreur", description: "Impossible de charger l'image." }); }
    finally { setUploadingPhoto(false); e.target.value = ""; }
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateUser({ ...currentUser, username, bio, avatarColor: selectedColor, avatarUrl });
    setSaving(false);
    toast({ title: "✦ Profil mis à jour !", description: "Vos modifications ont été sauvegardées." });
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`https://playquest.varnox.prime/@${currentUser.username}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewUser = { ...currentUser, username, avatarColor: selectedColor, avatarUrl };

  const goBack = () => setSection("main");

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">

        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          {section !== "main" && (
            <motion.button whileTap={{ scale: 0.93 }} onClick={goBack} className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <ChevronRight className="w-4 h-4 text-[#e8e8f0]/60 rotate-180" />
            </motion.button>
          )}
          <h1 className="text-2xl font-bold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {section === "main" ? "Paramètres" :
             section === "profile" ? "Modifier le profil" :
             section === "account" ? "Compte" :
             section === "privacy" ? "Confidentialité" :
             section === "notifications" ? "Notifications" :
             section === "security" ? "Sécurité" :
             section === "appearance" ? "Apparence" :
             section === "help" ? "Aide & Support" :
             "À propos"}
          </h1>
        </div>

        <AnimatePresence mode="wait">

          {/* ── MAIN LIST ── */}
          {section === "main" && (
            <motion.div key="main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
              {/* User card */}
              <motion.div whileHover={{ scale: 1.01 }} onClick={() => setSection("profile")} className="p-4 rounded-2xl cursor-pointer flex items-center gap-4 mb-2" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>
                <div className="relative">
                  <div className="p-0.5 rounded-2xl" style={{ background: `linear-gradient(135deg,${currentUser.avatarColor},#00c8ff)` }}>
                    <UserAvatar user={currentUser} size="lg" square style={{ boxShadow: "none" }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#e8e8f0]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>@{currentUser.username}</p>
                  <p className="text-xs text-[#e8e8f0]/45 mt-0.5 truncate">{currentUser.bio || "Aucune biographie"}</p>
                  <p className="text-[11px] text-[#00c8ff]/60 mt-1">Modifier le profil</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#e8e8f0]/25 flex-shrink-0" />
              </motion.div>

              <div className="space-y-1.5">
                <p className="text-[10px] text-[#e8e8f0]/30 uppercase tracking-wider px-1 mb-1">Compte</p>
                <SettingRow icon={User} label="Modifier le profil" sub="Photo, bio, username" color="#00c8ff" onClick={() => setSection("profile")} />
                <SettingRow icon={Users} label="Compte" sub="Email, téléphone, date de naissance" color="#e8102a" onClick={() => setSection("account")} />
                <SettingRow icon={Bookmark} label="Sauvegardés" sub="Vos posts sauvegardés" color="#ff9900" onClick={() => toast({ title: "Sauvegardés", description: "Fonctionnalité bientôt disponible" })} />
                <SettingRow icon={Link2} label="Lien du profil" sub={`playquest.app/@${currentUser.username}`} color="#39ff14" onClick={copyProfileLink} rightEl={copied ? <CheckCircle2 className="w-4 h-4 text-[#39ff14]" /> : <Copy className="w-4 h-4 text-[#e8e8f0]/25" />} />
                <SettingRow icon={QrCode} label="QR Code" sub="Votre code QR PlayQuest" color="#9900ff" onClick={() => toast({ title: "QR Code", description: "Fonctionnalité bientôt disponible" })} />
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] text-[#e8e8f0]/30 uppercase tracking-wider px-1 mb-1">Préférences</p>
                <SettingRow icon={Bell} label="Notifications" sub="Push, email, activité" color="#e8102a" onClick={() => setSection("notifications")} />
                <SettingRow icon={Shield} label="Confidentialité" sub="Compte privé, story, mentions" color="#00c8ff" onClick={() => setSection("privacy")} />
                <SettingRow icon={Lock} label="Sécurité" sub="Mot de passe, 2FA, connexions" color="#9900ff" onClick={() => setSection("security")} />
                <SettingRow icon={Moon} label="Apparence" sub="Mode sombre, thème, langue" color="#ff9900" onClick={() => setSection("appearance")} />
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] text-[#e8e8f0]/30 uppercase tracking-wider px-1 mb-1">Aide</p>
                <SettingRow icon={HelpCircle} label="Centre d'aide" sub="FAQ, assistance" color="#39ff14" onClick={() => setSection("help")} />
                <SettingRow icon={AlertTriangle} label="Signaler un problème" sub="Nous contacter" color="#ff9900" onClick={() => toast({ title: "Merci !", description: "Votre signalement a été envoyé." })} />
                <SettingRow icon={Info} label="À propos de PlayQuest" sub="Version, conditions, politique" color="#00c8ff" onClick={() => setSection("about")} />
              </div>

              <div className="pt-1">
                <SettingRow icon={LogOut} label="Se déconnecter" color="#e8102a" danger onClick={logout} />
              </div>

              <p className="text-center text-[10px] text-[#e8e8f0]/18 pt-2">✦ PlayQuest v2.0.0 by varnox•prime</p>
            </motion.div>
          )}

          {/* ── PROFILE ── */}
          {section === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div className="p-6 rounded-2xl" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>
                {/* Avatar */}
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative">
                    <div className="p-0.5 rounded-2xl" style={{ background: `linear-gradient(135deg,${selectedColor},#00c8ff)`, boxShadow: `0 0 24px ${selectedColor}60` }}>
                      <UserAvatar user={previewUser} size="xl" square style={{ boxShadow: "none" }} />
                    </div>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => photoInputRef.current?.click()} disabled={uploadingPhoto} className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 14px rgba(232,16,42,0.5)", border: "2px solid #06060d" }}>
                      {uploadingPhoto ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Camera className="w-3.5 h-3.5 text-white" />}
                    </motion.button>
                    <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#e8e8f0]">@{username}</p>
                    <p className="text-xs text-[#e8e8f0]/40 mt-0.5">Photo de profil</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => photoInputRef.current?.click()} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "rgba(0,200,255,0.08)", color: "#00c8ff", border: "1px solid rgba(0,200,255,0.2)" }}>
                        {avatarUrl ? "Changer" : "Ajouter"}
                      </button>
                      {avatarUrl && (
                        <button onClick={() => setAvatarUrl(undefined)} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "rgba(232,16,42,0.08)", color: "#e8102a", border: "1px solid rgba(232,16,42,0.2)" }}>
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#e8e8f0]/50 mb-1.5 uppercase tracking-wider">Nom d'utilisateur</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#e8e8f0]/50 mb-1.5 uppercase tracking-wider">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Parlez-nous de vous…" className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none text-[#e8e8f0] placeholder:text-[#e8e8f0]/25" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#e8e8f0]/50 mb-1.5 uppercase tracking-wider">Lien / Site web</label>
                    <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://…" className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#e8e8f0]/50 mb-2 uppercase tracking-wider">Couleur de profil</label>
                    <div className="flex gap-2 flex-wrap">
                      {AVATAR_COLORS.map(color => (
                        <button key={color} onClick={() => setSelectedColor(color)} className="w-8 h-8 rounded-full transition-all" style={{ backgroundColor: color, boxShadow: selectedColor === color ? `0 0 12px ${color},0 0 24px ${color}50` : "none", transform: selectedColor === color ? "scale(1.2)" : "scale(1)", border: selectedColor === color ? "2px solid white" : "2px solid transparent" }} />
                      ))}
                    </div>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveProfile} disabled={saving} className="w-full mt-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2" style={{ background: saving ? "rgba(232,16,42,0.5)" : "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: saving ? "none" : "0 0 16px rgba(232,16,42,0.4)" }}>
                  <Save className="w-4 h-4" />{saving ? "Sauvegarde…" : "Enregistrer les modifications"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── ACCOUNT ── */}
          {section === "account" && (
            <motion.div key="account" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2">
              {[
                { icon: AtSign, label: "Nom d'utilisateur", sub: `@${currentUser.username}`, color: "#00c8ff" },
                { icon: Globe, label: "Adresse email", sub: currentUser.email, color: "#e8102a" },
                { icon: Smartphone, label: "Numéro de téléphone", sub: "Non configuré", color: "#ff9900" },
                { icon: User, label: "Nom complet", sub: "Non configuré", color: "#9900ff" },
                { icon: Star, label: "Genre", sub: "Non précisé", color: "#39ff14" },
                { icon: CreditCard, label: "Date de naissance", sub: "Non configurée", color: "#00c8ff" },
                { icon: Download, label: "Télécharger mes données", sub: "Exporter votre activité", color: "#ff9900" },
                { icon: Trash2, label: "Désactiver le compte", sub: "Temporairement désactiver", color: "#e8102a", danger: true },
              ].map(({ icon, label, sub, color, danger }) => (
                <SettingRow key={label} icon={icon} label={label} sub={sub} color={color} danger={danger} onClick={() => toast({ title: label, description: "Fonctionnalité disponible prochainement" })} />
              ))}
            </motion.div>
          )}

          {/* ── PRIVACY ── */}
          {section === "privacy" && (
            <motion.div key="privacy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              <div className="p-5 rounded-2xl space-y-4" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>
                <p className="text-xs font-semibold text-[#e8e8f0]/50 uppercase tracking-wider">Compte</p>
                {[
                  { label: "Compte privé", sub: "Seuls vos abonnés voient vos posts", v: privateAccount, set: setPrivateAccount },
                  { label: "Statut d'activité", sub: "Montrer quand vous êtes en ligne", v: activityStatus, set: setActivityStatus },
                  { label: "Réponses aux stories", sub: "Qui peut répondre à vos stories", v: storyReplies, set: setStoryReplies },
                  { label: "Autoriser les mentions", sub: "Qui peut vous mentionner", v: allowMentions, set: setAllowMentions },
                  { label: "Autoriser les tags", sub: "Qui peut vous tagger dans des posts", v: allowTags, set: setAllowTags },
                  { label: "Afficher le nombre de likes", sub: "Sur vos publications", v: showLikeCount, set: setShowLikeCount },
                ].map(({ label, sub, v, set }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    <div>
                      <p className="text-sm text-[#e8e8f0]">{label}</p>
                      <p className="text-[11px] text-[#e8e8f0]/38 mt-0.5">{sub}</p>
                    </div>
                    <Toggle on={v} onChange={set} />
                  </div>
                ))}
              </div>
              <SettingRow icon={Users} label="Liste des personnes bloquées" sub="Gérer vos blocages" color="#e8102a" onClick={() => toast({ title: "Blocages", description: "Aucun compte bloqué" })} />
              <SettingRow icon={Eye} label="Posts masqués" sub="Posts que vous avez masqués" color="#9900ff" onClick={() => toast({ title: "Masqués", description: "Aucun post masqué" })} />
            </motion.div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {section === "notifications" && (
            <motion.div key="notifs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              <div className="p-5 rounded-2xl space-y-1" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>
                <p className="text-xs font-semibold text-[#e8e8f0]/50 uppercase tracking-wider mb-3">Push notifications</p>
                {[
                  { label: "Notifications push", sub: "Activer toutes les notifs", v: pushEnabled, set: setPushEnabled },
                ].map(({ label, sub, v, set }) => (
                  <div key={label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm text-[#e8e8f0]">{label}</p>
                      <p className="text-[11px] text-[#e8e8f0]/38 mt-0.5">{sub}</p>
                    </div>
                    <Toggle on={v} onChange={set} />
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-2xl space-y-0" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>
                <p className="text-xs font-semibold text-[#e8e8f0]/50 uppercase tracking-wider mb-3">Activité</p>
                {[
                  { icon: Heart, label: "J'aimes", sub: "Quand quelqu'un aime votre post", v: notifLikes, set: setNotifLikes, color: "#e8102a" },
                  { icon: MessageCircle, label: "Commentaires", sub: "Nouveaux commentaires", v: notifComments, set: setNotifComments, color: "#00c8ff" },
                  { icon: UserPlus, label: "Abonnements", sub: "Nouveaux abonnés", v: notifFollows, set: setNotifFollows, color: "#39ff14" },
                  { icon: AtSign, label: "Mentions", sub: "@mentions dans les posts", v: notifMentions, set: setNotifMentions, color: "#ff9900" },
                  { icon: MessageCircle, label: "Messages directs", sub: "Nouveaux messages", v: notifDMs, set: setNotifDMs, color: "#9900ff" },
                  { icon: Volume2, label: "Stories", sub: "Réponses à vos stories", v: notifStories, set: setNotifStories, color: "#00c8ff" },
                  { icon: Volume2, label: "Live & Vidéo", sub: "Quand quelqu'un commence un live", v: notifLive, set: setNotifLive, color: "#e8102a" },
                  { icon: Globe, label: "Notifications email", sub: "Recevoir des emails", v: notifEmail, set: setNotifEmail, color: "#ff9900" },
                ].map(({ icon: Icon, label, sub, v, set, color }) => (
                  <div key={label} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#e8e8f0]">{label}</p>
                      <p className="text-[11px] text-[#e8e8f0]/38">{sub}</p>
                    </div>
                    <Toggle on={v} onChange={set} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── SECURITY ── */}
          {section === "security" && (
            <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              <div className="p-5 rounded-2xl space-y-4" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>
                <p className="text-xs font-semibold text-[#e8e8f0]/50 uppercase tracking-wider">Connexion</p>
                {[
                  { label: "Connexion sauvegardée", sub: "Rester connecté automatiquement", v: savedLogin, set: setSavedLogin },
                  { label: "Alertes de connexion", sub: "Notifier lors d'une nouvelle connexion", v: loginAlerts, set: setLoginAlerts },
                ].map(({ label, sub, v, set }) => (
                  <div key={label} className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm text-[#e8e8f0]">{label}</p>
                      <p className="text-[11px] text-[#e8e8f0]/38 mt-0.5">{sub}</p>
                    </div>
                    <Toggle on={v} onChange={set} />
                  </div>
                ))}
              </div>
              <SettingRow icon={Lock} label="Changer le mot de passe" sub="Modifier votre mot de passe actuel" color="#e8102a" onClick={() => toast({ title: "Mot de passe", description: "Fonctionnalité bientôt disponible" })} />
              <SettingRow icon={Smartphone} label="Authentification à deux facteurs" sub={twoFA ? "Activée" : "Non activée"} color="#9900ff" onClick={() => { setTwoFA(!twoFA); toast({ title: twoFA ? "2FA désactivée" : "2FA activée", description: "Votre sécurité a été mise à jour." }); }} rightEl={<Toggle on={twoFA} onChange={setTwoFA} />} />
              <SettingRow icon={Globe} label="Activité de connexion" sub="Voir les connexions récentes" color="#00c8ff" onClick={() => toast({ title: "Activité", description: "Aucune connexion suspecte détectée ✦" })} />
            </motion.div>
          )}

          {/* ── APPEARANCE ── */}
          {section === "appearance" && (
            <motion.div key="appearance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              <div className="p-5 rounded-2xl" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-[#e8e8f0]">Mode sombre</p>
                    <p className="text-[11px] text-[#e8e8f0]/38 mt-0.5">Interface noire cyberpunk</p>
                  </div>
                  <Toggle on={darkMode} onChange={setDarkMode} />
                </div>
              </div>
              <SettingRow icon={Globe} label="Langue de l'application" sub="Français" color="#00c8ff" onClick={() => toast({ title: "Langue", description: "PlayQuest est en français 🇫🇷" })} />
              <SettingRow icon={Smartphone} label="Format d'affichage" sub="Grille, liste ou compact" color="#9900ff" onClick={() => toast({ title: "Format", description: "Mode grille activé" })} />
            </motion.div>
          )}

          {/* ── HELP ── */}
          {section === "help" && (
            <motion.div key="help" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2">
              {[
                { icon: HelpCircle, label: "Centre d'aide", sub: "Questions fréquentes", color: "#39ff14" },
                { icon: AlertTriangle, label: "Signaler un problème", sub: "Bug ou comportement inapproprié", color: "#ff9900" },
                { icon: MessageCircle, label: "Nous contacter", sub: "Envoyer un message à l'équipe", color: "#00c8ff" },
                { icon: Star, label: "Évaluer l'application", sub: "Votre avis compte", color: "#e8102a" },
              ].map(({ icon, label, sub, color }) => (
                <SettingRow key={label} icon={icon} label={label} sub={sub} color={color} onClick={() => toast({ title: label, description: "Redirection bientôt disponible" })} />
              ))}
            </motion.div>
          )}

          {/* ── ABOUT ── */}
          {section === "about" && (
            <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              <div className="p-6 rounded-2xl text-center" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 30px rgba(232,16,42,0.5)" }}>
                  <span className="text-white font-black text-lg">PQ</span>
                </div>
                <p className="font-bold text-[#e8e8f0] text-lg" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>PlayQuest</p>
                <p className="text-xs text-[#e8e8f0]/35 mt-1">Version 2.0.0</p>
                <p className="text-xs text-[#00c8ff]/50 mt-1">by varnox•prime</p>
              </div>
              {[
                { icon: Globe, label: "Politique de confidentialité", color: "#00c8ff" },
                { icon: Info, label: "Conditions d'utilisation", color: "#9900ff" },
                { icon: Star, label: "Licences open source", color: "#39ff14" },
                { icon: Shield, label: "Sécurité des données", color: "#e8102a" },
              ].map(({ icon, label, color }) => (
                <SettingRow key={label} icon={icon} label={label} color={color} onClick={() => toast({ title: label, description: "Document bientôt disponible" })} />
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </Layout>
  );
}
