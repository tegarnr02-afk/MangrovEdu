import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
function kategoriKerapatan(v) {
  if (v < 34) return "Jarang";
  if (v < 67) return "Sedang";
  return "Lebat";
}
function kategoriGelombang(v) {
  if (v < 34) return "Tenang";
  if (v < 67) return "Sedang";
  return "Tinggi";
}
function jalankanSimulasi(density, wave) {
  // Kerapatan mangrove meredam energi gelombang; gelombang tinggi mengurangi efektivitas peredaman.
  const peredamanScore = Math.max(0, Math.min(100, density - wave * 0.4));
  const abrasiScore = Math.max(0, Math.min(100, 100 - peredamanScore));

  const peredaman = peredamanScore >= 60 ? "Tinggi" : peredamanScore >= 30 ? "Sedang" : "Rendah";
  const abrasi = abrasiScore <= 30 ? "Rendah" : abrasiScore <= 60 ? "Sedang" : "Tinggi";
  const kondisi = abrasi === "Rendah" ? "Stabil" : abrasi === "Sedang" ? "Cukup Stabil" : "Tidak Stabil";

  const dLabel = kategoriKerapatan(density);
  const wLabel = kategoriGelombang(wave);

  const interpretasi = `Dengan kerapatan mangrove ${dLabel.toLowerCase()} dan gelombang ${wLabel.toLowerCase()}, akar dan batang mangrove ${
    peredaman === "Tinggi"
      ? "mampu meredam sebagian besar energi gelombang sebelum mencapai garis pantai"
      : peredaman === "Sedang"
      ? "meredam sebagian energi gelombang, namun belum sepenuhnya menahan dampaknya"
      : "belum cukup rapat untuk meredam energi gelombang secara efektif"
  }. Akibatnya, risiko abrasi di kawasan ini tergolong ${abrasi.toLowerCase()}, sehingga kondisi pesisir saat ini ${kondisi.toLowerCase()}.`;

  return { peredamanScore, abrasiScore, peredaman, abrasi, kondisi, dLabel, wLabel, interpretasi };
}
function tone(label) {
  if (["Tinggi", "Stabil"].includes(label)) return "good";
  if (["Sedang", "Cukup Stabil"].includes(label)) return "mid";
  return "bad"; // Rendah (peredaman), Tinggi (abrasi/gelombang tanpa konteks lain ditangani di pemanggil
}

export default function Simulasi() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem("token"));

  const [density, setDensity] = useState(50);
  const [wave, setWave] = useState(50);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("simulasiHistory");
      setHistory(raw ? JSON.parse(raw) : []);
    } catch {
      setHistory([]);
    }
  }, []);

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
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [result, loggedIn]);

  const handleRun = () => {
    const r = jalankanSimulasi(density, wave);
    setResult(r);

    const entry = {
      density,
      wave,
      abrasi: r.abrasi,
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
  };

  const goToLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  // Visualisasi: jumlah pohon yang tampak mengikuti kerapatan, amplitudo gelombang mengikuti tinggi gelombang.
  const totalPohon = 8;
  const pohonTerlihat = Math.round((density / 100) * totalPohon);
  const amplitudo = 6 + (wave / 100) * 26;
  const wavePath = (offsetY, amp) =>
    `M0,${offsetY} C 60,${offsetY - amp} 120,${offsetY + amp} 180,${offsetY} C 240,${offsetY - amp} 300,${offsetY + amp} 360,${offsetY} C 420,${offsetY - amp} 480,${offsetY + amp} 540,${offsetY} C 600,${offsetY - amp} 660,${offsetY + amp} 720,${offsetY} L720,160 L0,160 Z`;

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
        .btn-primary:disabled{ opacity:0.5; cursor:not-allowed; transform:none !important; box-shadow:none !important; }

        /* ===== Banner ===== */
        .page-banner{ background:var(--canopy); padding:130px 0 60px; }
        .page-banner h1{ color:var(--paper); font-size:clamp(1.9rem,3.6vw,2.7rem); max-width:640px; margin-bottom:14px; }
        .page-banner p{ color:rgba(251,250,245,0.78); max-width:600px; }

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

        /* ===== Lab: kontrol + visualisasi ===== */
        .lab-grid{ display:grid; grid-template-columns:1fr 1fr; gap:36px; align-items:start; }
        .lab-controls{ background:var(--paper); border-radius:var(--radius-lg); padding:32px; box-shadow:0 16px 32px -20px rgba(15,36,29,0.18); }
        .control-block + .control-block{ margin-top:30px; }
        .control-label{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .control-label span:first-child{ font-weight:700; font-size:0.95rem; color:var(--canopy); display:flex; align-items:center; gap:8px; }
        .control-label span:first-child svg{ width:18px; height:18px; color:var(--estuary); }
        .control-tag{
          font-family:'Space Mono', monospace; font-size:0.72rem; font-weight:700;
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

        .lab-visual{
          position:relative; border-radius:var(--radius-lg); overflow:hidden;
          background:linear-gradient(180deg,#BFE0DA 0%,#8FC2B4 55%,#3D6E52 100%);
          min-height:340px; box-shadow:0 16px 32px -20px rgba(15,36,29,0.3);
        }
        .lab-visual svg{ position:absolute; inset:0; width:100%; height:100%; }
        .lab-visual-caption{
          position:absolute; bottom:14px; left:0; right:0; text-align:center;
          font-family:'Space Mono', monospace; font-size:0.72rem; color:rgba(255,255,255,0.85);
          text-shadow:0 1px 3px rgba(0,0,0,0.4);
        }
        .tree-shape{ transition:opacity .4s ease; }
        .wave-path{ transition:d .35s ease; }

        /* ===== Hasil simulasi ===== */
        .hasil-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
        .hasil-card{
          background:var(--paper); border-radius:var(--radius-md); padding:26px 24px;
          box-shadow:0 12px 26px -18px rgba(15,36,29,0.2); text-align:center;
        }
        .hasil-icon{
          width:48px; height:48px; margin:0 auto 14px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
        }
        .hasil-icon svg{ width:22px; height:22px; }
        .hasil-card.good .hasil-icon{ background:#E4EFE7; color:var(--estuary); }
        .hasil-card.mid .hasil-icon{ background:#FBEEDA; color:var(--amber-deep); }
        .hasil-card.bad .hasil-icon{ background:#F8E4E7; color:var(--danger); }
        .hasil-card h4{ font-size:0.82rem; color:#7A8A83; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:8px; }
        .hasil-value{ font-family:'Fraunces', serif; font-size:1.5rem; font-weight:600; }
        .hasil-card.good .hasil-value{ color:var(--estuary); }
        .hasil-card.mid .hasil-value{ color:var(--amber-deep); }
        .hasil-card.bad .hasil-value{ color:var(--danger); }

        .interpretasi-box{
          background:var(--tide-pale); border-radius:var(--radius-md); padding:24px 26px; margin-top:26px;
          font-size:0.95rem; color:#243D33; line-height:1.65;
        }
        .interpretasi-box strong{ color:var(--canopy); }

        /* ===== Grafik ===== */
        .grafik-box{ background:var(--paper); border-radius:var(--radius-lg); padding:32px; box-shadow:0 16px 32px -20px rgba(15,36,29,0.18); }
        .grafik-row{ margin-bottom:22px; }
        .grafik-row:last-child{ margin-bottom:0; }
        .grafik-label{ display:flex; justify-content:space-between; font-size:0.88rem; font-weight:700; color:var(--canopy); margin-bottom:8px; }
        .grafik-bar-bg{ height:14px; border-radius:99px; background:var(--sand-deep); overflow:hidden; }
        .grafik-bar-fill{ height:100%; border-radius:99px; transition:width .6s ease; }

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

        /* ===== Login modal (identik pola Materi.jsx) ===== */
        .login-modal-overlay{
          position:fixed; inset:0; background:rgba(15,36,29,0.55); backdrop-filter:blur(3px);
          display:flex; align-items:center; justify-content:center; z-index:300; padding:20px;
        }
        .login-modal{
          background:var(--paper); border-radius:var(--radius-lg); padding:40px 34px;
          max-width:380px; width:100%; text-align:center; position:relative;
        }
        .login-modal-close{
          position:absolute; top:16px; right:16px; width:32px; height:32px; border:none; border-radius:50%;
          background:var(--sand-deep); color:var(--canopy); display:flex; align-items:center; justify-content:center; cursor:pointer;
        }
        .login-modal-close svg{ width:16px; height:16px; }
        .login-modal-icon{
          width:56px; height:56px; margin:0 auto 18px; border-radius:50%;
          background:var(--tide-pale); color:var(--estuary); display:flex; align-items:center; justify-content:center;
        }
        .login-modal-icon svg{ width:26px; height:26px; }
        .login-modal h3{ font-size:1.35rem; margin-bottom:10px; }
        .login-modal p{ color:#556961; font-size:0.92rem; margin-bottom:26px; }
        .login-modal-actions{ display:flex; flex-direction:column; gap:10px; }
        .login-modal-actions .btn-primary{ width:100%; justify-content:center; }
        .login-modal-cancel{ background:none; border:none; color:#7A8A83; font-weight:600; font-size:0.88rem; cursor:pointer; }
        .login-modal-cancel:hover{ color:var(--canopy); }

        @media (max-width:900px){
          .lab-grid{ grid-template-columns:1fr; }
          .hasil-grid{ grid-template-columns:1fr; }
        }
      `}</style>

      <Navbar />

      {/* ================= BANNER ================= */}
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Lab Virtual &amp; Simulasi</span>
          <h1 className="reveal">Simulasi Peredaman Gelombang</h1>
          <p className="reveal">
            Atur kerapatan mangrove dan tinggi gelombang, lalu jalankan simulasi
            untuk melihat pengaruhnya terhadap risiko abrasi dan kestabilan pesisir.
          </p>
        </div>
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
          <section className="section">
            <div className="container">
              <div className="section-head reveal">
                <span className="eyebrow">Kontrol Simulasi</span>
                <h2>Atur Variabelnya</h2>
                <p>Geser slider untuk mengubah kondisi, lalu perhatikan visualisasi di sebelah kanan berubah secara langsung.</p>
              </div>

              <div className="lab-grid">
                <div className="lab-controls reveal">
                  <div className="control-block">
                    <div className="control-label">
                      <span><LeafIcon /> Kerapatan Mangrove</span>
                      <span className="control-tag">{kategoriKerapatan(density)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={density}
                      onChange={(e) => setDensity(Number(e.target.value))}
                      style={{ "--val": `${density}%` }}
                    />
                    <div className="control-scale"><span>Jarang</span><span>Sedang</span><span>Lebat</span></div>
                  </div>

                  <div className="control-block">
                    <div className="control-label">
                      <span><WaveIcon /> Tinggi Gelombang</span>
                      <span className="control-tag">{kategoriGelombang(wave)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={wave}
                      onChange={(e) => setWave(Number(e.target.value))}
                      style={{ "--val": `${wave}%` }}
                    />
                    <div className="control-scale"><span>Tenang</span><span>Sedang</span><span>Tinggi</span></div>
                  </div>

                  <button className="btn btn-primary run-btn" onClick={handleRun}>
                    <PlayIcon /> Jalankan Simulasi
                  </button>
                </div>

                <div className="lab-visual reveal">
                  <svg viewBox="0 0 720 320" preserveAspectRatio="none" aria-hidden="true">
                    {/* Langit sudah dari background gradient container */}
                    {Array.from({ length: totalPohon }).map((_, i) => {
                      const x = 40 + i * ((720 - 80) / (totalPohon - 1));
                      const visible = i < pohonTerlihat;
                      return (
                        <g key={i} className="tree-shape" style={{ opacity: visible ? 1 : 0.12 }}>
                          <path d={`M${x - 3} 230 L${x - 3} 260 L${x + 3} 260 L${x + 3} 230 Z`} fill="#3B2A1E" />
                          <ellipse cx={x} cy={205} rx="26" ry="30" fill="#2F6B57" />
                          <ellipse cx={x - 10} cy={195} rx="16" ry="18" fill="#3D8267" />
                          <ellipse cx={x + 12} cy={198} rx="16" ry="18" fill="#3D8267" />
                        </g>
                      );
                    })}
                    <path className="wave-path" d={wavePath(255, amplitudo)} fill="#1E4531" opacity="0.85" />
                    <path className="wave-path" d={wavePath(272, amplitudo * 0.75)} fill="#163A29" opacity="0.9" />
                  </svg>
                  <div className="lab-visual-caption">
                    {pohonTerlihat}/{totalPohon} rumpun mangrove &middot; amplitudo gelombang {Math.round(amplitudo)}px
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= HASIL SIMULASI ================= */}
          {result && (
            <section className="section" id="hasil-simulasi" style={{ background: "var(--sand-deep)" }}>
              <div className="container">
                <div className="section-head reveal">
                  <span className="eyebrow">Hasil Simulasi</span>
                  <h2>Dampak Terhadap Pesisir</h2>
                  <p>Berdasarkan kombinasi kerapatan {result.dLabel.toLowerCase()} dan gelombang {result.wLabel.toLowerCase()} yang kamu atur.</p>
                </div>

                <div className="hasil-grid">
                  <div className={`hasil-card reveal ${tone(result.peredaman)}`}>
                    <div className="hasil-icon"><ShieldIcon /></div>
                    <h4>Peredaman Gelombang</h4>
                    <div className="hasil-value">{result.peredaman}</div>
                  </div>
                  <div className={`hasil-card reveal ${result.abrasi === "Rendah" ? "good" : result.abrasi === "Sedang" ? "mid" : "bad"}`} style={{ transitionDelay: "80ms" }}>
                    <div className="hasil-icon"><WaveIcon /></div>
                    <h4>Risiko Abrasi</h4>
                    <div className="hasil-value">{result.abrasi}</div>
                  </div>
                  <div className={`hasil-card reveal ${tone(result.kondisi)}`} style={{ transitionDelay: "160ms" }}>
                    <div className="hasil-icon"><AnchorIcon /></div>
                    <h4>Kondisi Pesisir</h4>
                    <div className="hasil-value">{result.kondisi}</div>
                  </div>
                </div>

                <div className="interpretasi-box reveal">
                  <strong>Interpretasi: </strong>{result.interpretasi}
                </div>
              </div>
            </section>
          )}

          {/* ================= GRAFIK SIMULASI ================= */}
          {result && (
            <section className="section">
              <div className="container">
                <div className="section-head reveal">
                  <span className="eyebrow">Grafik Simulasi</span>
                  <h2>Perbandingan Skor</h2>
                  <p>Semakin tinggi kerapatan mangrove, semakin besar kemampuan peredaman gelombang — dan semakin kecil skor risiko abrasinya.</p>
                </div>

                <div className="grafik-box reveal">
                  <div className="grafik-row">
                    <div className="grafik-label"><span>Kerapatan Mangrove</span><span>{density}%</span></div>
                    <div className="grafik-bar-bg"><div className="grafik-bar-fill" style={{ width: `${density}%`, background: "var(--estuary)" }} /></div>
                  </div>
                  <div className="grafik-row">
                    <div className="grafik-label"><span>Kemampuan Peredaman Gelombang</span><span>{Math.round(result.peredamanScore)}%</span></div>
                    <div className="grafik-bar-bg"><div className="grafik-bar-fill" style={{ width: `${result.peredamanScore}%`, background: "var(--amber)" }} /></div>
                  </div>
                  <div className="grafik-row">
                    <div className="grafik-label"><span>Skor Risiko Abrasi</span><span>{Math.round(result.abrasiScore)}%</span></div>
                    <div className="grafik-bar-bg"><div className="grafik-bar-fill" style={{ width: `${result.abrasiScore}%`, background: "var(--danger)" }} /></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= RIWAYAT PERCOBAAN ================= */}
          {history.length > 0 && (
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
          <section className="section">
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
        </>
      )}

      <Footer />
    </>
  );
}