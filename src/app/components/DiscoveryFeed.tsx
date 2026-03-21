import { useState } from "react";
import { motion } from "motion/react";
import { Star, SlidersHorizontal, ChevronUp } from "lucide-react";
import { excursions, Excursion } from "./data";

interface DiscoveryFeedProps {
  highlightId?: string | null;
  onExcursionSelect: (exc: Excursion) => void;
  isDark?: boolean;
}

export function DiscoveryFeed({ highlightId, onExcursionSelect, isDark = true }: DiscoveryFeedProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(excursions.map((e) => e.category))];

  const highlighted = highlightId ? excursions.find((e) => e.id === highlightId) : null;
  const others = excursions.filter((e) => e.id !== highlightId);
  const filtered = selectedCategory ? others.filter((e) => e.category === selectedCategory) : others;

  const bg = isDark ? "#0A0A0F" : "#f8f8fc";
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const textFaint = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)";
  const chipBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const chipBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)";
  const chipText = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
  const overlayGrad = isDark
    ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)"
    : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)";

  return (
    <div className="h-full overflow-y-auto pb-28 pt-14" style={{ scrollbarWidth: "none", background: bg }}>
      {/* Filter bar */}
      <div
        className="sticky top-0 z-20 px-4 pb-3 flex items-center gap-3"
        style={{ background: isDark ? "linear-gradient(to bottom, #0A0A0F 80%, transparent)" : "linear-gradient(to bottom, #f8f8fc 80%, transparent)" }}
      >
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full"
          style={{ background: chipBg, border: chipBorder }}
        >
          <SlidersHorizontal size={16} color={chipText} />
          <span style={{ fontSize: 14, color: chipText }}>Фильтр</span>
        </button>
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className="px-4 py-2.5 rounded-full whitespace-nowrap transition-all"
              style={{
                background: selectedCategory === cat ? "linear-gradient(135deg, #FF6B35, #FF8F5E)" : chipBg,
                color: selectedCategory === cat ? "#fff" : chipText,
                fontSize: 14,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Highlighted excursion */}
      {highlighted && (
        <div className="px-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden cursor-pointer"
            onClick={() => onExcursionSelect(highlighted)}
            style={{ background: cardBg, border: cardBorder }}
          >
            <div className="relative h-64">
              <img src={highlighted.image} alt={highlighted.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: overlayGrad }} />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white mb-1">{highlighted.title}</h2>
                <p className="text-white/60" style={{ fontSize: 14 }}>{highlighted.location}</p>
              </div>
              <div
                className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
              >
                <Star size={14} fill="#FFB800" color="#FFB800" />
                <span className="text-white" style={{ fontSize: 13 }}>{highlighted.rating}</span>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span style={{ fontSize: 13, color: textSecondary }}>{highlighted.duration}</span>
                <span style={{ color: textFaint }} className="mx-2">·</span>
                <span style={{ fontSize: 13, color: textSecondary }}>{highlighted.reviewCount} отзывов</span>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: textPrimary }}>{highlighted.price}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExcursionSelect(highlighted);
                  }}
                  className="px-5 py-2.5 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)", fontSize: 14 }}
                >
                  Записаться
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Excursion grid */}
      <div className="px-4">
        <h3 className="mb-4 px-1" style={{ fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: textMuted }}>
          {highlighted ? "Похожие экскурсии" : "Все экскурсии"}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((exc, i) => (
            <motion.div
              key={exc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => onExcursionSelect(exc)}
              style={{ background: cardBg, border: cardBorder }}
            >
              <div className="relative h-36">
                <img src={exc.image} alt={exc.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
                <div
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", fontSize: 11 }}
                >
                  <Star size={10} fill="#FFB800" color="#FFB800" />
                  <span className="text-white">{exc.rating}</span>
                </div>
              </div>
              <div className="p-3">
                <p className="mb-1 truncate" style={{ fontSize: 14, color: textPrimary }}>{exc.title}</p>
                <p className="truncate" style={{ fontSize: 12, color: textMuted }}>{exc.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <span style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}>{exc.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onExcursionSelect(exc);
                    }}
                    className="px-3 py-1.5 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)", fontSize: 11 }}
                  >
                    Записаться
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Back to top */}
      <motion.button
        className="fixed bottom-24 right-4 w-12 h-12 rounded-full flex items-center justify-center z-30"
        style={{
          background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
          backdropFilter: "blur(20px)",
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.06)",
        }}
        whileTap={{ scale: 0.85 }}
      >
        <ChevronUp size={20} color={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)"} />
      </motion.button>
    </div>
  );
}
