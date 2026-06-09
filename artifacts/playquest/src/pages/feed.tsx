import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Plus, Image, Video, X, Send, MoreHorizontal, Zap, TrendingUp, Play } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, Post, User } from "@/lib/store";
import { getInitials, formatTimeAgo } from "@/lib/utils";
import { UserAvatar } from "@/components/UserAvatar";

interface PostWithUser extends Post { user: User | null; liked: boolean; }

function compressImage(file: File, maxWidth = 900, quality = 0.82): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
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
    <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }} className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl p-[2px]" style={{ background: isOwn ? "rgba(255,255,255,0.07)" : `linear-gradient(135deg,${user.avatarColor},#00c8ff)` }}>
          {isOwn ? (
            <div className="w-full h-full rounded-[10px] flex items-center justify-center" style={{ background: "rgba(10,10,18,0.95)" }}>
              <Plus className="w-4 h-4 text-[#e8e8f0]/40" />
            </div>
          ) : (
            <UserAvatar user={user} size="md" square className="w-full h-full rounded-[10px]" style={{ boxShadow: "none" }} />
          )}
        </div>
        {!isOwn && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-[2px] border-[#06060d]" style={{ background: "#39ff14", boxShadow: "0 0 6px rgba(57,255,20,0.8)" }} />}
      </div>
      <span className="text-[10px] text-[#e8e8f0]/38 font-medium truncate max-w-[56px] text-center">
        {isOwn ? "Ma story" : `@${user.username.slice(0, 7)}`}
      </span>
    </motion.div>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const [played, setPlayed] = useState(false);
  const isYT = url.includes("youtube.com") || url.includes("youtu.be");
  if (isYT) {
    return (
      <div className="relative rounded-xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
        {!played ? (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            style={{ background: "linear-gradient(135deg,rgba(0,0,0,0.85),rgba(14,14,22,0.9))" }}
            onClick={() => setPlayed(true)}
          >
            <motion.div whileHover={{ scale: 1.12 }} className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(232,16,42,0.9)", boxShadow: "0 0 30px rgba(232,16,42,0.5)" }}>
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </motion.div>
            <div className="absolute bottom-3 left-3">
              <span className="text-xs text-white/60 px-2 py-1 rounded" style={{ background: "rgba(0,0,0,0.5)" }}>YouTube</span>
            </div>
          </div>
        ) : (
          <iframe
            src={`${url}&autoplay=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: "none" }}
          />
        )}
      </div>
    );
  }
  return (
    <video controls className="w-full rounded-xl max-h-80 object-cover" style={{ background: "#0a0a14" }}>
      <source src={url} />
    </video>
  );
}

function PostCard({ post, onLike, onComment }: { post: PostWithUser; onLike: (id: string) => void; onComment: (id: string, text: string) => void }) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState(() => store.getComments(post.id));

  const handleComment = () => {
    const text = commentText.trim();
    if (!text) return;
    onComment(post.id, text);
    setComments(store.getComments(post.id));
    setCommentText("");
  };

  const hasMedia = post.mediaUrl || post.imageUrl;
  const isVideo = post.mediaType === "video";

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden" style={{ background: "rgba(10,10,17,0.92)", border: "1px solid rgba(255,255,255,0.055)", backdropFilter: "blur(12px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className="relative">
          {post.user && <UserAvatar user={post.user} size="md" />}
          {!post.user && <div className="w-10 h-10 rounded-full bg-[#444]" />}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-[2px] border-[#0a0a11]" style={{ background: "#39ff14", boxShadow: "0 0 6px rgba(57,255,20,0.7)" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#e8e8f0]">@{post.user?.username}</p>
          <p className="text-[11px] text-[#e8e8f0]/30 mt-0.5 flex items-center gap-1">
            {formatTimeAgo(post.createdAt)}
            {isVideo && <><span className="text-[#e8e8f0]/20">·</span><span className="text-[#e8102a] font-medium">Vidéo</span></>}
          </p>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.04] transition-colors">
          <MoreHorizontal className="w-4 h-4 text-[#e8e8f0]/22" />
        </button>
      </div>

      {/* Text */}
      <div className="px-4 pb-3">
        <p className="text-sm text-[#e8e8f0]/78 leading-relaxed">{post.content}</p>
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="text-xs mt-1.5 space-x-1.5">
            {post.hashtags.map(h => <span key={h} className="text-[#00c8ff] hover:underline cursor-pointer">#{h}</span>)}
          </p>
        )}
      </div>

      {/* Media */}
      {hasMedia && (
        <div className="mx-4 mb-3">
          {isVideo && post.mediaUrl ? (
            <VideoEmbed url={post.mediaUrl} />
          ) : (
            <div className="rounded-xl overflow-hidden">
              <img
                src={post.mediaUrl || post.imageUrl}
                alt=""
                className="w-full object-cover max-h-80"
                loading="lazy"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-5">
          <motion.button whileTap={{ scale: 0.8 }} onClick={() => onLike(post.id)} className="flex items-center gap-1.5 group">
            <Heart className={`w-[18px] h-[18px] transition-all ${post.liked ? "fill-[#e8102a] text-[#e8102a]" : "text-[#e8e8f0]/28 group-hover:text-[#e8102a]"}`} style={post.liked ? { filter: "drop-shadow(0 0 6px rgba(232,16,42,0.7))" } : {}} />
            <span className={`text-xs font-semibold tabular-nums ${post.liked ? "text-[#e8102a]" : "text-[#e8e8f0]/28"}`}>
              {post.likesCount >= 1000 ? `${(post.likesCount / 1000).toFixed(1)}k` : post.likesCount}
            </span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.8 }} onClick={() => setShowComments(s => !s)} className="flex items-center gap-1.5 group">
            <MessageCircle className={`w-[18px] h-[18px] transition-all ${showComments ? "text-[#00c8ff]" : "text-[#e8e8f0]/28 group-hover:text-[#00c8ff]"}`} />
            <span className="text-xs font-semibold text-[#e8e8f0]/28 tabular-nums">
              {post.commentsCount >= 1000 ? `${(post.commentsCount / 1000).toFixed(1)}k` : comments.length}
            </span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.8 }} className="group" onClick={() => { if (navigator.share) navigator.share({ text: post.content }); }}>
            <Share2 className="w-[18px] h-[18px] text-[#e8e8f0]/28 group-hover:text-[#39ff14] transition-colors" />
          </motion.button>
        </div>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => setSaved(s => !s)}>
          <Bookmark className={`w-[18px] h-[18px] transition-colors ${saved ? "fill-[#ff9900] text-[#ff9900]" : "text-[#e8e8f0]/28 hover:text-[#ff9900]"}`} />
        </motion.button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-3 space-y-2.5 max-h-44 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-xs text-center text-[#e8e8f0]/22 py-3">Sois le premier à commenter ✦</p>
              ) : comments.map((c, i) => {
                const cu = store.getUserById(c.userId);
                return (
                  <div key={i} className="flex gap-2.5">
                    {cu ? <UserAvatar user={cu} size="xs" /> : <div className="w-6 h-6 rounded-full bg-[#444] flex-shrink-0" />}
                    <div className="flex-1 rounded-xl px-2.5 py-1.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <span className="text-xs font-semibold text-[#e8e8f0]/60 mr-1.5">@{cu?.username}</span>
                      <span className="text-xs text-[#e8e8f0]/50">{c.content}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 pb-3 flex gap-2">
              <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleComment()} placeholder="Commenter…" className="flex-1 text-xs rounded-xl px-3 py-2 text-[#e8e8f0] placeholder:text-[#e8e8f0]/20 outline-none focus:border-[#e8102a]/35 transition-colors" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }} />
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
    if (!currentUser) return;
    setPosts(store.getPosts().map(p => ({
      ...p,
      user: store.getUserById(p.userId) ?? null,
      liked: store.isLiked(p.id, currentUser.id),
    })));
  };

  useEffect(() => {
    loadPosts();
    setStories(store.getUsers().filter(u => u.id !== currentUser?.id).slice(0, 6));
  }, [currentUser]);

  const handleLike = (postId: string) => {
    if (!currentUser) return;
    store.toggleLike(postId, currentUser.id);
    loadPosts();
  };

  const handleComment = (postId: string, text: string) => {
    if (!currentUser) return;
    store.addComment({ userId: currentUser.id, postId, content: text });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "image") {
      try { setNewImage(await compressImage(file)); } catch { const r = new FileReader(); r.onload = ev => setNewImage(ev.target?.result as string); r.readAsDataURL(file); }
    } else {
      const r = new FileReader(); r.onload = ev => setNewImage(ev.target?.result as string); r.readAsDataURL(file);
    }
    setShowNewPost(true);
    e.target.value = "";
  };

  const submitPost = () => {
    if (!currentUser || (!newContent.trim() && !newImage)) return;
    setSubmitting(true);
    setTimeout(() => {
      store.addPost({ userId: currentUser.id, content: newContent.trim() || "✦", imageUrl: newImage || undefined, hashtags: [] });
      setNewContent(""); setNewImage(null); setShowNewPost(false); setSubmitting(false);
      loadPosts();
    }, 350);
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
              <p className="text-[11px] text-[#e8e8f0]/28 mt-0.5 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-[#39ff14]" /> Tendances du moment
              </p>
            </div>
            <Link to={`/profile/${currentUser.username}`}>
              <UserAvatar user={currentUser} size="sm" style={{ boxShadow: `0 0 14px ${currentUser.avatarColor}70`, width: "36px", height: "36px" }} />
            </Link>
          </div>

          {/* Stories */}
          <div className="mb-5">
            <div className="flex gap-3 overflow-x-auto pb-1.5" style={{ scrollbarWidth: "none" }}>
              {currentUser && <StoryCircle user={currentUser} isOwn />}
              {stories.map(u => <StoryCircle key={u.id} user={u} />)}
            </div>
          </div>

          {/* Compose bar */}
          <div className="mb-5 p-3.5 rounded-2xl flex items-center gap-3" style={{ background: "rgba(10,10,17,0.92)", border: "1px solid rgba(255,255,255,0.055)" }}>
            <UserAvatar user={currentUser} size="sm" style={{ width: "36px", height: "36px" }} />
            <motion.div whileTap={{ scale: 0.99 }} className="flex-1 text-sm text-[#e8e8f0]/22 cursor-pointer py-2 px-3 rounded-xl select-none" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }} onClick={() => setShowNewPost(true)}>
              Quoi de neuf, @{currentUser.username} ?
            </motion.div>
            <div className="flex gap-2 flex-shrink-0">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={e => handleFileSelect(e, "image")} className="hidden" />
              <input ref={videoInputRef} type="file" accept="video/*" onChange={e => handleFileSelect(e, "video")} className="hidden" />
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => fileInputRef.current?.click()} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.18)" }} title="Photo">
                <Image className="w-4 h-4 text-[#00c8ff]" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => videoInputRef.current?.click()} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: "rgba(232,16,42,0.08)", border: "1px solid rgba(232,16,42,0.18)" }} title="Vidéo">
                <Video className="w-4 h-4 text-[#e8102a]" />
              </motion.button>
            </div>
          </div>

          {/* New post modal */}
          <AnimatePresence>
            {showNewPost && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}>
                <motion.div initial={{ y: 60, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} className="w-full max-w-md rounded-3xl p-5" style={{ background: "rgba(9,9,15,0.99)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 40px 100px rgba(0,0,0,0.9)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#e8e8f0]">Nouveau post</h3>
                    <button onClick={() => { setShowNewPost(false); setNewContent(""); setNewImage(null); }} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-colors">
                      <X className="w-4 h-4 text-[#e8e8f0]/40" />
                    </button>
                  </div>
                  <div className="flex gap-3 mb-4">
                    <UserAvatar user={currentUser} size="sm" style={{ width: "36px", height: "36px" }} />
                    <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Partage quelque chose d'incroyable…" rows={4} className="flex-1 resize-none text-sm bg-transparent text-[#e8e8f0] placeholder:text-[#e8e8f0]/20 outline-none leading-relaxed" />
                  </div>
                  {newImage && (
                    <div className="relative mb-4">
                      <img src={newImage} alt="" className="w-full max-h-52 object-cover rounded-xl" />
                      <button onClick={() => setNewImage(null)} className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.75)" }}>
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <div className="flex gap-2">
                      <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-xl hover:bg-white/[0.04] transition-colors"><Image className="w-4 h-4 text-[#00c8ff]" /></button>
                      <button onClick={() => videoInputRef.current?.click()} className="p-2 rounded-xl hover:bg-white/[0.04] transition-colors"><Video className="w-4 h-4 text-[#e8102a]" /></button>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={submitPost} disabled={submitting || (!newContent.trim() && !newImage)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 20px rgba(232,16,42,0.35)" }}>
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

          <p className="text-center text-[10px] text-[#e8e8f0]/12 mt-10 mb-4">✦ 2026 PlayQuest by varnox•prime</p>
        </div>
      </div>
    </Layout>
  );
}
