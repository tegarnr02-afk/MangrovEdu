import React, { useState, useRef, useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import heroBg from "./konservasi-mangrove-sehat.png";

/* ================= UTIL =================
   PRNG sederhana berbasis seed supaya posisi pohon stabil antar-render
   (tidak "meloncat" random tiap kali komponen re-render). */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* ================================================================
   LAYER KANVAS: GELOMBANG AIR
   ----------------------------------------------------------------
   Digambar ulang tiap frame (bukan CSS statis) memakai kombinasi
   beberapa gelombang sinus dengan fase berbeda. Amplitudo & kecepatan
   mengikuti slider "tinggi gelombang".
================================================================ */
function WaveCanvas({ waveHeight }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);
  const waveHeightRef = useRef(waveHeight);
  waveHeightRef.current = waveHeight;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, dpr;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawWaveLayer = (baseY, amp, speed, freq, color, phase) => {
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 6) {
        const y =
          baseY +
          Math.sin(x * freq + tRef.current * speed + phase) * amp +
          Math.sin(x * freq * 2.3 + tRef.current * speed * 1.6 + phase) * (amp * 0.35);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    const drawFoam = (baseY, amp, speed, freq, phase) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const y =
          baseY +
          Math.sin(x * freq + tRef.current * speed + phase) * amp +
          Math.sin(x * freq * 2.3 + tRef.current * speed * 1.6 + phase) * (amp * 0.35);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(241,244,236,0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const wh = waveHeightRef.current / 100; // 0..1

      // amplitudo & kecepatan naik seiring slider "tinggi gelombang"
      const amp1 = 6 + wh * 26;
      const amp2 = 4 + wh * 18;
      const amp3 = 3 + wh * 12;
      const speed = 0.018 + wh * 0.05;

      const baseY = height * 0.34;

      drawWaveLayer(baseY, amp1, speed * 0.8, 0.012, "rgba(137,174,158,0.55)", 0);
      drawWaveLayer(baseY + height * 0.16, amp2, speed, 0.016, "rgba(61,110,82,0.7)", 1.4);
      drawWaveLayer(baseY + height * 0.34, amp3, speed * 1.2, 0.02, "rgba(30,69,49,0.9)", 2.6);
      drawFoam(baseY, amp1, speed * 0.8, 0.012, 0);

      tRef.current += 1;
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="wave-canvas" />;
}

/* ================================================================
   LAYER CSS: HUTAN MANGROVE
   ----------------------------------------------------------------
   Bukan satu bentuk SVG yang di-scale, tapi "populasi" pohon yang
   jumlahnya benar-benar bertambah/berkurang mengikuti slider
   kerapatan — dari kolam posisi acak yang stabil (seeded).
================================================================ */
const TREE_POOL_SIZE = 46;
function generateTreePool() {
  const rand = seededRandom(42);
  const pool = [];
  for (let i = 0; i < TREE_POOL_SIZE; i++) {
    pool.push({
      left: rand() * 96 + 2,
      bottom: rand() * 28,
      scale: 0.5 + rand() * 0.85,
      hue: rand() > 0.5 ? "a" : "b",
      sway: 3.5 + rand() * 2.5,
      delay: rand() * -6,
    });
  }
  // urutkan dari "belakang/kecil" ke "depan/besar" supaya saat kerapatan
  // ditambah, pohon baru yang muncul terasa alami.
  return pool.sort((a, b) => a.bottom - b.bottom);
}

function MangroveForest({ density }) {
  const pool = useMemo(generateTreePool, []);
  const visibleCount = Math.round((density / 100) * pool.length);

  return (
    <div className="forest-layer">
      {pool.slice(0, visibleCount).map((t, i) => (
        <div
          key={i}
          className={`tree-blob tree-blob-${t.hue}`}
          style={{
            left: `${t.left}%`,
            bottom: `${t.bottom}%`,
            "--s": t.scale,
            animationDuration: `${t.sway}s`,
            animationDelay: `${t.delay}s`,
          }}
        >
          <div className="tree-canopy" />
          <div className="tree-trunk" />
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   LOGIKA KATEGORI & HASIL PENGAMATAN
================================================================ */
// 0–33% Rendah, 34–66% Sedang, 67–100% Tinggi (kedua slider sama).
function kategori(v) {
  if (v <= 33) return "Rendah";
  if (v <= 66) return "Sedang";
  return "Tinggi";
}

function protectionLabel(density) {
  const k = kategori(density);
  if (k === "Tinggi") return "Kuat";
  if (k === "Sedang") return "Cukup";
  return "Lemah";
}

// Deskripsi hasil pengamatan. Sengaja memakai bahasa yang tidak absolut:
// "menunjukkan", "cenderung", "dapat", "lebih rentan".
function computeObservation(density, waveHeight) {
  const d = kategori(density);
  const w = kategori(waveHeight);
  const dLow = d === "Rendah";
  const dHigh = d === "Tinggi";
  const wLow = w === "Rendah";
  const wHigh = w === "Tinggi";

  if (dHigh && wLow) {
    return "Vegetasi mangrove yang rapat dan gelombang yang relatif rendah menunjukkan kondisi perlindungan pesisir yang cenderung lebih baik.";
  }
  if (dLow && wHigh) {
    return "Vegetasi mangrove yang jarang dan gelombang yang tinggi menunjukkan kondisi yang lebih rentan terhadap energi gelombang.";
  }
  if (dHigh && wHigh) {
    return "Meski vegetasi mangrove rapat, gelombang yang tinggi dapat menimbulkan tekanan yang lebih besar. Perlindungan pesisir cenderung tetap terjaga, tetapi perlu pengamatan lebih lanjut.";
  }
  if (dLow && wLow) {
    return "Vegetasi mangrove yang jarang dengan gelombang rendah menunjukkan perlindungan pesisir yang masih memadai, namun lebih rentan apabila gelombang meningkat.";
  }
  if (dHigh) {
    return "Vegetasi mangrove yang rapat cenderung dapat meredam energi gelombang sedang, sehingga perlindungan pesisir tetap cukup baik.";
  }
  if (dLow) {
    return "Vegetasi mangrove yang jarang menunjukkan perlindungan pesisir yang lebih terbatas dan cenderung lebih rentan terhadap energi gelombang.";
  }
  if (wHigh) {
    return "Gelombang yang tinggi dapat menimbulkan tekanan yang lebih besar, sehingga kondisi perlindungan pesisir cenderung perlu diperhatikan.";
  }
  if (wLow) {
    return "Gelombang yang rendah menunjukkan tekanan yang relatif kecil terhadap pesisir, sehingga kondisi perlindungan cenderung cukup baik.";
  }
  return "Vegetasi mangrove dengan kerapatan sedang dan gelombang sedang menunjukkan perlindungan pesisir yang cukup seimbang, namun dapat lebih rentan saat gelombang meningkat.";
}

// tone untuk pewarnaan indikator diagram & badge: good(green)/mid(amber)/bad(red)
function toneOfLevel(level, goodWhenHigh) {
  if (level === "Tinggi") return goodWhenHigh ? "good" : "bad";
  if (level === "Sedang") return "mid";
  return goodWhenHigh ? "bad" : "good";
}

/* ================= NODE DIAGRAM SEBAB-AKIBAT ================= */
function CausalNode({ icon, label, value, note, fill, tone }) {
  return (
    <div className={`causal-node tone-${tone}`}>
      <div className="causal-icon">{icon}</div>
      <div className="causal-body">
        <span className="causal-label">{label}</span>
        <div className="causal-bar">
          <div className="causal-fill" style={{ width: `${fill}%` }} />
        </div>
        <div className="causal-meta">
          <b>{value}</b>
          <span>{note}</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   HALAMAN UTAMA
================================================================ */
export default function LabVirtual() {
  const [density, setDensity] = useState(60);
  const [waveHeight, setWaveHeight] = useState(40);
  const [experimentCount, setExperimentCount] = useState(() => {
    try {
      return (JSON.parse(localStorage.getItem("labVirtualExperiments")) || []).length;
    } catch {
      return 0;
    }
  });

  const DEFAULT_DENSITY = 60;
  const DEFAULT_WAVE = 40;

  const densityK = kategori(density);
  const waveK = kategori(waveHeight);
  const protection = protectionLabel(density);
  const protectionTone = protection === "Kuat" ? "good" : protection === "Cukup" ? "mid" : "bad";
  // Risiko abrasi naik seiring tinggi gelombang, turun seiring kerapatan mangrove.
  const abrasionScore = Math.round(Math.max(0, Math.min(100, waveHeight - density * 0.5)));
  const abrasionK = kategori(abrasionScore);
  const observation = computeObservation(density, waveHeight);

  const handleReset = () => {
    setDensity(DEFAULT_DENSITY);
    setWaveHeight(DEFAULT_WAVE);
  };

  // "🔬 Coba Kondisi Lain": catat eksperimen saat ini (kerapatan, gelombang,
  // waktu) ke localStorage — pola yang sama dipakai Simulasi.jsx — lalu geser
  // ke kombinasi lain agar siswa tidak hanya mengamati satu kondisi.
  const handleTryOther = () => {
    try {
      const raw = localStorage.getItem("labVirtualExperiments");
      const list = raw ? JSON.parse(raw) : [];
      const next = [
        { density, waveHeight, waktu: new Date().toISOString() },
        ...list,
      ].slice(0, 20);
      localStorage.setItem("labVirtualExperiments", JSON.stringify(next));
      setExperimentCount(next.length);
    } catch {
      /* abaikan kalau storage penuh/diblokir */
    }

    const presets = [
      [85, 20],
      [20, 85],
      [90, 90],
      [20, 20],
      [55, 55],
    ];
    const next = presets.find((p) => Math.abs(p[0] - density) > 15 || Math.abs(p[1] - waveHeight) > 15) || presets[0];
    setDensity(next[0]);
    setWaveHeight(next[1]);
  };

  // Animasi reveal saat elemen masuk viewport — pola yang sama dengan
  // halaman lain (Materi, Dasbor, Simulasi).
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
  }, []);

  return (
    <>
      <style>{`
        :root{
          --canopy:#0F241D; --estuary:#2F6B57; --tide:#89AE9E; --tide-pale:#E1EAE2;
          --sand:#F1F4EC; --sand-deep:#E7EDDF; --silt:#A9784F; --amber:#E8A33D; --amber-deep:#CE8324;
          --ink:#12261F; --paper:#FBFAF5; --danger:#C24A5F;
          --shadow: 0 20px 40px -20px rgba(15,36,29,0.35);
          --radius-lg: 28px; --radius-md: 18px;
        }
        *{box-sizing:border-box; margin:0; padding:0;}
        body{ font-family:'Plus Jakarta Sans', sans-serif; background:var(--sand); color:var(--ink); line-height:1.6; }
        h1,h2,h3,h4{ font-family:'Fraunces', serif; font-weight:600; color:var(--canopy); line-height:1.15; letter-spacing:-0.01em; }
        a{ text-decoration:none; color:inherit; }
        .container{ max-width:1120px; margin:0 auto; padding:0 32px; }
        .eyebrow{ font-family:'Space Mono', monospace; text-transform:uppercase; letter-spacing:0.14em; font-size:0.72rem; color:var(--estuary); font-weight:700; display:inline-flex; align-items:center; gap:8px; }
        .reveal{ opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s ease; }
        .reveal.show{ opacity:1; transform:translateY(0); }

        .btn{ display:inline-flex; align-items:center; gap:8px; padding:13px 26px; border-radius:999px; font-weight:700; font-size:0.92rem; cursor:pointer; border:none; transition:transform .25s ease, box-shadow .25s ease, background .25s ease; font-family:'Plus Jakarta Sans', sans-serif; }
        .btn-primary{ background:var(--amber); color:var(--canopy); box-shadow:0 12px 24px -10px rgba(232,163,61,0.7); }
        .btn-primary:hover{ transform:translateY(-3px); box-shadow:0 16px 30px -10px rgba(232,163,61,0.85); }
        .btn-outline{ background:transparent; color:var(--estuary); border:1.5px solid rgba(47,107,87,0.35); }
        .btn-outline:hover{ background:var(--tide-pale); transform:translateY(-2px); }

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

        .lab-main{ padding:52px 0 90px; }

        /* ===== Grid kontrol + visualisasi ===== */
        .lab-grid{ display:grid; grid-template-columns:1.35fr 0.9fr; gap:30px; align-items:start; }
        .viz-panel{ order:1; }
        .control-panel{ order:2; }

        /* ===== Visualisasi ===== */
        .viz-panel{
          position:relative; border-radius:var(--radius-lg); overflow:hidden;
          height:470px; background:linear-gradient(180deg,#B7E0E6 0%,#D8EEEA 20%,#8FC2B4 49%,#4E9277 100%);
          box-shadow:var(--shadow); border:1px solid rgba(15,36,29,0.06);
        }
        .viz-sun{ position:absolute; top:24px; right:34px; width:52px; height:52px; border-radius:50%; background:#F6D186; box-shadow:0 0 40px 10px rgba(246,209,134,0.55); }
        .viz-readout{
          position:absolute; top:16px; left:16px; z-index:6;
          background:rgba(15,36,29,0.7); color:var(--paper); font-family:'Space Mono', monospace;
          font-size:0.72rem; padding:10px 14px; border-radius:12px; display:flex; flex-direction:column; gap:4px;
        }
        .viz-readout .protect{ font-weight:700; }
        .viz-readout .protect.good{ color:#8FD6A8; }
        .viz-readout .protect.mid{ color:#F4C268; }
        .viz-readout .protect.bad{ color:#F29AAC; }

        /* daratan di belakang mangrove (dengan rumah) */
        .viz-land{
          position:absolute; left:0; right:0; top:15%; height:28%; z-index:1;
          background:linear-gradient(180deg,#8FB46C 0%,#6C9A5A 55%,#5C8A55 100%);
        }
        .viz-houses{
          position:absolute; inset:0; display:flex; align-items:flex-start; justify-content:space-around;
          padding:10px 10% 0; font-size:1.35rem; filter:drop-shadow(0 2px 2px rgba(15,36,29,0.2));
        }
        .viz-houses span{ transform:translateY(-4px); }

        /* garis pantai (pasir) tempat mangrove berakar */
        .viz-sand{
          position:absolute; left:0; right:0; top:44%; height:5%; z-index:3;
          background:linear-gradient(180deg,#E9DCB0 0%,#DCC98F 100%);
        }

        /* hutan mangrove */
        .forest-layer{ position:absolute; left:0; right:0; bottom:56%; height:30%; z-index:2; }
        .tree-blob{
          position:absolute; width:64px; height:78px; transform-origin:50% 100%;
          animation:treeSway ease-in-out infinite;
        }
        @keyframes treeSway{ 0%,100%{ transform:rotate(-2deg) scale(var(--s,1)); } 50%{ transform:rotate(2deg) scale(var(--s,1)); } }
        .tree-trunk{ position:absolute; left:50%; bottom:0; width:6px; height:24px; background:#4A3627; transform:translateX(-50%); border-radius:2px; }
        .tree-canopy{
          position:absolute; left:50%; bottom:16px; width:56px; height:50px; transform:translateX(-50%);
          border-radius:58% 42% 55% 45% / 55% 48% 52% 45%;
          box-shadow:inset -6px -8px 14px rgba(15,36,29,0.25), inset 6px 8px 12px rgba(255,255,255,0.12);
        }
        .tree-blob-a .tree-canopy{ background:radial-gradient(circle at 32% 30%, #3D8267, #1E4531 78%); }
        .tree-blob-b .tree-canopy{ background:radial-gradient(circle at 32% 30%, #4E9573, #2F6B57 78%); }

        /* laut + gelombang */
        .wave-canvas{ position:absolute; left:0; right:0; top:49%; bottom:0; width:100%; height:auto; display:block; z-index:4; }

        /* ===== Panel kontrol ===== */
        .control-panel{ background:var(--paper); border-radius:var(--radius-lg); padding:30px 26px; box-shadow:var(--shadow); border:1px solid rgba(15,36,29,0.06); }
        .control-panel h3{ font-size:1.1rem; margin-bottom:24px; }
        .slider-group{ margin-bottom:26px; }
        .slider-label{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .slider-name{ display:flex; align-items:center; gap:9px; font-size:0.94rem; font-weight:700; color:var(--canopy); }
        .slider-name .ic{ font-size:1.05rem; }
        .slider-right{ display:flex; align-items:center; gap:9px; }
        .slider-value{ font-family:'Space Mono', monospace; color:var(--estuary); background:var(--tide-pale); padding:3px 11px; border-radius:999px; font-size:0.82rem; font-weight:700; }
        .kondisi-badge{ font-size:0.72rem; font-weight:700; padding:3px 11px; border-radius:999px; }
        .kondisi-badge.good{ background:#E1F1E4; color:#2F6B57; }
        .kondisi-badge.mid{ background:#FBEEDA; color:var(--amber-deep); }
        .kondisi-badge.bad{ background:#F8E4E7; color:var(--danger); }

        input[type="range"]{
          -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px;
          background:linear-gradient(90deg, var(--estuary) var(--fill,50%), var(--tide-pale) var(--fill,50%));
          outline:none; cursor:pointer;
        }
        input[type="range"]::-webkit-slider-thumb{
          -webkit-appearance:none; width:22px; height:22px; border-radius:50%;
          background:var(--amber); border:3px solid var(--paper); box-shadow:0 3px 8px rgba(15,36,29,0.3); cursor:pointer;
        }
        input[type="range"]::-moz-range-thumb{
          width:22px; height:22px; border-radius:50%; background:var(--amber); border:3px solid var(--paper);
          box-shadow:0 3px 8px rgba(15,36,29,0.3); cursor:pointer;
        }
        .slider-scale{ display:flex; justify-content:space-between; font-size:0.72rem; color:#8A9A93; margin-top:7px; }

        .control-actions{ display:flex; flex-direction:column; gap:11px; margin-top:6px; }
        .control-actions .btn{ justify-content:center; }
        .experiment-note{ margin-top:14px; font-size:0.78rem; color:#7A8A83; text-align:center; }

        /* ===== Hasil pengamatan ===== */
        .obs-panel{ margin-top:44px; background:var(--paper); border-radius:var(--radius-lg); padding:34px 30px; box-shadow:var(--shadow); border:1px solid rgba(15,36,29,0.06); }
        .obs-panel h2{ font-size:1.45rem; margin-top:10px; }
        .obs-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin:22px 0; }
        .obs-card{ background:var(--sand); border-radius:16px; padding:18px 20px; display:flex; align-items:center; gap:14px; }
        .obs-card .obs-ic{ width:42px; height:42px; border-radius:12px; background:var(--tide-pale); display:flex; align-items:center; justify-content:center; font-size:1.3rem; }
        .obs-card small{ display:block; font-size:0.72rem; color:#7A8A83; }
        .obs-card b{ font-family:'Fraunces', serif; font-size:1.3rem; color:var(--canopy); }
        .obs-card .obs-kondisi{ margin-left:auto; }
        .obs-desc{ font-size:0.95rem; color:#33473F; line-height:1.7; background:var(--tide-pale); border-radius:16px; padding:18px 20px; }

        /* ===== Hubungan sebab-akibat ===== */
        .causal-panel{ margin-top:26px; background:var(--paper); border-radius:var(--radius-lg); padding:34px 30px; box-shadow:var(--shadow); border:1px solid rgba(15,36,29,0.06); }
        .causal-panel h2{ font-size:1.45rem; margin-top:10px; }
        .causal-flow{ display:flex; flex-direction:column; align-items:center; gap:6px; margin-top:24px; max-width:560px; margin-left:auto; margin-right:auto; }
        .causal-node{
          width:100%; display:flex; align-items:center; gap:14px; background:var(--sand);
          border-radius:16px; padding:14px 16px; border:1px solid rgba(15,36,29,0.05);
        }
        .causal-icon{ width:44px; height:44px; border-radius:12px; background:var(--paper); display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0; box-shadow:0 4px 10px -6px rgba(15,36,29,0.3); }
        .causal-body{ flex:1; min-width:0; }
        .causal-label{ display:block; font-size:0.82rem; font-weight:700; color:var(--canopy); margin-bottom:7px; }
        .causal-bar{ height:10px; border-radius:99px; background:var(--sand-deep); overflow:hidden; margin-bottom:7px; }
        .causal-fill{ height:100%; border-radius:99px; transition:width .45s ease; }
        .causal-node.tone-good .causal-fill{ background:var(--estuary); }
        .causal-node.tone-mid .causal-fill{ background:var(--amber); }
        .causal-node.tone-bad .causal-fill{ background:var(--danger); }
        .causal-meta{ display:flex; align-items:baseline; gap:8px; }
        .causal-meta b{ font-family:'Fraunces', serif; font-size:1.02rem; color:var(--canopy); }
        .causal-meta span{ font-size:0.76rem; color:#7A8A83; }
        .causal-arrow{ font-size:1.25rem; color:var(--tide); line-height:1; padding:2px 0; }

        /* ===== Coba amati ===== */
        .note-panel{ margin-top:26px; background:linear-gradient(135deg,#FBEEDA 0%,#F6F0DC 100%); border:1px solid rgba(206,131,36,0.25); border-radius:var(--radius-lg); padding:28px 30px; }
        .note-panel h2{ font-size:1.2rem; margin-bottom:14px; display:flex; align-items:center; gap:9px; }
        .note-list{ list-style:none; display:flex; flex-direction:column; gap:11px; }
        .note-list li{ display:flex; gap:10px; font-size:0.93rem; color:#4C5340; line-height:1.5; }
        .note-list li::before{ content:"•"; color:var(--amber-deep); font-weight:700; }

        @media (max-width:960px){
          .lab-grid{ grid-template-columns:1fr; }
          .viz-panel{ order:2; height:360px; }
          .control-panel{ order:1; }
          .obs-grid{ grid-template-columns:1fr; }
          .page-banner{ min-height:50vh; }
        }
        @media (max-width:600px){
          .container{ padding:0 20px; }
          .viz-panel{ height:300px; }
          .viz-houses{ font-size:1rem; }
        }
      `}</style>

      <Navbar />

      <section className="page-banner">
        <div className="container">
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Laboratorium Virtual</span>
          <h1 className="reveal">Lab Virtual Mangrove</h1>
          <p className="reveal">
            Lakukan eksperimen virtual dengan mengatur kerapatan mangrove dan tinggi gelombang, lalu amati perubahan kondisi pesisir.
          </p>
        </div>
        <WaveDividerLocal fill="var(--sand)" />
      </section>

      <section className="lab-main">
        <div className="container">
          <div className="lab-grid">
            {/* ================= PANEL KONTROL ================= */}
            <div className="control-panel reveal">
              <h3>Atur Variabel</h3>

              <div className="slider-group">
                <div className="slider-label">
                  <span className="slider-name"><span className="ic">🌱</span>Kerapatan Mangrove</span>
                  <span className="slider-right">
                    <span className={`kondisi-badge ${toneOfLevel(densityK, true)}`}>{densityK}</span>
                    <span className="slider-value">{density}%</span>
                  </span>
                </div>
                <input
                  type="range" min="0" max="100" value={density}
                  style={{ "--fill": `${density}%` }}
                  onChange={(e) => setDensity(Number(e.target.value))}
                />
                <div className="slider-scale"><span>Rendah</span><span>Sedang</span><span>Tinggi</span></div>
              </div>

              <div className="slider-group">
                <div className="slider-label">
                  <span className="slider-name"><span className="ic">🌊</span>Tinggi Gelombang</span>
                  <span className="slider-right">
                    <span className={`kondisi-badge ${toneOfLevel(waveK, false)}`}>{waveK}</span>
                    <span className="slider-value">{waveHeight}%</span>
                  </span>
                </div>
                <input
                  type="range" min="0" max="100" value={waveHeight}
                  style={{ "--fill": `${waveHeight}%` }}
                  onChange={(e) => setWaveHeight(Number(e.target.value))}
                />
                <div className="slider-scale"><span>Rendah</span><span>Sedang</span><span>Tinggi</span></div>
              </div>

              <div className="control-actions">
                <button className="btn btn-outline" onClick={handleReset}>↻ Atur Ulang</button>
                <button className="btn btn-primary" onClick={handleTryOther}>🔬 Coba Kondisi Lain</button>
              </div>
              {experimentCount > 0 && (
                <p className="experiment-note">Sudah mencatat {experimentCount} percobaan di perangkat ini.</p>
              )}
            </div>

            {/* ================= VISUALISASI UTAMA ================= */}
            <div className="viz-panel reveal">
              <div className="viz-readout">
                <span>Kerapatan: {density}%</span>
                <span>Gelombang: {waveHeight}%</span>
                <span className={`protect ${protectionTone}`}>Perlindungan: {protection}</span>
              </div>
              <div className="viz-sun" />

              {/* daratan di belakang mangrove (🏠) */}
              <div className="viz-land">
                <div className="viz-houses">
                  <span>🏠</span><span>🏡</span><span>🏠</span><span>🏡</span><span>🏠</span>
                </div>
              </div>

              {/* hutan mangrove + garis pantai + laut */}
              <MangroveForest density={density} />
              <div className="viz-sand" />
              <WaveCanvas waveHeight={waveHeight} />
            </div>
          </div>

          {/* ================= HASIL PENGAMATAN ================= */}
          <div className="obs-panel reveal">
            <span className="eyebrow">🔎 Hasil Pengamatan</span>
            <h2>Apa yang terlihat dari kombinasimu?</h2>

            <div className="obs-grid">
              <div className="obs-card">
                <div className="obs-ic">🌱</div>
                <div>
                  <small>Kerapatan Mangrove</small>
                  <b>{density}%</b>
                </div>
                <span className={`kondisi-badge obs-kondisi ${toneOfLevel(densityK, true)}`}>{densityK}</span>
              </div>
              <div className="obs-card">
                <div className="obs-ic">🌊</div>
                <div>
                  <small>Tinggi Gelombang</small>
                  <b>{waveHeight}%</b>
                </div>
                <span className={`kondisi-badge obs-kondisi ${toneOfLevel(waveK, false)}`}>{waveK}</span>
              </div>
            </div>

            <p className="obs-desc">{observation}</p>
          </div>

          {/* ================= HUBUNGAN SEBAB-AKIBAT ================= */}
          <div className="causal-panel reveal">
            <span className="eyebrow">🔗 Hubungan yang Diamati</span>
            <h2>Dari mangrove ke risiko abrasi</h2>

            <div className="causal-flow">
              <CausalNode icon="🌱" label="Kerapatan Mangrove" value={`${density}%`} note={`kondisi ${densityK.toLowerCase()}`} fill={density} tone={toneOfLevel(densityK, true)} />
              <div className="causal-arrow">↓</div>
              <CausalNode icon="🛡️" label="Kemampuan Perlindungan Pesisir" value={protection} note={`dari kerapatan ${density}%`} fill={density} tone={protectionTone} />
              <div className="causal-arrow">↓</div>
              <CausalNode icon="🌊" label="Dampak Gelombang" value={`${waveHeight}%`} note={`kondisi ${waveK.toLowerCase()}`} fill={waveHeight} tone={toneOfLevel(waveK, false)} />
              <div className="causal-arrow">↓</div>
              <CausalNode icon="🏖️" label="Risiko Abrasi" value={`${abrasionScore}%`} note={`kondisi ${abrasionK.toLowerCase()}`} fill={abrasionScore} tone={toneOfLevel(abrasionK, false)} />
            </div>
          </div>

          {/* ================= CATATAN EDUKATIF ================= */}
          <div className="note-panel reveal">
            <h2>💡 Coba Amati</h2>
            <ul className="note-list">
              <li>Bagaimana perubahan kerapatan mangrove ketika tinggi gelombang tetap?</li>
              <li>Bagaimana perubahan gelombang ketika kerapatan mangrove tetap?</li>
              <li>Apa yang terjadi ketika mangrove semakin jarang dan gelombang semakin tinggi?</li>
            </ul>
          </div>
        </div>
      </section>

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
