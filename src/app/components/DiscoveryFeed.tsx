import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Star, Filter, SlidersHorizontal, ChevronRight } from "lucide-react";
import { glass } from "./LiquidBackground";
import { useExcursions } from "@/app/hooks/useContent";

interface DiscoveryFeedProps {
  onExcursionSelect: (excursion: any) => void;
  highlightId?: string;
  isDark?: boolean;
}

const CATEGORIES = ["Все", "Природа", "Город", "Гастро", "Активный", "Романтика"];

export function DiscoveryFeed({ onExcursionSelect, isDark = true }: DiscoveryFeedProps) {
  const { data: excursionsData, isLoading } = useExcursions();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");

  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";

  const filtered = useMemo(() => {
    if (!excursionsData) return [];
    return excursionsData.filter(exc => {
      const matchSearch = exc.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === "Все" || exc.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [excursionsData, searchQuery, activeCategory]);

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="sticky top-0 z-30 pt-14 pb-4 px-4 space-y-4" style={{
        background: isDark ? "rgba(6, 6, 12, 0.8)" : "rgba(248, 248, 252, 0.8)",
        backdropFilter: "blur(20px)"
      }}>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl" style={glass.panelLight(isDark ? 0.06 : 0.4, 20)}>
            <Search size={18} color={textSecondary} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Куда отправимся?"
              className="flex-1 bg-transparent outline-none"
              style={{ color: textPrimary, fontSize: 15 }}
            />
          </div>
          <motion.button whileTap={{ scale: 0.9 }} className="w-11 h-11 rounded-2xl flex items-center justify-center" style={glass.panelLight(isDark ? 0.08 : 0.4, 20)}>
            <SlidersHorizontal size={20} color={textPrimary} />
          </motion.button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-xl whitespace-nowrap text-sm transition-all"
              style={{
                background: activeCategory === cat ? "linear-gradient(135deg, #FF6B35, #FF8F5E)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                color: activeCategory === cat ? "#fff" : textSecondary,
                border: activeCategory === cat ? "none" : `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 space-y-4">
        {isLoading && (
          <div className="flex justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full" />
          </div>
        )}

        {filtered.map((exc, i) => (
          <motion.div
            key={exc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onExcursionSelect(exc)}
            className="group relative rounded-3xl overflow-hidden shadow-2xl"
            style={{ height: 240 }}
          >
            <img src={exc.cover_image_url} alt={exc.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-orange-500 text-[10px] font-bold text-white uppercase tracking-wider">{exc.category}</span>
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="#FFB800" color="#FFB800" />
                      <span className="text-white text-xs font-medium">{exc.rating_avg}</span>
                    </div>
                  </div>
                  <h3 className="text-white text-lg font-semibold leading-tight">{exc.title}</h3>
                  <div className="flex items-center gap-1 mt-1 opacity-70">
                    <MapPin size={12} color="#fff" />
                    <span className="text-white text-xs">Краснодарский край</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-orange-400 text-lg font-bold">₽{exc.price_amount}</p>
                  <p className="text-white/50 text-[10px]">за человека</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="h-28" />
    </div>
  );
}
