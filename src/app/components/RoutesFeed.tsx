import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Clock, Car, Bike, Footprints, Star, Heart,
  TrendingUp, ChevronRight, Flame,
} from "lucide-react";
import { glass } from "./LiquidBackground";
import { IMAGES } from "./data";
import { useMe } from "@/app/hooks/useAuth";
import { useAllRoutes } from "@/app/hooks/useContent";

const ROUTE_IMAGES = [IMAGES.caucasus, IMAGES.waterfall, IMAGES.mountainLake, IMAGES.sochi, IMAGES.blackSeaCliff, IMAGES.kayak, IMAGES.paragliding, IMAGES.teaPlantation];

type TravelMode = "all" | "car" | "bike" | "walk";

const modeIcon = (mode: string, size = 14, color = "#FF6B35") => {
  if (mode === "car") return <Car size={size} color={color} />;
  if (mode === "bike") return <Bike size={size} color={color} />;
  return <Footprints size={size} color={color} />;
};

const modeLabel = (mode: string) => {
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
  const { data: user } = useMe();
  const { data: routesData, isLoading } = useAllRoutes(user?.id || 0);
  
  const [filter, setFilter] = useState<TravelMode>("all");
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  let lastY = 0;

  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)";

  const filters: { key: TravelMode; label: string; icon?: React.ReactNode }[] = [
    { key: "all", label: "Все" },
    { key: "car", label: "На машине", icon: <Car size={13} /> },
    { key: "bike", label: "Велосипед", icon: <Bike size={13} /> },
    { key: "walk", label: "Пешком", icon: <Footprints size={13} /> },
  ];

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters} м`;
    return `${(meters / 1000).toFixed(1)} км`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    if (hours < 1) return `${Math.floor(seconds / 60)} мин`;
    if (hours < 24) return `${hours} ч`;
    return `${Math.floor(hours / 24)} дн`;
  };

  const toggleLike = (id: number) => {
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
                  background: active ? "linear-gradient(135deg, #FF6B35, #FF8F5E)" : cardBg,
                  border: active ? "none" : cardBorder,
                  color: active ? "#fff" : textSecondary,
                  fontSize: 13,
                }}
              >
                {f.icon && <span style={{ color: active ? "#fff" : textMuted }}>{f.icon}</span>}
                {f.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Routes list */}
      <div className="px-5 pb-32 space-y-4">
        {isLoading && (
          <div className="flex justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full" />
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {routesData?.map((route, idx) => (
            <motion.div
              key={route.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="rounded-3xl overflow-hidden relative"
              style={{ background: cardBg, border: cardBorder }}
            >
              {/* Image (Using fallback since API doesn't provide images yet) */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={ROUTE_IMAGES[route.id % ROUTE_IMAGES.length]}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />

                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "rgba(255,107,53,0.85)", backdropFilter: "blur(8px)" }}>
                  <Flame size={11} color="#fff" />
                  <span style={{ fontSize: 11, color: "#fff" }}>Популярный</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.75 }}
                  onClick={() => toggleLike(route.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ ...glass.panel(0.15, 16), border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <Heart size={16} color={liked.has(route.id) ? "#FF3B5C" : "#fff"} fill={liked.has(route.id) ? "#FF3B5C" : "none"} />
                </motion.button>

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ ...glass.panel(0.2, 12), border: "1px solid rgba(255,255,255,0.15)" }}>
                  {modeIcon("car", 14, "#fff")}
                  <span style={{ fontSize: 12, color: "#fff" }}>На машине</span>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1.5 rounded-xl" style={{ ...glass.panel(0.2, 12), border: "1px solid rgba(255,255,255,0.15)" }}>
                  <Star size={12} fill="#FFB800" color="#FFB800" />
                  <span style={{ fontSize: 12, color: "#fff" }}>4.8</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 style={{ color: textPrimary, fontSize: 16 }} className="mb-1">{route.title}</h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <MapPin size={12} color={textMuted} />
                  <span style={{ fontSize: 12, color: textSecondary }}>{route.start_location_text}</span>
                </div>

                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                    <Clock size={12} color={textMuted} />
                    <span style={{ fontSize: 12, color: textSecondary }}>{formatDuration(route.duration_seconds)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                    <TrendingUp size={12} color={textMuted} />
                    <span style={{ fontSize: 12, color: textSecondary }}>{formatDistance(route.distance_meters)}</span>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-xl" style={{ background: `${diffColor("Средний")}15` }}>
                    <span style={{ fontSize: 12, color: diffColor("Средний") }}>Средний</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 18, color: "#FF6B35" }}>₽4 500</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setExpandedId(expandedId === route.id ? null : route.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl"
                    style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                  >
                    <span style={{ fontSize: 12, color: textSecondary }}>Подробнее</span>
                    <motion.div animate={{ rotate: expandedId === route.id ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight size={14} color={textMuted} />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {(!routesData || routesData.length === 0) && !isLoading && (
          <div className="py-16 text-center">
            <Footprints size={36} color={textMuted} className="mx-auto mb-3" />
            <p style={{ color: textMuted, fontSize: 14 }}>Маршруты пока не созданы</p>
          </div>
        )}
      </div>
    </div>
  );
}
