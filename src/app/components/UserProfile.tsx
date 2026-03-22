import { motion } from "motion/react";
import {
  Settings,
  Users,
  Map,
  Heart,
  MessageSquare,
  CalendarCheck,
  Receipt,
  HeadphonesIcon,
  Info,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { IMAGES } from "./data";
import { glass } from "./LiquidBackground";
import { useMe } from "@/app/hooks/useAuth";
import { 
  useProfile, 
  useMyBookings, 
  useMyLikes, 
  useMyRoutes, 
  useMySubscriptions, 
  useMyReviews 
} from "@/app/hooks/useProfile";

interface UserProfileProps {
  onNavigate?: (section: string) => void;
  isDark?: boolean;
  onLogout?: () => void;
}

export function UserProfile({ onNavigate, isDark = true, onLogout }: UserProfileProps) {
  const { data: user } = useMe();
  
  // Fetch real data from all services
  const { data: profile } = useProfile(user?.id);
  const { data: bookings } = useMyBookings(user?.id);
  const { data: routes } = useMyRoutes(user?.id);
  const { data: likes } = useMyLikes(user?.id);
  const { data: subs } = useMySubscriptions(user?.id);
  const { data: reviews } = useMyReviews(user?.id);

  const menuItems = [
    { id: "subscriptions", icon: Users, label: "Подписки", count: subs?.length.toString() || "0" },
    { id: "routes", icon: Map, label: "Мои маршруты", count: routes?.length.toString() || "0" },
    { id: "likes", icon: Heart, label: "Мои лайки", count: likes?.length.toString() || "0" },
    { id: "reviews", icon: MessageSquare, label: "Мои отзывы", count: reviews?.length.toString() || "0" },
    { id: "bookings", icon: CalendarCheck, label: "Мои брони", count: bookings?.length.toString() || "0", highlight: true },
    { id: "receipts", icon: Receipt, label: "История чеков", count: "" },
    { id: "support", icon: HeadphonesIcon, label: "Поддержка", count: "" },
    { id: "about", icon: Info, label: "О приложении", count: "" },
  ];

  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const iconColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  const glassItem = isDark
    ? glass.panelLight(0.04, 30)
    : {
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(30px) saturate(160%)",
        WebkitBackdropFilter: "blur(30px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.55)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)",
      };

  return (
    <div className="h-full overflow-y-auto pb-28 pt-12 relative" style={{ scrollbarWidth: "none" }}>
      {/* Settings icon */}
      <div className="flex justify-end px-5 mb-2">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onNavigate?.("settings")}
          className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
          style={glassItem}
        >
          <Settings size={18} color={iconColor} />
        </motion.button>
      </div>

      {/* Avatar & info */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div
            className="w-[100px] h-[100px] rounded-full p-[3px]"
            style={{
              background: "linear-gradient(135deg, #FF6B35, #EC4899, #8B5CF6, #3B82F6)",
              boxShadow: "0 0 40px rgba(255,107,53,0.2), 0 0 80px rgba(139,92,246,0.1)",
            }}
          >
            <img
              src={profile?.avatar_url || IMAGES.avatarFemale}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
              style={{
                border: isDark ? "3px solid #06060C" : "3px solid #f8f8fc",
              }}
            />
          </div>
          <motion.div
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FF6B35, #FF8F5E)",
              boxShadow: "0 0 12px rgba(255,107,53,0.4)",
              border: isDark ? "2px solid #06060C" : "2px solid #f8f8fc",
            }}
            whileTap={{ scale: 0.8 }}
          >
            <span className="text-white" style={{ fontSize: 11 }}>✓</span>
          </motion.div>
        </div>
        <h2 style={{ color: textPrimary }}>
          {profile?.name || user?.fullName || user?.email?.split("@")[0] || "Путешественник"}
        </h2>
        <p style={{ fontSize: 14, color: textSecondary, marginTop: 4 }}>
          {user?.email || "загрузка..."}
        </p>
      </div>

      {/* Active bookings — glass card */}
      <div className="px-5 mb-6">
        <motion.div
          className="p-4 rounded-2xl relative overflow-hidden"
          style={{
            ...(isDark
              ? {
                  ...glass.panel(0.06, 40),
                  border: "1px solid rgba(255,107,53,0.15)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 30px rgba(255,107,53,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
                }
              : {
                  background: "linear-gradient(135deg, rgba(255,107,53,0.08), rgba(255,143,94,0.04))",
                  backdropFilter: "blur(40px)",
                  border: "1px solid rgba(255,107,53,0.12)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
                }),
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Top gloss */}
          <div
            className="absolute top-0 left-[10%] right-[10%] h-px"
            style={{
              background: isDark
                ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)"
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
            }}
          />
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          <div className="flex items-center justify-between mb-3 relative z-10">
            <span style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: textSecondary }}>
              Ближайшая бронь
            </span>
            <span
              className="px-2.5 py-1 rounded-full"
              style={{
                fontSize: 11,
                background: "rgba(255,107,53,0.15)",
                color: "#FF8F5E",
                border: "1px solid rgba(255,107,53,0.15)",
              }}
            >
              {bookings && bookings.length > 0 ? "Активно" : "Нет броней"}
            </span>
          </div>
          <p className="relative z-10" style={{ color: textPrimary, marginBottom: 4 }}>
            {bookings && bookings.length > 0 ? "У вас есть активные поездки" : "Пока ничего не забронировано"}
          </p>
          <p className="relative z-10" style={{ fontSize: 13, color: textSecondary }}>
            {bookings && bookings.length > 0 ? `Всего бронирований: ${bookings.length}` : "Найдите свою первую экскурсию"}
          </p>
        </motion.div>
      </div>

      {/* Menu */}
      <div className="px-5 space-y-2">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate?.(item.id)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl relative overflow-hidden"
              style={{
                ...(item.highlight
                  ? {
                      ...(isDark ? glass.panelLight(0.05, 30) : {
                        background: "rgba(255,255,255,0.45)",
                        backdropFilter: "blur(30px)",
                        border: "1px solid rgba(255,107,53,0.12)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
                      }),
                      border: isDark ? "1px solid rgba(255,107,53,0.12)" : "1px solid rgba(255,107,53,0.12)",
                    }
                  : glassItem),
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: item.highlight
                    ? "rgba(255,107,53,0.12)"
                    : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  border: item.highlight
                    ? "1px solid rgba(255,107,53,0.15)"
                    : isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <Icon
                  size={18}
                  color={item.highlight ? "#FF8F5E" : iconColor}
                />
              </div>
              <span className="flex-1 text-left" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)" }}>
                {item.label}
              </span>
              {item.count !== undefined && (
                <span style={{ fontSize: 13, color: textSecondary, marginRight: 8 }}>{item.count}</span>
              )}
              <ChevronRight size={16} color={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"} />
            </motion.button>
          );
        })}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl relative overflow-hidden"
          style={glassItem}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
              border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <LogOut size={18} color={iconColor} />
          </div>
          <span className="flex-1 text-left" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)" }}>
            Выйти
          </span>
          <ChevronRight size={16} color={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"} />
        </motion.button>
      </div>
    </div>
  );
}
