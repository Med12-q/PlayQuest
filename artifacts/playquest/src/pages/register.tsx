import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Zap, User, Mail, Lock, CheckCircle } from "lucide-react";

const schema = z.object({
  username: z.string().min(3, "Min 3 caractères").max(20, "Max 20 caractères").regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et _ uniquement"),
  email: z.string().email("Email invalide"),
  password: z.string().min(4, "Min 4 caractères"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: "Les mots de passe ne correspondent pas", path: ["confirmPassword"] });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const ok = await registerUser(data.username, data.email, data.password, "#e8102a");
    setLoading(false);
    if (!ok) {
      toast({ title: "Erreur", description: "Ce nom d'utilisateur est déjà pris.", variant: "destructive" });
    }
  };

  const fields = [
    { name: "username" as const, label: "Nom d'utilisateur", placeholder: "votre_pseudo", icon: User, type: "text" },
    { name: "email" as const, label: "Adresse email", placeholder: "vous@exemple.com", icon: Mail, type: "email" },
  ];

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#e8e8f0",
    transition: "all 0.2s",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center relative overflow-hidden py-10">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(0,200,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.025) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #e8102a 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #00c8ff 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-[400px] px-5 relative z-10">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.7, delay: 0.1 }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: "linear-gradient(135deg, #e8102a 0%, #c8001f 50%, #00c8ff 100%)", boxShadow: "0 0 40px rgba(232,16,42,0.4), 0 0 80px rgba(0,200,255,0.2)" }}>
            <Zap className="w-8 h-8 text-white" fill="white" />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px" }}>PlayQuest</h1>
          <p className="text-[#e8e8f0]/40 text-sm">Créez votre compte</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="rounded-2xl p-7 space-y-4" style={{ background: "rgba(16,16,22,0.9)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map(({ name, label, placeholder, icon: Icon, type }) => (
              <div key={name}>
                <label className="block text-[11px] font-semibold text-[#e8e8f0]/40 mb-1.5 uppercase tracking-widest">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e8e8f0]/25" />
                  <input {...register(name)} type={type} placeholder={placeholder} autoComplete="off" className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "rgba(0,200,255,0.35)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }} />
                </div>
                {errors[name] && <p className="text-xs text-[#e8102a]/90 mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#e8102a] inline-block" />{errors[name]?.message}</p>}
              </div>
            ))}

            {[{ name: "password" as const, label: "Mot de passe", show: showPassword, toggle: () => setShowPassword(!showPassword) }, { name: "confirmPassword" as const, label: "Confirmer le mot de passe", show: showPassword, toggle: () => setShowPassword(!showPassword) }].map(({ name, label, show, toggle }) => (
              <div key={name}>
                <label className="block text-[11px] font-semibold text-[#e8e8f0]/40 mb-1.5 uppercase tracking-widest">{label}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e8e8f0]/25" />
                  <input {...register(name)} type={show ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "rgba(0,200,255,0.35)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }} />
                  {name === "password" && (
                    <button type="button" onClick={toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#e8e8f0]/30 hover:text-[#00c8ff] transition-colors">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                  {name === "confirmPassword" && !errors.confirmPassword && (
                    <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#39ff14]/50" />
                  )}
                </div>
                {errors[name] && <p className="text-xs text-[#e8102a]/90 mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#e8102a] inline-block" />{errors[name]?.message}</p>}
              </div>
            ))}

            <div className="pt-1">
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all" style={{ background: loading ? "rgba(232,16,42,0.4)" : "linear-gradient(135deg, #e8102a 0%, #c8001f 100%)", boxShadow: loading ? "none" : "0 0 24px rgba(232,16,42,0.4), 0 4px 16px rgba(232,16,42,0.3)" }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Création du compte...
                  </span>
                ) : "Créer mon compte"}
              </motion.button>
            </div>
          </form>

          <div className="text-center pt-1">
            <Link to="/login" className="text-sm text-[#e8e8f0]/40 hover:text-[#e8e8f0]/70 transition-colors">
              Déjà membre ? <span className="text-[#00c8ff]/80 font-medium hover:text-[#00c8ff]">Se connecter</span>
            </Link>
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-6 text-[11px]">
          <span className="text-yellow-400/80" style={{ filter: "drop-shadow(0 0 4px rgba(250,204,21,0.6))" }}>✦</span>
          <span className="text-[#e8e8f0]/25 mx-1">2026</span>
          <span className="gradient-text font-semibold">PlayQuest</span>
          <span className="text-[#e8e8f0]/25"> by </span>
          <span className="text-[#00c8ff]/40">varnox•prime</span>
        </motion.p>
      </motion.div>
    </div>
  );
}
