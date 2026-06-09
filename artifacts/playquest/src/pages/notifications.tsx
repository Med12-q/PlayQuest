import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, UserPlus, AtSign, Bell, CheckCheck, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, Notification } from "@/lib/store";
import { formatTimeAgo } from "@/lib/utils";
import { UserAvatar } from "@/components/UserAvatar";

const notifConfig: Record<string, { icon: typeof Heart; color: string; bg: string; label: string }> = {
  like:    { icon: Heart,          color: "#e8102a", bg: "rgba(232,16,42,0.12)",   label: "a aimé votre publication" },
  comment: { icon: MessageCircle,  color: "#00c8ff", bg: "rgba(0,200,255,0.12)",   label: "a commenté votre publication" },
  follow:  { icon: UserPlus,       color: "#39ff14", bg: "rgba(57,255,20,0.12)",   label: "a commencé à vous suivre" },
  mention: { icon: AtSign,         color: "#ff9900", bg: "rgba(255,153,0,0.12)",   label: "vous a mentionné" },
};

export default function NotificationsPage() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const loadNotifs = () => {
    if (currentUser) setNotifications(store.getNotifications(currentUser.id));
  };

  useEffect(() => { loadNotifs(); }, [currentUser]);

  const markAllRead = () => {
    if (!currentUser) return;
    store.markAllRead(currentUser.id);
    loadNotifs();
  };

  const visible = filter === "unread" ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#06060d 0%,#080812 100%)" }}>
        <div className="max-w-xl mx-auto px-4 py-5 pb-24">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Notifications</h1>
              {unreadCount > 0 && (
                <div className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white" style={{ background: "#e8102a", boxShadow: "0 0 10px rgba(232,16,42,0.6)" }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </div>
            {unreadCount > 0 && (
              <motion.button whileTap={{ scale: 0.93 }} onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl" style={{ background: "rgba(0,200,255,0.08)", color: "#00c8ff", border: "1px solid rgba(0,200,255,0.2)" }}>
                <CheckCheck className="w-3.5 h-3.5" /> Tout lire
              </motion.button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: "rgba(255,255,255,0.03)" }}>
            {(["all", "unread"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all" style={{ background: filter === f ? "rgba(232,16,42,0.12)" : "transparent", color: filter === f ? "#e8102a" : "rgba(232,232,240,0.35)" }}>
                {f === "all" ? "Toutes" : `Non lues (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* Notif list */}
          <div className="space-y-1.5">
            {visible.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(232,16,42,0.08)", border: "1px solid rgba(232,16,42,0.15)" }}>
                  <Bell className="w-6 h-6 text-[#e8102a]/50" />
                </div>
                <p className="text-[#e8e8f0]/35 font-medium">
                  {filter === "unread" ? "Tout est lu ✦" : "Aucune notification"}
                </p>
                <p className="text-[#e8e8f0]/20 text-xs mt-1.5">Votre activité apparaîtra ici</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {visible.map((notif, i) => {
                  const conf = notifConfig[notif.type] || notifConfig.like;
                  const IconComponent = conf.icon;
                  const sender = store.getUserById(notif.fromUserId);

                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all"
                      style={{ background: notif.read ? "rgba(255,255,255,0.025)" : "rgba(232,16,42,0.05)", border: `1px solid ${notif.read ? "rgba(255,255,255,0.03)" : "rgba(232,16,42,0.12)"}` }}
                    >
                      {/* Avatar with icon overlay */}
                      <div className="relative flex-shrink-0">
                        {sender ? (
                          <div className="p-[2px] rounded-full" style={{ background: `linear-gradient(135deg,${sender.avatarColor},#00c8ff)` }}>
                            <UserAvatar user={sender} size="md" style={{ border: "2px solid #06060d", boxShadow: "none" }} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: conf.bg }}>
                            <IconComponent className="w-5 h-5" style={{ color: conf.color }} />
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: conf.bg, border: "1.5px solid #06060d" }}>
                          <IconComponent className="w-2.5 h-2.5" style={{ color: conf.color }} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#e8e8f0]/85 leading-snug">
                          <span className="font-semibold text-[#e8e8f0]">@{sender?.username || "Quelqu'un"}</span>{" "}
                          <span style={{ color: conf.color }}>{conf.label}</span>
                        </p>
                        <p className="text-[11px] text-[#e8e8f0]/30 mt-0.5">{formatTimeAgo(notif.createdAt)}</p>
                      </div>

                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#e8102a", boxShadow: "0 0 6px rgba(232,16,42,0.7)" }} />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Activity overview */}
          {visible.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 rounded-2xl" style={{ background: "rgba(17,17,24,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-[10px] font-semibold text-[#e8e8f0]/35 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3 text-[#39ff14]" /> Résumé d'activité
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Heart, label: "J'aimes", count: notifications.filter(n => n.type === "like").length, color: "#e8102a" },
                  { icon: MessageCircle, label: "Commentaires", count: notifications.filter(n => n.type === "comment").length, color: "#00c8ff" },
                  { icon: UserPlus, label: "Abonnés", count: notifications.filter(n => n.type === "follow").length, color: "#39ff14" },
                ].map(({ icon: Icon, label, count, color }) => (
                  <div key={label} className="text-center p-2 rounded-xl" style={{ background: `${color}08` }}>
                    <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                    <p className="text-base font-bold" style={{ color }}>{count}</p>
                    <p className="text-[9px] text-[#e8e8f0]/30">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <p className="text-center text-[10px] text-[#e8e8f0]/12 mt-10 mb-4">✦ 2026 PlayQuest by varnox•prime</p>
        </div>
      </div>
    </Layout>
  );
}
