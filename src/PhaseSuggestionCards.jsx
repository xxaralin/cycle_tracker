import { useState, useEffect } from "react";
import FlipCard from "./FlipCard";


function getRandomItem(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function NutritionSuggestionBack({ phase }) {
  const [macro, setMacro] = useState(null);
  const [detail, setDetail] = useState(null);
  const [meal, setMeal] = useState(null);

  const refresh = () => {
    setMacro(getRandomItem(phase.nutrition));
    setDetail(getRandomItem(phase.nutritionDetails));
    setMeal(getRandomItem(phase.mealSuggestions));
  };

  useEffect(() => {
    refresh(); // kart arka yüzüne ilk geçişte
  }, [phase]);

  return (
    <div style={{ position: "relative" }}>
      {/* sağ üstte refresh */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          refresh();
        }}
        className="refresh-btn"
      >
       ↻
      </button>

      <h4 className="suggestion-back-title">Makro öneri</h4>
      <ul className="suggestion-list">
        <li>{macro?.label || "—"}</li>
      </ul>

      <h4 className="suggestion-back-title" style={{ marginTop: 6 }}>
        Beslenme detayı
      </h4>
      <ul className="suggestion-list">
        <li>{detail || "—"}</li>
      </ul>

      <h4 className="suggestion-back-title" style={{ marginTop: 6 }}>
        Yemek önerisi
      </h4>
      <ul className="suggestion-list">
        <li>{meal || "—"}</li>
      </ul>
    </div>
  );
}

function renderEnumList(list) {
  if (!list || !list.length) {
    return <p className="suggestion-empty">—</p>;
  }

  return (
    <ul className="suggestion-list">
      {list
        .filter(Boolean) // undefined/null olanları at
        .map((item, idx) => {
          if (item && typeof item === "object") {
            const key = item.id || item.label || idx;
            const label = item.label || String(key);
            return <li key={key}>{label}</li>;
          }

          // string / number vs ise:
          const key = `${item}-${idx}`;
          return <li key={key}>{String(item)}</li>;
        })}
    </ul>
  );
}

function renderStringList(list) {
  if (!list || !list.length) {
    return <p className="suggestion-empty">—</p>;
  }

  return (
    <ul className="suggestion-list">
      {list.map((text, idx) => (
        <li key={idx}>{text}</li>
      ))}
    </ul>
  );
}

export default function PhaseSuggestionCards({ phase }) {
  if (!phase) return null;

  return (
    <div className="suggestions-grid">
      {/* 🧡 Workout */}
      <FlipCard
        front={
          <div>
            <h3 className="suggestion-title">🔥 Workout</h3>
            <p className="suggestion-sub">
              Bu phase için önerilen hareketleri görmek için dokun.
            </p>
          </div>
        }
        back={
          <div>
            <h4 className="suggestion-back-title">Önerilen hareketler</h4>
            {renderEnumList(phase.workout)}
          </div>
        }
      />

      {/* 🍓 Nutrition */}
      <FlipCard
        front={
          <div>
            <h3 className="suggestion-title">🍓 Nutrition</h3>
            <p className="suggestion-sub">
              Bugünün kişisel beslenme önerisini gör.
            </p>
          </div>
        }
        back={
          <NutritionSuggestionBack phase={phase} />
        }
      />

      {/* 🌿 Self-care */}
      <FlipCard
        front={
          <div>
            <h3 className="suggestion-title">🌿 Self-care</h3>
            <p className="suggestion-sub">
              Bugün kendine iyi gelecek küçük ritüeller.
            </p>
          </div>
        }
        back={
          <div>
            <h4 className="suggestion-back-title">Self-care önerileri</h4>
            {renderEnumList(phase.selfCare)}
          </div>
        }
      />

      {/* ✨ Cycle Tips */}
      <FlipCard
        front={
          <div>
            <h3 className="suggestion-title">✨ Cycle tips</h3>
            <p className="suggestion-sub">
              Gününü planlarken işine yarayacak mini ipuçları.
            </p>
          </div>
        }
        back={
          <div>
            <h4 className="suggestion-back-title">Bugün için ipuçları</h4>
            {renderStringList(phase.extra)}
          </div>
        }
      />
    </div>
  );
}