import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  MessageCircle,
  Share2,
  Search,
  X,
  ArrowRight,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { posts, IMAGES, mockComments, Comment } from "./data";
import { glass } from "./LiquidBackground";

interface HomeFeedProps {
  onExcursionClick: (excursionId: string) => void;
  onScroll: (scrollingDown: boolean) => void;
  onAuthorClick?: (authorId: string) => void;
  isDark?: boolean;
}

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "М";
  if (n >= 1000) return (n / 1000).toFixed(1) + "К";
  return n.toString();
}

function timeAgo(index: number): string {
  const times = ["2 мин", "18 мин", "1 ч", "3 ч", "5 ч", "8 ч"];
  return times[index % times.length];
}

export function HomeFeed({ onExcursionClick, onScroll, onAuthorClick, isDark = true }: HomeFeedProps) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [doubleTapId, setDoubleTapId] = useState<string | null>(null);
  const lastScrollTop = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [allComments, setAllComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const st = scrollRef.current.scrollTop;
    onScroll(st > lastScrollTop.current && st > 50);
    lastScrollTop.current = st;
  }, [onScroll]);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const handleDoubleTap = (postId: string) => {
    if (!likedPosts.has(postId)) toggleLike(postId);
    setDoubleTapId(postId);
    setTimeout(() => setDoubleTapId(null), 900);
  };

  const filtered = searchQuery
    ? posts.filter(
        (p) =>
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const iconColor = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)";
  const dividerColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto relative"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Liquid Glass Header */}
      <div
        className="sticky top-0 z-30 relative overflow-hidden"
        style={
          isDark
            ? {
                ...glass.panel(0.05, 50),
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderRadius: 0,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }
            : {
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(50px) saturate(180%)",
                WebkitBackdropFilter: "blur(50px) saturate(180%)",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }
        }
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: isDark
              ? "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 50%, transparent 90%)"
              : "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.8) 50%, transparent 90%)",
          }}
        />

        <div className="flex items-center justify-between px-4 pt-12 pb-3">
          <img
            src={IMAGES.avatarFemale}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover"
          />

          <span
            style={{
              fontSize: 20,
              letterSpacing: 3,
              color: textPrimary,
              textShadow: isDark ? "0 0 30px rgba(255,107,53,0.15)" : "none",
            }}
          >
            ГОРИЗОНТЫ
          </span>

          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={glass.panelLight(isDark ? 0.08 : 0.4, 20)}
          >
            {searchOpen ? <X size={18} color={iconColor} /> : <Search size={18} color={iconColor} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="px-4 pb-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-2.5"
                style={glass.panelLight(isDark ? 0.06 : 0.35, 30)}
              >
                <Search size={16} color={textSecondary} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск..."
                  className="flex-1 bg-transparent outline-none placeholder:opacity-40"
                  style={{ fontSize: 14, color: textPrimary }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Posts */}
      <div>
        {filtered.map((post, index) => {
          const isLiked = likedPosts.has(post.id);

          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              style={{ borderBottom: `1px solid ${dividerColor}` }}
            >
              {/* Post header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <motion.div
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onAuthorClick?.(post.id)}
                >
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: 14, color: textPrimary }}>{post.author}</span>
                      <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                        <circle cx="11" cy="11" r="11" fill="#3B82F6" />
                        <path d="M6.5 11.5L9.5 14.5L15.5 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: 13, color: textSecondary }}>· {timeAgo(index)}</span>
                    </div>
                  </div>
                </motion.div>
                <button>
                  <MoreHorizontal size={20} color={textSecondary} />
                </button>
              </div>

              {/* Full-width image */}
              <div className="relative" onDoubleClick={() => handleDoubleTap(post.id)}>
                <img
                  src={post.image}
                  alt={post.description}
                  className="w-full object-cover"
                  style={{ aspectRatio: "4 / 5", maxHeight: 500 }}
                />

                {post.excursionId && (
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onExcursionClick(post.excursionId!)}
                    className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                    style={{
                      ...glass.panel(0.12, 40),
                      boxShadow: `
                        0 8px 32px rgba(0,0,0,0.4),
                        0 0 20px rgba(255,107,53,0.15),
                        inset 0 1px 0 rgba(255,255,255,0.15),
                        inset 0 -0.5px 0 rgba(255,255,255,0.05)
                      `,
                    }}
                  >
                    <ArrowRight size={14} color="#FF8F5E" />
                    <span style={{ fontSize: 13, color: "#fff" }}>К экскурсии</span>
                  </motion.button>
                )}

                {post.isQuiz && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <motion.div
                      className="w-full rounded-3xl p-6 relative overflow-hidden"
                      style={{
                        ...glass.panel(0.1, 50),
                        boxShadow: `
                          0 16px 64px rgba(0,0,0,0.4),
                          inset 0 1px 0 rgba(255,255,255,0.15),
                          inset 0 -1px 0 rgba(255,255,255,0.03)
                        `,
                      }}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    >
                      <div
                        className="absolute top-0 left-[15%] right-[15%] h-px"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                      />
                      <p className="text-white text-center mb-5" style={{ fontSize: 16 }}>
                        {post.quizQuestion}
                      </p>
                      <div className="flex gap-3">
                        {["🏔 Активный", "🏖 Релакс"].map((opt) => (
                          <motion.button
                            key={opt}
                            whileTap={{ scale: 0.93 }}
                            className="flex-1 py-3 rounded-2xl text-white relative overflow-hidden"
                            style={glass.panelLight(0.1, 30)}
                          >
                            {opt}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}

                <AnimatePresence>
                  {doubleTapId === post.id && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    >
                      <Heart
                        size={90}
                        fill="#FF6B35"
                        color="#FF6B35"
                        style={{ filter: "drop-shadow(0 0 30px rgba(255,107,53,0.6))" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action bar */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-4">
                  <motion.button whileTap={{ scale: 0.7 }} onClick={() => toggleLike(post.id)}>
                    <Heart
                      size={24}
                      fill={isLiked ? "#FF6B35" : "none"}
                      color={isLiked ? "#FF6B35" : iconColor}
                      strokeWidth={1.8}
                      style={isLiked ? { filter: "drop-shadow(0 0 8px rgba(255,107,53,0.5))" } : {}}
                    />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.7 }} onClick={() => setCommentsPostId(post.id)}>
                    <MessageCircle size={24} color={iconColor} strokeWidth={1.8} />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.7 }}>
                    <Share2 size={22} color={iconColor} strokeWidth={1.8} />
                  </motion.button>
                </div>

                <p style={{ fontSize: 14, color: textPrimary, marginTop: 10 }}>
                  {formatCount(post.likes + (isLiked ? 1 : 0))} отметок «Нравится»
                </p>

                <p style={{ fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
                  <span style={{ color: textPrimary }}>{post.author} </span>
                  <span style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)" }}>
                    {post.description}
                  </span>
                </p>

                <p
                  style={{ fontSize: 14, marginTop: 6, color: textSecondary, cursor: "pointer" }}
                  onClick={() => setCommentsPostId(post.id)}
                >
                  Посмотреть все комментарии ({post.comments + allComments.filter(c => c.postId === post.id && !mockComments.find(mc => mc.id === c.id)).length})
                </p>
              </div>
            </motion.article>
          );
        })}
        <div className="h-28" />
      </div>

      {/* Comments bottom sheet */}
      <AnimatePresence>
        {commentsPostId && (
          <>
            <motion.div
              className="fixed inset-0 z-[60]"
              style={{ background: "rgba(0,0,0,0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommentsPostId(null)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[61] rounded-t-3xl flex flex-col"
              style={{
                background: isDark ? "rgba(18,18,28,0.98)" : "rgba(255,255,255,0.98)",
                backdropFilter: "blur(30px)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                maxHeight: "75vh",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mt-3" style={{ background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)" }} />
              <div className="px-5 pt-3 pb-2 flex items-center justify-between">
                <h3 style={{ color: textPrimary }}>Комментарии</h3>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setCommentsPostId(null)}>
                  <X size={20} color={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"} />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-2" style={{ scrollbarWidth: "none" }}>
                {allComments
                  .filter((c) => c.postId === commentsPostId)
                  .map((comment) => (
                    <div key={comment.id} className="flex gap-3 py-3" style={{ borderBottom: `1px solid ${dividerColor}` }}>
                      <div
                        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{
                          background: isDark
                            ? "linear-gradient(135deg, rgba(255,107,53,0.2), rgba(139,92,246,0.2))"
                            : "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(139,92,246,0.15))",
                        }}
                      >
                        <span style={{ fontSize: 13, color: textPrimary }}>{comment.author.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 13, color: textPrimary }}>{comment.author}</span>
                          <span style={{ fontSize: 11, color: textSecondary }}>{comment.timeAgo}</span>
                        </div>
                        <p style={{ fontSize: 14, color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)", marginTop: 2, lineHeight: 1.4 }}>
                          {comment.text}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span style={{ fontSize: 12, color: textSecondary }}>♥ {comment.likes}</span>
                          <span style={{ fontSize: 12, color: textSecondary, cursor: "pointer" }}>Ответить</span>
                        </div>
                      </div>
                    </div>
                  ))}
                {allComments.filter((c) => c.postId === commentsPostId).length === 0 && (
                  <div className="py-10 text-center">
                    <MessageCircle size={32} color={textSecondary} className="mx-auto mb-2" style={{ opacity: 0.5 }} />
                    <p style={{ fontSize: 14, color: textSecondary }}>Пока нет комментариев</p>
                    <p style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)" }}>Будьте первым!</p>
                  </div>
                )}
              </div>
              {/* Input */}
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{
                  borderTop: `1px solid ${dividerColor}`,
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)" }}
                >
                  <span style={{ fontSize: 11, color: "#fff" }}>А</span>
                </div>
                <input
                  ref={commentInputRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Добавьте комментарий..."
                  className="flex-1 bg-transparent outline-none"
                  style={{
                    color: textPrimary,
                    fontSize: 14,
                    padding: "8px 12px",
                    borderRadius: 20,
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newComment.trim()) {
                      setAllComments((prev) => [
                        ...prev,
                        {
                          id: `c_new_${Date.now()}`,
                          postId: commentsPostId!,
                          author: "Алиса П.",
                          authorAvatar: "",
                          text: newComment.trim(),
                          timeAgo: "Сейчас",
                          likes: 0,
                        },
                      ]);
                      setNewComment("");
                    }
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => {
                    if (newComment.trim() && commentsPostId) {
                      setAllComments((prev) => [
                        ...prev,
                        {
                          id: `c_new_${Date.now()}`,
                          postId: commentsPostId,
                          author: "Алиса П.",
                          authorAvatar: "",
                          text: newComment.trim(),
                          timeAgo: "Сейчас",
                          likes: 0,
                        },
                      ]);
                      setNewComment("");
                    }
                  }}
                  style={{ opacity: newComment.trim() ? 1 : 0.4 }}
                >
                  <Send size={20} color="#FF6B35" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}