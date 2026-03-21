import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Route,
  Star,
  Users,
  Calendar,
  Coffee,
  Camera,
  Wine,
} from "lucide-react";
import { IMAGES } from "./data";

interface MyRoutesProps {
  onBack: () => void;
  isDark?: boolean;
}

const activityIcons: Record<string, typeof Coffee> = {
  coffee: Coffee,
  photo: Camera,
  wine: Wine,
};

interface RouteStop {
  id: string;
  name: string;
  time: string;
  type: "start" | "stop" | "activity" | "end";
  icon?: string;
  duration?: string;
}

interface UserRoute {
  id: string;
  title: string;
  excursionName: string;
  image: string;
  date: string;
  status: "active" | "upcoming" | "completed";
  statusLabel: string;
  from: string;
  to: string;
  totalTime: string;
  totalDistance: string;
  guests: number;
  rating?: number;
  stops: RouteStop[];
  mapLink: string;
}

const userRoutes: UserRoute[] = [
  {
    id: "r1",
    title: "Маршрут в Санторини",
    excursionName: "Закаты Санторини",
    image: IMAGES.santorini,
    date: "23 марта 2026, 17:00",
    status: "active",
    statusLabel: "Активный",
    from: "Отель Mystique, Ия",
    to: "Маяк Акротири",
    totalTime: "4 ч 30 мин",
    totalDistance: "18.5 км",
    guests: 2,
    stops: [
      { id: "s1", name: "Отель Mystique", time: "17:00", type: "start" },
      { id: "s2", name: "Винодельня Santo Wines", time: "17:40", type: "activity", icon: "wine", duration: "45 мин" },
      { id: "s3", name: "Смотровая площадка Ия", time: "18:45", type: "stop", duration: "30 мин" },
      { id: "s4", name: "Фотосессия у мельниц", time: "19:30", type: "activity", icon: "photo", duration: "20 мин" },
      { id: "s5", name: "Маяк Акротири", time: "20:15", type: "end" },
    ],
    mapLink: "https://maps.google.com",
  },
  {
    id: "r2",
    title: "Маршрут по Каппадокии",
    excursionName: "Воздушные шары Каппадокии",
    image: IMAGES.cappadocia,
    date: "28 марта 2026, 05:00",
    status: "upcoming",
    statusLabel: "Через 7 дней",
    from: "Sultan Cave Suites",
    to: "Долина Любви",
    totalTime: "3 ч",
    totalDistance: "12 км",
    guests: 2,
    stops: [
      { id: "s1", name: "Sultan Cave Suites", time: "05:00", type: "start" },
      { id: "s2", name: "Точка взлёта шаров", time: "05:30", type: "stop", duration: "1.5 ч" },
      { id: "s3", name: "Кафе с видом", time: "07:30", type: "activity", icon: "coffee", duration: "30 мин" },
      { id: "s4", name: "Долина Любви", time: "08:00", type: "end" },
    ],
    mapLink: "https://maps.google.com",
  },
  {
    id: "r3",
    title: "Маршрут по Бали",
    excursionName: "Рисовые террасы Бали",
    image: IMAGES.bali,
    date: "10 февраля 2026, 08:00",
    status: "completed",
    statusLabel: "Завершён",
    from: "Ubud Royal Palace",
    to: "Tegallalang Rice Terrace",
    totalTime: "6 ч",
    totalDistance: "24 км",
    guests: 3,
    rating: 5,
    stops: [
      { id: "s1", name: "Ubud Royal Palace", time: "08:00", type: "start" },
      { id: "s2", name: "Tegallalang Rice Terrace", time: "09:00", type: "stop", duration: "2 ч" },
      { id: "s3", name: "Кофейная плантация", time: "11:30", type: "activity", icon: "coffee", duration: "1 ч" },
      { id: "s4", name: "Храм Tirta Empul", time: "13:00", type: "end" },
    ],
    mapLink: "https://maps.google.com",
  },
];

const statusColors = {
  active: {
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    text: "#34D399",
    dot: "#34D399",
  },
  upcoming: {
    bg: "rgba(255,107,53,0.08)",
    border: "rgba(255,107,53,0.2)",
    text: "#FF8F5E",
    dot: "#FF8F5E",
  },
  completed: {
    bgDark: "rgba(255,255,255,0.04)",
    bgLight: "rgba(0,0,0,0.03)",
    borderDark: "rgba(255,255,255,0.08)",
    borderLight: "rgba(0,0,0,0.06)",
    textDark: "rgba(255,255,255,0.35)",
    textLight: "rgba(0,0,0,0.3)",
    dotDark: "rgba(255,255,255,0.25)",
    dotLight: "rgba(0,0,0,0.2)",
  },
};

function getStatusStyle(status: string, isDark: boolean) {
  if (status === "completed") {
    const c = statusColors.completed;
    return {
      bg: isDark ? c.bgDark : c.bgLight,
      border: isDark ? c.borderDark : c.borderLight,
      text: isDark ? c.textDark : c.textLight,
      dot: isDark ? c.dotDark : c.dotLight,
    };
  }
  return statusColors[status as "active" | "upcoming"];
}

export function MyRoutes({ onBack, isDark = true }: MyRoutesProps) {
  const [expandedRoute, setExpandedRoute] = useState<string | null>("r1");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "upcoming" | "completed">("all");

  const bg = isDark ? "#0A0A0F" : "#f8f8fc";
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const textFaint = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const chipBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const chipBorder = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)";
  const chipText = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";
  const divider = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const iconColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  const timelineColor = isDark
    ? "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.03))"
    : "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.03))";

  const filters = [
    { id: "all" as const, label: "Все" },
    { id: "active" as const, label: "Активные" },
    { id: "upcoming" as const, label: "Будущие" },
    { id: "completed" as const, label: "Завершённые" },
  ];

  const filtered = activeFilter === "all" ? userRoutes : userRoutes.filter((r) => r.status === activeFilter);

  return (
    <div className="h-full overflow-y-auto pb-28 pt-12" style={{ scrollbarWidth: "none", background: bg }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-5 mb-5">
        <motion.button onClick={onBack} whileTap={{ scale: 0.85 }}>
          <ArrowLeft size={24} color={isDark ? "#fff" : "#222"} />
        </motion.button>
        <div className="flex-1">
          <h1 style={{ color: textPrimary }}>Мои маршруты</h1>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
        >
          <Route size={18} color={iconColor} />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-5 mb-6 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className="px-4 py-2 rounded-full whitespace-nowrap transition-all"
            style={{
              background: activeFilter === f.id ? "linear-gradient(135deg, #FF6B35, #FF8F5E)" : chipBg,
              color: activeFilter === f.id ? "#fff" : chipText,
              border: activeFilter === f.id ? "none" : chipBorder,
              fontSize: 14,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Routes */}
      <div className="px-5 space-y-4">
        {filtered.map((route, i) => {
          const isExpanded = expandedRoute === route.id;
          const sc = getStatusStyle(route.status, isDark);

          return (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-3xl overflow-hidden"
              style={{ background: cardBg, border: `1px solid ${sc.border}` }}
            >
              {/* Card header with image */}
              <div className="relative h-40">
                <img src={route.image} alt={route.title} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.3) 50%, transparent 100%)" }}
                />
                {/* Status badge */}
                <div
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: sc.bg, border: `1px solid ${sc.border}` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: sc.dot }} />
                  <span style={{ fontSize: 12, color: sc.text }}>{route.statusLabel}</span>
                </div>
                {/* Rating for completed */}
                {route.rating && (
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full"
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
                  >
                    <Star size={12} fill="#FFB800" color="#FFB800" />
                    <span className="text-white" style={{ fontSize: 12 }}>{route.rating}</span>
                  </div>
                )}
                {/* Bottom info on image */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white mb-0.5" style={{ fontSize: 16 }}>{route.title}</p>
                  <p className="text-white/40" style={{ fontSize: 13 }}>{route.excursionName}</p>
                </div>
              </div>

              {/* Info row */}
              <div className="px-4 py-3 flex items-center gap-3 flex-wrap" style={{ borderBottom: `1px solid ${divider}` }}>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} color={textFaint} />
                  <span style={{ fontSize: 13, color: textSecondary }}>{route.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={13} color={textFaint} />
                  <span style={{ fontSize: 13, color: textSecondary }}>{route.guests} чел.</span>
                </div>
              </div>

              {/* Route summary */}
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${divider}` }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#34D399" }} />
                    <span className="truncate" style={{ fontSize: 13, color: textSecondary }}>{route.from}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B35" }} />
                    <span className="truncate" style={{ fontSize: 13, color: textSecondary }}>{route.to}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}>{route.totalDistance}</p>
                  <p style={{ fontSize: 12, color: textFaint }}>{route.totalTime}</p>
                </div>
              </div>

              {/* Expand/Collapse toggle */}
              <button
                onClick={() => setExpandedRoute(isExpanded ? null : route.id)}
                className="w-full flex items-center justify-center gap-2 py-3 transition-colors"
              >
                <span style={{ fontSize: 13, color: textFaint }}>
                  {isExpanded ? "Свернуть маршрут" : "Подробный маршрут"}
                </span>
                {isExpanded ? (
                  <ChevronUp size={16} color={textFaint} />
                ) : (
                  <ChevronDown size={16} color={textFaint} />
                )}
              </button>

              {/* Expanded timeline */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4" style={{ borderTop: `1px solid ${divider}` }}>
                      {/* Timeline */}
                      <div className="pt-4 space-y-0">
                        {route.stops.map((stop, si) => {
                          const isFirst = si === 0;
                          const isLast = si === route.stops.length - 1;
                          const ActivityIcon = stop.icon ? activityIcons[stop.icon] : MapPin;

                          return (
                            <div key={stop.id} className="flex gap-3">
                              {/* Timeline line */}
                              <div className="flex flex-col items-center" style={{ width: 28 }}>
                                <div
                                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{
                                    background: isFirst
                                      ? "rgba(52,211,153,0.15)"
                                      : isLast
                                      ? "rgba(255,107,53,0.15)"
                                      : stop.type === "activity"
                                      ? "rgba(139,92,246,0.15)"
                                      : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                                    border: `1px solid ${
                                      isFirst
                                        ? "rgba(52,211,153,0.3)"
                                        : isLast
                                        ? "rgba(255,107,53,0.3)"
                                        : stop.type === "activity"
                                        ? "rgba(139,92,246,0.3)"
                                        : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
                                    }`,
                                  }}
                                >
                                  {isFirst ? (
                                    <Navigation size={12} color="#34D399" />
                                  ) : isLast ? (
                                    <MapPin size={12} color="#FF6B35" />
                                  ) : (
                                    <ActivityIcon
                                      size={12}
                                      color={stop.type === "activity" ? "#8B5CF6" : textMuted}
                                    />
                                  )}
                                </div>
                                {!isLast && (
                                  <div
                                    className="w-px flex-1 my-1"
                                    style={{ minHeight: 24, background: timelineColor }}
                                  />
                                )}
                              </div>

                              {/* Stop info */}
                              <div className="pb-4 flex-1">
                                <div className="flex items-center justify-between">
                                  <p style={{ fontSize: 14, color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}>{stop.name}</p>
                                  <span className="flex-shrink-0 ml-2" style={{ fontSize: 12, color: textFaint }}>{stop.time}</span>
                                </div>
                                {stop.duration && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Clock size={11} color={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"} />
                                    <span style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)" }}>{stop.duration}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Open in maps button */}
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl mt-2"
                        style={{
                          background: route.status === "active"
                            ? "linear-gradient(135deg, #FF6B35, #FF8F5E)"
                            : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                          boxShadow: route.status === "active" ? "0 6px 24px rgba(255,107,53,0.25)" : "none",
                        }}
                      >
                        <ExternalLink size={16} color={route.status === "active" ? "#fff" : textMuted} />
                        <span
                          style={{
                            fontSize: 14,
                            color: route.status === "active" ? "#fff" : textMuted,
                          }}
                        >
                          {route.status === "active" ? "Открыть маршрут" : "Посмотреть на карте"}
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-10">
          <Route size={48} color={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} />
          <p className="mt-4 text-center" style={{ fontSize: 15, color: textFaint }}>
            Нет маршрутов в этой категории
          </p>
        </div>
      )}
    </div>
  );
}
