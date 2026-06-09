import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Send, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { User, Story, store } from "@/lib/store";
import { UserAvatar } from "./UserAvatar";
import { formatTimeAgo } from "@/lib/utils";

export interface StoryGroup {
  user: User;
  stories: Story[];
}

interface StoryViewerProps {
  groups: StoryGroup[];
  startGroupIndex: number;
  onClose: () => void;
  currentUserId?: string;
}

const STORY_DURATION = 5000;

export function StoryViewer({ groups, startGroupIndex, onClose, currentUserId }: StoryViewerProps) {
  const [gIdx, setGIdx] = useState(startGroupIndex);
  const [sIdx, setSIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reply, setReply] = useState("");
  const [showReply, setShowReply] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const group = groups[gIdx];
  const story = group?.stories[sIdx];

  const goNext = useCallback(() => {
    if (!group) return;
    if (sIdx < group.stories.length - 1) {
      setSIdx(s => s + 1);
      setProgress(0);
      setLiked(false);
    } else if (gIdx < groups.length - 1) {
      setGIdx(g => g + 1);
      setSIdx(0);
      setProgress(0);
      setLiked(false);
    } else {
      onClose();
    }
  }, [sIdx, gIdx, group, groups, onClose]);

  const goPrev = useCallback(() => {
    if (sIdx > 0) {
      setSIdx(s => s - 1);
      setProgress(0);
    } else if (gIdx > 0) {
      setGIdx(g => g - 1);
      setSIdx(groups[gIdx - 1].stories.length - 1);
      setProgress(0);
    }
  }, [sIdx, gIdx, groups]);

  useEffect(() => {
    if (paused || showReply) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const steps = STORY_DURATION / 50;
    const step = 100 / steps;
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p + step >= 100) {
          clearInterval(timerRef.current!);
          goNext();
          return 0;
        }
        return p + step;
      });
    }, 50);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gIdx, sIdx, paused, showReply, goNext]);

  useEffect(() => {
    if (story && currentUserId) store.markStoryViewed(story.id, currentUserId);
  }, [story, currentUserId]);

  if (!group || !story) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.97)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-[420px] h-full md:h-[90vh] md:rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: "100dvh" }}>

        {/* Background */}
        <div className="absolute inset-0" style={{ background: story.gradient || "linear-gradient(135deg,#1a1a2e,#16213e)" }}>
          {story.imageUrl && (
            <img src={story.imageUrl} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)" }} />
        </div>

        {/* Progress bars */}
        <div className="relative z-10 flex gap-1 p-3 pt-4">
          {group.stories.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.3)" }}>
              <div
                className="h-full rounded-full bg-white transition-none"
                style={{
                  width: i < sIdx ? "100%" : i === sIdx ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2.5">
            <div className="p-[2px] rounded-full" style={{ background: "linear-gradient(135deg,#e8102a,#00c8ff)" }}>
              <UserAvatar user={group.user} size="sm" style={{ border: "2px solid black" }} />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">{group.user.username}</p>
              <p className="text-white/50 text-[11px] mt-0.5">{formatTimeAgo(story.expiresAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.4)" }}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="text-center px-8">
            <p className="text-white text-2xl font-bold leading-relaxed drop-shadow-lg">{story.content}</p>
          </div>

          {/* Navigation tap zones */}
          <div className="absolute inset-0 flex pointer-events-auto" style={{ pointerEvents: showReply ? "none" : "auto" }}>
            <div
              className="flex-1 flex items-center"
              onClick={goPrev}
              onMouseDown={() => setPaused(true)}
              onMouseUp={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => { setPaused(false); }}
            >
              {gIdx > 0 || sIdx > 0 ? (
                <div className="ml-2">
                  <ChevronLeft className="w-8 h-8 text-white/40" />
                </div>
              ) : null}
            </div>
            <div
              className="flex-1 flex items-center justify-end"
              onClick={goNext}
              onMouseDown={() => setPaused(true)}
              onMouseUp={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => { setPaused(false); }}
            >
              <div className="mr-2">
                <ChevronRight className="w-8 h-8 text-white/40" />
              </div>
            </div>
          </div>
        </div>

        {/* View count */}
        {currentUserId === group.user.id && (
          <div className="relative z-10 px-4 pb-1">
            <p className="text-white/40 text-xs flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> {story.viewedBy.length} vue{story.viewedBy.length > 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Reply bar */}
        <div className="relative z-10 p-4 flex items-center gap-3">
          {!showReply ? (
            <>
              <button
                className="flex-1 rounded-full px-4 py-2.5 text-sm text-white/50 text-left"
                style={{ border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)" }}
                onClick={() => { setShowReply(true); setTimeout(() => inputRef.current?.focus(), 50); }}
              >
                Répondre à {group.user.username}…
              </button>
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setLiked(l => !l)}>
                <Heart className={`w-7 h-7 transition-all ${liked ? "fill-[#e8102a] text-[#e8102a] scale-125" : "text-white"}`} style={liked ? { filter: "drop-shadow(0 0 8px rgba(232,16,42,0.8))" } : {}} />
              </motion.button>
            </>
          ) : (
            <>
              <input
                ref={inputRef}
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder={`Répondre à ${group.user.username}…`}
                className="flex-1 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.08)" }}
                onKeyDown={e => { if (e.key === "Escape") { setShowReply(false); setReply(""); } if (e.key === "Enter" && reply.trim()) { setShowReply(false); setReply(""); } }}
              />
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => { if (reply.trim()) { setShowReply(false); setReply(""); } }} className="flex items-center justify-center w-9 h-9 rounded-full" style={{ background: reply ? "rgba(232,16,42,0.8)" : "rgba(255,255,255,0.1)" }}>
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </>
          )}
        </div>

        {/* User nav dots */}
        {groups.length > 1 && (
          <div className="relative z-10 flex justify-center gap-1 pb-4">
            {groups.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ background: i === gIdx ? "white" : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
        )}
      </div>

      {/* Side navigation */}
      {gIdx > 0 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={e => { e.stopPropagation(); setGIdx(g => g - 1); setSIdx(0); setProgress(0); }}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>
      )}
      {gIdx < groups.length - 1 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={e => { e.stopPropagation(); setGIdx(g => g + 1); setSIdx(0); setProgress(0); }}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      )}
    </motion.div>
  );
}
