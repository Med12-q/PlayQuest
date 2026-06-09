import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, UserPlus, UserCheck, Heart, MessageCircle, X, Compass, Fire } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, Post, User } from "@/lib/store";
import { UserAvatar } from "@/components/UserAvatar";

function Fire2({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-4.97 0-9-4.03-9-9 0-4.17 2.65-7.73 6.39-9.07C9.03 7.56 9 11 9 11s2-1.5 2-4.5c0-1.46-.49-2.79-1.3-3.85C11.37 2.23 13.5 2 13.5 2c-.83 1.18-1 2.81-1 3.82C12.5 8.72 15 10 15 14c.95-1.05 1.5-2.43 1.5-3.93 0-.71-.13-1.39-.37-2.02C18.19 9.47 21 13.1 21 17.5c0 3.04-3.58 5.5-9 5.5z"/></svg>;
}

const TRENDING = [
  { tag: "#PlayQuest", count: "12.4K", color: "#e8102a" },
  { tag: "#varnoxprime", count: "8.9K", color: "#00c8ff" },
  { tag: "#NeonVibes", count: "5.6K", color: "#9900ff" },
  { tag: "#DevLife", count: "4.2K", color: "#ff9900" },
  { tag: "#Cyberpunk2026", count: "3.8K", color: "#39ff14" },
  { tag: "#TypeScript", count: "2.9K", color: "#00c8ff" },
  { tag: "#UIDesign", count: "2.1K", color: "#e8102a" },
  { tag: "#NightCoding", count: "1.7K", color: "#9900ff" },
];

function PostTile({ post, user }: { post: Post; user: User | undefined }) {
  const [hovered, setHovered] = useState(false);
  const bg = post.imageUrl || post.mediaUrl;
  const isVideo = post.mediaType === "video" && post.mediaUrl?.includes("youtube");

  return (
    <motion.div
      whileHover={{ scale: 1.02, zIndex: 10 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="aspect-square rounded-xl overflow-hidden relative cursor-pointer group"
      style={{ background: post.imageGradient || `linear-gradient(135deg,${user?.avatarColor || "#e8102a"}40,rgba(0,200,255,0.15))` }}
    >
      {bg && !isVideo && (
        <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
      )}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(232,16,42,0.8)" }}>
            <svg className="w-4 h-4 text-white fill-white ml-0.5" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
        </div>
      )}
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: "rgba(0,0,0,0.68)", backdropFilter: "blur(2px)" }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-white">
                <Heart className="w-4 h-4 fill-white" />
                <span className="text-sm font-bold">{post.likesCount >= 1000 ? `${(post.likesCount / 1000).toFixed(1)}k` : post.likesCount}</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <MessageCircle className="w-4 h-4 fill-white" />
                <span className="text-sm font-bold">{post.commentsCount}</span>
              </div>
            </div>
            <p className="text-white text-[10px] px-3 text-center line-clamp-2 leading-tight opacity-80">{post.content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function UserCard({ user, currentUserId }: { user: User; currentUserId?: string }) {
  const [following, setFollowing] = useState(currentUserId ? store.isFollowing(currentUserId, user.id) : false);
  const toggleFollow = () => {
    if (!currentUserId) return;
    store.toggleFollow(currentUserId, user.id);
    setFollowing(!following);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-3.5 rounded-2xl" style={{ background: "rgba(17,17,24,0.7)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <Link to={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="p-[2px] rounded-full flex-shrink-0" style={{ background: `linear-gradient(135deg,${user.avatarColor},#00c8ff)` }}>
          <UserAvatar user={user} size="md" style={{ border: "2px solid #06060d", boxShadow: "none" }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#e8e8f0] truncate">@{user.username}</p>
          <p className="text-xs text-[#e8e8f0]/40 truncate">{user.bio || `${user.followersCount.toLocaleString()} abonnés`}</p>
        </div>
      </Link>
      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={toggleFollow} className="ml-3 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0" style={{ background: following ? "rgba(0,200,255,0.08)" : "linear-gradient(135deg,#e8102a,#c8001f)", color: following ? "#00c8ff" : "white", border: following ? "1px solid rgba(0,200,255,0.25)" : "none", boxShadow: following ? "none" : "0 0 12px rgba(232,16,42,0.3)" }}>
        {following ? <><UserCheck className="w-3 h-3" /> Suivi</> : <><UserPlus className="w-3 h-3" /> Suivre</>}
      </motion.button>
    </motion.div>
  );
}

export default function ExplorePage() {
  const { currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"discover" | "trending" | "people">("discover");

  useEffect(() => {
    setPosts(store.getPosts().slice(0, 30));
    setUsers(store.getUsers().filter(u => u.id !== currentUser?.id));
  }, [currentUser]);

  const filtered = query.trim()
    ? {
        posts: posts.filter(p => p.content.toLowerCase().includes(query.toLowerCase()) || p.hashtags?.some(h => h.toLowerCase().includes(query.toLowerCase().replace("#", "")))),
        users: users.filter(u => u.username.toLowerCase().includes(query.toLowerCase()) || u.bio?.toLowerCase().includes(query.toLowerCase())),
      }
    : null;

  return (
    <Layout>
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#06060d 0%,#080812 100%)" }}>
        <div className="max-w-2xl mx-auto px-4 py-5 pb-24">

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e8e8f0]/30" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher des posts, #hashtags, @profils…"
                className="w-full pl-10 pr-10 py-3 rounded-2xl text-sm text-[#e8e8f0] placeholder:text-[#e8e8f0]/30 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-[#e8e8f0]/40" />
                </button>
              )}
            </div>
          </div>

          {/* Search results */}
          {filtered ? (
            <div className="space-y-5">
              {filtered.users.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#e8e8f0]/40 uppercase tracking-wider mb-3">Profils</p>
                  <div className="space-y-2">
                    {filtered.users.map(u => <UserCard key={u.id} user={u} currentUserId={currentUser?.id} />)}
                  </div>
                </div>
              )}
              {filtered.posts.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#e8e8f0]/40 uppercase tracking-wider mb-3">Publications</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {filtered.posts.map(p => <PostTile key={p.id} post={p} user={store.getUserById(p.userId)} />)}
                  </div>
                </div>
              )}
              {filtered.users.length === 0 && filtered.posts.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-10 h-10 mx-auto mb-3 text-[#e8e8f0]/15" />
                  <p className="text-sm text-[#e8e8f0]/30">Aucun résultat pour « {query} »</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                {([
                  { id: "discover" as const, label: "Découvrir", icon: Compass },
                  { id: "trending" as const, label: "Tendances", icon: TrendingUp },
                  { id: "people" as const, label: "Personnes", icon: UserPlus },
                ] as const).map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all" style={{ background: activeTab === id ? "rgba(232,16,42,0.12)" : "transparent", color: activeTab === id ? "#e8102a" : "rgba(232,232,240,0.35)" }}>
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </div>

              {/* Discover — Instagram-style grid */}
              {activeTab === "discover" && (
                <div>
                  {/* Featured post */}
                  {posts[0] && (
                    <div className="mb-3 rounded-2xl overflow-hidden relative" style={{ height: "280px", background: posts[0].imageGradient || "linear-gradient(135deg,#e8102a,#00c8ff)" }}>
                      {(posts[0].imageUrl || posts[0].mediaUrl) && posts[0].mediaType !== "video" && (
                        <img src={posts[0].imageUrl || posts[0].mediaUrl} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      )}
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          {store.getUserById(posts[0].userId) && (
                            <>
                              <UserAvatar user={store.getUserById(posts[0].userId)!} size="xs" />
                              <span className="text-white text-xs font-semibold">@{store.getUserById(posts[0].userId)?.username}</span>
                            </>
                          )}
                          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(232,16,42,0.8)", color: "white" }}>
                            🔥 Featured
                          </span>
                        </div>
                        <p className="text-white/80 text-xs line-clamp-2">{posts[0].content}</p>
                      </div>
                    </div>
                  )}
                  {/* Grid */}
                  <div className="grid grid-cols-3 gap-1">
                    {posts.slice(1).map((p, i) => {
                      const isWide = i % 7 === 2;
                      if (isWide) {
                        return (
                          <div key={p.id} className="col-span-2">
                            <PostTile post={p} user={store.getUserById(p.userId)} />
                          </div>
                        );
                      }
                      return <PostTile key={p.id} post={p} user={store.getUserById(p.userId)} />;
                    })}
                  </div>
                </div>
              )}

              {/* Trending */}
              {activeTab === "trending" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {TRENDING.map(({ tag, count, color }, i) => (
                      <motion.div key={tag} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.03 }} className="p-4 rounded-2xl cursor-pointer" style={{ background: "rgba(17,17,24,0.7)", border: `1px solid ${color}20` }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <TrendingUp className="w-3.5 h-3.5" style={{ color }} />
                          <span className="text-[11px] text-[#e8e8f0]/40">Tendance</span>
                        </div>
                        <p className="font-bold text-[#e8e8f0] text-sm" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{tag}</p>
                        <p className="text-[11px] mt-0.5" style={{ color }}>{count} posts</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* People */}
              {activeTab === "people" && (
                <div className="space-y-2">
                  <p className="text-xs text-[#e8e8f0]/35 mb-3">Suggestions pour vous</p>
                  {users.map(u => <UserCard key={u.id} user={u} currentUserId={currentUser?.id} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
