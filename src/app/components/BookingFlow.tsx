import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, Plus, MapPin, Calendar, Users, Navigation, X } from "lucide-react";
import { Excursion, nearbyActivities } from "./data";

interface BookingFlowProps {
  excursion: Excursion;
  onBack: () => void;
  onComplete: () => void;
  isDark?: boolean;
}

export function BookingFlow({ excursion, onBack, onComplete, isDark = true }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [location, setLocation] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [addedActivities, setAddedActivities] = useState<Set<string>>(new Set());

  const bg = isDark ? "#0A0A0F" : "#f8f8fc";
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)";
  const inputText = isDark ? "#fff" : "#222";
  const circleBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const bottomGrad = isDark
    ? "linear-gradient(to top, #0A0A0F 60%, transparent)"
    : "linear-gradient(to top, #f8f8fc 60%, transparent)";
  const overlayBg = isDark ? "rgba(10,10,15,0.95)" : "rgba(248,248,252,0.95)";
  const sheetBg = isDark ? "rgba(20,20,30,0.95)" : "rgba(255,255,255,0.95)";
  const sheetBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const progressBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const handleConfirm = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowActivities(true);
    }, 1500);
  };

  const toggleActivity = (id: string) => {
    setAddedActivities((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="h-full relative" style={{ background: bg }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-4 pt-14 pb-4">
        <motion.button onClick={onBack} whileTap={{ scale: 0.85 }}>
          <ArrowLeft size={24} color={isDark ? "#fff" : "#222"} />
        </motion.button>
        <div className="flex-1">
          <p style={{ fontSize: 12, color: textMuted }}>Бронирование</p>
          <p className="truncate" style={{ color: textPrimary }}>{excursion.title}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 mb-8">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: progressBg }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)" }}
                animate={{ width: step >= s ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-32">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 style={{ color: textPrimary }} className="mb-6">Дата и гости</h2>

              <div className="mb-6">
                <label className="mb-2 block" style={{ fontSize: 13, color: textMuted }}>Выберите дату</label>
                <div
                  className="flex items-center gap-3 p-4 rounded-2xl"
                  style={{ background: cardBg, border: cardBorder }}
                >
                  <Calendar size={20} color={textMuted} />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent flex-1 outline-none"
                    style={{ color: inputText, colorScheme: isDark ? "dark" : "light" }}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block" style={{ fontSize: 13, color: textMuted }}>Количество гостей</label>
                <div
                  className="flex items-center justify-between p-4 rounded-2xl"
                  style={{ background: cardBg, border: cardBorder }}
                >
                  <Users size={20} color={textMuted} />
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: circleBg, color: textPrimary }}
                    >
                      −
                    </motion.button>
                    <span className="w-8 text-center" style={{ fontSize: 20, color: textPrimary }}>{guests}</span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setGuests(guests + 1)}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: circleBg, color: textPrimary }}
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 style={{ color: textPrimary }} className="mb-2">Ваша локация</h2>
              <p className="mb-6" style={{ fontSize: 14, color: textMuted }}>Мы построим маршрут от вашего местоположения</p>

              <div
                className="flex items-center gap-3 p-4 rounded-2xl mb-4"
                style={{ background: cardBg, border: cardBorder }}
              >
                <MapPin size={20} color={textMuted} />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Адрес отеля или точка сбора"
                  className="bg-transparent flex-1 outline-none"
                  style={{ color: inputText }}
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl"
                style={{ background: cardBg, border: cardBorder, color: textSecondary }}
              >
                <Navigation size={18} />
                <span style={{ fontSize: 14 }}>Определить автоматически</span>
              </motion.button>

              {location && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-2xl"
                  style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.15)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Navigation size={14} color="#FF6B35" />
                    <span style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}>Маршрут сформирован</span>
                  </div>
                  <p style={{ fontSize: 12, color: textMuted }}>Примерное время в пути: 25 мин</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 style={{ color: textPrimary }} className="mb-6">Подтверждение</h2>

              <div
                className="rounded-2xl overflow-hidden mb-6"
                style={{ background: cardBg, border: cardBorder }}
              >
                <img src={excursion.image} alt="" className="w-full h-40 object-cover" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span style={{ fontSize: 14, color: textMuted }}>Экскурсия</span>
                    <span style={{ fontSize: 14, color: textPrimary }}>{excursion.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: 14, color: textMuted }}>Дата</span>
                    <span style={{ fontSize: 14, color: textPrimary }}>{date || "Не выбрана"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: 14, color: textMuted }}>Гости</span>
                    <span style={{ fontSize: 14, color: textPrimary }}>{guests} чел.</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: 14, color: textMuted }}>Откуда</span>
                    <span className="truncate ml-4" style={{ fontSize: 14, color: textPrimary }}>{location || "Не указано"}</span>
                  </div>
                  <div className="h-px" style={{ background: divider }} />
                  <div className="flex justify-between">
                    <span style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }}>Итого</span>
                    <span style={{ fontSize: 20, color: textPrimary }}>{excursion.price}</span>
                  </div>
                </div>
              </div>

              {/* Route button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl"
                style={{ background: cardBg, border: cardBorder }}
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(excursion.location)}`,
                    "_blank"
                  );
                }}
              >
                <Navigation size={18} color="#FF6B35" />
                <span style={{ fontSize: 14, color: textPrimary }}>Маршрут</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 z-40" style={{ background: bottomGrad }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (step < 3) setStep(step + 1);
            else handleConfirm();
          }}
          className="w-full py-4 rounded-2xl text-white"
          style={{
            background: "linear-gradient(135deg, #FF6B35, #FF8F5E)",
            boxShadow: "0 8px 30px rgba(255,107,53,0.35)",
          }}
        >
          {step < 3 ? "Далее" : "Подтвердить бронь"}
        </motion.button>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: overlayBg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F5E)" }}
              >
                <Check size={40} color="#fff" />
              </div>
              <h2 style={{ color: textPrimary }} className="mb-2">Забронировано!</h2>
              <p style={{ color: textSecondary }}>Данные отправлены организатору</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activities bottom sheet */}
      <AnimatePresence>
        {showActivities && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowActivities(false); onComplete(); }}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pt-6 pb-10"
              style={{ background: sheetBg, backdropFilter: "blur(30px)", border: sheetBorder }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)" }} />
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ color: textPrimary }}>Добавить активности по пути?</h3>
                <button onClick={() => { setShowActivities(false); onComplete(); }}>
                  <X size={20} color={textMuted} />
                </button>
              </div>
              <p className="mb-5" style={{ fontSize: 14, color: textMuted }}>Места рядом с вашим маршрутом</p>
              <div className="space-y-3">
                {nearbyActivities.map((act) => (
                  <motion.div
                    key={act.id}
                    className="flex items-center justify-between p-4 rounded-2xl"
                    style={{
                      background: addedActivities.has(act.id) ? "rgba(255,107,53,0.1)" : cardBg,
                      border: addedActivities.has(act.id) ? "1px solid rgba(255,107,53,0.2)" : cardBorder,
                    }}
                    layout
                  >
                    <div>
                      <p style={{ fontSize: 14, color: textPrimary }}>{act.name}</p>
                      <p style={{ fontSize: 12, color: textMuted }}>{act.type} · {act.duration} · {act.price}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => toggleActivity(act.id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: addedActivities.has(act.id) ? "linear-gradient(135deg, #FF6B35, #FF8F5E)" : circleBg,
                      }}
                    >
                      {addedActivities.has(act.id) ? <Check size={18} color="#fff" /> : <Plus size={18} color={textSecondary} />}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setShowActivities(false); onComplete(); }}
                className="w-full py-4 rounded-2xl mt-5"
                style={{
                  background: addedActivities.size > 0 ? "linear-gradient(135deg, #FF6B35, #FF8F5E)" : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"),
                  color: addedActivities.size > 0 ? "#fff" : textSecondary,
                }}
              >
                {addedActivities.size > 0 ? `Обновить маршрут (${addedActivities.size})` : "Пропустить"}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}