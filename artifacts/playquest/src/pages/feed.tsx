import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Plus, X, Send, Image, Video, Film } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, Post, Story, Comment } from "@/lib/store";
import { getInitials, formatTimeAgo, generateId } from "@/lib/utils";

function compressImage(file: File, maxWidth = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const videoBlobs = new Map<string, string>();

function StoryBubble({ story, onView }: { story: Story; onView: () => void }) {
  const user = store.getUserById(story.userId);
  if (!user) return null;
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onView} className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <div className="w-14 h-14 rounded-full p-[2px]" style={{ background: story.gradient }}>
        <div className="w-full h-full rounded-full flex items-center justify-center text-sm font-bold text-white bg-[#0a0a0f]">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: user.avatarColor }}>
            {getInitials(user.username)}
          </div>
        </div>
      </div>
      <span className="text-[10px] text-[#e8e8f0]/50 max-w-[56px] truncate">@{user.username}</span>
    </motion.button>
  );
}

function StoryViewer({ story, onClose }: { story: Story; onClose: () => void }) {
  const user = store.getUserById(story.userId);
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.92)" }} onClick={onClose}>
      <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} className="relative w-full max-w-xs mx-4 aspect-[9/16] rounded-3xl overflow-hidden" style={{ background: story.gradient }} onClick={e => e.stopPropagation()}>
        <div className="absolute top-3 left-3 right-3 h-0.5 bg-white/20 rounded-full">
          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "linear" }} className="h-full bg-white rounded-full" />
        </div>
        <div className="absolute top-6 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: user?.avatarColor }}>{getInitials(user?.username || "")}</div>
            <span className="text-white text-sm font-semibold">@{user?.username}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><X className="w-4 h-4 text-white" /></button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <p className="text-white text-2xl font-bold text-center leading-snug">{story.content}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PostCard({ post, onUpdate }: { post: Post; onUpdate: () => void }) {
  const { currentUser } = useAuth();
  const user = store.getUserById(post.userId);
  const [liked, setLiked] = useState(currentUser ? store.isLiked(post.id, currentUser.id) : false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [showHeart, setShowHeart] = useState(false);

  const handleLike = () => {
    if (!currentUser) return;
    const newLiked = store.toggleLike(post.id, currentUser.id);
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    if (newLiked) { setShowHeart(true); setTimeout(() => setShowHeart(false), 900); }
  };

  const toggleComments = () => {
    if (!showComments) setComments(store.getComments(post.id));
    setShowComments(!showComments);
  };

  const submitComment = () => {
    if (!currentUser || !commentText.trim()) return;
    const c: Comment = { id: generateId(), postId: post.id, userId: currentUser.id, content: commentText.trim(), createdAt: new Date().toISOString() };
    store.addComment(c);
    setComments(prev => [...prev, c]);
    setCommentText("");
    onUpdate();
  };

  if (!user) return null;

  const videoSrc = post.mediaType === "video" ? videoBlobs.get(post.id) : null;

  return (
    <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden mb-3" style={{ background: "rgba(15,15,22,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Link to={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: user.avatarColor }}>
            {getInitials(user.username)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#e8e8f0] truncate">@{user.username}</p>
            <p className="text-[11px] text-[#e8e8f0]/35">{formatTimeAgo(post.createdAt)}</p>
          </div>
        </Link>
      </div>

      {/* Media */}
      <div className="relative cursor-pointer" onDoubleClick={handleLike}>
        {post.mediaType === "image" && post.mediaUrl ? (
          <img src={post.mediaUrl} alt="post" className="w-full object-cover" style={{ maxHeight: "400px", background: "#111" }} />
        ) : post.mediaType === "video" && videoSrc ? (
          <video src={videoSrc} controls className="w-full" style={{ maxHeight: "400px", background: "#111" }} />
        ) : post.mediaType === "video" && !videoSrc ? (
          <div className="w-full h-52 flex flex-col items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, rgba(232,16,42,0.08), rgba(0,200,255,0.08))" }}>
            <Film className="w-10 h-10 text-[#e8e8f0]/20" />
            <p className="text-xs text-[#e8e8f0]/30">Vidéo — rechargez pour visionner</p>
          </div>
        ) : (
          <div className="w-full h-56" style={{ background: post.imageGradient || "linear-gradient(135deg, #1a1a2e, #16213e)" }} />
        )}
        <AnimatePresence>
          {showHeart && (
            <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1.4, opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart className="w-20 h-20 text-[#e8102a]" fill="#e8102a" style={{ filter: "drop-shadow(0 0 20px rgba(232,16,42,0.9))" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-3">
        <p className="text-sm text-[#e8e8f0]/85 mb-2 leading-relaxed">{post.content}</p>
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.hashtags.map(tag => <span key={tag} className="text-xs text-[#00c8ff]/60">{tag}</span>)}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-5">
            <motion.button whileTap={{ scale: 0.75 }} onClick={handleLike} className="flex items-center gap-1.5 transition-all">
              <Heart className="w-5 h-5" fill={liked ? "#e8102a" : "none"} strokeWidth={1.8} style={{ color: liked ? "#e8102a" : "rgba(232,232,240,0.4)", filter: liked ? "drop-shadow(0 0 6px rgba(232,16,42,0.7))" : "none" }} />
              <span className="text-xs font-medium" style={{ color: liked ? "#e8102a" : "rgba(232,232,240,0.4)" }}>{likesCount.toLocaleString()}</span>
            </motion.button>

            <button onClick={toggleComments} className="flex items-center gap-1.5 text-[#e8e8f0]/40 hover:text-[#00c8ff] transition-colors">
              <MessageCircle className="w-5 h-5" strokeWidth={1.8} />
              <span className="text-xs font-medium">{post.commentsCount}</span>
            </button>

            <button className="text-[#e8e8f0]/40 hover:text-[#00c8ff] transition-colors">
              <Share2 className="w-5 h-5" strokeWidth={1.8} />
            </button>
          </div>

          <motion.button whileTap={{ scale: 0.75 }} onClick={() => setBookmarked(!bookmarked)}>
            <Bookmark className="w-5 h-5" fill={bookmarked ? "#00c8ff" : "none"} strokeWidth={1.8} style={{ color: bookmarked ? "#00c8ff" : "rgba(232,232,240,0.4)", filter: bookmarked ? "drop-shadow(0 0 6px rgba(0,200,255,0.7))" : "none" }} />
          </motion.button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="space-y-2.5 mb-3 max-h-44 overflow-y-auto">
                {comments.length === 0 && <p className="text-xs text-[#e8e8f0]/30">Aucun commentaire. Soyez le premier !</p>}
                {comments.map(c => {
                  const cu = store.getUserById(c.userId);
                  return (
                    <div key={c.id} className="flex gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: cu?.avatarColor || "#444" }}>{getInitials(cu?.username || "?")}</div>
                      <div>
                        <span className="text-xs font-semibold text-[#e8e8f0]/70">@{cu?.username} </span>
                        <span className="text-xs text-[#e8e8f0]/55">{c.content}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {currentUser && (
                <div className="flex gap-2">
                  <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === "Enter" && submitComment()} placeholder="Ajouter un commentaire..." className="flex-1 px-3 py-2 rounded-xl text-xs outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#e8e8f0" }} />
                  <button onClick={submitComment} className="px-3 py-2 rounded-xl" style={{ background: "#e8102a" }}><Send className="w-3 h-3 text-white" /></button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

export default function FeedPage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [publishing, setPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(() => { setPosts(store.getPosts()); setStories(store.getStories()); }, []);
  useEffect(() => { loadData(); }, [loadData]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : null;
    if (!type) return;
    setMediaType(type);
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    setMediaPreview(null);
    setMediaFile(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submitPost = async () => {
    if (!currentUser || !newPostText.trim()) return;
    setPublishing(true);

    let mediaUrl: string | undefined;
    let finalMediaType: "image" | "video" | undefined;

    if (mediaFile && mediaType === "image") {
      mediaUrl = await compressImage(mediaFile);
      finalMediaType = "image";
    } else if (mediaFile && mediaType === "video" && mediaPreview) {
      finalMediaType = "video";
    }

    const post: Post = {
      id: generateId(),
      userId: currentUser.id,
      content: newPostText.trim(),
      mediaUrl,
      mediaType: finalMediaType,
      imageGradient: finalMediaType ? undefined : "linear-gradient(135deg, #e8102a, #c8001f)",
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      hashtags: [],
    };

    if (finalMediaType === "video" && mediaPreview) {
      videoBlobs.set(post.id, mediaPreview);
    }

    store.savePost(post);
    setNewPostText("");
    clearMedia();
    setShowNewPost(false);
    setPublishing(false);
    loadData();
  };

  const closeModal = () => { setShowNewPost(false); clearMedia(); setNewPostText(""); };

  return (
    <Layout>
      <div className="max-w-[560px] mx-auto px-4 py-5">
        {/* Stories */}
        <div className="mb-5">
          <div className="flex gap-3.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {currentUser && (
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setShowNewPost(true)} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(232,16,42,0.06)", border: "1.5px dashed rgba(232,16,42,0.35)" }}>
                  <Plus className="w-5 h-5 text-[#e8102a]/70" />
                </div>
                <span className="text-[10px] text-[#e8e8f0]/35">Publier</span>
              </motion.button>
            )}
            {stories.map(s => (
              <StoryBubble key={s.id} story={s} onView={() => { store.markStoryViewed(s.id, currentUser?.id || ""); setActiveStory(s); }} />
            ))}
          </div>
        </div>

        {/* Feed */}
        <div>
          {posts.map(post => <PostCard key={post.id} post={post} onUpdate={loadData} />)}
        </div>
      </div>

      <AnimatePresence>{activeStory && <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />}</AnimatePresence>

      {/* New post modal */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }} onClick={closeModal}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", damping: 28, stiffness: 350 }} className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: "#0e0e16", border: "1px solid rgba(255,255,255,0.07)" }} onClick={e => e.stopPropagation()}>
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <h3 className="text-base font-bold text-[#e8e8f0]">Nouvelle publication</h3>
                <button onClick={closeModal} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/05 transition-all"><X className="w-4 h-4 text-[#e8e8f0]/50" /></button>
              </div>

              <div className="p-5 space-y-4">
                {currentUser && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: currentUser.avatarColor }}>{getInitials(currentUser.username)}</div>
                    <span className="text-sm font-medium text-[#e8e8f0]">@{currentUser.username}</span>
                  </div>
                )}

                <textarea
                  value={newPostText}
                  onChange={e => setNewPostText(e.target.value)}
                  placeholder="Quoi de neuf ? Partagez avec la communauté..."
                  rows={3}
                  className="w-full px-0 py-0 text-sm outline-none resize-none bg-transparent text-[#e8e8f0] placeholder:text-[#e8e8f0]/25 leading-relaxed"
                  style={{ minHeight: "72px" }}
                />

                {/* Media preview */}
                {mediaPreview && (
                  <div className="relative rounded-xl overflow-hidden">
                    {mediaType === "image" ? (
                      <img src={mediaPreview} alt="preview" className="w-full object-cover rounded-xl" style={{ maxHeight: "240px" }} />
                    ) : (
                      <video src={mediaPreview} controls className="w-full rounded-xl" style={{ maxHeight: "240px" }} />
                    )}
                    <button onClick={clearMedia} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                )}

                {/* Separator */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

                {/* Bottom bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = "image/*"; fileInputRef.current.click(); } }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#e8e8f0]/50 hover:text-[#00c8ff] hover:bg-[#00c8ff]/08 transition-all">
                      <Image className="w-4 h-4" />
                      Photo
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = "video/*"; fileInputRef.current.click(); } }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#e8e8f0]/50 hover:text-[#e8102a] hover:bg-[#e8102a]/08 transition-all">
                      <Video className="w-4 h-4" />
                      Vidéo
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={closeModal} className="px-4 py-2 rounded-xl text-sm text-[#e8e8f0]/40 hover:text-[#e8e8f0]/70 transition-colors">Annuler</button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={submitPost}
                      disabled={!newPostText.trim() || publishing}
                      className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{
                        background: newPostText.trim() && !publishing ? "linear-gradient(135deg, #e8102a, #c8001f)" : "rgba(232,16,42,0.25)",
                        boxShadow: newPostText.trim() && !publishing ? "0 0 16px rgba(232,16,42,0.35)" : "none",
                      }}
                    >
                      {publishing ? "Publication..." : "Publier"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setShowNewPost(true)}
        className="fixed bottom-20 right-5 md:bottom-7 md:right-7 w-13 h-13 rounded-full flex items-center justify-center z-40"
        style={{ background: "linear-gradient(135deg, #e8102a, #c8001f)", boxShadow: "0 0 24px rgba(232,16,42,0.5), 0 4px 16px rgba(232,16,42,0.4)", width: "52px", height: "52px" }}
      >
        <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
      </motion.button>
    </Layout>
  );
}
