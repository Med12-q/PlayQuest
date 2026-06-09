import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Compass, MessageCircle, Bell, Settings, Zap, LogOut, Film, Music, Bot, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { store } from "@/lib/store";
import { UserAvatar } from "@/components/UserAvatar";

const navItems = [
  { icon: Home,            label: "Accueil",        path: "/feed",          color: "#e8102a" },
  { icon: LayoutDashboard, label: "Dashboard",       path: "/dashboard",     color: "#00c8ff" },
  { icon: Film,            label: "Reels",           path: "/reels",         color: "#e8102a" },
  { icon: Music,           label: "Musique",         path: "/music",         color: "#00c8ff" },
  { icon: Compass,         label: "Explorer",        path: "/explore",       color: "#39ff14" },
  { icon: MessageCircle,   label: "Messages",        path: "/messages",      color: "#ff9900" },
  { icon: Bell,            label: "Notifications",   path: "/notifications", color: "#e8102a" },
  { icon: Bot,             label: "LYRA IA",         path: "/ai",            color: "#9900ff" },
  { icon: Settings,        label: "Paramètres",      path: "/settings",      color: "#e8e8f0" },
];

const mobileNav = [
  { icon: Home,            path: "/feed",       color: "#e8102a" },
  { icon: Film,            path: "/reels",      color: "#e8102a" },
  { icon: LayoutDashboard, path: "/dashboard",  color: "#00c8ff" },
  { icon: MessageCircle,   path: "/messages",   color: "#ff9900" },
  { icon: Bot,             path: "/ai",         color: "#9900ff" },
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
    location === path || (path !== "/feed" && path !== "/dashboard" && location.startsWith(path));

  return (
    <div className="min-h-screen bg-[#06060d] flex">
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 z-50"
        style={{
          background: "rgba(8,8,14,0.96)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Logo */}
        <Link to="/feed">
          <div className="flex items-center gap-2.5 px-5 py-5 hover:opacity-90 transition-opacity">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 16px rgba(232,16,42,0.45)" }}
            >
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span
              className="text-base font-bold"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                letterSpacing: "-0.3px",
                background: "linear-gradient(135deg,#e8102a,#00c8ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PlayQuest
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, path, color }) => {
            const active = isActive(path);
            const badge = getBadge(path);
            return (
              <Link key={path} to={path}>
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl relative cursor-pointer transition-all duration-200 group"
                  style={{
                    background: active ? `${color}12` : "transparent",
                    color: active ? color : "rgba(232,232,240,0.38)",
                  }}
                >
                  {active && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
                      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                    />
                  )}
                  <Icon
                    className="w-4 h-4 flex-shrink-0 transition-all"
                    strokeWidth={active ? 2.3 : 1.8}
                  />
                  <span className="text-[13px] font-medium leading-none">{label}</span>

                  {path === "/ai" && !active && (
                    <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(153,0,255,0.15)", color: "#9900ff" }}>AI</span>
                  )}
                  {badge > 0 && (
                    <span className="ml-auto text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full min-w-[16px] text-center" style={{ background: "#e8102a" }}>
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Profile section */}
        {currentUser && (
          <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <Link to={`/profile/${currentUser.username}`}>
              <motion.div whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }} className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer mb-1 transition-all">
                <UserAvatar user={currentUser} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#e8e8f0] truncate">@{currentUser.username}</p>
                  <p className="text-[10px] text-[#e8e8f0]/28 truncate">{currentUser.bio || "Membre PlayQuest"}</p>
                </div>
              </motion.div>
            </Link>
            <motion.button
              onClick={logout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-xl text-xs font-semibold transition-all mt-1"
              style={{ background: "rgba(232,16,42,0.1)", color: "rgba(232,16,42,0.7)", border: "1px solid rgba(232,16,42,0.15)" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(232,16,42,0.18)"; el.style.color = "#e8102a"; el.style.borderColor = "rgba(232,16,42,0.35)"; el.style.boxShadow = "0 0 16px rgba(232,16,42,0.15)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(232,16,42,0.1)"; el.style.color = "rgba(232,16,42,0.7)"; el.style.borderColor = "rgba(232,16,42,0.15)"; el.style.boxShadow = "none"; }}
            >
              <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Se déconnecter</span>
            </motion.button>
          </div>
        )}
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 md:ml-56 pb-16 md:pb-0 min-h-screen page-enter">
        {children}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-14"
        style={{
          background: "rgba(8,8,14,0.98)",
          backdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {mobileNav.map(({ icon: Icon, path, color }) => {
          const active = isActive(path);
          const badge = getBadge(path);
          return (
            <Link key={path} to={path}>
              <div className="relative flex flex-col items-center justify-center w-12 h-12">
                <Icon
                  className="w-5 h-5"
                  strokeWidth={active ? 2.3 : 1.7}
                  style={{
                    color: active ? color : "rgba(232,232,240,0.35)",
                    filter: active ? `drop-shadow(0 0 6px ${color}99)` : "none",
                  }}
                />
                {active && (
                  <motion.div layoutId="mobile-tab-indicator" className="absolute bottom-1 w-4 h-0.5 rounded-full" style={{ background: color }} />
                )}
                {badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 text-[8px] font-bold text-white w-3.5 h-3.5 flex items-center justify-center rounded-full" style={{ background: "#e8102a" }}>
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
        {currentUser && (
          <Link to={`/profile/${currentUser.username}`}>
            <motion.div whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-full overflow-hidden" style={{ boxShadow: location.startsWith("/profile") ? `0 0 12px ${currentUser.avatarColor}` : "none" }}>
              <UserAvatar user={currentUser} size="sm" />
            </motion.div>
          </Link>
        )}
      </nav>
    </div>
  );
}
