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

/* ═══════════════════════════════════════════
   1. ПОДПИСКИ
   ═══════════════════════════════════════════ */
const subscriptions = [
  {
    id: "org1",
    name: organizers[0].name,
    avatar: organizers[0].avatar,
    desc: "Премиальные туры · 12.4K подписчиков",
    verified: true,
  },
  {
    id: "org2",
    name: organizers[1].name,
    avatar: organizers[1].avatar,
    desc: "Индивидуальные путешествия · 8.9K",
    verified: true,
  },
  {
    id: "u1",
    name: "Марко Россини",
    avatar: IMAGES.avatarMale,
    desc: "Фотограф · 2.3K подписчиков",
    verified: false,
  },
  {
    id: "u2",
    name: "Лена Морозова",
    avatar: IMAGES.avatarFemale,
    desc: "Travel-блогер · 5.1K подписчиков",
    verified: true,
  },
  {
    id: "u3",
    name: "Тео Мюллер",
    avatar: IMAGES.avatarMale,
    desc: "Гастро-путешественник · 1.8K",
    verified: false,
  },
  {
    id: "u4",
    name: "Аня Кобаяши",
    avatar: IMAGES.avatarFemale,
    desc: "Дайвинг-инструктор · 900",
    verified: false,
  },
  {
    id: "u5",
    name: "Сергей Волков",
    avatar: IMAGES.avatarMale,
    desc: "Горный гид · 3.2K подписчиков",
    verified: true,
  },
  {
    id: "u6",
    name: "Мия Танака",
    avatar: IMAGES.avatarFemale,
    desc: "Городские экскурсии · 4.7K",
    verified: false,
  },
  {
    id: "u7",
    name: "Дмитрий Козлов",
    avatar: IMAGES.avatarMale,
    desc: "Авиа-споттер · 1.1K",
    verified: false,
  },
  {
    id: "u8",
    name: "Изабелла Росси",
    avatar: IMAGES.avatarFemale,
    desc: "Винный сомелье · 6.5K",
    verified: true,
  },
  {
    id: "u9",
    name: "Алекс Грин",
    avatar: IMAGES.avatarMale,
    desc: "Серфинг-тренер · 2.0K",
    verified: false,
  },
  {
    id: "u10",
    name: "Ника Белая",
    avatar: IMAGES.avatarFemale,
    desc: "Йога-ретриты · 3.8K",
    verified: true,
  },
];

export function SubscriptionsPage({ onBack, isDark = true, onOrganizerClick }: SubPageProps) {
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="Подписки" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-2">
        {subscriptions.map((sub, i) => (
          <GlassCard
            key={sub.id}
            isDark={isDark}
            delay={i * 0.03}
            onClick={() => onOrganizerClick?.(sub.id)}
          >
            <div className="flex items-center gap-3">
              <img
                src={sub.avatar}
                alt={sub.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="truncate"
                    style={{ fontSize: 15, color: textPrimary }}
                  >
                    {sub.name}
                  </span>
                  {sub.verified && (
                    <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                      <circle cx="11" cy="11" r="11" fill="#3B82F6" />
                      <path
                        d="M6.5 11.5L9.5 14.5L15.5 8.5"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <p
                  className="truncate"
                  style={{ fontSize: 13, color: textSecondary, marginTop: 2 }}
                >
                  {sub.desc}
                </p>
              </div>
              <ChevronRight
                size={16}
                color={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}
              />
            </div>
          </GlassCard>
        ))}
      </div>
      <div className="h-6" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   2. МОИ ЛАЙКИ
   ═══════════════════════════════════════════ */
const likedExcursions = excursions.slice(0, 5);

export function LikesPage({ onBack, isDark = true, onExcursionClick }: SubPageProps) {
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="Мои лайки" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-3">
        {likedExcursions.map((exc, i) => (
          <GlassCard
            key={exc.id}
            isDark={isDark}
            delay={i * 0.04}
            onClick={() => onExcursionClick?.(exc.id)}
          >
            <div className="flex gap-3">
              <img
                src={exc.image}
                alt={exc.title}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontSize: 15, color: textPrimary }}>
                  {exc.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin size={12} color={textSecondary} />
                  <span
                    className="truncate"
                    style={{ fontSize: 13, color: textSecondary }}
                  >
                    {exc.location}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <Star size={12} color="#FFB800" fill="#FFB800" />
                    <span style={{ fontSize: 13, color: textPrimary }}>
                      {exc.rating}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, color: "#FF8F5E" }}>
                    {exc.price}
                  </span>
                </div>
              </div>
              <Heart
                size={18}
                fill="#FF6B35"
                color="#FF6B35"
                className="flex-shrink-0 mt-1"
              />
            </div>
          </GlassCard>
        ))}
      </div>
      <div className="h-6" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. МОИ ОТЗЫВЫ
   ═══════════════════════════════════════════ */
const reviews = [
  {
    id: "r1",
    excursion: "Закаты Санторини",
    image: IMAGES.santorini,
    rating: 5,
    date: "12 марта 2026",
    text: "Невероятный опыт! Гид был превосходен, виды захватывают дух. Особенно понравилась дегустация вин на закате.",
  },
  {
    id: "r2",
    excursion: "Рисовые террасы Бали",
    image: IMAGES.bali,
    rating: 5,
    date: "28 февраля 2026",
    text: "Медитация на рассвете изменила моё восприятие путешествий. Тегаллаланг — одно из самых умиротворяющих мест на планете.",
  },
  {
    id: "r3",
    excursion: "Неоновый Токио",
    image: IMAGES.tokyo,
    rating: 4,
    date: "15 января 2026",
    text: "Фантастический стритфуд-тур! Немного длинный маршрут, но каждая остановка того стоила. Акихабара — отдельный мир.",
  },
  {
    id: "r4",
    excursion: "Северное сияние",
    image: IMAGES.iceland,
    rating: 5,
    date: "3 января 2026",
    text: "Охота за Aurora Borealis удалась на славу! Горячие источники под северным сиянием — впечатление на всю жизнь.",
  },
  {
    id: "r5",
    excursion: "Воздушные шары Каппадокии",
    image: IMAGES.cappadocia,
    rating: 5,
    date: "20 декабря 2025",
    text: "Полёт на шаре над Каппадокией — мечта, ставшая реальностью. Шампанское на высоте — незабываемо!",
  },
  {
    id: "r6",
    excursion: "Мальдивский рай",
    image: IMAGES.maldives,
    rating: 4,
    date: "10 ноября 2025",
    text: "Снорклинг с мантами — топ! Вода невероятно прозрачная. Единственный минус — хотелось больше времени.",
  },
  {
    id: "r7",
    excursion: "Альпийский трекинг",
    image: IMAGES.alps,
    rating: 5,
    date: "5 октября 2025",
    text: "Маршрут подобран идеально под нашу подготовку. Виды на Маттерхорн компенсируют любую усталость.",
  },
  {
    id: "r8",
    excursion: "Марокканские медины",
    image: IMAGES.morocco,
    rating: 4,
    date: "18 сентября 2025",
    text: "Краски Марракеша завораживают. Гид отлично ориентируется в лабиринтах медины, без него бы точно заблудились.",
  },
];

export function ReviewsPage({ onBack, isDark = true }: SubPageProps) {
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="Мои отзывы" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-3">
        {reviews.map((rev, i) => (
          <GlassCard key={rev.id} isDark={isDark} delay={i * 0.04}>
            <div className="flex gap-3 mb-3">
              <img
                src={rev.image}
                alt={rev.excursion}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontSize: 15, color: textPrimary }}>
                  {rev.excursion}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={13}
                      fill={j < rev.rating ? "#FFB800" : "transparent"}
                      color={j < rev.rating ? "#FFB800" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)")}
                    />
                  ))}
                  <span
                    style={{ fontSize: 12, color: textSecondary, marginLeft: 6 }}
                  >
                    {rev.date}
                  </span>
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)",
              }}
            >
              {rev.text}
            </p>
          </GlassCard>
        ))}
      </div>
      <div className="h-6" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   4. МОИ БРОНИ
   ═══════════════════════════════════════════ */
const bookings = [
  {
    id: "b1",
    excursion: "Закаты Санторини",
    image: IMAGES.santorini,
    date: "23 марта 2026",
    time: "17:00",
    guests: 2,
    price: "€240",
    status: "confirmed" as const,
  },
  {
    id: "b2",
    excursion: "Воздушные шары Каппадокии",
    image: IMAGES.cappadocia,
    date: "5 апреля 2026",
    time: "05:30",
    guests: 2,
    price: "€360",
    status: "confirmed" as const,
  },
  {
    id: "b3",
    excursion: "Рисовые террасы Бали",
    image: IMAGES.bali,
    date: "12 февраля 2026",
    time: "06:00",
    guests: 1,
    price: "$85",
    status: "completed" as const,
  },
  {
    id: "b4",
    excursion: "Неоновый Токио",
    image: IMAGES.tokyo,
    date: "28 января 2026",
    time: "18:00",
    guests: 3,
    price: "¥45000",
    status: "completed" as const,
  },
  {
    id: "b5",
    excursion: "Северное сияние",
    image: IMAGES.iceland,
    date: "10 декабря 2025",
    time: "21:00",
    guests: 2,
    price: "€400",
    status: "cancelled" as const,
  },
];

const statusMap = {
  confirmed: { label: "Подтверждено", color: "#34D399", bg: "rgba(52,211,153,0.12)" },
  completed: { label: "Завершено", color: "#8B8B9E", bg: "rgba(139,139,158,0.1)" },
  cancelled: { label: "Отменено", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
};

export function BookingsPage({ onBack, isDark = true }: SubPageProps) {
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="Мои брони" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-3">
        {bookings.map((b, i) => {
          const st = statusMap[b.status];
          return (
            <GlassCard
              key={b.id}
              isDark={isDark}
              delay={i * 0.04}
              highlight={b.status === "confirmed"}
            >
              <div className="flex gap-3">
                <img
                  src={b.image}
                  alt={b.excursion}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className="truncate"
                      style={{ fontSize: 15, color: textPrimary }}
                    >
                      {b.excursion}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CalendarCheck size={12} color={textSecondary} />
                    <span style={{ fontSize: 13, color: textSecondary }}>
                      {b.date}, {b.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span style={{ fontSize: 14, color: "#FF8F5E" }}>
                      {b.price}
                    </span>
                    <span style={{ fontSize: 13, color: textSecondary }}>
                      · {b.guests} чел.
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    fontSize: 12,
                    color: st.color,
                    background: st.bg,
                    border: `1px solid ${st.color}22`,
                  }}
                >
                  {st.label}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
      <div className="h-6" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   5. ИСТОРИЯ ЧЕКОВ
   ═══════════════════════════════════════════ */
const receipts = [
  { id: "rc1", title: "Закаты Санторини", date: "20 марта 2026", amount: "€240", method: "Visa •••• 4242" },
  { id: "rc2", title: "Воздушные шары Каппадокии", date: "1 апреля 2026", amount: "€360", method: "Visa •••• 4242" },
  { id: "rc3", title: "Рисовые террасы Бали", date: "8 февраля 2026", amount: "$85", method: "Mastercard •••• 8888" },
  { id: "rc4", title: "Неоновый Токио", date: "22 января 2026", amount: "¥45 000", method: "Apple Pay" },
  { id: "rc5", title: "Северное сияние — отмена", date: "9 декабря 2025", amount: "€400", method: "Возврат на карту" },
  { id: "rc6", title: "Мальдивский рай", date: "5 ноября 2025", amount: "$350", method: "Visa •••• 4242" },
  { id: "rc7", title: "Альпийский трекинг", date: "1 октября 2025", amount: "CHF 150", method: "Google Pay" },
  { id: "rc8", title: "Марокканские медины", date: "12 сентября 2025", amount: "MAD 900", method: "Mastercard •••• 8888" },
];

export function ReceiptsPage({ onBack, isDark = true }: SubPageProps) {
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="История чеков" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-2">
        {receipts.map((rc, i) => (
          <GlassCard key={rc.id} isDark={isDark} delay={i * 0.03}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontSize: 15, color: textPrimary }}>
                  {rc.title}
                </p>
                <p style={{ fontSize: 13, color: textSecondary, marginTop: 2 }}>
                  {rc.date}
                </p>
                <p style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
                  {rc.method}
                </p>
              </div>
              <span
                style={{
                  fontSize: 16,
                  color: rc.title.includes("отмена") ? "#EF4444" : "#FF8F5E",
                }}
              >
                {rc.title.includes("отмена") ? `−${rc.amount}` : rc.amount}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
      <div className="h-6" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   6. ПОДДЕРЖКА
   ═══════════════════════════════════════════ */
const faqItems = [
  { q: "Как отменить бронирование?", a: "Перейдите в «Мои брони», выберите бронь и нажмите «Отменить». Возврат средств — до 5 рабочих дней." },
  { q: "Как связаться с организатором?", a: "На странице экскурсии нажмите кнопку чата или позвоните по указанному номеру." },
  { q: "Как оставить отзыв?", a: "После завершения экскурсии вам придёт уведомление с приглашением оставить отзыв." },
  { q: "Безопасно ли оплачивать?", a: "Все платежи проходят через защищённый шлюз с 3D Secure. Мы не храним данные карт." },
  { q: "Можно ли изменить дату?", a: "Да, перенос доступен не позднее чем за 48 часов до начала экскурсии." },
];

export function SupportPage({ onBack, isDark = true }: SubPageProps) {
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="Поддержка" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-4 space-y-4">
        {/* Contact card */}
        <GlassCard isDark={isDark} highlight>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(255,107,53,0.12)",
                border: "1px solid rgba(255,107,53,0.15)",
              }}
            >
              <HeadphonesIcon size={18} color="#FF8F5E" />
            </div>
            <div>
              <p style={{ fontSize: 15, color: textPrimary }}>Онлайн-чат</p>
              <p style={{ fontSize: 13, color: "#34D399" }}>Обычно отвечаем за 5 мин</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #FF6B35, #FF8F5E)",
              boxShadow: "0 4px 20px rgba(255,107,53,0.3)",
            }}
          >
            <Send size={16} color="#fff" />
            <span style={{ fontSize: 14, color: "#fff" }}>Начать чат</span>
          </motion.button>
        </GlassCard>

        <p
          style={{
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: textSecondary,
            paddingLeft: 4,
            marginTop: 8,
          }}
        >
          Частые вопросы
        </p>

        {faqItems.map((faq, i) => (
          <GlassCard
            key={i}
            isDark={isDark}
            delay={i * 0.03}
            onClick={() => setExpandedFaq(expandedFaq === faq.q ? null : faq.q)}
          >
            <div className="flex items-center justify-between">
              <p style={{ fontSize: 14, color: textPrimary, flex: 1 }}>
                {faq.q}
              </p>
              <motion.div
                animate={{ rotate: expandedFaq === faq.q ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight
                  size={16}
                  color={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
                />
              </motion.div>
            </div>
            {expandedFaq === faq.q && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: textSecondary,
                  marginTop: 8,
                }}
              >
                {faq.a}
              </motion.p>
            )}
          </GlassCard>
        ))}

        <GlassCard isDark={isDark}>
          <p style={{ fontSize: 14, color: textSecondary, textAlign: "center" }}>
            support@gorizonty.app · +7 (800) 123-45-67
          </p>
        </GlassCard>
      </div>
      <div className="h-6" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   7. О ПРИЛОЖЕНИИ
   ═══════════════════════════════════════════ */
export function AboutPage({ onBack, isDark = true }: SubPageProps) {
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  const links = [
    { label: "Пользовательское соглашение", icon: ExternalLink },
    { label: "Политика конфиденциальности", icon: ExternalLink },
    { label: "Лицензии открытого ПО", icon: ExternalLink },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <PageHeader title="О приложении" onBack={onBack} isDark={isDark} />
      <div className="px-5 py-6 flex flex-col items-center">
        {/* App icon */}
        <motion.div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FF6B35, #FF8F5E)",
            boxShadow:
              "0 12px 40px rgba(255,107,53,0.3), 0 0 60px rgba(255,107,53,0.1)",
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[50%]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
              borderRadius: "24px 24px 50% 50%",
            }}
          />
          <span style={{ fontSize: 36, position: "relative", zIndex: 1 }}>
            🌅
          </span>
        </motion.div>

        <motion.span
          style={{
            fontSize: 22,
            letterSpacing: 4,
            color: textPrimary,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          ГОРИЗОНТЫ
        </motion.span>
        <p
          style={{
            fontSize: 14,
            color: textSecondary,
            marginTop: 4,
          }}
        >
          Версия 2.4.1 (build 142)
        </p>

        <motion.p
          className="text-center mt-6 mb-8 max-w-[300px]"
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Премиальное приложение для путешественников. Открывайте уникальные
          экскурсии, бронируйте мгновенно и создавайте воспоминания на всю жизнь.
        </motion.p>

        <div className="w-full space-y-2">
          {links.map((link, i) => {
            const Icon = link.icon;
            return (
              <GlassCard key={link.label} isDark={isDark} delay={0.1 + i * 0.04}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 14, color: textPrimary }}>
                    {link.label}
                  </span>
                  <Icon
                    size={16}
                    color={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
                  />
                </div>
              </GlassCard>
            );
          })}
        </div>

        <p
          className="mt-8"
          style={{ fontSize: 13, color: textSecondary }}
        >
          © 2026 Горизонты. Все права защищены.
        </p>
      </div>
      <div className="h-6" />
    </div>
  );
}