import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, store } from "@/lib/store";

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, avatarColor: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("pq_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("pq_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("pq_current_user");
    }
  }, [currentUser]);

  const login = async (username: string, password: string): Promise<boolean> => {
    const user = store.getUserByUsername(username);
    if (user && user.password === password) {
      setCurrentUser(user);
      return true;
    }
    // Allow demo login
    if (username === "demo" && password === "demo") {
      const demoUser = store.getUserByUsername("alexvx");
      if (demoUser) { setCurrentUser(demoUser); return true; }
    }
    return false;
  };

  const register = async (username: string, email: string, password: string, avatarColor: string): Promise<boolean> => {
    const existing = store.getUserByUsername(username);
    if (existing) return false;
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password,
      avatarColor,
      bio: "",
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
    };
    store.addUser(newUser);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => setCurrentUser(null);

  const updateUser = (user: User) => {
    store.saveUser(user);
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
