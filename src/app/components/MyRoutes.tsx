import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Navigation,
  ChevronRight,
  ExternalLink,
  Users,
  Search,
  Plus,
} from "lucide-react";
import { glass } from "./LiquidBackground";
import { useMe } from "@/app/hooks/useAuth";
import { useMyRoutes } from "@/app/hooks/useProfile";

interface MyRoutesProps {
  onBack: () => void;
  isDark?: boolean;
}

function formatDuration(seconds: number) {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h} ч ${m} мин` : `${m} мин`;
}

function formatDistance(meters: number) {
  if (!meters) return "—";
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} км` : `${meters} м`;
}

export function MyRoutes({ onBack, isDark = true }: MyRoutesProps) {
  const { data: user } = useMe();
  const { data: routes, isLoading } = useMyRoutes(user?.id);
  const [search, setSearch] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const iconColor = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";

  const glassItem = isDark ? glass.panelLight(0.04, 30) : {
    background: "rgba(255,255,255,0.45)",
    backdropFilter: "blur(30px) saturate(160%)",
    WebkitBackdropFilter: "blur(30px) saturate(160%)",
    border: "1px solid rgba(255,255,255,0.55)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)",
  };

  const filteredRoutes = routes?.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)";

  return (
    <>
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center gap-4 px-4 pt-14 pb-4" style={{
        ...(isDark ? { ...glass.panel(0.05, 50), borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: "1px solid rgba(255,255,255,0.08)" }
        : { background: "rgba(255,255,255,0.65)", backdropFilter: "blur(50px) saturate(180%)", borderBottom: "1px solid rgba(0,0,0,0.06)" }),
      }}>
        <motion.button whileTap={{ scale: 0.8 }} onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={glass.panelLight(isDark ? 0.08 : 0.4, 20)}><ArrowLeft size={18} color={iconColor} /></motion.button>
        <span style={{ fontSize: 18, color: textPrimary }}>Мои маршруты</span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} color={textSecondary} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по маршрутам..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl outline-none transition-all"
            style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: textPrimary }}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-10">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full" />
          </div>
        )}

        {!isLoading && (!filteredRoutes || filteredRoutes.length === 0) && (
          <div className="text-center py-10">
            <p style={{ color: textSecondary }}>Маршруты не найдены</p>
          </div>
        )}

        {filteredRoutes?.map((route, i) => (
          <motion.div key={route.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-2xl relative overflow-hidden" style={glassItem}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 style={{ color: textPrimary, fontSize: 16 }}>{route.title}</h3>
                <p style={{ color: textSecondary, fontSize: 13, marginTop: 2 }}>Создан: {new Date().toLocaleDateString("ru-RU")}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,107,53,0.12)" }}>
                <Navigation size={18} color="#FF8F5E" />
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => setSelectedRoute(route)} className="flex-1 py-2 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.05)", color: textPrimary, border: "1px solid rgba(255,255,255,0.08)" }}>Детали</motion.button>
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => route.external_map_url && window.open(route.external_map_url, "_blank")} className="flex-1 py-2 rounded-xl text-sm text-white" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)", opacity: route.external_map_url ? 1 : 0.5 }}>Открыть карту</motion.button>
            </div>
          </motion.div>
        ))}

        {/* Create new */}
        <motion.button whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-2xl flex items-center justify-center gap-2" style={{ border: "2px dashed rgba(255,255,255,0.1)", color: textSecondary }}>
          <Plus size={18} />
          <span>Создать новый маршрут</span>
        </motion.button>
      </div>
    </div>

    <AnimatePresence>
      {selectedRoute && (
        <>
          <motion.div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedRoute(null)}
          />
          <motion.div className="fixed inset-x-0 bottom-0 z-[61] rounded-t-3xl p-5"
            style={{ background: isDark ? "rgba(12,12,20,0.98)" : "rgba(255,255,255,0.98)" }}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ color: textPrimary, fontSize: 18 }}>{selectedRoute.title}</h3>
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setSelectedRoute(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: cardBg }}>
                <ExternalLink size={14} color={textSecondary} style={{ display: "none" }} />
                <span style={{ color: textSecondary, fontSize: 18, lineHeight: 1 }}>×</span>
              </motion.button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: cardBg, border: cardBorder }}>
                <MapPin size={18} color="#FF8F5E" />
                <div>
                  <p style={{ fontSize: 12, color: textSecondary }}>Начало маршрута</p>
                  <p style={{ fontSize: 15, color: textPrimary }}>{selectedRoute.start_location_text || "Не указано"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-3 p-4 rounded-2xl" style={{ background: cardBg, border: cardBorder }}>
                  <Navigation size={18} color="#FF8F5E" />
                  <div>
                    <p style={{ fontSize: 12, color: textSecondary }}>Расстояние</p>
                    <p style={{ fontSize: 15, color: textPrimary }}>{formatDistance(selectedRoute.distance_meters)}</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-3 p-4 rounded-2xl" style={{ background: cardBg, border: cardBorder }}>
                  <Clock size={18} color="#FF8F5E" />
                  <div>
                    <p style={{ fontSize: 12, color: textSecondary }}>Время</p>
                    <p style={{ fontSize: 15, color: textPrimary }}>{formatDuration(selectedRoute.duration_seconds)}</p>
                  </div>
                </div>
              </div>
              {selectedRoute.route_provider && (
                <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: cardBg, border: cardBorder }}>
                  <Users size={18} color="#FF8F5E" />
                  <div>
                    <p style={{ fontSize: 12, color: textSecondary }}>Провайдер</p>
                    <p style={{ fontSize: 15, color: textPrimary }}>{selectedRoute.route_provider}</p>
                  </div>
                </div>
              )}
            </div>

            {selectedRoute.external_map_url && (
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => window.open(selectedRoute.external_map_url, "_blank")}
                className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2 mt-4"
                style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)" }}
              >
                <ExternalLink size={16} />
                Открыть карту
              </motion.button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
