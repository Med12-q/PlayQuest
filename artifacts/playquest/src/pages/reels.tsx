import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown, Bookmark, UserPlus } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { generateId } from "@/lib/utils";

const REELS = [
  { id: "r1", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", author: "alexvx", authorColor: "#e8102a", caption: "🔥 Les vibes cyberpunk du soir — incroyable cette énergie !", likes: 12400, comments: 234, tag: "#cyberpunk #neon" },
  { id: "r2", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", author: "neonqueen", authorColor: "#00c8ff", caption: "✨ Nouvelle vidéo du studio — le projet avance bien !", likes: 8900, comments: 156, tag: "#studio #art" },
  { id: "r3", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", author: "shadowfox", authorColor: "#ff9900", caption: "🚗 Road trip épique ! La liberté sur la route ✦", likes: 5300, comments: 89, tag: "#roadtrip #vibes" },
  { id: "r4", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", author: "darkbyte", authorColor: "#9900ff", caption: "💻 Coding session à 3h du matin — c'est ça la vie de dev 😅", likes: 3200, comments: 67, tag: "#dev #code #nightcoding" },
  { id: "r5", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4", author: "varnox", authorColor: "#e8102a", caption: "✦ PlayQuest v2.0 is coming — restez connectés 🚀", likes: 99900, comments: 13370, tag: "#PlayQuest #varnoxprime" },
  { id: "r6", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", author: "alexvx", authorColor: "#e8102a", caption: "🎬 Nouvelle création — le processus créatif c'est magique !", likes: 7800, comments: 112, tag: "#creative #art" },
];

function formatCount(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

interface ReelItem { id: string; videoUrl: string; author: string; authorColor: string; caption: string; likes: number; comments: number; tag: string; }

function ReelCard({ reel, isActive, isMuted, onToggleMute }: { reel: ReelItem; isActive: boolean; isMuted: boolean; onToggleMute: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [likes, setLikes] = useState(reel.likes);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [progress, setProgress] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.muted = isMuted;
      v.play().then(() => setIsPlaying(true)).catch(() => { v.muted = true; v.play().then(() => setIsPlaying(true)).catch(() => {}); });
    } else {
      v.pause();
      v.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive, isMuted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
  }, [isMuted]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v && v.duration) setProgress((v.currentTime / v.duration) * 100);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); } else { v.play(); setIsPlaying(true); }
  };

  const handleDoubleTap = () => {
    if (!liked) { setLiked(true); setLikes(l => l + 1); setShowHeart(true); setTimeout(() => setShowHeart(false), 900); }
  };

  return (
    <div className="relative w-full h-full flex-shrink-0 overflow-hidden bg-black" style={{ scrollSnapAlign: "start" }}>
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 z-10">
        <div className="h-full bg-[#e8102a] transition-all duration-100" style={{ width: `${progress}%`, boxShadow: "0 0 6px rgba(232,16,42,0.8)" }} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)" }} />

      {/* Play/Pause indicator */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double tap heart */}
      <AnimatePresence>
        {showHeart && (
          <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-24 h-24 text-[#e8102a]" fill="#e8102a" style={{ filter: "drop-shadow(0 0 30px rgba(232,16,42,0.9))" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-16 p-4 z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white/50" style={{ background: reel.authorColor }}>
            {getInitials(reel.author)}
          </div>
          <span className="text-white font-semibold text-sm drop-shadow-lg">@{reel.author}</span>
          {!followed && (
            <button onClick={() => setFollowed(true)} className="px-3 py-0.5 rounded-full text-xs font-bold border border-white text-white hover:bg-white hover:text-black transition-all">
              Suivre
            </button>
          )}
        </div>
        <p className="text-white text-sm drop-shadow-lg leading-snug mb-1">{reel.caption}</p>
        <p className="text-white/60 text-xs">{reel.tag}</p>
      </div>

      {/* Right action buttons */}
      <div className="absolute right-3 bottom-8 flex flex-col items-center gap-5 z-10">
        <button onClick={() => { const newLiked = !liked; setLiked(newLiked); setLikes(l => newLiked ? l + 1 : l - 1); }} className="flex flex-col items-center gap-1">
          <motion.div whileTap={{ scale: 0.7 }} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: liked ? "rgba(232,16,42,0.3)" : "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
            <Heart className="w-6 h-6" fill={liked ? "#e8102a" : "none"} style={{ color: liked ? "#e8102a" : "white", filter: liked ? "drop-shadow(0 0 8px rgba(232,16,42,0.8))" : "none" }} />
          </motion.div>
          <span className="text-white text-xs font-semibold drop-shadow">{formatCount(likes)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">{formatCount(reel.comments)}</span>
        </button>

        <button onClick={() => setBookmarked(!bookmarked)} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: bookmarked ? "rgba(0,200,255,0.3)" : "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
            <Bookmark className="w-6 h-6" fill={bookmarked ? "#00c8ff" : "none"} style={{ color: bookmarked ? "#00c8ff" : "white" }} />
          </div>
          <span className="text-white text-xs drop-shadow">Sauv.</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs drop-shadow">Partager</span>
        </button>

        <button onClick={onToggleMute} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
            {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
          </div>
        </button>
      </div>
    </div>
  );
}

export default function ReelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => setCurrentIndex(i => Math.min(i + 1, REELS.length - 1)), []);
  const goPrev = useCallback(() => setCurrentIndex(i => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const h = container.clientHeight;
      const idx = Math.round(container.scrollTop / h);
      setCurrentIndex(idx);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: currentIndex * container.clientHeight, behavior: "smooth" });
  }, [currentIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  return (
    <Layout>
      <div className="relative h-screen md:h-[calc(100vh-0px)] overflow-hidden" style={{ background: "#000" }}>
        {/* Scroll container */}
        <div ref={containerRef} className="h-full overflow-y-scroll" style={{ scrollSnapType: "y mandatory", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}>
          {REELS.map((reel, i) => (
            <div key={reel.id} style={{ height: "100%", scrollSnapAlign: "start", flexShrink: 0 }}>
              <ReelCard reel={reel} isActive={i === currentIndex} isMuted={isMuted} onToggleMute={() => setIsMuted(m => !m)} />
            </div>
          ))}
        </div>

        {/* Nav arrows desktop */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-20">
          <button onClick={goPrev} disabled={currentIndex === 0} className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/70 transition-all backdrop-blur-sm">
            <ChevronUp className="w-5 h-5" />
          </button>
          <button onClick={goNext} disabled={currentIndex === REELS.length - 1} className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/70 transition-all backdrop-blur-sm">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Reel counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {REELS.map((_, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)} className="h-1 rounded-full transition-all" style={{ width: i === currentIndex ? "24px" : "6px", background: i === currentIndex ? "#e8102a" : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
