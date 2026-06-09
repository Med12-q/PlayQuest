import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Grid, Repeat2, Bookmark, UserPlus, UserCheck, Edit3, Heart, MessageCircle, TrendingUp, LayoutDashboard, Camera } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, User, Post } from "@/lib/store";
import { getInitials } from "@/lib/utils";
import { UserAvatar } from "@/components/UserAvatar";

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

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const { currentUser, updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "reposts" | "saved">("posts");
  const [followersCount, setFollowersCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const u = store.getUserByUsername(params.username);
    if (u) {
      setUser(u);
      const userPosts = store.getPostsByUser(u.id);
      setPosts(userPosts);
      setFollowersCount(u.followersCount);
      const likes = userPosts.reduce((s, p) => s + p.likesCount, 0);
      setTotalLikes(likes);
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser || !user) return;
    setUploadingPhoto(true);
    try {
      const compressed = await compressImage(file);
      const updated = { ...currentUser, avatarUrl: compressed };
      updateUser(updated);
      setUser(updated);
    } catch { /* ignore */ } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  if (!user) return (
    <Layout>
      <div className="flex items-center justify-center h-64 text-[#e8e8f0]/30 text-sm">Utilisateur introuvable</div>
    </Layout>
  );

  const isOwn = currentUser?.id === user.id;

  const stats = [
    { label: "Publications", value: posts.length },
    { label: "Abonnés", value: followersCount },
    { label: "Abonnements", value: user.followingCount },
    { label: "Likes reçus", value: totalLikes },
  ];

  return (
    <Layout>
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#06060d 0%,#080812 100%)" }}>
        {/* Cover banner */}
        <div className="h-40 md:h-52 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg,${user.avatarColor}30 0%,rgba(0,200,255,0.08) 50%,#06060d 100%)` }} />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-64 h-64 rounded-full blur-3xl top-0 left-1/4" style={{ background: `${user.avatarColor}20` }} />
            <div className="absolute w-48 h-48 rounded-full blur-3xl top-0 right-1/4" style={{ background: "rgba(0,200,255,0.08)" }} />
          </div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,transparent 40%,#06060d 100%)" }} />
        </div>

        <div className="max-w-2xl mx-auto px-4 -mt-14 relative z-10 pb-24">
          {/* Avatar + actions */}
          <div className="flex items-end justify-between mb-5">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300 }}>
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl p-0.5" style={{ background: `linear-gradient(135deg,${user.avatarColor},#00c8ff)`, boxShadow: `0 0 30px ${user.avatarColor}60` }}>
                  <UserAvatar
                    user={user}
                    size="xl"
                    square
                    className="w-full h-full"
                    style={{ boxShadow: "none" }}
                  />
                </div>
                {isOwn && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 14px rgba(232,16,42,0.5)", border: "2px solid #06060d" }}
                      title="Changer la photo"
                    >
                      {uploadingPhoto ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-3.5 h-3.5 text-white" />
                      )}
                    </motion.button>
                    <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </>
                )}
              </div>
            </motion.div>

            <div className="flex items-center gap-2 pb-1">
              {isOwn ? (
                <>
                  <Link to="/dashboard">
                    <motion.div whileHover={{ scale: 1.04 }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium" style={{ background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.2)", color: "#00c8ff" }}>
                      <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                    </motion.div>
                  </Link>
                  <Link to="/settings">
                    <motion.div whileHover={{ scale: 1.04 }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e8e8f0" }}>
                      <Edit3 className="w-3.5 h-3.5" /> Modifier
                    </motion.div>
                  </Link>
                </>
              ) : (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={toggleFollow} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: following ? "rgba(0,200,255,0.08)" : "linear-gradient(135deg,#e8102a,#c8001f)", color: following ? "#00c8ff" : "white", border: following ? "1px solid rgba(0,200,255,0.25)" : "none", boxShadow: following ? "none" : "0 0 20px rgba(232,16,42,0.35)" }}>
                  {following ? <><UserCheck className="w-4 h-4" /> Suivi</> : <><UserPlus className="w-4 h-4" /> Suivre</>}
                </motion.button>
              )}
            </div>
          </div>

          {/* Identity */}
          <div className="mb-5">
            <h1 className="text-2xl font-black text-[#e8e8f0] mb-0.5" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>@{user.username}</h1>
            {user.bio && <p className="text-sm text-[#e8e8f0]/55 leading-relaxed mt-1.5">{user.bio}</p>}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14]" style={{ boxShadow: "0 0 5px rgba(57,255,20,0.8)" }} />
                <span className="text-[11px] text-[#39ff14]">En ligne</span>
              </div>
              <span className="text-[11px] text-[#e8e8f0]/25">• Membre PlayQuest 2026</span>
            </div>
            {isOwn && !user.avatarUrl && (
              <button
                onClick={() => photoInputRef.current?.click()}
                className="mt-3 flex items-center gap-1.5 text-xs text-[#00c8ff]/60 hover:text-[#00c8ff] transition-colors"
              >
                <Camera className="w-3.5 h-3.5" /> Ajouter une photo de profil
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {stats.map(({ label, value }) => (
              <motion.div key={label} whileHover={{ scale: 1.04 }} className="text-center p-3 rounded-2xl" style={{ background: "rgba(11,11,18,0.9)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <p className="text-xl font-black mb-0.5" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {value.toLocaleString("fr-FR")}
                </p>
                <p className="text-[9px] text-[#e8e8f0]/35 leading-tight">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            {[
              { id: "posts" as const, icon: Grid, label: "Posts" },
              { id: "reposts" as const, icon: Repeat2, label: "Reposts" },
              { id: "saved" as const, icon: Bookmark, label: "Sauvegardés" },
            ].map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setActiveTab(id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all" style={{ background: activeTab === id ? "rgba(232,16,42,0.12)" : "transparent", color: activeTab === id ? "#e8102a" : "rgba(232,232,240,0.35)", boxShadow: activeTab === id ? "0 0 10px rgba(232,16,42,0.12)" : "none" }}>
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>

          {activeTab === "posts" && (
            posts.length === 0 ? (
              <div className="text-center py-16 text-[#e8e8f0]/25">
                <Grid className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucune publication</p>
                {isOwn && <p className="text-xs mt-1 text-[#e8e8f0]/20">Partage ton premier post</p>}
              </div>
            ) : (
              <motion.div className="grid grid-cols-3 gap-2" layout>
                {posts.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} whileHover={{ scale: 1.03, zIndex: 10 }} className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer" style={{ background: post.imageGradient || `linear-gradient(135deg,${user.avatarColor}40,rgba(0,200,255,0.15))` }}>
                    {(post.imageUrl || post.mediaUrl) && post.mediaType !== "video" && (
                      <img src={post.mediaUrl || post.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {post.mediaType === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                        <TrendingUp className="w-6 h-6 text-white opacity-60" />
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-1" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)" }}>
                      <div className="flex items-center gap-1 text-white">
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span className="text-xs font-semibold">{post.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/70">
                        <MessageCircle className="w-3 h-3" />
                        <span className="text-[10px]">{post.commentsCount}</span>
                      </div>
                      <p className="text-white text-[9px] px-2 text-center line-clamp-2 leading-tight opacity-80">{post.content}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )
          )}

          {activeTab === "reposts" && (
            <div className="text-center py-16 text-[#e8e8f0]/25">
              <Repeat2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucun repost</p>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="text-center py-16 text-[#e8e8f0]/25">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune sauvegarde</p>
            </div>
          )}

          <p className="text-center text-xs text-[#e8e8f0]/12 mt-10 mb-4">✦ 2026 PlayQuest by varnox•prime</p>
        </div>
      </div>
    </Layout>
  );
}
