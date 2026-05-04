import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, TrendingUp, UserPlus, UserCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { store, Post, User } from "@/lib/store";
import { getInitials } from "@/lib/utils";

const TRENDING_TAGS = [
  { tag: "#PlayQuest", count: 12400 },
  { tag: "#varnoxprime", count: 8900 },
  { tag: "#NeonVibes", count: 5600 },
  { tag: "#DevLife", count: 4200 },
  { tag: "#Cyberpunk", count: 3800 },
  { tag: "#TypeScript", count: 2900 },
];

function PostGrid({ post }: { post: Post }) {
  return (
    <Link to="/feed">
      <motion.div whileHover={{ scale: 1.03 }} className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group" style={{ background: post.imageGradient }} data-testid={`card-explore-post-${post.id}`}>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <p className="text-white text-xs text-center px-2 line-clamp-2">{post.content}</p>
        </div>
      </motion.div>
    </Link>
  );
}

function UserCard({ user, currentUserId }: { user: User; currentUserId?: string }) {
  const [following, setFollowing] = useState(currentUserId ? store.isFollowing(currentUserId, user.id) : false);

  const toggleFollow = () => {
    if (!currentUserId) return;
    store.toggleFollow(currentUserId, user.id);
    setFollowing(!following);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(17,17,24,0.6)", border: "1px solid rgba(0,200,255,0.06)" }} data-testid={`card-user-${user.id}`}>
      <Link to={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: user.avatarColor, boxShadow: `0 0 10px ${user.avatarColor}60` }}>
          {getInitials(user.username)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#e8e8f0] truncate">@{user.username}</p>
          <p className="text-xs text-[#e8e8f0]/50">{user.followersCount.toLocaleString()} abonnés</p>
        </div>
      </Link>
      <button onClick={toggleFollow} data-testid={`button-follow-${user.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all" style={{ background: following ? "rgba(0,200,255,0.1)" : "linear-gradient(135deg, #e8102a, #c8001f)", color: following ? "#00c8ff" : "white", border: following ? "1px solid rgba(0,200,255,0.3)" : "none", boxShadow: following ? "none" : "0 0 10px rgba(232,16,42,0.4)" }}>
        {following ? <><UserCheck className="w-3.5 h-3.5" /> Suivi</> : <><UserPlus className="w-3.5 h-3.5" /> Suivre</>}
      </button>
    </motion.div>
  );
}

export default function ExplorePage() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "people">("posts");

  useEffect(() => {
    const allPosts = store.getPosts();
    const allUsers = store.getUsers().filter(u => u.id !== currentUser?.id).sort((a, b) => b.followersCount - a.followersCount);
    setPosts(allPosts);
    setUsers(allUsers);
    setFilteredPosts(allPosts);
    setFilteredUsers(allUsers);
  }, [currentUser]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      setFilteredUsers(users);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredPosts(posts.filter(p => p.content.toLowerCase().includes(q) || p.hashtags?.some(h => h.toLowerCase().includes(q))));
      setFilteredUsers(users.filter(u => u.username.toLowerCase().includes(q) || u.bio?.toLowerCase().includes(q)));
    }
  }, [searchQuery, posts, users]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold gradient-text mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Explorer</h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e8e8f0]/40" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Rechercher des posts, utilisateurs, #hashtags..." data-testid="input-search" className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", color: "#e8e8f0" }} onFocus={e => { e.target.style.borderColor = "rgba(0,200,255,0.5)"; e.target.style.boxShadow = "0 0 16px rgba(0,200,255,0.15)"; }} onBlur={e => { e.target.style.borderColor = "rgba(0,200,255,0.2)"; e.target.style.boxShadow = "none"; }} />
        </div>

        {!searchQuery && (
          <>
            {/* Trending */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#e8102a]" />
                <h2 className="text-sm font-semibold text-[#e8e8f0]/70 uppercase tracking-wider">Tendances</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TRENDING_TAGS.map(({ tag, count }, i) => (
                  <motion.button key={tag} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setSearchQuery(tag)} className="flex items-center justify-between p-3 rounded-xl text-left transition-all hover:opacity-80" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(0,200,255,0.08)" }} data-testid={`button-tag-${i}`}>
                    <span className="text-sm font-semibold text-[#00c8ff]/90">{tag}</span>
                    <span className="text-xs text-[#e8e8f0]/40">{count.toLocaleString()}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Creators to follow */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-[#e8e8f0]/70 uppercase tracking-wider mb-3">Créateurs à suivre</h2>
              <div className="space-y-2">
                {users.slice(0, 4).map(u => <UserCard key={u.id} user={u} currentUserId={currentUser?.id} />)}
              </div>
            </div>

            {/* Posts grid */}
            <div>
              <h2 className="text-sm font-semibold text-[#e8e8f0]/70 uppercase tracking-wider mb-3">Publications populaires</h2>
              <div className="grid grid-cols-3 gap-2">
                {posts.map(p => <PostGrid key={p.id} post={p} />)}
              </div>
            </div>
          </>
        )}

        {searchQuery && (
          <>
            <div className="flex gap-2 mb-4">
              <button onClick={() => setActiveTab("posts")} data-testid="tab-posts" className="px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: activeTab === "posts" ? "linear-gradient(135deg, #e8102a, #c8001f)" : "rgba(255,255,255,0.05)", color: activeTab === "posts" ? "white" : "rgba(232,232,240,0.6)" }}>Publications ({filteredPosts.length})</button>
              <button onClick={() => setActiveTab("people")} data-testid="tab-people" className="px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: activeTab === "people" ? "linear-gradient(135deg, #00c8ff, #0066ff)" : "rgba(255,255,255,0.05)", color: activeTab === "people" ? "white" : "rgba(232,232,240,0.6)" }}>Personnes ({filteredUsers.length})</button>
            </div>
            {activeTab === "posts" && (
              filteredPosts.length === 0 ? <p className="text-center text-[#e8e8f0]/40 py-12">Aucun résultat</p> :
              <div className="grid grid-cols-3 gap-2">{filteredPosts.map(p => <PostGrid key={p.id} post={p} />)}</div>
            )}
            {activeTab === "people" && (
              filteredUsers.length === 0 ? <p className="text-center text-[#e8e8f0]/40 py-12">Aucun utilisateur trouvé</p> :
              <div className="space-y-2">{filteredUsers.map(u => <UserCard key={u.id} user={u} currentUserId={currentUser?.id} />)}</div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
