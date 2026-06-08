import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Zap, User, Mail, Lock, CheckCircle, ArrowRight } from "lucide-react";

const schema = z.object({
  username: z.string().min(3, "Min 3 caractères").max(20, "Max 20 caractères").regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et _ uniquement"),
  email: z.string().email("Email invalide"),
  password: z.string().min(4, "Min 4 caractères"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: "Les mots de passe ne correspondent pas", path: ["confirmPassword"] });

type FormData = z.infer<typeof schema>;

const BG_IMAGE = "https://files.catbox.moe/osml4y.jpg";

const globs = [
  { top: "-15%", left: "-10%", size: 600, color: "rgba(232,16,42,0.28)", blur: 120, anim: { x: [0, 40, -20, 0], y: [0, -30, 50, 0], scale: [1, 1.12, 0.95, 1], transition: { duration: 18, repeat: Infinity, ease: "easeInOut" } } },
  { top: "60%", left: "65%", size: 500, color: "rgba(0,200,255,0.22)", blur: 100, anim: { x: [0, -50, 30, 0], y: [0, 40, -60, 0], scale: [1, 0.9, 1.15, 1], transition: { duration: 22, repeat: Infinity, ease: "easeInOut" } } },
  { top: "30%", left: "70%", size: 350, color: "rgba(153,0,255,0.2)", blur: 90, anim: { x: [0, -30, 60, 0], y: [0, 50, -30, 0], scale: [1, 1.2, 0.85, 1], transition: { duration: 15, repeat: Infinity, ease: "easeInOut" } } },
  { top: "70%", left: "-5%", size: 400, color: "rgba(57,255,20,0.1)", blur: 100, anim: { x: [0, 60, -20, 0], y: [0, -40, 30, 0], scale: [1, 0.88, 1.1, 1], transition: { duration: 25, repeat: Infinity, ease: "easeInOut" } } },
  { top: "10%", left: "40%", size: 280, color: "rgba(232,16,42,0.15)", blur: 80, anim: { x: [0, 30, -50, 0], y: [0, 60, -20, 0], scale: [1, 1.05, 0.92, 1], transition: { duration: 20, repeat: Infinity, ease: "easeInOut" } } },
];

const fieldStagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fieldFade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "success">("idle");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const pwdVal = watch("confirmPassword");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const ok = await registerUser(data.username, data.email, data.password, "#e8102a");
    setLoading(false);
    if (!ok) {
      toast({ title: "Erreur", description: "Ce nom d'utilisateur est déjà pris.", variant: "destructive" });
    } else {
      setStep("success");
    }
  };

  const inputBase = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "#e8e8f0",
    outline: "none",
    transition: "all 0.2s",
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-10 px-4"
      style={{ background: "#04040a" }}>

      {/* ── Background image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={BG_IMAGE}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.18, filter: "saturate(1.4) brightness(0.8)" }}
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(4,4,10,0.85) 0%,rgba(4,4,10,0.6) 50%,rgba(4,4,10,0.92) 100%)" }} />
      </div>

      {/* ── Animated glow orbs (Bolt.new style) ── */}
      {globs.map((g, i) => (
        <motion.div
          key={i}
          animate={g.anim}
          className="absolute pointer-events-none rounded-full z-0"
          style={{
            top: g.top, left: g.left,
            width: g.size, height: g.size,
            background: `radial-gradient(circle, ${g.color} 0%, transparent 70%)`,
            filter: `blur(${g.blur}px)`,
          }}
        />
      ))}

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.022]" style={{ backgroundImage: "linear-gradient(rgba(0,200,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* ── Scanline overlay ── */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "repeating-linear-gradient(transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)" }} />

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-[420px]">

        {/* Logo header */}
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-center mb-7">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 relative"
            style={{ background: "linear-gradient(135deg,#e8102a,#c8001f)", boxShadow: "0 0 50px rgba(232,16,42,0.55), 0 0 100px rgba(232,16,42,0.2)" }}
          >
            <Zap className="w-8 h-8 text-white" fill="white" />
            <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-0 rounded-2xl" style={{ background: "radial-gradient(circle, rgba(232,16,42,0.4) 0%, transparent 70%)" }} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-3xl font-black mb-1"
            style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-1px", background: "linear-gradient(135deg,#e8102a,#ff6b35,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            PlayQuest
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-sm text-[#e8e8f0]/40">
            Rejoins le réseau social de nouvelle génération
          </motion.p>
        </motion.div>

        {/* Glass form card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl p-7 relative overflow-hidden"
          style={{
            background: "rgba(8,8,16,0.82)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Inner top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(232,16,42,0.5),rgba(0,200,255,0.5),transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-8 blur-2xl pointer-events-none" style={{ background: "linear-gradient(rgba(232,16,42,0.12),transparent)" }} />

          <AnimatePresence mode="wait">
            {step === "success" ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(57,255,20,0.1)", border: "1px solid rgba(57,255,20,0.3)" }}>
                  <CheckCircle className="w-8 h-8 text-[#39ff14]" style={{ filter: "drop-shadow(0 0 8px rgba(57,255,20,0.8))" }} />
                </motion.div>
                <h3 className="text-xl font-bold text-[#e8e8f0] mb-2">Compte créé !</h3>
                <p className="text-sm text-[#e8e8f0]/50 mb-6">Bienvenue sur PlayQuest ✦</p>
                <p className="text-xs text-[#e8e8f0]/30">Redirection automatique…</p>
              </motion.div>
            ) : (
              <motion.form key="form" variants={fieldStagger} initial="hidden" animate="show" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Username */}
                <motion.div variants={fieldFade}>
                  <label className="block text-[10px] font-bold text-[#e8e8f0]/35 mb-1.5 uppercase tracking-[0.1em]">Nom d'utilisateur</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#e8e8f0]/25" />
                    <input {...register("username")} type="text" placeholder="votre_pseudo" autoComplete="off"
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm"
                      style={inputBase}
                      onFocus={e => { e.target.style.borderColor = "rgba(232,16,42,0.4)"; e.target.style.background = "rgba(255,255,255,0.07)"; e.target.style.boxShadow = "0 0 0 3px rgba(232,16,42,0.06)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  {errors.username && <p className="text-[11px] text-[#e8102a] mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#e8102a] inline-block" />{errors.username.message}</p>}
                </motion.div>

                {/* Email */}
                <motion.div variants={fieldFade}>
                  <label className="block text-[10px] font-bold text-[#e8e8f0]/35 mb-1.5 uppercase tracking-[0.1em]">Adresse email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#e8e8f0]/25" />
                    <input {...register("email")} type="email" placeholder="vous@exemple.com" autoComplete="email"
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm"
                      style={inputBase}
                      onFocus={e => { e.target.style.borderColor = "rgba(0,200,255,0.35)"; e.target.style.background = "rgba(255,255,255,0.07)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,200,255,0.05)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-[#e8102a] mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#e8102a] inline-block" />{errors.email.message}</p>}
                </motion.div>

                {/* Password */}
                <motion.div variants={fieldFade}>
                  <label className="block text-[10px] font-bold text-[#e8e8f0]/35 mb-1.5 uppercase tracking-[0.1em]">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#e8e8f0]/25" />
                    <input {...register("password")} type={showPwd ? "text" : "password"} placeholder="••••••••" autoComplete="new-password"
                      className="w-full pl-9 pr-11 py-3 rounded-xl text-sm"
                      style={inputBase}
                      onFocus={e => { e.target.style.borderColor = "rgba(232,16,42,0.4)"; e.target.style.background = "rgba(255,255,255,0.07)"; e.target.style.boxShadow = "0 0 0 3px rgba(232,16,42,0.06)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.boxShadow = "none"; }}
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#e8e8f0]/25 hover:text-[#00c8ff] transition-colors">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-[#e8102a] mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#e8102a] inline-block" />{errors.password.message}</p>}
                </motion.div>

                {/* Confirm password */}
                <motion.div variants={fieldFade}>
                  <label className="block text-[10px] font-bold text-[#e8e8f0]/35 mb-1.5 uppercase tracking-[0.1em]">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#e8e8f0]/25" />
                    <input {...register("confirmPassword")} type={showPwd ? "text" : "password"} placeholder="••••••••" autoComplete="new-password"
                      className="w-full pl-9 pr-11 py-3 rounded-xl text-sm"
                      style={inputBase}
                      onFocus={e => { e.target.style.borderColor = "rgba(0,200,255,0.35)"; e.target.style.background = "rgba(255,255,255,0.07)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,200,255,0.05)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.boxShadow = "none"; }}
                    />
                    {pwdVal && !errors.confirmPassword && (
                      <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#39ff14]" style={{ filter: "drop-shadow(0 0 4px rgba(57,255,20,0.6))" }} />
                    )}
                  </div>
                  {errors.confirmPassword && <p className="text-[11px] text-[#e8102a] mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#e8102a] inline-block" />{errors.confirmPassword.message}</p>}
                </motion.div>

                {/* Submit */}
                <motion.div variants={fieldFade} className="pt-1">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={loading ? {} : { scale: 1.02, y: -1 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white relative overflow-hidden flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: loading ? "rgba(232,16,42,0.35)" : "linear-gradient(135deg,#e8102a 0%,#c8001f 100%)",
                      boxShadow: loading ? "none" : "0 0 30px rgba(232,16,42,0.45), 0 4px 20px rgba(232,16,42,0.3)",
                    }}
                  >
                    {!loading && <motion.div className="absolute inset-0 opacity-0 hover:opacity-100" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 100%)" }} />}
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Création du compte…
                      </>
                    ) : (
                      <><Zap className="w-4 h-4" fill="white" /> Créer mon compte <ArrowRight className="w-4 h-4" /></>
                    )}
                  </motion.button>
                </motion.div>

                <motion.div variants={fieldFade} className="text-center pt-1">
                  <Link to="/login" className="text-sm text-[#e8e8f0]/35 hover:text-[#e8e8f0]/60 transition-colors">
                    Déjà membre ?{" "}
                    <span className="text-[#00c8ff] font-semibold hover:text-[#00c8ff]/80">Se connecter</span>
                  </Link>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center mt-5 text-[11px]">
          <span className="text-[#e8e8f0]/20">✦ 2026 </span>
          <span style={{ background: "linear-gradient(135deg,#e8102a,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 600 }}>PlayQuest</span>
          <span className="text-[#e8e8f0]/20"> by </span>
          <span className="text-[#00c8ff]/40">varnox•prime</span>
        </motion.p>
      </div>
    </div>
  );
}
