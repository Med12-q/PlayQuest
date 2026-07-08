import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart,
  Shuffle, Repeat, Music2, ChevronDown, ChevronUp, Loader2, Radio,
} from "lucide-react";
import Layout from "@/components/Layout";

const DEEZER_IDS = [
  4059400101, // Tiakola - Mélo Décalé
  1759430967, // Tiakola - Meuda
  664661662,  // Tiakola - Sombre mélodie
  429974972,  // Dadju - Oublie-le
  1390738122, // Dadju - Mon soleil
  2570360062, // Dadju - I love you
  3957340411, // Tayc - FANTA DIALLO
  3938003381, // Tayc - GIRLFRIEND
  4075293631, // Tayc - Réanymé
  652380172,  // Ninho - La vie qu'on mène
  3266152531, // Imen Es - 1ère fois
  3835911331, // Imen Es - Essaie encore
];

const ARTIST_COLORS: Record<string, string> = {
  "Tiakola": "#e8102a",
  "Dadju": "#00c8ff",
  "Tayc": "#9900ff",
  "Ninho": "#ff9900",
  "Imen Es": "#39ff14",
};

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  preview: string;
  duration: number;
  color: string;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function EqBars({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-0.5 h-4 w-4">
      {[1, 2, 3].map(b => (
        <motion.div
          key={b}
          className="flex-1 rounded-sm"
          style={{ background: color }}
          animate={{ height: ["30%", "100%", "50%", "80%", "30%"] }}
          transition={{ duration: 0.7 + b * 0.15, repeat: Infinity, ease: "easeInOut", delay: b * 0.12 }}
        />
      ))}
    </div>
  );
}

export default function MusicPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch fresh Deezer preview URLs on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("pq_deezer_tracks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) { setTracks(parsed); setLoading(false); return; }
      } catch { /* ignore */ }
    }
    Promise.all(
      DEEZER_IDS.map(id =>
        fetch(`https://api.deezer.com/track/${id}`)
          .then(r => r.json())
          .then(t => ({
            id: String(t.id),
            title: t.title,
            artist: t.artist.name,
            album: t.album.title,
            cover: t.album.cover_medium || `https://cdn-images.dzcdn.net/images/cover/${t.album.id}/250x250-000000-80-0-0.jpg`,
            preview: t.preview,
            duration: t.duration,
            color: ARTIST_COLORS[t.artist.name] || "#e8102a",
          }))
          .catch(() => null)
      )
    ).then(results => {
      const valid = results.filter(Boolean) as Track[];
      setTracks(valid);
      try { sessionStorage.setItem("pq_deezer_tracks", JSON.stringify(valid)); } catch { /* ignore */ }
      setLoading(false);
    });
  }, []);

  const track = tracks[currentIdx];

  const play = useCallback(() => {
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);
  const pause = useCallback(() => { audioRef.current?.pause(); setIsPlaying(false); }, []);
  const togglePlay = useCallback(() => { if (isPlaying) pause(); else play(); }, [isPlaying, play, pause]);

  const playTrack = useCallback((idx: number) => {
    setCurrentIdx(idx); setProgress(0); setCurrentTime(0);
    setTimeout(() => {
      audioRef.current?.load();
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
    }, 60);
  }, []);

  const next = useCallback(() => {
    if (tracks.length === 0) return;
    const idx = shuffle ? Math.floor(Math.random() * tracks.length) : (currentIdx + 1) % tracks.length;
    playTrack(idx);
  }, [currentIdx, shuffle, tracks.length, playTrack]);

  const prev = useCallback(() => {
    if (currentTime > 3) { audioRef.current!.currentTime = 0; return; }
    playTrack((currentIdx - 1 + tracks.length) % tracks.length);
  }, [currentIdx, currentTime, tracks.length, playTrack]);

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
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  const toggleLike = (id: string) => {
    setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg,#0a0a0f,#0d0d18)" }}>
          <div className="text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Loader2 className="w-10 h-10 text-[#e8102a] mx-auto mb-4" />
            </motion.div>
            <p className="text-[#e8e8f0]/50 text-sm">Chargement de la musique…</p>
            <p className="text-[#e8e8f0]/25 text-xs mt-1">Connexion à Deezer</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!track) return null;

  return (
    <Layout>
      <audio ref={audioRef} src={track.preview} preload="metadata" crossOrigin="anonymous" />

      <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#0a0a0f 0%,#0d0d18 100%)" }}>
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-32">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Musique</h1>
              <p className="text-[#e8e8f0]/35 text-xs mt-0.5 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#39ff14]" style={{ filter: "drop-shadow(0 0 4px rgba(57,255,20,0.8))" }} />
                Previews officielles via Deezer
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" style={{ boxShadow: "0 0 6px rgba(57,255,20,0.8)" }} />
              <span className="text-[11px] text-[#39ff14] font-semibold">LIVE</span>
            </div>
          </div>

          {/* Now Playing Card */}
          <motion.div
            layout
            className="rounded-3xl overflow-hidden mb-5 relative"
            style={{ background: `linear-gradient(135deg,${track.color}20,rgba(10,10,15,0.97))`, border: `1px solid ${track.color}33`, boxShadow: `0 0 60px ${track.color}20, 0 20px 60px rgba(0,0,0,0.6)` }}
          >
            <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at 70% 0%, ${track.color}, transparent 60%)` }} />
            <div className="relative z-10 p-5">
              {/* Track header */}
              <div className="flex items-center gap-4 mb-5">
                <motion.div
                  animate={isPlaying ? { scale: [1, 1.04, 1], rotate: [0, 2, -2, 0] } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex-shrink-0"
                >
                  <img
                    src={track.cover}
                    alt={track.album}
                    className="w-20 h-20 rounded-2xl object-cover"
                    style={{ boxShadow: `0 0 30px ${track.color}66, 0 8px 24px rgba(0,0,0,0.5)` }}
                    onError={e => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = "none";
                      (t.nextElementSibling as HTMLElement)!.style.display = "flex";
                    }}
                  />
                  <div className="w-20 h-20 rounded-2xl hidden items-center justify-center" style={{ background: `linear-gradient(135deg,${track.color},${track.color}66)` }}>
                    <Music2 className="w-9 h-9 text-white" />
                  </div>
                  {isPlaying && (
                    <div className="absolute bottom-2 right-2">
                      <EqBars color="white" />
                    </div>
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-lg leading-tight truncate">{track.title}</p>
                  <p className="font-semibold text-sm truncate mt-0.5" style={{ color: track.color }}>{track.artist}</p>
                  <p className="text-white/40 text-xs mt-0.5 truncate">{track.album}</p>
                  <p className="text-white/25 text-[10px] mt-1">⚡ Extrait 30s — Deezer</p>
                </div>
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleLike(track.id)}>
                  <Heart
                    className={`w-5 h-5 transition-all ${liked.has(track.id) ? "fill-[#e8102a] text-[#e8102a]" : "text-white/40"}`}
                    style={liked.has(track.id) ? { filter: "drop-shadow(0 0 8px rgba(232,16,42,0.8))" } : {}}
                  />
                </motion.button>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="h-1 rounded-full bg-white/10 cursor-pointer mb-1" onClick={seek}>
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{ width: `${progress}%`, background: `linear-gradient(90deg,${track.color}cc,${track.color})`, boxShadow: `0 0 8px ${track.color}80` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white" style={{ boxShadow: `0 0 8px ${track.color}` }} />
                  </motion.div>
                </div>
                <div className="flex justify-between text-xs text-white/30">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration || track.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShuffle(!shuffle)} style={{ color: shuffle ? track.color : "rgba(255,255,255,0.35)" }}>
                  <Shuffle className="w-5 h-5" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.85 }} onClick={prev} className="text-white/70 hover:text-white">
                  <SkipBack className="w-7 h-7" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg,${track.color},${track.color}99)`, boxShadow: `0 0 30px ${track.color}80, 0 4px 20px rgba(0,0,0,0.4)` }}
                >
                  {isPlaying
                    ? <Pause className="w-7 h-7 text-white fill-white" />
                    : <Play className="w-7 h-7 text-white fill-white ml-1" />
                  }
                </motion.button>
                <motion.button whileTap={{ scale: 0.85 }} onClick={next} className="text-white/70 hover:text-white">
                  <SkipForward className="w-7 h-7" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setRepeat(!repeat)} style={{ color: repeat ? track.color : "rgba(255,255,255,0.35)" }}>
                  <Repeat className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Volume */}
          <div className="flex items-center gap-3 mb-5 px-1">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-4 h-4 text-[#e8e8f0]/30" /> : <Volume2 className="w-4 h-4 text-[#e8e8f0]/30" />}
            </motion.button>
            <div className="flex-1 relative">
              <input
                type="range" min={0} max={1} step={0.01}
                value={isMuted ? 0 : volume}
                onChange={e => { setVolume(Number(e.target.value)); setIsMuted(false); }}
                className="w-full h-1 rounded-full cursor-pointer accent-[#e8102a]"
                style={{ background: `linear-gradient(to right, #e8102a ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) 0%)` }}
              />
            </div>
            <Volume2 className="w-4 h-4 text-[#e8e8f0]/50" />
          </div>

          {/* Playlist */}
          <div className="mb-2">
            <h2 className="text-xs font-semibold text-[#e8e8f0]/40 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Music2 className="w-3.5 h-3.5" /> Playlist — {tracks.length} titres
            </h2>
          </div>
          <div className="space-y-1">
            {tracks.map((t, i) => {
              const isActive = i === currentIdx;
              return (
                <motion.button
                  key={t.id}
                  whileHover={{ x: 3 }}
                  onClick={() => playTrack(i)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all"
                  style={{ background: isActive ? `${t.color}12` : "rgba(255,255,255,0.02)", border: isActive ? `1px solid ${t.color}30` : "1px solid transparent" }}
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ boxShadow: isActive ? `0 0 14px ${t.color}50` : "none" }}>
                    <img src={t.cover} alt="" className="w-full h-full object-cover" onError={e => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                      (img.nextElementSibling as HTMLElement)!.style.display = "flex";
                    }} />
                    <div className="w-full h-full hidden items-center justify-center" style={{ background: `linear-gradient(135deg,${t.color}80,${t.color}40)` }}>
                      <Music2 className="w-5 h-5 text-white" />
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)" }}>
                        {isPlaying ? <EqBars color="white" /> : <Play className="w-4 h-4 text-white fill-white" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold truncate leading-tight" style={{ color: isActive ? t.color : "#e8e8f0" }}>{t.title}</p>
                    <p className="text-[11px] text-[#e8e8f0]/35 truncate mt-0.5">{t.artist} · {t.album}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button whileTap={{ scale: 0.8 }} onClick={e => { e.stopPropagation(); toggleLike(t.id); }}>
                      <Heart
                        className={`w-4 h-4 transition-all ${liked.has(t.id) ? "fill-[#e8102a] text-[#e8102a]" : "text-white/25 hover:text-white/50"}`}
                      />
                    </motion.button>
                    <span className="text-xs text-[#e8e8f0]/25 w-8 text-right">{formatTime(t.duration)}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <p className="text-center text-[10px] text-[#e8e8f0]/15 mt-8">✦ Previews 30s • Deezer Public API • PlayQuest 2026</p>
        </div>
      </div>
    </Layout>
  );
}
