import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  MessageCircle,
  X,
  ArrowRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { excursions, organizers, IMAGES, mockComments, Comment } from "./data";
import { glass } from "./LiquidBackground";
import { useFeed } from "@/app/hooks/useContent";
import { useMe } from "@/app/hooks/useAuth";
import { useLike, useUnlike } from "@/app/hooks/useInteractions";
import { useProfile, useMyLikes } from "@/app/hooks/useProfile";

interface HomeFeedProps {
  onExcursionClick: (excursionId: string) => void;
  onScroll: (scrollingDown: boolean) => void;
  onAuthorClick?: (authorId: string) => void;
  isDark?: boolean;
}

/* Компонент для отображения реального автора поста */
function PostAuthor({ userId, textPrimary, onAuthorClick }: { userId: number, textPrimary: string, onAuthorClick?: (id: string) => void }) {
  const { data: profile, isLoading } = useProfile(userId);
  
  const name = profile?.name || `Организатор #${userId}`;
  const avatar = profile?.avatar_url || IMAGES.avatarGuideM;

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => onAuthorClick?.(userId.toString())}>
      <div className="w-9 h-9 rounded-full overflow-hidden bg-white/5 border border-white/10">
        {!isLoading && <img src={avatar} alt={name} className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate" style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>{name}</span>
          <svg width="14" height="14" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill="#3B82F6" /><path d="M6.5 11.5L9.5 14.5L15.5 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "М";
  if (n >= 1000) return (n / 1000).toFixed(1) + "К";
  return n.toString();
}

export function HomeFeed({ onExcursionClick, onScroll, onAuthorClick, isDark = true }: HomeFeedProps) {
  const { data: user } = useMe();
  const { data: feedPosts, isLoading } = useFeed();
  const { data: myLikes } = useMyLikes(user?.id);
  const likeMutation = useLike();
  const unlikeMutation = useUnlike();

  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (myLikes) {
      setLikedPosts(new Set(myLikes.map((l: any) => l.post_id)));
    }
  }, [myLikes]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [doubleTapId, setDoubleTapId] = useState<number | null>(null);
  const lastScrollTop = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const st = scrollRef.current.scrollTop;
    onScroll(st > lastScrollTop.current && st > 50);
    lastScrollTop.current = st;
  }, [onScroll]);

  const toggleLike = async (postId: number) => {
    if (!user) return;
    const isLiked = likedPosts.has(postId);
    
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (isLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });

    try {
      if (isLiked) {
        await unlikeMutation.mutateAsync({ post_id: postId, user_id: user.id });
      } else {
        await likeMutation.mutateAsync({ post_id: postId, user_id: user.id });
      }
    } catch (e) {
      setLikedPosts((prev) => {
        const next = new Set(prev);
        if (isLiked) next.add(postId);
        else next.delete(postId);
        return next;
      });
    }
  };

  const handleDoubleTap = (postId: number) => {
    if (!likedPosts.has(postId)) toggleLike(postId);
    setDoubleTapId(postId);
    setTimeout(() => setDoubleTapId(null), 900);
  };

  const filtered = feedPosts?.filter(
    (p) =>
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const iconColor = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)";
  const dividerColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="h-full overflow-y-auto relative" style={{ scrollbarWidth: "none" }}>
      <div className="sticky top-0 z-30 relative overflow-hidden" style={isDark ? { ...glass.panel(0.05, 50), borderTop: "none", borderLeft: "none", borderRight: "none", borderRadius: 0, borderBottom: "1px solid rgba(255,255,255,0.08)" } : { background: "rgba(255,255,255,0.65)", backdropFilter: "blur(50px) saturate(180%)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex items-center justify-between px-4 pt-12 pb-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-white/10"><img src={IMAGES.avatarFemale} alt="avatar" className="w-full h-full object-cover" /></div>
          <span style={{ fontSize: 20, letterSpacing: 3, color: textPrimary }}>ГОРИЗОНТЫ</span>
          <motion.button whileTap={{ scale: 0.8 }} onClick={() => setSearchOpen(!searchOpen)} className="w-9 h-9 rounded-full flex items-center justify-center" style={glass.panelLight(isDark ? 0.08 : 0.4, 20)}>
            {searchOpen ? <X size={18} color={iconColor} /> : <Search size={18} color={iconColor} />}
          </motion.button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full" />
        </div>
      )}

      <div>
        {filtered.map((post, index) => {
          const isLiked = likedPosts.has(post.id);

          return (
            <motion.article key={post.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} style={{ borderBottom: `1px solid ${dividerColor}` }}>
              {/* Header with REAL author data */}
              <div className="flex items-center gap-3 px-4 py-3">
                <PostAuthor userId={post.author_user_id} textPrimary={textPrimary} onAuthorClick={onAuthorClick} />
                <button><MoreHorizontal size={20} color={textSecondary} /></button>
              </div>

              <div className="relative" onDoubleClick={() => handleDoubleTap(post.id)}>
                <img src={post.cover_image_url} alt={post.title} className="w-full object-cover" style={{ aspectRatio: "4 / 5", maxHeight: 500 }} />
                {post.excursion_id && (
                  <motion.button whileTap={{ scale: 0.92 }} onClick={() => onExcursionClick(`exc${post.excursion_id}`)} className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ ...glass.panel(0.12, 40) }}>
                    <ArrowRight size={14} color="#FF8F5E" />
                    <span style={{ fontSize: 13, color: "#fff" }}>К экскурсии</span>
                  </motion.button>
                )}
                <AnimatePresence>
                  {doubleTapId === post.id && (
                    <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.8, opacity: 0 }}>
                      <Heart size={90} fill="#FF6B35" color="#FF6B35" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="px-4 py-3">
                <div className="flex items-center gap-4">
                  <motion.button whileTap={{ scale: 0.7 }} onClick={() => toggleLike(post.id)}>
                    <Heart size={24} fill={isLiked ? "#FF6B35" : "none"} color={isLiked ? "#FF6B35" : iconColor} />
                  </motion.button>
                  <MessageCircle size={24} color={iconColor} />
                </div>
                <p style={{ fontSize: 14, color: textPrimary, marginTop: 10 }}>{formatCount(post.likes_count + (isLiked ? 1 : 0))} отметок «Нравится»</p>
                <div style={{ fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
                   <p style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)" }}>{post.content}</p>
                </div>
              </div>
            </motion.article>
          );
        })}
        <div className="h-28" />
      </div>
    </div>
  );
}
