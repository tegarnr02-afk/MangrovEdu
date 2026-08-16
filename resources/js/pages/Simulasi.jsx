import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import heroBg from "./konservasi-mangrove-sehat.png";
import backgroundImg from "./background.png";
import mangroveImg from "./mangrove.png";
import waveLowImg from "./wave-low.png";
import waveMediumImg from "./wave-medium.png";
import waveHighImg from "./wave-high.png";

/* ================= ICONS ================= */
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5.14v13.72c0 .8.87 1.29 1.56.86l10.6-6.86a1 1 0 0 0 0-1.72L9.56 4.28C8.87 3.85 8 4.34 8 5.14Z" />
  </svg>
);
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </svg>
);
const WaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 8c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
    <path d="M2 14c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
    <path d="M2 20c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" />
  </svg>
);
const AnchorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2.2" />
    <path d="M12 7.2V21M5 13a7 7 0 0 0 14 0M5 13H3M21 13h-2" />
  </svg>
);
const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20c9 0 16-7 16-16-9 0-16 7-16 16Z" />
    <path d="M5 19c3.5-3.5 6-7 7.5-11" />
  </svg>
);
const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

/* ================= LOGIC SIMULASI ================= */
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Konsisten dengan Lab Virtual: 0–33 Rendah, 34–66 Sedang, 67–100 Tinggi.
// Skala generik ini dipakai untuk Tinggi Gelombang (belum ada standar baku resmi).
function kategori(v) {
  if (v <= 33) return "Rendah";
  if (v <= 66) return "Sedang";
  return "Tinggi";
}

// Kategori kerapatan mangrove mengikuti Tabel 1 "Standar baku kerusakan
// hutan mangrove" (Rafdinal et al., berdasarkan Kepmen LH No. 201/2004):
//   Kriteria Baik, Padat  : tutupan ≥ 75%  (kerapatan ≥ 1.500 ind/ha)
//   Kriteria Baik, Sedang : tutupan 50–75% (kerapatan 1.000–1.500 ind/ha)
//   Kriteria Rusak, Jarang: tutupan < 50%  (kerapatan < 1.000 ind/ha)
// Nilai slider "Kerapatan Mangrove" (0–100%) dipetakan langsung sebagai
// persentase tutupan pada standar ini — sama seperti Lab Virtual.
function densityKategori(v) {
  if (v < 50) return "Jarang";
  if (v < 75) return "Sedang";
  return "Padat";
}
function densityKriteria(v) {
  return densityKategori(v) === "Jarang" ? "Rusak" : "Baik";
}

/* ================= VISUAL ASSET (sama seperti Lab Virtual) =================
   background.png : latar area visualisasi
   mangrove.png   : satu pohon (diulang dengan posisi berbeda)
   wave-low/medium/high.png : ilustrasi gelombang, di-crossfade mengikuti
                               slider "Tinggi Gelombang".
================================================================ */
const TREE_BASE = 26;

const TREE_SLOTS = [
  { left: 5,  bottom: 52, scale: 0.78, rotate: -2 },
  { left: 14, bottom: 44, scale: 0.92, rotate: 1 },
  { left: 23, bottom: 53, scale: 0.80, rotate: -1 },
  { left: 32, bottom: 43, scale: 1.00, rotate: 2 },
  { left: 41, bottom: 52, scale: 0.82, rotate: -2 },
  { left: 50, bottom: 42, scale: 1.04, rotate: 1 },
  { left: 59, bottom: 53, scale: 0.79, rotate: -1 },
  { left: 68, bottom: 44, scale: 0.94, rotate: 2 },
  { left: 77, bottom: 52, scale: 0.81, rotate: -2 },
  { left: 86, bottom: 42, scale: 0.88, rotate: 1 },
];

function treeCount(density) {
  return Math.round(density / 10);
}

function waveCrossfade(wh) {
  if (wh <= 0.5) {
    const t = wh / 0.5;
    return { low: 1 - t, medium: t, high: 0 };
  }
  const t = (wh - 0.5) / 0.5;
  return { low: 0, medium: 1 - t, high: t };
}

/**
 * Semua hasil diturunkan secara deterministik dari dua parameter
 * (kerapatan mangrove & tinggi gelombang). Tidak ada nilai acak.
 */
function jalankanSimulasi(density, wave) {
  const dLevel = densityKategori(density);
  const wLevel = kategori(wave);

  // Semakin rapat mangrove semakin kuat peredaman; semakin tinggi gelombang
  // semakin berkurang efektivitas peredaman (energi lebih besar).
  const protection = clamp(Math.round(density - wave * 0.5), 0, 100);
  const abrasiScore = clamp(100 - protection, 0, 100);

  const protectionLevel = kategori(protection);
  const abrasiLevel = kategori(abrasiScore);

  const kondisi =
    abrasiLevel === "Rendah" ? "Stabil"
    : abrasiLevel === "Sedang" ? "Cukup Stabil"
    : "Tidak Stabil";
  const kondisiEmoji =
    abrasiLevel === "Rendah" ? "🟢"
    : abrasiLevel === "Sedang" ? "🟡"
    : "🔴";

  // Bahasa hati-hati (hedging) — bukan klaim absolut.
  const peredamanText =
    protectionLevel === "Tinggi"
      ? "Kemampuan peredaman gelombang cenderung tinggi karena vegetasi mangrove cukup rapat, sehingga energi gelombang lebih banyak teredam sebelum mencapai garis pantai."
      : protectionLevel === "Sedang"
      ? "Kemampuan peredaman gelombang tergolong sedang — sebagian energi gelombang dapat diredam, namun belum sepenuhnya tertahan."
      : "Kemampuan peredaman gelombang cenderung rendah karena vegetasi mangrove lebih terbuka, sehingga energi gelombang lebih mudah mencapai pantai.";

  const abrasiText =
    abrasiLevel === "Rendah"
      ? "Risiko abrasi cenderung lebih rendah karena vegetasi mangrove lebih rapat dan energi gelombang lebih teredam."
      : abrasiLevel === "Sedang"
      ? "Risiko abrasi tergolong sedang; perlindungan vegetasi dan kekuatan gelombang relatif seimbang."
      : "Risiko abrasi cenderung lebih tinggi karena perlindungan vegetasi lebih rendah sementara gelombang lebih kuat.";

  const kondisiText =
    kondisi === "Stabil"
      ? "Kondisi pesisir relatif stabil dan terlindungi dari hantaman gelombang."
      : kondisi === "Cukup Stabil"
      ? "Kondisi pesisir cukup stabil, namun dampak gelombang belum sepenuhnya teredam."
      : "Kondisi pesisir tidak stabil dan lebih rentan terhadap erosi dan abrasi.";

  const interpretasi = `Ketika kerapatan mangrove lebih ${dLevel.toLowerCase()} dan tinggi gelombang ${wLevel.toLowerCase()}, vegetasi mangrove ${
    protectionLevel === "Tinggi"
      ? "cenderung memberikan perlindungan yang lebih besar terhadap energi gelombang"
      : protectionLevel === "Sedang"
      ? "cenderung hanya meredam sebagian energi gelombang"
      : "cenderung kurang mampu meredam energi gelombang"
  }. Akibatnya, risiko abrasi cenderung ${abrasiLevel.toLowerCase()} dan kondisi pesisir cenderung ${kondisi.toLowerCase()}.`;

  // Visual perbandingan "sebelum vs setelah" (bukan angka acak, melainkan
  // energi gelombang awal dikurangi kemampuan peredaman).
  const waveBeforeCount = clamp(Math.round((wave / 100) * 6), 1, 6);
  const waveAfterCount = clamp(Math.round(waveBeforeCount * (1 - protection / 100)), 0, 6);
  const mangroveCount = clamp(Math.round((density / 100) * 6), 1, 6);

  return {
    density,
    wave,
    dLevel,
    wLevel,
    protection,
    protectionLevel,
    abrasiScore,
    abrasiLevel,
    kondisi,
    kondisiEmoji,
    peredamanText,
    abrasiText,
    kondisiText,
    interpretasi,
    waveBeforeCount,
    waveAfterCount,
    mangroveCount,
  };
}

/* ================= TONE (untuk warna kartu) ================= */
function tonePeredaman(level) {
  return level === "Tinggi" ? "good" : level === "Sedang" ? "mid" : "bad";
}
function toneAbrasi(level) {
  return level === "Rendah" ? "good" : level === "Sedang" ? "mid" : "bad";
}
function toneKondisi(k) {
  return k === "Stabil" ? "good" : k === "Cukup Stabil" ? "mid" : "bad";
}

/* ================= BACA NILAI TERAKHIR DARI LAB VIRTUAL ================= */
function readLabValue(field, fallback) {
  try {
    const list = JSON.parse(localStorage.getItem("labVirtualExperiments")) || [];
    const last = list[0];
    if (last && typeof last[field] === "number") return last[field];
  } catch {
    /* abaikan */
  }
  return fallback;
}

export default function Simulasi() {
  const navigate = useNavigate();
  const [loggedIn] = useState(() => !!localStorage.getItem("token"));

  // Nilai awal diambil dari eksperimen terakhir Lab Virtual bila tersedia.
  const [density, setDensity] = useState(() => readLabValue("density", 60));
  const [wave, setWave] = useState(() => readLabValue("waveHeight", 40));

  // phase: idle -> running -> done
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const runTimer = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("simulasiHistory");
      setHistory(raw ? JSON.parse(raw) : []);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => () => clearTimeout(runTimer.current), []);

  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
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
  }, [phase, loggedIn]);

  const handleRun = () => {
    if (phase === "running") return;
    setPhase("running");
    setResult(null);

    // Proses simulasi diberi jeda singkat agar animasi "menjalankan" terlihat
    // (hasil TIDAK langsung muncul sebelum proses selesai).
    runTimer.current = setTimeout(() => {
      const r = jalankanSimulasi(density, wave);
      setResult(r);
      setPhase("done");

      const entry = {
        density,
        wave,
        peredaman: r.protectionLevel,
        abrasi: r.abrasiLevel,
        kondisi: r.kondisi,
        waktu: new Date().toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      };
      const next = [entry, ...history].slice(0, 5);
      setHistory(next);
      try {
        localStorage.setItem("simulasiHistory", JSON.stringify(next));
      } catch {
        /* abaikan kalau storage penuh/diblokir */
      }

      requestAnimationFrame(() => {
        document.getElementById("hasil-simulasi")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 1600);
  };

  const handleCobaKondisiLain = () => {
    clearTimeout(runTimer.current);
    setResult(null);
    setPhase("idle");
    requestAnimationFrame(() => {
      document.getElementById("kontrol-simulasi")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // Visualisasi: jumlah pohon mengikuti kerapatan, wave crossfade mengikuti
  // tinggi gelombang — sama seperti Lab Virtual, dan tetap reaktif langsung
  // saat slider digeser (tidak menunggu tombol "Jalankan Simulasi").
  const pohonCount = treeCount(density);
  const wh = wave / 100;
  const waveLayerHeight = 30 + wh * 20;
  const waveMix = waveCrossfade(wh);
  const waveDepths = [
    { className: "wave-copy-back", opacityScale: 0.55 },
    { className: "wave-copy-mid", opacityScale: 0.8 },
    { className: "wave-copy-front", opacityScale: 1 },
  ];

  const chainNodes = result
    ? [
        { icon: "🌱", label: "Kerapatan Mangrove", value: `${result.density}% (${result.dLevel})` },
        { icon: "🛡️", label: "Kemampuan Perlindungan", value: result.protectionLevel },
        { icon: "🌊", label: "Dampak Gelombang", value: result.wLevel },
        { icon: "⚠️", label: "Risiko Abrasi", value: result.abrasiLevel },
        { icon: "🏝️", label: "Kondisi Pesisir", value: result.kondisi },
      ]
    : [];

  return (
    <>
      <style>{`
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
        ul{ list-style:none; }
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
        .btn svg{ width:16px; height:16px; flex-shrink:0; }
        .btn-primary{ background:var(--amber); color:var(--canopy); box-shadow:0 12px 24px -10px rgba(232,163,61,0.7); }
        .btn-primary:hover{ transform:translateY(-3px); box-shadow:0 16px 28px -10px rgba(232,163,61,0.85); }
        .btn-primary:disabled{ opacity:0.6; cursor:not-allowed; transform:none !important; box-shadow:none !important; }
        .btn-ghost{ background:var(--tide-pale); color:var(--estuary); }
        .btn-ghost:hover{ transform:translateY(-3px); }

        /* ===== Banner ===== */
        .wave-divider{ position:absolute; left:0; right:0; bottom:-1px; line-height:0; pointer-events:none; z-index:5; }
        .wave-divider svg{ display:block; width:100%; height:80px; }
        .page-banner{
          position:relative;
          min-height:62vh;
          display:flex; align-items:flex-end;
          background-image:linear-gradient(90deg, rgba(10,22,17,0.86) 0%, rgba(10,22,17,0.62) 40%, rgba(10,22,17,0.3) 75%), url(${heroBg});
          background-size:cover; background-position:center 32%;
          padding:90px 0 120px;
        }
        .page-banner .container{
          margin-left:0;
          max-width:100%;
          padding-left:60px;
        }
        .page-banner h1{
          color:var(--paper); font-size:clamp(2.1rem,4vw,3.1rem); max-width:640px; margin-bottom:18px;
        }
        .page-banner p{
          color:rgba(251,250,245,0.82); max-width:560px; font-size:1.02rem;
        }

        .section{ padding:70px 0; }
        .section-head{ max-width:640px; margin-bottom:36px; }
        .section-head h2{ font-size:clamp(1.6rem,2.6vw,2.1rem); margin-top:12px; }
        .section-head p{ color:#4C5F58; margin-top:12px; }

        /* ===== Auth gate ===== */
        .gate-card{
          max-width:460px; margin:0 auto; text-align:center; background:var(--paper);
          border-radius:var(--radius-lg); padding:48px 36px; box-shadow:0 20px 40px -20px rgba(15,36,29,0.2);
        }
        .gate-icon{
          width:60px; height:60px; margin:0 auto 20px; border-radius:50%;
          background:var(--tide-pale); color:var(--estuary);
          display:flex; align-items:center; justify-content:center;
        }
        .gate-icon svg{ width:28px; height:28px; }
        .gate-card p{ color:#556961; margin:12px 0 26px; }

        /* ===== Kontrol + visualisasi ===== */
        .lab-grid{ display:grid; grid-template-columns:1fr 1fr; gap:36px; align-items:start; }
        .lab-controls{ background:var(--paper); border-radius:var(--radius-lg); padding:32px; box-shadow:0 16px 32px -20px rgba(15,36,29,0.18); }
        .control-block + .control-block{ margin-top:30px; }
        .control-label{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .control-label span:first-child{ font-weight:700; font-size:0.95rem; color:var(--canopy); display:flex; align-items:center; gap:8px; }
        .control-label span:first-child svg{ width:18px; height:18px; color:var(--estuary); }
        .control-value{ font-family:'Fraunces', serif; font-size:1.05rem; font-weight:600; color:var(--estuary); }
        .control-tag{
          font-family:'Space Mono', monospace; font-size:0.7rem; font-weight:700;
          padding:4px 10px; border-radius:999px; background:var(--tide-pale); color:var(--estuary);
        }
        input[type="range"]{
          -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px;
          background:linear-gradient(90deg, var(--estuary) var(--val,50%), var(--tide-pale) var(--val,50%));
          outline:none; cursor:pointer;
        }
        input[type="range"]::-webkit-slider-thumb{
          -webkit-appearance:none; width:22px; height:22px; border-radius:50%;
          background:var(--paper); border:4px solid var(--estuary); cursor:pointer;
          box-shadow:0 4px 10px -2px rgba(15,36,29,0.35);
        }
        input[type="range"]::-moz-range-thumb{
          width:22px; height:22px; border-radius:50%; background:var(--paper);
          border:4px solid var(--estuary); cursor:pointer; box-shadow:0 4px 10px -2px rgba(15,36,29,0.35);
        }
        .control-scale{ display:flex; justify-content:space-between; font-size:0.72rem; color:#7A8A83; margin-top:8px; }
        .run-btn{ width:100%; justify-content:center; margin-top:34px; padding:15px; font-size:0.95rem; }
        .run-hint{ text-align:center; font-size:0.8rem; color:#7A8A83; margin-top:14px; }

        .lab-visual{
          position:relative; border-radius:var(--radius-lg); overflow:hidden;
          background:var(--tide-pale);
          min-height:340px; box-shadow:0 16px 32px -20px rgba(15,36,29,0.3);
        }
        .viz-bg{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:1; }

        /* mangrove.png — pohon muncul satu per satu mengikuti kerapatan. */
        .mangrove-layer{ position:absolute; inset:0; z-index:3; pointer-events:none; }
        .mangrove-tree{
          position:absolute; width:auto; transform-origin:bottom center;
          animation:treeAppear 440ms ease both;
          will-change:opacity, transform;
        }
        @keyframes treeAppear{
          from{ opacity:0; transform:translateY(12px) scale(0.9) rotate(var(--rot, 0deg)); }
          to{ opacity:1; transform:translateY(0) scale(1) rotate(var(--rot, 0deg)); }
        }

        /* wave-low/medium/high.png — tiga salinan bertumpuk + crossfade opacity
           mengikuti slider "Tinggi Gelombang", sama seperti Lab Virtual. */
        .wave-layer{
          position:absolute; left:0; right:0; bottom:0;
          overflow:hidden; z-index:4; pointer-events:none;
          transition:height .35s ease;
        }
        .wave-fallback{
          position:absolute; left:0; right:0; bottom:0; top:35%;
          background:linear-gradient(to bottom, transparent 0%, rgba(45,130,150,0.55) 35%, rgba(18,88,125,0.92) 100%);
        }
        .wave-copy{ position:absolute; left:0; right:0; top:-10%; bottom:-16%; }
        .wave-copy-back{ transform:translateY(-16%); }
        .wave-copy-mid{ transform:translateY(-7%); }
        .wave-copy-front{ transform:translateY(0); }
        .wave-img{
          position:absolute; left:50%; bottom:0; width:128%; height:100%;
          object-fit:cover; object-position:center 82%;
          transform:translateX(-50%);
          transition:opacity .5s ease;
          animation:waveFlow 10s ease-in-out infinite;
          will-change:opacity, transform;
        }
        .wave-copy-back .wave-img{ animation-name:waveFlowReverse; }
        .wave-copy-front .wave-img{ animation-duration:6.5s; }
        .wave-img.wave-medium{ animation-duration:9.5s; animation-delay:-3s; }
        .wave-img.wave-high{ animation-duration:6.8s; animation-delay:-1.5s; }
        .lab-visual.running .wave-img{ animation-duration:3.2s; }
        @keyframes waveFlow{
          0%{ transform:translateX(-55%) translateY(0); }
          50%{ transform:translateX(-45%) translateY(-1.8%); }
          100%{ transform:translateX(-55%) translateY(0); }
        }
        @keyframes waveFlowReverse{
          0%{ transform:translateX(-45%) translateY(0); }
          50%{ transform:translateX(-55%) translateY(-1.8%); }
          100%{ transform:translateX(-45%) translateY(0); }
        }

        .lab-visual-caption{
          position:absolute; bottom:14px; left:0; right:0; text-align:center; z-index:5;
          font-family:'Space Mono', monospace; font-size:0.72rem; color:rgba(255,255,255,0.9);
          text-shadow:0 1px 3px rgba(0,0,0,0.45);
        }

        .visual-overlay{
          position:absolute; inset:0; display:flex; flex-direction:column; gap:14px;
          align-items:center; justify-content:center; background:rgba(15,36,29,0.4);
          color:var(--paper); font-weight:700; font-size:0.92rem; z-index:2; backdrop-filter:blur(2px);
        }
        .spinner{ width:32px; height:32px; border-radius:50%; border:3px solid rgba(251,250,245,0.35); border-top-color:var(--amber); animation:spin .8s linear infinite; }
        @keyframes spin{ to{ transform:rotate(360deg); } }

        /* ===== Hasil simulasi ===== */
        .hasil-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
        .hasil-card{
          background:var(--paper); border-radius:var(--radius-md); padding:26px 22px;
          box-shadow:0 12px 26px -18px rgba(15,36,29,0.2); text-align:center;
          display:flex; flex-direction:column;
        }
        .hasil-icon{
          width:48px; height:48px; margin:0 auto 14px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
        }
        .hasil-icon svg{ width:22px; height:22px; }
        .hasil-card.good .hasil-icon{ background:#E4EFE7; color:var(--estuary); }
        .hasil-card.mid .hasil-icon{ background:#FBEEDA; color:var(--amber-deep); }
        .hasil-card.bad .hasil-icon{ background:#F8E4E7; color:var(--danger); }
        .hasil-card h4{ font-size:0.8rem; color:#7A8A83; font-weight:600; text-transform:uppercase; letter-spacing:0.03em; margin-bottom:8px; }
        .hasil-value{ font-family:'Fraunces', serif; font-size:1.45rem; font-weight:600; margin-bottom:6px; }
        .hasil-card.good .hasil-value{ color:var(--estuary); }
        .hasil-card.mid .hasil-value{ color:var(--amber-deep); }
        .hasil-card.bad .hasil-value{ color:var(--danger); }
        .hasil-text{ font-size:0.82rem; color:#556961; margin-top:auto; line-height:1.5; }

        .indicator-track{ height:9px; border-radius:99px; background:var(--sand-deep); overflow:hidden; margin:6px 0 14px; }
        .indicator-fill{ height:100%; border-radius:99px; background:var(--estuary); transition:width .6s ease; }

        .kondisi-visual{ display:flex; flex-direction:column; align-items:center; gap:8px; margin:4px 0 14px; }
        .tree-row{ display:flex; gap:4px; font-size:1.25rem; }
        .kondisi-flow{ font-size:1rem; letter-spacing:2px; color:var(--canopy); }

        /* ===== Perbandingan sebelum/setelah ===== */
        .compare-grid{ display:grid; grid-template-columns:1fr 1fr; gap:22px; }
        .compare-panel{ background:var(--paper); border-radius:var(--radius-md); padding:26px 22px; text-align:center; box-shadow:0 12px 26px -18px rgba(15,36,29,0.18); }
        .compare-panel h4{ font-size:0.78rem; text-transform:uppercase; letter-spacing:0.06em; color:#7A8A83; margin-bottom:14px; }
        .compare-layers{ display:flex; flex-direction:column; align-items:center; gap:8px; font-size:1.35rem; line-height:1.4; }
        .compare-layers .waves{ font-size:1.5rem; letter-spacing:2px; }
        .compare-layers .mangrove{ letter-spacing:4px; }
        .compare-note{ font-size:0.76rem; color:#7A8A83; margin-top:10px; }

        /* ===== Interpretasi ===== */
        .interpretasi-wrap{ display:grid; grid-template-columns:1fr 1.3fr; gap:28px; align-items:stretch; }
        .chain-panel{ background:var(--paper); border-radius:var(--radius-lg); padding:28px 24px; box-shadow:0 16px 32px -20px rgba(15,36,29,0.18); }
        .chain-panel h4{ font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; color:#7A8A83; margin-bottom:18px; text-align:center; }
        .chain{ display:flex; flex-direction:column; align-items:center; }
        .chain-node{
          background:var(--tide-pale); border-radius:12px; padding:10px 18px;
          display:flex; align-items:center; gap:12px; min-width:230px;
        }
        .chain-node .c-icon{ font-size:1.15rem; }
        .chain-node .c-label{ font-size:0.78rem; color:#4C5F58; }
        .chain-node .c-value{ font-weight:700; font-size:0.88rem; color:var(--canopy); }
        .chain-arrow{ color:var(--estuary); font-size:1.15rem; line-height:1; margin:4px 0; }
        .interpretasi-box{
          background:var(--tide-pale); border-radius:var(--radius-md); padding:26px 28px;
          font-size:0.95rem; color:#243D33; line-height:1.7; display:flex; flex-direction:column; justify-content:center;
        }
        .interpretasi-box strong{ color:var(--canopy); }

        /* ===== Grafik ===== */
        .grafik-box{ background:var(--paper); border-radius:var(--radius-lg); padding:32px; box-shadow:0 16px 32px -20px rgba(15,36,29,0.18); }
        .grafik-row{ margin-bottom:22px; }
        .grafik-row:last-child{ margin-bottom:0; }
        .grafik-label{ display:flex; justify-content:space-between; font-size:0.88rem; font-weight:700; color:var(--canopy); margin-bottom:8px; }
        .grafik-bar-bg{ height:14px; border-radius:99px; background:var(--sand-deep); overflow:hidden; }
        .grafik-bar-fill{ height:100%; border-radius:99px; transition:width .6s ease; }

        /* ===== Note box (Amati dan Bandingkan) ===== */
        .note-box{ background:var(--tide-pale); border-left:4px solid var(--amber); border-radius:var(--radius-md); padding:26px 28px; }
        .note-box h3{ font-size:1.1rem; margin-bottom:6px; }
        .note-box .note-list{ margin-top:14px; display:flex; flex-direction:column; gap:10px; }
        .note-box .note-item{ font-size:0.92rem; color:#243D33; display:flex; gap:10px; }
        .note-box .note-item span{ color:var(--estuary); font-weight:700; }

        /* ===== Riwayat ===== */
        .riwayat-list{ display:flex; flex-direction:column; gap:10px; }
        .riwayat-item{
          display:flex; align-items:center; justify-content:space-between; gap:12px;
          background:var(--paper); border-radius:14px; padding:14px 18px;
          box-shadow:0 8px 18px -14px rgba(15,36,29,0.2); font-size:0.86rem;
        }
        .riwayat-item .r-meta{ color:#7A8A83; font-size:0.76rem; }
        .riwayat-tag{
          font-family:'Space Mono', monospace; font-size:0.7rem; font-weight:700; padding:4px 10px; border-radius:999px;
        }
        .riwayat-tag.good{ background:#E4EFE7; color:var(--estuary); }
        .riwayat-tag.mid{ background:#FBEEDA; color:var(--amber-deep); }
        .riwayat-tag.bad{ background:#F8E4E7; color:var(--danger); }

        /* ===== CTA ===== */
        .cta-box{
          background:var(--canopy); border-radius:var(--radius-lg); padding:44px 40px;
          display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap;
        }
        .cta-box h3{ color:var(--paper); font-size:1.3rem; margin-bottom:6px; }
        .cta-box p{ color:rgba(251,250,245,0.75); font-size:0.92rem; }

        @media (max-width:900px){
          .lab-grid{ grid-template-columns:1fr; }
          .hasil-grid{ grid-template-columns:1fr; }
          .compare-grid{ grid-template-columns:1fr; }
          .interpretasi-wrap{ grid-template-columns:1fr; }
          .page-banner{ min-height:50vh; }
        }
      `}</style>

      <Navbar />

      {/* ================= BANNER ================= */}
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Simulasi Pesisir</span>
          <h1 className="reveal">Simulasi Ekosistem Mangrove</h1>
          <p className="reveal">
            Jalankan simulasi dan amati hubungan antara kerapatan mangrove, tinggi gelombang, perlindungan pesisir, dan risiko abrasi.
          </p>
        </div>
        <WaveDividerLocal fill="var(--sand)" />
      </section>

      {!loggedIn ? (
        /* ================= AUTH GATE ================= */
        <section className="section">
          <div className="container">
            <div className="gate-card reveal">
              <div className="gate-icon"><LockIcon /></div>
              <h3>Masuk Terlebih Dahulu</h3>
              <p>Kamu perlu login untuk menjalankan simulasi dan menyimpan riwayat percobaanmu.</p>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate("/login")}>
                Login Sekarang
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* ================= KONTROL + VISUALISASI ================= */}
          <section className="section" id="kontrol-simulasi">
            <div className="container">
              <div className="section-head reveal">
                <span className="eyebrow">Variabel Simulasi</span>
                <h2>Atur Kondisi Pesisir</h2>
                <p>Tentukan kerapatan mangrove dan tinggi gelombang, lalu jalankan simulasi untuk melihat hubungan sebab-akibatnya.</p>
              </div>

              <div className="lab-grid">
                <div className="lab-controls reveal">
                  <div className="control-block">
                    <div className="control-label">
                      <span><LeafIcon /> Kerapatan Mangrove</span>
                      <span className="control-tag">{densityKategori(density)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={density}
                      onChange={(e) => setDensity(Number(e.target.value))}
                      style={{ "--val": `${density}%` }}
                    />
                    <div className="control-scale"><span>0%</span><span>Nilai: {density}%</span><span>100%</span></div>
                  </div>

                  <div className="control-block">
                    <div className="control-label">
                      <span><WaveIcon /> Tinggi Gelombang</span>
                      <span className="control-tag">{kategori(wave)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={wave}
                      onChange={(e) => setWave(Number(e.target.value))}
                      style={{ "--val": `${wave}%` }}
                    />
                    <div className="control-scale"><span>0%</span><span>Nilai: {wave}%</span><span>100%</span></div>
                  </div>

                  <button className="btn btn-primary run-btn" onClick={handleRun} disabled={phase === "running"}>
                    {phase === "running" ? (
                      <>
                        <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: "var(--canopy)", borderColor: "rgba(15,36,29,0.25)" }} />
                        Menjalankan simulasi…
                      </>
                    ) : (
                      <>
                        <PlayIcon /> Jalankan Simulasi
                      </>
                    )}
                  </button>
                  {phase === "idle" && <p className="run-hint">Atur kondisi simulasi lalu tekan Jalankan Simulasi.</p>}
                </div>

                <div className={`lab-visual reveal ${phase === "running" ? "running" : ""}`}>
                  {/* background.png — latar area visualisasi */}
                  <img src={backgroundImg} className="viz-bg" alt="" />

                  {/* mangrove.png — muncul satu per satu mengikuti kerapatan, live saat slider digeser */}
                  <div className="mangrove-layer">
                    {TREE_SLOTS.slice(0, pohonCount).map((slot, i) => (
                      <img
                        key={i}
                        src={mangroveImg}
                        className="mangrove-tree"
                        alt=""
                        style={{
                          left: `${slot.left}%`,
                          bottom: `${slot.bottom}%`,
                          height: `${(TREE_BASE * slot.scale).toFixed(1)}%`,
                          "--rot": `${slot.rotate}deg`,
                          animationDelay: `${i * 70}ms`,
                        }}
                      />
                    ))}
                  </div>

                  {/* wave-low/medium/high.png — crossfade mengikuti slider "Tinggi Gelombang" */}
                  <div className="wave-layer" style={{ height: `${waveLayerHeight}%` }}>
                    <div className="wave-fallback" />
                    {waveDepths.map((depth) => (
                      <div key={depth.className} className={`wave-copy ${depth.className}`}>
                        <img src={waveLowImg} className="wave-img wave-low" alt="" style={{ opacity: waveMix.low * depth.opacityScale }} />
                        <img src={waveMediumImg} className="wave-img wave-medium" alt="" style={{ opacity: waveMix.medium * depth.opacityScale }} />
                        <img src={waveHighImg} className="wave-img wave-high" alt="" style={{ opacity: waveMix.high * depth.opacityScale }} />
                      </div>
                    ))}
                  </div>

                  <div className="lab-visual-caption">
                    {pohonCount}/10 rumpun mangrove &middot; gelombang {kategori(wave).toLowerCase()}
                  </div>

                  {phase === "running" && (
                    <div className="visual-overlay">
                      <span className="spinner" />
                      <span>🔬 Menjalankan simulasi…</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ================= HASIL SIMULASI ================= */}
          {phase === "done" && result && (
            <section className="section" id="hasil-simulasi" style={{ background: "var(--sand-deep)" }}>
              <div className="container">
                <div className="section-head reveal">
                  <span className="eyebrow">📊 Hasil Simulasi</span>
                  <h2>Hasil Simulasi</h2>
                  <p>Berdasarkan kombinasi kerapatan mangrove {result.density}% dan tinggi gelombang {result.wave}% yang kamu jalankan.</p>
                </div>

                <div className="hasil-grid">
                  <div className={`hasil-card reveal ${tonePeredaman(result.protectionLevel)}`}>
                    <div className="hasil-icon"><ShieldIcon /></div>
                    <h4>Kemampuan Peredaman Gelombang</h4>
                    <div className="hasil-value">{result.protectionLevel}</div>
                    <div className="indicator-track">
                      <div className="indicator-fill" style={{ width: `${result.protection}%` }} />
                    </div>
                    <p className="hasil-text">{result.peredamanText}</p>
                  </div>

                  <div className={`hasil-card reveal ${toneAbrasi(result.abrasiLevel)}`} style={{ transitionDelay: "80ms" }}>
                    <div className="hasil-icon"><WaveIcon /></div>
                    <h4>Risiko Abrasi</h4>
                    <div className="hasil-value">{result.abrasiLevel}</div>
                    <div className="indicator-track">
                      <div className="indicator-fill" style={{ width: `${result.abrasiScore}%`, background: "var(--danger)" }} />
                    </div>
                    <p className="hasil-text">{result.abrasiText}</p>
                  </div>

                  <div className={`hasil-card reveal ${toneKondisi(result.kondisi)}`} style={{ transitionDelay: "160ms" }}>
                    <div className="hasil-icon"><AnchorIcon /></div>
                    <h4>Kondisi Pesisir</h4>
                    <div className="hasil-value">{result.kondisiEmoji} {result.kondisi}</div>
                    <div className="kondisi-visual">
                      <div className="tree-row">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <span key={i} style={{ opacity: i < result.mangroveCount ? 1 : 0.15 }}>🌱</span>
                        ))}
                      </div>
                      <div className="kondisi-flow">
                        {Array.from({ length: result.waveAfterCount }).map((_, i) => <span key={i}>🌊</span>)} → 🛡️ → 🏝️
                      </div>
                    </div>
                    <p className="hasil-text">{result.kondisiText}</p>
                  </div>
                </div>

                <div style={{ textAlign: "center", marginTop: 28 }}>
                  <button className="btn btn-ghost" onClick={handleCobaKondisiLain}>
                    <RefreshIcon /> Coba Kondisi Lain
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ================= PERBANDINGAN SEBELUM/SETELAH ================= */}
          {phase === "done" && result && (
            <section className="section">
              <div className="container">
                <div className="section-head reveal">
                  <span className="eyebrow">Perbandingan</span>
                  <h2>Sebelum &amp; Setelah Gelombang</h2>
                  <p>Amati perubahan energi gelombang saat melewati vegetasi mangrove.</p>
                </div>
                <div className="compare-grid">
                  <div className="compare-panel reveal">
                    <h4>Sebelum Gelombang</h4>
                    <div className="compare-layers">
                      <span className="waves">{"🌊".repeat(result.waveBeforeCount)}</span>
                      <span className="mangrove">{"🌱".repeat(result.mangroveCount)}</span>
                      <span>🏝️</span>
                    </div>
                    <p className="compare-note">Energi gelombang awal: {result.wave}%</p>
                  </div>
                  <div className="compare-panel reveal" style={{ transitionDelay: "80ms" }}>
                    <h4>Setelah Gelombang</h4>
                    <div className="compare-layers">
                      <span className="waves">{"🌊".repeat(result.waveAfterCount) || "·"}</span>
                      <span className="mangrove">{"🌱".repeat(result.mangroveCount)}</span>
                      <span>🏝️</span>
                    </div>
                    <p className="compare-note">Energi gelombang tersisa: {Math.round(result.waveBeforeCount === 0 ? 0 : (result.waveAfterCount / result.waveBeforeCount) * 100)}% dari awal</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= INTERPRETASI ================= */}
          {phase === "done" && result && (
            <section className="section" style={{ background: "var(--sand-deep)" }}>
              <div className="container">
                <div className="section-head reveal">
                  <span className="eyebrow">🔗 Interpretasi</span>
                  <h2>Hubungan Sebab-Akibat</h2>
                  <p>Rantai sebab-akibat yang menghubungkan kondisi mangrove hingga kondisi pesisir.</p>
                </div>

                <div className="interpretasi-wrap">
                  <div className="chain-panel reveal">
                    <h4>Rantai Sebab-Akibat</h4>
                    <div className="chain">
                      {chainNodes.map((n, i) => (
                        <React.Fragment key={n.label}>
                          {i > 0 && <span className="chain-arrow">↓</span>}
                          <div className="chain-node">
                            <span className="c-icon">{n.icon}</span>
                            <div>
                              <div className="c-label">{n.label}</div>
                              <div className="c-value">{n.value}</div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="interpretasi-box reveal">
                    <strong>Interpretasi: </strong>{result.interpretasi}
                    <p style={{ marginTop: 14, fontSize: "0.88rem", color: "#3A554B" }}>
                      Secara umum, ketika kerapatan mangrove lebih tinggi, vegetasi dapat memberikan
                      perlindungan yang lebih besar terhadap energi gelombang. Sebaliknya, ketika mangrove
                      berkurang dan gelombang tinggi, wilayah pesisir menjadi lebih rentan.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= GRAFIK ================= */}
          {phase === "done" && result && (
            <section className="section">
              <div className="container">
                <div className="section-head reveal">
                  <span className="eyebrow">Grafik</span>
                  <h2>Skor Hasil Simulasi</h2>
                  <p>Perbandingan nilai dari kombinasi kondisi yang kamu jalankan.</p>
                </div>

                <div className="grafik-box reveal">
                  <div className="grafik-row">
                    <div className="grafik-label"><span>Kerapatan Mangrove</span><span>{result.density}%</span></div>
                    <div className="grafik-bar-bg"><div className="grafik-bar-fill" style={{ width: `${result.density}%`, background: "var(--estuary)" }} /></div>
                  </div>
                  <div className="grafik-row">
                    <div className="grafik-label"><span>Kemampuan Peredaman Gelombang</span><span>{result.protection}%</span></div>
                    <div className="grafik-bar-bg"><div className="grafik-bar-fill" style={{ width: `${result.protection}%`, background: "var(--amber)" }} /></div>
                  </div>
                  <div className="grafik-row">
                    <div className="grafik-label"><span>Skor Risiko Abrasi</span><span>{result.abrasiScore}%</span></div>
                    <div className="grafik-bar-bg"><div className="grafik-bar-fill" style={{ width: `${result.abrasiScore}%`, background: "var(--danger)" }} /></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= CATATAN PEMBELAJARAN ================= */}
          {phase === "done" && result && (
            <section className="section" style={{ paddingTop: 0 }}>
              <div className="container">
                <div className="note-box reveal">
                  <h3>💡 Amati dan Bandingkan</h3>
                  <p style={{ color: "#4C5F58", fontSize: "0.9rem" }}>Gunakan tombol “Coba Kondisi Lain” lalu jawab pertanyaan berikut melalui pengamatanmu.</p>
                  <div className="note-list">
                    <div className="note-item"><span>1.</span> Bagaimana hasil simulasi berubah ketika kerapatan mangrove dikurangi?</div>
                    <div className="note-item"><span>2.</span> Bagaimana hasil simulasi berubah ketika tinggi gelombang dinaikkan?</div>
                    <div className="note-item"><span>3.</span> Apa hubungan antara kerapatan mangrove, gelombang, dan risiko abrasi?</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= RIWAYAT PERCOBAAN ================= */}
          {phase === "done" && history.length > 0 && (
            <section className="section" style={{ background: "var(--sand-deep)" }}>
              <div className="container">
                <div className="section-head reveal">
                  <span className="eyebrow"><HistoryIcon /> Riwayat</span>
                  <h2>Percobaan Terakhir</h2>
                  <p>5 percobaan terbaru yang kamu jalankan, tersimpan di perangkat ini.</p>
                </div>
                <div className="riwayat-list reveal">
                  {history.map((h, i) => (
                    <div className="riwayat-item" key={i}>
                      <div>
                        <div>Kerapatan {h.density}% &middot; Gelombang {h.wave}%</div>
                        <div className="r-meta">{h.waktu}</div>
                      </div>
                      <span className={`riwayat-tag ${h.abrasi === "Rendah" ? "good" : h.abrasi === "Sedang" ? "mid" : "bad"}`}>
                        Abrasi {h.abrasi}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ================= CTA ================= */}
          {phase === "done" && result && (
            <section className="section" style={{ paddingTop: history.length > 0 ? 0 : undefined }}>
              <div className="container">
                <div className="cta-box reveal">
                  <div>
                    <h3>Sudah paham hubungan sebab-akibatnya?</h3>
                    <p>Uji pemahamanmu lewat Kuis Berpikir Kausal.</p>
                  </div>
                  <Link to="/kuis" className="btn btn-primary">Ke Kuis <ArrowIcon /></Link>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </>
  );
}

// Wave divider lokal — identik dengan komponen di Materi.jsx supaya bentuk
// gelombang di bawah hero sama persis dengan halaman Materi.
function WaveDividerLocal({ fill, flip = false }) {
  return (
    <div className="wave-divider" aria-hidden="true">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={flip ? { transform: "scaleY(-1)" } : undefined}
      >
        <path
          d="M0,32 C150,85 330,95 480,55 C650,10 820,0 1000,38 C1080,56 1150,50 1200,40 L1200,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}