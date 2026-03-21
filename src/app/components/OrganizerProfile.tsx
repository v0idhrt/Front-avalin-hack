import { useState } from "react";
import { motion } from "motion/react";
import { Star, ArrowLeft, ChevronRight } from "lucide-react";
import { Organizer, excursions, posts, reviews, Excursion } from "./data";

interface OrganizerProfileProps {
  organizer: Organizer;
  onBack: () => void;
  onExcursionClick: (exc: Excursion) => void;
  isDark?: boolean;
}

export function OrganizerProfile({ organizer, onBack, onExcursionClick, isDark = true }: OrganizerProfileProps) {
  const [subscribed, setSubscribed] = useState(false);
  const orgExcursions = excursions.filter((e) => e.organizerId === organizer.id);
  const orgPosts = posts.filter((p) => p.author === organizer.name);

  const bg = isDark ? "#0A0A0F" : "#f8f8fc";
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const textFaint = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)";
  const circleBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

  return (
    <div className="h-full overflow-y-auto pb-28 pt-14" style={{ scrollbarWidth: "none", background: bg }}>
      {/* Header */}
      <div className="px-4 mb-6">
        <motion.button onClick={onBack} className="mb-4" whileTap={{ scale: 0.85 }}>
          <ArrowLeft size={24} color={isDark ? "#fff" : "#222"} />
        </motion.button>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={organizer.avatar}
            alt={organizer.name}
            className="w-20 h-20 rounded-full object-cover"
            style={{ border: "3px solid rgba(255,107,53,0.3)" }}
          />
          <div className="flex-1">
            <h2 style={{ color: textPrimary }}>{organizer.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Star size={14} fill="#FFB800" color="#FFB800" />
              <span style={{ fontSize: 14, color: textSecondary }}>{organizer.rating}</span>
              <span style={{ color: textFaint }}>·</span>
              <span style={{ fontSize: 14, color: textMuted }}>{organizer.followers.toLocaleString()} подписчиков</span>
            </div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setSubscribed(!subscribed)}
          className="w-full py-3 rounded-2xl mb-4"
          style={{
            background: subscribed ? circleBg : "linear-gradient(135deg, #FF6B35, #FF8F5E)",
            border: subscribed ? cardBorder : "none",
            color: subscribed ? textSecondary : "#fff",
          }}
        >
          {subscribed ? "Вы подписаны" : "Подписаться"}
        </motion.button>

        <p style={{ fontSize: 14, lineHeight: 1.6, color: textSecondary }}>{organizer.description}</p>
      </div>

      {/* Excursions carousel */}
      <div className="mb-8">
        <div className="flex items-center justify-between px-5 mb-3">
          <h3 style={{ color: textPrimary }}>Наши экскурсии</h3>
          <button className="flex items-center gap-1" style={{ fontSize: 13, color: textMuted }}>
            Все <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 px-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {orgExcursions.map((exc) => (
            <div
              key={exc.id}
              className="flex-shrink-0 w-52 rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => onExcursionClick(exc)}
              style={{ background: cardBg, border: cardBorder }}
            >
              <img src={exc.image} alt={exc.title} className="w-full h-32 object-cover" />
              <div className="p-3">
                <p className="truncate" style={{ fontSize: 14, color: textPrimary }}>{exc.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span style={{ fontSize: 12, color: textMuted }}>{exc.price}</span>
                  <div className="flex items-center gap-1">
                    <Star size={10} fill="#FFB800" color="#FFB800" />
                    <span style={{ fontSize: 12, color: textSecondary }}>{exc.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts carousel */}
      <div className="mb-8">
        <div className="flex items-center justify-between px-5 mb-3">
          <h3 style={{ color: textPrimary }}>Наши посты</h3>
          <button className="flex items-center gap-1" style={{ fontSize: 13, color: textMuted }}>
            Все <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 px-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {orgPosts.map((post) => (
            <div key={post.id} className="flex-shrink-0 w-40 h-40 rounded-2xl overflow-hidden">
              <img src={post.image} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: textPrimary }}>Отзывы</h3>
          <button
            className="px-4 py-2 rounded-full"
            style={{ background: circleBg, fontSize: 13, color: textSecondary }}
          >
            Написать отзыв
          </button>
        </div>
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl" style={{ background: cardBg, border: cardBorder }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 14, color: textPrimary }}>{r.author}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill={i < r.rating ? "#FFB800" : "transparent"} color={i < r.rating ? "#FFB800" : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)")} />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 14, color: textSecondary }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
