import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Zap, Film, Music, Bot, MessageCircle, Users, Heart, Star, ArrowRight, Shield, Globe, TrendingUp, Play, ChevronDown, Sparkles, Flame } from "lucide-react";

// ── Typewriter ──
function Typewriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const word = words[idx];
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, charIdx + 1));
        if (charIdx + 1 === word.length) {
          setTimeout(() => setDeleting(true), 1400);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setText(word.slice(0, charIdx - 1));
        if (charIdx <= 1) {
          setDeleting(false);
          setIdx(i => (i + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? 40 : 70);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, words]);

  return (
    <span className="relative inline-block">
      <span style={{ background: "linear-gradient(135deg,#e8102a,#00c8ff,#9900ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{text}</span>
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-0.5 h-[0.85em] align-middle ml-0.5 rounded-full" style={{ background: "#e8102a", boxShadow: "0 0 8px rgba(232,16,42,0.8)" }} />
    </span>
  );
}

// ── Floating Particle ──
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: 3, height: 3, ...style }}
      animate={{
        y: [-20, -80],
        x: [0, (Math.random() - 0.5) * 60],
        opacity: [0, 0.6, 0],
        scale: [0.5, 1.2, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 4,
        ease: "easeOut",
      }}
    />
  );
}

// ── Animated Counter ──
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const step = value / (duration / 16);
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, value);
      setCount(Math.floor(cur));
      if (cur >= value) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);
  return <span ref={ref}>{count >= 1000000 ? `${(count / 1000000).toFixed(1)}M` : count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}{suffix}</span>;
}

const particles = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 4.1) % 100}%`,
  top: `${50 + (i % 5) * 10}%`,
  background: i % 3 === 0 ? "#e8102a" : i % 3 === 1 ? "#00c8ff" : "#9900ff",
  boxShadow: i % 3 === 0 ? "0 0 6px rgba(232,16,42,0.8)" : i % 3 === 1 ? "0 0 6px rgba(0,200,255,0.8)" : "0 0 6px rgba(153,0,255,0.8)",
}));

const features = [
  { icon: Zap, color: "#e8102a", label: "Stories & Feed", desc: "Partagez vos moments. Stories fullscreen, posts avec médias, likes, commentaires. Tout le monde voit tout." },
  { icon: Film, color: "#00c8ff", label: "Reels Vidéo", desc: "Scroll infini style TikTok. Vidéos immersives plein écran avec likes, partages et commentaires en temps réel." },
  { icon: Music, color: "#9900ff", label: "Musique Réelle", desc: "Previews officielles Dadju, Tayc, Tiakola, Ninho via Deezer. Lecteur avancé avec equalizer animé." },
  { icon: Bot, color: "#ff9900", label: "LYRA — IA Vocale", desc: "Assistante IA en français. Reconnaissance vocale, conversation intelligente, réponses contextuelles." },
  { icon: MessageCircle, color: "#39ff14", label: "Messages Privés", desc: "DMs temps réel avec BroadcastChannel, indicateurs de frappe, statut en ligne, notifications push." },
  { icon: Shield, color: "#00c8ff", label: "Paramètres Avancés", desc: "Confidentialité complète, 2FA, gestion du compte, notifications personnalisées — tout Instagram a." },
];

const testimonials = [
  { user: "neonqueen", color: "#00c8ff", text: "PlayQuest a révolutionné ma façon de partager du contenu. L'interface est d'une beauté hypnotique !", role: "Artiste numérique", stars: 5 },
  { user: "darkbyte", color: "#9900ff", text: "La vraie musique de Dadju et Tiakola directement dans l'app ! Et LYRA répond en français. Classe mondiale.", role: "Développeur", stars: 5 },
  { user: "shadowfox", color: "#ff9900", text: "Le meilleur réseau social cyberpunk. varnox•prime a créé quelque chose que même Instagram n'a pas.", role: "Photographe", stars: 5 },
  { user: "varnox", color: "#e8102a", text: "Le Story Viewer fullscreen avec progress bars est identique à Instagram. Qualité exceptionnelle.", role: "Créateur", stars: 5 },
];

const nav = [
  { label: "Accueil", href: "#hero" },
  { label: "Fonctionnalités", href: "#features" },
  { label: "Communauté", href: "#community" },
];

const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

// ── Phone mockup content ──
const MOCKUP_SCREENS = [
  { label: "Feed", content: (
    <div className="space-y-1.5">
      {["🔥 Trending", "✨ Neon Art", "🎵 Tayc Live"].map((t, i) => (
        <div key={i} className="h-10 rounded-lg flex items-center px-2.5" style={{ background: i === 0 ? "rgba(232,16,42,0.2)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <span className="text-[10px] text-white/60 font-medium">{t}</span>
        </div>
      ))}
    </div>
  )},
  { label: "Stories", content: (
    <div className="flex gap-2">
      {["red","blue","purple","green"].map((c, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-xl" style={{ background: `linear-gradient(135deg,${c === "red" ? "#e8102a" : c === "blue" ? "#00c8ff" : c === "purple" ? "#9900ff" : "#39ff14"},rgba(0,0,0,0.3))` }} />
          <div className="h-1 w-9 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  )},
  { label: "Explore", content: (
    <div className="grid grid-cols-3 gap-1">
      {["#e8102a30","#00c8ff30","#9900ff30","#ff990030","#39ff1430","#e8102a20"].map((bg, i) => (
        <div key={i} className="aspect-square rounded-lg" style={{ background: bg, border: "1px solid rgba(255,255,255,0.05)" }} />
      ))}
    </div>
  )},
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mockupIdx, setMockupIdx] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setMockupIdx(i => (i + 1) % MOCKUP_SCREENS.length), 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#04040a", color: "#e8e8f0" }}>

      {/* ── Aurora Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="aurora-blob aurora-1"
        />
        <motion.div
          animate={{ scale: [1, 0.88, 1.1, 1], rotate: [0, -12, 6, 0], x: [0, -40, 20, 0], y: [0, 50, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="aurora-blob aurora-2"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 0.9, 1], x: [0, 60, -30, 0], y: [0, -40, 60, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="aurora-blob aurora-3"
        />
        <motion.div
          animate={{ scale: [1, 0.85, 1.15, 1], x: [0, -30, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="aurora-blob aurora-4"
        />
        {/* Cyber grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(0,200,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.6) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        {/* Scanlines */}
        <div className="absolute inset-0 opacity-[0.018]" style={{ background: "repeating-linear-gradient(transparent,transparent 2px,rgba(0,0,0,0.4) 2px,rgba(0,0,0,0.4) 4px)" }} />
        {/* Floating particles */}
        {particles.map((p, i) => (
          <Particle key={i} style={{ left: p.left, top: p.top, background: p.background, boxShadow: p.boxShadow }} />
        ))}
      </div>

      {/* ── Navbar ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? "rgba(4,4,10,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-2.5">
            <motion.div
              animate={{ boxShadow: ["0 0 16px rgba(232,16,42,0.5)", "0 0 28px rgba(232,16,42,0.8)", "0 0 16px rgba(232,16,42,0.5)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)" }}
            >
              <Zap className="w-4 h-4 text-white" fill="white" />
            </motion.div>
            <span className="text-lg font-black" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>PlayQuest</span>
          </motion.div>
          <nav className="hidden md:flex items-center gap-6">
            {nav.map(n => (
              <a key={n.label} href={n.href} className="text-sm text-[#e8e8f0]/45 hover:text-[#e8e8f0] transition-colors font-medium">{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-[#e8e8f0]/50 hover:text-[#e8e8f0] transition-colors px-4 py-1.5 font-medium">Connexion</Link>
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(232,16,42,0.6)" }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 20px rgba(232,16,42,0.35)" }}
              >
                Rejoindre ✦
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section ref={heroRef} id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-10 z-10">
        <motion.style style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 pointer-events-none" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 cursor-default"
          style={{ background: "rgba(232,16,42,0.08)", border: "1px solid rgba(232,16,42,0.3)", color: "#e8102a" }}
        >
          <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-[#39ff14]" style={{ boxShadow: "0 0 8px rgba(57,255,20,0.8)" }} />
          ✦ Plateforme 2026 — Version 2.0 • Musique réelle incluse
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.92] mb-4"
          style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-3px" }}
        >
          <span style={{ background: "linear-gradient(135deg,#fff 0%,rgba(232,232,240,0.65) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Le réseau social
          </span>
          <br />
          <span className="block mt-1">
            <Typewriter words={["de nouvelle génération", "façon Instagram", "avec vraie musique", "100% cyberpunk"]} />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-base md:text-lg text-[#e8e8f0]/45 max-w-xl mb-10 leading-relaxed"
        >
          Stories fullscreen, Reels, Dadju · Tayc · Tiakola en streaming, IA vocale LYRA, messages temps réel — PlayQuest redéfinit l'expérience sociale.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <Link to="/register">
            <motion.div
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white"
              style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 40px rgba(232,16,42,0.5), 0 8px 32px rgba(232,16,42,0.3)" }}
            >
              <Sparkles className="w-5 h-5" /> Créer mon compte gratuit <ArrowRight className="w-5 h-5" />
            </motion.div>
          </Link>
          <Link to="/login">
            <motion.div
              whileHover={{ scale: 1.04, y: -1 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e8f0", backdropFilter: "blur(8px)" }}
            >
              <Play className="w-4 h-4" fill="currentColor" /> Se connecter
            </motion.div>
          </Link>
        </motion.div>

        {/* Mockup card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg mx-auto"
        >
          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -left-8 z-20 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hidden sm:flex"
            style={{ background: "rgba(57,255,20,0.12)", border: "1px solid rgba(57,255,20,0.3)", color: "#39ff14", boxShadow: "0 0 20px rgba(57,255,20,0.15)" }}
          >
            <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-[#39ff14]" />
            12.4K membres actifs
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0], rotate: [2, -2, 2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -top-4 -right-6 z-20 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hidden sm:flex"
            style={{ background: "rgba(232,16,42,0.12)", border: "1px solid rgba(232,16,42,0.3)", color: "#e8102a", boxShadow: "0 0 20px rgba(232,16,42,0.15)" }}
          >
            <Flame className="w-3 h-3" /> #1 Cyberpunk 2026
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-4 -right-6 z-20 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hidden sm:flex"
            style={{ background: "rgba(0,200,255,0.12)", border: "1px solid rgba(0,200,255,0.3)", color: "#00c8ff", boxShadow: "0 0 20px rgba(0,200,255,0.15)" }}
          >
            <Music className="w-3 h-3" /> Tayc · Dadju · Tiakola
          </motion.div>

          {/* Device frame */}
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{ background: "rgba(10,10,18,0.96)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 80px rgba(232,16,42,0.06), inset 0 1px 0 rgba(255,255,255,0.05)" }}
          >
            {/* Notch bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 12px rgba(232,16,42,0.5)" }}>
                  <Zap className="w-3 h-3 text-white" fill="white" />
                </div>
                <span className="text-sm font-black" style={{ background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PlayQuest</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] text-[#e8e8f0]/30 font-medium">{MOCKUP_SCREENS[mockupIdx].label}</div>
                <div className="flex gap-1">
                  {MOCKUP_SCREENS.map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full transition-all" style={{ background: i === mockupIdx ? "#e8102a" : "rgba(255,255,255,0.15)", boxShadow: i === mockupIdx ? "0 0 4px rgba(232,16,42,0.8)" : "none" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Mock content */}
            <div className="p-4 min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mockupIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {MOCKUP_SCREENS[mockupIdx].content}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom nav */}
            <div className="flex justify-around px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {[Zap, Film, Music, MessageCircle, Bot].map((Icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <Icon className="w-4 h-4" style={{ color: i === 0 ? "#e8102a" : "rgba(232,232,240,0.25)", filter: i === 0 ? "drop-shadow(0 0 6px rgba(232,16,42,0.8))" : "none" }} />
                  {i === 0 && <div className="w-1 h-1 rounded-full" style={{ background: "#e8102a", boxShadow: "0 0 4px rgba(232,16,42,0.8)" }} />}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Glow under card */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-10 blur-3xl" style={{ background: "rgba(232,16,42,0.18)" }} />
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <span className="text-[10px] text-[#e8e8f0]/25 font-medium uppercase tracking-widest">Découvrir</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5 text-[#e8e8f0]/25" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 12400, suffix: "+", label: "Membres actifs", color: "#e8102a" },
            { value: 58000, suffix: "+", label: "Posts partagés", color: "#00c8ff" },
            { value: 1200000, suffix: "+", label: "Likes échangés", color: "#9900ff" },
            { value: 99, suffix: "%", label: "Satisfaction", color: "#39ff14" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="text-center p-5 rounded-2xl cursor-default"
              style={{ background: "rgba(10,10,18,0.85)", border: `1px solid ${stat.color}20`, backdropFilter: "blur(12px)" }}
            >
              <p className="text-3xl font-black mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif", background: `linear-gradient(135deg,${stat.color},${stat.color}90)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-[#e8e8f0]/35 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px mb-6 mx-auto max-w-xs"
              style={{ background: "linear-gradient(90deg,transparent,rgba(232,16,42,0.6),transparent)" }}
            />
            <p className="text-xs font-bold tracking-widest uppercase text-[#e8102a] mb-3">✦ Fonctionnalités</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-1.5px" }}>
              Tout ce qu'Instagram a,<br />
              <span style={{ background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>en 10× plus avancé</span>
            </h2>
            <p className="text-[#e8e8f0]/40 max-w-xl mx-auto">PlayQuest combine toutes les fonctionnalités que tu aimes dans une seule plateforme cyberpunk premium.</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group p-6 rounded-2xl relative overflow-hidden cursor-default"
                style={{ background: "rgba(10,10,18,0.9)", border: `1px solid ${f.color}18`, backdropFilter: "blur(16px)", transition: "box-shadow 0.3s" }}
                onHoverStart={e => { (e.target as HTMLElement).style.boxShadow = `0 0 30px ${f.color}15, 0 12px 40px rgba(0,0,0,0.5)`; }}
                onHoverEnd={e => { (e.target as HTMLElement).style.boxShadow = "none"; }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${f.color}50,transparent)` }} />
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color, filter: `drop-shadow(0 0 8px ${f.color}60)` }} />
                </div>
                <h3 className="text-base font-bold text-[#e8e8f0] mb-2">{f.label}</h3>
                <p className="text-sm text-[#e8e8f0]/42 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Social proof — Music section ── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-3xl overflow-hidden relative" style={{ background: "rgba(10,10,18,0.95)", border: "1px solid rgba(153,0,255,0.15)" }}>
            <div className="absolute inset-0 opacity-15" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(153,0,255,0.4), transparent 60%)" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-xs font-bold tracking-widest uppercase text-[#9900ff] mb-2">🎵 Musique Réelle</p>
                <h3 className="text-2xl md:text-3xl font-black mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                  Dadju · Tayc · Tiakola<br />
                  <span style={{ background: "linear-gradient(135deg,#9900ff,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Ninho · Imen Es</span>
                </h3>
                <p className="text-sm text-[#e8e8f0]/45 leading-relaxed">Previews officielles 30s via Deezer Public API. Pochettes d'albums réelles. Lecteur avancé avec EQ animé, shuffle, repeat et mode plein écran.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                {[
                  { name: "Tiakola", song: "Mélo Décalé", color: "#e8102a" },
                  { name: "Dadju", song: "Oublie-le", color: "#00c8ff" },
                  { name: "Tayc", song: "Fanta Diallo", color: "#9900ff" },
                ].map(({ name, song, color }) => (
                  <div key={name} className="w-16 h-16 rounded-2xl flex items-center justify-center flex-col gap-0.5" style={{ background: `linear-gradient(135deg,${color}30,${color}10)`, border: `1px solid ${color}30` }}>
                    <Music className="w-5 h-5" style={{ color }} />
                    <span className="text-[8px] text-white/40 font-medium text-center leading-tight">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="community" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-[#00c8ff] mb-3">✦ Communauté</p>
            <h2 className="text-4xl font-black mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-1px" }}>Ce qu'ils en pensent</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl relative overflow-hidden"
                style={{ background: "rgba(10,10,18,0.92)", border: `1px solid ${t.color}15`, backdropFilter: "blur(16px)" }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl" style={{ background: `${t.color}10` }} />
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-3 h-3 fill-[#ff9900] text-[#ff9900]" />)}
                </div>
                <p className="text-sm text-[#e8e8f0]/65 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: t.color, boxShadow: `0 0 14px ${t.color}60` }}>
                    {t.user.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#e8e8f0]">@{t.user}</p>
                    <p className="text-[11px] text-[#e8e8f0]/30">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-12 rounded-3xl relative overflow-hidden" style={{ background: "rgba(10,10,18,0.98)", border: "1px solid rgba(232,16,42,0.2)", boxShadow: "0 40px 120px rgba(0,0,0,0.8)" }}>
            <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(232,16,42,0.5), transparent 70%)" }} />
            <div className="absolute top-0 left-1/4 right-1/4 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(232,16,42,0.8),rgba(0,200,255,0.8),transparent)" }} />
            <div className="relative z-10">
              <motion.div
                animate={{ boxShadow: ["0 0 30px rgba(232,16,42,0.5)", "0 0 50px rgba(232,16,42,0.8)", "0 0 30px rgba(232,16,42,0.5)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)" }}
              >
                <Zap className="w-7 h-7 text-white" fill="white" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-1.5px" }}>
                Prêt à rejoindre<br />
                <span style={{ background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PlayQuest ?</span>
              </h2>
              <p className="text-[#e8e8f0]/45 mb-8">Rejoins des milliers de créateurs sur la plateforme sociale la plus avancée de 2026.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <motion.div whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 40px rgba(232,16,42,0.45)" }}>
                    <Sparkles className="w-5 h-5" /> Créer mon compte <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
                <Link to="/login" className="text-sm text-[#e8e8f0]/45 hover:text-[#e8e8f0] transition-colors font-medium">
                  Déjà membre ? Se connecter →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 pt-14 pb-10 px-6 border-t text-center" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.5)" }}>
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { label: "GitHub", href: "https://github.com/Med12-q/PlayQuest", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>, disabled: false },
            { label: "YouTube", href: null, icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, disabled: true },
            { label: "WhatsApp", href: "https://whatsapp.com/channel/0029Vb83R524SpkBdSM6Ob2F", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>, disabled: false },
            { label: "Telegram", href: "https://t.me/varnox_official", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>, disabled: false },
            { label: "Email", href: "mailto:varnoxnovark@gmail.com", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, disabled: false },
          ].map(({ label, href, icon, disabled }) => {
            const El = href ? "a" : "button";
            return (
              <motion.div key={label} whileHover={disabled ? {} : { scale: 1.15, y: -3 }} whileTap={disabled ? {} : { scale: 0.9 }}>
                <El
                  {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={label}
                  title={disabled ? "Bientôt disponible" : label}
                  className="w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.06)", color: disabled ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.5)", cursor: disabled ? "not-allowed" : "pointer", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {icon}
                </El>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-3">
          <span className="text-[#e8e8f0]/18 text-xs">Propulsé par </span>
          <span className="text-xs font-semibold" style={{ background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>varnox•prime</span>
          <span className="text-[#e8e8f0]/18 text-xs"> | Innovation & Excellence</span>
        </div>
        <p className="text-[#e8e8f0]/14 text-xs">
          ✦ 2026 PlayQuest by{" "}
          <span style={{ background: "linear-gradient(135deg,#e8102a,#ff6b35,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>
            𝐕𝚫𝚪𝐍𝐎𝐗
          </span>
        </p>
      </footer>
    </div>
  );
}
