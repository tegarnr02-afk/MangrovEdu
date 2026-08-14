import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
// Sesuaikan path ini kalau lokasi file axios instance-mu berbeda.
import api from "../lib/api";
import imgSebelumPenebangan from "./mangrove-sebelum-penebangan.png";
import imgSesudahPenebangan from "./mangrove-sesudah-penebangan.png";
import imgSebelumPencemaran from "./mangrove-sebelum-pencemaran.png";
import imgSesudahPencemaran from "./mangrove-sesudah-pencemaran.png";
import imgPenambangan from "./mangrove-penambangan.png";

/* ================= ICONS ================= */
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l5 5L20 6" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4v5h5" />
    <path d="M20 20v-5h-5" />
    <path d="M5.5 9a7 7 0 0 1 12.3-2.5M18.5 15a7 7 0 0 1-12.3 2.5" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const ZoomInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
  </svg>
);

/* ================= SVG SCENE ILLUSTRATIONS (DETAIL TINGGI) ================= */
const SceneBefore_Penebangan = () => (
  <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", borderRadius: 14 }}>
    <defs>
      <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5BB8E0" /><stop offset="100%" stopColor="#A8D8EA" /></linearGradient>
      <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3A8FAA" /><stop offset="100%" stopColor="#1D5F7A" /></linearGradient>
      <linearGradient id="mudG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7A5C3A" /><stop offset="100%" stopColor="#5C3D1E" /></linearGradient>
    </defs>
    {/* Sky */}
    <rect width="360" height="200" fill="url(#skyG)" />
    {/* Sun */}
    <circle cx="42" cy="34" r="20" fill="#FFE44D" opacity="0.95" />
    <circle cx="42" cy="34" r="26" fill="#FFE44D" opacity="0.25" />
    {/* Clouds */}
    <ellipse cx="200" cy="22" rx="28" ry="10" fill="white" opacity="0.7" />
    <ellipse cx="220" cy="18" rx="18" ry="12" fill="white" opacity="0.7" />
    <ellipse cx="290" cy="30" rx="22" ry="9" fill="white" opacity="0.6" />
    {/* Water */}
    <rect x="0" y="138" width="360" height="62" fill="url(#waterG)" />
    {/* Water ripples */}
    <ellipse cx="90" cy="148" rx="20" ry="3" fill="white" opacity="0.12" />
    <ellipse cx="220" cy="155" rx="28" ry="3.5" fill="white" opacity="0.1" />
    {/* Mud bank */}
    <ellipse cx="180" cy="138" rx="180" ry="14" fill="url(#mudG)" />
    {/* Dense mangroves - back row */}
    {[20, 55, 90, 125, 160, 195, 230, 265, 300, 335].map((x, i) => (
      <g key={`b${i}`} transform={`translate(${x},${110 - (i % 4) * 5})`}>
        <rect x="-4" y="0" width="8" height="34" rx="4" fill="#4A2C0A" />
        <ellipse cx="0" cy="-8" rx="22" ry="30" fill={["#1B5E3A", "#2E7D52", "#246644", "#1A5234"][i % 4]} opacity="0.95" />
        <ellipse cx="-6" cy="2" rx="14" ry="20" fill={["#2E7D52", "#3D9960", "#2E7D52", "#246644"][i % 4]} opacity="0.8" />
        <ellipse cx="7" cy="0" rx="12" ry="18" fill="#3D9960" opacity="0.7" />
      </g>
    ))}
    {/* Aerial/prop roots */}
    {[35, 80, 140, 200, 260, 310].map((x, i) => (
      <g key={`r${i}`}>
        <line x1={x} y1={130} x2={x - 6} y2={142} stroke="#5C3D1E" strokeWidth="1.5" strokeLinecap="round" />
        <line x1={x} y1={128} x2={x + 5} y2={140} stroke="#5C3D1E" strokeWidth="1.5" strokeLinecap="round" />
        <line x1={x} y1={130} x2={x} y2={143} stroke="#5C3D1E" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    ))}
    {/* Birds */}
    <path d="M80 50 q4-3 8 0 q4 3 8 0" stroke="#1a3a2a" strokeWidth="1.5" fill="none" />
    <path d="M260 38 q3-2 6 0 q3 2 6 0" stroke="#1a3a2a" strokeWidth="1.5" fill="none" />
    {/* Label */}
    <rect x="4" y="4" width="154" height="22" rx="6" fill="rgba(0,60,30,0.65)" />
    <text x="12" y="19" fill="#90EE90" fontSize="10" fontFamily="sans-serif" fontWeight="700">✅ Kondisi Sebelum — Sehat</text>
  </svg>
);
const SceneAfter_Penebangan = () => (
  <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", borderRadius: 14 }}>
    <defs>
      <linearGradient id="skyG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8d8e0" /><stop offset="100%" stopColor="#e8f0f5" /></linearGradient>
    </defs>
    <rect width="320" height="180" fill="url(#skyG2)" />
    <rect x="0" y="120" width="320" height="60" fill="#4a9ebb" />
    <ellipse cx="160" cy="120" rx="160" ry="10" fill="#8aad94" opacity="0.4" />
    {[50, 160, 260].map((x, i) => (
      <g key={i} transform={`translate(${x},${105 - (i % 2) * 5})`}>
        <rect x="-3" y="0" width="6" height="20" rx="3" fill="#5C3D1E" />
        <ellipse cx="0" cy="-2" rx="12" ry="16" fill="#3D9960" opacity="0.85" />
      </g>
    ))}
    <line x1="90" y1="90" x2="110" y2="115" stroke="#8B6347" strokeWidth="4" strokeLinecap="round" />
    <line x1="140" y1="85" x2="155" y2="115" stroke="#8B6347" strokeWidth="4" strokeLinecap="round" />
    <line x1="200" y1="92" x2="210" y2="115" stroke="#8B6347" strokeWidth="3" strokeLinecap="round" />
    <text x="160" y="170" textAnchor="middle" fill="#556" fontSize="9" fontFamily="sans-serif" opacity="0.85">Mangrove berkurang 🪓</text>
  </svg>
);
const SceneBefore_Pencemaran = () => (
  <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", borderRadius: 14 }}>
    <defs>
      <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a8d8ea" /><stop offset="100%" stopColor="#d4f0ff" /></linearGradient>
    </defs>
    <rect width="320" height="180" fill="url(#sky3)" />
    <rect x="0" y="118" width="320" height="62" fill="#4db3cc" />
    {[20, 70, 130, 190, 250, 290].map((x, i) => (
      <g key={i} transform={`translate(${x},${102 - (i % 3) * 6})`}>
        <rect x="-3" y="0" width="6" height="24" rx="3" fill="#5C3D1E" />
        <ellipse cx="0" cy="-2" rx="16" ry="20" fill={i % 2 === 0 ? "#2E7D52" : "#4CAF71"} opacity="0.9" />
      </g>
    ))}
    <circle cx="55" cy="135" r="4" fill="#7DD" opacity="0.6" />
    <circle cx="200" cy="128" r="3" fill="#7DD" opacity="0.5" />
    <text x="160" y="170" textAnchor="middle" fill="white" fontSize="9" fontFamily="sans-serif" opacity="0.85">Lingkungan bersih 🌿</text>
  </svg>
);
const SceneAfter_Pencemaran = () => (
  <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", borderRadius: 14 }}>
    <rect width="320" height="180" fill="#c8cfc8" />
    <rect x="0" y="118" width="320" height="62" fill="#7a8a6a" opacity="0.85" />
    {[30, 90, 150, 250].map((x, i) => (
      <g key={i} transform={`translate(${x},${105 - (i % 2) * 4})`}>
        <rect x="-3" y="0" width="6" height="20" rx="3" fill="#5C3D1E" />
        <ellipse cx="0" cy="-2" rx="11" ry="14" fill="#4a7a50" opacity="0.7" />
      </g>
    ))}
    <rect x="60" y="108" width="18" height="22" rx="3" fill="#e74c3c" opacity="0.85" />
    <rect x="100" y="114" width="14" height="16" rx="2" fill="#3498db" opacity="0.8" />
    <rect x="170" y="110" width="20" height="12" rx="2" fill="#f39c12" opacity="0.8" />
    <ellipse cx="130" cy="125" rx="30" ry="6" fill="#2c3e50" opacity="0.3" />
    <circle cx="200" cy="118" r="6" fill="#e74c3c" opacity="0.7" />
    <path d="M220 115 q10-8 20 0" stroke="#6b4" strokeWidth="2" fill="none" opacity="0.6" />
    <text x="160" y="170" textAnchor="middle" fill="#c00" fontSize="9" fontFamily="sans-serif" opacity="0.85">Pencemaran sampah 🗑️</text>
  </svg>
);
const ScenePenambangan = () => (
  <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", borderRadius: 14 }}>
    <defs>
      <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b8c8d0" /><stop offset="100%" stopColor="#d8e8f0" /></linearGradient>
    </defs>
    <rect width="320" height="180" fill="url(#sky4)" />
    <rect x="0" y="115" width="320" height="65" fill="#5a8898" />
    <rect x="190" y="60" width="80" height="70" rx="4" fill="#778" opacity="0.85" />
    <rect x="195" y="65" width="70" height="20" rx="2" fill="#aab" opacity="0.8" />
    <rect x="210" y="60" width="6" height="30" fill="#556" />
    <rect x="225" y="50" width="30" height="6" rx="2" fill="#889" />
    <line x1="225" y1="53" x2="225" y2="85" stroke="#aaa" strokeWidth="2" />
    {[20, 60, 110].map((x, i) => (
      <g key={i} transform={`translate(${x},${105 - (i % 2) * 8})`}>
        <rect x="-3" y="0" width="6" height="18" rx="3" fill="#5C3D1E" />
        <ellipse cx="0" cy="-2" rx="10" ry="13" fill={i === 1 ? "#c2573a" : "#4a7855"} opacity="0.8" />
      </g>
    ))}
    <text x="160" y="170" textAnchor="middle" fill="#445" fontSize="9" fontFamily="sans-serif" opacity="0.85">Aktivitas penambangan ⛏️</text>
  </svg>
);

/* ================= CONFETTI COMPONENT ================= */
const Confetti = () => {
  const pieces = Array.from({ length: 18 }, (_, i) => i);
  const colors = ["#E8A33D", "#2F6B57", "#C24A5F", "#6C63B5", "#3D9960", "#F1C40F"];
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {pieces.map(i => (
        <div key={i} style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          top: "-10px",
          width: `${6 + Math.random() * 8}px`,
          height: `${6 + Math.random() * 8}px`,
          background: colors[i % colors.length],
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          animation: `confettiFall ${1.5 + Math.random() * 2}s linear ${Math.random() * 0.8}s forwards`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }} />
      ))}
    </div>
  );
};

/* ================= IMAGE ILLUSTRATION COMPONENT ================= */
const IllusImg = ({ src, alt, onZoom, maxHeight }) => (
  <div
    style={{
      position: "relative", width: "100%", borderRadius: 14, overflow: "hidden", background: "var(--paper)",
      cursor: onZoom ? "zoom-in" : "default",
      lineHeight: maxHeight ? undefined : 0,
      ...(maxHeight ? { display: "flex", alignItems: "center", justifyContent: "center", maxHeight } : {}),
    }}
    onClick={onZoom}
    title={onZoom ? "Klik untuk memperbesar gambar" : undefined}
  >
    <img
      src={src}
      alt={alt}
      style={maxHeight
        ? { maxWidth: "100%", maxHeight, height: "auto", width: "auto", display: "block", margin: "0 auto" }
        : { width: "100%", height: "auto", display: "block" }}
    />
    {onZoom && (
      <button className="illus-zoom-btn" onClick={onZoom} aria-label="Perbesar gambar" tabIndex={-1}>
        <ZoomInIcon />
      </button>
    )}
  </div>
);

/* ── ImageLightbox (zoom viewer, sama seperti Materi 1) ─────────────────────────── */
function ImageLightbox({ img, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const clampScale = (s) => Math.min(4, Math.max(1, s));

  const zoomStep = (delta) => {
    setScale((s) => {
      const next = clampScale(s + delta);
      if (next === 1) setPos({ x: 0, y: 0 });
      return next;
    });
  };

  /* handleWheel dipasang manual via addEventListener({ passive:false }) bukan
     lewat prop React onWheel, karena React mendaftarkan event wheel/touch
     sebagai passive secara default demi performa scroll browser. */
  const overlayRef = useRef(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const onWheelNative = (e) => {
      e.preventDefault();
      zoomStep(-e.deltaY * 0.0018);
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, []);

  const toggleZoom = (e) => {
    e.stopPropagation();
    if (scale > 1) {
      setScale(1);
      setPos({ x: 0, y: 0 });
    } else {
      setScale(2.2);
    }
  };

  const onMouseDown = (e) => {
    if (scale === 1) return;
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  };
  const stopDrag = () => { dragging.current = false; };

  return (
    <div
      ref={overlayRef}
      className="lightbox-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Tutup">
        <XIcon />
      </button>
      {alt && <div className="lightbox-caption">{alt}</div>}
      <img
        src={img}
        alt={alt}
        className="lightbox-img"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          cursor: scale === 1 ? "zoom-in" : dragging.current ? "grabbing" : "grab",
        }}
        onClick={toggleZoom}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        draggable={false}
      />
      <div className="lightbox-zoom-controls" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-zoom-btn" onClick={() => zoomStep(-0.6)} aria-label="Perkecil">−</button>
        <button className="lightbox-zoom-btn" onClick={() => zoomStep(0.6)} aria-label="Perbesar">+</button>
      </div>
      <div className="lightbox-hint">
        {scale === 1 ? "Klik gambar atau scroll untuk memperbesar" : "Geser untuk menjelajah • Klik untuk reset"}
      </div>
    </div>
  );
}

/* ================= DATA: FENOMENA PERUBAHAN EKOSISTEM ================= */
const FENOMENA = {
  penebangan: {
    id: "penebangan",
    order: 1,
    label: "Penebangan Mangrove",
    emoji: "🪓",
    accent: "#C24A5F",
    accentBg: "#F8E4E7",
    cardDesc: "Penebangan pohon mangrove secara liar menyebabkan berkurangnya tutupan hutan pesisir yang melindungi pantai dan menjadi rumah ribuan organisme.",
    intro:
      "Bandingkan kondisi kawasan mangrove sebelum dan sesudah mengalami penebangan.",
    before: { label: "Kondisi Sebelum", src: imgSebelumPenebangan, alt: "Mangrove sebelum penebangan", IllusComp: (props) => <IllusImg src={imgSebelumPenebangan} alt="Mangrove sebelum penebangan" onZoom={props?.onZoom} />, desc: "Mangrove tumbuh rapat dan lebat, membentuk hutan yang menahan gelombang serta menjadi rumah bagi banyak organisme." },
    after: { label: "Kondisi Setelah", src: imgSesudahPenebangan, alt: "Mangrove sesudah penebangan", IllusComp: (props) => <IllusImg src={imgSesudahPenebangan} alt="Mangrove sesudah penebangan" onZoom={props?.onZoom} />, desc: "Jumlah pohon mangrove terlihat jauh lebih sedikit dari sebelumnya. Bekas tebangan terlihat di sepanjang pantai." },
    quiz: {
      question: "Perhatikan kedua kondisi tersebut. Apa perubahan yang kamu lihat?",
      options: ["Jumlah mangrove berkurang.", "Jumlah mangrove bertambah.", "Tidak terjadi perubahan."],
      correct: 0,
      feedbackCorrect: "Benar! Pada kondisi kedua, jumlah mangrove terlihat lebih sedikit. Coba pikirkan, apa yang mungkin terjadi jika kondisi ini terus berlangsung?",
      feedbackWrong: [
        "Belum tepat. Coba bandingkan kembali kedua gambar. Perhatikan jumlah pohon mangrove pada masing-masing kondisi.",
        "Belum tepat. Perhatikan kembali kedua kondisi. Apakah jumlah pohon mangrove terlihat sama?",
      ],
    },
    followUp: {
      question: "Menurutmu, apa yang mungkin terjadi pada organisme yang hidup di sekitar mangrove jika jumlah mangrove terus berkurang?",
      options: ["Habitat organisme dapat berkurang.", "Habitat organisme semakin bertambah.", "Organisme tidak mungkin terdampak."],
      correct: 0,
      feedbackCorrect: "Benar! Berkurangnya mangrove dapat menyebabkan habitat bagi organisme yang hidup di sekitarnya ikut berkurang.",
      feedbackWrong: "Belum tepat. Ingat kembali bahwa mangrove dapat menjadi tempat hidup bagi berbagai organisme. Apa yang terjadi jika tempat hidup tersebut berkurang?",
    },
    chain: [
      { emoji: "🪓", title: "Penebangan Mangrove", desc: "Luas hutan mangrove Indonesia tercatat terus menyusut, dari sekitar 3,49 juta hektare pada 2015 menjadi 3,31 juta hektare pada 2020. Penurunan ini terjadi karena berbagai tekanan manusia, termasuk penebangan liar, selain konversi lahan dan polusi." },
      { emoji: "🌱", title: "Jumlah Mangrove Berkurang", desc: "Ketika luas mangrove menyusut, kondisi fisik kawasan pesisir ikut berubah: abrasi garis pantai, pendangkalan, munculnya daratan baru (akresi), hingga masuknya air laut lebih jauh ke daratan (intrusi air laut)." },
      { emoji: "🏠", title: "Habitat Organisme Berubah/Berkurang", desc: "Perubahan kondisi mangrove dapat menyebabkan perubahan pada habitat organisme yang bergantung pada kawasan mangrove." },
      { emoji: "🦀", title: "Organisme Dapat Terdampak", desc: "Penelitian di Segara Anakan, Cilacap menemukan bahwa semakin rusak kondisi mangrove, semakin turun jumlah kepiting bakau (Scylla sp.) yang berhasil ditangkap nelayan. Kepiting sangat bergantung pada mangrove sebagai tempat hidup dan mencari makan." },
      { emoji: "🌿", title: "Keseimbangan Ekosistem Terganggu", desc: "Ketika hewan seperti kepiting dan ikan berkurang, seluruh ekosistem pesisir ikut terganggu: keanekaragaman hayati menurun, hasil tangkapan berkurang, dan risiko bencana pesisir meningkat akibat hilangnya fungsi pelindung mangrove." },
    ],
    summary: ["Jumlah mangrove berkurang", "Habitat dapat berubah/berkurang", "Organisme dapat terdampak", "Keseimbangan ekosistem terganggu"],
  },
  pencemaran: {
    id: "pencemaran",
    order: 2,
    label: "Pencemaran",
    emoji: "🗑️",
    accent: "#1E8A8C",
    accentBg: "#E1F1F1",
    cardDesc: "Sampah plastik dan limbah industri mencemari perairan mangrove, menghambat pertumbuhan akar dan meracuni biota yang hidup di dalamnya.",
    intro: "Bandingkan kondisi lingkungan mangrove sebelum dan sesudah tercemar limbah.",
    before: { label: "Kondisi Sebelum", src: imgSebelumPencemaran, alt: "Lingkungan mangrove sebelum pencemaran", IllusComp: (props) => <IllusImg src={imgSebelumPencemaran} alt="Lingkungan mangrove sebelum pencemaran" onZoom={props?.onZoom} />, desc: "Air dan lumpur di sekitar akar mangrove masih bersih, mendukung pertumbuhan tanaman dan kehidupan biota di dalamnya." },
    after: { label: "Kondisi Setelah", src: imgSesudahPencemaran, alt: "Lingkungan mangrove sesudah pencemaran", IllusComp: (props) => <IllusImg src={imgSesudahPencemaran} alt="Lingkungan mangrove sesudah pencemaran" onZoom={props?.onZoom} />, desc: "Sampah dan limbah menumpuk di sekitar akar, mengubah kondisi air dan lumpur di kawasan mangrove." },
    quiz: {
      question: "Apa perubahan yang kamu lihat pada lingkungan mangrove tersebut?",
      options: ["Jumlah mangrove berkurang.", "Jumlah mangrove bertambah.", "Tidak terjadi perubahan."],
      correct: 0,
      feedbackCorrect: "Benar! Jumlah mangrove pada gambar terlihat berkurang. Coba pikirkan, apa yang mungkin terjadi pada lingkungan dan organisme di sekitarnya jika kondisi ini terus berlangsung?",
      feedbackWrong: [
        "Belum tepat. Coba amati kembali kedua kondisi pada gambar. Apakah jumlah mangrove terlihat bertambah atau justru berkurang?",
        "Belum tepat. Perhatikan kembali perbedaan kondisi mangrove pada kedua gambar. Adakah perubahan pada jumlah pohonnya?",
      ],
    },
    predict: {
      question: "Menurutmu, apa yang mungkin terjadi pada organisme yang hidup di lingkungan tersebut jika pencemaran terus terjadi?",
      placeholder: "Tulis prediksimu di sini...",
      full: ["terganggu", "berkurang", "mati", "sulit hidup", "habitat berubah", "habitat berkurang", "populasi menurun", "menurun"],
      partial: ["kotor", "tercemar", "limbah", "polusi", "air menjadi", "lingkungan menjadi"],
      feedbackCorrect: "Prediksimu sudah tepat! Pencemaran dapat mengubah kondisi lingkungan dan berdampak pada organisme yang hidup di dalamnya. Sekarang, yuk lihat bagaimana hubungan sebab-akibatnya terjadi.",
      feedbackPartial: "Prediksimu sudah mengarah ke masalah yang tepat. Sekarang pikirkan lebih lanjut, jika kondisi lingkungan berubah akibat pencemaran, bagaimana organisme yang hidup di dalamnya dapat terdampak?",
      feedbackWrong: "Coba pikirkan kembali. Perhatikan kondisi lingkungan pada gambar. Jika pencemaran terus terjadi, apakah lingkungan tersebut tetap mendukung kehidupan organisme?",
    },
    chain: [
      { emoji: "🗑️", title: "Pencemaran", desc: "Sampah plastik yang menumpuk di kawasan mangrove dapat mengganggu pertumbuhan tanaman, menghambat pernapasan akar, dan menghalangi fotosintesis bibit mangrove. Logam berat dari limbah industri dan rumah tangga juga ditemukan terakumulasi di sedimen dan tanaman mangrove." },
      { emoji: "🌊", title: "Kondisi Lingkungan Berubah", desc: "Hewan yang hidup di lumpur dan air tercemar, seperti kerang bakau, cenderung menyerap logam berat dari sedimen di sekitarnya lalu menyimpannya dalam tubuh. Semakin lama terpapar, semakin tinggi kadar logam berat yang menumpuk pada organisme tersebut." },
      { emoji: "🦀", title: "Organisme Dapat Terdampak", desc: "Pencemaran menjadi salah satu penyebab utama menurunnya kondisi ekosistem mangrove secara keseluruhan, bersama tekanan lain seperti alih fungsi lahan dan penebangan liar." },
      { emoji: "🌿", title: "Kondisi Ekosistem Berubah", desc: "Semua faktor ini saling memperparah kerusakan mangrove di berbagai wilayah pesisir Indonesia." },
    ],
    summary: ["Kondisi lingkungan berubah", "Mangrove dapat terganggu", "Organisme dapat terdampak", "Kondisi ekosistem berubah"],
  },
  penambangan: {
    id: "penambangan",
    order: 3,
    label: "Aktivitas Penambangan",
    emoji: "⛏️",
    accent: "#6C63B5",
    accentBg: "#EAE8F6",
    cardDesc: "Penambangan pasir dan mineral di laut tanpa memperhatikan kelestarian lingkungan merusak habitat mangrove dan mengganggu rantai kehidupan pesisir.",
    intro: "Amati kondisi lingkungan mangrove yang mengalami kerusakan akibat aktivitas penambangan di laut.",
    illustration: { src: imgPenambangan, alt: "Aktivitas penambangan di laut", IllusComp: (props) => <IllusImg src={imgPenambangan} alt="Aktivitas penambangan di laut" onZoom={props?.onZoom} maxHeight={360} />, desc: "Aktivitas penambangan di sekitar wilayah pesisir mengubah kondisi lingkungan mangrove dan mengganggu organisme yang bergantung padanya." },
    predict: {
      question: "Perhatikan kondisi lingkungan pada gambar. Menurutmu, apa yang mungkin terjadi pada ekosistem mangrove jika aktivitas penambangan terus berlangsung?",
      placeholder: "Tulis prediksimu...",
      full: ["terganggu", "berkurang", "menurun", "mati", "sulit hidup", "sulit bertahan hidup", "habitat terganggu", "habitat berkurang", "kehilangan habitat", "populasi menurun"],
      partial: ["rusak", "hilang", "kerusakan"],
      feedbackCorrect: "Prediksimu menunjukkan adanya hubungan sebab-akibat. Aktivitas penambangan dapat menyebabkan perubahan pada kondisi mangrove dan selanjutnya berdampak pada organisme yang bergantung pada ekosistem tersebut.",
      feedbackPartial: "Prediksimu sudah mengarah ke masalah yang tepat. Coba pikirkan lebih lanjut, bagian ekosistem apa saja yang bisa ikut terdampak?",
      feedbackWrong: "Prediksimu belum menunjukkan seluruh hubungan yang mungkin terjadi. Coba perhatikan kembali kondisi mangrove pada gambar. Jika mangrove mengalami kerusakan, komponen ekosistem apa yang mungkin ikut terdampak?",
    },
    chain: [
      { emoji: "⛏️", title: "Aktivitas Penambangan di Laut", desc: "Aktivitas penambangan di laut yang tidak memperhatikan kelestarian lingkungan dapat mengubah kondisi lingkungan di sekitar wilayah pesisir dan mangrove." },
      { emoji: "🌱", title: "Mangrove Mengalami Kerusakan/Kematian", desc: "Aktivitas penambangan di sekitar wilayah pesisir dapat berdampak pada kerusakan hingga kematian mangrove. Kondisi ini dapat mengubah lingkungan tempat berbagai organisme hidup." },
      { emoji: "🌊", title: "Kondisi Ekosistem Berubah", desc: "Ketika mangrove mengalami kerusakan atau kematian, kondisi ekosistem di sekitarnya ikut berubah. Perubahan tersebut dapat memengaruhi organisme yang memanfaatkan kawasan mangrove." },
      { emoji: "🦀", title: "Area Hidup/Perburuan Kepiting Berkurang", desc: "Kerusakan mangrove dapat menyebabkan berkurangnya area yang dapat digunakan kepiting laut untuk hidup dan mencari makan." },
      { emoji: "🦀", title: "Populasi Kepiting Laut Menurun", desc: "Jika area hidup dan perburuan kepiting berkurang, keberadaan kepiting laut dapat ikut terdampak sehingga populasinya mengalami penurunan." },
    ],
    summary: ["Mangrove dapat mengalami kerusakan/kematian", "Kondisi ekosistem berubah", "Area hidup kepiting berkurang", "Populasi kepiting laut dapat menurun"],
  },
};
const FENOMENA_ORDER = ["penebangan", "pencemaran", "penambangan"];

/* ============== Urutan benar aktivitas drag & drop (rantai penebangan) ============== */
const CHAIN_ITEMS = FENOMENA.penebangan.chain.map((c, i) => ({ id: i, ...c }));
const SHUFFLED_START = [2, 0, 4, 1, 3];

/* ============== Semantic keyword classifier (bukan exact-match) ============== */
function classifyPrediction(text, cfg) {
  const t = (text || "").toLowerCase().trim();
  if (!t) return null;
  if (cfg.full.some((k) => t.includes(k))) return "correct";
  if (cfg.partial.some((k) => t.includes(k))) return "partial";
  return "wrong";
}

/* ================= STAGES / PROGRESS ================= */
const STAGES = [
  { key: "pilih", label: "Pilih Fenomena" },
  { key: "penebangan", label: "Penebangan" },
  { key: "pencemaran", label: "Pencemaran" },
  { key: "penambangan", label: "Penambangan" },
  { key: "sebab-akibat", label: "Sebab-Akibat" },
  { key: "refleksi", label: "Refleksi" },
  { key: "selesai", label: "Selesai" },
];

export default function PerubahanLingkungan() {
  const navigate = useNavigate();
  const [stageIdx, setStageIdx] = useState(0);

  const [fState, setFState] = useState({
    penebangan: { mcqSelected: null, mcqSubmitted: false, mcqCorrect: false, followUpSelected: null, followUpSubmitted: false, followUpCorrect: false, openChain: null, done: false },
    pencemaran: { mcqSelected: null, mcqSubmitted: false, mcqCorrect: false, predictText: "", predictResult: null, openChain: null, done: false },
    penambangan: { predictText: "", predictResult: null, openChain: null, done: false },
  });

  const [dragPool, setDragPool] = useState(SHUFFLED_START);
  const [dragSlots, setDragSlots] = useState([null, null, null, null, null]);
  const [dragChecked, setDragChecked] = useState(false);
  const [dragCorrect, setDragCorrect] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const [reflSelected, setReflSelected] = useState(null);
  const [reflSubmitted, setReflSubmitted] = useState(false);

  const [navWarning, setNavWarning] = useState(false);
  useEffect(() => { setNavWarning(false); }, [stageIdx]);

  const [finishingMateri, setFinishingMateri] = useState(false);
  const [materiFinished, setMateriFinished] = useState(false);
  const [showLockWarning, setShowLockWarning] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  /* ── image lightbox (zoom viewer, sama seperti Materi 1) ── */
  const [lightbox, setLightbox] = useState(null); // { src, alt } | null
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  /* ── refs untuk scroll-reveal antar section (sama seperti Materi 2) ──
     Sebab-Akibat, Refleksi, dan Ringkasan sekarang menyatu di halaman
     yang sama dengan hub "Pilih Fenomena" (bukan stage/halaman terpisah
     lagi), jadi tombol "Lanjut ke ..." cukup scroll ke section-nya. */
  const sebabAkibatRef = useRef(null);
  const reflRef = useRef(null);
  const ringkasanRef = useRef(null);

  const scrollToSection = (ref) => {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };
  const scrollToSebabAkibat = () => scrollToSection(sebabAkibatRef);
  // Dipakai saat balik dari halaman detail fenomena (stage 1-3) langsung
  // menuju section Sebab-Akibat di hub, tanpa lompat/loncat kasar.
  const goToSebabAkibatFromDetail = () => {
    setStageIdx(0);
    window.scrollTo(0, 0);
    scrollToSebabAkibat();
  };

  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal:not(.show)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("show");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [stageIdx, fState, dragChecked, dragCorrect, reflSubmitted]);

  const updateF = (id, patch) => setFState((s) => ({ ...s, [id]: { ...s[id], ...patch } }));

  /* ── simpan jawaban ke backend (tidak reset saat refresh) ──
     Sama seperti Materi 1 & 2: upsert per (item_type, item_id) lewat
     POST /materi3/jawaban. Dipanggil di setiap titik "Periksa Jawaban"
     (mcq, followup, predict, drag, refleksi). Gagal simpan tidak
     memblokir UI — siswa tetap bisa lanjut, cuma progresnya nanti
     tidak ke-restore kalau refresh. */
  const saveJawaban = (itemType, itemId, isCorrect, nilai = null, detail = null) => {
    api
      .post("/materi3/jawaban", {
        item_type: itemType,
        item_id: itemId,
        is_correct: isCorrect,
        nilai,
        detail,
      })
      .catch((err) => console.error(`Gagal menyimpan jawaban ${itemType}:${itemId}:`, err));
  };

  /* ── rehydrate: muat ulang semua jawaban tersimpan saat halaman dibuka ── */
  useEffect(() => {
    let cancelled = false;
    api
      .get("/materi3/jawaban")
      .then(({ data }) => {
        if (cancelled) return;
        const rows = data?.data || [];

        setFState((prev) => {
          const next = { ...prev };
          rows.forEach((row) => {
            const detail = row.detail || {};
            if (row.item_type === "mcq" && next[row.item_id]) {
              next[row.item_id] = {
                ...next[row.item_id],
                mcqSelected: detail.selected ?? null,
                mcqSubmitted: true,
                mcqCorrect: !!row.is_correct,
              };
            } else if (row.item_type === "followup" && next[row.item_id]) {
              next[row.item_id] = {
                ...next[row.item_id],
                followUpSelected: detail.selected ?? null,
                followUpSubmitted: true,
                followUpCorrect: !!row.is_correct,
                done: true,
              };
            } else if (row.item_type === "predict" && next[row.item_id]) {
              next[row.item_id] = {
                ...next[row.item_id],
                predictText: detail.text ?? "",
                predictResult: detail.result ?? (row.is_correct ? "correct" : "wrong"),
                done: true,
              };
            }
          });
          return next;
        });

        const dragRow = rows.find((r) => r.item_type === "drag");
        if (dragRow && Array.isArray(dragRow.detail?.urutan)) {
          setDragSlots(dragRow.detail.urutan);
          setDragPool([]);
          setDragChecked(true);
          setDragCorrect(!!dragRow.is_correct);
        }

        const reflRow = rows.find((r) => r.item_type === "refleksi");
        if (reflRow) {
          setReflSelected(reflRow.detail?.selected ?? null);
          setReflSubmitted(true);
        }
      })
      .catch((err) => console.error("Gagal memuat progres Materi 3:", err))
      .finally(() => {
        if (!cancelled) setLoadingProgress(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fenomenaAllDone = FENOMENA_ORDER.every((k) => fState[k].done);
  const reflCorrect = reflSubmitted && reflSelected === 0;
  const maxUnlockedIdx = 3 + (fenomenaAllDone ? 1 : 0) + (dragChecked ? 1 : 0) + (reflSubmitted ? 1 : 0);
  // stageIdx tetap 0 selama di alur hub/sebab-akibat/refleksi/ringkasan (sekarang
  // satu halaman yang sama, tidak berpindah stage), jadi progress bar & label
  // pakai "virtual index" berdasarkan sejauh mana bagian tsb sudah terbuka.
  // Progress bar butuh granularitas per-fenomena (1/3, 2/3 selesai), bukan cuma
  // "belum" atau "ketiganya sudah" seperti pendekatan tahap besar — supaya
  // begitu 1 fenomena selesai, bar-nya langsung kelihatan bergerak.
  const doneFenomenaCount = FENOMENA_ORDER.filter((k) => fState[k].done).length;
  const hubFraction = fenomenaAllDone ? 4 : (doneFenomenaCount / FENOMENA_ORDER.length) * 4;
  const progressStage = stageIdx !== 0 ? stageIdx : reflSubmitted ? 6 : dragChecked ? 5 : hubFraction;
  const percent = Math.round((progressStage / (STAGES.length - 1)) * 100);

  const goStage = (idx) => {
    if (idx > maxUnlockedIdx) return;
    setStageIdx(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goFenomena = (id) => {
    setStageIdx(1 + FENOMENA_ORDER.indexOf(id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---- quiz handlers (MCQ, jawaban salah tetap lanjut — tidak ada retry) ---- */
  const submitMcq = (fenomenaId, field) => {
    const cfg = field === "mcq" ? FENOMENA[fenomenaId].quiz : FENOMENA[fenomenaId].followUp;
    const st = fState[fenomenaId];
    const selected = field === "mcq" ? st.mcqSelected : st.followUpSelected;
    const isCorrect = selected === cfg.correct;
    if (field === "mcq") {
      updateF(fenomenaId, { mcqSubmitted: true, mcqCorrect: isCorrect });
    } else {
      updateF(fenomenaId, { followUpSubmitted: true, followUpCorrect: isCorrect, done: true });
    }
    saveJawaban(field === "mcq" ? "mcq" : "followup", fenomenaId, isCorrect, isCorrect ? 100 : 0, { selected });
  };

  /* ---- prediction handlers (semantic, bukan exact-match) ---- */
  const submitPredict = (fenomenaId) => {
    const cfg = FENOMENA[fenomenaId].predict;
    const st = fState[fenomenaId];
    const result = classifyPrediction(st.predictText, cfg);
    updateF(fenomenaId, { predictResult: result, done: true });
    const isCorrect = result === "correct";
    const nilai = result === "correct" ? 100 : result === "partial" ? 50 : 0;
    saveJawaban("predict", fenomenaId, isCorrect, nilai, { text: st.predictText, result });
  };

  /* ---- drag & drop (native drag + klik-untuk-menyusun; berfungsi di desktop & mobile) ---- */
  const dragLocked = dragChecked;
  const placeItem = (id) => {
    if (dragLocked) return;
    const empty = dragSlots.findIndex((s) => s === null);
    if (empty === -1) return;
    setDragSlots((slots) => slots.map((s, i) => (i === empty ? id : s)));
    setDragPool((pool) => pool.filter((p) => p !== id));
    setDragChecked(false);
  };
  const removeSlot = (idx) => {
    if (dragLocked) return;
    const id = dragSlots[idx];
    if (id === null) return;
    setDragSlots((slots) => slots.map((s, i) => (i === idx ? null : s)));
    setDragPool((pool) => [...pool, id]);
    setDragChecked(false);
  };
  const moveItemToSlot = (id, destIndex) => {
    if (dragLocked || id === null || id === undefined) return;
    const fromSlotIndex = dragSlots.indexOf(id);
    const destCurrent = dragSlots[destIndex];
    if (fromSlotIndex === destIndex) return;
    const newSlots = [...dragSlots];
    let newPool = dragPool.filter((p) => p !== id);
    if (fromSlotIndex !== -1) {
      newSlots[fromSlotIndex] = destCurrent && fromSlotIndex !== destIndex ? destCurrent : null;
    } else if (destCurrent) {
      newPool = [...newPool, destCurrent];
    }
    newSlots[destIndex] = id;
    setDragSlots(newSlots);
    setDragPool(newPool);
    setDragChecked(false);
  };
  const moveItemToPool = (id) => {
    if (dragLocked || id === null || id === undefined) return;
    const fromSlotIndex = dragSlots.indexOf(id);
    if (fromSlotIndex === -1) return;
    const newSlots = [...dragSlots];
    newSlots[fromSlotIndex] = null;
    setDragSlots(newSlots);
    setDragPool((pool) => [...pool, id]);
    setDragChecked(false);
  };
  const handleDragStart = (id, e) => {
    if (dragLocked) return;
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
  };
  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverSlot(null);
  };
  const handleSlotDragOver = (index, e) => {
    e.preventDefault();
    setDragOverSlot(index);
  };
  const handleSlotDrop = (index, e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    const id = raw !== "" ? Number(raw) : draggingId;
    moveItemToSlot(id, index);
    setDraggingId(null);
    setDragOverSlot(null);
  };
  const handlePoolDragOver = (e) => {
    e.preventDefault();
  };
  const handlePoolDrop = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    const id = raw !== "" ? Number(raw) : draggingId;
    moveItemToPool(id);
    setDraggingId(null);
  };
  const checkDrag = () => {
    const isCorrect = dragSlots.every((v, i) => v === i);
    setDragChecked(true);
    setDragCorrect(isCorrect);
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    saveJawaban("drag", "sebab-akibat", isCorrect, isCorrect ? 100 : 0, { urutan: dragSlots });
  };
  const retryDrag = () => {
    setDragSlots([null, null, null, null, null]);
    setDragPool(SHUFFLED_START);
    setDragChecked(false);
    setDragCorrect(false);
  };

  const submitRefleksi = () => {
    if (reflSelected === null) return;
    const isCorrect = reflSelected === 0;
    setReflSubmitted(true);
    saveJawaban("refleksi", "kesimpulan", isCorrect, isCorrect ? 100 : 0, { selected: reflSelected });
  };

  /* ── tandai Materi 3 selesai ──
     Sama seperti Materi 2: manggil POST /materi/{slug}/complete (MateriProgressController)
     yang mencatat completed_at di tabel user_materi_progress, supaya Materi 4
     otomatis ter-unlock di daftar materi. Tombol dinonaktifkan sementara request
     berjalan supaya tidak diklik dobel. */
  const [finishError, setFinishError] = useState(null);
  const handleFinishMateri = () => {
    if (finishingMateri || materiFinished) return;
    setFinishingMateri(true);
    setFinishError(null);
    api
      .post("/materi/perubahan-lingkungan/complete")
      .then(() => {
        setMateriFinished(true);
      })
      .catch((err) => {
        console.error("Gagal menandai Materi 3 selesai:", err);
        // TIDAK menandai selesai di sisi tampilan kalau request gagal — supaya
        // status di layar selalu mencerminkan status sebenarnya di server.
        setFinishError(
          err?.response?.data?.message ||
            (err?.response?.status === 404
              ? "Endpoint /materi/perubahan-lingkungan/complete tidak ditemukan (404)."
              : err?.response
              ? `Gagal menyimpan (HTTP ${err.response.status}).`
              : "Tidak bisa terhubung ke server.")
        );
      })
      .finally(() => setFinishingMateri(false));
  };


  /* ================= RENDER HELPERS ================= */
  const renderMcqBlock = (fenomenaId, field, cfg) => {
    const st = fState[fenomenaId];
    const selected = field === "mcq" ? st.mcqSelected : st.followUpSelected;
    const submitted = field === "mcq" ? st.mcqSubmitted : st.followUpSubmitted;
    const correct = field === "mcq" ? st.mcqCorrect : st.followUpCorrect;
    const setSelected = (i) =>
      updateF(fenomenaId, field === "mcq" ? { mcqSelected: i } : { followUpSelected: i });
    const wrongMsg = Array.isArray(cfg.feedbackWrong)
      ? cfg.feedbackWrong[Math.min(selected, cfg.feedbackWrong.length - 1)] || cfg.feedbackWrong[0]
      : cfg.feedbackWrong;

    return (
      <div className="quiz-box reveal">
        <span className="eyebrow">Pertanyaan</span>
        <h3>{cfg.question}</h3>
        {cfg.options.map((opt, i) => {
          const state = !submitted ? (selected === i ? "selected" : "") : i === cfg.correct ? "correct" : selected === i ? "wrong" : "";
          return (
            <button key={i} className={`quiz-option ${state}`} disabled={submitted} onClick={() => setSelected(i)}>
              <span className="quiz-option-dot">
                {submitted && i === cfg.correct && <CheckIcon />}
                {submitted && selected === i && i !== cfg.correct && <XIcon />}
              </span>
              {opt}
            </button>
          );
        })}
        {!submitted ? (
          <button className="btn btn-primary" disabled={selected === null} onClick={() => submitMcq(fenomenaId, field)} style={{ marginTop: 8 }}>
            Periksa Jawaban <ArrowIcon />
          </button>
        ) : (
          <div className={`quiz-feedback ${correct ? "correct" : "wrong"}`}>
            {correct ? <CheckIcon /> : <XIcon />}
            <span>{correct ? cfg.feedbackCorrect : wrongMsg}</span>
          </div>
        )}
      </div>
    );
  };

  const renderPredictBlock = (fenomenaId) => {
    const cfg = FENOMENA[fenomenaId].predict;
    const st = fState[fenomenaId];
    return (
      <div className="quiz-box reveal">
        <span className="eyebrow">Buat Prediksimu</span>
        <h3>{cfg.question}</h3>
        <textarea
          className="predict-input"
          placeholder={cfg.placeholder}
          value={st.predictText}
          onChange={(e) => updateF(fenomenaId, { predictText: e.target.value, predictResult: null })}
          rows={3}
        />
        <button className="btn btn-primary" disabled={!st.predictText.trim()} onClick={() => submitPredict(fenomenaId)} style={{ marginTop: 12 }}>
          Periksa Prediksi <ArrowIcon />
        </button>
        {st.predictResult && (
          <div className={`quiz-feedback ${st.predictResult === "correct" ? "correct" : st.predictResult === "partial" ? "partial" : "wrong"}`}>
            {st.predictResult === "correct" ? <CheckIcon /> : st.predictResult === "partial" ? <span style={{ fontSize: "1.1rem" }}>💡</span> : <span style={{ fontSize: "1.1rem" }}>🔎</span>}
            <span>
              {st.predictResult === "correct" ? cfg.feedbackCorrect : st.predictResult === "partial" ? cfg.feedbackPartial : cfg.feedbackWrong}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderChain = (fenomenaId) => {
    const st = fState[fenomenaId];
    const chain = FENOMENA[fenomenaId].chain;
    return (
      <div className="chain-diagram reveal">
        <div className="chain-diagram-head">
          <span className="eyebrow" style={{ marginBottom: 0 }}>Diagram Sebab-Akibat</span>
        </div>
        <p style={{ fontSize: "0.88rem", color: "#556961", marginBottom: 18 }}>
          Klik tiap tahap untuk melihat penjelasan hubungan antarperubahan yang terjadi.
        </p>
        {chain.map((step, i) => (
          <React.Fragment key={i}>
            <div className={`chain-step${st.openChain === i ? " open" : ""}`}>
              <div className="chain-step-head" onClick={() => updateF(fenomenaId, { openChain: st.openChain === i ? null : i })}>
                <span className="chain-step-emoji">{step.emoji}</span>
                <span className="chain-step-title">{step.title}</span>
                <span className="chain-step-toggle"><ArrowIcon /></span>
              </div>
              <div className="chain-step-body"><p>{step.desc}</p></div>
            </div>
            {i < chain.length - 1 && <div className="chain-connector" />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderFenomenaStage = (fenomenaId) => {
    const f = FENOMENA[fenomenaId];
    const st = fState[fenomenaId];
    const revealChain = fenomenaId === "penebangan" ? st.mcqSubmitted : true;
    const idxInOrder = FENOMENA_ORDER.indexOf(fenomenaId);
    return (
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow" style={{ color: f.accent }}>Fenomena {f.order} dari 3 · {f.label}</span>
            <h2>{f.label}</h2>
            <p>{f.intro}</p>
          </div>

          {f.before && f.after ? (
            <div className="compare-grid reveal">
              <div className="compare-card">
                <span className="compare-label">{f.before.label}</span>
                <div className="compare-illus">
                  {f.before.IllusComp ? <f.before.IllusComp onZoom={() => setLightbox({ src: f.before.src, alt: f.before.alt })} /> : <span style={{ fontSize: "2.6rem", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>{f.before.emoji}</span>}
                </div>
                <p>{f.before.desc}</p>
              </div>
              <div className="compare-arrow"><ArrowIcon /></div>
              <div className="compare-card">
                <span className="compare-label" style={{ background: f.accent, color: "white" }}>{f.after.label}</span>
                <div className="compare-illus">
                  {f.after.IllusComp ? <f.after.IllusComp onZoom={() => setLightbox({ src: f.after.src, alt: f.after.alt })} /> : <span style={{ fontSize: "2.6rem", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>{f.after.emoji}</span>}
                </div>
                <p>{f.after.desc}</p>
              </div>
            </div>
          ) : (
            <div className="illus-solo reveal" style={{ background: f.accentBg }}>
              {f.illustration.IllusComp
                ? <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 14 }}><f.illustration.IllusComp onZoom={() => setLightbox({ src: f.illustration.src, alt: f.illustration.alt })} /></div>
                : <span className="illus-solo-emoji">{f.illustration.emoji}</span>}
              <p>{f.illustration.desc}</p>
            </div>
          )}

          {f.quiz && renderMcqBlock(fenomenaId, "mcq", f.quiz)}
          {f.followUp && st.mcqSubmitted && renderMcqBlock(fenomenaId, "followUp", f.followUp)}
          {f.predict && renderPredictBlock(fenomenaId)}

          {revealChain && (fenomenaId === "penebangan" ? st.followUpSubmitted : st.predictResult !== null) && renderChain(fenomenaId)}

          <div className="materi-nav reveal">
            <button className="btn btn-outline" onClick={() => goStage(0)}><ArrowLeftIcon /> Pilih Fenomena Lain</button>
            {idxInOrder < FENOMENA_ORDER.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!st.done) setNavWarning(true);
                  else goFenomena(FENOMENA_ORDER[idxInOrder + 1]);
                }}
              >
                Fenomena Berikutnya <ArrowIcon />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!fenomenaAllDone) setNavWarning(true);
                  else goToSebabAkibatFromDetail();
                }}
              >
                Lanjut ke Sebab-Akibat <ArrowIcon />
              </button>
            )}
          </div>

          {navWarning && (idxInOrder < FENOMENA_ORDER.length - 1 ? !st.done : !fenomenaAllDone) && (
            <div className="nav-warning reveal show">
              <LockIcon />
              <span>
                {!st.done
                  ? <>Selesaikan dulu pertanyaan pada fenomena <strong>{f.label}</strong> ini sebelum melanjutkan.</>
                  : "Kamu masih perlu menyelesaikan fenomena lain terlebih dahulu untuk membuka tahap Sebab-Akibat."}
              </span>
            </div>
          )}
        </div>
      </section>
    );
  };

  /* ================= MAIN RENDER ================= */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@600;700&family=Space+Mono:wght@400;700&display=swap');
        :root{
          --canopy:#0F241D; --estuary:#2F6B57; --estuary-light:#3D8267;
          --tide:#89AE9E; --tide-pale:#E1EAE2; --sand:#F1F4EC; --sand-deep:#E7EDDF;
          --silt:#A9784F; --amber:#E8A33D; --amber-deep:#CE8324;
          --ink:#12261F; --paper:#FBFAF5; --danger:#C24A5F;
          --radius-lg:28px; --radius-md:18px;
        }
        *{box-sizing:border-box; margin:0; padding:0;}
        html{scroll-behavior:smooth;}
        body{ font-family:'Plus Jakarta Sans', sans-serif; background:var(--sand); color:var(--ink); line-height:1.6; }
        h1,h2,h3,h4{ font-family:'Fraunces', serif; font-weight:600; color:var(--canopy); line-height:1.16; letter-spacing:-0.01em; }
        a{ text-decoration:none; color:inherit; }
        .container{ max-width:1100px; margin:0 auto; padding:0 32px; }
        .eyebrow{
          font-family:'Space Mono', monospace; text-transform:uppercase; letter-spacing:0.14em;
          font-size:0.72rem; color:var(--estuary); font-weight:700; display:inline-flex; align-items:center; gap:10px;
        }
        .reveal{ opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s ease; }
        .reveal.show{ opacity:1; transform:translateY(0); }
        .btn{
          display:inline-flex; align-items:center; gap:8px; padding:13px 26px; border-radius:999px;
          font-weight:700; font-size:0.9rem; cursor:pointer; border:none;
          transition:transform .25s ease, box-shadow .25s ease; font-family:'Plus Jakarta Sans', sans-serif;
        }
        .btn-primary{ background:var(--amber); color:var(--canopy); box-shadow:0 12px 24px -10px rgba(232,163,61,0.7); }
        .btn-primary:hover{ transform:translateY(-3px); }
        .btn-outline{ background:transparent; color:var(--estuary); border:1.5px solid rgba(47,107,87,0.3); }
        .btn-outline:hover{ background:var(--tide-pale); }
        .btn:disabled{ opacity:0.45; cursor:not-allowed; transform:none !important; }
        .btn-finished:disabled{ opacity:1; background:var(--estuary); color:var(--paper); box-shadow:none; }
        .btn svg{ width:16px; height:16px; }

        /* ===== Page Banner (same as Materi 1 & 2) ===== */
        .page-banner{ background:var(--canopy); padding:130px 0 40px; }
        .breadcrumb{ display:flex; align-items:center; gap:8px; font-size:0.83rem; color:rgba(251,250,245,0.62); margin-bottom:16px; flex-wrap:wrap; }
        .breadcrumb a:hover{ color:var(--amber); }
        .breadcrumb span.current{ color:rgba(251,250,245,0.9); }
        .page-banner h1{ color:var(--paper); font-size:clamp(1.9rem,3.5vw,2.8rem); max-width:640px; margin-bottom:14px; }
        .page-banner p{ color:rgba(251,250,245,0.78); max-width:600px; margin-bottom:0; }
        /* ===== Materi Progress (below banner, dark bg) ===== */
        .materi-progress-wrap{ background:var(--canopy); padding:0 0 26px; }
        .materi-progress{ display:flex; align-items:center; gap:14px; }
        .materi-progress-label{ font-family:'Space Mono',monospace; font-size:0.72rem; font-weight:700; color:var(--amber); white-space:nowrap; }
        .materi-progress-track{ flex:1; height:6px; border-radius:999px; background:rgba(251,250,245,0.14); overflow:hidden; }
        .materi-progress-fill{ height:100%; border-radius:999px; background:linear-gradient(90deg,var(--estuary-light),var(--amber)); transition:width .5s ease; }
        .stage-pill{ 
          display:inline-flex; align-items:center; gap:6px; background:rgba(251,250,245,0.1); 
          border:1.5px solid rgba(232,163,61,0.3); border-radius:999px; padding:6px 14px;
          font-size:0.76rem; font-weight:700; color:var(--amber); font-family:'Space Mono',monospace; margin-top:10px;
        }

        .section{ padding:70px 0; }
        .section-head{ max-width:640px; margin-bottom:36px; }
        .section-head h2{ font-size:clamp(1.6rem,2.6vw,2.1rem); margin-top:12px; }
        .section-head p{ color:#4C5F58; margin-top:12px; }

        /* ===== Opening (unused - kept for possible reuse) ===== */
        @keyframes floatIllus{ 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
        @keyframes confettiFall{
          0%{ transform:translateY(-10px) rotate(0deg); opacity:1; }
          100%{ transform:translateY(100vh) rotate(720deg); opacity:0; }
        }

        /* ===== Progress bar ===== */
        .progress-wrap{ background:var(--paper); border-bottom:1px solid rgba(15,36,29,0.08); padding:22px 0; position:sticky; top:0; z-index:20; }
        .progress-top{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:0.78rem; font-weight:700; color:var(--estuary); font-family:'Space Mono',monospace; }
        .progress-track{ height:6px; border-radius:999px; background:var(--sand-deep); overflow:hidden; margin-bottom:16px; }
        .progress-fill{ height:100%; background:linear-gradient(90deg, var(--estuary), var(--amber)); border-radius:999px; transition:width .4s ease; }
        .progress-steps{ display:flex; justify-content:space-between; gap:6px; }
        .progress-step{
          flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer; background:none; border:none;
          font-family:'Plus Jakarta Sans',sans-serif; padding:2px;
        }
        .progress-step:disabled{ cursor:not-allowed; }
        .progress-dot{
          width:26px; height:26px; border-radius:50%; background:var(--sand-deep); color:var(--silt);
          display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; border:2px solid transparent;
          transition:all .25s ease;
        }
        .progress-step.done .progress-dot{ background:var(--estuary); color:var(--paper); }
        .progress-step.current .progress-dot{ border-color:var(--amber); background:var(--canopy); color:var(--paper); }
        .progress-dot svg{ width:12px; height:12px; }
        .progress-label{ font-size:0.66rem; color:#7A8B83; text-align:center; display:none; }
        @media (min-width:768px){ .progress-label{ display:block; } }

        /* ===== Fenomena cards (hub) ===== */
        .fenomena-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
        .fenomena-card{
          background:var(--paper); border-radius:20px; padding:26px; text-align:left; cursor:pointer;
          border:2px solid rgba(15,36,29,0.06); box-shadow:0 4px 16px -10px rgba(15,36,29,0.12);
          transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease; position:relative;
          overflow:hidden;
        }
        .fenomena-card::before{ content:""; position:absolute; top:-30px; right:-30px; width:80px; height:80px; border-radius:50%; opacity:0.07; background:var(--card-accent,#2F6B57); transition:transform .4s ease; }
        .fenomena-card:hover::before{ transform:scale(3); }
        .fenomena-card:hover{ transform:translateY(-6px); box-shadow:0 18px 36px -18px rgba(15,36,29,0.28); }
        .fenomena-card.done{ border-color:var(--estuary); }
        .fenomena-icon{
          width:52px; height:52px; border-radius:16px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; font-size:1.6rem;
          transition:transform .25s ease;
        }
        .fenomena-card:hover .fenomena-icon{ transform:scale(1.12) rotate(-4deg); }
        .fenomena-card h4{ font-size:1.05rem; margin-bottom:10px; }
        .fenomena-card p{ font-size:0.88rem; color:#556961; line-height:1.6; }
        .fenomena-select-tag{ margin-top:14px; font-size:0.78rem; font-weight:700; display:inline-flex; align-items:center; gap:6px; }
        .fenomena-done-badge{ position:absolute; top:18px; right:18px; width:24px; height:24px; border-radius:50%; background:var(--estuary); color:var(--paper); display:flex; align-items:center; justify-content:center; }
        .fenomena-done-badge svg{ width:13px; height:13px; }
        .hub-progress{ font-size:0.85rem; color:#556961; margin-top:22px; font-weight:600; }

        /* ===== Compare before/after ===== */
        .compare-grid{ display:grid; grid-template-columns:1fr auto 1fr; gap:18px; align-items:center; margin-bottom:30px; }
        .compare-card{ background:var(--paper); border-radius:var(--radius-md); padding:22px; box-shadow:0 10px 26px -18px rgba(15,36,29,0.2); transition:transform .25s ease; }
        .compare-card:hover{ transform:translateY(-3px); }
        .compare-label{ display:inline-block; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; padding:5px 12px; border-radius:999px; background:var(--tide-pale); color:var(--canopy); margin-bottom:12px; }
        .compare-illus{ border-radius:14px; overflow:hidden; margin-bottom:14px; }        .compare-card p{ font-size:0.88rem; color:#4C5F58; }
        .compare-arrow{ color:var(--silt); display:flex; justify-content:center; flex-direction:column; align-items:center; gap:4px; }
        .compare-arrow svg{ width:22px; height:22px; animation:arrowPulse 1.6s ease-in-out infinite; }
        @keyframes arrowPulse{ 0%,100%{transform:translateX(0);opacity:0.6;} 50%{transform:translateX(5px);opacity:1;} }
        @media (max-width:700px){ .compare-grid{ grid-template-columns:1fr; } .compare-arrow{ transform:rotate(90deg); } }

        .illus-solo{ border-radius:var(--radius-lg); padding:40px; text-align:center; margin-bottom:30px; }
        .illus-solo-emoji{ font-size:3.4rem; display:block; margin-bottom:14px; }
        .illus-solo p{ max-width:520px; margin:0 auto; color:#3E504A; font-size:0.96rem; }

        /* ===== Zoom gambar fenomena (sama seperti Materi 1) ===== */
        .illus-zoom-btn{ position:absolute; bottom:10px; right:10px; background:rgba(15,36,29,.78); color:var(--paper); border:none; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:3; }
        .illus-zoom-btn svg{ width:15px; height:15px; }
        .illus-zoom-btn:hover{ background:var(--estuary); }
        .lightbox-overlay{ position:fixed; inset:0; background:rgba(6,14,11,.94); z-index:2000; display:flex; align-items:center; justify-content:center; overflow:hidden; animation:fadeOv .2s ease; touch-action:none; }
        @keyframes fadeOv{ from{opacity:0;} to{opacity:1;} }
        .lightbox-img{ max-width:88vw; max-height:80vh; object-fit:contain; transition:transform .12s ease-out; user-select:none; -webkit-user-drag:none; border-radius:6px; }
        .lightbox-close{ position:fixed; top:20px; right:20px; background:rgba(251,250,245,.12); border:1px solid rgba(251,250,245,.25); border-radius:50%; width:42px; height:42px; display:flex; align-items:center; justify-content:center; color:var(--paper); cursor:pointer; z-index:2001; }
        .lightbox-close svg{ width:18px; height:18px; }
        .lightbox-close:hover{ background:rgba(251,250,245,.22); }
        .lightbox-caption{ position:fixed; top:24px; left:24px; color:rgba(251,250,245,.85); font-family:'Fraunces', serif; font-style:italic; font-size:1.05rem; z-index:2001; }
        .lightbox-hint{ position:fixed; bottom:22px; left:50%; transform:translateX(-50%); background:rgba(251,250,245,.12); color:rgba(251,250,245,.85); padding:8px 18px; border-radius:999px; font-size:.78rem; z-index:2001; pointer-events:none; white-space:nowrap; }
        .lightbox-zoom-controls{ position:fixed; bottom:24px; right:24px; display:flex; gap:8px; z-index:2001; }
        .lightbox-zoom-btn{ background:rgba(251,250,245,.12); border:1px solid rgba(251,250,245,.25); border-radius:50%; width:38px; height:38px; color:var(--paper); font-size:1.1rem; font-weight:700; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .lightbox-zoom-btn:hover{ background:rgba(251,250,245,.22); }
        @media(max-width:600px){ .lightbox-caption{ top:16px; left:16px; font-size:.9rem; } .lightbox-hint{ display:none; } }

        /* ===== Pertanyaan / prediksi ===== */
        .quiz-box{ background:var(--paper); border-radius:var(--radius-lg); padding:34px; box-shadow:0 20px 40px -24px rgba(15,36,29,0.28); margin-top:30px; }
        .quiz-locked{ background:var(--sand-deep); border-radius:var(--radius-lg); padding:26px 32px; margin-top:30px; color:#5F726A; font-size:0.92rem; display:flex; align-items:center; gap:14px; }
        .quiz-locked svg{ width:28px; height:28px; flex-shrink:0; color:#8A9A93; }
        .nav-warning{ background:#F8E4E7; border:1.5px solid rgba(194,74,95,0.35); border-radius:var(--radius-lg); padding:20px 26px; margin-top:20px; color:#7A2E3C; font-size:0.9rem; font-weight:600; display:flex; align-items:center; gap:14px; animation:navWarningShake .4s ease; }
        .nav-warning svg{ width:24px; height:24px; flex-shrink:0; color:var(--danger); }
        @keyframes navWarningShake{ 0%,100%{ transform:translateX(0); } 20%{ transform:translateX(-6px); } 40%{ transform:translateX(6px); } 60%{ transform:translateX(-4px); } 80%{ transform:translateX(4px); } }
        .quiz-box .eyebrow{ margin-bottom:10px; }
        .quiz-box h3{ font-size:1.15rem; margin-bottom:22px; }
        .quiz-option{
          display:flex; align-items:center; gap:12px; width:100%; text-align:left;
          padding:15px 18px; border-radius:14px; border:1.5px solid rgba(15,36,29,0.12);
          background:var(--sand); margin-bottom:10px; cursor:pointer; font-size:0.92rem;
          transition:border-color .2s ease, background .2s ease;
        }
        .quiz-option:hover{ border-color:var(--estuary); }
        .quiz-option.selected{ border-color:var(--estuary); background:var(--tide-pale); font-weight:600; }
        .quiz-option.correct{ border-color:var(--estuary); background:#E4EFE7; }
        .quiz-option.wrong{ border-color:var(--danger); background:#F8E4E7; }
        .quiz-option-dot{ width:22px; height:22px; border-radius:50%; border:1.5px solid rgba(15,36,29,0.2); flex-shrink:0; display:flex; align-items:center; justify-content:center; }
        .quiz-feedback{ margin-top:16px; padding:16px 18px; border-radius:14px; font-size:0.9rem; display:flex; gap:10px; align-items:flex-start; }
        .quiz-feedback.correct{ background:#E4EFE7; color:var(--canopy); }
        .quiz-feedback.wrong{ background:#F8E4E7; color:#7A2E3C; }
        .quiz-feedback.partial{ background:#FBF0DA; color:#7A4E10; }
        .quiz-feedback svg{ width:18px; height:18px; flex-shrink:0; margin-top:2px; }

        .predict-input{
          width:100%; border-radius:14px; border:1.5px solid rgba(15,36,29,0.14); background:var(--sand);
          padding:16px 18px; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.92rem; resize:vertical; color:var(--ink);
        }
        .predict-input:focus{ outline:none; border-color:var(--estuary); }

        /* ===== Diagram sebab-akibat ===== */
        .chain-diagram{ margin-top:30px; }
        .chain-diagram-head{ display:flex; align-items:center; gap:10px; margin-bottom:16px; }
        .chain-step{
          background:var(--paper); border-radius:16px; margin-bottom:0; overflow:hidden;
          border:1.5px solid rgba(15,36,29,0.08); box-shadow:0 4px 14px -10px rgba(15,36,29,0.12);
          transition:border-color .25s, box-shadow .25s;
        }
        .chain-step:hover{ border-color:var(--estuary); box-shadow:0 8px 22px -12px rgba(15,36,29,0.22); }
        .chain-step-head{
          display:flex; align-items:center; gap:14px; padding:18px 20px; cursor:pointer; user-select:none;
        }
        .chain-step-emoji{
          width:36px; height:36px; border-radius:50%; background:var(--tide-pale);
          display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;
          transition:background .25s, transform .25s;
        }
        .chain-step:hover .chain-step-emoji{ transform:scale(1.15); }
        .chain-step.open .chain-step-emoji{ background:var(--estuary-light); color:white; }
        .chain-step-title{ font-weight:700; font-size:0.95rem; color:var(--canopy); flex:1; }
        .chain-step-toggle{ color:var(--silt); transition:transform .25s ease; }
        .chain-step.open .chain-step-toggle{ transform:rotate(90deg); }
        .chain-step-toggle svg{ width:16px; height:16px; }
        .chain-step-body{ max-height:0; overflow:hidden; transition:max-height .35s cubic-bezier(.4,0,.2,1); }
        .chain-step.open .chain-step-body{ max-height:300px; }
        .chain-step-body p{ padding:0 20px 20px 70px; font-size:0.9rem; color:#4C5F58; }
        .chain-connector{
          width:2px; height:20px; background:linear-gradient(to bottom, var(--estuary), var(--amber));
          margin-left:38px; position:relative; overflow:visible;
        }
        .chain-connector::after{
          content:"▼"; position:absolute; bottom:-6px; left:50%; transform:translateX(-50%);
          font-size:10px; color:var(--amber); animation:arrowBounce .8s ease-in-out infinite;
        }
        @keyframes arrowBounce{ 0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(3px);} }

        /* ===== Drag & drop (klik untuk menyusun) ===== */
        .drag-pool{ display:flex; flex-wrap:wrap; gap:12px; margin-bottom:30px; min-height:56px; }
        .drag-card{
          display:flex; align-items:center; gap:10px; padding:14px 18px; border-radius:14px; background:var(--paper);
          border:1.5px solid rgba(15,36,29,0.12); cursor:grab; font-size:0.88rem; font-weight:600; color:var(--canopy);
          box-shadow:0 6px 16px -12px rgba(15,36,29,0.2); transition:transform .2s ease;
        }
        .drag-card:hover{ transform:translateY(-3px); border-color:var(--estuary); }
        .drag-card.dragging{ opacity:0.4; }
        .drag-card .em{ font-size:1.2rem; }
        .drag-slots{ display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:26px; }
        .drag-slot{
          flex:1; min-width:150px; min-height:70px; border-radius:14px; border:2px dashed rgba(15,36,29,0.2);
          display:flex; align-items:center; justify-content:center; padding:10px; text-align:center; font-size:0.8rem; color:#8A9A92;
          background:var(--sand-deep); cursor:pointer;
        }
        .drag-slot.filled{ border-style:solid; border-color:var(--estuary); background:var(--paper); cursor:pointer; }
        .drag-slot.correct{ border-color:var(--estuary); background:#E4EFE7; }
        .drag-slot.incorrect{ border-color:var(--danger); background:#F8E4E7; }
        .drag-slot.drag-over{ border-color:var(--amber); background:var(--tide-pale); }
        .drag-slot-num{ font-family:'Space Mono',monospace; font-size:0.7rem; color:var(--silt); display:block; margin-bottom:4px; }
        .drag-arrow{ color:var(--silt); flex-shrink:0; }
        .drag-arrow svg{ width:16px; height:16px; }
        @media (max-width:700px){ .drag-slots{ flex-direction:column; align-items:stretch; } .drag-arrow{ transform:rotate(90deg); align-self:center; } }

        /* ===== Ringkasan ===== */
        .summary-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; margin-bottom:34px; }
        .summary-card{ background:var(--paper); border-radius:var(--radius-md); padding:26px; border-top:4px solid var(--accent); box-shadow:0 10px 26px -18px rgba(15,36,29,0.2); }
        .summary-card .em{ font-size:1.8rem; display:block; margin-bottom:12px; }
        .summary-card h4{ font-size:1rem; margin-bottom:14px; }
        .summary-card ul{ list-style:none; display:flex; flex-direction:column; gap:8px; }
        .summary-card li{ font-size:0.84rem; color:#4C5F58; display:flex; gap:8px; }
        .summary-card li::before{ content:"→"; color:var(--accent); font-weight:700; flex-shrink:0; }
        .final-message{ background:var(--canopy); color:var(--paper); border-radius:var(--radius-lg); padding:36px; text-align:center; font-size:1.02rem; line-height:1.7; }
        .final-message span{ color:var(--amber); }

        .materi-nav{ display:flex; justify-content:space-between; align-items:center; margin-top:60px; padding-top:30px; border-top:1px solid rgba(15,36,29,0.1); flex-wrap:wrap; gap:16px; }

        /* ===== Modal peringatan "materi belum selesai" (sama seperti Materi 2) ===== */
        .lock-warn-overlay{ position:fixed; inset:0; background:rgba(10,20,16,0.6); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); }
        .lock-warn-modal{ position:relative; background:var(--paper); border-radius:22px; padding:38px 32px 32px; max-width:380px; width:100%; text-align:center; box-shadow:0 20px 44px -18px rgba(15,36,29,0.4); }
        .lock-warn-close{ position:absolute; top:16px; right:16px; width:32px; height:32px; border:none; border-radius:50%; background:var(--sand-deep); color:var(--canopy); display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .lock-warn-close svg{ width:16px; height:16px; }
        .lock-warn-icon{ width:56px; height:56px; margin:0 auto 18px; border-radius:50%; background:#FBEEDA; color:var(--amber-deep); display:flex; align-items:center; justify-content:center; }
        .lock-warn-icon svg{ width:26px; height:26px; }
        .lock-warn-modal h3{ font-size:1.3rem; margin-bottom:10px; }
        .lock-warn-modal p{ color:#556961; font-size:0.92rem; line-height:1.6; margin-bottom:26px; }
        .lock-warn-modal .btn{ width:100%; justify-content:center; }

        @media (max-width:980px){
          .fenomena-grid{ grid-template-columns:repeat(2,1fr); }
          .summary-grid{ grid-template-columns:1fr; }
        }
        @media (max-width:768px){
          .page-banner{ padding:100px 0 28px; }
          .section{ padding:50px 0; }
          .quiz-box{ padding:24px 20px; }
        }
        @media (max-width:600px){
          .container{ padding:0 20px; }
          .fenomena-grid{ grid-template-columns:1fr; }
          .materi-nav{ flex-direction:column; align-items:stretch; }
          .page-banner h1{ font-size:1.6rem; }
          .section-head h2{ font-size:1.4rem; }
          .chain-step-body p{ padding-left:20px; }
        }
      `}</style>

      <Navbar />
      {showConfetti && <Confetti />}

      <>
        {/* ================= PAGE BANNER (consistent with Materi 1 & 2) ================= */}
        <section className="page-banner">
          <div className="container">
            <nav className="breadcrumb">
              <Link to="/">Beranda</Link>
              <span>›</span>
              <Link to="/materi">Daftar Materi</Link>
              <span>›</span>
              <span className="current">Materi 3 — Perubahan Ekosistem</span>
            </nav>
            <span className="eyebrow" style={{ color: "var(--amber)", marginBottom: 14, display: "block" }}>Materi 3 dari 5</span>
            <h1>Apa yang Terjadi pada Ekosistem Mangrove?</h1>
            <p style={{ marginTop: 14 }}>
              Ekosistem mangrove dapat mengalami perubahan akibat berbagai aktivitas manusia.
              Amati perubahan yang terjadi dan cari tahu bagaimana perubahan tersebut memengaruhi
              lingkungan dan organisme di dalamnya.
            </p>
          </div>
        </section>

        {/* ================= MATERI PROGRESS (sama persis seperti Materi 1 & 2) ================= */}
        <div className="materi-progress-wrap">
          <div className="container">
            <div className="materi-progress reveal">
              <span className="materi-progress-label">
                {loadingProgress ? "Memuat progres tersimpan…" : `Materi 3 — ${percent}%`}
              </span>
              <div className="materi-progress-track">
                <div className="materi-progress-fill" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2 — PILIH FENOMENA ================= */}
        {stageIdx === 0 && (
          <section className="section">
            <div className="container">
              <div className="section-head reveal">
                <span className="eyebrow">Eksplorasi</span>
                <h2>Pilih Fenomena Perubahan Ekosistem</h2>
                <p>Pilih salah satu fenomena untuk mulai mengamati perubahan ekosistem mangrove. Pelajari ketiganya untuk membuka aktivitas sebab-akibat.</p>
              </div>

              <div className="fenomena-grid reveal">
                {FENOMENA_ORDER.map((id) => {
                  const f = FENOMENA[id];
                  const done = fState[id].done;
                  return (
                    <button key={id} className={`fenomena-card${done ? " done" : ""}`} style={{ "--card-accent": f.accent }} onClick={() => goFenomena(id)}>
                      {done && <span className="fenomena-done-badge"><CheckIcon /></span>}
                      <div className="fenomena-icon" style={{ background: f.accentBg }}>{f.emoji}</div>
                      <h4>{f.label}</h4>
                      <p>{f.cardDesc || f.intro}</p>
                      <span className="fenomena-select-tag" style={{ color: f.accent }}>
                        {done ? "✓ Sudah dipelajari · buka lagi" : "Amati →"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="hub-progress reveal">
                Eksplorasi {FENOMENA_ORDER.filter((id) => fState[id].done).length}/3
              </p>

              {!fenomenaAllDone && (
                <div className="quiz-locked reveal">
                  <LockIcon />
                  <span>Pelajari ketiga fenomena di atas untuk membuka aktivitas menyusun sebab-akibat.</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================= SECTION 3, 4, 6 — FENOMENA (halaman detail terpisah) ================= */}
        {stageIdx === 1 && renderFenomenaStage("penebangan")}
        {stageIdx === 2 && renderFenomenaStage("pencemaran")}
        {stageIdx === 3 && renderFenomenaStage("penambangan")}

        {/* ================= SECTION 8 — SEBAB-AKIBAT (DRAG & DROP) =================
             Menyatu di halaman yang sama dengan hub "Pilih Fenomena" (stageIdx===0),
             baru muncul & ter-reveal begitu fenomenaAllDone true — persis pola
             Materi 2 (section baru ter-mount saat syarat terpenuhi, lalu di-scroll). */}
        {stageIdx === 0 && fenomenaAllDone && (
          <section className="section" style={{ background: "var(--sand-deep)" }} ref={sebabAkibatRef}>
            <div className="container">
              <div className="section-head reveal">
                <span className="eyebrow">Aktivitas</span>
                <h2>Susun Hubungan Sebab-Akibat</h2>
                <p>Ketuk kartu di bawah, lalu tempatkan pada kotak urutan sesuai rangkaian sebab-akibat penebangan mangrove. Ketuk kotak yang sudah terisi untuk mengembalikannya.</p>
              </div>

              <div className="drag-pool reveal" onDragOver={handlePoolDragOver} onDrop={handlePoolDrop}>
                {dragPool.map((id) => {
                  const item = CHAIN_ITEMS[id];
                  return (
                    <div
                      key={id}
                      className={`drag-card${draggingId === id ? " dragging" : ""}`}
                      onClick={() => placeItem(id)}
                      draggable={!dragLocked}
                      onDragStart={(e) => handleDragStart(id, e)}
                      onDragEnd={handleDragEnd}
                    >
                      <span className="em">{item.emoji}</span> {item.title}
                    </div>
                  );
                })}
                {dragPool.length === 0 && <span style={{ color: "#8A9A92", fontSize: "0.85rem" }}>Semua kartu sudah ditempatkan.</span>}
              </div>

              <div className="drag-slots reveal">
                {dragSlots.map((id, i) => {
                  const item = id !== null ? CHAIN_ITEMS[id] : null;
                  const state = dragChecked ? (id === i ? "correct" : "incorrect") : "";
                  return (
                    <React.Fragment key={i}>
                      <div
                        className={`drag-slot${item ? " filled" : ""} ${state}${dragOverSlot === i ? " drag-over" : ""}`}
                        onClick={() => item && removeSlot(i)}
                        onDragOver={(e) => handleSlotDragOver(i, e)}
                        onDragLeave={() => setDragOverSlot((cur) => (cur === i ? null : cur))}
                        onDrop={(e) => handleSlotDrop(i, e)}
                      >
                        {item ? (
                          <div draggable={!dragLocked} onDragStart={(e) => handleDragStart(id, e)} onDragEnd={handleDragEnd}>
                            <span className="drag-slot-num">{i + 1}</span>
                            <span>{item.emoji} {item.title}</span>
                          </div>
                        ) : (
                          <div>
                            <span className="drag-slot-num">{i + 1}</span>
                            Kosong
                          </div>
                        )}
                      </div>
                      {i < dragSlots.length - 1 && <span className="drag-arrow"><ArrowIcon /></span>}
                    </React.Fragment>
                  );
                })}
              </div>

              {!dragChecked ? (
                <button className="btn btn-primary reveal" disabled={dragSlots.some((s) => s === null)} onClick={checkDrag}>
                  Periksa Jawaban <ArrowIcon />
                </button>
              ) : null}

              {dragChecked && (
                <div className={`quiz-feedback ${dragCorrect ? "correct" : "wrong"}`} style={{ marginTop: 18 }}>
                  {dragCorrect ? <CheckIcon /> : <XIcon />}
                  <span>
                    {dragCorrect
                      ? "🎉 Benar! Kamu berhasil memahami hubungan sebab-akibat perubahan ekosistem mangrove."
                      : "💡 Belum tepat. Urutan yang benar: penyebab awal, perubahan kondisi mangrove, habitat, organisme, lalu keseimbangan ekosistem. Yuk lanjut ke bagian berikutnya."}
                  </span>
                </div>
              )}

            </div>
          </section>
        )}

        {/* ================= SECTION 9 — REFLEKSI =================
             Menyatu di halaman yang sama dengan hub (stageIdx===0), baru
             muncul & ter-reveal begitu dragChecked true (jawaban benar
             atau salah tetap lanjut) — pola yang sama dengan Sebab-Akibat
             & Materi 2. */}
        {stageIdx === 0 && dragChecked && (
          <section className="section" ref={reflRef}>
            <div className="container">
              <div className="section-head reveal">
                <span className="eyebrow">Refleksi</span>
                <h2>Apa yang Dapat Kamu Simpulkan?</h2>
                <p>Setelah mempelajari beberapa fenomena, saatnya merangkum pemahamanmu.</p>
              </div>

              <div className="quiz-box reveal">
                <span className="eyebrow">Pertanyaan Refleksi</span>
                <h3>Setelah mempelajari beberapa fenomena, apa yang dapat kamu simpulkan?</h3>
                {[
                  "Perubahan pada mangrove dapat memengaruhi organisme dan lingkungan di sekitarnya.",
                  "Mangrove tidak memiliki hubungan dengan organisme lain.",
                  "Kerusakan mangrove tidak memengaruhi ekosistem.",
                ].map((opt, i) => {
                  const state = !reflSubmitted ? (reflSelected === i ? "selected" : "") : i === 0 ? "correct" : reflSelected === i ? "wrong" : "";
                  return (
                    <button key={i} className={`quiz-option ${state}`} disabled={reflSubmitted} onClick={() => setReflSelected(i)}>
                      <span className="quiz-option-dot">
                        {reflSubmitted && i === 0 && <CheckIcon />}
                        {reflSubmitted && reflSelected === i && i !== 0 && <XIcon />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
                {!reflSubmitted ? (
                  <button className="btn btn-primary" disabled={reflSelected === null} onClick={submitRefleksi} style={{ marginTop: 8 }}>
                    Periksa Jawaban <ArrowIcon />
                  </button>
                ) : (
                  <div className={`quiz-feedback ${reflSelected === 0 ? "correct" : "wrong"}`}>
                    {reflSelected === 0 ? <CheckIcon /> : <XIcon />}
                    <span>
                      {reflSelected === 0
                        ? "🎉 Benar! Ekosistem mangrove saling terhubung. Perubahan pada kondisi mangrove dapat memengaruhi habitat, organisme, dan kondisi ekosistem pesisir."
                        : "Coba pikirkan kembali. Ingat bagaimana penebangan, pencemaran, dan penambangan sama-sama berujung pada dampak bagi organisme dan ekosistem."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 10 — RINGKASAN =================
             Menyatu di halaman yang sama dengan hub (stageIdx===0), baru
             muncul & ter-reveal begitu reflSubmitted true (jawaban benar
             atau salah tetap lanjut) — pola yang sama dengan Sebab-Akibat,
             Refleksi & Materi 2. */}
        {stageIdx === 0 && reflSubmitted && (
          <section className="section" style={{ background: "var(--sand-deep)" }} ref={ringkasanRef}>
            <div className="container">
              <div className="section-head reveal">
                <span className="eyebrow">Selesai</span>
                <h2>Yang Sudah Kamu Pelajari</h2>
                <p>Rangkuman hubungan sebab-akibat dari tiga fenomena perubahan ekosistem mangrove.</p>
              </div>

              <div className="summary-grid reveal">
                {FENOMENA_ORDER.map((id) => {
                  const f = FENOMENA[id];
                  return (
                    <div className="summary-card" key={id} style={{ "--accent": f.accent }}>
                      <span className="em">{f.emoji}</span>
                      <h4>{f.label}</h4>
                      <ul>
                        {f.summary.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="final-message reveal">
                Ekosistem mangrove memiliki hubungan yang saling berkaitan. Perubahan akibat
                aktivitas manusia dapat memengaruhi <span>mangrove, habitat, organisme,</span> dan
                keseimbangan ekosistem pesisir.
              </div>

              <button
                className={`btn btn-primary reveal${materiFinished ? " btn-finished" : ""}`}
                style={{ fontSize: "1rem", padding: "14px 32px", marginTop: 24 }}
                onClick={handleFinishMateri}
                disabled={finishingMateri || materiFinished}
              >
                {materiFinished
                  ? <>✅ Materi Telah Diselesaikan</>
                  : finishingMateri
                    ? "Menyimpan..."
                    : <>🎉 Selesai Materi 3 <ArrowIcon /></>}
              </button>
              {finishError && (
                <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: 10 }}>
                  ⚠️ {finishError} Coba klik tombolnya lagi, atau cek console browser (F12) untuk detail.
                </p>
              )}
            </div>
          </section>
        )}

        {/* ================= NAV BAWAH (selalu tampil, tidak menunggu section reveal) ================= */}
        {stageIdx === 0 && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="materi-nav">
                <Link to="/materi" className="btn btn-outline"><ArrowLeftIcon /> Daftar Materi</Link>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (materiFinished) {
                      navigate("/materi/abrasi-pantai");
                    } else {
                      setShowLockWarning(true);
                    }
                  }}
                >
                  Materi 4: Abrasi Pantai <ArrowIcon />
                </button>
              </div>
            </div>
          </section>
        )}
      </>

      {/* ================= PERINGATAN: MATERI 3 BELUM SELESAI ================= */}
      {showLockWarning && (
        <div className="lock-warn-overlay" onClick={() => setShowLockWarning(false)}>
          <div className="lock-warn-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lock-warn-close" onClick={() => setShowLockWarning(false)} aria-label="Tutup">
              <XIcon />
            </button>
            <div className="lock-warn-icon"><LockIcon /></div>
            <h3>Selesaikan Materi 3 Dulu</h3>
            <p>
              Pelajari ketiga fenomena, susun hubungan Sebab-Akibat, dan jawab pertanyaan Refleksi
              terlebih dahulu — lalu klik tombol "Selesai Materi 3" di bagian ringkasan sebelum
              melanjutkan ke Materi 4: Abrasi Pantai.
            </p>
            <button className="btn btn-primary" onClick={() => setShowLockWarning(false)}>
              Mengerti
            </button>
          </div>
        </div>
      )}

      {lightbox && (
        <ImageLightbox
          img={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}

      <Footer />
    </>
  );
}