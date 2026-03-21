import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Star, ArrowLeft, Clock, MapPin, Share2, GitCompareArrows, Plus, ChevronDown, X } from "lucide-react";
import { Excursion, reviews, excursions } from "./data";

interface ExcursionCardProps {
  excursion: Excursion;
  onBack: () => void;
  onBook: (exc: Excursion) => void;
  onSimilarClick: (exc: Excursion) => void;
  isDark?: boolean;
}

export function ExcursionCard({ excursion, onBack, onBook, onSimilarClick, isDark = true }: ExcursionCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const imgY = useTransform(scrollY, [0, 300], [0, 100]);
  const imgScale = useTransform(scrollY, [0, 300], [1, 1.15]);
  const headerOpacity = useTransform(scrollY, [200, 300], [0, 1]);

  const [showCompare, setShowCompare] = useState(false);
  const [compareExcursion, setCompareExcursion] = useState<Excursion | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [compared, setCompared] = useState(false);

  const similar = excursions.filter((e) => e.category === excursion.category && e.id !== excursion.id).slice(0, 4);
  const otherExcursions = excursions.filter((e) => e.id !== excursion.id);

  const bg = isDark ? "#0A0A0F" : "#f8f8fc";
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const textFaint = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)";
  const heroGrad = isDark
    ? "linear-gradient(to top, #0A0A0F 0%, rgba(10,10,15,0.3) 40%, transparent 70%)"
    : "linear-gradient(to top, #f8f8fc 0%, rgba(248,248,252,0.3) 40%, transparent 70%)";
  const bottomGrad = isDark
    ? "linear-gradient(to top, #0A0A0F 60%, transparent)"
    : "linear-gradient(to top, #f8f8fc 60%, transparent)";
  const headerBg = isDark ? "rgba(10,10,15,0.9)" : "rgba(248,248,252,0.9)";
  const btnBg = isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.7)";
  const btnIcon = isDark ? "#fff" : "#222";

  const getComparisonResult = (a: Excursion, b: Excursion) => {
    const results: string[] = [];
    if (a.rating > b.rating) results.push(`«${a.title}» имеет более высокий рейтинг (${a.rating} vs ${b.rating})`);
    else if (b.rating > a.rating) results.push(`«${b.title}» имеет более высокий рейтинг (${b.rating} vs ${a.rating})`);
    else results.push(`Рейтинг одинаковый — ${a.rating}`);

    if (a.reviewCount > b.reviewCount) results.push(`«${a.title}» популярнее: ${a.reviewCount} отзывов против ${b.reviewCount}`);
    else if (b.reviewCount > a.reviewCount) results.push(`«${b.title}» популярнее: ${b.reviewCount} отзывов против ${a.reviewCount}`);

    results.push(`Длительность: «${a.title}» — ${a.duration}, «${b.title}» — ${b.duration}`);

    if (a.category === b.category) results.push(`Обе экскурсии в категории «${a.category}»`);
    else results.push(`Разные категории: «${a.category}» и «${b.category}»`);

    return results;
  };

  return (
    <div className="h-full relative" style={{ background: bg }}>
      {/* Sticky header */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-40 flex items-center px-4 py-3 pt-12"
        style={{
          opacity: headerOpacity,
          background: headerBg,
          backdropFilter: "blur(20px)",
        }}
      >
        <span className="truncate" style={{ color: textPrimary }}>{excursion.title}</span>
      </motion.div>

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="fixed top-12 left-4 z-50 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: btnBg, backdropFilter: "blur(10px)" }}
        whileTap={{ scale: 0.85 }}
      >
        <ArrowLeft size={20} color={btnIcon} />
      </motion.button>

      {/* Share button */}
      <button
        className="fixed top-12 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: btnBg, backdropFilter: "blur(10px)" }}
      >
        <Share2 size={18} color={btnIcon} />
      </button>

      <div ref={scrollRef} className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {/* Hero image with parallax */}
        <div className="relative h-[55vh] overflow-hidden">
          <motion.img
            src={excursion.image}
            alt={excursion.title}
            className="w-full h-full object-cover"
            style={{ y: imgY, scale: imgScale }}
          />
          <div className="absolute inset-0" style={{ background: heroGrad }} />
          {/* Rating badge */}
          <div
            className="absolute top-14 right-14 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
          >
            <Star size={14} fill="#FFB800" color="#FFB800" />
            <span className="text-white" style={{ fontSize: 14 }}>{excursion.rating}</span>
            <span className="text-white/40" style={{ fontSize: 12 }}>({excursion.reviewCount})</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 -mt-16 relative z-10 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 style={{ color: textPrimary }} className="mb-2">{excursion.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1.5" style={{ color: textSecondary }}>
                <MapPin size={14} />
                <span style={{ fontSize: 14 }}>{excursion.location}</span>
              </div>
              <div className="flex items-center gap-1.5" style={{ color: textSecondary }}>
                <Clock size={14} />
                <span style={{ fontSize: 14 }}>{excursion.duration}</span>
              </div>
            </div>

            {/* Price */}
            <div
              className="flex items-center justify-between p-4 rounded-2xl mb-6"
              style={{ background: cardBg, border: cardBorder }}
            >
              <div>
                <p style={{ fontSize: 12, color: textMuted }}>Стоимость</p>
                <p style={{ fontSize: 24, color: textPrimary }}>{excursion.price}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: textMuted }}>Категория</p>
                <p style={{ color: textPrimary }}>{excursion.category}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 style={{ color: textPrimary }} className="mb-3">Описание</h3>
              <p style={{ lineHeight: 1.7, color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)" }}>{excursion.description}</p>
            </div>

            {/* Compare button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setShowCompare(true); setCompareExcursion(null); setCompared(false); }}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl mb-8"
              style={{ background: cardBg, border: cardBorder }}
            >
              <GitCompareArrows size={18} color={textSecondary} />
              <span style={{ fontSize: 14, color: textSecondary }}>Сравнить с другой экскурсией</span>
            </motion.button>

            {/* Reviews */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ color: textPrimary }}>Отзывы</h3>
                <span style={{ fontSize: 13, color: textFaint }}>{excursion.reviewCount} отзывов</span>
              </div>
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 rounded-2xl"
                    style={{ background: cardBg, border: cardBorder }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: 14, color: textPrimary }}>{review.author}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? "#FFB800" : "transparent"} color={i < review.rating ? "#FFB800" : textFaint} />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: textSecondary }}>{review.text}</p>
                    <p className="mt-2" style={{ fontSize: 12, color: textFaint }}>{review.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar */}
            {similar.length > 0 && (
              <div>
                <h3 style={{ color: textPrimary }} className="mb-4">Похожие экскурсии</h3>
                <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                  {similar.map((s) => (
                    <div
                      key={s.id}
                      className="flex-shrink-0 w-44 rounded-2xl overflow-hidden cursor-pointer"
                      onClick={() => onSimilarClick(s)}
                      style={{ background: cardBg, border: cardBorder }}
                    >
                      <img src={s.image} alt={s.title} className="w-full h-28 object-cover" />
                      <div className="p-3">
                        <p className="truncate" style={{ fontSize: 13, color: textPrimary }}>{s.title}</p>
                        <p style={{ fontSize: 12, color: textMuted }}>{s.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Sticky book button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-5 pb-8 pt-4" style={{ background: bottomGrad }}>
        <motion.button
          onClick={() => onBook(excursion)}
          className="w-full py-4 rounded-2xl text-white"
          style={{
            background: "linear-gradient(135deg, #FF6B35, #FF8F5E)",
            boxShadow: "0 8px 30px rgba(255,107,53,0.35)",
          }}
          whileTap={{ scale: 0.97 }}
        >
          Забронировать · {excursion.price}
        </motion.button>
      </div>

      {/* Compare popup */}
      <AnimatePresence>
        {showCompare && (
          <>
            <motion.div
              className="fixed inset-0 z-[60]"
              style={{ background: "rgba(0,0,0,0.7)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompare(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[61] rounded-t-3xl flex flex-col"
              style={{
                background: isDark ? "rgba(18,18,28,0.98)" : "rgba(255,255,255,0.98)",
                backdropFilter: "blur(30px)",
                border: cardBorder,
                maxHeight: "90vh",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-2" style={{ background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)" }} />

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4">
                <div className="flex items-center gap-3">
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowCompare(false)}>
                    <ArrowLeft size={22} color={btnIcon} />
                  </motion.button>
                  <h3 style={{ color: textPrimary }}>Сравнение</h3>
                </div>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowCompare(false)}>
                  <X size={20} color={textMuted} />
                </motion.button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-5 pb-6" style={{ scrollbarWidth: "none" }}>
                {/* Two cards side by side */}
                <div className="flex gap-3 mb-5">
                  {/* Current excursion */}
                  <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder }}>
                    <img src={excursion.image} alt="" className="w-full h-24 object-cover" />
                    <div className="p-3">
                      <p className="truncate" style={{ fontSize: 13, color: textPrimary }}>{excursion.title}</p>
                      <p style={{ fontSize: 11, color: textMuted }}>{excursion.location}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star size={10} fill="#FFB800" color="#FFB800" />
                        <span style={{ fontSize: 12, color: textSecondary }}>{excursion.rating}</span>
                      </div>
                      <p style={{ fontSize: 14, color: "#FF6B35" }} className="mt-1">{excursion.price}</p>
                    </div>
                  </div>

                  {/* Second excursion or + button */}
                  {compareExcursion ? (
                    <div className="flex-1 rounded-2xl overflow-hidden relative" style={{ background: cardBg, border: cardBorder }}>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => { setCompareExcursion(null); setCompared(false); }}
                        className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.5)" }}
                      >
                        <X size={12} color="#fff" />
                      </motion.button>
                      <img src={compareExcursion.image} alt="" className="w-full h-24 object-cover" />
                      <div className="p-3">
                        <p className="truncate" style={{ fontSize: 13, color: textPrimary }}>{compareExcursion.title}</p>
                        <p style={{ fontSize: 11, color: textMuted }}>{compareExcursion.location}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star size={10} fill="#FFB800" color="#FFB800" />
                          <span style={{ fontSize: 12, color: textSecondary }}>{compareExcursion.rating}</span>
                        </div>
                        <p style={{ fontSize: 14, color: "#FF6B35" }} className="mt-1">{compareExcursion.price}</p>
                      </div>
                    </div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPicker(true)}
                      className="flex-1 rounded-2xl flex flex-col items-center justify-center gap-2"
                      style={{ background: cardBg, border: "2px dashed " + (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"), minHeight: 160 }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(255,107,53,0.12)" }}
                      >
                        <Plus size={24} color="#FF6B35" />
                      </div>
                      <span style={{ fontSize: 13, color: textMuted }}>Добавить</span>
                    </motion.button>
                  )}
                </div>

                {/* Comparison results */}
                {compared && compareExcursion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5"
                  >
                    <h4 className="mb-3" style={{ color: textPrimary, fontSize: 15 }}>Результат сравнения</h4>
                    <div className="space-y-2">
                      {getComparisonResult(excursion, compareExcursion).map((line, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl"
                          style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.1)" }}
                        >
                          <p style={{ fontSize: 13, lineHeight: 1.5, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)" }}>{line}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Picker list */}
                {showPicker && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 style={{ color: textPrimary, fontSize: 15 }}>Выберите экскурсию</h4>
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowPicker(false)}>
                        <X size={18} color={textMuted} />
                      </motion.button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                      {otherExcursions.map((exc) => (
                        <motion.button
                          key={exc.id}
                          whileTap={{ scale: 0.97 }}
                          className="w-full flex items-center gap-3 p-3 rounded-2xl text-left"
                          style={{ background: cardBg, border: cardBorder }}
                          onClick={() => { setCompareExcursion(exc); setShowPicker(false); setCompared(false); }}
                        >
                          <img src={exc.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate" style={{ fontSize: 13, color: textPrimary }}>{exc.title}</p>
                            <p style={{ fontSize: 11, color: textMuted }}>{exc.location}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span style={{ fontSize: 12, color: "#FF6B35" }}>{exc.price}</span>
                              <span style={{ fontSize: 11, color: textMuted }}>·</span>
                              <span style={{ fontSize: 11, color: textMuted }}>{exc.duration}</span>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Compare bottom button */}
              {!showPicker && (
                <div className="px-5 pb-8 pt-3">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (compareExcursion) setCompared(true);
                    }}
                    className="w-full py-4 rounded-2xl"
                    style={{
                      background: compareExcursion
                        ? "linear-gradient(135deg, #FF6B35, #FF8F5E)"
                        : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"),
                      color: compareExcursion ? "#fff" : textMuted,
                      boxShadow: compareExcursion ? "0 8px 30px rgba(255,107,53,0.35)" : "none",
                    }}
                  >
                    {compared ? "Сравнение выполнено ✓" : "Сравнить"}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}