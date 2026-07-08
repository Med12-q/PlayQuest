import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  User, Bell, Shield, LogOut, ChevronRight, Camera, Lock,
  HelpCircle, Info, Download, Trash2, Globe, Moon, Smartphone, AtSign,
  Eye, Activity, Heart, MessageCircle, UserPlus, Film, Key,
  AlertTriangle, CheckCircle, AlertCircle, Edit3, Mail, Languages,
  Check, Users,
} from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ── Persistent settings ──
const SETTINGS_KEY = "pq_settings";

type SettingsState = {
  privateAccount: boolean;
  showActivity: boolean;
  allowMentions: boolean;
  allowTags: boolean;
  showLikes: boolean;
  notifPush: boolean;
  notifLikes: boolean;
  notifComments: boolean;
  notifFollows: boolean;
  notifMessages: boolean;
  notifMentions: boolean;
  notifStories: boolean;
  twoFAEnabled: boolean;
  loginAlerts: boolean;
  darkMode: boolean;
};

const defaultSettings: SettingsState = {
  privateAccount: false,
  showActivity: true,
  allowMentions: true,
  allowTags: true,
  showLikes: true,
  notifPush: true,
  notifLikes: true,
  notifComments: true,
  notifFollows: true,
  notifMessages: true,
  notifMentions: true,
  notifStories: false,
  twoFAEnabled: false,
  loginAlerts: true,
  darkMode: true,
};

function loadSettings(): SettingsState {
  try {
    const s = localStorage.getItem(SETTINGS_KEY);
    if (s) return { ...defaultSettings, ...JSON.parse(s) };
  } catch { /* ignore */ }
  return defaultSettings;
}

// ── Types ──
type Section = "profile" | "account" | "privacy" | "notifications" | "security" | "appearance" | "help" | "about";

// ── Toggle ──
function Toggle({ checked, onChange, color = "#e8102a", disabled }: { checked: boolean; onChange: (v: boolean) => void; color?: string; disabled?: boolean }) {
  return (
    <motion.button
      onClick={() => !disabled && onChange(!checked)}
      style={{ width: 44, height: 26, borderRadius: 13, background: checked ? color : "rgba(255,255,255,0.12)", transition: "background 0.25s", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, border: "none", padding: 0, flexShrink: 0 }}
      whileTap={disabled ? {} : { scale: 0.92 }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.3)", pointerEvents: "none" }}
      />
    </motion.button>
  );
}

// ── Row ──
function Row({ icon, label, sublabel, right, onClick, danger, color }: { icon: React.ReactNode; label: string; sublabel?: string; right?: React.ReactNode; onClick?: () => void; danger?: boolean; color?: string }) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255,255,255,0.025)" }}
      onClick={onClick}
      className="flex items-center gap-3.5 px-4 py-3.5 transition-colors rounded-xl"
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: danger ? "rgba(232,16,42,0.12)" : color ? `${color}15` : "rgba(255,255,255,0.06)" }}>
        <span style={{ color: danger ? "#e8102a" : color || "#e8e8f0" }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight" style={{ color: danger ? "#e8102a" : "#e8e8f0" }}>{label}</p>
        {sublabel && <p className="text-xs text-[#e8e8f0]/35 mt-0.5 truncate">{sublabel}</p>}
      </div>
      {right ?? (onClick ? <ChevronRight className="w-4 h-4 text-[#e8e8f0]/22 flex-shrink-0" /> : null)}
    </motion.div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl overflow-hidden mb-3" style={{ background: "rgba(14,14,22,0.92)", border: "1px solid rgba(255,255,255,0.06)" }}>{children}</div>;
}

function CardLabel({ label }: { label: string }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-[#e8e8f0]/28 px-4 pt-4 pb-2">{label}</p>;
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#e8e8f0]/30 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e8e8f0", outline: "none" }}
        onFocus={e => { e.target.style.borderColor = "rgba(232,16,42,0.45)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
      />
    </div>
  );
}

function SaveBtn({ label, onClick, color = "#e8102a" }: { label: string; onClick: () => void; color?: string }) {
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClick} className="w-full py-3.5 rounded-2xl text-sm font-bold text-white" style={{ background: `linear-gradient(135deg,${color},${color}cc)`, boxShadow: `0 0 24px ${color}40` }}>
      {label}
    </motion.button>
  );
}

const SECTIONS: { id: Section; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "profile", label: "Modifier le profil", icon: <Edit3 className="w-4 h-4" />, color: "#00c8ff" },
  { id: "account", label: "Compte", icon: <User className="w-4 h-4" />, color: "#9900ff" },
  { id: "privacy", label: "Confidentialité", icon: <Eye className="w-4 h-4" />, color: "#e8102a" },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" />, color: "#ff9900" },
  { id: "security", label: "Sécurité", icon: <Shield className="w-4 h-4" />, color: "#39ff14" },
  { id: "appearance", label: "Apparence", icon: <Moon className="w-4 h-4" />, color: "#9900ff" },
  { id: "help", label: "Aide", icon: <HelpCircle className="w-4 h-4" />, color: "#00c8ff" },
  { id: "about", label: "À propos", icon: <Info className="w-4 h-4" />, color: "#e8e8f0" },
];

export default function SettingsPage() {
  const { currentUser, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [section, setSection] = useState<Section | null>(null);
  const [settings, setSettings] = useState<SettingsState>(loadSettings);
  const fileRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    website: currentUser?.website || "",
    avatarColor: currentUser?.avatarColor || "#e8102a",
    displayName: currentUser?.displayName || "",
  });

  const [accountForm, setAccountForm] = useState({
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    birthday: currentUser?.birthday || "",
    gender: currentUser?.gender || "",
  });

  const [pwdForm, setPwdForm] = useState({ old: "", new1: "", new2: "" });
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const set = <K extends keyof SettingsState>(k: K, v: SettingsState[K]) =>
    setSettings(prev => ({ ...prev, [k]: v }));

  const saveProfile = () => {
    if (!currentUser) return;
    if (profileForm.username.trim().length < 3) {
      toast({ title: "Erreur", description: "Pseudo : min. 3 caractères.", variant: "destructive" }); return;
    }
    updateUser({ ...currentUser, ...profileForm });
    toast({ title: "✓ Profil sauvegardé", description: "Vos informations ont été mises à jour." });
  };

  const saveAccount = () => {
    if (!currentUser) return;
    updateUser({ ...currentUser, ...accountForm });
    toast({ title: "✓ Compte sauvegardé", description: "Informations du compte mises à jour." });
  };

  const changePassword = () => {
    setPwdError(""); setPwdSuccess(false);
    if (!currentUser) return;
    if (!pwdForm.old) { setPwdError("Entrez votre mot de passe actuel."); return; }
    if (currentUser.password !== pwdForm.old) { setPwdError("Mot de passe actuel incorrect."); return; }
    if (pwdForm.new1.length < 4) { setPwdError("Nouveau mot de passe : min. 4 caractères."); return; }
    if (pwdForm.new1 !== pwdForm.new2) { setPwdError("Les mots de passe ne correspondent pas."); return; }
    updateUser({ ...currentUser, password: pwdForm.new1 });
    setPwdForm({ old: "", new1: "", new2: "" });
    setPwdSuccess(true);
    toast({ title: "✓ Mot de passe changé", description: "Votre mot de passe a été mis à jour avec succès." });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    const reader = new FileReader();
    reader.onload = ev => {
      updateUser({ ...currentUser, avatar: ev.target?.result as string });
      toast({ title: "✓ Photo mise à jour", description: "Votre photo de profil a été changée." });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = () => {
    if (!confirm("Supprimer définitivement votre compte ? Cette action est irréversible.")) return;
    if (!currentUser) return;
    try {
      const users = JSON.parse(localStorage.getItem("pq_users") || "[]");
      localStorage.setItem("pq_users", JSON.stringify(users.filter((u: { id: string }) => u.id !== currentUser.id)));
    } catch { /* ignore */ }
    logout();
    navigate("/");
    toast({ title: "Compte supprimé" });
  };

  const avatarUrl = currentUser?.avatar;
  const initials = currentUser?.username?.slice(0, 2).toUpperCase() || "??";

  const renderSection = (): React.ReactNode => {
    if (section === "profile") return (
      <div className="space-y-4">
        <Card>
          <CardLabel label="Photo de profil" />
          <div className="flex items-center gap-4 px-4 pb-4">
            <div className="relative">
              {avatarUrl
                ? <img src={avatarUrl} className="w-16 h-16 rounded-full object-cover" style={{ border: `2px solid ${profileForm.avatarColor}` }} alt="" />
                : <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: profileForm.avatarColor, boxShadow: `0 0 20px ${profileForm.avatarColor}50` }}>{initials}</div>
              }
              <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#e8102a", border: "2px solid #0a0a0f" }}>
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#e8e8f0]">@{currentUser?.username}</p>
              <button onClick={() => fileRef.current?.click()} className="text-xs font-medium mt-0.5" style={{ color: "#00c8ff" }}>Changer la photo</button>
            </div>
          </div>
        </Card>

        <Card>
          <CardLabel label="Couleur du profil" />
          <div className="flex gap-3 px-4 pb-4 flex-wrap">
            {["#e8102a", "#00c8ff", "#9900ff", "#ff9900", "#39ff14", "#ff6b35", "#ff007f", "#00ffcc"].map(c => (
              <motion.button key={c} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setProfileForm(f => ({ ...f, avatarColor: c }))}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: c, boxShadow: `0 0 12px ${c}80`, border: profileForm.avatarColor === c ? "2.5px solid white" : "2.5px solid transparent" }}>
                {profileForm.avatarColor === c && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </motion.button>
            ))}
          </div>
        </Card>

        <Card>
          <CardLabel label="Informations" />
          <div className="px-4 pb-4 space-y-3">
            <Field label="Nom d'affichage" value={profileForm.displayName} onChange={v => setProfileForm(f => ({ ...f, displayName: v }))} placeholder="Votre nom" />
            <Field label="Nom d'utilisateur" value={profileForm.username} onChange={v => setProfileForm(f => ({ ...f, username: v }))} placeholder="pseudo" />
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#e8e8f0]/30 mb-1.5">Bio</label>
              <textarea value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} placeholder="Parlez de vous…" rows={3} maxLength={150}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e8e8f0", outline: "none" }}
                onFocus={e => { e.target.style.borderColor = "rgba(232,16,42,0.45)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
              />
              <p className="text-[10px] text-[#e8e8f0]/22 mt-1 text-right">{profileForm.bio.length}/150</p>
            </div>
            <Field label="Lien / Site web" value={profileForm.website} onChange={v => setProfileForm(f => ({ ...f, website: v }))} placeholder="https://votre-site.com" type="url" />
          </div>
        </Card>
        <SaveBtn label="Sauvegarder le profil" onClick={saveProfile} color="#00c8ff" />
      </div>
    );

    if (section === "account") return (
      <div className="space-y-4">
        <Card>
          <CardLabel label="Informations du compte" />
          <div className="px-4 pb-4 space-y-3">
            <Field label="Adresse email" value={accountForm.email} onChange={v => setAccountForm(f => ({ ...f, email: v }))} type="email" placeholder="vous@exemple.com" />
            <Field label="Téléphone" value={accountForm.phone} onChange={v => setAccountForm(f => ({ ...f, phone: v }))} type="tel" placeholder="+33 6 12 34 56 78" />
            <Field label="Date de naissance" value={accountForm.birthday} onChange={v => setAccountForm(f => ({ ...f, birthday: v }))} type="date" />
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#e8e8f0]/30 mb-1.5">Genre</label>
              <select value={accountForm.gender} onChange={e => setAccountForm(f => ({ ...f, gender: e.target.value }))} className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e8e8f0", outline: "none" }}>
                <option value="">Préfère ne pas préciser</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>
        </Card>
        <SaveBtn label="Sauvegarder le compte" onClick={saveAccount} color="#9900ff" />
        <Card>
          <CardLabel label="Actions du compte" />
          <Row icon={<Download className="w-4 h-4" />} label="Télécharger mes données" sublabel="Archive de toutes vos données PlayQuest" onClick={() => toast({ title: "Export lancé", description: "Vos données seront envoyées par email sous 24h." })} color="#00c8ff" />
          <Row icon={<Trash2 className="w-4 h-4" />} label="Supprimer le compte" sublabel="Action irréversible — tous vos posts seront supprimés" onClick={handleDeleteAccount} danger />
        </Card>
      </div>
    );

    if (section === "privacy") return (
      <div className="space-y-4">
        <Card>
          <CardLabel label="Visibilité du compte" />
          <Row icon={<Lock className="w-4 h-4" />} label="Compte privé" sublabel={settings.privateAccount ? "Seuls vos abonnés voient vos posts" : "Tout le monde peut voir vos posts"} color="#e8102a" right={<Toggle checked={settings.privateAccount} onChange={v => set("privateAccount", v)} />} />
          <Row icon={<Activity className="w-4 h-4" />} label="Statut d'activité" sublabel="Afficher quand vous êtes en ligne" color="#e8102a" right={<Toggle checked={settings.showActivity} onChange={v => set("showActivity", v)} />} />
        </Card>
        <Card>
          <CardLabel label="Interactions" />
          <Row icon={<AtSign className="w-4 h-4" />} label="Autoriser les mentions" sublabel="N'importe qui peut vous mentionner" color="#e8102a" right={<Toggle checked={settings.allowMentions} onChange={v => set("allowMentions", v)} />} />
          <Row icon={<Users className="w-4 h-4" />} label="Autoriser les tags" sublabel="N'importe qui peut vous tagger" color="#e8102a" right={<Toggle checked={settings.allowTags} onChange={v => set("allowTags", v)} />} />
          <Row icon={<Heart className="w-4 h-4" />} label="Afficher le nombre de likes" sublabel="Visible sur vos publications" color="#e8102a" right={<Toggle checked={settings.showLikes} onChange={v => set("showLikes", v)} />} />
        </Card>
      </div>
    );

    if (section === "notifications") return (
      <div className="space-y-4">
        <Card>
          <CardLabel label="Général" />
          <Row icon={<Bell className="w-4 h-4" />} label="Notifications push" sublabel="Activer toutes les notifications" color="#ff9900" right={<Toggle checked={settings.notifPush} onChange={v => set("notifPush", v)} color="#ff9900" />} />
        </Card>
        <Card>
          <CardLabel label="Interactions" />
          <Row icon={<Heart className="w-4 h-4" />} label="Likes" sublabel="Quelqu'un aime votre publication" color="#ff9900" right={<Toggle checked={settings.notifLikes} onChange={v => set("notifLikes", v)} color="#ff9900" disabled={!settings.notifPush} />} />
          <Row icon={<MessageCircle className="w-4 h-4" />} label="Commentaires" sublabel="Commentaires sur vos posts" color="#ff9900" right={<Toggle checked={settings.notifComments} onChange={v => set("notifComments", v)} color="#ff9900" disabled={!settings.notifPush} />} />
          <Row icon={<UserPlus className="w-4 h-4" />} label="Nouveaux abonnés" sublabel="Quelqu'un vous suit" color="#ff9900" right={<Toggle checked={settings.notifFollows} onChange={v => set("notifFollows", v)} color="#ff9900" disabled={!settings.notifPush} />} />
          <Row icon={<AtSign className="w-4 h-4" />} label="Mentions" sublabel="Quand on vous mentionne" color="#ff9900" right={<Toggle checked={settings.notifMentions} onChange={v => set("notifMentions", v)} color="#ff9900" disabled={!settings.notifPush} />} />
        </Card>
        <Card>
          <CardLabel label="Messages & Stories" />
          <Row icon={<MessageCircle className="w-4 h-4" />} label="Messages privés" sublabel="Nouveaux messages reçus" color="#ff9900" right={<Toggle checked={settings.notifMessages} onChange={v => set("notifMessages", v)} color="#ff9900" disabled={!settings.notifPush} />} />
          <Row icon={<Film className="w-4 h-4" />} label="Nouvelles stories" sublabel="Quand quelqu'un poste une story" color="#ff9900" right={<Toggle checked={settings.notifStories} onChange={v => set("notifStories", v)} color="#ff9900" disabled={!settings.notifPush} />} />
        </Card>
      </div>
    );

    if (section === "security") return (
      <div className="space-y-4">
        <Card>
          <CardLabel label="Changer le mot de passe" />
          <div className="px-4 pb-4 space-y-3">
            <Field label="Mot de passe actuel" value={pwdForm.old} onChange={v => { setPwdForm(f => ({ ...f, old: v })); setPwdError(""); setPwdSuccess(false); }} type="password" placeholder="••••••••" />
            <Field label="Nouveau mot de passe" value={pwdForm.new1} onChange={v => { setPwdForm(f => ({ ...f, new1: v })); setPwdError(""); }} type="password" placeholder="••••••••" />
            <Field label="Confirmer le nouveau" value={pwdForm.new2} onChange={v => { setPwdForm(f => ({ ...f, new2: v })); setPwdError(""); }} type="password" placeholder="••••••••" />
            <AnimatePresence>
              {pwdError && (
                <motion.div key="err" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-xs text-[#e8102a] px-3 py-2.5 rounded-xl" style={{ background: "rgba(232,16,42,0.08)", border: "1px solid rgba(232,16,42,0.2)" }}>
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {pwdError}
                </motion.div>
              )}
              {pwdSuccess && (
                <motion.div key="ok" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl" style={{ color: "#39ff14", background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)" }}>
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> Mot de passe changé avec succès !
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={changePassword} className="w-full py-3.5 rounded-xl text-sm font-bold" style={{ background: "linear-gradient(135deg,#39ff14,#00cc00)", boxShadow: "0 0 20px rgba(57,255,20,0.3)", color: "#000" }}>
              Changer le mot de passe
            </motion.button>
          </div>
        </Card>
        <Card>
          <CardLabel label="Authentification à deux facteurs" />
          <Row icon={<Smartphone className="w-4 h-4" />} label="Activer la 2FA" sublabel={settings.twoFAEnabled ? "✓ Compte sécurisé par 2FA" : "Ajouter une couche de sécurité"} color="#39ff14"
            right={<Toggle checked={settings.twoFAEnabled} onChange={v => { set("twoFAEnabled", v); toast({ title: v ? "✓ 2FA activée" : "2FA désactivée", description: v ? "Votre compte est mieux protégé." : "Authentification à 2 facteurs désactivée." }); }} color="#39ff14" />} />
          <Row icon={<AlertTriangle className="w-4 h-4" />} label="Alertes de connexion" sublabel="Notification à chaque nouvelle connexion" color="#39ff14"
            right={<Toggle checked={settings.loginAlerts} onChange={v => { set("loginAlerts", v); toast({ title: v ? "✓ Alertes activées" : "Alertes désactivées" }); }} color="#39ff14" />} />
        </Card>
        <Card>
          <CardLabel label="Historique de sécurité" />
          <Row icon={<Activity className="w-4 h-4" />} label="Activité de connexion" sublabel="Voir les connexions récentes" onClick={() => toast({ title: "Activité récente", description: `Dernière connexion : ${new Date().toLocaleDateString("fr-FR")} depuis navigateur web.` })} color="#39ff14" />
          <Row icon={<Key className="w-4 h-4" />} label="Applications connectées" sublabel="Aucune app tierce connectée" onClick={() => toast({ title: "Applications connectées", description: "Aucune application tierce n'a accès à votre compte." })} color="#39ff14" />
        </Card>
      </div>
    );

    if (section === "appearance") return (
      <div className="space-y-4">
        <Card>
          <CardLabel label="Thème" />
          <Row icon={<Moon className="w-4 h-4" />} label="Mode sombre" sublabel={settings.darkMode ? "Interface cyberpunk noire activée" : "Mode clair (non recommandé pour PlayQuest)"} color="#9900ff"
            right={<Toggle checked={settings.darkMode} onChange={v => { set("darkMode", v); toast({ title: v ? "Mode sombre activé" : "Mode clair activé", description: "Le changement sera visible au prochain rechargement." }); }} color="#9900ff" />} />
        </Card>
        <Card>
          <CardLabel label="Langue" />
          <Row icon={<Languages className="w-4 h-4" />} label="Français" sublabel="Langue actuelle de l'interface" color="#9900ff" right={<span className="text-xs font-bold" style={{ color: "#9900ff" }}>✓ Actif</span>} />
          <Row icon={<Globe className="w-4 h-4" />} label="English" sublabel="Interface en anglais (bientôt)" color="#9900ff" onClick={() => toast({ title: "Langue", description: "L'anglais sera disponible dans une prochaine version." })} />
        </Card>
      </div>
    );

    if (section === "help") return (
      <div className="space-y-4">
        <Card>
          <Row icon={<AlertTriangle className="w-4 h-4" />} label="Signaler un problème" sublabel="Nous aider à améliorer PlayQuest" onClick={() => toast({ title: "Signalement envoyé", description: "Merci ! Notre équipe va analyser votre rapport sous 48h." })} color="#e8102a" />
          <Row icon={<HelpCircle className="w-4 h-4" />} label="Centre d'aide" sublabel="FAQ et guides d'utilisation" onClick={() => toast({ title: "Centre d'aide", description: "Disponible sur play-quest-reseauxsociaux.vercel.app" })} color="#00c8ff" />
          <Row icon={<Mail className="w-4 h-4" />} label="Contacter le support" sublabel="varnoxnovark@gmail.com" onClick={() => window.open("mailto:varnoxnovark@gmail.com", "_blank")} color="#00c8ff" />
        </Card>
        <Card>
          <Row icon={<Globe className="w-4 h-4" />} label="Politique de confidentialité" onClick={() => toast({ title: "Politique", description: "Vos données sont stockées uniquement sur votre appareil via localStorage." })} color="#00c8ff" />
          <Row icon={<Info className="w-4 h-4" />} label="Conditions d'utilisation" onClick={() => toast({ title: "CGU PlayQuest 2026", description: "Usage personnel uniquement. Contenu légal requis. Propriété de varnox•prime." })} color="#00c8ff" />
        </Card>
      </div>
    );

    if (section === "about") return (
      <div className="space-y-4">
        <Card>
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 32px rgba(232,16,42,0.5)" }}>
              <span className="text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>P</span>
            </div>
            <h3 className="text-2xl font-black mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PlayQuest</h3>
            <p className="text-sm text-[#e8e8f0]/35 mb-0.5">Version 2.0.0 — Juillet 2026</p>
            <p className="text-xs" style={{ color: "#00c8ff" }}>by varnox•prime</p>
          </div>
        </Card>
        <Card>
          <Row icon={<Info className="w-4 h-4" />} label="Version" sublabel="2.0.0 (Build 2026.07)" color="#e8e8f0" right={<span className="text-xs text-[#e8e8f0]/30">2.0.0</span>} />
          <Row icon={<Globe className="w-4 h-4" />} label="Site web" sublabel="play-quest-reseauxsociaux.vercel.app" onClick={() => window.open("https://play-quest-reseauxsociaux.vercel.app", "_blank")} color="#00c8ff" />
          <Row icon={<Heart className="w-4 h-4" />} label="Développé avec ❤️" sublabel="React + Vite + Framer Motion + TailwindCSS v4" color="#e8102a" right={<span className="text-xs text-[#e8102a]/50">varnox•prime</span>} />
        </Card>
        <p className="text-center text-[10px] text-[#e8e8f0]/15 pb-2">✦ 2026 PlayQuest by varnox•prime</p>
      </div>
    );

    return null;
  };

  return (
    <Layout>
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#0a0a0f 0%,#0d0d18 100%)" }}>
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-28">
          <AnimatePresence mode="wait">
            {!section ? (
              <motion.div key="menu" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-black" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Paramètres</h1>
                  <p className="text-[#e8e8f0]/32 text-xs mt-0.5">Compte & préférences</p>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} onClick={() => setSection("profile")} className="flex items-center gap-4 p-4 rounded-2xl mb-5 cursor-pointer" style={{ background: "rgba(14,14,22,0.92)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {avatarUrl
                    ? <img src={avatarUrl} className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${currentUser?.avatarColor || "#e8102a"}` }} alt="" />
                    : <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: currentUser?.avatarColor || "#e8102a", boxShadow: `0 0 20px ${currentUser?.avatarColor || "#e8102a"}50` }}>{initials}</div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#e8e8f0] truncate">{currentUser?.displayName || currentUser?.username}</p>
                    <p className="text-sm text-[#e8e8f0]/38">@{currentUser?.username}</p>
                    {currentUser?.bio && <p className="text-xs text-[#e8e8f0]/28 mt-0.5 truncate">{currentUser.bio}</p>}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: "#00c8ff" }}>
                    <Edit3 className="w-3.5 h-3.5" /> Modifier
                  </div>
                </motion.div>

                <Card>
                  {SECTIONS.slice(0, 6).map(s => (
                    <Row key={s.id} icon={s.icon} label={s.label} onClick={() => setSection(s.id)} color={s.color} />
                  ))}
                </Card>
                <Card>
                  {SECTIONS.slice(6).map(s => (
                    <Row key={s.id} icon={s.icon} label={s.label} onClick={() => setSection(s.id)} color={s.color} />
                  ))}
                </Card>
                <Card>
                  <Row icon={<LogOut className="w-4 h-4" />} label="Se déconnecter" sublabel={`Connecté en tant que @${currentUser?.username}`} onClick={() => { logout(); navigate("/login"); }} danger />
                </Card>
              </motion.div>
            ) : (
              <motion.div key={section} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.22 }}>
                <div className="flex items-center gap-3 mb-6">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setSection(null); setPwdError(""); setPwdSuccess(false); }} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <ChevronRight className="w-5 h-5 text-[#e8e8f0]/50 rotate-180" />
                  </motion.button>
                  <h1 className="text-lg font-black" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {SECTIONS.find(s => s.id === section)?.label}
                  </h1>
                </div>
                {renderSection()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
