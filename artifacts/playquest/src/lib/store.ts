import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  password: z.string(),
  avatarColor: z.string(),
  bio: z.string().optional(),
  followersCount: z.number().default(0),
  followingCount: z.number().default(0),
  postsCount: z.number().default(0),
});
export type User = z.infer<typeof UserSchema>;

export const PostSchema = z.object({
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  imageGradient: z.string().optional(),
  imageUrl: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(["image", "video"]).optional(),
  createdAt: z.string(),
  likesCount: z.number().default(0),
  commentsCount: z.number().default(0),
  hashtags: z.array(z.string()).optional(),
});
export type Post = z.infer<typeof PostSchema>;

export const CommentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  userId: z.string(),
  content: z.string(),
  createdAt: z.string(),
});
export type Comment = z.infer<typeof CommentSchema>;

export const StorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  gradient: z.string(),
  expiresAt: z.string(),
  viewedBy: z.array(z.string()).default([]),
});
export type Story = z.infer<typeof StorySchema>;

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.enum(["like", "comment", "follow", "mention"]),
  fromUserId: z.string(),
  toUserId: z.string(),
  postId: z.string().optional(),
  read: z.boolean().default(false),
  createdAt: z.string(),
});
export type Notification = z.infer<typeof NotificationSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  content: z.string(),
  createdAt: z.string(),
  read: z.boolean().default(false),
});
export type Message = z.infer<typeof MessageSchema>;

export const ChatMessageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  createdAt: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const MOCK_USERS: User[] = [
  { id: "1", username: "alexvx", email: "alex@example.com", password: "demo", avatarColor: "#e8102a", bio: "Digital nomad • Développeur passionné 🚀", followersCount: 1240, followingCount: 350, postsCount: 4 },
  { id: "2", username: "neonqueen", email: "neon@example.com", password: "demo", avatarColor: "#00c8ff", bio: "Cyberpunk enthusiast • Artiste numérique ✨", followersCount: 8450, followingCount: 212, postsCount: 3 },
  { id: "3", username: "darkbyte", email: "dark@example.com", password: "demo", avatarColor: "#9900ff", bio: "Code is poetry • Ingénieur full-stack 💻", followersCount: 3890, followingCount: 760, postsCount: 3 },
  { id: "4", username: "shadowfox", email: "shadow@example.com", password: "demo", avatarColor: "#ff9900", bio: "Night owl • Photographe urbain 📸", followersCount: 12300, followingCount: 480, postsCount: 3 },
  { id: "5", username: "varnox", email: "varnox@prime.com", password: "demo", avatarColor: "#e8102a", bio: "✦ Fondateur de PlayQuest • varnox•prime — La révolution sociale", followersCount: 99999, followingCount: 1, postsCount: 2 },
];

const MOCK_POSTS: Post[] = [
  {
    id: "1", userId: "5",
    content: "Bienvenue sur PlayQuest 2.0 — la révolution sociale commence ici. Un réseau pensé pour les créateurs du futur. ✦",
    mediaUrl: "https://files.catbox.moe/osml4y.jpg",
    mediaType: "image",
    imageGradient: "linear-gradient(135deg, #e8102a, #00c8ff)",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    likesCount: 14832, commentsCount: 2847, hashtags: ["PlayQuest", "varnoxprime", "v2"],
  },
  {
    id: "2", userId: "2",
    content: "Cette ambiance lo-fi en codant à minuit... rien ne bat ça. 🎧 Qui d'autre travaille tard ?",
    mediaUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?rel=0&modestbranding=1",
    mediaType: "video",
    imageGradient: "linear-gradient(135deg, #00c8ff, #0066ff)",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    likesCount: 3241, commentsCount: 187, hashtags: ["lofi", "coding", "nuit"],
  },
  {
    id: "3", userId: "1",
    content: "Mon nouveau setup bureau enfin terminé 🖥️ Dark mode partout, RGB off, concentré au max. Productivité × 10.",
    mediaUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    imageGradient: "linear-gradient(135deg, #e8102a, #ff6b35)",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likesCount: 892, commentsCount: 64, hashtags: ["setup", "tech", "dev"],
  },
  {
    id: "4", userId: "4",
    content: "La ville de nuit est un chef-d'œuvre vivant. Néons, reflets sur le bitume mouillé, silhouettes pressées... 📸",
    mediaUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    imageGradient: "linear-gradient(135deg, #ff9900, #ff6600)",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    likesCount: 4567, commentsCount: 213, hashtags: ["urban", "photographie", "nuit"],
  },
  {
    id: "5", userId: "3",
    content: "TypeScript vient encore de me sauver d'un bug qui aurait coûté 3h en JS vanilla. Merci les types statiques ❤️",
    mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    imageGradient: "linear-gradient(135deg, #9900ff, #cc00ff)",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likesCount: 1876, commentsCount: 98, hashtags: ["typescript", "dev", "code"],
  },
  {
    id: "6", userId: "4",
    content: "Dernière vidéo du Tokyo by night — des millions de lumières, une symphonie visuelle à couper le souffle 🗼",
    mediaUrl: "https://www.youtube.com/embed/hhxyvRnmI3A?rel=0&modestbranding=1",
    mediaType: "video",
    imageGradient: "linear-gradient(135deg, #ff9900, #e8102a)",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    likesCount: 6234, commentsCount: 342, hashtags: ["tokyo", "nightlife", "travel"],
  },
  {
    id: "7", userId: "2",
    content: "UI/UX c'est pas juste du beau design — c'est de l'empathie codée. Chaque pixel raconte une histoire. ✨",
    mediaUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    imageGradient: "linear-gradient(135deg, #00c8ff, #39ff14)",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    likesCount: 2190, commentsCount: 145, hashtags: ["design", "ux", "ui"],
  },
  {
    id: "8", userId: "1",
    content: "Refactorisation complète terminée 🎉 Code propre, tests verts, architecture solide. Le bonheur du développeur.",
    imageGradient: "linear-gradient(135deg, #e8102a, #9900ff)",
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    likesCount: 543, commentsCount: 37, hashtags: ["cleancode", "dev", "refacto"],
  },
  {
    id: "9", userId: "3",
    content: "Quelqu'un code encore à 3h du mat ? 🌙 Non ? Juste moi... Coffee + terminal = meilleur duo 2026.",
    imageGradient: "linear-gradient(135deg, #9900ff, #0066ff)",
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    likesCount: 3478, commentsCount: 289, hashtags: ["nightcoding", "dev", "coffee"],
  },
  {
    id: "10", userId: "5",
    content: "La version 2.0 est en ligne. Ce n'est que le début. ✦ PlayQuest — Le réseau social de nouvelle génération.",
    imageGradient: "linear-gradient(135deg, #e8102a, #00c8ff)",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    likesCount: 99999, commentsCount: 13337, hashtags: ["PlayQuest", "v2", "réseau"],
  },
];

const MOCK_STORIES: Story[] = [
  { id: "1", userId: "2", content: "🎧 Lo-fi session", gradient: "linear-gradient(135deg, #00c8ff, #0066ff)", expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(), viewedBy: [] },
  { id: "2", userId: "5", content: "✦ PlayQuest 2.0", gradient: "linear-gradient(135deg, #e8102a, #00c8ff)", expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(), viewedBy: [] },
  { id: "3", userId: "3", content: "💻 Coding nuit", gradient: "linear-gradient(135deg, #9900ff, #cc00ff)", expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 16).toISOString(), viewedBy: [] },
  { id: "4", userId: "4", content: "📸 Tokyo shots", gradient: "linear-gradient(135deg, #ff9900, #ff6600)", expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(), viewedBy: [] },
  { id: "5", userId: "1", content: "🚀 New project", gradient: "linear-gradient(135deg, #e8102a, #ff6b35)", expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), viewedBy: [] },
];

const MOCK_COMMENTS: Comment[] = [
  { id: "c1", postId: "1", userId: "1", content: "PlayQuest va changer le jeu. Merci varnox ! 🔥", createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
  { id: "c2", postId: "1", userId: "3", content: "La révolution est là. Je suis là depuis le début ✦", createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  { id: "c3", postId: "2", userId: "1", content: "Lofi + code = combo parfait 🎵", createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: "c4", postId: "3", userId: "4", content: "Quel setup ! Tu as quoi comme écran ?", createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: "c5", postId: "5", userId: "2", content: "TypeScript forever ❤️ Impossible de revenir en arrière", createdAt: new Date(Date.now() - 1000 * 60 * 115).toISOString() },
  { id: "c6", postId: "4", userId: "1", content: "Cette photo est incroyable. Tu utilises quel appareil ?", createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString() },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "like", fromUserId: "5", toUserId: "1", postId: "3", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  { id: "n2", type: "follow", fromUserId: "2", toUserId: "1", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { id: "n3", type: "comment", fromUserId: "4", toUserId: "1", postId: "3", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: "n4", type: "like", fromUserId: "3", toUserId: "1", postId: "8", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "n5", type: "mention", fromUserId: "5", toUserId: "1", postId: "1", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: "n6", type: "follow", fromUserId: "4", toUserId: "1", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString() },
];

const MOCK_MESSAGES: Message[] = [
  { id: "m1", fromUserId: "5", toUserId: "1", content: "Bienvenue sur PlayQuest 2.0 ! ✦ La révolution commence.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false },
  { id: "m2", fromUserId: "2", toUserId: "1", content: "Salut ! Tu as vu la mise à jour ? Incroyable ce qu'ils ont fait 🔥", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
  { id: "m3", fromUserId: "1", toUserId: "2", content: "Oui ! La landing page est 🔥🔥🔥", createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), read: true },
  { id: "m4", fromUserId: "2", toUserId: "1", content: "Et LYRA l'IA vocale ? Trop fort ! Elle répond en français 😍", createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), read: false },
  { id: "m5", fromUserId: "3", toUserId: "1", content: "Hey, tu peux reviewer mon PR ? J'ai besoin d'un second regard", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), read: true },
  { id: "m6", fromUserId: "4", toUserId: "1", content: "Mes photos Tokyo — tu penses quoi ? 📸", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), read: true },
];

const MOCK_CHAT: ChatMessage[] = [
  { id: "cc1", userId: "5", content: "✦ Bienvenue sur le Chat Public PlayQuest ! Bienvenue à tous dans la révolution sociale.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
  { id: "cc2", userId: "2", content: "Super! Enfin un réseau social qui comprend les créateurs 🚀", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: "cc3", userId: "1", content: "La nouvelle interface est dingue. Design au top 🔥", createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "cc4", userId: "3", content: "Quelqu'un pour un projet collaboratif ? Cherche dev React/TS 💻", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: "cc5", userId: "4", content: "Je suis dispo ! Moi aussi je cherche un projet 📸", createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: "cc6", userId: "5", content: "PlayQuest v2.0 — seulement le début. La suite va vous couper le souffle ✦", createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
];

const DATA_VERSION = "pq_v4";

export const initStore = () => {
  if (localStorage.getItem("pq_version") !== DATA_VERSION) {
    ["pq_users","pq_posts","pq_stories","pq_comments","pq_notifications","pq_messages","pq_likes","pq_follows","pq_chat"].forEach(k => localStorage.removeItem(k));
    localStorage.setItem("pq_version", DATA_VERSION);
  }
  if (!localStorage.getItem("pq_users")) localStorage.setItem("pq_users", JSON.stringify(MOCK_USERS));
  if (!localStorage.getItem("pq_posts")) localStorage.setItem("pq_posts", JSON.stringify(MOCK_POSTS));
  if (!localStorage.getItem("pq_stories")) localStorage.setItem("pq_stories", JSON.stringify(MOCK_STORIES));
  if (!localStorage.getItem("pq_comments")) localStorage.setItem("pq_comments", JSON.stringify(MOCK_COMMENTS));
  if (!localStorage.getItem("pq_notifications")) localStorage.setItem("pq_notifications", JSON.stringify(MOCK_NOTIFICATIONS));
  if (!localStorage.getItem("pq_messages")) localStorage.setItem("pq_messages", JSON.stringify(MOCK_MESSAGES));
  if (!localStorage.getItem("pq_likes")) localStorage.setItem("pq_likes", JSON.stringify([]));
  if (!localStorage.getItem("pq_follows")) localStorage.setItem("pq_follows", JSON.stringify([]));
  if (!localStorage.getItem("pq_chat")) localStorage.setItem("pq_chat", JSON.stringify(MOCK_CHAT));
};

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const store = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem("pq_users") || "[]"),
  getUserById: (id: string): User | undefined => store.getUsers().find(u => u.id === id),
  getUserByUsername: (username: string): User | undefined => store.getUsers().find(u => u.username === username),
  saveUser: (user: User) => {
    const users = store.getUsers();
    localStorage.setItem("pq_users", JSON.stringify([...users.filter(u => u.id !== user.id), user]));
  },
  addUser: (user: User) => {
    localStorage.setItem("pq_users", JSON.stringify([...store.getUsers(), user]));
  },

  getPosts: (): Post[] => (JSON.parse(localStorage.getItem("pq_posts") || "[]") as Post[]).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getPostsByUser: (userId: string): Post[] => store.getPosts().filter(p => p.userId === userId),
  savePost: (post: Post) => {
    const posts = JSON.parse(localStorage.getItem("pq_posts") || "[]") as Post[];
    localStorage.setItem("pq_posts", JSON.stringify([post, ...posts.filter(p => p.id !== post.id)]));
  },
  addPost: (data: Partial<Post> & { userId: string; content: string }) => {
    const post: Post = {
      id: genId(),
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      hashtags: [],
      ...data,
    } as Post;
    const posts = JSON.parse(localStorage.getItem("pq_posts") || "[]") as Post[];
    localStorage.setItem("pq_posts", JSON.stringify([post, ...posts]));
    return post;
  },

  getComments: (postId: string): Comment[] => (JSON.parse(localStorage.getItem("pq_comments") || "[]") as Comment[]).filter(c => c.postId === postId),
  addComment: (data: { userId: string; postId: string; content: string }) => {
    const comment: Comment = { id: genId(), createdAt: new Date().toISOString(), ...data };
    const comments = JSON.parse(localStorage.getItem("pq_comments") || "[]") as Comment[];
    localStorage.setItem("pq_comments", JSON.stringify([...comments, comment]));
    const posts = JSON.parse(localStorage.getItem("pq_posts") || "[]") as Post[];
    localStorage.setItem("pq_posts", JSON.stringify(posts.map(p => p.id === data.postId ? { ...p, commentsCount: p.commentsCount + 1 } : p)));
  },

  getStories: (): Story[] => (JSON.parse(localStorage.getItem("pq_stories") || "[]") as Story[]).filter(s => new Date(s.expiresAt) > new Date()),
  addStory: (story: Story) => {
    const stories = JSON.parse(localStorage.getItem("pq_stories") || "[]") as Story[];
    localStorage.setItem("pq_stories", JSON.stringify([...stories, story]));
  },
  markStoryViewed: (storyId: string, userId: string) => {
    const stories = JSON.parse(localStorage.getItem("pq_stories") || "[]") as Story[];
    localStorage.setItem("pq_stories", JSON.stringify(stories.map(s => s.id === storyId ? { ...s, viewedBy: [...s.viewedBy.filter(id => id !== userId), userId] } : s)));
  },

  getLikes: (): { postId: string; userId: string }[] => JSON.parse(localStorage.getItem("pq_likes") || "[]"),
  isLiked: (postId: string, userId: string): boolean => store.getLikes().some(l => l.postId === postId && l.userId === userId),
  toggleLike: (postId: string, userId: string): boolean => {
    const likes = store.getLikes();
    const liked = likes.some(l => l.postId === postId && l.userId === userId);
    if (liked) {
      localStorage.setItem("pq_likes", JSON.stringify(likes.filter(l => !(l.postId === postId && l.userId === userId))));
      const posts = JSON.parse(localStorage.getItem("pq_posts") || "[]") as Post[];
      localStorage.setItem("pq_posts", JSON.stringify(posts.map(p => p.id === postId ? { ...p, likesCount: Math.max(0, p.likesCount - 1) } : p)));
    } else {
      localStorage.setItem("pq_likes", JSON.stringify([...likes, { postId, userId }]));
      const posts = JSON.parse(localStorage.getItem("pq_posts") || "[]") as Post[];
      localStorage.setItem("pq_posts", JSON.stringify(posts.map(p => p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p)));
    }
    return !liked;
  },

  getFollows: (): { followerId: string; followingId: string }[] => JSON.parse(localStorage.getItem("pq_follows") || "[]"),
  isFollowing: (followerId: string, followingId: string): boolean => store.getFollows().some(f => f.followerId === followerId && f.followingId === followingId),
  toggleFollow: (followerId: string, followingId: string): boolean => {
    const follows = store.getFollows();
    const isFollowing = follows.some(f => f.followerId === followerId && f.followingId === followingId);
    if (isFollowing) {
      localStorage.setItem("pq_follows", JSON.stringify(follows.filter(f => !(f.followerId === followerId && f.followingId === followingId))));
    } else {
      localStorage.setItem("pq_follows", JSON.stringify([...follows, { followerId, followingId }]));
    }
    return !isFollowing;
  },

  getNotifications: (userId: string): Notification[] => (JSON.parse(localStorage.getItem("pq_notifications") || "[]") as Notification[]).filter(n => n.toUserId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getUnreadCount: (userId: string): number => store.getNotifications(userId).filter(n => !n.read).length,
  markAllRead: (userId: string) => {
    const all = JSON.parse(localStorage.getItem("pq_notifications") || "[]") as Notification[];
    localStorage.setItem("pq_notifications", JSON.stringify(all.map(n => n.toUserId === userId ? { ...n, read: true } : n)));
  },
  addNotification: (notif: Notification) => {
    const all = JSON.parse(localStorage.getItem("pq_notifications") || "[]") as Notification[];
    localStorage.setItem("pq_notifications", JSON.stringify([notif, ...all]));
  },

  getMessages: (): Message[] => JSON.parse(localStorage.getItem("pq_messages") || "[]"),
  getConversation: (userId1: string, userId2: string): Message[] =>
    (JSON.parse(localStorage.getItem("pq_messages") || "[]") as Message[])
      .filter(m => (m.fromUserId === userId1 && m.toUserId === userId2) || (m.fromUserId === userId2 && m.toUserId === userId1))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  getConversationPartners: (userId: string): string[] => {
    const msgs = JSON.parse(localStorage.getItem("pq_messages") || "[]") as Message[];
    const partners = new Set<string>();
    msgs.forEach(m => {
      if (m.fromUserId === userId) partners.add(m.toUserId);
      if (m.toUserId === userId) partners.add(m.fromUserId);
    });
    return Array.from(partners);
  },
  sendMessage: (msg: Message) => {
    const msgs = JSON.parse(localStorage.getItem("pq_messages") || "[]") as Message[];
    localStorage.setItem("pq_messages", JSON.stringify([...msgs, msg]));
  },
  getUnreadMessages: (userId: string): number => (JSON.parse(localStorage.getItem("pq_messages") || "[]") as Message[]).filter(m => m.toUserId === userId && !m.read).length,

  getChatMessages: (): ChatMessage[] => (JSON.parse(localStorage.getItem("pq_chat") || "[]") as ChatMessage[]).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  addChatMessage: (msg: ChatMessage) => {
    const msgs = JSON.parse(localStorage.getItem("pq_chat") || "[]") as ChatMessage[];
    localStorage.setItem("pq_chat", JSON.stringify([...msgs, msg]));
  },
};
