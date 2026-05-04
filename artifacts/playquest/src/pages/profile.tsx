import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Grid, Repeat2, Bookmark, UserPlus, UserCheck, Edit3 } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, User, Post } from "@/lib/store";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "reposts" | "saved">("posts");
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const u = store.getUserByUsername(params.username);
    if (u) {
      setUser(u);
      setPosts(store.getPostsByUser(u.id));
      setFollowersCount(u.followersCount);
      if (currentUser && currentUser.id !== u.id) {
        setFollowing(store.isFollowing(currentUser.id, u.id));
      }
    }
  }, [params.username, currentUser]);

  const toggleFollow = () => {
    if (!currentUser || !user) return;
    const newFollowing = store.toggleFollow(currentUser.id, user.id);
    setFollowing(newFollowing);
    setFollowersCount(prev => newFollowing ? prev + 1 : prev - 1);
  };

  if (!user) return (
    <Layout>
      <div className="flex items-center justify-center h-64 text-[#e8e8f0]/40">Utilisateur introuvable</div>
    </Layout>
  );

  const isOwn = currentUser?.id === user.id;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Cover */}
        <div className="h-40 md:h-56 relative" style={{ background: `linear-gradient(135deg, ${user.avatarColor}40, #0a0a0f)` }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, #0a0a0f)" }} />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        </div>

        {/* Profile info */}
        <div className="px-4 md:px-6 -mt-16 relative z-10 pb-6">
          <div className="flex items-end justify-between mb-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white border-4" style={{ background: user.avatarColor, boxShadow: `0 0 30px ${user.avatarColor}80`, borderColor: "#0a0a0f" }}>
              {getInitials(user.username)}
            </motion.div>
            <div>
              {isOwn ? (
                <a href="/settings" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", color: "#e8e8f0" }} data-testid="button-edit-profile">
                  <Edit3 className="w-4 h-4" /><span>Modifier</span>
                </a>
              ) : (
                <button onClick={toggleFollow} data-testid="button-follow-profile" className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all" style={{ background: following ? "rgba(0,200,255,0.1)" : "linear-gradient(135deg, #e8102a, #c8001f)", color: following ? "#00c8ff" : "white", border: following ? "1px solid rgba(0,200,255,0.3)" : "none", boxShadow: following ? "none" : "0 0 16px rgba(232,16,42,0.4)" }}>
                  {following ? <><UserCheck className="w-4 h-4" /> Suivi</> : <><UserPlus className="w-4 h-4" /> Suivre</>}
                </button>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-bold text-[#e8e8f0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>@{user.username}</h1>
            {user.bio && <p className="text-sm text-[#e8e8f0]/60 mt-1">{user.bio}</p>}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-6 p-4 rounded-2xl" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }}>
            {[
              { label: "Publications", value: posts.length },
              { label: "Abonnés", value: followersCount },
              { label: "Abonnements", value: user.followingCount },
            ].map(({ label, value }) => (
              <div key={label} className="flex-1 text-center">
                <p className="text-xl font-bold gradient-text">{value.toLocaleString()}</p>
                <p className="text-xs text-[#e8e8f0]/40">{label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            {[
              { id: "posts" as const, icon: Grid, label: "Posts" },
              { id: "reposts" as const, icon: Repeat2, label: "Reposts" },
              { id: "saved" as const, icon: Bookmark, label: "Sauvegardés" },
            ].map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setActiveTab(id)} data-testid={`tab-${id}`} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all" style={{ background: activeTab === id ? "rgba(232,16,42,0.15)" : "transparent", color: activeTab === id ? "#e8102a" : "rgba(232,232,240,0.4)", boxShadow: activeTab === id ? "0 0 10px rgba(232,16,42,0.15)" : "none" }}>
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {activeTab === "posts" && (
            posts.length === 0 ? (
              <div className="text-center py-12 text-[#e8e8f0]/30">
                <Grid className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Aucune publication</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {posts.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer" style={{ background: post.imageGradient }} data-testid={`card-profile-post-${post.id}`}>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-white text-[10px] line-clamp-2">{post.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}

          {activeTab === "reposts" && (
            <div className="text-center py-12 text-[#e8e8f0]/30">
              <Repeat2 className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Aucun repost</p>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="text-center py-12 text-[#e8e8f0]/30">
              <Bookmark className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Aucune sauvegarde</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
