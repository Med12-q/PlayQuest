import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Plus, Image, Video, X, Send, MoreHorizontal, Zap, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, Post, User } from "@/lib/store";
import { getInitials, formatTimeAgo } from "@/lib/utils";

interface PostWithUser extends Post { user: User | null; liked: boolean; }

function compressImage(file: File, maxWidth = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function StoryCircle({ user, isOwn }: { user: User; isOwn?: boolean }) {
  return (
    <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl p-[2px]" style={{ background: isOwn ? "rgba(255,255,255,0.07)" : `linear-gradient(135deg,${user.avatarColor},#00c8ff)` }}>
          <div className="w-full h-full rounded-[10px] flex items-center justify-center font-bold text-white text-base" style={{ background: isOwn ? "rgba(12,12,20,0.95)" : user.avatarColor }}>
            {isOwn ? <Plus className="w-5 h-5 text-[#e8e8f0]/40" /> : getInitials(user.username)}
          </div>
        </div>
        {!isOwn && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#06060d]" style={{ background: "#39ff14", boxShadow: "0 0 6px rgba(57,255,20,0.8)" }} />
        )}
      </div>
      <span className="text-[10px] text-[#e8e8f0]/40 font-medium truncate max-w-[56px] text-center">
        {isOwn ? "Ma story" : `@${user.username.slice(0,6)}`}
      </span>
    </motion.div>
  );
}

function PostCard({ post, onLike, onComment }: { post: PostWithUser; onLike: (id: string) => void; onComment: (id: string, text: string) => void }) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState(store.getComments(post.id));

  const handleComment = () => {
    const text = commentText.trim();
    if (!text) return;
    onComment(post.id, text);
    setComments(store.getComments(post.id));
    setCommentText("");
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden" style={{ background: "rgba(11,11,18,0.92)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: post.user?.avatarColor || "#444", boxShadow: `0 0 14px ${post.user?.avatarColor || "#444"}55` }}>
            {getInitials(post.user?.username || "?")}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0b0b12]" style={{ background: "#39ff14", boxShadow: "0 0 6px rgba(57,255,20,0.7)" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#e8e8f0]">@{post.user?.username}</p>
          <p className="text-[11px] text-[#e8e8f0]/35">{formatTimeAgo(post.createdAt)}</p>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-[#e8e8f0]/25" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-[#e8e8f0]/80 leading-relaxed">{post.content}</p>
        {post.hashtags?.length > 0 && (
          <p className="text-xs mt-1.5">
            {post.hashtags.map(h => <span key={h} className="text-[#00c8ff] mr-1.5 hover:underline cursor-pointer">#{h}</span>)}
          </p>
        )}
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden">
          <img src={post.imageUrl} alt="" className="w-full object-cover max-h-80" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-5">
          <motion.button whileTap={{ scale: 0.82 }} onClick={() => onLike(post.id)} className="flex items-center gap-1.5 group">
            <Heart className={`w-4.5 h-4.5 transition-all ${post.liked ? "fill-[#e8102a] text-[#e8102a]" : "text-[#e8e8f0]/30 group-hover:text-[#e8102a]"}`} style={post.liked ? { filter: "drop-shadow(0 0 6px rgba(232,16,42,0.7))" } : {}} />
            <span className={`text-xs font-medium ${post.liked ? "text-[#e8102a]" : "text-[#e8e8f0]/30"}`}>{post.likesCount}</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.82 }} onClick={() => setShowComments(s => !s)} className="flex items-center gap-1.5 group">
            <MessageCircle className={`w-4.5 h-4.5 transition-all ${showComments ? "text-[#00c8ff]" : "text-[#e8e8f0]/30 group-hover:text-[#00c8ff]"}`} />
            <span className="text-xs font-medium text-[#e8e8f0]/30">{comments.length}</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.82 }} className="group">
            <Share2 className="w-4.5 h-4.5 text-[#e8e8f0]/30 group-hover:text-[#39ff14] transition-colors" />
          </motion.button>
        </div>
        <motion.button whileTap={{ scale: 0.82 }} onClick={() => setSaved(s => !s)}>
          <Bookmark className={`w-4.5 h-4.5 transition-colors ${saved ? "fill-[#ff9900] text-[#ff9900]" : "text-[#e8e8f0]/30 hover:text-[#ff9900]"}`} />
        </motion.button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-3 space-y-2.5 max-h-44 overflow-y-auto">
              {comments.length === 0 && (
                <p className="text-xs text-center text-[#e8e8f0]/25 py-3">Sois le premier à commenter ✦</p>
              )}
              {comments.map((c, i) => {
                const cu = store.getUserById(c.userId);
                return (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: cu?.avatarColor || "#444" }}>
                      {getInitials(cu?.username || "?")}
                    </div>
                    <div className="flex-1 rounded-xl px-2.5 py-1.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <span className="text-xs font-semibold text-[#e8e8f0]/65 mr-1.5">@{cu?.username}</span>
                      <span className="text-xs text-[#e8e8f0]/50">{c.content}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 pb-3 flex gap-2">
              <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleComment()} placeholder="Ajouter un commentaire…" className="flex-1 text-xs bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-[#e8e8f0] placeholder:text-[#e8e8f0]/20 outline-none focus:border-[#e8102a]/40 transition-colors" />
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleComment} className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: commentText ? "rgba(232,16,42,0.15)" : "rgba(255,255,255,0.04)" }}>
                <Send className="w-3.5 h-3.5" style={{ color: commentText ? "#e8102a" : "#e8e8f0" }} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FeedPage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [stories, setStories] = useState<User[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const loadPosts = () => {
    const all = store.getPosts();
    setPosts(all.map(p => ({ ...p, user: store.getUserById(p.userId), liked: currentUser ? store.isLiked(currentUser.id, p.id) : false })));
  };

  useEffect(() => {
    loadPosts();
    const allUsers = store.getUsers();
    setStories(allUsers.filter(u => u.id !== currentUser?.id).slice(0, 6));
  }, [currentUser]);

  const handleLike = (postId: string) => {
    if (!currentUser) return;
    store.toggleLike(currentUser.id, postId);
    loadPosts();
  };

  const handleComment = (postId: string, text: string) => {
    if (!currentUser) return;
    store.addComment({ userId: currentUser.id, postId, content: text });
    loadPosts();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setNewImage(compressed);
      setShowNewPost(true);
    } catch {
      const reader = new FileReader();
      reader.onload = ev => { setNewImage(ev.target?.result as string); setShowNewPost(true); };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const submitPost = () => {
    if (!currentUser || (!newContent.trim() && !newImage)) return;
    setSubmitting(true);
    setTimeout(() => {
      store.addPost({ userId: currentUser.id, content: newContent.trim() || "✦", imageUrl: newImage || undefined, hashtags: [] });
      setNewContent(""); setNewImage(null); setShowNewPost(false); setSubmitting(false);
      loadPosts();
    }, 400);
  };

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#06060d 0%,#080812 100%)" }}>
        <div className="max-w-xl mx-auto px-4 py-5 pb-24">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-black" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Feed</h1>
              <p className="text-[11px] text-[#e8e8f0]/28 mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#39ff14]" /> Tendances du moment
              </p>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: currentUser.avatarColor, boxShadow: `0 0 14px ${currentUser.avatarColor}70` }}>
              {getInitials(currentUser.username)}
            </div>
          </div>

          {/* Stories */}
          <div className="mb-5">
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {currentUser && <StoryCircle user={currentUser} isOwn />}
              {stories.map(u => <StoryCircle key={u.id} user={u} />)}
            </div>
          </div>

          {/* Compose bar */}
          <div className="mb-5 p-3.5 rounded-2xl flex items-center gap-3" style={{ background: "rgba(11,11,18,0.92)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: currentUser.avatarColor }}>
              {getInitials(currentUser.username)}
            </div>
            <motion.div whileTap={{ scale: 0.99 }} className="flex-1 text-sm text-[#e8e8f0]/25 cursor-pointer py-2 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }} onClick={() => setShowNewPost(true)}>
              Quoi de neuf, @{currentUser.username} ?
            </motion.div>
            <div className="flex gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <input ref={videoInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => fileInputRef.current?.click()} className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.2)" }}>
                <Image className="w-4 h-4 text-[#00c8ff]" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => videoInputRef.current?.click()} className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: "rgba(232,16,42,0.08)", border: "1px solid rgba(232,16,42,0.2)" }}>
                <Video className="w-4 h-4 text-[#e8102a]" />
              </motion.button>
            </div>
          </div>

          {/* New post modal */}
          <AnimatePresence>
            {showNewPost && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}>
                <motion.div initial={{ y: 60, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.97 }} className="w-full max-w-md rounded-3xl p-5" style={{ background: "rgba(10,10,16,0.99)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 40px 100px rgba(0,0,0,0.9)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#e8e8f0]">Nouveau post</h3>
                    <button onClick={() => { setShowNewPost(false); setNewContent(""); setNewImage(null); }} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors">
                      <X className="w-4 h-4 text-[#e8e8f0]/40" />
                    </button>
                  </div>
                  <div className="flex gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: currentUser.avatarColor }}>
                      {getInitials(currentUser.username)}
                    </div>
                    <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Partage quelque chose d'incroyable…" rows={4} className="flex-1 resize-none text-sm bg-transparent text-[#e8e8f0] placeholder:text-[#e8e8f0]/22 outline-none leading-relaxed" />
                  </div>
                  {newImage && (
                    <div className="relative mb-4 rounded-xl overflow-hidden">
                      <img src={newImage} alt="" className="w-full max-h-48 object-cover rounded-xl" />
                      <button onClick={() => setNewImage(null)} className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.75)" }}>
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <div className="flex gap-2">
                      <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                        <Image className="w-4 h-4 text-[#00c8ff]" />
                      </button>
                      <button onClick={() => videoInputRef.current?.click()} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                        <Video className="w-4 h-4 text-[#e8102a]" />
                      </button>
                    </div>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={submitPost} disabled={submitting || (!newContent.trim() && !newImage)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 20px rgba(232,16,42,0.35)" }}>
                      <Zap className="w-4 h-4" fill="white" />
                      {submitting ? "Publication…" : "Publier"}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} />
            ))}
          </div>

          <p className="text-center text-xs text-[#e8e8f0]/12 mt-10 mb-4">✦ 2026 PlayQuest by varnox•prime</p>
        </div>
      </div>
    </Layout>
  );
}
