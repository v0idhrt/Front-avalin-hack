import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star, LogOut, Edit3, Plus, X, Phone, Mail, Globe, MapPin,
  Clock, ChevronRight, Image, MessageSquare, Trash2, Save, Camera,
  Sparkles,
} from "lucide-react";
import { excursions, posts, organizers, Post, Excursion, Organizer, IMAGES, mockComments, Comment, reviews } from "./data";

interface OrganizerDashboardProps {
  organizer: Organizer;
  onLogout: () => void;
  isDark?: boolean;
}

type Tab = "excursions" | "posts" | "reviews";

export function OrganizerDashboard({ organizer, onLogout, isDark = true }: OrganizerDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("excursions");
  const [myExcursions, setMyExcursions] = useState<Excursion[]>(
    excursions.filter((e) => e.organizerId === organizer.id)
  );
  const [myPosts, setMyPosts] = useState<Post[]>(
    posts.filter((p) => p.author === organizer.name)
  );

  // Edit states
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(organizer.name);
  const [profileDesc, setProfileDesc] = useState(organizer.description);
  const [profilePhone, setProfilePhone] = useState(organizer.phone || "");
  const [profileEmail, setProfileEmail] = useState(organizer.email || "");
  const [profileWebsite, setProfileWebsite] = useState(organizer.website || "");

  // Excursion editor
  const [showExcEditor, setShowExcEditor] = useState(false);
  const [editingExc, setEditingExc] = useState<Excursion | null>(null);
  const [excForm, setExcForm] = useState({
    title: "", location: "", price: "", duration: "", description: "", category: "",
  });

  // Post editor
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postForm, setPostForm] = useState({ description: "" });
  const [generating, setGenerating] = useState(false);
  const [expandedPostComments, setExpandedPostComments] = useState<string | null>(null);
  const [genPrompt, setGenPrompt] = useState("");

  const bg = isDark ? "#0A0A0F" : "#f8f8fc";
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)";
  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const openExcEditor = (exc?: Excursion) => {
    if (exc) {
      setEditingExc(exc);
      setExcForm({
        title: exc.title, location: exc.location, price: exc.price,
        duration: exc.duration, description: exc.description, category: exc.category,
      });
    } else {
      setEditingExc(null);
      setExcForm({ title: "", location: "", price: "", duration: "", description: "", category: "" });
    }
    setShowExcEditor(true);
  };

  const saveExcursion = () => {
    if (!excForm.title.trim()) return;
    if (editingExc) {
      setMyExcursions((prev) =>
        prev.map((e) => e.id === editingExc.id ? { ...e, ...excForm } : e)
      );
    } else {
      const newExc: Excursion = {
        id: `exc_new_${Date.now()}`,
        ...excForm,
        image: organizer.avatar,
        rating: 0,
        reviewCount: 0,
        organizerId: organizer.id,
      };
      setMyExcursions((prev) => [newExc, ...prev]);
    }
    setShowExcEditor(false);
  };

  const deleteExcursion = (id: string) => {
    setMyExcursions((prev) => prev.filter((e) => e.id !== id));
  };

  const openPostEditor = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setPostForm({ description: post.description });
    } else {
      setEditingPost(null);
      setPostForm({ description: "" });
    }
    setGenPrompt("");
    setShowPostEditor(true);
  };

  const savePost = () => {
    if (!postForm.description.trim()) return;
    if (editingPost) {
      setMyPosts((prev) =>
        prev.map((p) => p.id === editingPost.id ? { ...p, ...postForm } : p)
      );
    } else {
      const newPost: Post = {
        id: `post_new_${Date.now()}`,
        image: organizer.avatar,
        author: organizer.name,
        authorAvatar: organizer.avatar,
        description: postForm.description,
        likes: 0,
        comments: 0,
      };
      setMyPosts((prev) => [newPost, ...prev]);
    }
    setShowPostEditor(false);
  };

  const deletePost = (id: string) => {
    setMyPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "excursions", label: "Экскурсии", count: myExcursions.length },
    { key: "posts", label: "Посты", count: myPosts.length },
    { key: "reviews", label: "Отзывы", count: reviews.length },
  ];

  const InputField = ({ label, value, onChange, placeholder, multiline }: {
    label: string; value: string; onChange: (v: string) => void; placeholder: string; multiline?: boolean;
  }) => (
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl outline-none"
          style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: isDark ? "#fff" : "#222", fontSize: 14 }}
        />
      )}
    </div>
  );

  return (
    <div className="h-full relative" style={{ background: bg }}>
      <div className="h-full overflow-y-auto pb-6" style={{ scrollbarWidth: "none" }}>
        {/* Header */}
        <div className="px-5 pt-14 pb-4 flex items-center justify-between">
          <h2 style={{ color: textPrimary }}>Личный кабинет</h2>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onLogout}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: cardBg, border: cardBorder }}
          >
            <LogOut size={18} color={textSecondary} />
          </motion.button>
        </div>

        {/* Profile card */}
        <div className="px-5 mb-6">
          <div className="rounded-3xl p-5" style={{ background: cardBg, border: cardBorder }}>
            {editingProfile ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={organizer.avatar}
                      alt=""
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)" }}
                    >
                      <Camera size={14} color="#fff" />
                    </div>
                  </div>
                </div>
                <InputField label="Название" value={profileName} onChange={setProfileName} placeholder="Название бъекта" />
                <InputField label="Описание" value={profileDesc} onChange={setProfileDesc} placeholder="Описание" multiline />
                <InputField label="Телефон" value={profilePhone} onChange={setProfilePhone} placeholder="+7 (___) ___-__-__" />
                <InputField label="Email" value={profileEmail} onChange={setProfileEmail} placeholder="email@example.com" />
                <InputField label="Сайт" value={profileWebsite} onChange={setProfileWebsite} placeholder="example.com" />
                <div className="flex gap-3 mt-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingProfile(false)}
                    className="flex-1 py-3 rounded-xl"
                    style={{ background: cardBg, border: cardBorder, color: textSecondary, fontSize: 14 }}
                  >
                    Отмена
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingProfile(false)}
                    className="flex-1 py-3 rounded-xl text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)", fontSize: 14 }}
                  >
                    <Save size={14} /> Сохранить
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <img
                    src={organizer.avatar}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="truncate" style={{ color: textPrimary }}>{profileName}</h3>
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="#FFB800" color="#FFB800" />
                        <span style={{ fontSize: 13, color: textPrimary }}>{organizer.rating}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.5, color: textSecondary }} className="mb-3">
                      {profileDesc}
                    </p>
                    {/* Contact info */}
                    <div className="space-y-1.5">
                      {profilePhone && (
                        <div className="flex items-center gap-2">
                          <Phone size={12} color={textMuted} />
                          <span style={{ fontSize: 12, color: textSecondary }}>{profilePhone}</span>
                        </div>
                      )}
                      {profileEmail && (
                        <div className="flex items-center gap-2">
                          <Mail size={12} color={textMuted} />
                          <span style={{ fontSize: 12, color: textSecondary }}>{profileEmail}</span>
                        </div>
                      )}
                      {profileWebsite && (
                        <div className="flex items-center gap-2">
                          <Globe size={12} color={textMuted} />
                          <span style={{ fontSize: 12, color: textSecondary }}>{profileWebsite}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Stats */}
                <div className="flex gap-4 mt-4 pt-4" style={{ borderTop: `1px solid ${divider}` }}>
                  <div className="flex-1 text-center">
                    <p style={{ color: textPrimary, fontSize: 18 }}>{myExcursions.length}</p>
                    <p style={{ fontSize: 11, color: textMuted }}>Экскурсий</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p style={{ color: textPrimary, fontSize: 18 }}>{myPosts.length}</p>
                    <p style={{ fontSize: 11, color: textMuted }}>Постов</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p style={{ color: textPrimary, fontSize: 18 }}>{organizer.followers.toLocaleString()}</p>
                    <p style={{ fontSize: 11, color: textMuted }}>Подписчиков</p>
                  </div>
                </div>
                {/* Edit button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEditingProfile(true)}
                  className="w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{ background: cardBg, border: cardBorder, color: textSecondary, fontSize: 14 }}
                >
                  <Edit3 size={14} /> Редактировать профиль
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 mb-4">
          <div className="flex gap-2 p-1 rounded-2xl" style={{ background: cardBg, border: cardBorder }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                style={{
                  background: activeTab === tab.key ? "linear-gradient(135deg, #FF6B35, #FF8F5E)" : "transparent",
                  color: activeTab === tab.key ? "#fff" : textSecondary,
                  fontSize: 13,
                }}
              >
                {tab.label}
                <span
                  className="px-1.5 py-0.5 rounded-full"
                  style={{
                    fontSize: 11,
                    background: activeTab === tab.key ? "rgba(255,255,255,0.2)" : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"),
                    color: activeTab === tab.key ? "#fff" : textMuted,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-5">
          <AnimatePresence mode="wait">
            {/* EXCURSIONS TAB */}
            {activeTab === "excursions" && (
              <motion.div key="exc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openExcEditor()}
                  className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 mb-4"
                  style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)", color: "#FF6B35", fontSize: 14 }}
                >
                  <Plus size={18} /> Добавить экскурсию
                </motion.button>
                <div className="space-y-3">
                  {myExcursions.map((exc) => (
                    <div
                      key={exc.id}
                      className="rounded-2xl overflow-hidden"
                      style={{ background: cardBg, border: cardBorder }}
                    >
                      <div className="flex">
                        <img src={exc.image} alt="" className="w-24 h-24 object-cover flex-shrink-0" />
                        <div className="flex-1 p-3 min-w-0">
                          <p className="truncate" style={{ fontSize: 14, color: textPrimary }}>{exc.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin size={11} color={textMuted} />
                            <span className="truncate" style={{ fontSize: 11, color: textMuted }}>{exc.location}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span style={{ fontSize: 13, color: "#FF6B35" }}>{exc.price}</span>
                            <span style={{ fontSize: 11, color: textMuted }}>{exc.duration}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={10} fill="#FFB800" color="#FFB800" />
                            <span style={{ fontSize: 12, color: textSecondary }}>{exc.rating}</span>
                            <span style={{ fontSize: 11, color: textMuted }}>({exc.reviewCount})</span>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center gap-2 pr-3">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => openExcEditor(exc)}
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                          >
                            <Edit3 size={14} color={textSecondary} />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => deleteExcursion(exc.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: "rgba(255,59,48,0.08)" }}
                          >
                            <Trash2 size={14} color="#FF3B30" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* POSTS TAB */}
            {activeTab === "posts" && (
              <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openPostEditor()}
                  className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 mb-4"
                  style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)", color: "#FF6B35", fontSize: 14 }}
                >
                  <Plus size={18} /> Новый пост
                </motion.button>
                <div className="space-y-3">
                  {myPosts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-2xl overflow-hidden"
                      style={{ background: cardBg, border: cardBorder }}
                    >
                      <img src={post.image} alt="" className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <p style={{ fontSize: 14, lineHeight: 1.5, color: textPrimary }} className="mb-2">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span style={{ fontSize: 12, color: textMuted }}>{post.likes} likes</span>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setExpandedPostComments(expandedPostComments === post.id ? null : post.id)}
                              className="flex items-center gap-1"
                            >
                              <MessageSquare size={12} color={expandedPostComments === post.id ? "#FF6B35" : textMuted} />
                              <span style={{ fontSize: 12, color: expandedPostComments === post.id ? "#FF6B35" : textMuted }}>
                                {post.comments} comments
                              </span>
                            </motion.button>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => openPostEditor(post)}
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                            >
                              <Edit3 size={14} color={textSecondary} />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => deletePost(post.id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(255,59,48,0.08)" }}
                            >
                              <Trash2 size={14} color="#FF3B30" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Expanded comments */}
                        <AnimatePresence>
                          {expandedPostComments === post.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                                {mockComments.filter(c => c.postId === post.id).length > 0 ? (
                                  mockComments.filter(c => c.postId === post.id).map(comment => (
                                    <div key={comment.id} className="flex gap-2.5 mb-3">
                                      <div
                                        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                                        style={{
                                          background: isDark
                                            ? "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(139,92,246,0.15))"
                                            : "linear-gradient(135deg, rgba(255,107,53,0.1), rgba(139,92,246,0.1))",
                                        }}
                                      >
                                        <span style={{ fontSize: 11, color: textPrimary }}>{comment.author.charAt(0)}</span>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span style={{ fontSize: 12, color: textPrimary }}>{comment.author}</span>
                                          <span style={{ fontSize: 10, color: textMuted }}>{comment.timeAgo}</span>
                                        </div>
                                        <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.4, marginTop: 1 }}>
                                          {comment.text}
                                        </p>
                                        <span style={{ fontSize: 11, color: textMuted }}>♥ {comment.likes}</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p style={{ fontSize: 13, color: textMuted, textAlign: "center", paddingBottom: 4 }}>
                                    Нет комментариев
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                            <Star
                              key={i}
                              size={12}
                              fill={i < review.rating ? "#FFB800" : "transparent"}
                              color={i < review.rating ? "#FFB800" : textMuted}
                            />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: textSecondary }}>{review.text}</p>
                      <p className="mt-2" style={{ fontSize: 12, color: textMuted }}>{review.date}</p>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <div className="py-12 text-center">
                      <MessageSquare size={32} color={textMuted} className="mx-auto mb-3" />
                      <p style={{ color: textMuted, fontSize: 14 }}>Пока нет отзывов</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Excursion editor modal */}
      <AnimatePresence>
        {showExcEditor && (
          <>
            <motion.div
              className="fixed inset-0 z-[60]"
              style={{ background: "rgba(0,0,0,0.7)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowExcEditor(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[61] rounded-t-3xl"
              style={{
                background: isDark ? "rgba(18,18,28,0.98)" : "rgba(255,255,255,0.98)",
                backdropFilter: "blur(30px)",
                border: cardBorder,
                maxHeight: "85vh",
              }}
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mt-3" style={{ background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)" }} />
              <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                <h3 style={{ color: textPrimary }}>{editingExc ? "Редактировать" : "Новая экскурсия"}</h3>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowExcEditor(false)}>
                  <X size={20} color={textMuted} />
                </motion.button>
              </div>
              <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: "70vh", scrollbarWidth: "none" }}>
                <InputField label="Название" value={excForm.title} onChange={(v) => setExcForm({ ...excForm, title: v })} placeholder="Название экскурсии" />
                <InputField label="Локация" value={excForm.location} onChange={(v) => setExcForm({ ...excForm, location: v })} placeholder="Город, регион" />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <InputField label="Цена" value={excForm.price} onChange={(v) => setExcForm({ ...excForm, price: v })} placeholder="₽3 000" />
                  </div>
                  <div className="flex-1">
                    <InputField label="Длительность" value={excForm.duration} onChange={(v) => setExcForm({ ...excForm, duration: v })} placeholder="3 часа" />
                  </div>
                </div>
                <InputField label="Категория" value={excForm.category} onChange={(v) => setExcForm({ ...excForm, category: v })} placeholder="Природа, Гастро..." />
                <InputField label="Описание" value={excForm.description} onChange={(v) => setExcForm({ ...excForm, description: v })} placeholder="Расскажите об экскурсии..." multiline />
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={saveExcursion}
                  className="w-full py-4 rounded-2xl text-white mt-2"
                  style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)", boxShadow: "0 8px 30px rgba(255,107,53,0.3)" }}
                >
                  {editingExc ? "Сохранить изменения" : "Создать экскурсию"}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Post editor modal */}
      <AnimatePresence>
        {showPostEditor && (
          <>
            <motion.div
              className="fixed inset-0 z-[60]"
              style={{ background: "rgba(0,0,0,0.7)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPostEditor(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[61] rounded-t-3xl"
              style={{
                background: isDark ? "rgba(18,18,28,0.98)" : "rgba(255,255,255,0.98)",
                backdropFilter: "blur(30px)",
                border: cardBorder,
              }}
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mt-3" style={{ background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)" }} />
              <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                <h3 style={{ color: textPrimary }}>{editingPost ? "Редактировать пост" : "Новый пост"}</h3>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowPostEditor(false)}>
                  <X size={20} color={textMuted} />
                </motion.button>
              </div>
              <div className="px-5 pb-8">
                {/* Generate button */}
                {!editingPost && (
                  <>
                    <div className="mb-3">
                      <label className="block mb-1.5" style={{ fontSize: 12, color: textMuted }}>Промпт для генерации</label>
                      <div className="flex gap-2">
                        <input
                          value={genPrompt}
                          onChange={(e) => setGenPrompt(e.target.value)}
                          placeholder="Напр: пост про закат на море..."
                          className="flex-1 px-4 py-3 rounded-xl outline-none"
                          style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: isDark ? "#fff" : "#222", fontSize: 14 }}
                        />
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setGenerating(true);
                            const prompt = genPrompt.trim().toLowerCase();
                            const themed: Record<string, string[]> = {
                              море: [
                                `🌊 Закат на Чёрном море — лучшая награда после дня экскурсий! Волны, солёный бриз и бесконечный горизонт.\n\n📍 ${profileName}\n#путешествия #закат #черноеморе`,
                                `🏖 Сегодня море подарило нам идеальный штиль. Гости наслаждались каякингом и дельфинами у берега!\n\n#море #анапа #${profileName.replace(/\s/g, "")}`,
                              ],
                              гор: [
                                `🏔 Сегодня группа покорила вершину! Кавказский хребет, бирюзовые озёра и альпийские луга — каждый поход уникален.\n\n#${profileName.replace(/\s/g, "")} #горы #природа`,
                                `⛰ Каньон на рассвете — тишина, туман и первые лучи солнца создают магию.\n\n#каньон #рассвет #горы`,
                              ],
                              вин: [
                                `🍷 Дегустация молодого вина в окружении виноградников — атмосфера, которую невозможно передать словами!\n\nЗабронируйте винный тур 🔗\n#винныйтур #гастро #кубань`,
                                `🍇 Виноградники на закате — это отдельный вид искусства. Наш гастро-тур раскрывает все секреты кубанского виноделия.\n\n#вино #кубань #${profileName.replace(/\s/g, "")}`,
                              ],
                              дельфин: [
                                `🐬 Встреча с дельфинами — всегда неожиданность и восторг! Природа — лучший режиссёр.\n\n#дельфины #море #анапа`,
                              ],
                              гастро: [
                                `🍽 Кубанская кухня — это целая вселенная вкусов. Сегодня гости попробовали домашний сыр, мёд с горных пасек и свежий лаваш из тандыра!\n\n#гастро #кубань #${profileName.replace(/\s/g, "")}`,
                              ],
                            };
                            let pool: string[] = [];
                            if (prompt) {
                              for (const [key, arr] of Object.entries(themed)) {
                                if (prompt.includes(key)) pool.push(...arr);
                              }
                            }
                            if (pool.length === 0) {
                              pool = [
                                `🏔 Сегодня наша группа покорила новый маршрут! Невероятные виды!\n\n#${profileName.replace(/\s/g, "")} #горы #природа`,
                                `🌊 Закат на Чёрном море — лучшая награда!\n\n📍 ${profileName}\n#путешествия #закат`,
                                `🍷 Дегустация вина в окружении виноградников!\n\n#винныйтур #гастро #кубань`,
                                `⛰ Каньон на рассвете — тишина и магия.\n\n#каньон #рассвет`,
                                `🐬 Встреча с дельфинами — восторг!\n\n#дельфины #море`,
                              ];
                            }
                            if (prompt) {
                              const generated = pool[Math.floor(Math.random() * pool.length)];
                              const withContext = prompt
                                ? `${generated}\n\n✨ По вашему запросу: «${genPrompt.trim()}»`
                                : generated;
                              setTimeout(() => {
                                setPostForm({ description: withContext });
                                setGenerating(false);
                              }, 800);
                            } else {
                              setTimeout(() => {
                                setPostForm({ description: pool[Math.floor(Math.random() * pool.length)] });
                                setGenerating(false);
                              }, 600);
                            }
                          }}
                          disabled={generating}
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(255,107,53,0.15))",
                            border: "1px solid rgba(139,92,246,0.25)",
                          }}
                        >
                          {generating ? (
                            <motion.div
                              className="w-4 h-4 border-2 border-purple-300/30 border-t-purple-400 rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <Sparkles size={18} color="#A78BFA" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </>
                )}

                {/* Image placeholder */}
                <div
                  className="w-full h-40 rounded-2xl flex items-center justify-center mb-4 cursor-pointer"
                  style={{ background: cardBg, border: `2px dashed ${inputBorder}` }}
                >
                  <div className="text-center">
                    <Image size={28} color={textMuted} className="mx-auto mb-2" />
                    <p style={{ fontSize: 13, color: textMuted }}>Добавить фото</p>
                  </div>
                </div>
                <InputField
                  label="Описание"
                  value={postForm.description}
                  onChange={(v) => setPostForm({ ...postForm, description: v })}
                  placeholder="Напишите что-нибудь..."
                  multiline
                />
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={savePost}
                  className="w-full py-4 rounded-2xl text-white mt-2"
                  style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)", boxShadow: "0 8px 30px rgba(255,107,53,0.3)" }}
                >
                  {editingPost ? "Сохранить" : "Опубликовать"}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}