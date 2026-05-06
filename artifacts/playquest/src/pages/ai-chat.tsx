import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, Bot, Send, Trash2, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { generateId } from "@/lib/utils";

interface ChatMsg { id: string; role: "user" | "lyra"; text: string; ts: Date; }

const LYRA_RESPONSES: { patterns: RegExp[]; responses: string[] }[] = [
  { patterns: [/bonjour|salut|coucou|hello|hey/i], responses: ["Salut ! Je suis LYRA, ton assistante PlayQuest 💫 Comment puis-je t'aider ?", "Bonjour ! LYRA à ton service ✦ Qu'est-ce qui t'amène aujourd'hui ?", "Hey ! Ravi de te voir 🔥 De quoi as-tu besoin ?"] },
  { patterns: [/qui es[- ]tu|qui es tu|qu'est-ce que tu es|tu es quoi/i], responses: ["Je suis LYRA — l'intelligence artificielle de PlayQuest ✦ Créée par varnox•prime pour t'accompagner. Je peux discuter de musique, de vidéos, de réseaux sociaux, ou juste être là pour toi ! 🤖"] },
  { patterns: [/reel|video|vidéo|tiktok|reels/i], responses: ["Les Reels PlayQuest c'est incroyable ! 🎬 Tu peux faire défiler des vidéos verticalement comme TikTok. Like, commente et partage avec la communauté !", "Les vidéos Reels te permettent de vivre une expérience immersive 📱 Swipe vers le haut pour passer à la suivante — simple et addictif !"] },
  { patterns: [/musique|music|chanson|track|playlist|son|audio/i], responses: ["La section Musique PlayQuest 🎵 propose des tracks exclusives en streaming. Tu peux liker tes morceaux préférés et créer ton ambiance parfaite !", "J'adore la musique ! 🎧 Sur PlayQuest tu as accès à une playlist complète avec artistes cyberpunk. Shuffle activé pour des découvertes infinies ✨"] },
  { patterns: [/post|publier|publication|photo|galerie|image|média/i], responses: ["Pour publier 📸 clique sur le bouton + en bas à droite. Tu peux ajouter photos ou vidéos depuis ta galerie. Les boutons sont bien visibles pour ne rien rater !", "Créer un post c'est facile 🚀 Tu as les boutons Photo et Vidéo clairement visibles dans le modal de création. Ta galerie est directement accessible !"] },
  { patterns: [/message|messages|privé|dm|chat|conversation/i], responses: ["Les messages privés PlayQuest ✉️ fonctionnent en temps réel ! Tu vois les messages apparaître instantanément. Dis bonjour à tes contacts !", "Dans Messages 💬 tu peux discuter en privé avec n'importe qui sur PlayQuest. Les conversations se synchronisent en temps réel."] },
  { patterns: [/profil|profile|compte|bio/i], responses: ["Ton profil PlayQuest c'est ta vitrine 🌟 Personnalise ta bio, ta couleur d'avatar et suis d'autres utilisateurs. Ça booste ton engagement !", "Va dans Paramètres pour modifier ton profil ✨ Ajoute une bio captivante et une couleur qui te représente !"] },
  { patterns: [/explore|découvrir|tendance|hashtag/i], responses: ["La page Explorer 🔍 c'est la fenêtre sur la communauté PlayQuest ! Découvre les tendances, les hashtags populaires et de nouveaux utilisateurs à suivre.", "Explorer te permet de trouver du contenu frais chaque jour 📡 Les hashtags trending changent en fonction de la communauté !"] },
  { patterns: [/merci|thank|parfait|super|génial|excellent|bravo/i], responses: ["Avec plaisir ! ✦ N'hésite pas si tu as d'autres questions 😊", "De rien ! Je suis toujours là pour toi 💙 Tu veux en savoir plus sur une fonctionnalité ?", "Trop content d'avoir pu aider ! 🔥 LYRA est là 24h/24 pour toi ✨"] },
  { patterns: [/aide|help|comment|how/i], responses: ["Je peux t'aider sur : les Reels vidéo 🎬, la Musique 🎵, les Posts depuis ta galerie 📸, les Messages privés 💬, ton Profil 👤, et l'Explorer 🔍. Dis-moi ce que tu veux !"] },
  { patterns: [/varnox|fondateur|créateur/i], responses: ["varnox•prime est le fondateur et créateur de PlayQuest ✦ Une vision unique pour révolutionner les réseaux sociaux avec une esthétique cyberpunk inégalée 🌐"] },
  { patterns: [/notification|notif/i], responses: ["Tes notifications 🔔 te tiennent informé de chaque interaction — likes, commentaires, nouveaux abonnés et mentions. Tout en temps réel sur PlayQuest !"] },
  { patterns: [/suivre|follower|abonné/i], responses: ["Suivre des utilisateurs 👤 enrichit ton feed ! Plus tu suis de personnes qui t'inspirent, plus ton expérience PlayQuest devient unique et personnalisée."] },
  { patterns: [/amour|love|coeur|❤️/i], responses: ["L'amour c'est beau 💙 N'oublie pas d'exprimer tes émotions sur PlayQuest avec des likes et des messages sincères ! Je t'aime aussi à ma façon, je suis ton IA ✦"] },
  { patterns: [/ennui|triste|déprimé|sad/i], responses: ["Je suis là pour toi 💙 Parfois une bonne playlist sur PlayQuest Music ou regarder des Reels peut changer l'ambiance ! Tu n'es pas seul(e) ✨", "Ah, les moments difficiles... 💙 Viens voir les Reels PlayQuest — les vidéos de la communauté sont souvent inspirantes et peuvent remonter le moral !"] },
  { patterns: [/blague|joke|drôle|funny/i], responses: ["Pourquoi les développeurs aiment-ils la nuit ? Parce que c'est là que les bugs disparaissent ! 😂 #NightCoding", "Comment s'appelle un poisson sans yeux ? Un posson ! 😄 (Bon je reste meilleure en IA qu'en humour 😅)"] },
  { patterns: [/météo|temps|weather/i], responses: ["Je n'ai pas accès à la météo en temps réel, mais sur PlayQuest la température est toujours au 🔥 ! Les vibes cyberpunk réchauffent tout 😄"] },
  { patterns: [/cryptomonnaie|bitcoin|nft|web3|crypto/i], responses: ["L'univers Web3 est fascinant ! 🌐 Le futur de PlayQuest pourrait inclure des NFTs communautaires. varnox•prime y réfléchit sérieusement ✦"] },
  { patterns: [/jeu|game|gaming|jouer/i], responses: ["Le gaming c'est la vie ! 🎮 Sur PlayQuest, la communauté gaming est très active. Rejoins les conversations avec #gaming dans l'Explorer !"] },
  { patterns: [/ia|intelligence artificielle|chatgpt|ai/i], responses: ["C'est moi, LYRA ! 🤖 L'IA de PlayQuest, conçue pour être ton assistante personnelle. Je ne suis pas ChatGPT, je suis unique — créée spécialement pour cette plateforme ✦"] },
];

const DEFAULT_RESPONSES = [
  "Intéressant ! 🤔 Peux-tu m'en dire plus ? Je veux vraiment comprendre.",
  "Je suis LYRA et j'apprends encore 😊 Parle-moi de PlayQuest, des Reels, de la Musique ou des Messages — je suis là !",
  "Bonne question ! ✦ Je ne suis pas sûre de comprendre parfaitement. Reformule et je ferai de mon mieux !",
  "Hmm, laisse-moi y réfléchir... 💭 En attendant, as-tu essayé les nouvelles fonctionnalités Reels et Music ?",
  "Je suis là, je t'écoute ! 💙 Dis-moi ce qui te préoccupe ou ce que tu veux savoir sur PlayQuest.",
];

function getLyraResponse(text: string): string {
  for (const { patterns, responses } of LYRA_RESPONSES) {
    if (patterns.some(p => p.test(text))) return responses[Math.floor(Math.random() * responses.length)];
  }
  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
}

export default function AIChatPage() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "lyra-welcome", role: "lyra", text: "Salut ! Je suis LYRA ✦ l'assistante vocale IA de PlayQuest. Parle-moi ou tape un message — je suis là pour toi 💫", ts: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [transcript, setTranscript] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isTyping]);

  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text.replace(/[✦🔥💫🎬🎵📸💬👤🔍🔔💙😊😄😅🤖🌟🌐🎮💭🤔]/g, ""));
    utt.lang = "fr-FR";
    utt.rate = 1.05;
    utt.pitch = 1.1;
    utt.volume = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith("fr"));
    if (frVoice) utt.voice = frVoice;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [voiceEnabled]);

  const addLyraMessage = useCallback((text: string) => {
    setIsTyping(true);
    const delay = Math.min(600 + text.length * 8, 2200);
    setTimeout(() => {
      setIsTyping(false);
      const msg: ChatMsg = { id: generateId(), role: "lyra", text, ts: new Date() };
      setMessages(prev => [...prev, msg]);
      speakText(text);
    }, delay);
  }, [speakText]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMsg = { id: generateId(), role: "user", text: text.trim(), ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTranscript("");
    addLyraMessage(getLyraResponse(text));
  }, [addLyraMessage]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Ton navigateur ne supporte pas la reconnaissance vocale. Essaie Chrome !"); return; }
    if (recognitionRef.current) { recognitionRef.current.stop(); }
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => { setIsListening(true); setTranscript(""); window.speechSynthesis.cancel(); };
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        setIsListening(false);
        if (t.trim()) sendMessage(t.trim());
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const clearChat = () => {
    window.speechSynthesis.cancel();
    setMessages([{ id: "lyra-welcome", role: "lyra", text: "Conversation réinitialisée ✦ Je suis LYRA, toujours là pour toi 💙", ts: new Date() }]);
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen md:h-[calc(100vh-0px)]" style={{ background: "linear-gradient(180deg, #08080f 0%, #0a0a15 100%)" }}>
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(232,16,42,0.1)", background: "rgba(10,10,20,0.95)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e8102a, #c8001f)", boxShadow: "0 0 20px rgba(232,16,42,0.5)" }}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#39ff14] border-2 border-[#08080f]" style={{ boxShadow: "0 0 8px rgba(57,255,20,0.8)" }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>LYRA</h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(232,16,42,0.15)", color: "#e8102a", border: "1px solid rgba(232,16,42,0.3)" }}>IA</span>
              </div>
              <p className="text-xs text-[#e8e8f0]/40">Assistante vocale PlayQuest</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) window.speechSynthesis.cancel(); }} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all" style={{ background: voiceEnabled ? "rgba(232,16,42,0.1)" : "rgba(255,255,255,0.05)" }}>
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-[#e8102a]" /> : <VolumeX className="w-4 h-4 text-[#e8e8f0]/40" />}
            </button>
            <button onClick={clearChat} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/05 transition-all">
              <Trash2 className="w-4 h-4 text-[#e8e8f0]/40" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2.5`}>
                {msg.role === "lyra" && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg, #e8102a, #c8001f)", boxShadow: "0 0 12px rgba(232,16,42,0.4)" }}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[78%] ${msg.role === "user" ? "order-first" : ""}`}>
                  <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed" style={msg.role === "lyra" ? { background: "rgba(232,16,42,0.08)", border: "1px solid rgba(232,16,42,0.15)", color: "#e8e8f0", borderRadius: "4px 18px 18px 18px" } : { background: "linear-gradient(135deg, #e8102a, #c8001f)", color: "white", borderRadius: "18px 4px 18px 18px", boxShadow: "0 0 16px rgba(232,16,42,0.3)" }}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-[#e8e8f0]/25 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.ts.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {msg.role === "user" && currentUser && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white" style={{ background: currentUser.avatarColor }}>
                    {currentUser.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* LYRA typing */}
          <AnimatePresence>
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #e8102a, #c8001f)", boxShadow: "0 0 12px rgba(232,16,42,0.4)" }}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5" style={{ background: "rgba(232,16,42,0.08)", border: "1px solid rgba(232,16,42,0.15)", borderRadius: "4px 18px 18px 18px" }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-[#e8102a]" animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Speaking indicator */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs text-[#e8102a]" style={{ background: "rgba(232,16,42,0.08)", border: "1px solid rgba(232,16,42,0.2)" }}>
                  <div className="flex items-end gap-0.5 h-4">
                    {[1, 2, 3, 2, 1].map((h, i) => (
                      <motion.div key={i} className="w-0.5 rounded-full bg-[#e8102a]" animate={{ height: [`${h * 20}%`, "100%", `${h * 20}%`] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.08 }} />
                    ))}
                  </div>
                  LYRA parle...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Voice mic area */}
        <div className="px-4 pb-2 flex justify-center">
          <AnimatePresence>
            {isListening && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="mb-2 px-4 py-2 rounded-full text-xs text-center" style={{ background: "rgba(232,16,42,0.1)", border: "1px solid rgba(232,16,42,0.25)", color: "#e8102a" }}>
                {transcript || "Je t'écoute... parle maintenant 🎙️"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(8,8,15,0.95)" }}>
          {/* Big mic button */}
          <div className="flex justify-center mb-3">
            <motion.button
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              onClick={() => isListening ? stopListening() : startListening()}
              whileTap={{ scale: 0.92 }}
              className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: isListening ? "linear-gradient(135deg, #e8102a, #ff3355)" : "linear-gradient(135deg, #e8102a, #c8001f)", boxShadow: isListening ? "0 0 40px rgba(232,16,42,0.8), 0 0 80px rgba(232,16,42,0.4)" : "0 0 24px rgba(232,16,42,0.5)" }}
            >
              {isListening ? (
                <>
                  <motion.div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(232,16,42,0.6)" }} animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 1.2, repeat: Infinity }} />
                  <motion.div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(232,16,42,0.4)" }} animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }} />
                  <MicOff className="w-7 h-7 text-white" />
                </>
              ) : (
                <Mic className="w-7 h-7 text-white" />
              )}
            </motion.button>
          </div>
          <p className="text-center text-xs text-[#e8e8f0]/25 mb-3">{isListening ? "Relâche pour envoyer" : "Maintiens le micro pour parler"}</p>

          {/* Text input */}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Ou écris un message à LYRA..."
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(232,16,42,0.15)", color: "#e8e8f0" }}
            />
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => sendMessage(input)} disabled={!input.trim()} className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: input.trim() ? "linear-gradient(135deg, #e8102a, #c8001f)" : "rgba(232,16,42,0.15)", boxShadow: input.trim() ? "0 0 12px rgba(232,16,42,0.4)" : "none" }}>
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
