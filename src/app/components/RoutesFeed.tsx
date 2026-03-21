import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Clock, Car, Bike, Footprints, Star, Heart,
  TrendingUp, ChevronRight, Flame,
} from "lucide-react";
import { glass } from "./LiquidBackground";

type TravelMode = "all" | "car" | "bike" | "walk";

interface Route {
  id: string;
  title: string;
  location: string;
  image: string;
  duration: string;
  distance: string;
  price: string;
  mode: "car" | "bike" | "walk";
  rating: number;
  difficulty: "Лёгкий" | "Средний" | "Сложный";
  points: number;
  popular: boolean;
  description: string;
}

const routes: Route[] = [
  {
    id: "r1", title: "Горное кольцо Лаго-Наки",
    location: "Адыгея — Апшеронск", image: "https://images.unsplash.com/photo-1771838026237-e6d3838e75ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMHRyYWlsJTIwc2NlbmljfGVufDF8fHx8MTc3NDEwNDcyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "2 дня", distance: "180 км", price: "₽4 500", mode: "car",
    rating: 4.9, difficulty: "Средний", points: 7, popular: true,
    description: "Панорамные серпантины через плато Лаго-Наки с остановками у водопадов и пещер.",
  },
  {
    id: "r2", title: "Побережье Анапа — Геленджик",
    location: "Чёрное море", image: "https://images.unsplash.com/photo-1760147406776-440ea15e0b52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwY3ljbGluZyUyMHBhdGglMjBzZWF8ZW58MXx8fHwxNzc0MTA0NzIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "1 день", distance: "85 км", price: "₽1 200", mode: "bike",
    rating: 4.7, difficulty: "Средний", points: 5, popular: true,
    description: "Велосипедный маршрут вдоль береговой линии с живописными бухтами.",
  },
  {
    id: "r3", title: "Тропа к водопадам Пшады",
    location: "Геленджик", image: "https://images.unsplash.com/photo-1760638135404-308b3a556cc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZhbGwlMjBmb3Jlc3QlMjBoaWtlJTIwZ3JlZW58ZW58MXx8fHwxNzc0MTA0NzIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "5 часов", distance: "12 км", price: "Бесплатно", mode: "walk",
    rating: 4.8, difficulty: "Лёгкий", points: 4, popular: true,
    description: "Пешая тропа через реликтовый лес к каскаду из 13 водопадов.",
  },
  {
    id: "r4", title: "Винная дорога Тамани",
    location: "Тамань — Абрау-Дюрсо", image: "https://images.unsplash.com/photo-1761489179746-3753150fd1e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW5leWFyZCUyMGNvdW50cnlzaWRlJTIwcm9hZCUyMGNhcnxlbnwxfHx8fDE3NzQxMDQ3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "1.5 дня", distance: "220 км", price: "₽6 800", mode: "car",
    rating: 4.6, difficulty: "Лёгкий", points: 6, popular: false,
    description: "Автопутешествие по винодельням Кубани с дегустациями и закатами над лиманами.",
  },
  {
    id: "r5", title: "Каньон реки Белой",
    location: "Хаджохская теснина", image: "https://images.unsplash.com/photo-1763488295842-1e0d9d1e6668?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW55b24lMjByaXZlciUyMGFkdmVudHVyZSUyMHRyYWlsfGVufDF8fHx8MTc3NDEwNDcyMnww&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "6 часов", distance: "14 км", price: "₽500", mode: "walk",
    rating: 4.9, difficulty: "Средний", points: 5, popular: true,
    description: "Маршрут вдоль бирюзовой реки через узкий каньон с отвесными скалами.",
  },
  {
    id: "r6", title: "Олимпийский парк — Роза Хутор",
    location: "Сочи", image: "https://images.unsplash.com/photo-1760405371844-c9ca6d2fc5e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2VuaWMlMjByb2FkJTIwZHJpdmUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzc0MTA0NzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "1 день", distance: "75 км", price: "₽3 200", mode: "car",
    rating: 4.5, difficulty: "Лёгкий", points: 4, popular: false,
    description: "Маршрут от побережья до горного курорта по живописной трассе.",
  },
  {
    id: "r7", title: "Лесная тропа Мезмая",
    location: "Апшеронский район", image: "https://images.unsplash.com/photo-1694100381966-5cf52917d452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB3YWxraW5nJTIwcGF0aCUyMG5hdHVyZXxlbnwxfHx8fDE3NzQxMDQ3MjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "4 часа", distance: "9 км", price: "Бесплатно", mode: "walk",
    rating: 4.7, difficulty: "Лёгкий", points: 3, popular: false,
    description: "Спокойная прогулка по буковому лесу к смотровым площадкам Мезмайского плато.",
  },
  {
    id: "r8", title: "Велокольцо Новороссийска",
    location: "Новороссийск — Абрау", image: "https://images.unsplash.com/photo-1758967439612-80c7483f7168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwcGF0aCUyMGNvYXN0YWwlMjB0b3dufGVufDF8fHx8MTc3NDEwNDcyMnww&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "7 часов", distance: "55 км", price: "₽800", mode: "bike",
    rating: 4.4, difficulty: "Сложный", points: 4, popular: false,
    description: "Кольцевой велосипедный маршрут с подъёмами через можжевеловые рощи к озеру Абрау.",
  },
];

const modeIcon = (mode: "car" | "bike" | "walk", size = 14, color = "#FF6B35") => {
  if (mode === "car") return <Car size={size} color={color} />;
  if (mode === "bike") return <Bike size={size} color={color} />;
  return <Footprints size={size} color={color} />;
};

const modeLabel = (mode: "car" | "bike" | "walk") => {
  if (mode === "car") return "На машине";
  if (mode === "bike") return "На велосипеде";
  return "Пешком";
};

const diffColor = (d: string) => {
  if (d === "Лёгкий") return "#34D399";
  if (d === "Средний") return "#FBBF24";
  return "#F87171";
};

interface RoutesFeedProps {
  isDark?: boolean;
  onScroll?: (down: boolean) => void;
}

export function RoutesFeed({ isDark = true, onScroll }: RoutesFeedProps) {
  const [filter, setFilter] = useState<TravelMode>("all");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  let lastY = 0;

  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)";

  const filters: { key: TravelMode; label: string; icon?: React.ReactNode }[] = [
    { key: "all", label: "Все" },
    { key: "car", label: "На машине", icon: <Car size={13} /> },
    { key: "bike", label: "Велосипед", icon: <Bike size={13} /> },
    { key: "walk", label: "Пешком", icon: <Footprints size={13} /> },
  ];

  const filtered = filter === "all" ? routes : routes.filter((r) => r.mode === filter);

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
      onScroll={(e) => {
        const el = e.currentTarget;
        onScroll?.(el.scrollTop > lastY && el.scrollTop > 40);
        lastY = el.scrollTop;
      }}
    >
      {/* Header */}
      <div className="px-5 pt-14 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={20} color="#FF6B35" />
          <h1 style={{ color: textPrimary, fontSize: 22 }}>Маршруты</h1>
        </div>
        <p style={{ color: textSecondary, fontSize: 13 }}>
          Популярные маршруты Краснодарского края
        </p>
      </div>

      {/* Filters */}
      <div className="px-5 py-3">
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <motion.button
                key={f.key}
                whileTap={{ scale: 0.93 }}
                onClick={() => setFilter(f.key)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl whitespace-nowrap flex-shrink-0"
                style={{
                  background: active
                    ? "linear-gradient(135deg, #FF6B35, #FF8F5E)"
                    : cardBg,
                  border: active ? "none" : cardBorder,
                  color: active ? "#fff" : textSecondary,
                  fontSize: 13,
                }}
              >
                {f.icon && (
                  <span style={{ color: active ? "#fff" : textMuted }}>
                    {f.icon}
                  </span>
                )}
                {f.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Routes list */}
      <div className="px-5 pb-32 space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((route, idx) => (
            <motion.div
              key={route.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="rounded-3xl overflow-hidden relative"
              style={{ background: cardBg, border: cardBorder }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={route.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                  }}
                />

                {/* Popular badge */}
                {route.popular && (
                  <div
                    className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(255,107,53,0.85)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Flame size={11} color="#fff" />
                    <span style={{ fontSize: 11, color: "#fff" }}>
                      Популярный
                    </span>
                  </div>
                )}

                {/* Like */}
                <motion.button
                  whileTap={{ scale: 0.75 }}
                  onClick={() => toggleLike(route.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    ...glass.panel(0.15, 16),
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <Heart
                    size={16}
                    color={liked.has(route.id) ? "#FF3B5C" : "#fff"}
                    fill={liked.has(route.id) ? "#FF3B5C" : "none"}
                  />
                </motion.button>

                {/* Mode badge on image */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                  style={{ ...glass.panel(0.2, 12), border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  {modeIcon(route.mode, 14, "#fff")}
                  <span style={{ fontSize: 12, color: "#fff" }}>
                    {modeLabel(route.mode)}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1.5 rounded-xl"
                  style={{ ...glass.panel(0.2, 12), border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <Star size={12} fill="#FFB800" color="#FFB800" />
                  <span style={{ fontSize: 12, color: "#fff" }}>{route.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 style={{ color: textPrimary, fontSize: 16 }} className="mb-1">
                  {route.title}
                </h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <MapPin size={12} color={textMuted} />
                  <span style={{ fontSize: 12, color: textSecondary }}>
                    {route.location}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                    style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}
                  >
                    <Clock size={12} color={textMuted} />
                    <span style={{ fontSize: 12, color: textSecondary }}>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                    style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}
                  >
                    <TrendingUp size={12} color={textMuted} />
                    <span style={{ fontSize: 12, color: textSecondary }}>{route.distance}</span>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-xl"
                    style={{ background: `${diffColor(route.difficulty)}15` }}
                  >
                    <span style={{ fontSize: 12, color: diffColor(route.difficulty) }}>
                      {route.difficulty}
                    </span>
                  </div>
                </div>

                {/* Price + expand */}
                <div className="flex items-center justify-between">
                  <span style={{
                    fontSize: 18,
                    color: route.price === "Бесплатно" ? "#34D399" : "#FF6B35",
                  }}>
                    {route.price}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setExpandedId(expandedId === route.id ? null : route.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl"
                    style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                  >
                    <span style={{ fontSize: 12, color: textSecondary }}>Подробнее</span>
                    <motion.div
                      animate={{ rotate: expandedId === route.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={14} color={textMuted} />
                    </motion.div>
                  </motion.button>
                </div>

                {/* Expanded description */}
                <AnimatePresence>
                  {expandedId === route.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                        <p style={{ fontSize: 13, lineHeight: 1.6, color: textSecondary }}>
                          {route.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <MapPin size={11} color={textMuted} />
                          <span style={{ fontSize: 12, color: textMuted }}>
                            {route.points} точек на маршруте
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Footprints size={36} color={textMuted} className="mx-auto mb-3" />
            <p style={{ color: textMuted, fontSize: 14 }}>Нет маршрутов в этой категории</p>
          </div>
        )}
      </div>
    </div>
  );
}
