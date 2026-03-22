import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Heart,
  Users,
  MessageSquare,
  CalendarCheck,
  Receipt,
  HeadphonesIcon,
  Info,
  Star,
  MapPin,
  ChevronRight,
  Clock,
  Send,
  ExternalLink,
  Check,
} from "lucide-react";
import { IMAGES, excursions, organizers } from "./data";
import { glass } from "./LiquidBackground";
import { useMe } from "@/app/hooks/useAuth";
import {
  useProfile,
  useMyBookings,
  useMySubscriptions,
  useMyLikes,
  useMyReviews
} from "@/app/hooks/useProfile";
import { useFeed } from "@/app/hooks/useContent";

interface SubPageProps {
  onBack: () => void;
  isDark?: boolean;
  onExcursionClick?: (excursionId: string) => void;
  onOrganizerClick?: (organizerId: string) => void;
}

/* ─── shared header ─── */
function PageHeader({
  title,
  onBack,
  isDark = true,
}: {
  title: string;
  onBack: () => void;
  isDark?: boolean;
}) {
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const iconColor = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
  return (
    <div
      className="sticky top-0 z-30 flex items-center gap-4 px-4 pt-14 pb-4"
      style={{
        ...(isDark
          ? {
              ...glass.panel(0.05, 50),
              borderRadius: 0,
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }
          : {
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(50px) saturate(180%)",
              WebkitBackdropFilter: "blur(50px) saturate(180%)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }),
      }}
    >
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={onBack}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={glass.panelLight(isDark ? 0.08 : 0.4, 20)}
      >
        <ArrowLeft size={18} color={iconColor} />
      </motion.button>
      <span style={{ fontSize: 18, color: textPrimary }}>{title}</span>
    </div>
  );
}

/* ─── glass card wrapper ─── */
function GlassCard({
  children,
  isDark = true,
  delay = 0,
  highlight = false,
  onClick,
}: {
  children: React.ReactNode;
  isDark?: boolean;
  delay?: number;
  highlight?: boolean;
  onClick?: () => void;
}) {
  const style = isDark
    ? {
        ...glass.panelLight(0.04, 30),
        ...(highlight ? { border: "1px solid rgba(255,107,53,0.15)" } : {}),
      }
    : {
        background: "rgba(255,255,255,0.5)",
        backdropFilter: "blur(30px) saturate(160%)",
        WebkitBackdropFilter: "blur(30px) saturate(160%)",
        border: highlight
          ? "1px solid rgba(255,107,53,0.15)"
          : "1px solid rgba(255,255,255,0.55)",
        boxShadow:
          "0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)",
      };

  return (
    <motion.div
      className="p-4 rounded-2xl relative overflow-hidden cursor-pointer"
      style={style as any}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      onClick={onClick}
    >
      <div
        className="absolute top-0 left-[8%] right-[8%] h-px"
        style={{
          background: isDark
            ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)"
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />
      {children}
    </motion.div>
  );
}

/* ─── Loading State ─── */
function LoadingState() {
  return (
    <div className="flex justify-center py-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   1. ПОДПИСКИ
   ═══════════════════════════════════════════ */
function SubscriptionItem({ sub, isDark, onOrganizerClick }: { sub: any; isDark: boolean; onOrganizerClick?: (id: string) => void }) {
  const { data: profile } = useProfile(sub.place_id);
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const name = profile?.name || `Организатор #${sub.place_id}`;
  const avatar = profile?.avatar_url || IMAGES.avatarGuideM;

  return (
    <GlassCard isDark={isDark} delay={0} onClick={() => onOrganizerClick?.(String(sub.place_id))}>
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate" style={{ fontSize: 15, color: textPrimary }}>{name}</span>
            <Check size={14} color="#3B82F6" />
          </div>
          <p className="truncate" style={{ fontSize: 13, color: textSecondary, marginTop: 2 }}>
            {profile?.bio || "Организатор приключений"}
          </p>
        </div>
        <ChevronRight size={16} color={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"} />
      </div>
    </GlassCard>
  );
}

export function SubscriptionsPage({ onBack, isDark = true, onOrganizerClick }: SubPageProps) {
  const { data: user } = useMe();
  const { data: subs, isLoading } = useMySubscriptions(user?.id);
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="Подписки" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-2">
        {isLoading && <LoadingState />}
        {!isLoading && (!subs || subs.length === 0) && (
          <div className="text-center py-10">
            <p style={{ color: textSecondary }}>Вы пока ни на кого не подписаны</p>
          </div>
        )}
        {subs?.map((sub: any) => (
          <SubscriptionItem key={sub.id} sub={sub} isDark={isDark} onOrganizerClick={onOrganizerClick} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   2. МОИ ЛАЙКИ
   ═══════════════════════════════════════════ */
export function LikesPage({ onBack, isDark = true }: SubPageProps) {
  const { data: user } = useMe();
  const { data: likes, isLoading: likesLoading } = useMyLikes(user?.id);
  const { data: feedPosts, isLoading: feedLoading } = useFeed();
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  const isLoading = likesLoading || feedLoading;
  const likedPostIds = new Set((likes ?? []).map((l: any) => l.post_id));
  const likedPosts = (feedPosts ?? []).filter(p => likedPostIds.has(p.id));

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="Мои лайки" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-3">
        {isLoading && <LoadingState />}
        {!isLoading && likedPosts.length === 0 && (
          <div className="text-center py-10">
            <p style={{ color: textSecondary }}>У вас пока нет лайков</p>
          </div>
        )}
        {likedPosts.map((post, i) => (
          <GlassCard key={post.id} isDark={isDark} delay={i * 0.04}>
            <div className="flex gap-3">
              <img src={post.cover_image_url} alt={post.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontSize: 15, color: textPrimary }}>{post.title}</p>
                <p className="line-clamp-2 mt-1" style={{ fontSize: 13, color: textSecondary }}>{post.content}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Heart size={12} fill="#FF6B35" color="#FF6B35" />
                  <span style={{ fontSize: 12, color: textSecondary }}>{post.likes_count}</span>
                </div>
              </div>
              <Heart size={18} fill="#FF6B35" color="#FF6B35" className="flex-shrink-0 mt-1" />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. МОИ ОТЗЫВЫ
   ═══════════════════════════════════════════ */
export function ReviewsPage({ onBack, isDark = true }: SubPageProps) {
  const { data: user } = useMe();
  const { data: reviews, isLoading } = useMyReviews(user?.id);
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="Мои отзывы" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-3">
        {isLoading && <LoadingState />}
        {!isLoading && (!reviews || reviews.length === 0) && (
          <div className="text-center py-10">
            <p style={{ color: textSecondary }}>Вы пока не оставляли отзывов</p>
          </div>
        )}
        {reviews?.map((rev: any, i: number) => {
          const exc = excursions.find(e => e.id === `exc${rev.excursion_id}`) || excursions[0];
          const date = new Date(rev.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
          return (
            <GlassCard key={rev.id} isDark={isDark} delay={i * 0.04}>
              <div className="flex gap-3 mb-3">
                <img src={exc.image} alt={exc.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: 15, color: textPrimary }}>{exc.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={13}
                        fill={j < rev.rating ? "#FFB800" : "transparent"}
                        color={j < rev.rating ? "#FFB800" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)")}
                      />
                    ))}
                    <span style={{ fontSize: 12, color: textSecondary, marginLeft: 6 }}>{date}</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)" }}>
                {rev.text}
              </p>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   4. МОИ БРОНИ
   ═══════════════════════════════════════════ */
const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Ожидание", color: "#FBBF24", bg: "rgba(251,191,36,0.12)" },
  confirmed: { label: "Подтверждено", color: "#34D399", bg: "rgba(52,211,153,0.12)" },
  completed: { label: "Завершено", color: "#8B8B9E", bg: "rgba(139,139,158,0.1)" },
  cancelled: { label: "Отменено", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
};

export function BookingsPage({ onBack, isDark = true }: SubPageProps) {
  const { data: user } = useMe();
  const { data: bookings, isLoading } = useMyBookings(user?.id);

  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="Мои брони" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-3">
        {isLoading && <LoadingState />}
        {!isLoading && (!bookings || bookings.length === 0) && (
          <div className="text-center py-10">
            <p style={{ color: textSecondary }}>У вас пока нет бронирований</p>
          </div>
        )}
        {bookings?.map((b: any, i: number) => {
          const excData = excursions.find(e => e.id === `exc${b.excursion_id}`) || excursions[0];
          const st = statusMap[b.booking_status] || statusMap.pending;
          const date = new Date(b.selected_date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

          return (
            <GlassCard key={b.id} isDark={isDark} delay={i * 0.04} highlight={b.booking_status === "confirmed"}>
              <div className="flex gap-3">
                <img src={excData.image} alt={excData.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: 15, color: textPrimary }}>{excData.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CalendarCheck size={12} color={textSecondary} />
                    <span style={{ fontSize: 13, color: textSecondary }}>{date}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span style={{ fontSize: 14, color: "#FF8F5E" }}>{excData.price}</span>
                    <span style={{ fontSize: 13, color: textSecondary }}>· {b.guests_count} чел.</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <span className="px-3 py-1 rounded-full" style={{ fontSize: 12, color: st.color, background: st.bg, border: `1px solid ${st.color}22` }}>
                  {st.label}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   5. ИСТОРИЯ ЧЕКОВ (STATIC)
   ═══════════════════════════════════════════ */
export function ReceiptsPage({ onBack, isDark = true }: SubPageProps) {
  return <div className="h-full overflow-y-auto"><PageHeader title="История чеков" onBack={onBack} isDark={isDark} /><div className="px-5 py-10 text-center text-white/40">Скоро появится</div></div>;
}

/* ═══════════════════════════════════════════
   6. ПОДДЕРЖКА
   ═══════════════════════════════════════════ */
export function SupportPage({ onBack, isDark = true }: SubPageProps) {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  
  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="Поддержка" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-4">
        <GlassCard isDark={isDark} highlight>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.15)" }}><HeadphonesIcon size={18} color="#FF8F5E" /></div>
            <div><p style={{ fontSize: 15, color: textPrimary }}>Онлайн-чат</p><p style={{ fontSize: 13, color: "#34D399" }}>Обычно отвечаем за 5 мин</p></div>
          </div>
          <motion.button whileTap={{ scale: 0.96 }} className="w-full py-3 rounded-xl flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)", boxShadow: "0 4px 20px rgba(255,107,53,0.3)" }}><Send size={16} color="#fff" /><span style={{ fontSize: 14, color: "#fff" }}>Начать чат</span></motion.button>
        </GlassCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   7. О ПРИЛОЖЕНИИ
   ═══════════════════════════════════════════ */
export function AboutPage({ onBack, isDark = true }: SubPageProps) {
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="О приложении" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-6 flex flex-col items-center">
        <motion.div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)", boxShadow: "0 12px 40px rgba(255,107,53,0.3)" }} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><span style={{ fontSize: 36 }}>🌅</span></motion.div>
        <motion.span style={{ fontSize: 22, letterSpacing: 4, color: textPrimary }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>ГОРИЗОНТЫ</motion.span>
        <p className="text-center mt-6 max-w-[300px]" style={{ fontSize: 14, lineHeight: 1.7, color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)" }}>© 2026 Горизонты. Все права защищены.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   8. НАСТРОЙКИ
   ═══════════════════════════════════════════ */
export function SettingsPage({ 
  onBack, 
  isDark = true,
  onToggleTheme 
}: SubPageProps & { onToggleTheme?: () => void }) {
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  const settingsItems = [
    { label: "Темная тема", type: "toggle", value: isDark, action: onToggleTheme },
    { label: "Уведомления", type: "toggle", value: true },
    { label: "Язык приложения", type: "value", value: "Русский" },
    { label: "Валюта", type: "value", value: "RUB (₽)" },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="Настройки" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-3">
        {settingsItems.map((item, i) => (
          <GlassCard key={item.label} isDark={isDark} delay={i * 0.03}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 15, color: textPrimary }}>{item.label}</span>
              {item.type === "toggle" ? (
                <button 
                  onClick={item.action}
                  className="w-12 h-6 rounded-full relative transition-colors duration-300"
                  style={{ background: item.value ? "#FF6B35" : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)") }}
                >
                  <motion.div 
                    className="w-5 h-5 rounded-full bg-white absolute top-0.5"
                    animate={{ left: item.value ? 26 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 14, color: textSecondary }}>{item.value}</span>
                  <ChevronRight size={16} color={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"} />
                </div>
              )}
            </div>
          </GlassCard>
        ))}
        
        <div className="pt-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl text-center"
            style={{ border: "1px solid " + (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"), color: "#F87171" }}
          >
            Удалить аккаунт
          </motion.button>
        </div>
      </div>
    </div>
  );
}
