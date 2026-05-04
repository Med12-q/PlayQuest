import { Link } from "wouter";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center relative z-10 px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ background: "linear-gradient(135deg, #e8102a, #00c8ff)", boxShadow: "0 0 30px rgba(232,16,42,0.5)" }}>
          <Zap className="w-8 h-8 text-white" fill="white" />
        </div>
        <h1 className="text-8xl font-bold gradient-text mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>404</h1>
        <p className="text-[#e8e8f0]/60 text-lg mb-8">Cette page n'existe pas</p>
        <Link to="/feed">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg, #e8102a, #c8001f)", boxShadow: "0 0 20px rgba(232,16,42,0.5)" }}>
            Retour à l'accueil
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
