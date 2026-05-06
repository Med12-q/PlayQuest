import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Shuffle, Repeat, Music, ChevronDown, ChevronUp } from "lucide-react";
import Layout from "@/components/Layout";

const TRACKS = [
  { id: "t1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", title: "Neon Nights", artist: "CyberBeats", album: "Digital Dreams", color: "#e8102a", duration: 372 },
  { id: "t2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", title: "Electric Soul", artist: "NeonQueen", album: "Cyberpunk Sessions", color: "#00c8ff", duration: 411 },
  { id: "t3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", title: "Dark Voltage", artist: "DarkByte", album: "Code & Bass", color: "#9900ff", duration: 358 },
  { id: "t4", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", title: "Shadow Protocol", artist: "ShadowFox", album: "Night Sessions", color: "#ff9900", duration: 395 },
  { id: "t5", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", title: "Quantum Pulse", artist: "AlexVX", album: "Dev Vibes", color: "#39ff14", duration: 428 },
  { id: "t6", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", title: "Varnox Prime", artist: "VARNOX", album: "PlayQuest OST", color: "#e8102a", duration: 385 },
  { id: "t7", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", title: "Neural Drift", artist: "CyberBeats", album: "AI Dreams", color: "#00c8ff", duration: 402 },
  { id: "t8", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", title: "Glitch Storm", artist: "NeonQueen", album: "Static", color: "#ff6600", duration: 367 },
];

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function MusicPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  const track = TRACKS[currentIdx];

  const play = useCallback(() => {
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause(); else play();
  }, [isPlaying, play, pause]);

  const playTrack = useCallback((idx: number) => {
    setCurrentIdx(idx);
    setProgress(0);
    setCurrentTime(0);
    setTimeout(() => {
      audioRef.current?.load();
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
    }, 50);
  }, []);

  const next = useCallback(() => {
    const idx = shuffle ? Math.floor(Math.random() * TRACKS.length) : (currentIdx + 1) % TRACKS.length;
    playTrack(idx);
  }, [currentIdx, shuffle, playTrack]);

  const prev = useCallback(() => {
    if (currentTime > 3) { audioRef.current!.currentTime = 0; return; }
    playTrack((currentIdx - 1 + TRACKS.length) % TRACKS.length);
  }, [currentIdx, currentTime, playTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => { if (repeat) { audio.currentTime = 0; audio.play(); } else next(); };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [next, repeat, volume, isMuted]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  const toggleLike = (id: string) => {
    setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const bgGradient = `linear-gradient(135deg, ${track.color}22, rgba(10,10,15,0.95))`;

  return (
    <Layout>
      <audio ref={audioRef} src={track.url} preload="metadata" />
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0d0d18 100%)" }}>
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-32">
          <h1 className="text-2xl font-bold gradient-text mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Musique</h1>
          <p className="text-[#e8e8f0]/40 text-sm mb-6">Écouter en temps réel</p>

          {/* Now Playing Card */}
          <motion.div className="rounded-3xl p-6 mb-6 relative overflow-hidden cursor-pointer" style={{ background: bgGradient, border: `1px solid ${track.color}33` }} onClick={() => setShowFullPlayer(true)}>
            <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 70% 30%, ${track.color}, transparent 60%)` }} />
            <div className="flex items-center gap-4 relative z-10">
              {/* Album art */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 relative" style={{ background: `linear-gradient(135deg, ${track.color}, ${track.color}66)`, boxShadow: `0 0 30px ${track.color}66` }}>
                <Music className="w-9 h-9 text-white" />
                {isPlaying && (
                  <div className="absolute -inset-1 rounded-2xl animate-pulse" style={{ background: `${track.color}33` }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-lg truncate">{track.title}</p>
                <p className="text-white/60 text-sm truncate">{track.artist}</p>
                <p className="text-white/40 text-xs">{track.album}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); toggleLike(track.id); }}>
                <Heart className="w-5 h-5" fill={liked.has(track.id) ? "#e8102a" : "none"} style={{ color: liked.has(track.id) ? "#e8102a" : "rgba(255,255,255,0.4)" }} />
              </button>
            </div>

            {/* Progress */}
            <div className="mt-4 relative z-10">
              <div className="h-1.5 rounded-full bg-white/10 cursor-pointer" onClick={seek}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: track.color, boxShadow: `0 0 8px ${track.color}` }} />
              </div>
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || track.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-3 relative z-10">
              <button onClick={e => { e.stopPropagation(); setShuffle(!shuffle); }} style={{ color: shuffle ? track.color : "rgba(255,255,255,0.4)" }}>
                <Shuffle className="w-5 h-5" />
              </button>
              <button onClick={e => { e.stopPropagation(); prev(); }} className="text-white/70 hover:text-white">
                <SkipBack className="w-7 h-7" />
              </button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); togglePlay(); }} className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: track.color, boxShadow: `0 0 24px ${track.color}80` }}>
                {isPlaying ? <Pause className="w-6 h-6 text-white" fill="white" /> : <Play className="w-6 h-6 text-white ml-0.5" fill="white" />}
              </motion.button>
              <button onClick={e => { e.stopPropagation(); next(); }} className="text-white/70 hover:text-white">
                <SkipForward className="w-7 h-7" />
              </button>
              <button onClick={e => { e.stopPropagation(); setRepeat(!repeat); }} style={{ color: repeat ? track.color : "rgba(255,255,255,0.4)" }}>
                <Repeat className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Volume */}
          <div className="flex items-center gap-3 mb-6 px-2">
            <button onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-4 h-4 text-[#e8e8f0]/40" /> : <Volume2 className="w-4 h-4 text-[#e8e8f0]/40" />}
            </button>
            <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} onChange={e => { setVolume(Number(e.target.value)); setIsMuted(false); }} className="flex-1 h-1 rounded-full accent-[#e8102a] cursor-pointer" style={{ background: `linear-gradient(to right, #e8102a ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
            <Volume2 className="w-5 h-5 text-[#e8e8f0]/40" />
          </div>

          {/* Track list */}
          <h2 className="text-sm font-semibold text-[#e8e8f0]/50 uppercase tracking-wider mb-3">Liste de lecture</h2>
          <div className="space-y-1">
            {TRACKS.map((t, i) => {
              const isActive = i === currentIdx;
              return (
                <motion.button key={t.id} whileHover={{ x: 4 }} onClick={() => playTrack(i)} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all" style={{ background: isActive ? `${t.color}18` : "transparent", border: isActive ? `1px solid ${t.color}33` : "1px solid transparent" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${t.color}80, ${t.color}30)` }}>
                    {isActive && isPlaying ? (
                      <div className="flex items-end gap-0.5 h-5">
                        {[1, 2, 3].map(b => (
                          <motion.div key={b} className="w-1 rounded-full" style={{ background: t.color }} animate={{ height: ["40%", "100%", "60%", "100%", "40%"] }} transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.15 }} />
                        ))}
                      </div>
                    ) : (
                      <Music className="w-5 h-5" style={{ color: t.color }} />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: isActive ? t.color : "#e8e8f0" }}>{t.title}</p>
                    <p className="text-xs text-[#e8e8f0]/40 truncate">{t.artist} · {t.album}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); toggleLike(t.id); }}>
                      <Heart className="w-4 h-4" fill={liked.has(t.id) ? "#e8102a" : "none"} style={{ color: liked.has(t.id) ? "#e8102a" : "rgba(232,232,240,0.3)" }} />
                    </button>
                    <span className="text-xs text-[#e8e8f0]/30">{formatTime(t.duration)}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
