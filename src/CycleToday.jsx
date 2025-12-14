// src/CycleToday.jsx
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import {
  WORKOUT_TYPES,
  NUTRITION_TYPES,
  SELFCARE_TYPES,
  NUTRITION_DETAILS,
  MEAL_SUGGESTIONS,
  EXTRA_TIPS,
  PHASE_SUMMARY
} from "./enums";

import DateInput from "./assets/DateInput";
import PhaseSuggestionCards from "./PhaseSuggestionCards";

export const PHASE_CONFIG = {
  menstruation: {
    label: "Menstruation Phase",
    summary: PHASE_SUMMARY.MENSTRUATION,
    color: "#fb7185",

    workout: [
      WORKOUT_TYPES.LIGHT_YOGA,
      WORKOUT_TYPES.WALK,
      WORKOUT_TYPES.STRETCHING,
    ],

    nutrition: [
      NUTRITION_TYPES.IRON_MAGNESIUM,
      NUTRITION_TYPES.HIGH_PROTEIN,
    ],

    nutritionDetails: NUTRITION_DETAILS.MENSTRUATION,
    mealSuggestions: MEAL_SUGGESTIONS.MENSTRUATION,

    selfCare: [
      SELFCARE_TYPES.WARM_SHOWER,
      SELFCARE_TYPES.HEATING_PAD,
      SELFCARE_TYPES.REST_RELAX,
    ],

    extra: EXTRA_TIPS.MENSTRUATION,
  },

  follicular: {
    label: "Follicular Phase",
    summary: PHASE_SUMMARY.FOLLICULAR,
    color: "#facc15",

    workout: [
      WORKOUT_TYPES.MODERATE_STRENGTH,
      WORKOUT_TYPES.CARDIO,
      WORKOUT_TYPES.DANCE,
    ],

    nutrition: [
      NUTRITION_TYPES.FERMENTED,
      NUTRITION_TYPES.HIGH_PROTEIN,
    ],

    nutritionDetails: NUTRITION_DETAILS.FOLLICULAR,
    mealSuggestions: MEAL_SUGGESTIONS.FOLLICULAR,

    selfCare: [
      SELFCARE_TYPES.GOAL_SETTING,
      SELFCARE_TYPES.SOCIAL_DAY,
    ],

    extra: EXTRA_TIPS.FOLLICULAR,
  },

  ovulation: {
    label: "Ovulation Phase",
    summary: PHASE_SUMMARY.OVULATION,
    color: "#4ade80",

    workout: [
      WORKOUT_TYPES.HIIT,
      WORKOUT_TYPES.MODERATE_STRENGTH,
      WORKOUT_TYPES.SPRINTS,
    ],

    nutrition: [
      NUTRITION_TYPES.HIGH_PROTEIN,
      NUTRITION_TYPES.HYDRATION,
    ],

    nutritionDetails: NUTRITION_DETAILS.OVULATION,
    mealSuggestions: MEAL_SUGGESTIONS.OVULATION,

    selfCare: [
      SELFCARE_TYPES.SOCIAL_DAY,
      SELFCARE_TYPES.GOAL_SETTING,
    ],

    extra: EXTRA_TIPS.OVULATION,
  },

  luteal: {
    label: "Luteal Phase",
    summary: PHASE_SUMMARY.LUTEAL,
    color: "#60a5fa",

    workout: [
      WORKOUT_TYPES.LOW_IMPACT,
      WORKOUT_TYPES.LIGHT_STRENGTH,
      WORKOUT_TYPES.YOGA,
    ],

    nutrition: [
      NUTRITION_TYPES.COMPLEX_CARBS,
      NUTRITION_TYPES.HIGH_PROTEIN,
    ],

    nutritionDetails: NUTRITION_DETAILS.LUTEAL,
    mealSuggestions: MEAL_SUGGESTIONS.LUTEAL,

    selfCare: [
      SELFCARE_TYPES.REST_RELAX,
      SELFCARE_TYPES.WARM_SHOWER,
    ],

    extra: EXTRA_TIPS.LUTEAL,
  },
};
function getCycleDay(date, lastPeriodStart, cycleLength) {
  const t = new Date(date);
  const s = new Date(lastPeriodStart);
  if (isNaN(t) || isNaN(s) || !cycleLength) return null;

  const diffMs = t.setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const mod = diffDays % cycleLength;
  const day = (mod >= 0 ? mod : mod + cycleLength) + 1;
  return day;
}

function getPhase(day) {
  if (day == null) return null;
  if (day >= 1 && day <= 5) return "menstruation";
  if (day >= 6 && day <= 13) return "follicular";
  if (day >= 14 && day <= 16) return "ovulation";
  return "luteal";
}

function computeInfoForDate(date, lastPeriodStart, cycleLength) {
  if (!lastPeriodStart || !cycleLength || !date) return null;
  const day = getCycleDay(date, lastPeriodStart, cycleLength);
  const phaseKey = getPhase(day);
  if (!phaseKey) return null;
  const phase = PHASE_CONFIG[phaseKey];
  return { date, day, phaseKey, phase };
}

// Basit konfeti overlay (spor yaptım tuşu için)
function ConfettiOverlay() {
  const pieces = Array.from({ length: 40 });

  return (
    <div className="confetti-overlay">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const duration = 1 + Math.random() * 0.8;
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function CycleToday({ onPhaseChange }) {
  const [cycleLength, setCycleLength] = useState(
    () => Number(localStorage.getItem("cycleLength")) || 28
  );
  const [lastPeriodStart, setLastPeriodStart] = useState(
    () => localStorage.getItem("lastPeriodStart") || ""
  );

  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedInfo, setSelectedInfo] = useState(null);

  const [didWorkoutToday, setDidWorkoutToday] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Seçili günün info'sunu hesapla
  useEffect(() => {
    const info = computeInfoForDate(
      selectedDate,
      lastPeriodStart,
      cycleLength
    );
    setSelectedInfo(info || null);
    onPhaseChange && onPhaseChange(info?.phaseKey || null);
  }, [selectedDate, lastPeriodStart, cycleLength, onPhaseChange]);

  // Ay görünümü için günleri hesapla
  const monthDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth(); // 0-11
    const startOfMonth = new Date(year, month, 1);
    const endDay = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (startOfMonth.getDay() + 6) % 7; // 0: Pazartesi

    const cells = [];

    // leading boşluklar (hafta Pazar'dan başlıyor kabul)
    for (let i = 0; i < firstWeekday; i++) {
      cells.push(null);
    }

    for (let d = 1; d <= endDay; d++) {
      const date = new Date(year, month, d);
      const dayInCycle = lastPeriodStart
        ? getCycleDay(date, lastPeriodStart, cycleLength)
        : null;
      const phaseKey = getPhase(dayInCycle);
      const phase = phaseKey ? PHASE_CONFIG[phaseKey] : null;

      cells.push({
        date,
        dayInCycle,
        phaseKey,
        phase,
      });
    }

    return cells;
  }, [currentMonth, lastPeriodStart, cycleLength]);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("cycleLength", cycleLength.toString());
    localStorage.setItem("lastPeriodStart", lastPeriodStart);
    // Kaydettikten sonra bugünü seç
    setSelectedDate(new Date());
  };

  const handleClickDay = (cell) => {
    if (!cell || !cell.date) return;
    setSelectedDate(cell.date);
  };

  const handleWorkoutDone = () => {
    setDidWorkoutToday(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);
  };

  const goPrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const formatEnumList = (items) =>
    items && items.length ? items.map((item) => item.label).join(", ") : "—";

  const today = new Date();
  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const monthLabel = format(currentMonth, "MMMM yyyy");

  return (
    <div className="cycle-container">
      {showConfetti && <ConfettiOverlay />}

      <h1 className="title">Cycle Calendar & Wellness</h1>
      <form className="form" onSubmit={handleSave}>
        <label className="label">
          Son adet başlangıç tarihi:
          <DateInput
            value={lastPeriodStart}
            onChange={(val) => setLastPeriodStart(val)}
          />
        </label>

        <label className="label">
          Döngü uzunluğu (gün):
          <input
            type="number"
            min={21}
            max={40}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="input"
          />
        </label>

        <button type="submit" className="button">
          Kaydet
        </button>
      </form>

      {/* Takvim */}
      <div className="calendar-card">
        <div className="calendar-header">
          <button type="button" onClick={goPrevMonth}>
            ‹
          </button>
          <div className="calendar-month-label">{monthLabel}</div>
          <button type="button" onClick={goNextMonth}>
            ›
          </button>
        </div>

        <div className="calendar-weekdays">
          <span>Pzt</span>
          <span>Sa</span>
          <span>Çr</span>
          <span>Pr</span>
          <span>Cu</span>
          <span>Ct</span>
          <span>Pz</span>
        </div>

        <div className="calendar-grid">
          {monthDays.map((cell, idx) => {
            if (!cell) {
              return <div key={idx} className="calendar-cell empty" />;
            }

            const isSelected = isSameDay(cell.date, selectedDate);
            const isToday = isSameDay(cell.date, today);

            const bgColor =
              cell.phase && cell.phase.color
                ? cell.phase.color + "45"
                : "transparent";

            return (
              <button
                key={idx}
                type="button"
                className={
                  "calendar-cell day" +
                  (isSelected ? " selected" : "") +
                  (isToday ? " today" : "")
                }
                style={{ backgroundColor: bgColor }}
                onClick={() => handleClickDay(cell)}
              >
                <span className="calendar-day-number">
                  {cell.date.getDate()}
                </span>
                {cell.phaseKey && (
                  <span
                    className="calendar-phase-dot"
                    style={{ backgroundColor: cell.phase.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seçili gün detayları */}
      {selectedInfo ? (
  <div
    className="card"
    style={{ marginTop: 16 }}
  >
    <div className="card-inner">
      <span
        className="chip"
        style={{
          backgroundColor: selectedInfo.phase.color + "20",
        }}
      >
        {format(selectedInfo.date, "dd/MM/yyyy")} • Döngü günü:{" "}
        <strong>{selectedInfo.day}</strong>
      </span>

      <h2 className="phase-title">{selectedInfo.phase.label} Phase</h2>

      <PhaseSuggestionCards phase={selectedInfo.phase} />

      <button
        type="button"
        className={`workout-btn ${
          didWorkoutToday ? "workout-btn-done" : ""
        }`}
        onClick={handleWorkoutDone}
      >
        {didWorkoutToday ? "Bugün spor tamam ✅" : "Bugün sporu yaptım 🎉"}
      </button>
    </div>
  </div>
) : (
  <p className="hint" style={{ marginTop: 12 }}>
    Döngü bilgilerini görmek için bir gün seç. ✨
  </p>
)}
    </div>
  );
}