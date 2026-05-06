import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, MessageCircle, Plus, Search, X, Check, CheckCheck, Image, Smile } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, Message, User } from "@/lib/store";
import { getInitials, formatTimeAgo, generateId } from "@/lib/utils";

const CHANNEL_NAME = "pq_messages_realtime";
const TYPING_CHANNEL = "pq_typing_realtime";

export default function MessagesPage() {
  const { currentUser } = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [partners, setPartners] = useState<User[]>([]);
  const [activePartner, setActivePartner] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showNewConv, setShowNewConv] = useState(false);
  const [search, setSearch] = useState("");
  const [typingPartner, setTypingPartner] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const typingChannelRef = useRef<BroadcastChannel | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // BroadcastChannel for real-time messages
  useEffect(() => {
    const ch = new BroadcastChannel(CHANNEL_NAME);
    const typingCh = new BroadcastChannel(TYPING_CHANNEL);
    channelRef.current = ch;
    typingChannelRef.current = typingCh;

    ch.onmessage = (e) => {
      const msg: Message = e.data;
      if (!currentUser) return;
      if (msg.toUserId === currentUser.id || msg.fromUserId === currentUser.id) {
        setConversation(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        refreshPartners();
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
      }
    };

    typingCh.onmessage = (e) => {
      if (!currentUser) return;
      const { fromUserId, toUserId, isTyping } = e.data;
      if (toUserId === currentUser.id) {
        setTypingPartner(isTyping ? fromUserId : null);
        if (isTyping) {
          setTimeout(() => setTypingPartner(null), 3000);
        }
      }
    };

    return () => { ch.close(); typingCh.close(); };
  }, [currentUser]);

  const refreshPartners = useCallback(() => {
    if (!currentUser) return;
    const partnerIds = store.getConversationPartners(currentUser.id);
    const users = store.getUsers().filter(u => u.id !== currentUser.id);
    setAllUsers(users);
    const pUsers = partnerIds.map(id => users.find(u => u.id === id)).filter(Boolean) as User[];
    setPartners(pUsers);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    refreshPartners();
  }, [currentUser, refreshPartners]);

  useEffect(() => {
    if (!currentUser || !activePartner) return;
    setConversation(store.getConversation(currentUser.id, activePartner.id));
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [activePartner, currentUser]);

  const sendMessage = useCallback(() => {
    if (!currentUser || !activePartner || !newMessage.trim()) return;
    const msg: Message = {
      id: generateId(),
      fromUserId: currentUser.id,
      toUserId: activePartner.id,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    store.sendMessage(msg);
    setConversation(prev => [...prev, msg]);
    setNewMessage("");
    // Broadcast to other tabs/windows
    channelRef.current?.postMessage(msg);
    // Stop typing indicator
    typingChannelRef.current?.postMessage({ fromUserId: currentUser.id, toUserId: activePartner.id, isTyping: false });
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    refreshPartners();
    inputRef.current?.focus();
  }, [currentUser, activePartner, newMessage, refreshPartners]);

  const handleTyping = (value: string) => {
    setNewMessage(value);
    if (!currentUser || !activePartner) return;
    typingChannelRef.current?.postMessage({ fromUserId: currentUser.id, toUserId: activePartner.id, isTyping: true });
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      typingChannelRef.current?.postMessage({ fromUserId: currentUser.id, toUserId: activePartner.id, isTyping: false });
    }, 2000);
  };

  const startConversation = (user: User) => {
    setShowNewConv(false);
    setSearch("");
    if (!partners.find(p => p.id === user.id)) {
      setPartners(prev => [user, ...prev]);
    }
    setActivePartner(user);
  };

  const getLastMessage = (partnerId: string): Message | undefined => {
    if (!currentUser) return;
    const conv = store.getConversation(currentUser.id, partnerId);
    return conv[conv.length - 1];
  };

  const filteredUsers = allUsers.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) && !partners.find(p => p.id === u.id)
  );

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="flex h-[calc(100vh-0px)] md:h-screen overflow-hidden" style={{ maxHeight: isMobile ? "calc(100vh - 56px)" : "100vh" }}>
        {/* Conversation list */}
        <div className={`${activePartner && isMobile ? "hidden" : "flex"} md:flex flex-col w-full md:w-80 border-r flex-shrink-0`} style={{ borderColor: "rgba(0,200,255,0.08)" }}>
          {/* Header */}
          <div className="px-4 py-3.5 border-b" style={{ borderColor: "rgba(0,200,255,0.08)" }}>
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Messages</h1>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNewConv(true)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e8102a, #c8001f)", boxShadow: "0 0 12px rgba(232,16,42,0.4)" }}>
                <Plus className="w-4 h-4 text-white" />
              </motion.button>
            </div>
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e8e8f0]/30" />
              <input
                placeholder="Rechercher..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)", color: "#e8e8f0" }}
              />
            </div>
          </div>

          {/* Partner list */}
          <div className="flex-1 overflow-y-auto">
            {partners.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 px-6 text-center">
                <MessageCircle className="w-10 h-10 mb-3" style={{ color: "rgba(0,200,255,0.3)" }} />
                <p className="text-sm text-[#e8e8f0]/40 mb-1">Aucune conversation</p>
                <button onClick={() => setShowNewConv(true)} className="text-xs text-[#e8102a] hover:underline">Démarrer une discussion →</button>
              </div>
            ) : partners.map(partner => {
              const lastMsg = getLastMessage(partner.id);
              const isActive = activePartner?.id === partner.id;
              const unread = (store.getConversation(currentUser.id, partner.id) || []).filter(m => m.toUserId === currentUser.id && !m.read).length;
              return (
                <motion.button
                  key={partner.id}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  onClick={() => setActivePartner(partner)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                  style={{ background: isActive ? "rgba(232,16,42,0.06)" : "transparent", borderLeft: isActive ? "2px solid #e8102a" : "2px solid transparent" }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: partner.avatarColor, boxShadow: `0 0 10px ${partner.avatarColor}55` }}>
                      {getInitials(partner.username)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#39ff14] border-2 border-[#0a0a0f]" style={{ boxShadow: "0 0 6px rgba(57,255,20,0.7)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-semibold text-[#e8e8f0] truncate">@{partner.username}</p>
                      {lastMsg && <span className="text-[10px] text-[#e8e8f0]/30 flex-shrink-0 ml-1">{formatTimeAgo(lastMsg.createdAt)}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      {typingPartner === partner.id ? (
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            {[0,1,2].map(i => <motion.div key={i} className="w-1 h-1 rounded-full bg-[#00c8ff]" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />)}
                          </div>
                          <span className="text-[11px] text-[#00c8ff]">écrit...</span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#e8e8f0]/45 truncate">{lastMsg?.content || "Démarrer une conversation"}</p>
                      )}
                      {unread > 0 && (
                        <span className="ml-1 text-[9px] font-bold text-white w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: "#e8102a" }}>
                          {unread > 9 ? "9+" : unread}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Chat window */}
        {activePartner ? (
          <div className={`${!activePartner && isMobile ? "hidden" : "flex"} md:flex flex-col flex-1 min-w-0`}>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0" style={{ borderColor: "rgba(0,200,255,0.08)", background: "rgba(10,10,20,0.6)", backdropFilter: "blur(16px)" }}>
              {isMobile && (
                <button onClick={() => setActivePartner(null)} className="text-[#e8e8f0]/60 hover:text-[#e8e8f0] mr-1">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: activePartner.avatarColor, boxShadow: `0 0 12px ${activePartner.avatarColor}66` }}>
                  {getInitials(activePartner.username)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#39ff14] border-2 border-[#0a0a0f]" style={{ boxShadow: "0 0 6px rgba(57,255,20,0.7)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#e8e8f0]">@{activePartner.username}</p>
                {typingPartner === activePartner.id ? (
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[0,1,2].map(i => <motion.div key={i} className="w-1 h-1 rounded-full bg-[#00c8ff]" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />)}
                    </div>
                    <span className="text-xs text-[#00c8ff]">écrit un message...</span>
                  </div>
                ) : (
                  <p className="text-xs text-[#39ff14]" style={{ filter: "drop-shadow(0 0 4px rgba(57,255,20,0.5))" }}>● En ligne</p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "rgba(8,8,14,0.6)" }}>
              {conversation.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: `${activePartner.avatarColor}22` }}>
                    <span className="text-2xl">{getInitials(activePartner.username)}</span>
                  </div>
                  <p className="text-sm text-[#e8e8f0]/40">Dis bonjour à @{activePartner.username} !</p>
                </div>
              )}
              {conversation.map((msg, i) => {
                const isMe = msg.fromUserId === currentUser.id;
                const isLast = i === conversation.length - 1;
                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }} className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}>
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-auto" style={{ background: activePartner.avatarColor }}>
                        {getInitials(activePartner.username)}
                      </div>
                    )}
                    <div className="max-w-[75%]">
                      <div className="px-4 py-2.5 text-sm leading-relaxed" style={{
                        background: isMe ? "linear-gradient(135deg, #e8102a, #c8001f)" : "rgba(255,255,255,0.07)",
                        color: "#e8e8f0",
                        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        boxShadow: isMe ? "0 0 16px rgba(232,16,42,0.25)" : "none",
                        border: isMe ? "none" : "1px solid rgba(255,255,255,0.06)",
                      }}>
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                        <p className="text-[10px] text-[#e8e8f0]/25">{formatTimeAgo(msg.createdAt)}</p>
                        {isMe && isLast && (
                          <CheckCheck className="w-3 h-3 text-[#00c8ff]/60" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {/* Typing bubble */}
              <AnimatePresence>
                {typingPartner === activePartner.id && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2 items-end">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: activePartner.avatarColor }}>
                      {getInitials(activePartner.username)}
                    </div>
                    <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "18px 18px 18px 4px" }}>
                      {[0,1,2].map(i => <motion.div key={i} className="w-2 h-2 rounded-full bg-[#e8e8f0]/40" animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(10,10,20,0.8)" }}>
              <div className="flex gap-2 items-end">
                <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,200,255,0.15)" }}>
                  <input
                    ref={inputRef}
                    value={newMessage}
                    onChange={e => handleTyping(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    placeholder="Écrire un message..."
                    className="flex-1 text-sm outline-none bg-transparent"
                    style={{ color: "#e8e8f0" }}
                  />
                  <button className="text-[#e8e8f0]/30 hover:text-[#00c8ff] transition-colors">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: newMessage.trim() ? "linear-gradient(135deg, #e8102a, #c8001f)" : "rgba(232,16,42,0.15)",
                    boxShadow: newMessage.trim() ? "0 0 16px rgba(232,16,42,0.4)" : "none",
                  }}
                >
                  <Send className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-col flex-1 items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(0,200,255,0.06)", border: "1px solid rgba(0,200,255,0.1)" }}>
              <MessageCircle className="w-9 h-9" style={{ color: "rgba(0,200,255,0.4)" }} />
            </div>
            <p className="text-[#e8e8f0]/40 text-sm mb-2">Sélectionnez une conversation</p>
            <button onClick={() => setShowNewConv(true)} className="text-xs px-4 py-2 rounded-xl" style={{ background: "rgba(232,16,42,0.1)", color: "#e8102a", border: "1px solid rgba(232,16,42,0.2)" }}>
              + Nouvelle conversation
            </button>
          </div>
        )}

        {/* New conversation modal */}
        <AnimatePresence>
          {showNewConv && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }} onClick={() => setShowNewConv(false)}>
              <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} className="w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: "#0e0e18", border: "1px solid rgba(255,255,255,0.07)" }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <h3 className="font-bold text-[#e8e8f0]">Nouvelle conversation</h3>
                  <button onClick={() => setShowNewConv(false)}>
                    <X className="w-4 h-4 text-[#e8e8f0]/50" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e8e8f0]/30" />
                    <input
                      autoFocus
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Rechercher un utilisateur..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e8e8f0" }}
                    />
                  </div>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {(search ? filteredUsers : allUsers.filter(u => !partners.find(p => p.id === u.id))).map(user => (
                      <motion.button key={user.id} whileHover={{ x: 2 }} onClick={() => startConversation(user)} className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-white/04 transition-all">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: user.avatarColor, boxShadow: `0 0 8px ${user.avatarColor}55` }}>
                          {getInitials(user.username)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#e8e8f0]">@{user.username}</p>
                          <p className="text-xs text-[#e8e8f0]/40 truncate">{user.bio || "Membre PlayQuest"}</p>
                        </div>
                      </motion.button>
                    ))}
                    {search && filteredUsers.length === 0 && (
                      <p className="text-sm text-[#e8e8f0]/30 text-center py-6">Aucun utilisateur trouvé</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
