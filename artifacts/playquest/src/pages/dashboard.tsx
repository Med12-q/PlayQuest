import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { TrendingUp, Heart, Users, FileText, MessageCircle, Bell, Film, Music, Bot, ArrowRight, Zap, Activity, Eye, Star, BarChart2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store } from "@/lib/store";
import { getInitials, formatTimeAgo } from "@/lib/utils";

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 100}%` }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="w-full rounded-t-sm min-h-[3px]"
            style={{ background: v === max ? color : `${color}55`, boxShadow: v === max ? `0 0 8px ${color}` : "none" }}
          />
          <span className="text-[8px] text-[#e8e8f0]/30">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, chart }: { icon: any; label: string; value: string | number; sub: string; color: string; chart?: number[] }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="p-5 rounded-2xl relative overflow-hidden" style={{ background: "rgba(12,12,20,0.9)", border: `1px solid ${color}22`, backdropFilter: "blur(16px)" }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl pointer-events-none" style={{ background: `${color}15`, transform: "translate(30%,-30%)" }} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-black" style={{ fontFamily: "'Space Grotesk',sans-serif", color }}>{value}</p>
            <p className="text-[10px] text-[#e8e8f0]/35">{sub}</p>
          </div>
        </div>
        <p className="text-xs font-medium text-[#e8e8f0]/55 mb-3">{label}</p>
        {chart && <MiniBarChart data={chart} color={color} />}
      </div>
    </motion.div>
  );
}

const quickLinks = [
  { icon: Film, label: "Reels", path: "/reels", color: "#e8102a", desc: "Vidéos tendance" },
  { icon: Music, label: "Musique", path: "/music", color: "#00c8ff", desc: "Streaming live" },
  { icon: MessageCircle, label: "Messages", path: "/messages", color: "#ff9900", desc: "Conversations" },
  { icon: Bot, label: "LYRA IA", path: "/ai", color: "#9900ff", desc: "Assistante vocale" },
];

const aiTips = [
  "💡 Poste entre 18h et 22h pour maximiser ton engagement",
  "🎯 Les posts avec images reçoivent 3x plus de likes",
  "🔥 Utilise des hashtags populaires pour plus de visibilité",
  "✦ Les stories du matin boostent ton profil de 40%",
  "🎵 Partage ta musique préférée pour créer des liens",
];

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const userPosts = store.getPostsByUser(currentUser.id);
    setPosts(userPosts.length);
    setFollowers(currentUser.followersCount);
    const likes = store.getLikes().filter(l => userPosts.some(p => p.id === l.postId)).length;
    setTotalLikes(likes + userPosts.reduce((s, p) => s + p.likesCount, 0));
    setNotifications(store.getUnreadCount(currentUser.id));
    const notifs = store.getNotifications(currentUser.id).slice(0, 5);
    setRecentActivity(notifs);
  }, [currentUser]);

  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i + 1) % aiTips.length), 4000);
    return () => clearInterval(t);
  }, []);

  if (!currentUser) return null;

  // Fake activity data for the week
  const activityData = [2, 5, 3, 8, 4, 7, posts > 0 ? posts : 3];
  const likesData = [12, 34, 18, 55, 28, 44, totalLikes > 0 ? Math.min(totalLikes, 80) : 40];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bonjour" : "Bonsoir";

  return (
    <Layout>
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#06060d 0%,#0a0a14 100%)" }}>
        <div className="max-w-5xl mx-auto px-4 py-6 pb-24">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-[#e8e8f0]/35 mb-1 uppercase tracking-wider font-semibold">{greeting} 👋</p>
              <h1 className="text-2xl font-black" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                <span style={{ background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>@{currentUser.username}</span>
              </h1>
              <p className="text-xs text-[#e8e8f0]/35 mt-1">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white" style={{ background: currentUser.avatarColor, boxShadow: `0 0 20px ${currentUser.avatarColor}80` }}>
              {getInitials(currentUser.username)}
            </div>
          </motion.div>

          {/* AI Tip banner */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6 p-4 rounded-2xl flex items-center gap-3" style={{ background: "rgba(232,16,42,0.06)", border: "1px solid rgba(232,16,42,0.15)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 12px rgba(232,16,42,0.4)" }}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#e8102a] font-semibold uppercase tracking-wider mb-0.5">LYRA — Suggestion IA</p>
              <motion.p key={tipIdx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-sm text-[#e8e8f0]/70 truncate">{aiTips[tipIdx]}</motion.p>
            </div>
            <Link to="/ai">
              <button className="text-xs px-3 py-1.5 rounded-xl flex-shrink-0" style={{ background: "rgba(232,16,42,0.1)", color: "#e8102a", border: "1px solid rgba(232,16,42,0.2)" }}>
                Parler à LYRA →
              </button>
            </Link>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { icon: FileText, label: "Publications", value: posts, sub: "posts", color: "#e8102a", chart: activityData },
              { icon: Users, label: "Abonnés", value: followers.toLocaleString("fr"), sub: "followers", color: "#00c8ff", chart: [1,3,2,5,3,6,followers > 0 ? Math.min(followers/10,8) : 4].map(Math.round) },
              { icon: Heart, label: "Likes reçus", value: totalLikes.toLocaleString("fr"), sub: "total", color: "#9900ff", chart: likesData },
              { icon: Bell, label: "Notifications", value: notifications, sub: "non lues", color: "#ff9900", chart: [1,2,0,3,1,2,notifications] },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                <StatCard {...s} />
              </motion.div>
            ))}
          </div>

          {/* Quick links */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
            <p className="text-xs font-semibold text-[#e8e8f0]/40 uppercase tracking-wider mb-3">Accès rapide</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map((ql, i) => (
                <Link key={i} to={ql.path}>
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="p-4 rounded-2xl text-left transition-all" style={{ background: "rgba(12,12,20,0.9)", border: `1px solid ${ql.color}22`, backdropFilter: "blur(12px)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5" style={{ background: `${ql.color}18`, border: `1px solid ${ql.color}33` }}>
                      <ql.icon className="w-4.5 h-4.5" style={{ color: ql.color }} />
                    </div>
                    <p className="text-sm font-bold text-[#e8e8f0]">{ql.label}</p>
                    <p className="text-[11px] text-[#e8e8f0]/35">{ql.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Activity */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="p-5 rounded-2xl" style={{ background: "rgba(12,12,20,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#e8e8f0]">Activité récente</h3>
                  <p className="text-[11px] text-[#e8e8f0]/35">7 derniers jours</p>
                </div>
                <BarChart2 className="w-4 h-4 text-[#e8e8f0]/30" />
              </div>
              <MiniBarChart data={activityData} color="#e8102a" />
              <div className="mt-3 pt-3 border-t flex items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <TrendingUp className="w-3.5 h-3.5 text-[#39ff14]" />
                <p className="text-xs text-[#e8e8f0]/45">Ton activité est <span className="text-[#39ff14] font-semibold">en hausse</span> cette semaine</p>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }} className="p-5 rounded-2xl" style={{ background: "rgba(12,12,20,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#e8e8f0]">Dernières activités</h3>
                <Link to="/notifications" className="text-[10px] text-[#e8102a] hover:underline">Voir tout →</Link>
              </div>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-xs text-[#e8e8f0]/30 text-center py-4">Aucune activité récente</p>
                ) : recentActivity.slice(0,4).map((n, i) => {
                  const from = store.getUserById(n.fromUserId);
                  const icons: Record<string, any> = { like: Heart, comment: MessageCircle, follow: Users, mention: Zap };
                  const colors: Record<string, string> = { like: "#e8102a", comment: "#00c8ff", follow: "#39ff14", mention: "#ff9900" };
                  const Icon = icons[n.type] || Bell;
                  const color = colors[n.type] || "#e8102a";
                  const labels: Record<string, string> = { like: "a aimé ton post", comment: "a commenté", follow: "te suit maintenant", mention: "t'a mentionné" };
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: from?.avatarColor || "#444" }}>
                        {getInitials(from?.username || "?")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#e8e8f0]/70 truncate">
                          <span className="font-semibold text-[#e8e8f0]">@{from?.username}</span> {labels[n.type]}
                        </p>
                        <p className="text-[10px] text-[#e8e8f0]/30">{formatTimeAgo(n.createdAt)}</p>
                      </div>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                        <Icon className="w-3 h-3" style={{ color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Profile completion */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mt-4 p-5 rounded-2xl" style={{ background: "rgba(12,12,20,0.9)", border: "1px solid rgba(0,200,255,0.1)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#e8e8f0]">Complète ton profil</h3>
                <p className="text-[11px] text-[#e8e8f0]/35">Un profil complet attire plus de followers</p>
              </div>
              <p className="text-lg font-black" style={{ color: "#00c8ff" }}>{currentUser.bio ? "80%" : "60%"}</p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: currentUser.bio ? "80%" : "60%" }} transition={{ delay: 0.8, duration: 0.8 }} className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#e8102a,#00c8ff)", boxShadow: "0 0 8px rgba(0,200,255,0.5)" }} />
            </div>
            <div className="flex gap-2 mt-3">
              <Link to="/settings">
                <button className="text-xs px-3 py-1.5 rounded-xl" style={{ background: "rgba(0,200,255,0.08)", color: "#00c8ff", border: "1px solid rgba(0,200,255,0.2)" }}>
                  Améliorer mon profil →
                </button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}
