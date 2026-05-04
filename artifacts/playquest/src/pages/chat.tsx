import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Hash, Users, Wifi } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, ChatMessage } from "@/lib/store";
import { getInitials, formatTimeAgo, generateId } from "@/lib/utils";

const ONLINE_USERS = ["alexvx", "neonqueen", "darkbyte", "shadowfox", "varnox"];

export default function ChatPage() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [onlineCount] = useState(Math.floor(Math.random() * 8) + 12);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, []);

  useEffect(() => {
    setMessages(store.getChatMessages());
    scrollToBottom();

    channelRef.current = new BroadcastChannel("pq_public_chat");
    channelRef.current.onmessage = (e) => {
      if (e.data?.type === "NEW_CHAT_MSG") {
        setMessages(prev => {
          if (prev.find(m => m.id === e.data.msg.id)) return prev;
          return [...prev, e.data.msg];
        });
        scrollToBottom();
      }
    };

    const storageSync = (e: StorageEvent) => {
      if (e.key === "pq_chat") {
        setMessages(store.getChatMessages());
        scrollToBottom();
      }
    };
    window.addEventListener("storage", storageSync);

    return () => {
      channelRef.current?.close();
      window.removeEventListener("storage", storageSync);
    };
  }, [scrollToBottom]);

  const sendMessage = () => {
    if (!currentUser || !text.trim()) return;
    const msg: ChatMessage = {
      id: generateId(),
      userId: currentUser.id,
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };
    store.addChatMessage(msg);
    channelRef.current?.postMessage({ type: "NEW_CHAT_MSG", msg });
    setMessages(prev => [...prev, msg]);
    setText("");
    scrollToBottom();
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const groupedMessages = messages.reduce<{ msg: ChatMessage; showAvatar: boolean }[]>((acc, msg, i) => {
    const prev = messages[i - 1];
    const showAvatar = !prev || prev.userId !== msg.userId ||
      new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() > 60000 * 3;
    acc.push({ msg, showAvatar });
    return acc;
  }, []);

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="flex h-screen" style={{ maxHeight: "calc(100vh - 0px)" }}>
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(11,11,18,0.8)", backdropFilter: "blur(16px)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e8102a, #00c8ff)" }}>
                <Hash className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-[#e8e8f0]">Chat Public</h1>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14]" style={{ boxShadow: "0 0 6px rgba(57,255,20,0.8)" }} />
                  <span className="text-[11px] text-[#e8e8f0]/40">{onlineCount} membres en ligne</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {ONLINE_USERS.slice(0, 4).map((u, i) => {
                  const user = store.getUserByUsername(u);
                  return (
                    <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white" style={{ borderColor: "#0a0a0f", background: user?.avatarColor || "#333", zIndex: 4 - i }}>
                      {getInitials(u)}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-1 text-[#39ff14]">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium hidden sm:block">Live</span>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.05) transparent" }}>
            <AnimatePresence initial={false}>
              {groupedMessages.map(({ msg, showAvatar }, i) => {
                const isMe = msg.userId === currentUser.id;
                const user = store.getUserById(msg.userId);
                if (!user) return null;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"} ${showAvatar ? "mt-3" : "mt-0.5"}`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-8">
                      {showAvatar ? (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: user.avatarColor }}>
                          {getInitials(user.username)}
                        </div>
                      ) : null}
                    </div>

                    {/* Bubble */}
                    <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                      {showAvatar && (
                        <span className={`text-[11px] text-[#e8e8f0]/40 mb-1 ${isMe ? "text-right" : "text-left"}`}>
                          {isMe ? "Vous" : `@${user.username}`}
                          <span className="ml-2 text-[#e8e8f0]/20">{formatTimeAgo(msg.createdAt)}</span>
                        </span>
                      )}
                      <div
                        className="px-3.5 py-2 rounded-2xl text-sm leading-relaxed"
                        style={{
                          background: isMe
                            ? "linear-gradient(135deg, #e8102a, #c8001f)"
                            : "rgba(255,255,255,0.05)",
                          color: "#e8e8f0",
                          borderRadius: isMe
                            ? (showAvatar ? "18px 4px 18px 18px" : "18px 4px 18px 18px")
                            : (showAvatar ? "4px 18px 18px 18px" : "4px 18px 18px 18px"),
                          boxShadow: isMe ? "0 2px 12px rgba(232,16,42,0.25)" : "none",
                          border: isMe ? "none" : "1px solid rgba(255,255,255,0.06)",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="px-4 py-3.5 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(11,11,18,0.6)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: currentUser.avatarColor }}>
                {getInitials(currentUser.username)}
              </div>
              <input
                ref={inputRef}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Écrire dans le chat public..."
                className="flex-1 bg-transparent text-sm outline-none text-[#e8e8f0] placeholder:text-[#e8e8f0]/25"
                maxLength={500}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={sendMessage}
                disabled={!text.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: text.trim() ? "linear-gradient(135deg, #e8102a, #c8001f)" : "rgba(255,255,255,0.06)",
                  boxShadow: text.trim() ? "0 0 12px rgba(232,16,42,0.35)" : "none",
                }}
              >
                <Send className="w-3.5 h-3.5" style={{ color: text.trim() ? "white" : "rgba(232,232,240,0.3)" }} />
              </motion.button>
            </div>
            <p className="text-[10px] text-[#e8e8f0]/20 text-center mt-2">
              Chat public — visible par tous les membres
            </p>
          </div>
        </div>

        {/* Right sidebar — online members */}
        <div className="hidden lg:flex flex-col w-56 border-l flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(11,11,18,0.4)" }}>
          <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 text-[#e8e8f0]/50">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">En ligne — {onlineCount}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {ONLINE_USERS.map(username => {
              const user = store.getUserByUsername(username);
              if (!user) return null;
              return (
                <div key={username} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.03] transition-all">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: user.avatarColor }}>
                      {getInitials(username)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#39ff14] border border-[#0a0a0f]" />
                  </div>
                  <span className="text-xs text-[#e8e8f0]/60 truncate">@{username}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
