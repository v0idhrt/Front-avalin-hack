import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TabBar } from "./components/TabBar";
import { HomeFeed } from "./components/HomeFeed";
import { DiscoveryFeed } from "./components/DiscoveryFeed";
import { RoutesFeed } from "./components/RoutesFeed";
import { UserProfile } from "./components/UserProfile";
import { OrganizerProfile } from "./components/OrganizerProfile";
import { ExcursionCard as ExcursionDetail } from "./components/ExcursionCard";
import { BookingFlow } from "./components/BookingFlow";
import { AuthPage } from "./components/AuthPage";
import { MyRoutes } from "./components/MyRoutes";
import {
  SubscriptionsPage,
  LikesPage,
  ReviewsPage,
  BookingsPage,
  ReceiptsPage,
  SupportPage,
  AboutPage,
  SettingsPage,
} from "./components/ProfileSubPages";
import { OrganizerDashboard } from "./components/OrganizerDashboard";
import { excursions, organizers, Excursion, Organizer } from "./components/data";
import { LiquidBackground } from "./components/LiquidBackground";
import { useExcursion } from "./hooks/useContent";

function ExcursionById({ excursionId, onBack, onBook, isDark }: { excursionId: number; onBack: () => void; onBook: (exc: any) => void; isDark: boolean }) {
  const { data, isLoading } = useExcursion(excursionId);
  const fallback = excursions.find(e => e.id === `exc${excursionId}`);
  const excursion = data ?? fallback;

  if (isLoading && !fallback) {
    return <div className="flex items-center justify-center h-full"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full" /></div>;
  }
  if (!excursion) return null;
  return <ExcursionDetail excursion={excursion} onBack={onBack} onBook={onBook} isDark={isDark} />;
}

type Screen =
  | { type: "home" }
  | { type: "discovery" }
  | { type: "routes" }
  | { type: "profile" }
  | { type: "excursion"; excursion: any; excursionId?: number }
  | { type: "booking"; excursion: any }
  | { type: "organizer"; organizer: Organizer; authorUserId?: number }
  | { type: "subscriptions" }
  | { type: "likes" }
  | { type: "reviews" }
  | { type: "bookings" }
  | { type: "receipts" }
  | { type: "support" }
  | { type: "about" }
  | { type: "settings" }
  | { type: "myRoutes" };

type AuthState =
  | { status: "unauthenticated" }
  | { status: "user" }
  | { status: "organizer"; organizerId: string };

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ status: "unauthenticated" });
  const [screen, setScreen] = useState<Screen>({ type: "home" });
  const [tabBarVisible, setTabBarVisible] = useState(true);
  const [history, setHistory] = useState<Screen[]>([]);
  const [isDark, setIsDark] = useState(true);

  const handleLogin = useCallback((role: "user" | "organizer", organizerId?: string) => {
    if (role === "organizer") {
      setAuth({ status: "organizer", organizerId: organizerId || "org1" });
      setScreen({ type: "home" });
    } else {
      setAuth({ status: "user" });
      setScreen({ type: "home" });
    }
  }, []);

  const handleLogout = useCallback(() => {
    setAuth({ status: "unauthenticated" });
    setScreen({ type: "home" });
    setHistory([]);
  }, []);

  const navigate = useCallback((next: Screen) => {
    setHistory((prev) => [...prev, screen]);
    setScreen(next);
    setTabBarVisible(true);
  }, [screen]);

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const last = newHistory.pop()!;
      setScreen(last);
      return newHistory;
    });
  }, []);

  const handleTabNavigate = useCallback((tab: string) => {
    setHistory([]);
    if (tab === "home") setScreen({ type: "home" });
    else if (tab === "discovery") setScreen({ type: "discovery" });
    else if (tab === "routes") setScreen({ type: "routes" });
    else setScreen({ type: "profile" });
  }, []);

  const handleExcursionFromPost = useCallback((excursionId: string) => {
    const numericId = parseInt(excursionId.replace("exc", ""));
    const exc = excursions.find((e) => e.id === excursionId);
    navigate({ type: "excursion", excursion: exc ?? {}, excursionId: numericId });
  }, [navigate]);

  const handleAuthorClick = useCallback((authorId: string) => {
    const numericId = parseInt(authorId);
    const org = organizers.find((o) => o.id === `org${authorId}`) ?? organizers[0];
    navigate({ type: "organizer", organizer: org, authorUserId: numericId });
  }, [navigate]);

  return (
    <div className={`min-h-full w-full relative flex flex-col ${isDark ? "dark" : ""}`} style={{ background: isDark ? "#06060C" : "#f8f8fc" }}>
      <LiquidBackground variant={isDark ? "default" : "aurora"} />
      
      <div className="flex-1 w-full max-w-md mx-auto relative z-10 shadow-2xl overflow-hidden flex flex-col" style={{ background: isDark ? "rgba(6, 6, 12, 0.5)" : "rgba(248, 248, 252, 0.5)" }}>
        <AnimatePresence mode="wait">
          {auth.status === "unauthenticated" ? (
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              <AuthPage onLogin={handleLogin} isDark={isDark} />
            </motion.div>
          ) : (
            <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-hidden flex flex-col">
              {screen.type === "home" && <HomeFeed onExcursionClick={handleExcursionFromPost} onScroll={setTabBarVisible} onAuthorClick={handleAuthorClick} isDark={isDark} />}
              {screen.type === "discovery" && <DiscoveryFeed onExcursionSelect={(exc) => navigate({ type: "excursion", excursion: exc })} isDark={isDark} />}
              {screen.type === "routes" && <RoutesFeed isDark={isDark} onScroll={setTabBarVisible} />}
              {screen.type === "profile" && (
                auth.status === "organizer" ? (
                  <OrganizerDashboard onLogout={handleLogout} isDark={isDark} />
                ) : (
                  <UserProfile onNavigate={(s) => {
                    if (s === "routes") navigate({ type: "myRoutes" });
                    else if (s === "settings") navigate({ type: "settings" });
                    else if (s === "subscriptions") navigate({ type: "subscriptions" });
                    else if (s === "likes") navigate({ type: "likes" });
                    else if (s === "reviews") navigate({ type: "reviews" });
                    else if (s === "bookings") navigate({ type: "bookings" });
                    else if (s === "receipts") navigate({ type: "receipts" });
                    else if (s === "support") navigate({ type: "support" });
                    else if (s === "about") navigate({ type: "about" });
                  }} onLogout={handleLogout} isDark={isDark} />
                )
              )}
              {screen.type === "organizer" && <OrganizerProfile organizer={screen.organizer} authorUserId={screen.authorUserId} onBack={goBack} onExcursionClick={(exc) => navigate({ type: "excursion", excursion: exc })} isDark={isDark} />}
              {screen.type === "excursion" && screen.excursionId && (
                <ExcursionById excursionId={screen.excursionId} onBack={goBack} onBook={(exc) => navigate({ type: "booking", excursion: exc })} isDark={isDark} />
              )}
              {screen.type === "excursion" && !screen.excursionId && (
                <ExcursionDetail excursion={screen.excursion} onBack={goBack} onBook={(exc) => navigate({ type: "booking", excursion: exc })} isDark={isDark} />
              )}
              {screen.type === "booking" && <BookingFlow excursion={screen.excursion} onBack={goBack} onComplete={() => setScreen({ type: "home" })} isDark={isDark} />}
              {screen.type === "myRoutes" && <MyRoutes onBack={goBack} isDark={isDark} />}
              {screen.type === "subscriptions" && <SubscriptionsPage onBack={goBack} isDark={isDark} onOrganizerClick={(placeId) => {
                const numericId = parseInt(placeId);
                const org = organizers.find(o => o.id === `org${placeId}`) ?? organizers[0];
                navigate({ type: "organizer", organizer: org, authorUserId: numericId });
              }} />}
              {screen.type === "likes" && <LikesPage onBack={goBack} isDark={isDark} />}
              {screen.type === "reviews" && <ReviewsPage onBack={goBack} isDark={isDark} />}
              {screen.type === "bookings" && <BookingsPage onBack={goBack} isDark={isDark} />}
              {screen.type === "receipts" && <ReceiptsPage onBack={goBack} isDark={isDark} />}
              {screen.type === "support" && <SupportPage onBack={goBack} isDark={isDark} />}
              {screen.type === "about" && <AboutPage onBack={goBack} isDark={isDark} />}
              {screen.type === "settings" && <SettingsPage onBack={goBack} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />}
            </motion.div>
          )}
        </AnimatePresence>

        {auth.status !== "unauthenticated" && screen.type !== "excursion" && screen.type !== "booking" && screen.type !== "organizer" && (
          <div className="absolute bottom-0 left-0 right-0 z-50">
            <TabBar
              active={screen.type as any}
              onNavigate={handleTabNavigate}
              visible={tabBarVisible}
              isDark={isDark}
            />
          </div>
        )}
      </div>
    </div>
  );
}
