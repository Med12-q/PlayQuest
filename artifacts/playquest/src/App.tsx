import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { initStore } from "@/lib/store";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import FeedPage from "@/pages/feed";
import ExplorePage from "@/pages/explore";
import MessagesPage from "@/pages/messages";
import ChatPage from "@/pages/chat";
import NotificationsPage from "@/pages/notifications";
import ProfilePage from "@/pages/profile";
import SettingsPage from "@/pages/settings";
import ReelsPage from "@/pages/reels";
import MusicPage from "@/pages/music";
import AIChatPage from "@/pages/ai-chat";

initStore();

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Redirect to="/login" />;
  return <Component />;
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { currentUser } = useAuth();
  if (currentUser) return <Redirect to="/feed" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => { const { currentUser } = useAuth(); return currentUser ? <Redirect to="/feed" /> : <Redirect to="/login" />; }} />
      <Route path="/login" component={() => <PublicRoute component={LoginPage} />} />
      <Route path="/register" component={() => <PublicRoute component={RegisterPage} />} />
      <Route path="/feed" component={() => <ProtectedRoute component={FeedPage} />} />
      <Route path="/explore" component={() => <ProtectedRoute component={ExplorePage} />} />
      <Route path="/reels" component={() => <ProtectedRoute component={ReelsPage} />} />
      <Route path="/music" component={() => <ProtectedRoute component={MusicPage} />} />
      <Route path="/messages" component={() => <ProtectedRoute component={MessagesPage} />} />
      <Route path="/chat" component={() => <ProtectedRoute component={ChatPage} />} />
      <Route path="/notifications" component={() => <ProtectedRoute component={NotificationsPage} />} />
      <Route path="/profile/:username" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={SettingsPage} />} />
      <Route path="/ai" component={() => <ProtectedRoute component={AIChatPage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base="">
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
