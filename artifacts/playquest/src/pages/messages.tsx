import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, Message, User } from "@/lib/store";
import { getInitials, formatTimeAgo, generateId } from "@/lib/utils";

export default function MessagesPage() {
  const { currentUser } = useAuth();
  const [partners, setPartners] = useState<User[]>([]);
  const [activePartner, setActivePartner] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const partnerIds = store.getConversationPartners(currentUser.id);
    const partnerUsers = partnerIds.map(id => store.getUserById(id)).filter(Boolean) as User[];
    setPartners(partnerUsers);
    if (partnerUsers.length > 0 && !isMobile) setActivePartner(partnerUsers[0]);
  }, [currentUser, isMobile]);

  useEffect(() => {
    if (!currentUser || !activePartner) return;
    setConversation(store.getConversation(currentUser.id, activePartner.id));
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [activePartner, currentUser]);

  const sendMessage = () => {
    if (!currentUser || !activePartner || !newMessage.trim()) return;
    const msg: Message = { id: generateId(), fromUserId: currentUser.id, toUserId: activePartner.id, content: newMessage.trim(), createdAt: new Date().toISOString(), read: false };
    store.sendMessage(msg);
    setConversation(prev => [...prev, msg]);
    setNewMessage("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const getLastMessage = (partnerId: string): Message | undefined => {
    if (!currentUser) return;
    const conv = store.getConversation(currentUser.id, partnerId);
    return conv[conv.length - 1];
  };

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="flex h-screen" style={{ maxHeight: "calc(100vh - 64px)" }}>
        {/* Conversation list */}
        <div className={`${activePartner && isMobile ? "hidden" : "flex"} md:flex flex-col w-full md:w-80 border-r`} style={{ borderColor: "rgba(0,200,255,0.08)" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(0,200,255,0.08)" }}>
            <h1 className="text-xl font-bold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Messages</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            {partners.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#e8e8f0]/40">
                <MessageCircle className="w-12 h-12 mb-3" />
                <p className="text-sm">Aucune conversation</p>
              </div>
            ) : partners.map(partner => {
              const lastMsg = getLastMessage(partner.id);
              const isActive = activePartner?.id === partner.id;
              return (
                <motion.button key={partner.id} whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }} onClick={() => setActivePartner(partner)} data-testid={`button-conversation-${partner.id}`} className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all" style={{ background: isActive ? "rgba(232,16,42,0.06)" : "transparent" }}>
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: partner.avatarColor, boxShadow: `0 0 10px ${partner.avatarColor}60` }}>{getInitials(partner.username)}</div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#39ff14]" style={{ boxShadow: "0 0 6px rgba(57,255,20,0.8)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#e8e8f0]">@{partner.username}</p>
                    {lastMsg && <p className="text-xs text-[#e8e8f0]/50 truncate">{lastMsg.content}</p>}
                  </div>
                  {lastMsg && <span className="text-[10px] text-[#e8e8f0]/30 flex-shrink-0">{formatTimeAgo(lastMsg.createdAt)}</span>}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Chat window */}
        {activePartner ? (
          <div className={`${!activePartner && isMobile ? "hidden" : "flex"} md:flex flex-col flex-1`}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(0,200,255,0.08)" }}>
              {isMobile && <button onClick={() => setActivePartner(null)} className="text-[#e8e8f0]/60 hover:text-[#e8e8f0] mr-1"><ArrowLeft className="w-5 h-5" /></button>}
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: activePartner.avatarColor, boxShadow: `0 0 10px ${activePartner.avatarColor}60` }}>{getInitials(activePartner.username)}</div>
              <div>
                <p className="text-sm font-semibold text-[#e8e8f0]">@{activePartner.username}</p>
                <p className="text-xs text-[#39ff14]" style={{ filter: "drop-shadow(0 0 4px rgba(57,255,20,0.6))" }}>En ligne</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {conversation.map(msg => {
                const isMe = msg.fromUserId === currentUser.id;
                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMe ? "justify-end" : "justify-start"}`} data-testid={`message-${msg.id}`}>
                    <div className="max-w-[75%]">
                      <div className="px-4 py-2.5 rounded-2xl text-sm" style={{ background: isMe ? "linear-gradient(135deg, #e8102a, #c8001f)" : "rgba(255,255,255,0.06)", color: "#e8e8f0", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", boxShadow: isMe ? "0 0 12px rgba(232,16,42,0.3)" : "none" }}>
                        {msg.content}
                      </div>
                      <p className={`text-[10px] text-[#e8e8f0]/30 mt-1 ${isMe ? "text-right" : "text-left"}`}>{formatTimeAgo(msg.createdAt)}</p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t" style={{ borderColor: "rgba(0,200,255,0.08)" }}>
              <div className="flex gap-3">
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Écrire un message..." data-testid="input-message" className="flex-1 px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", color: "#e8e8f0" }} />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendMessage} data-testid="button-send" className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e8102a, #c8001f)", boxShadow: "0 0 16px rgba(232,16,42,0.4)" }}>
                  <Send className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-col flex-1 items-center justify-center text-[#e8e8f0]/30">
            <MessageCircle className="w-16 h-16 mb-4" style={{ color: "rgba(0,200,255,0.3)" }} />
            <p className="text-sm">Sélectionnez une conversation</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
