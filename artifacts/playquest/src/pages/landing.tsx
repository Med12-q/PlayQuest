import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Zap, Film, Music, Bot, MessageCircle, Users, Heart, Star, ArrowRight, Shield, Globe, TrendingUp, Play, ChevronDown } from "lucide-react";

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
  return <span ref={ref}>{count.toLocaleString("fr-FR")}{suffix}</span>;
}

const features = [
  { icon: Film, color: "#e8102a", label: "Reels Vidéo", desc: "Scroll infini TikTok-style. Vidéos immersives plein écran, likes, partages." },
  { icon: Music, color: "#00c8ff", label: "Musique Live", desc: "Streaming intégré avec playlist complète. Contrôles avancés, equalizer animé." },
  { icon: Bot, color: "#9900ff", label: "LYRA — IA Vocale", desc: "Assistante IA vocale en français. Reconnaissance vocale, réponses intelligentes." },
  { icon: MessageCircle, color: "#ff9900", label: "Messages Temps Réel", desc: "Conversations privées, indicateurs de frappe, statut en ligne instantané." },
  { icon: Users, color: "#39ff14", label: "Communauté", desc: "Réseau social complet. Profils, follows, stories, commentaires, notifications." },
  { icon: TrendingUp, color: "#00c8ff", label: "Dashboard Analytics", desc: "Statistiques personnelles, graphiques d'activité, insights de performance." },
];

const testimonials = [
  { user: "neonqueen", color: "#00c8ff", text: "PlayQuest a complètement changé ma façon de partager du contenu. Interface incroyable !", role: "Artiste numérique" },
  { user: "darkbyte", color: "#9900ff", text: "La section Reels est addictive. Et LYRA répond en français ! Produit de classe mondiale.", role: "Développeur" },
  { user: "shadowfox", color: "#ff9900", text: "La meilleure plateforme sociale cyberpunk. varnox•prime a créé quelque chose d'unique.", role: "Photographe" },
];

const nav = [
  { label: "Accueil", href: "#hero" },
  { label: "Fonctionnalités", href: "#features" },
  { label: "Communauté", href: "#community" },
];

const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#06060d", color: "#e8e8f0" }}>

      {/* ── Aurora Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="aurora-blob aurora-1" />
        <div className="aurora-blob aurora-2" />
        <div className="aurora-blob aurora-3" />
        <div className="aurora-blob aurora-4" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(0,200,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={{ background: scrolled ? "rgba(6,6,13,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 16px rgba(232,16,42,0.5)" }}>
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PlayQuest</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {nav.map(n => (
              <a key={n.label} href={n.href} className="text-sm text-[#e8e8f0]/50 hover:text-[#e8e8f0] transition-colors">{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-[#e8e8f0]/60 hover:text-[#e8e8f0] transition-colors px-4 py-1.5">Connexion</Link>
            <Link to="/register">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 20px rgba(232,16,42,0.4)" }}>
                Rejoindre
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-10 z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8" style={{ background: "rgba(232,16,42,0.08)", border: "1px solid rgba(232,16,42,0.25)", color: "#e8102a" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14]" style={{ boxShadow: "0 0 6px rgba(57,255,20,0.8)" }} />
          Plateforme 2026 — Version 2.0 disponible
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.95] mb-6" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-3px" }}>
          <span style={{ background: "linear-gradient(135deg,#fff 0%,rgba(232,232,240,0.7) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Le réseau social</span>
          <br />
          <span className="hero-gradient-text">de nouvelle génération</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-base md:text-xl text-[#e8e8f0]/50 max-w-xl mb-10 leading-relaxed">
          Reels, musique live, IA vocale, messages temps réel — PlayQuest redéfinit l'expérience sociale avec une esthétique cyberpunk premium.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link to="/register">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold text-white" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 40px rgba(232,16,42,0.45), 0 8px 32px rgba(232,16,42,0.3)" }}>
              Créer un compte gratuit <ArrowRight className="w-5 h-5" />
            </motion.div>
          </Link>
          <Link to="/login">
            <motion.div whileHover={{ scale: 1.04, y: -1 }} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e8f0" }}>
              <Play className="w-4 h-4" /> Se connecter
            </motion.div>
          </Link>
        </motion.div>

        {/* Platform mockup card */}
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="relative w-full max-w-2xl mx-auto">
          <div className="rounded-3xl overflow-hidden" style={{ background: "rgba(14,14,22,0.9)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(232,16,42,0.08)" }}>
            {/* Mockup header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)" }}>
                  <Zap className="w-3 h-3 text-white" fill="white" />
                </div>
                <span className="text-sm font-bold" style={{ background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PlayQuest</span>
              </div>
              <div className="flex gap-1.5">
                {["#e8102a","#ff9900","#39ff14"].map((c,i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />)}
              </div>
            </div>
            {/* Mock feed */}
            <div className="p-5 grid grid-cols-3 gap-2">
              {[
                { gradient: "linear-gradient(135deg,#e8102a,#ff6b35)", label: "🔥 Trending" },
                { gradient: "linear-gradient(135deg,#00c8ff,#0066ff)", label: "✨ Neon" },
                { gradient: "linear-gradient(135deg,#9900ff,#cc00ff)", label: "💻 Code" },
                { gradient: "linear-gradient(135deg,#ff9900,#ff6600)", label: "🌙 Night" },
                { gradient: "linear-gradient(135deg,#39ff14,#00c8ff)", label: "🎵 Music" },
                { gradient: "linear-gradient(135deg,#e8102a,#00c8ff)", label: "✦ PlayQuest" },
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ scale: 1.04 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 + i * 0.06 }} className="aspect-square rounded-xl flex items-end p-2" style={{ background: item.gradient }}>
                  <span className="text-white text-[10px] font-semibold drop-shadow">{item.label}</span>
                </motion.div>
              ))}
            </div>
            {/* Mock bottom bar */}
            <div className="flex justify-around px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {[Home, Film, Music, MessageCircle, Bot].map((Icon, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <Icon className="w-4.5 h-4.5" style={{ color: i === 0 ? "#e8102a" : "rgba(232,232,240,0.3)" }} />
                  {i === 0 && <div className="w-1 h-1 rounded-full bg-[#e8102a]" />}
                </div>
              ))}
            </div>
          </div>
          {/* Glow under card */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-8 blur-2xl" style={{ background: "rgba(232,16,42,0.2)" }} />
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="w-6 h-6 text-[#e8e8f0]/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: 12400, suffix: "+", label: "Membres actifs" },
            { value: 58000, suffix: "+", label: "Posts partagés" },
            { value: 1200000, suffix: "+", label: "Likes échangés" },
            { value: 99, suffix: "%", label: "Satisfaction" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-5 rounded-2xl" style={{ background: "rgba(14,14,22,0.8)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
              <p className="text-3xl font-black mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-[#e8e8f0]/40 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#e8102a] mb-3">Fonctionnalités</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
              Tout ce dont tu as besoin,<br />
              <span style={{ background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>au même endroit</span>
            </h2>
            <p className="text-[#e8e8f0]/45 max-w-xl mx-auto text-base">PlayQuest combine toutes les fonctionnalités que tu aimes dans une seule plateforme premium.</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4, scale: 1.01 }} className="group p-6 rounded-2xl transition-all duration-300" style={{ background: "rgba(12,12,20,0.9)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(16px)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${f.color}18`, border: `1px solid ${f.color}33` }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-bold text-[#e8e8f0] mb-2">{f.label}</h3>
                <p className="text-sm text-[#e8e8f0]/45 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="community" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#00c8ff] mb-3">Communauté</p>
            <h2 className="text-4xl font-black mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Ce qu'ils en pensent</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} whileHover={{ y: -3 }} className="p-6 rounded-2xl" style={{ background: "rgba(12,12,20,0.9)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(16px)" }}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-[#ff9900] text-[#ff9900]" />)}
                </div>
                <p className="text-sm text-[#e8e8f0]/70 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: t.color, boxShadow: `0 0 12px ${t.color}60` }}>
                    {t.user.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#e8e8f0]">@{t.user}</p>
                    <p className="text-[11px] text-[#e8e8f0]/35">{t.role}</p>
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
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-12 rounded-3xl relative overflow-hidden" style={{ background: "rgba(12,12,20,0.95)", border: "1px solid rgba(232,16,42,0.15)" }}>
            <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(232,16,42,0.4), transparent 70%)" }} />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 30px rgba(232,16,42,0.5)" }}>
                  <Zap className="w-6 h-6 text-white" fill="white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                Prêt à rejoindre<br />
                <span style={{ background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PlayQuest ?</span>
              </h2>
              <p className="text-[#e8e8f0]/50 mb-8 text-base">Rejoins des milliers de créateurs sur la plateforme sociale la plus avancée de 2026.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold text-white" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 40px rgba(232,16,42,0.4)" }}>
                    Créer mon compte <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
                <Link to="/login" className="text-sm text-[#e8e8f0]/50 hover:text-[#e8e8f0] transition-colors">
                  Déjà membre ? Se connecter →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-8 px-6 border-t text-center" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)" }}>
            <Zap className="w-3 h-3 text-white" fill="white" />
          </div>
          <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PlayQuest</span>
        </div>
        <p className="text-xs text-[#e8e8f0]/25">✦ 2026 PlayQuest by varnox•prime — Tous droits réservés</p>
      </footer>
    </div>
  );
}

// Local icon fallback
function Home({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
