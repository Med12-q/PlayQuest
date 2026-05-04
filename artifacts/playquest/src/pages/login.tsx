import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Zap } from "lucide-react";

const schema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(1, "Mot de passe requis"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const ok = await login(data.username, data.password);
    setLoading(false);
    if (!ok) {
      toast({ title: "Erreur de connexion", description: "Identifiants incorrects. Essayez demo/demo", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full" style={{ background: "radial-gradient(circle, rgba(232,16,42,0.2) 0%, transparent 70%)" }} />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,200,255,0.2) 0%, transparent 70%)" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md px-6 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }} className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 relative" style={{ background: "linear-gradient(135deg, #e8102a, #00c8ff)", boxShadow: "0 0 30px rgba(232,16,42,0.5), 0 0 60px rgba(0,200,255,0.3)" }}>
            <Zap className="w-10 h-10 text-white" fill="white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-4xl font-bold gradient-text mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            PlayQuest
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-[#00c8ff]/70 text-sm">
            Bon retour parmi nous ! ✦
          </motion.p>
        </div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl p-8 border" style={{ background: "rgba(17,17,24,0.8)", backdropFilter: "blur(20px)", borderColor: "rgba(0,200,255,0.2)", boxShadow: "0 0 40px rgba(0,200,255,0.05)" }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#e8e8f0]/60 mb-1.5 uppercase tracking-wider">Nom d'utilisateur</label>
              <input {...register("username")} data-testid="input-username" placeholder="alexvx" className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", color: "#e8e8f0" }} onFocus={e => { e.target.style.borderColor = "rgba(0,200,255,0.6)"; e.target.style.boxShadow = "0 0 12px rgba(0,200,255,0.2)"; }} onBlur={e => { e.target.style.borderColor = "rgba(0,200,255,0.2)"; e.target.style.boxShadow = "none"; }} />
              {errors.username && <p className="text-xs text-[#e8102a] mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#e8e8f0]/60 mb-1.5 uppercase tracking-wider">Mot de passe</label>
              <div className="relative">
                <input {...register("password")} data-testid="input-password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full px-4 py-3 pr-12 rounded-xl text-sm transition-all outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", color: "#e8e8f0" }} onFocus={e => { e.target.style.borderColor = "rgba(0,200,255,0.6)"; e.target.style.boxShadow = "0 0 12px rgba(0,200,255,0.2)"; }} onBlur={e => { e.target.style.borderColor = "rgba(0,200,255,0.2)"; e.target.style.boxShadow = "none"; }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e8e8f0]/40 hover:text-[#00c8ff] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#e8102a] mt-1">{errors.password.message}</p>}
            </div>

            <motion.button data-testid="button-login" type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 rounded-xl font-semibold text-white transition-all mt-2" style={{ background: loading ? "rgba(232,16,42,0.5)" : "linear-gradient(135deg, #e8102a, #c8001f)", boxShadow: loading ? "none" : "0 0 20px rgba(232,16,42,0.5), 0 0 40px rgba(232,16,42,0.2)" }}>
              {loading ? "Connexion..." : "Se connecter"}
            </motion.button>

            <p className="text-center text-xs text-[#e8e8f0]/30 mt-2">Essayez : <span className="text-[#00c8ff]/60">alexvx / demo</span></p>
          </form>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-sm text-[#00c8ff]/70 hover:text-[#00c8ff] transition-colors">
              Pas encore de compte ? <span className="font-semibold">S'inscrire</span>
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center mt-8 text-xs">
          <span className="text-yellow-400" style={{ filter: "drop-shadow(0 0 6px rgba(250,204,21,0.8))" }}>✦</span>
          <span className="text-[#e8e8f0]/30 mx-1">2026</span>
          <span className="gradient-text font-semibold">PlayQuest</span>
          <span className="text-[#e8e8f0]/30"> by </span>
          <span className="text-[#00c8ff]/50">varnox•prime</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
