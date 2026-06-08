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
      <footer className="relative z-10 pt-14 pb-10 px-6 border-t text-center" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.6)" }}>
        {/* Social icons row */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            {
              label: "GitHub",
              href: "https://github.com/Med12-q/PlayQuest",
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              ),
              disabled: false,
            },
            {
              label: "YouTube",
              href: null,
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              ),
              disabled: true,
            },
            {
              label: "WhatsApp",
              href: "https://whatsapp.com/channel/0029Vb83R524SpkBdSM6Ob2F",
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              ),
              disabled: false,
            },
            {
              label: "Telegram",
              href: "https://t.me/varnox_official",
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              ),
              disabled: false,
            },
            {
              label: "Email",
              href: "mailto:varnoxnovark@gmail.com",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              ),
              disabled: false,
            },
          ].map(({ label, href, icon, disabled }) => {
            const El = href ? "a" : "button";
            return (
              <motion.div key={label} whileHover={disabled ? {} : { scale: 1.12, y: -2 }} whileTap={disabled ? {} : { scale: 0.93 }}>
                <El
                  {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={label}
                  title={disabled ? "Bientôt disponible" : label}
                  className="w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)",
                    cursor: disabled ? "not-allowed" : "pointer",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={disabled ? undefined : (e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.12)";
                    el.style.color = "rgba(255,255,255,0.85)";
                    el.style.borderColor = "rgba(255,255,255,0.12)";
                  }}
                  onMouseLeave={disabled ? undefined : (e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.07)";
                    el.style.color = "rgba(255,255,255,0.5)";
                    el.style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  {icon}
                </El>
              </motion.div>
            );
          })}
        </div>

        {/* Copyright */}
        <p className="text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.01em" }}>
          © 2026 <span style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "0.04em" }}>𝐕𝚫𝚪𝐍𝐎𝐗 𝐋𝚵𝚫𝐃 𝚻𝚵𝐂𝚮 𝚸𝚪𝚰𝚳𝚵𝚵𝚵𝚵𝚵𝚵</span> — Tous droits réservés.
        </p>

        {/* Sub line */}
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
          Propulsé par <span style={{ color: "rgba(255,255,255,0.32)" }}>varnox•prime</span> | Innovation &amp; Excellence
        </p>
      </footer>
    </div>
  );
}

// Local icon fallback
function Home({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
