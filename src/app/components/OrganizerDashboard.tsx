import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star, LogOut, Edit3, Plus, X, Phone, Mail, Globe, MapPin,
  Clock, ChevronRight, Image as ImageIcon, MessageSquare, Trash2, Save, Camera,
  Sparkles, Check,
} from "lucide-react";
import { IMAGES } from "./data";
import { useMe } from "@/app/hooks/useAuth";
import { useProfile, useMySubscriptions, useMyReviews } from "@/app/hooks/useProfile";
import { useFeed, useExcursions, useCreateExcursion, useUpdateExcursion, useCreatePost } from "@/app/hooks/useContent";
import { generatePostWithAi } from "@/app/api/contentApi";

interface OrganizerDashboardProps {
  onLogout: () => void;
  isDark?: boolean;
}

type Tab = "excursions" | "posts" | "reviews";

const InputField = ({ label, value, onChange, placeholder, multiline, type = "text", isDark, inputBg, inputBorder, textMuted }: any) => (
  <div className="mb-4">
    <label className="block mb-1.5" style={{ fontSize: 12, color: textMuted }}>{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-xl outline-none resize-none"
        style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: isDark ? "#fff" : "#222", fontSize: 14 }}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl outline-none"
        style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: isDark ? "#fff" : "#222", fontSize: 14 }}
      />
    )}
  </div>
);

export function OrganizerDashboard({ onLogout, isDark = true }: OrganizerDashboardProps) {
  const { data: user } = useMe();
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { data: feedPosts } = useFeed();
  const { data: allExcursions } = useExcursions();
  const { data: subs } = useMySubscriptions(user?.id);
  const { data: allReviews } = useMyReviews(user?.id);

  const createExcursionMutation = useCreateExcursion();
  const updateExcursionMutation = useUpdateExcursion();
  const createPostMutation = useCreatePost();

  const [activeTab, setActiveTab] = useState<Tab>("excursions");
  
  // Local state management
  const [localProfile, setLocalProfile] = useState<any>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [backupProfile, setBackupProfile] = useState<any>(null);

  useEffect(() => {
    if (profile && !localProfile) {
      const initial = {
        name: profile.name,
        bio: profile.bio || "Премиальные авторские туры.",
        phone: "+7 (900) 123-45-67",
        email: user?.email,
        avatar: profile.avatar_url || IMAGES.avatarGuideM
      };
      setLocalProfile(initial);
    }
  }, [profile, user]);

  const startEditing = () => {
    setBackupProfile({ ...localProfile });
    setEditingProfile(true);
  };

  const cancelEditing = () => {
    setLocalProfile(backupProfile);
    setEditingProfile(false);
  };

  const saveProfileLocally = () => {
    setEditingProfile(false);
    // Здесь можно было бы добавить toast "Сохранено локально"
  };

  const myExcursions = allExcursions?.filter(e => e.place_id === user?.id) || [];
  const myPosts = feedPosts?.filter(p => p.author_user_id === user?.id) || [];

  // Excursion editor
  const [showExcEditor, setShowExcEditor] = useState(false);
  const [editingExcId, setEditingExcId] = useState<number | null>(null);
  const [excForm, setExcForm] = useState({ title: "", price: "", duration: "", description: "" });

  const openEditExcursion = (exc: any) => {
    setEditingExcId(exc.id);
    setExcForm({
      title: exc.title,
      price: exc.price_amount.toString(),
      duration: exc.duration_minutes.toString(),
      description: exc.short_description || "",
    });
    setShowExcEditor(true);
  };

  const handleSaveExcursion = async () => {
    if (!user || !excForm.title) return;
    const body = {
      place_id: user.id,
      title: excForm.title,
      price_amount: parseFloat(excForm.price) || 0,
      duration_minutes: parseInt(excForm.duration) || 60,
      short_description: excForm.description,
      slug: `exc-${Date.now()}`,
    };

    try {
      if (editingExcId) {
        await updateExcursionMutation.mutateAsync({ id: editingExcId, body });
      } else {
        await createExcursionMutation.mutateAsync(body);
      }
      setShowExcEditor(false);
      setEditingExcId(null);
      setExcForm({ title: "", price: "", duration: "", description: "" });
    } catch (e) { alert("Ошибка при сохранении"); }
  };

  const [showPostEditor, setShowPostEditor] = useState(false);
  const [postForm, setPostForm] = useState({ title: "", content: "" });
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const result = await generatePostWithAi({ prompt: aiPrompt, organizer_name: p.name });
      setPostForm({ title: result.title, content: result.content });
    } catch {
      alert("Не удалось сгенерировать пост");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !postForm.content) return;
    try {
      await createPostMutation.mutateAsync({
        author_user_id: user.id,
        place_id: user.id,
        title: postForm.title || "Новый пост",
        content: postForm.content,
        cover_image_url: IMAGES.sochi,
        type: "info"
      });
      setShowPostEditor(false);
      setPostForm({ title: "", content: "" });
    } catch (e) { alert("Ошибка"); }
  };

  const bg = isDark ? "#0A0A0F" : "#f8f8fc";
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const commonInputProps = { isDark, inputBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", inputBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", textMuted };

  if (isProfileLoading && !localProfile) {
    return <div className="h-full flex items-center justify-center" style={{ background: bg }}><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full" /></div>;
  }

  const p = localProfile || { name: "Организатор", bio: "Загрузка...", email: user?.email, avatar: IMAGES.avatarGuideM, phone: "" };

  return (
    <div className="h-full relative" style={{ background: bg }}>
      <div className="h-full overflow-y-auto pb-6" style={{ scrollbarWidth: "none" }}>
        <div className="px-5 pt-14 pb-4 flex items-center justify-between">
          <h2 style={{ color: textPrimary }}>Личный кабинет</h2>
          <motion.button whileTap={{ scale: 0.85 }} onClick={onLogout} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: cardBg, border: cardBorder }}><LogOut size={18} color={textSecondary} /></motion.button>
        </div>

        <div className="px-5 mb-6">
          <div className="rounded-3xl p-5" style={{ background: cardBg, border: cardBorder }}>
            {editingProfile ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-center mb-4"><div className="relative"><img src={p.avatar} alt="" className="w-20 h-20 rounded-full object-cover" /><div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)" }}><Camera size={14} color="#fff" /></div></div></div>
                <InputField {...commonInputProps} label="Название" value={p.name} onChange={(v: string) => setLocalProfile({ ...p, name: v })} placeholder="Horizon Adventures" />
                <InputField {...commonInputProps} label="Описание" value={p.bio} onChange={(v: string) => setLocalProfile({ ...p, bio: v })} placeholder="О компании" multiline />
                <InputField {...commonInputProps} label="Телефон" value={p.phone} onChange={(v: string) => setLocalProfile({ ...p, phone: v })} placeholder="+7 (900) 123-45-67" />
                <div className="flex gap-3 mt-4">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={cancelEditing} className="flex-1 py-3 rounded-xl" style={{ background: cardBg, border: cardBorder, color: textSecondary, fontSize: 14 }}>Отмена</motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={saveProfileLocally} className="flex-1 py-3 rounded-xl text-white flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)", fontSize: 14 }}><Save size={14} /> Сохранить</motion.button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <img src={p.avatar} alt="" className="w-16 h-16 rounded-full object-cover flex-shrink-0" style={{ border: "2px solid #FF6B35" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1"><h3 className="truncate" style={{ color: textPrimary }}>{p.name}</h3><div className="flex items-center gap-1"><Star size={12} fill="#FFB800" color="#FFB800" /><span style={{ fontSize: 13, color: textPrimary }}>4.9</span></div></div>
                    <p style={{ fontSize: 13, lineHeight: 1.5, color: textSecondary }} className="mb-3">{p.bio}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2"><Phone size={12} color={textMuted} /><span style={{ fontSize: 12, color: textSecondary }}>{p.phone || "+7 (900) 123-45-67"}</span></div>
                      <div className="flex items-center gap-2"><Mail size={12} color={textMuted} /><span style={{ fontSize: 12, color: textSecondary }}>{p.email}</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-4 pt-4" style={{ borderTop: `1px solid ${divider}` }}>
                  <div className="flex-1 text-center"><p style={{ color: textPrimary, fontSize: 18 }}>{myExcursions.length}</p><p style={{ fontSize: 11, color: textMuted }}>Экскурсий</p></div>
                  <div className="flex-1 text-center"><p style={{ color: textPrimary, fontSize: 18 }}>{myPosts.length}</p><p style={{ fontSize: 11, color: textMuted }}>Постов</p></div>
                  <div className="flex-1 text-center"><p style={{ color: textPrimary, fontSize: 18 }}>{subs?.length || 0}</p><p style={{ fontSize: 11, color: textMuted }}>Подписчиков</p></div>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={startEditing} className="w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2" style={{ background: cardBg, border: cardBorder, color: textSecondary, fontSize: 14 }}><Edit3 size={14} /> Редактировать профиль</motion.button>
              </>
            )}
          </div>
        </div>

        <div className="px-5 mb-4">
          <div className="flex gap-2 p-1 rounded-2xl" style={{ background: cardBg, border: cardBorder }}>
            {["excursions", "posts", "reviews"].map((key) => (
              <button key={key} onClick={() => setActiveTab(key as Tab)} className="flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5" style={{ background: activeTab === key ? "linear-gradient(135deg, #FF6B35, #FF8F5E)" : "transparent", color: activeTab === key ? "#fff" : textSecondary, fontSize: 13 }}>
                {key === "excursions" ? "Экскурсии" : key === "posts" ? "Посты" : "Отзывы"}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5">
          <AnimatePresence mode="wait">
            {activeTab === "excursions" && (
              <motion.div key="exc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setEditingExcId(null); setExcForm({ title: "", price: "", duration: "", description: "" }); setShowExcEditor(true); }} className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 mb-4" style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)", color: "#FF6B35", fontSize: 14 }}><Plus size={18} /> Добавить экскурсию</motion.button>
                <div className="space-y-3">
                  {myExcursions.map((exc) => (
                    <div key={exc.id} className="rounded-2xl overflow-hidden cursor-pointer" onClick={() => openEditExcursion(exc)} style={{ background: cardBg, border: cardBorder }}>
                      <div className="flex"><img src={exc.cover_image_url || IMAGES.santorini} alt="" className="w-24 h-24 object-cover flex-shrink-0" /><div className="flex-1 p-3 min-w-0"><p className="truncate" style={{ fontSize: 14, color: textPrimary }}>{exc.title}</p><div className="flex items-center gap-2 mt-1"><span style={{ fontSize: 13, color: "#FF6B35" }}>₽{exc.price_amount}</span><span style={{ fontSize: 11, color: textMuted }}>{exc.duration_minutes} мин</span></div></div><div className="flex items-center pr-4"><Edit3 size={16} color={textMuted} /></div></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === "posts" && (
              <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowPostEditor(true)} className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 mb-4" style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)", color: "#FF6B35", fontSize: 14 }}><Plus size={18} /> Новый пост</motion.button>
                <div className="space-y-3">
                  {myPosts.map((post) => (
                    <div key={post.id} className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder }}>
                      <img src={post.cover_image_url} alt="" className="w-full h-40 object-cover" />
                      <div className="p-4"><p style={{ fontSize: 14, color: textPrimary }}>{post.content}</p></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === "reviews" && (
              <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="space-y-3">
                  {(allReviews || []).map((review: any) => (
                    <div key={review.id} className="p-4 rounded-2xl" style={{ background: cardBg, border: cardBorder }}>
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ fontSize: 14, color: textPrimary }}>Клиент #{review.user_id}</span>
                        <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={12} fill={i < review.rating ? "#FFB800" : "transparent"} color={i < review.rating ? "#FFB800" : textMuted} />))}</div>
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: textSecondary }}>{review.text}</p>
                    </div>
                  ))}
                  {(!allReviews || allReviews.length === 0) && <div className="py-12 text-center"><MessageSquare size={32} color={textMuted} className="mx-auto mb-3" /><p style={{ color: textMuted, fontSize: 14 }}>Пока нет отзывов</p></div>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Excursion Editor Modal */}
      <AnimatePresence>
        {showExcEditor && (
          <>
            <motion.div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.7)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExcEditor(false)} />
            <motion.div className="fixed inset-x-0 bottom-0 z-[61] rounded-t-3xl p-5" style={{ background: isDark ? "rgba(18,18,28,0.98)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(30px)", border: cardBorder }}>
              <div className="flex items-center justify-between mb-4"><h3 style={{ color: textPrimary }}>{editingExcId ? "Редактировать" : "Новая экскурсия"}</h3><button onClick={() => setShowExcEditor(false)}><X size={20} color={textMuted} /></button></div>
              <InputField {...commonInputProps} label="Название" value={excForm.title} onChange={(v: string) => setExcForm({ ...excForm, title: v })} placeholder="Заголовок" />
              <div className="flex gap-3">
                <InputField {...commonInputProps} label="Цена (₽)" value={excForm.price} onChange={(v: string) => setExcForm({ ...excForm, price: v })} placeholder="3000" type="number" />
                <InputField {...commonInputProps} label="Длительность (мин)" value={excForm.duration} onChange={(v: string) => setExcForm({ ...excForm, duration: v })} placeholder="60" type="number" />
              </div>
              <InputField {...commonInputProps} label="Описание" value={excForm.description} onChange={(v: string) => setExcForm({ ...excForm, description: v })} placeholder="О чем экскурсия?" multiline />
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveExcursion} disabled={createExcursionMutation.isPending || updateExcursionMutation.isPending} className="w-full py-4 rounded-2xl text-white mt-2" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)" }}>{(createExcursionMutation.isPending || updateExcursionMutation.isPending) ? "Сохранение..." : "Сохранить"}</motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Post Editor Modal */}
      <AnimatePresence>
        {showPostEditor && (
          <>
            <motion.div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.7)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPostEditor(false)} />
            <motion.div className="fixed inset-x-0 bottom-0 z-[61] rounded-t-3xl p-5" style={{ background: isDark ? "rgba(18,18,28,0.98)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(30px)", border: cardBorder }}>
              <div className="flex items-center justify-between mb-4"><h3 style={{ color: textPrimary }}>Новый пост</h3><button onClick={() => { setShowPostEditor(false); setAiPrompt(""); }}><X size={20} color={textMuted} /></button></div>

              {/* AI блок */}
              <div className="mb-4 p-3 rounded-2xl" style={{ background: "rgba(255,107,53,0.07)", border: "1px solid rgba(255,107,53,0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} color="#FF8F5E" />
                  <span style={{ fontSize: 13, color: "#FF8F5E" }}>Сгенерировать с ИИ</span>
                </div>
                <div className="flex gap-2">
                  <input
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="О чём написать пост?"
                    className="flex-1 px-3 py-2 rounded-xl outline-none"
                    style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`, color: isDark ? "#fff" : "#222", fontSize: 13 }}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerateWithAi()}
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleGenerateWithAi}
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="px-4 py-2 rounded-xl flex items-center gap-1.5"
                    style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)", opacity: (!aiPrompt.trim() || aiLoading) ? 0.5 : 1 }}
                  >
                    {aiLoading
                      ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      : <Sparkles size={14} color="#fff" />
                    }
                    <span style={{ fontSize: 13, color: "#fff" }}>{aiLoading ? "..." : "Создать"}</span>
                  </motion.button>
                </div>
              </div>

              <InputField {...commonInputProps} label="Заголовок" value={postForm.title} onChange={(v: string) => setPostForm({ ...postForm, title: v })} placeholder="Заголовок" />
              <InputField {...commonInputProps} label="Текст поста" value={postForm.content} onChange={(v: string) => setPostForm({ ...postForm, content: v })} placeholder="О чем хотите рассказать?" multiline />
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleCreatePost} disabled={createPostMutation.isPending} className="w-full py-4 rounded-2xl text-white mt-2" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)" }}>{createPostMutation.isPending ? "Публикация..." : "Опубликовать"}</motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
