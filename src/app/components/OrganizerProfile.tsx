import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ArrowLeft, ChevronRight, X, Heart, MessageCircle } from "lucide-react";
import { Organizer, excursions as mockExcursions, posts as mockPosts, reviews as mockReviews, Excursion, IMAGES } from "./data";
import { useProfile, useMySubscriptions } from "@/app/hooks/useProfile";
import { useSubscribe, useUnsubscribe } from "@/app/hooks/useInteractions";
import { useMe } from "@/app/hooks/useAuth";
import { useExcursions, useFeed } from "@/app/hooks/useContent";

interface OrganizerProfileProps {
  organizer: Organizer;
  authorUserId?: number;
  onBack: () => void;
  onExcursionClick: (exc: Excursion) => void;
  isDark?: boolean;
}

export function OrganizerProfile({ organizer, authorUserId, onBack, onExcursionClick, isDark = true }: OrganizerProfileProps) {
  const { data: currentUser } = useMe();
  const { data: realProfile } = useProfile(authorUserId);
  const { data: subscriptions } = useMySubscriptions(currentUser?.id);
  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  const subscribed = subscriptions?.some((s: any) => s.place_id === authorUserId) ?? false;
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const postsScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.pageX;
    scrollStartX.current = postsScrollRef.current?.scrollLeft || 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !postsScrollRef.current) return;
    postsScrollRef.current.scrollLeft = scrollStartX.current - (e.pageX - dragStartX.current);
  };
  const onMouseUp = () => { isDragging.current = false; };

  const handleSubscribeToggle = () => {
    if (!currentUser || !authorUserId) return;
    if (subscribed) {
      unsubscribeMutation.mutate({ place_id: authorUserId, user_id: currentUser.id });
    } else {
      subscribeMutation.mutate({ place_id: authorUserId, user_id: currentUser.id });
    }
  };

  const { data: allExcursions } = useExcursions();
  const { data: feedPosts } = useFeed();

  const displayName = realProfile?.name || organizer.name;
  const displayAvatar = realProfile?.avatar_url || organizer.avatar;

  // Реальные данные из API, фоллбэк на мок
  const orgExcursions = authorUserId && allExcursions
    ? allExcursions.filter(e => e.place_id === authorUserId)
    : mockExcursions.filter((e) => e.organizerId === organizer.id);

  const orgPosts = authorUserId && feedPosts
    ? feedPosts.filter(p => p.author_user_id === authorUserId)
    : mockPosts.filter((p) => p.author === organizer.name);

  const bg = isDark ? "#0A0A0F" : "#f8f8fc";
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const textFaint = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)";
  const circleBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

  return (
    <>
    <div className="h-full overflow-y-auto pb-28 pt-14" style={{ scrollbarWidth: "none", background: bg }}>
      {/* Header */}
      <div className="px-4 mb-6">
        <motion.button onClick={onBack} className="mb-4" whileTap={{ scale: 0.85 }}>
          <ArrowLeft size={24} color={isDark ? "#fff" : "#222"} />
        </motion.button>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-20 h-20 rounded-full object-cover"
            style={{ border: "3px solid rgba(255,107,53,0.3)" }}
          />
          <div className="flex-1">
            <h2 style={{ color: textPrimary }}>{displayName}</h2>
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
          onClick={handleSubscribeToggle}
          disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
          className="w-full py-3 rounded-2xl mb-4"
          style={{
            background: subscribed ? circleBg : "linear-gradient(135deg, #FF6B35, #FF8F5E)",
            border: subscribed ? cardBorder : "none",
            color: subscribed ? textSecondary : "#fff",
            opacity: (subscribeMutation.isPending || unsubscribeMutation.isPending) ? 0.6 : 1,
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
          {orgExcursions.map((exc: any) => (
            <div
              key={exc.id}
              className="flex-shrink-0 w-52 rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => onExcursionClick(exc)}
              style={{ background: cardBg, border: cardBorder }}
            >
              <img src={exc.cover_image_url || exc.image || IMAGES.sochi} alt={exc.title} className="w-full h-32 object-cover" />
              <div className="p-3">
                <p className="truncate" style={{ fontSize: 14, color: textPrimary }}>{exc.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span style={{ fontSize: 12, color: textMuted }}>{exc.price_amount != null ? `₽${exc.price_amount}` : exc.price}</span>
                  <div className="flex items-center gap-1">
                    <Star size={10} fill="#FFB800" color="#FFB800" />
                    <span style={{ fontSize: 12, color: textSecondary }}>{exc.rating_avg ?? exc.rating}</span>
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
          <button className="flex items-center gap-1" onClick={() => setShowAllPosts(true)} style={{ fontSize: 13, color: textMuted }}>
            Все <ChevronRight size={14} />
          </button>
        </div>
        <div
          ref={postsScrollRef}
          className="flex gap-3 px-5 overflow-x-auto select-none"
          style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", cursor: isDragging.current ? "grabbing" : "grab" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {orgPosts.map((post: any) => (
            <motion.div
              key={post.id}
              className="flex-shrink-0 w-40 h-40 rounded-2xl overflow-hidden cursor-pointer relative"
              style={{ scrollSnapAlign: "start" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !isDragging.current && setSelectedPost(post)}
            >
              <img src={post.cover_image_url || post.image || IMAGES.sochi} alt="" className="w-full h-full object-cover" />
            </motion.div>
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
          {mockReviews.map((r) => (
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
    {/* Post modal */}
    <AnimatePresence>
      {selectedPost && (
        <>
          <motion.div
            className="fixed inset-0 z-[70]"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[71] rounded-t-3xl overflow-hidden"
            style={{ background: isDark ? "rgba(12,12,20,0.98)" : "rgba(255,255,255,0.98)", maxHeight: "85vh" }}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="relative">
              <img src={selectedPost.cover_image_url || selectedPost.image || IMAGES.sochi} alt="" className="w-full object-cover" style={{ maxHeight: 320 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                <X size={18} color="#fff" />
              </motion.button>
            </div>
            <div className="p-5 overflow-y-auto" style={{ maxHeight: "calc(85vh - 320px)", scrollbarWidth: "none" }}>
              {selectedPost.title && (
                <h3 className="mb-2" style={{ fontSize: 18, color: textPrimary }}>{selectedPost.title}</h3>
              )}
              <p style={{ fontSize: 15, lineHeight: 1.6, color: textSecondary }}>{selectedPost.content}</p>
              <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: `1px solid ${cardBorder}` }}>
                <div className="flex items-center gap-1.5">
                  <Heart size={16} color="#FF6B35" fill="#FF6B35" />
                  <span style={{ fontSize: 13, color: textMuted }}>{selectedPost.likes_count || 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={16} color={textMuted} />
                  <span style={{ fontSize: 13, color: textMuted }}>{selectedPost.comments_count || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* All posts modal */}
    <AnimatePresence>
      {showAllPosts && (
        <>
          <motion.div className="fixed inset-0 z-[70]" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowAllPosts(false)}
          />
          <motion.div className="fixed inset-x-0 bottom-0 z-[71] rounded-t-3xl flex flex-col" style={{ background: isDark ? "rgba(12,12,20,0.98)" : "rgba(255,255,255,0.98)", height: "85vh" }}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
              <h3 style={{ color: textPrimary }}>Все посты</h3>
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowAllPosts(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: cardBg }}>
                <X size={16} color={textMuted} />
              </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 gap-2 content-start" style={{ scrollbarWidth: "none" }}>
              {orgPosts.map((post: any) => (
                <motion.div key={post.id} className="aspect-square rounded-xl overflow-hidden cursor-pointer" whileTap={{ scale: 0.95 }}
                  onClick={() => { setShowAllPosts(false); setSelectedPost(post); }}
                >
                  <img src={post.cover_image_url || post.image || IMAGES.sochi} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
