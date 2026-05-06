import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Compass, MessageCircle, Bell, Settings, Zap, LogOut, Film, Music, Bot } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { store } from "@/lib/store";
import { getInitials } from "@/lib/utils";

const navItems = [
  { icon: Home,          label: "Accueil",     path: "/feed" },
  { icon: Film,          label: "Reels",       path: "/reels" },
  { icon: Music,         label: "Musique",     path: "/music" },
  { icon: Compass,       label: "Explorer",    path: "/explore" },
  { icon: MessageCircle, label: "Messages",    path: "/messages" },
  { icon: Bell,          label: "Notifications",path: "/notifications" },
  { icon: Bot,           label: "LYRA IA",     path: "/ai" },
  { icon: Settings,      label: "Paramètres",  path: "/settings" },
];

const mobileNav = [
  { icon: Home,          label: "Accueil",  path: "/feed" },
  { icon: Film,          label: "Reels",    path: "/reels" },
  { icon: Music,         label: "Musique",  path: "/music" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Bot,           label: "LYRA",     path: "/ai" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { currentUser, logout } = useAuth();
  const unreadNotifs = currentUser ? store.getUnreadCount(currentUser.id) : 0;
  const unreadMsgs = currentUser ? store.getUnreadMessages(currentUser.id) : 0;

  const getBadge = (path: string) => {
    if (path === "/notifications" && unreadNotifs > 0) return unreadNotifs;
    if (path === "/messages" && unreadMsgs > 0) return unreadMsgs;
    return 0;
  };

  const isActive = (path: string) =>
    location === path || (path !== "/feed" && location.startsWith(path));

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 z-50" style={{ background: "rgba(10,10,15,0.97)", backdropFilter: "blur(24px)", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
        {/* Logo */}
        <Link to="/feed" className="flex items-center gap-3 px-5 py-5 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #e8102a, #c8001f)", boxShadow: "0 0 16px rgba(232,16,42,0.4)" }}>
            <Zap className="w-4.5 h-4.5 text-white" fill="white" />
          </div>
          <span className="text-lg font-bold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.3px" }}>PlayQuest</span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, path }) => {
            const active = isActive(path);
            const badge = getBadge(path);
            const isAI = path === "/ai";
            return (
              <Link key={path} to={path}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl relative cursor-pointer transition-all"
                  style={{
                    background: active
                      ? isAI ? "rgba(0,200,255,0.08)" : "rgba(232,16,42,0.08)"
                      : "transparent",
                    color: active
                      ? isAI ? "#00c8ff" : "#e8102a"
                      : "rgba(232,232,240,0.45)",
                  }}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: isAI ? "#00c8ff" : "#e8102a", boxShadow: isAI ? "0 0 8px rgba(0,200,255,0.8)" : "0 0 8px rgba(232,16,42,0.8)" }} />
                  )}
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                  <span className="text-sm font-medium">{label}</span>
                  {isAI && !active && (
                    <span className="ml-auto text-[9px] font-bold px-1 py-0.5 rounded-full" style={{ background: "rgba(0,200,255,0.12)", color: "#00c8ff" }}>NEW</span>
                  )}
                  {badge > 0 && (
                    <span className="ml-auto text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center" style={{ background: "#e8102a", boxShadow: "0 0 8px rgba(232,16,42,0.5)" }}>
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Profile */}
        {currentUser && (
          <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <Link to={`/profile/${currentUser.username}`}>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer mb-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: currentUser.avatarColor }}>
                  {getInitials(currentUser.username)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#e8e8f0] truncate">@{currentUser.username}</p>
                  <p className="text-[10px] text-[#e8e8f0]/30 truncate">{currentUser.bio || "Membre PlayQuest"}</p>
                </div>
              </div>
            </Link>
            <button onClick={logout} className="flex items-center gap-2 px-2.5 py-2 w-full rounded-xl text-xs text-[#e8e8f0]/30 hover:text-[#e8102a] hover:bg-[#e8102a]/08 transition-all">
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-60 pb-16 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-14" style={{ background: "rgba(10,10,15,0.98)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        {mobileNav.map(({ icon: Icon, path }) => {
          const active = isActive(path);
          const badge = getBadge(path);
          const isAI = path === "/ai";
          return (
            <Link key={path} to={path}>
              <div className="relative flex flex-col items-center justify-center w-12 h-12">
                <Icon
                  className="w-5 h-5"
                  strokeWidth={active ? 2.2 : 1.7}
                  style={{
                    color: active ? (isAI ? "#00c8ff" : "#e8102a") : "rgba(232,232,240,0.4)",
                    filter: active ? `drop-shadow(0 0 6px ${isAI ? "rgba(0,200,255,0.7)" : "rgba(232,16,42,0.7)"})` : "none",
                  }}
                />
                {badge > 0 && (
                  <span className="absolute top-1 right-1 text-[9px] font-bold text-white w-4 h-4 flex items-center justify-center rounded-full" style={{ background: "#e8102a" }}>
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
                {isAI && !active && (
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00c8ff]" style={{ boxShadow: "0 0 4px rgba(0,200,255,0.8)" }} />
                )}
              </div>
            </Link>
          );
        })}
        {currentUser && (
          <Link to={`/profile/${currentUser.username}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: currentUser.avatarColor, boxShadow: location.startsWith("/profile") ? `0 0 10px ${currentUser.avatarColor}` : "none" }}>
              {getInitials(currentUser.username)}
            </div>
          </Link>
        )}
      </nav>
    </div>
  );
}
