// src/CatBuddy.jsx
import { useEffect, useState, useRef } from "react";

const PHASE_COLORS = {
  menstruation: "#fb7185",
  follicular: "#facc15",
  ovulation: "#4ade80",
  luteal: "#60a5fa",
};

export default function CatBuddy({ phaseKey }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  const [hovered, setHovered] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/meow.mp3");
    audioRef.current.volume = 0.4;

    const move = (e) => setMouse({ x: e.clientX, y: e.clientY });
    const resize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });

    window.addEventListener("mousemove", move);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Kedinin durduğu nokta (sağ-alt)
  const catCenterX = viewport.w - 80;
  const catCenterY = viewport.h - 110;

  const dx = mouse.x - catCenterX;
  const dy = mouse.y - catCenterY;

  const maxTilt = 10;
  const tilt = Math.max(Math.min(dx / 20, maxTilt), -maxTilt);
  const look = Math.max(Math.min(dx / 40, 6), -6);

  const haloColor = phaseKey ? PHASE_COLORS[phaseKey] : "#a5b4fc";

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="cat-buddy">
      <div
        className="cat-halo"
        style={{ background: haloColor, opacity: phaseKey ? 0.45 : 0.2 }}
      />
      <div className="cat-shadow" />
      <div
        className={`cat-wrapper ${hovered ? "cat-wrapper-hover" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        <img
          src="/cat.png"
          alt="cat buddy"
          className="cat-img"
          draggable="false"
          style={{
            transform: `translateX(${look}px) rotate(${tilt}deg)`,
          }}
        />
      </div>
    </div>
  );
}