import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TabBar } from "./components/TabBar";
import { HomeFeed } from "./components/HomeFeed";
import { DiscoveryFeed } from "./components/DiscoveryFeed";
import { RoutesFeed } from "./components/RoutesFeed";
import { ExcursionCard } from "./components/ExcursionCard";
import { BookingFlow } from "./components/BookingFlow";
import { OrganizerProfile } from "./components/OrganizerProfile";
import { UserProfile } from "./components/UserProfile";
import { MyRoutes } from "./components/MyRoutes";
import { SettingsPage } from "./components/SettingsPage";
import {
  SubscriptionsPage,
  LikesPage,
  ReviewsPage,
  BookingsPage,
  ReceiptsPage,
  SupportPage,
  AboutPage,
} from "./components/ProfileSubPages";
import { LiquidBackground } from "./components/LiquidBackground";
import { AuthPage } from "./components/AuthPage";
import { OrganizerDashboard } from "./components/OrganizerDashboard";
import { excursions, organizers, posts, Excursion } from "./components/data";

type Screen =
  | { type: "home" }
  | { type: "discovery"; highlightId?: string }
  | { type: "routes" }
  | { type: "profile" }
  | { type: "excursion"; excursion: Excursion }
  | { type: "booking"; excursion: Excursion }
  | { type: "organizer"; organizerId: string }
  | { type: "myRoutes" }
  | { type: "settings" }
  | { type: "subscriptions" }
  | { type: "likes" }
  | { type: "reviews" }
  | { type: "bookings" }
  | { type: "receipts" }
  | { type: "support" }
  | { type: "about" };

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
    if (role === "organizer" && organizerId) {
      setAuth({ status: "organizer", organizerId });
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

  const activeTab =
    screen.type === "home"
      ? "home"
      : screen.type === "discovery"
      ? "discovery"
      : screen.type === "routes"
      ? "routes"
      : screen.type === "profile"
      ? "profile"
      : "home";

  const navigate = useCallback(
    (next: Screen) => {
      setHistory((prev) => [...prev, screen]);
      setScreen(next);
      setTabBarVisible(true);
    },
    [screen]
  );

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const last = newHistory.pop()!;
      setScreen(last);
      return newHistory;
    });
    setTabBarVisible(true);
  }, []);

  const handleTabNavigate = useCallback(
    (tab: "home" | "discovery" | "routes" | "profile") => {
      setHistory([]);
      if (tab === "home") setScreen({ type: "home" });
      else if (tab === "discovery") setScreen({ type: "discovery" });
      else if (tab === "routes") setScreen({ type: "routes" });
      else setScreen({ type: "profile" });
      setTabBarVisible(true);
    },
    []
  );

  const handleExcursionFromPost = useCallback(
    (excursionId: string) => {
      const exc = excursions.find((e) => e.id === excursionId);
      if (exc) navigate({ type: "excursion", excursion: exc });
    },
    [navigate]
  );

  const handleExcursionSelect = useCallback(
    (exc: Excursion) => {
      navigate({ type: "excursion", excursion: exc });
    },
    [navigate]
  );

  const handleBook = useCallback(
    (exc: Excursion) => {
      navigate({ type: "booking", excursion: exc });
    },
    [navigate]
  );

  const handleProfileNavigate = useCallback(
    (section: string) => {
      if (section === "routes") navigate({ type: "myRoutes" });
      else if (section === "settings") navigate({ type: "settings" });
      else if (section === "subscriptions") navigate({ type: "subscriptions" });
      else if (section === "likes") navigate({ type: "likes" });
      else if (section === "reviews") navigate({ type: "reviews" });
      else if (section === "bookings") navigate({ type: "bookings" });
      else if (section === "receipts") navigate({ type: "receipts" });
      else if (section === "support") navigate({ type: "support" });
      else if (section === "about") navigate({ type: "about" });
    },
    [navigate]
  );

  const handleAuthorClick = useCallback(
    (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      if (post) {
        const exc = excursions.find((e) => e.id === post.excursionId);
        if (exc) {
          navigate({ type: "organizer", organizerId: exc.organizerId });
          return;
        }
      }
      navigate({ type: "organizer", organizerId: organizers[0].id });
    },
    [navigate]
  );

  const showTabs =
    auth.status === "user" &&
    (screen.type === "home" ||
      screen.type === "discovery" ||
      screen.type === "routes" ||
      screen.type === "profile");

  const bgVariant =
    screen.type === "settings"
      ? "cool"
      : screen.type === "profile"
      ? "aurora"
      : screen.type === "routes"
      ? "warm"
      : screen.type === "discovery"
      ? "warm"
      : "default";

  // Auth screen
  if (auth.status === "unauthenticated") {
    return (
      <div
        className="relative w-full h-screen overflow-hidden mx-auto"
        style={{ maxWidth: 430, fontFamily: "'Inter', -apple-system, sans-serif" }}
      >
        <LiquidBackground variant="default" />
        {!isDark && (
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{ background: "rgba(248, 248, 252, 0.82)" }}
          />
        )}
        <div className="absolute inset-0 z-[2]">
          <AuthPage onLogin={handleLogin} isDark={isDark} />
        </div>
      </div>
    );
  }

  // Organizer dashboard
  if (auth.status === "organizer") {
    const org = organizers.find((o) => o.id === auth.organizerId) || organizers[0];
    return (
      <div
        className="relative w-full h-screen overflow-hidden mx-auto"
        style={{ maxWidth: 430, fontFamily: "'Inter', -apple-system, sans-serif" }}
      >
        <LiquidBackground variant="aurora" />
        {!isDark && (
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{ background: "rgba(248, 248, 252, 0.82)" }}
          />
        )}
        <div className="absolute inset-0 z-[2]">
          <OrganizerDashboard
            organizer={org}
            onLogout={handleLogout}
            isDark={isDark}
          />
        </div>
      </div>
    );
  }

  // User app
  return (
    <div
      className="relative w-full h-screen overflow-hidden mx-auto"
      style={{
        maxWidth: 430,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <LiquidBackground variant={isDark ? bgVariant : bgVariant} />

      {!isDark && (
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: "rgba(248, 248, 252, 0.82)" }}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={
            screen.type +
            (screen.type === "excursion" ? screen.excursion.id : "")
          }
          className="absolute inset-0 z-[2]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {screen.type === "home" && (
            <HomeFeed
              onExcursionClick={handleExcursionFromPost}
              onScroll={(down) => setTabBarVisible(!down)}
              onAuthorClick={handleAuthorClick}
              isDark={isDark}
            />
          )}
          {screen.type === "discovery" && (
            <DiscoveryFeed
              highlightId={screen.highlightId}
              onExcursionSelect={handleExcursionSelect}
              isDark={isDark}
            />
          )}
          {screen.type === "routes" && (
            <RoutesFeed
              isDark={isDark}
              onScroll={(down) => setTabBarVisible(!down)}
            />
          )}
          {screen.type === "profile" && (
            <UserProfile
              onNavigate={handleProfileNavigate}
              isDark={isDark}
              onLogout={handleLogout}
            />
          )}
          {screen.type === "excursion" && (
            <ExcursionCard
              excursion={screen.excursion}
              onBack={goBack}
              onBook={handleBook}
              onSimilarClick={handleExcursionSelect}
              isDark={isDark}
            />
          )}
          {screen.type === "booking" && (
            <BookingFlow
              excursion={screen.excursion}
              onBack={goBack}
              onComplete={() => handleTabNavigate("profile")}
              isDark={isDark}
            />
          )}
          {screen.type === "organizer" && (
            <OrganizerProfile
              organizer={
                organizers.find((o) => o.id === screen.organizerId) ||
                organizers[0]
              }
              onBack={goBack}
              onExcursionClick={handleExcursionSelect}
              isDark={isDark}
            />
          )}
          {screen.type === "myRoutes" && <MyRoutes onBack={goBack} isDark={isDark} />}
          {screen.type === "subscriptions" && (
            <SubscriptionsPage
              onBack={goBack}
              isDark={isDark}
              onOrganizerClick={(id) =>
                navigate({ type: "organizer", organizerId: id })
              }
            />
          )}
          {screen.type === "likes" && (
            <LikesPage
              onBack={goBack}
              isDark={isDark}
              onExcursionClick={(id) => {
                const exc = excursions.find((e) => e.id === id);
                if (exc) navigate({ type: "excursion", excursion: exc });
              }}
            />
          )}
          {screen.type === "reviews" && (
            <ReviewsPage onBack={goBack} isDark={isDark} />
          )}
          {screen.type === "bookings" && (
            <BookingsPage onBack={goBack} isDark={isDark} />
          )}
          {screen.type === "receipts" && (
            <ReceiptsPage onBack={goBack} isDark={isDark} />
          )}
          {screen.type === "support" && (
            <SupportPage onBack={goBack} isDark={isDark} />
          )}
          {screen.type === "about" && (
            <AboutPage onBack={goBack} isDark={isDark} />
          )}
          {screen.type === "settings" && (
            <SettingsPage
              onBack={goBack}
              isDark={isDark}
              onToggleTheme={() => setIsDark(!isDark)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {showTabs && (
        <div className="relative z-[3]">
          <TabBar
            active={activeTab as "home" | "discovery" | "routes" | "profile"}
            onNavigate={handleTabNavigate}
            visible={tabBarVisible}
            isDark={isDark}
          />
        </div>
      )}
    </div>
  );
}