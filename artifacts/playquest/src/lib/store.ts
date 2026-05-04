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
  { id: "1", username: "alexvx", email: "alex@example.com", password: "demo", avatarColor: "#e8102a", bio: "Digital nomad • Développeur passionné", followersCount: 120, followingCount: 50, postsCount: 2 },
  { id: "2", username: "neonqueen", email: "neon@example.com", password: "demo", avatarColor: "#00c8ff", bio: "Cyberpunk enthusiast • Artiste numérique", followersCount: 450, followingCount: 12, postsCount: 2 },
  { id: "3", username: "darkbyte", email: "dark@example.com", password: "demo", avatarColor: "#9900ff", bio: "Code is poetry • Ingénieur passionné", followersCount: 89, followingCount: 100, postsCount: 2 },
  { id: "4", username: "shadowfox", email: "shadow@example.com", password: "demo", avatarColor: "#ff9900", bio: "Night owl • Photographe urbain", followersCount: 230, followingCount: 80, postsCount: 2 },
  { id: "5", username: "varnox", email: "varnox@prime.com", password: "demo", avatarColor: "#e8102a", bio: "✦ Fondateur de PlayQuest • varnox•prime", followersCount: 9999, followingCount: 1, postsCount: 2 },
];

const MOCK_POSTS: Post[] = [
  { id: "1", userId: "1", content: "Vient de déployer mon nouveau projet ! La stack est incroyable 🚀", imageGradient: "linear-gradient(135deg, #e8102a, #ff6b35)", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), likesCount: 42, commentsCount: 5, hashtags: ["#dev", "#tech"] },
  { id: "2", userId: "2", content: "Les vibes de la ville nocturne ce soir sont incomparables. Lumières néon partout ✨", imageGradient: "linear-gradient(135deg, #00c8ff, #0066ff)", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), likesCount: 128, commentsCount: 12, hashtags: ["#neon", "#nightlife"] },
  { id: "3", userId: "3", content: "Refactoring du code legacy... souhaitez-moi bonne chance 😅 #CleanCode", imageGradient: "linear-gradient(135deg, #9900ff, #cc00ff)", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), likesCount: 35, commentsCount: 8, hashtags: ["#code", "#dev"] },
  { id: "4", userId: "4", content: "Découvert un endroit incroyable en plein centre-ville ☕", imageGradient: "linear-gradient(135deg, #ff9900, #ff6600)", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), likesCount: 89, commentsCount: 3, hashtags: ["#urban", "#photo"] },
  { id: "5", userId: "5", content: "Bienvenue sur PlayQuest. La révolution commence ici. ✦", imageGradient: "linear-gradient(135deg, #e8102a, #00c8ff)", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), likesCount: 9999, commentsCount: 1337, hashtags: ["#PlayQuest", "#varnoxprime"] },
  { id: "6", userId: "1", content: "Explorer de nouveaux frameworks est toujours fun jusqu'à ce bug 😂", imageGradient: "linear-gradient(135deg, #e8102a, #9900ff)", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), likesCount: 24, commentsCount: 2, hashtags: ["#bug", "#dev"] },
  { id: "7", userId: "2", content: "Nouveau setup de bureau terminé ! La productivité est au max 🎧", imageGradient: "linear-gradient(135deg, #00c8ff, #39ff14)", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), likesCount: 210, commentsCount: 45, hashtags: ["#tech", "#gaming"] },
  { id: "8", userId: "3", content: "TypeScript c'est la vie ❤️ Qui d'autre ne peut plus coder sans types ?", imageGradient: "linear-gradient(135deg, #9900ff, #0066ff)", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), likesCount: 67, commentsCount: 10, hashtags: ["#typescript", "#dev"] },
  { id: "9", userId: "4", content: "Quelqu'un d'autre code à 3h du matin ? Non ? Juste moi... 🌙", imageGradient: "linear-gradient(135deg, #ff9900, #e8102a)", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), likesCount: 156, commentsCount: 34, hashtags: ["#nightcoding", "#dev"] },
  { id: "10", userId: "5", content: "Version 2.0 arrive très bientôt. Restez connectés. ✦", imageGradient: "linear-gradient(135deg, #e8102a, #00c8ff)", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), likesCount: 8500, commentsCount: 1200, hashtags: ["#PlayQuest", "#v2"] },
];

const MOCK_STORIES: Story[] = [
  { id: "1", userId: "2", content: "Café du matin ☕", gradient: "linear-gradient(135deg, #00c8ff, #0066ff)", expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), viewedBy: [] },
  { id: "2", userId: "5", content: "Aperçu de la v2.0 ✦", gradient: "linear-gradient(135deg, #e8102a, #00c8ff)", expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 15).toISOString(), viewedBy: [] },
  { id: "3", userId: "3", content: "Bug enfin corrigé ! 🎉", gradient: "linear-gradient(135deg, #9900ff, #cc00ff)", expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(), viewedBy: [] },
  { id: "4", userId: "4", content: "Coucher de soleil 🌅", gradient: "linear-gradient(135deg, #ff9900, #ff6600)", expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(), viewedBy: [] },
];

const MOCK_COMMENTS: Comment[] = [
  { id: "1", postId: "1", userId: "2", content: "Félicitations ! Quel framework ?", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "2", postId: "1", userId: "3", content: "Bien joué dev ! 🔥", createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
  { id: "3", postId: "5", userId: "1", content: "PlayQuest c'est le meilleur ! 🚀", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "like", fromUserId: "2", toUserId: "1", postId: "1", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: "2", type: "follow", fromUserId: "5", toUserId: "1", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
  { id: "3", type: "comment", fromUserId: "3", toUserId: "1", postId: "6", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: "4", type: "like", fromUserId: "4", toUserId: "1", postId: "1", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "5", type: "mention", fromUserId: "5", toUserId: "1", postId: "5", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

const MOCK_MESSAGES: Message[] = [
  { id: "1", fromUserId: "2", toUserId: "1", content: "Salut ! Tu as vu la nouvelle mise à jour ? 🔥", createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), read: false },
  { id: "2", fromUserId: "1", toUserId: "2", content: "Oui ! Incroyable ce qu'ils ont fait 🚀", createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), read: true },
  { id: "3", fromUserId: "2", toUserId: "1", content: "La v2.0 va être énorme d'après varnox", createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
  { id: "4", fromUserId: "5", toUserId: "1", content: "Bienvenue sur PlayQuest ! ✦", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true },
  { id: "5", fromUserId: "3", toUserId: "1", content: "Hey, tu peux m'aider avec ce bug TypeScript ?", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), read: true },
];

const MOCK_CHAT: ChatMessage[] = [
  { id: "c1", userId: "5", content: "Bienvenue sur le Chat Public PlayQuest ! ✦ Tout le monde peut discuter ici.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: "c2", userId: "2", content: "Super idée ce chat public ! Enfin on peut tous se parler 🚀", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "c3", userId: "1", content: "Complètement d'accord ! La communauté PlayQuest est au top", createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "c4", userId: "3", content: "Qui d'autre code en ce moment ? Je suis sur un nouveau projet 💻", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: "c5", userId: "4", content: "Moi ! Nouvelle fonctionnalité photo en cours 📸", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "c6", userId: "5", content: "La version 2.0 arrive très bientôt, restez connectés ✦", createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
];

export const initStore = () => {
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

  getComments: (postId: string): Comment[] => (JSON.parse(localStorage.getItem("pq_comments") || "[]") as Comment[]).filter(c => c.postId === postId),
  addComment: (comment: Comment) => {
    const comments = JSON.parse(localStorage.getItem("pq_comments") || "[]") as Comment[];
    localStorage.setItem("pq_comments", JSON.stringify([...comments, comment]));
    const posts = JSON.parse(localStorage.getItem("pq_posts") || "[]") as Post[];
    localStorage.setItem("pq_posts", JSON.stringify(posts.map(p => p.id === comment.postId ? { ...p, commentsCount: p.commentsCount + 1 } : p)));
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
    const isLiked = likes.some(l => l.postId === postId && l.userId === userId);
    if (isLiked) {
      localStorage.setItem("pq_likes", JSON.stringify(likes.filter(l => !(l.postId === postId && l.userId === userId))));
      const posts = JSON.parse(localStorage.getItem("pq_posts") || "[]") as Post[];
      localStorage.setItem("pq_posts", JSON.stringify(posts.map(p => p.id === postId ? { ...p, likesCount: Math.max(0, p.likesCount - 1) } : p)));
    } else {
      localStorage.setItem("pq_likes", JSON.stringify([...likes, { postId, userId }]));
      const posts = JSON.parse(localStorage.getItem("pq_posts") || "[]") as Post[];
      localStorage.setItem("pq_posts", JSON.stringify(posts.map(p => p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p)));
    }
    return !isLiked;
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
