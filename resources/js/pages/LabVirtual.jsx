import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/* ================================================================
   MODE FOTO ASLI (opsional)
   ----------------------------------------------------------------
   Kosongkan (null) = pakai visualisasi prosedural (Canvas + CSS).
   Begitu URL foto diisi di sini, foto itu otomatis di-crossfade di
   atas layer prosedural untuk kategori yang bersangkutan — jadi
   tidak perlu bongkar logic apa pun, cukup isi asetnya saja.
================================================================ */
const PHOTO_ASSETS = {
  density: { low: null, medium: null, high: null }, // foto kerapatan mangrove: jarang / sedang / lebat
  wave: { calm: null, medium: null, rough: null },   // foto laut: tenang / sedang / berombak
};

/* ================= ICONS ================= */
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7Z" />
  </svg>
);
const WaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 8c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
    <path d="M2 14c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
    <path d="M2 20c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
  </svg>
);
const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20c9 0 16-7 16-16-9 0-16 7-16 16Z" />
    <path d="M5 19c3.5-3.5 6-7 7.5-11" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 2 20h20L12 3Z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
);

/* ================= UTIL ================= */
// PRNG sederhana berbasis seed supaya posisi pohon stabil antar-render
// (tidak "meloncat" random tiap kali komponen re-render).
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
   beberapa gelombang sinus dengan fase berbeda, supaya gerakannya
   terasa fluid & organik. Amplitudo & kecepatan mengikuti slider
   "tinggi gelombang".
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

      const baseY = height * 0.42;

      drawWaveLayer(baseY, amp1, speed * 0.8, 0.012, "rgba(137,174,158,0.55)", 0);
      drawWaveLayer(baseY + height * 0.14, amp2, speed, 0.016, "rgba(61,110,82,0.7)", 1.4);
      drawWaveLayer(baseY + height * 0.3, amp3, speed * 1.2, 0.02, "rgba(30,69,49,0.9)", 2.6);
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
   LAYER CSS: HUTAN MANGROVE ORGANIK
   ----------------------------------------------------------------
   Bukan satu bentuk SVG yang di-scale, tapi "populasi" pohon yang
   jumlahnya benar-benar bertambah/berkurang mengikuti slider
   kerapatan — dari kolam posisi acak yang stabil (seeded), supaya
   tidak berantakan/meloncat saat slider digeser sedikit.
================================================================ */
const TREE_POOL_SIZE = 46;
function generateTreePool() {
  const rand = seededRandom(42);
  const pool = [];
  for (let i = 0; i < TREE_POOL_SIZE; i++) {
    pool.push({
      left: rand() * 96 + 2,
      bottom: rand() * 38,
      scale: 0.55 + rand() * 0.85,
      hue: rand() > 0.5 ? "a" : "b",
      sway: 3.5 + rand() * 2.5,
      delay: rand() * -6,
    });
  }
  // urutkan dari yang paling "belakang/kecil" ke "depan/besar" supaya
  // saat kerapatan ditambah, pohon baru yang muncul terasa alami
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
   LOGIKA HASIL SIMULASI
================================================================ */
function computeResult(density, waveHeight) {
  const damping = density < 34 ? "Rendah" : density < 67 ? "Sedang" : "Tinggi";
  const riskScore = waveHeight - density * 0.6;
  const abrasiRisk = riskScore > 25 ? "Tinggi" : riskScore > 0 ? "Sedang" : "Rendah";
  const kondisiPesisir =
    abrasiRisk === "Tinggi" ? "Tidak Stabil" : abrasiRisk === "Sedang" ? "Cukup Stabil" : "Stabil";

  let interpretasi = "";
  if (density >= 67 && waveHeight <= 50) {
    interpretasi =
      "Kerapatan mangrove yang tinggi mampu meredam energi gelombang secara efektif sebelum mencapai daratan, sehingga risiko abrasi tetap rendah meski gelombang cukup besar.";
  } else if (density < 34 && waveHeight >= 50) {
    interpretasi =
      "Kerapatan mangrove yang rendah tidak cukup menahan energi gelombang yang tinggi — akar dan batang yang jarang membuat gelombang lebih leluasa menghantam garis pantai, sehingga risiko abrasi meningkat.";
  } else if (density >= 67 && waveHeight > 50) {
    interpretasi =
      "Meski gelombang cukup tinggi, kerapatan mangrove yang lebat tetap membantu meredam sebagian besar energinya — namun pemantauan tetap diperlukan karena tekanan gelombang cukup besar.";
  } else {
    interpretasi =
      "Kondisi kerapatan mangrove saat ini berada di ambang batas — cukup membantu meredam gelombang kecil-menengah, tetapi belum optimal untuk melindungi pesisir secara maksimal.";
  }

  return { damping, abrasiRisk, kondisiPesisir, interpretasi };
}

/* ================================================================
   HALAMAN UTAMA
================================================================ */
export default function LabVirtual() {
  const [density, setDensity] = useState(55);
  const [waveHeight, setWaveHeight] = useState(45);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const densityBucket = density < 34 ? "low" : density < 67 ? "medium" : "high";
  const waveBucket = waveHeight < 34 ? "calm" : waveHeight < 67 ? "medium" : "rough";
  const densityPhoto = PHOTO_ASSETS.density[densityBucket];
  const wavePhoto = PHOTO_ASSETS.wave[waveBucket];

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      setResult(computeResult(density, waveHeight));
      setRunning(false);
    }, 700);
  };

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
        .container{ max-width:1180px; margin:0 auto; padding:0 32px; }
        section{ position:relative; }
        .btn{ display:inline-flex; align-items:center; gap:8px; padding:15px 30px; border-radius:999px; font-weight:700; font-size:0.95rem; cursor:pointer; border:none; transition:transform .25s ease, box-shadow .25s ease; font-family:'Plus Jakarta Sans', sans-serif; }
        .btn-primary{ background:var(--amber); color:var(--canopy); box-shadow:0 12px 24px -10px rgba(232,163,61,0.7); }
        .btn-primary:hover:not(:disabled){ transform:translateY(-3px); box-shadow:0 16px 30px -10px rgba(232,163,61,0.85); }
        .btn-primary:disabled{ opacity:0.75; cursor:default; }
        .eyebrow{ font-family:'Space Mono', monospace; text-transform:uppercase; letter-spacing:0.14em; font-size:0.72rem; color:var(--estuary); font-weight:700; display:inline-flex; align-items:center; gap:10px; }

        .lab-banner{ background:var(--canopy); padding:130px 0 50px; color:var(--paper); }
        .breadcrumb{ display:flex; gap:8px; font-size:0.85rem; color:rgba(251,250,245,0.65); margin-bottom:18px; }
        .breadcrumb a:hover{ color:var(--amber); }
        .lab-banner h1{ color:var(--paper); font-size:clamp(1.9rem,3.4vw,2.6rem); max-width:600px; }
        .lab-banner p{ color:rgba(251,250,245,0.75); max-width:560px; margin-top:14px; }

        .lab-main{ padding:56px 0 100px; }
        .lab-grid{ display:grid; grid-template-columns:1.3fr 0.9fr; gap:32px; align-items:start; }

        /* ===== Panel visualisasi ===== */
        .viz-panel{
          position:relative; border-radius:var(--radius-lg); overflow:hidden;
          height:420px; background:linear-gradient(180deg,#BFE0DA 0%,#DCEEE2 38%,#9FCFC2 60%);
          box-shadow:var(--shadow); border:1px solid rgba(15,36,29,0.06);
        }
        .wave-canvas{ position:absolute; left:0; right:0; bottom:0; width:100%; height:62%; display:block; }
        .forest-layer{ position:absolute; left:0; right:0; bottom:0; height:70%; }
        .tree-blob{
          position:absolute; width:64px; height:78px; transform-origin:50% 100%;
          animation:treeSway ease-in-out infinite;
        }
        @keyframes treeSway{ 0%,100%{ transform:rotate(-2deg) scale(var(--s,1)); } 50%{ transform:rotate(2deg) scale(var(--s,1)); } }
        .tree-trunk{ position:absolute; left:50%; bottom:0; width:6px; height:26px; background:#4A3627; transform:translateX(-50%); border-radius:2px; }
        .tree-canopy{
          position:absolute; left:50%; bottom:18px; width:58px; height:52px; transform:translateX(-50%);
          border-radius:58% 42% 55% 45% / 55% 48% 52% 45%;
          box-shadow:inset -6px -8px 14px rgba(15,36,29,0.25), inset 6px 8px 12px rgba(255,255,255,0.12);
        }
        .tree-blob-a .tree-canopy{ background:radial-gradient(circle at 32% 30%, #3D8267, #1E4531 78%); }
        .tree-blob-b .tree-canopy{ background:radial-gradient(circle at 32% 30%, #4E9573, #2F6B57 78%); }
        .viz-photo-layer{
          position:absolute; inset:0; background-size:cover; background-position:center;
          opacity:0; transition:opacity .6s ease; pointer-events:none;
        }
        .viz-photo-layer.on{ opacity:1; }
        .viz-sun{ position:absolute; top:26px; right:36px; width:52px; height:52px; border-radius:50%; background:#F6D186; box-shadow:0 0 40px 10px rgba(246,209,134,0.55); }
        .viz-readout{
          position:absolute; top:16px; left:16px; z-index:4;
          background:rgba(15,36,29,0.7); color:var(--paper); font-family:'Space Mono', monospace;
          font-size:0.74rem; padding:10px 14px; border-radius:12px; display:flex; flex-direction:column; gap:4px;
        }

        /* ===== Panel kontrol ===== */
        .control-panel{ background:var(--paper); border-radius:var(--radius-lg); padding:32px 28px; box-shadow:var(--shadow); border:1px solid rgba(15,36,29,0.06); }
        .control-panel h3{ font-size:1.15rem; margin-bottom:26px; }
        .slider-group{ margin-bottom:30px; }
        .slider-label{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; font-size:0.9rem; font-weight:700; color:var(--canopy); }
        .slider-label .val{ font-family:'Space Mono', monospace; color:var(--estuary); background:var(--tide-pale); padding:3px 10px; border-radius:999px; font-size:0.8rem; }
        .slider-icon{ display:inline-flex; width:16px; height:16px; margin-right:8px; vertical-align:-3px; color:var(--estuary); }
        input[type="range"]{
          -webkit-appearance:none; width:100%; height:6px; border-radius:99px;
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
        .slider-scale{ display:flex; justify-content:space-between; font-size:0.72rem; color:#8A9A93; margin-top:6px; }

        .run-btn{ width:100%; justify-content:center; margin-top:6px; }
        .run-btn .spin{ width:15px; height:15px; border-radius:50%; border:2.2px solid rgba(15,36,29,0.3); border-top-color:var(--canopy); animation:spin .7s linear infinite; }
        @keyframes spin{ to{ transform:rotate(360deg); } }

        /* ===== Hasil simulasi ===== */
        .result-box{ margin-top:24px; border-top:1px solid rgba(15,36,29,0.08); padding-top:24px; animation:fadeUp .5s ease; }
        @keyframes fadeUp{ from{ opacity:0; transform:translateY(10px); } to{ opacity:1; transform:translateY(0); } }
        .result-box .eyebrow{ margin-bottom:14px; }
        .result-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px; }
        .result-card{ text-align:center; background:var(--sand); border-radius:14px; padding:14px 8px; }
        .result-card .r-icon{ width:30px; height:30px; border-radius:50%; margin:0 auto 8px; display:flex; align-items:center; justify-content:center; }
        .result-card .r-icon svg{ width:15px; height:15px; }
        .result-card small{ display:block; font-size:0.68rem; color:#7A8A83; margin-bottom:4px; }
        .result-card b{ font-size:0.85rem; }
        .badge-rendah{ background:#E1F1E4; color:#2F6B57; }
        .badge-sedang{ background:#FBEEDA; color:var(--amber-deep); }
        .badge-tinggi, .badge-tidak-stabil{ background:#F8E4E7; color:var(--danger); }
        .badge-stabil{ background:#E1F1E4; color:#2F6B57; }
        .badge-cukup-stabil{ background:#FBEEDA; color:var(--amber-deep); }
        .result-interpretasi{ font-size:0.88rem; color:#33473F; line-height:1.65; background:var(--sand); border-radius:14px; padding:16px 18px; }

        @media (max-width:960px){
          .lab-grid{ grid-template-columns:1fr; }
          .viz-panel{ height:340px; }
        }
        @media (max-width:600px){
          .container{ padding:0 20px; }
          .result-grid{ grid-template-columns:1fr; }
        }
      `}</style>

      <Navbar />

      <section className="lab-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Beranda</Link><span>/</span><span>Lab Virtual</span>
          </div>
          <span className="eyebrow" style={{ color: "var(--amber)" }}>Simulasi Interaktif</span>
          <h1 style={{ marginTop: 10 }}>Lab Virtual: Kerapatan Mangrove & Gelombang</h1>
          <p>
            Geser kedua slider untuk mengubah kerapatan hutan mangrove dan
            tinggi gelombang, lalu amati bagaimana visualisasinya berubah
            secara langsung.
          </p>
        </div>
      </section>

      <section className="lab-main">
        <div className="container">
          <div className="lab-grid">
            {/* ================= VISUALISASI ================= */}
            <div className="viz-panel">
              <div className="viz-readout">
                <span>Kerapatan: {density}%</span>
                <span>Gelombang: {waveHeight}%</span>
              </div>
              <div className="viz-sun" />

              {/* Layer prosedural (selalu aktif sebagai basis/fallback) */}
              <MangroveForest density={density} />
              <WaveCanvas waveHeight={waveHeight} />

              {/* Layer foto asli (opsional) — otomatis muncul kalau PHOTO_ASSETS diisi */}
              <div
                className={`viz-photo-layer${densityPhoto ? " on" : ""}`}
                style={densityPhoto ? { backgroundImage: `url(${densityPhoto})` } : undefined}
              />
              <div
                className={`viz-photo-layer${wavePhoto ? " on" : ""}`}
                style={wavePhoto ? { backgroundImage: `url(${wavePhoto})` } : undefined}
              />
            </div>

            {/* ================= KONTROL ================= */}
            <div className="control-panel">
              <h3>Atur Variabel</h3>

              <div className="slider-group">
                <div className="slider-label">
                  <span><span className="slider-icon"><LeafIcon /></span>Kerapatan Mangrove</span>
                  <span className="val">{density}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={density}
                  style={{ "--fill": `${density}%` }}
                  onChange={(e) => { setDensity(Number(e.target.value)); setResult(null); }}
                />
                <div className="slider-scale"><span>Jarang</span><span>Sedang</span><span>Lebat</span></div>
              </div>

              <div className="slider-group">
                <div className="slider-label">
                  <span><span className="slider-icon"><WaveIcon /></span>Tinggi Gelombang</span>
                  <span className="val">{waveHeight}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={waveHeight}
                  style={{ "--fill": `${waveHeight}%` }}
                  onChange={(e) => { setWaveHeight(Number(e.target.value)); setResult(null); }}
                />
                <div className="slider-scale"><span>Tenang</span><span>Sedang</span><span>Berombak</span></div>
              </div>

              <button className="btn btn-primary run-btn" onClick={handleRun} disabled={running}>
                {running ? (<><span className="spin" /> Memproses...</>) : (<><PlayIcon /> Jalankan Simulasi</>)}
              </button>

              {result && (
                <div className="result-box">
                  <span className="eyebrow">Hasil Simulasi</span>
                  <div className="result-grid">
                    <div className="result-card">
                      <div className={`r-icon badge-${result.damping.toLowerCase()}`}><ShieldIcon /></div>
                      <small>Peredaman Gelombang</small>
                      <b>{result.damping}</b>
                    </div>
                    <div className="result-card">
                      <div className={`r-icon badge-${result.abrasiRisk.toLowerCase()}`}><AlertIcon /></div>
                      <small>Risiko Abrasi</small>
                      <b>{result.abrasiRisk}</b>
                    </div>
                    <div className="result-card">
                      <div className={`r-icon badge-${result.kondisiPesisir.toLowerCase().replace(/\s+/g, "-")}`}><WaveIcon /></div>
                      <small>Kondisi Pesisir</small>
                      <b>{result.kondisiPesisir}</b>
                    </div>
                  </div>
                  <p className="result-interpretasi">{result.interpretasi}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}