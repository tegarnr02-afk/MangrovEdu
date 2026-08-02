import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12a8 8 0 0 1 14-5.2M20 12a8 8 0 0 1-14 5.2" />
    <path d="M17.5 3v4h-4M6.5 21v-4h4" />
  </svg>
);
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11 12 4l8 7" />
    <path d="M6 10v10h12V10" />
  </svg>
);
const FishIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12c3-4 8-6 12-4 2 1 4 2.5 6 4-2 1.5-4 3-6 4-4 2-9 0-12-4Z" />
    <path d="M21 12l-3-2v4l3-2Z" />
  </svg>
);
const DropIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c4 5 7 9 7 12.5A7 7 0 0 1 5 15.5C5 12 8 8 12 3Z" />
  </svg>
);
const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
);

/* ================= DATA: TAHAPAN ABRASI (untuk drag & drop) ================= */
const stagesCorrectOrder = [
  { id: "s1", text: "Gelombang laut menghantam garis pantai secara terus-menerus." },
  { id: "s2", text: "Material pasir dan tanah di tepi pantai mulai terkikis (proses pengikisan)." },
  { id: "s3", text: "Garis pantai perlahan-lahan mundur ke arah daratan." },
  { id: "s4", text: "Wilayah pesisir kehilangan daratan dan berisiko abrasi lanjutan." },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ================= DATA: DAMPAK ABRASI ================= */
const dampakList = [
  { id: "lahan", icon: <MapIcon />, label: "Kehilangan Lahan", desc: "Daratan pesisir yang tadinya bisa dihuni atau ditanami perlahan hilang tergerus air laut." },
  { id: "rumah", icon: <HomeIcon />, label: "Kerusakan Pemukiman", desc: "Rumah dan fasilitas warga di dekat garis pantai berisiko rusak atau bahkan runtuh akibat abrasi." },
  { id: "air", icon: <DropIcon />, label: "Intrusi Air Laut", desc: "Air laut merembes masuk ke sumber air tawar warga, membuatnya menjadi asin dan tidak layak konsumsi." },
  { id: "habitat", icon: <FishIcon />, label: "Hilangnya Habitat Pesisir", desc: "Ikan, kepiting, dan berbagai biota kehilangan tempat tinggal alami akibat rusaknya kawasan mangrove di tepi pantai." },
];

/* ================= PERTANYAAN PEMANTIK AWAL ================= */
const quizAwal = {
  question: "Perhatikan perbedaan kondisi pantai berikut. Apa kemungkinan penyebab utama garis pantai bisa berubah seperti ini?",
  options: [
    "Pantai memang selalu berubah bentuk secara acak tanpa sebab tertentu",
    "Hilangnya vegetasi pelindung pantai membuat gelombang leluasa mengikis daratan",
    "Perubahan ini hanya terjadi karena pengaruh cuaca panas semata",
  ],
  correct: 1,
  feedbackCorrect: "Tepat! Salah satu penyebab utama abrasi adalah hilangnya vegetasi pelindung, seperti mangrove, yang biasanya menahan hantaman gelombang.",
  feedbackWrong: "Belum tepat. Coba perhatikan lagi peran vegetasi pesisir seperti mangrove dalam menahan gelombang.",
};

/* ================= PERTANYAAN PEMANTIK PENUTUP ================= */
const quizPenutup = {
  question: "Bagaimana kondisi vegetasi mangrove di suatu kawasan pesisir dapat memengaruhi risiko abrasi di masa depan?",
  options: [
    "Semakin lebat vegetasi mangrove, semakin tinggi risiko abrasi di kawasan tersebut",
    "Kondisi vegetasi mangrove tidak berkaitan sama sekali dengan risiko abrasi",
    "Semakin lebat dan sehat vegetasi mangrove, semakin rendah risiko abrasi karena akarnya menahan gelombang dan sedimen",
  ],
  correct: 2,
  feedbackCorrect: "Tepat! Vegetasi mangrove yang lebat dan sehat berperan besar menekan risiko abrasi karena akarnya menahan gelombang dan sedimen pantai.",
  feedbackWrong: "Belum tepat. Ingat kembali bagaimana akar mangrove bekerja meredam gelombang dan menahan sedimen di sepanjang materi ini.",
};

export default function AbrasiPantai() {
  const [qaSelected, setQaSelected] = useState(null);
  const [qaSubmitted, setQaSubmitted] = useState(false);

  const [pool, setPool] = useState(() => shuffleArray(stagesCorrectOrder));
  const [slots, setSlots] = useState([null, null, null, null]);
  const [checked, setChecked] = useState(false);
  const [draggedId, setDraggedId] = useState(null);

  const [activeDampak, setActiveDampak] = useState(null);
  const [visitedDampak, setVisitedDampak] = useState(new Set());

  const [qpSelected, setQpSelected] = useState(null);
  const [qpSubmitted, setQpSubmitted] = useState(false);

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

  const allDampakVisited = visitedDampak.size === dampakList.length;
  const allSlotsFilled = slots.every((s) => s !== null);
  const isOrderCorrect = allSlotsFilled && slots.every((s, i) => s.id === stagesCorrectOrder[i].id);

  // ---- Drag & drop (desktop) ----
  const onDragStart = (item) => setDraggedId(item.id);
  const onDropSlot = (index) => {
    if (!draggedId) return;
    placeIntoSlot(draggedId, index);
    setDraggedId(null);
  };

  // ---- Tap-to-place (mobile fallback) ----
  const [selectedPoolItem, setSelectedPoolItem] = useState(null);
  const tapPoolItem = (item) => setSelectedPoolItem(item.id === selectedPoolItem ? null : item.id);
  const tapSlot = (index) => {
    if (selectedPoolItem) {
      placeIntoSlot(selectedPoolItem, index);
      setSelectedPoolItem(null);
    } else if (slots[index]) {
      returnToPool(index);
    }
  };

  const placeIntoSlot = (itemId, index) => {
    const item = pool.find((p) => p.id === itemId) || slots.find((s) => s && s.id === itemId);
    if (!item) return;
    setSlots((prev) => {
      const next = [...prev];
      // kalau slot tujuan sudah terisi, kembalikan isinya ke pool dulu
      const existing = next[index];
      next[index] = item;
      setPool((prevPool) => {
        let np = prevPool.filter((p) => p.id !== itemId);
        if (existing) np = [...np, existing];
        return np;
      });
      return next;
    });
    setChecked(false);
  };

  const returnToPool = (index) => {
    setSlots((prev) => {
      const item = prev[index];
      if (!item) return prev;
      setPool((p) => [...p, item]);
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setChecked(false);
  };

  const resetDragDrop = () => {
    setPool(shuffleArray(stagesCorrectOrder));
    setSlots([null, null, null, null]);
    setChecked(false);
    setSelectedPoolItem(null);
  };

  const handleDampakClick = (d) => {
    setActiveDampak(d);
    setVisitedDampak((prev) => new Set(prev).add(d.id));
  };

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
        .btn-sm{ padding:9px 18px; font-size:0.82rem; }
        .btn:disabled{ opacity:0.45; cursor:not-allowed; transform:none !important; }

        .page-banner{ background:var(--canopy); padding:130px 0 60px; }
        .breadcrumb{ display:flex; align-items:center; gap:8px; font-size:0.85rem; color:rgba(251,250,245,0.65); margin-bottom:18px; flex-wrap:wrap; }
        .breadcrumb a:hover{ color:var(--amber); }
        .breadcrumb span.current{ color:rgba(251,250,245,0.9); }
        .page-banner h1{ color:var(--paper); font-size:clamp(1.9rem,3.6vw,2.7rem); max-width:640px; margin-bottom:14px; }
        .page-banner p{ color:rgba(251,250,245,0.78); max-width:600px; }

        .section{ padding:70px 0; }
        .section-head{ max-width:640px; margin-bottom:36px; }
        .section-head h2{ font-size:clamp(1.6rem,2.6vw,2.1rem); margin-top:12px; }
        .section-head p{ color:#4C5F58; margin-top:12px; }

        /* ===== Perbandingan visual pantai ===== */
        .compare-wrap{ display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .compare-card{ border-radius:var(--radius-lg); overflow:hidden; box-shadow:0 20px 40px -22px rgba(15,36,29,0.3); }
        .compare-img{ position:relative; aspect-ratio:4/3; }
        .compare-img svg{ width:100%; height:100%; display:block; }
        .compare-label{
          background:var(--paper); padding:16px 20px; display:flex; align-items:center; gap:10px;
        }
        .compare-label .dot{ width:10px; height:10px; border-radius:50%; }
        .compare-card.before .compare-label .dot{ background:var(--estuary); }
        .compare-card.after .compare-label .dot{ background:var(--danger); }
        .compare-label span{ font-weight:700; font-size:0.92rem; color:var(--canopy); }

        /* ===== Pertanyaan pemantik ===== */
        .quiz-box{ background:var(--paper); border-radius:var(--radius-lg); padding:34px; box-shadow:0 20px 40px -24px rgba(15,36,29,0.28); margin-top:30px; }
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
        .quiz-feedback svg{ width:18px; height:18px; flex-shrink:0; margin-top:2px; }
        .quiz-locked{ background:var(--sand-deep); border-radius:var(--radius-lg); padding:26px 32px; margin-top:30px; color:#5F726A; font-size:0.92rem; display:flex; align-items:center; gap:14px; }

        /* ===== Drag & drop ===== */
        .dnd-hint{ font-size:0.85rem; color:#556961; margin-bottom:20px; background:var(--tide-pale); padding:12px 16px; border-radius:12px; }
        .dnd-pool{ display:flex; flex-wrap:wrap; gap:12px; margin-bottom:28px; min-height:60px; }
        .dnd-chip{
          padding:14px 18px; border-radius:14px; background:var(--paper); border:1.5px solid rgba(15,36,29,0.12);
          font-size:0.88rem; cursor:grab; box-shadow:0 4px 12px -8px rgba(15,36,29,0.15);
          transition:border-color .2s ease, transform .2s ease; max-width:280px;
        }
        .dnd-chip:active{ cursor:grabbing; }
        .dnd-chip.picked{ border-color:var(--amber); box-shadow:0 0 0 4px rgba(232,163,61,0.2); }
        .dnd-slots{ display:flex; flex-direction:column; gap:12px; margin-bottom:20px; }
        .dnd-slot{
          min-height:64px; border-radius:14px; border:2px dashed rgba(15,36,29,0.2);
          display:flex; align-items:center; gap:14px; padding:12px 16px; background:var(--sand-deep);
          transition:border-color .2s ease, background .2s ease;
        }
        .dnd-slot.filled{ border-style:solid; background:var(--paper); border-color:rgba(15,36,29,0.1); }
        .dnd-slot.over{ border-color:var(--amber); background:var(--tide-pale); }
        .dnd-slot-num{
          width:30px; height:30px; border-radius:50%; background:var(--paper); color:var(--estuary);
          display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.82rem; flex-shrink:0;
          font-family:'Space Mono', monospace; border:1.5px solid rgba(47,107,87,0.3);
        }
        .dnd-slot-content{ flex:1; font-size:0.88rem; color:var(--canopy); }
        .dnd-slot-empty{ color:#8A9A93; font-size:0.85rem; }
        .dnd-slot.filled.correct-mark{ border-color:var(--estuary); }
        .dnd-slot.filled.wrong-mark{ border-color:var(--danger); }
        .dnd-actions{ display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
        .dnd-result{ margin-top:16px; padding:16px 18px; border-radius:14px; font-size:0.9rem; display:flex; gap:10px; align-items:flex-start; }
        .dnd-result.correct{ background:#E4EFE7; color:var(--canopy); }
        .dnd-result.wrong{ background:#F8E4E7; color:#7A2E3C; }
        .dnd-result svg{ width:18px; height:18px; flex-shrink:0; margin-top:2px; }

        /* ===== Dampak abrasi ===== */
        .dampak-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
        .dampak-card{
          background:var(--paper); border-radius:18px; padding:22px 18px; text-align:center; cursor:pointer;
          border:2px solid rgba(15,36,29,0.06); transition:border-color .2s ease, transform .2s ease;
          box-shadow:0 4px 14px -10px rgba(15,36,29,0.12);
        }
        .dampak-card:hover{ transform:translateY(-4px); }
        .dampak-card.visited{ border-color:var(--estuary); }
        .dampak-card.active{ border-color:var(--amber); }
        .dampak-icon{
          width:46px; height:46px; border-radius:50%; background:var(--tide-pale); color:var(--estuary);
          display:flex; align-items:center; justify-content:center; margin:0 auto 12px;
        }
        .dampak-icon svg{ width:22px; height:22px; }
        .dampak-card span{ font-size:0.84rem; font-weight:700; color:var(--canopy); }
        .dampak-detail{
          margin-top:20px; background:var(--paper); border-radius:16px; padding:20px 22px;
          border-left:4px solid var(--amber); min-height:40px; display:flex; align-items:center;
        }
        .dampak-detail p{ font-size:0.92rem; color:#33473F; }
        .dampak-detail .empty{ color:#8A9A93; }

        .materi-nav{ display:flex; justify-content:space-between; align-items:center; margin-top:60px; padding-top:30px; border-top:1px solid rgba(15,36,29,0.1); flex-wrap:wrap; gap:16px; }

        @media (max-width:980px){
          .compare-wrap{ grid-template-columns:1fr; }
          .dampak-grid{ grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width:768px){
          .page-banner{ padding:110px 0 44px; }
          .section{ padding:50px 0; }
          .quiz-box{ padding:24px 20px; }
        }
        @media (max-width:600px){
          .container{ padding:0 20px; }
          .materi-nav{ flex-direction:column; align-items:stretch; }
          .page-banner h1{ font-size:1.6rem; }
          .section-head h2{ font-size:1.4rem; }
          .dampak-grid{ grid-template-columns:1fr 1fr; }
        }
      `}</style>

      <Navbar />

      {/* ================= BANNER ================= */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb reveal">
            <Link to="/">Beranda</Link><span>/</span>
            <Link to="/materi">Materi</Link><span>/</span>
            <span className="current">Abrasi Pantai</span>
          </div>
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Materi 4 dari 5</span>
          <h1 className="reveal">Abrasi Pantai</h1>
          <p className="reveal">
            Amati perubahan garis pantai, susun tahapan terjadinya abrasi, dan
            pelajari dampaknya bagi lingkungan pesisir dan masyarakat.
          </p>
        </div>
      </section>

      {/* ================= AKTIVITAS 1: PERBANDINGAN KONDISI PANTAI ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Aktivitas 1</span>
            <h2>Amati Perbedaan Kondisi Pantai</h2>
            <p>Bandingkan dua kondisi pantai berikut, lalu jawab pertanyaan pemantik di bawahnya.</p>
          </div>

          <div className="compare-wrap reveal">
            <div className="compare-card before">
              <div className="compare-img">
                <svg viewBox="0 0 400 300" preserveAspectRatio="none">
                  <rect width="400" height="300" fill="#BFE0DA" />
                  <circle cx="340" cy="50" r="26" fill="#F6D186" />
                  <path d="M0 190 C70 175 140 200 210 185 C280 170 340 195 400 180 L400 300 L0 300 Z" fill="#3D6E52" />
                  <path d="M0 220 C80 205 160 230 240 215 C300 205 350 220 400 210 L400 300 L0 300 Z" fill="#2A4E3A" />
                  <g stroke="#12261F" strokeWidth="3" strokeLinecap="round" fill="none">
                    <path d="M100 200 C 95 220, 90 235, 82 255" />
                    <path d="M120 195 C 118 218, 122 235, 118 258" />
                    <path d="M145 200 C 152 220, 158 235, 168 255" />
                    <path d="M250 198 C 245 218, 240 233, 232 253" />
                    <path d="M275 195 C 273 216, 277 233, 273 256" />
                  </g>
                  <ellipse cx="120" cy="188" rx="46" ry="22" fill="#2F6B57" />
                  <ellipse cx="265" cy="186" rx="46" ry="22" fill="#2F6B57" />
                </svg>
              </div>
              <div className="compare-label"><span className="dot" /><span>Pantai dengan vegetasi mangrove lebat</span></div>
            </div>
            <div className="compare-card after">
              <div className="compare-img">
                <svg viewBox="0 0 400 300" preserveAspectRatio="none">
                  <rect width="400" height="300" fill="#BFE0DA" />
                  <circle cx="340" cy="50" r="26" fill="#F6D186" />
                  <path d="M0 235 C90 225 190 245 280 230 C330 222 370 235 400 228 L400 300 L0 300 Z" fill="#3D6E52" />
                  <path d="M0 255 C100 248 200 262 300 252 C340 248 370 255 400 250 L400 300 L0 300 Z" fill="#2A4E3A" />
                  <g stroke="#8A6A4A" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6">
                    <path d="M60 240 L64 258" />
                    <path d="M300 236 L305 252" />
                  </g>
                </svg>
              </div>
              <div className="compare-label"><span className="dot" /><span>Pantai yang tergerus abrasi, tanpa vegetasi pelindung</span></div>
            </div>
          </div>

          <div className="quiz-box reveal">
            <span className="eyebrow">Pertanyaan Pemantik</span>
            <h3>{quizAwal.question}</h3>
            {quizAwal.options.map((opt, i) => {
              const state = !qaSubmitted ? (qaSelected === i ? "selected" : "") : i === quizAwal.correct ? "correct" : qaSelected === i ? "wrong" : "";
              return (
                <button key={i} className={`quiz-option ${state}`} onClick={() => !qaSubmitted && setQaSelected(i)} disabled={qaSubmitted}>
                  <span className="quiz-option-dot">
                    {qaSubmitted && i === quizAwal.correct && <CheckIcon />}
                    {qaSubmitted && qaSelected === i && i !== quizAwal.correct && <XIcon />}
                  </span>
                  {opt}
                </button>
              );
            })}
            {!qaSubmitted ? (
              <button className="btn btn-primary" disabled={qaSelected === null} onClick={() => setQaSubmitted(true)} style={{ marginTop: 8 }}>
                Periksa Jawaban <ArrowIcon />
              </button>
            ) : (
              <div className={`quiz-feedback ${qaSelected === quizAwal.correct ? "correct" : "wrong"}`}>
                {qaSelected === quizAwal.correct ? <CheckIcon /> : <XIcon />}
                <span>{qaSelected === quizAwal.correct ? quizAwal.feedbackCorrect : quizAwal.feedbackWrong}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= AKTIVITAS 2: DRAG & DROP TAHAPAN ABRASI ================= */}
      {qaSubmitted && (
        <section className="section" style={{ background: "var(--sand-deep)" }}>
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Aktivitas 2</span>
              <h2>Susun Tahapan Terjadinya Abrasi</h2>
              <p>Seret (atau ketuk) tiap kartu ke kotak nomor yang sesuai, mulai dari penyebab hingga dampaknya.</p>
            </div>

            <div className="reveal">
              <p className="dnd-hint">
                💻 Di komputer: seret kartu ke kotak tujuan. 📱 Di HP: ketuk kartu untuk memilihnya, lalu ketuk kotak tujuan.
              </p>

              <div className="dnd-pool">
                {pool.length === 0 && <span className="dnd-slot-empty">Semua kartu sudah ditempatkan di bawah.</span>}
                {pool.map((item) => (
                  <div
                    key={item.id}
                    className={`dnd-chip${selectedPoolItem === item.id ? " picked" : ""}`}
                    draggable
                    onDragStart={() => onDragStart(item)}
                    onClick={() => tapPoolItem(item)}
                  >
                    {item.text}
                  </div>
                ))}
              </div>

              <div className="dnd-slots">
                {slots.map((s, i) => (
                  <div
                    key={i}
                    className={`dnd-slot${s ? " filled" : ""}${checked ? (s && s.id === stagesCorrectOrder[i].id ? " correct-mark" : " wrong-mark") : ""}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDropSlot(i)}
                    onClick={() => tapSlot(i)}
                  >
                    <span className="dnd-slot-num">{i + 1}</span>
                    <span className="dnd-slot-content">
                      {s ? s.text : <span className="dnd-slot-empty">Taruh tahap ke-{i + 1} di sini</span>}
                    </span>
                  </div>
                ))}
              </div>

              <div className="dnd-actions">
                <button className="btn btn-primary" disabled={!allSlotsFilled} onClick={() => setChecked(true)}>
                  Cek Urutan <ArrowIcon />
                </button>
                <button className="btn btn-outline" onClick={resetDragDrop}>
                  <RefreshIcon /> Acak Ulang
                </button>
              </div>

              {checked && (
                <div className={`dnd-result ${isOrderCorrect ? "correct" : "wrong"}`}>
                  {isOrderCorrect ? <CheckIcon /> : <XIcon />}
                  <span>
                    {isOrderCorrect
                      ? "Tepat! Urutan tahapan abrasi kamu sudah benar, mulai dari hantaman gelombang hingga hilangnya daratan pesisir."
                      : "Urutannya belum tepat. Perhatikan lagi mana yang menjadi penyebab awal dan mana yang menjadi dampak akhirnya, lalu susun ulang."}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================= AKTIVITAS 3: DAMPAK ABRASI ================= */}
      {qaSubmitted && checked && isOrderCorrect && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Aktivitas 3</span>
              <h2>Dampak Abrasi bagi Lingkungan dan Masyarakat</h2>
              <p>Klik tiap ikon untuk mempelajari dampak abrasi lebih lanjut.</p>
            </div>

            <div className="dampak-grid reveal">
              {dampakList.map((d) => (
                <button
                  key={d.id}
                  className={`dampak-card${visitedDampak.has(d.id) ? " visited" : ""}${activeDampak?.id === d.id ? " active" : ""}`}
                  onClick={() => handleDampakClick(d)}
                >
                  <div className="dampak-icon">{d.icon}</div>
                  <span>{d.label}</span>
                </button>
              ))}
            </div>

            <div className="dampak-detail reveal">
              {!activeDampak && <p className="empty">Klik salah satu ikon di atas untuk melihat penjelasan dampaknya.</p>}
              {activeDampak && <p><strong>{activeDampak.label}</strong> — {activeDampak.desc}</p>}
            </div>

            {!allDampakVisited && (
              <div className="quiz-locked reveal">
                <span style={{ fontSize: "1.3rem" }}>🔒</span>
                <span>Jelajahi keempat dampak abrasi di atas untuk membuka pertanyaan pemantik penutup.</span>
              </div>
            )}

            {allDampakVisited && (
              <div className="quiz-box reveal">
                <span className="eyebrow">Pertanyaan Pemantik Penutup</span>
                <h3>{quizPenutup.question}</h3>
                {quizPenutup.options.map((opt, i) => {
                  const state = !qpSubmitted ? (qpSelected === i ? "selected" : "") : i === quizPenutup.correct ? "correct" : qpSelected === i ? "wrong" : "";
                  return (
                    <button key={i} className={`quiz-option ${state}`} onClick={() => !qpSubmitted && setQpSelected(i)} disabled={qpSubmitted}>
                      <span className="quiz-option-dot">
                        {qpSubmitted && i === quizPenutup.correct && <CheckIcon />}
                        {qpSubmitted && qpSelected === i && i !== quizPenutup.correct && <XIcon />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
                {!qpSubmitted ? (
                  <button className="btn btn-primary" disabled={qpSelected === null} onClick={() => setQpSubmitted(true)} style={{ marginTop: 8 }}>
                    Periksa Jawaban <ArrowIcon />
                  </button>
                ) : (
                  <div className={`quiz-feedback ${qpSelected === quizPenutup.correct ? "correct" : "wrong"}`}>
                    {qpSelected === quizPenutup.correct ? <CheckIcon /> : <XIcon />}
                    <span>
                      {qpSelected === quizPenutup.correct ? quizPenutup.feedbackCorrect : quizPenutup.feedbackWrong}
                      {" "}Pemahaman ini akan jadi bekal saat kamu menguji hubungan tersebut langsung di Laboratorium Virtual.
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="materi-nav reveal">
              <Link to="/materi" className="btn btn-outline"><ArrowLeftIcon /> Daftar Materi</Link>
              <Link to="/materi/konservasi-mangrove" className="btn btn-primary">
                Materi 5: Konservasi Mangrove <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
