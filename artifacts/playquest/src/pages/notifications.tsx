import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, UserPlus, AtSign, Bell, CheckCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, Notification } from "@/lib/store";
import { getInitials, formatTimeAgo } from "@/lib/utils";

const notifIcons: Record<string, { icon: typeof Heart; color: string }> = {
  like: { icon: Heart, color: "#e8102a" },
  comment: { icon: MessageCircle, color: "#00c8ff" },
  follow: { icon: UserPlus, color: "#39ff14" },
  mention: { icon: AtSign, color: "#ff9900" },
};

const notifLabels: Record<string, string> = {
  like: "a aimé votre publication",
  comment: "a commenté votre publication",
  follow: "a commencé à vous suivre",
  mention: "vous a mentionné",
};

export default function NotificationsPage() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifs = () => {
    if (currentUser) setNotifications(store.getNotifications(currentUser.id));
  };

  useEffect(() => { loadNotifs(); }, [currentUser]);

  const markAllRead = () => {
    if (!currentUser) return;
    store.markAllRead(currentUser.id);
    loadNotifs();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Notifications</h1>
            {unreadCount > 0 && <p className="text-xs text-[#e8102a] mt-0.5">{unreadCount} non lu{unreadCount > 1 ? "es" : ""}</p>}
          </div>
          {unreadCount > 0 && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={markAllRead} data-testid="button-mark-all-read" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#00c8ff] transition-all" style={{ background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.2)" }}>
              <CheckCheck className="w-3.5 h-3.5" />
              Tout marquer lu
            </motion.button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#e8e8f0]/30">
            <Bell className="w-16 h-16 mb-4" />
            <p className="text-sm">Aucune notification</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif, i) => {
              const fromUser = store.getUserById(notif.fromUserId);
              const { icon: Icon, color } = notifIcons[notif.type] || notifIcons.like;
              const label = notifLabels[notif.type] || "a interagi avec vous";
              return (
                <motion.div key={notif.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} data-testid={`notification-${notif.id}`} className="flex items-center gap-3 p-4 rounded-xl transition-all relative" style={{ background: notif.read ? "rgba(17,17,24,0.4)" : "rgba(17,17,24,0.9)", border: `1px solid ${notif.read ? "rgba(0,200,255,0.05)" : "rgba(0,200,255,0.12)"}` }}>
                  {!notif.read && <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: "#e8102a", boxShadow: "0 0 6px rgba(232,16,42,0.8)" }} />}
                  <div className="relative flex-shrink-0 ml-2">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: fromUser?.avatarColor || "#666", boxShadow: `0 0 10px ${fromUser?.avatarColor || "#666"}60` }}>
                      {getInitials(fromUser?.username || "?")}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: color, boxShadow: `0 0 6px ${color}` }}>
                      <Icon className="w-2.5 h-2.5 text-white" fill="white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#e8e8f0]">
                      <span className="font-semibold">@{fromUser?.username || "?"}</span>
                      <span className="text-[#e8e8f0]/60"> {label}</span>
                    </p>
                    <p className="text-xs text-[#e8e8f0]/40 mt-0.5">{formatTimeAgo(notif.createdAt)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
