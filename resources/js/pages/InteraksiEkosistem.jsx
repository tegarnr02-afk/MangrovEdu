import React, { useEffect, useState } from "react";
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

/* ================= DATA: DIAGRAM INTERAKSI (node + edge) ================= */
const nodes = [
  {
    id: "pohon",
    label: "Pohon Mangrove",
    emoji: "🌳",
    top: "50%",
    left: "50%",
    center: true,
    facts: [
      "Menjadi pusat interaksi karena hampir semua komponen lain bergantung padanya.",
      "Menghasilkan makanan lewat fotosintesis dan menjadi tempat berlindung berbagai hewan.",
    ],
  },
  { id: "matahari", label: "Matahari", emoji: "☀️", top: "8%", left: "50%",
    facts: ["Memberi energi cahaya yang diserap pohon mangrove untuk berfotosintesis.", "Tanpa interaksi ini, pohon mangrove tidak dapat menghasilkan makanan."] },
  { id: "ikan", label: "Ikan", emoji: "🐟", top: "26%", left: "88%",
    facts: ["Berlindung dan mencari makan di antara akar pohon mangrove.", "Menjadi mangsa bagi burung yang berburu di sekitar kawasan ini."] },
  { id: "burung", label: "Burung", emoji: "🦅", top: "74%", left: "88%",
    facts: ["Bertengger dan bersarang di ranting pohon mangrove.", "Memangsa ikan-ikan kecil yang berenang di sekitar akar mangrove."] },
  { id: "lumpur", label: "Lumpur", emoji: "🪨", top: "92%", left: "50%",
    facts: ["Menjadi media akar pohon mangrove mencengkeram dan menyerap nutrisi.", "Menerima hasil penguraian dari aktivitas kepiting di atasnya."] },
  { id: "kepiting", label: "Kepiting", emoji: "🦀", top: "74%", left: "12%",
    facts: ["Hidup di sekitar akar pohon mangrove sebagai tempat berlindung.", "Menguraikan serasah daun mangrove menjadi nutrisi bagi lumpur."] },
  { id: "air", label: "Air Laut", emoji: "🌊", top: "26%", left: "12%",
    facts: ["Membawa nutrisi dari laut menuju akar pohon mangrove.", "Pasang surutnya memengaruhi kapan akar mangrove terendam atau terbuka."] },
];

// Garis penghubung: 6 dari pusat (pohon) ke tiap node luar, + 2 relasi silang antar node luar
const edges = [
  ["pohon", "matahari"], ["pohon", "ikan"], ["pohon", "burung"],
  ["pohon", "lumpur"], ["pohon", "kepiting"], ["pohon", "air"],
  ["kepiting", "lumpur"], ["ikan", "burung"],
];

/* ================= DATA: RANTAI MAKANAN ================= */
const foodChain = [
  { id: "matahari", label: "Matahari", role: "Sumber Energi", emoji: "☀️",
    desc: "Menyediakan energi awal yang digunakan produsen untuk berfotosintesis." },
  { id: "produsen", label: "Daun & Fitoplankton Mangrove", role: "Produsen", emoji: "🌿",
    desc: "Mengubah energi matahari menjadi makanan lewat fotosintesis — menjadi dasar seluruh rantai makanan." },
  { id: "konsumen1", label: "Kepiting & Udang Kecil", role: "Konsumen I", emoji: "🦀",
    desc: "Memakan serasah daun dan fitoplankton sebagai sumber makanan utamanya." },
  { id: "konsumen2", label: "Ikan & Burung", role: "Konsumen II", emoji: "🐟",
    desc: "Memangsa kepiting dan udang kecil sebagai sumber makanannya." },
  { id: "pengurai", label: "Bakteri Pengurai", role: "Pengurai", emoji: "🦠",
    desc: "Menguraikan sisa organisme mati menjadi nutrisi yang kembali menyuburkan lumpur — menutup siklus rantai makanan." },
];

const removeEffects = {
  matahari: {
    cascade: "Tanpa cahaya matahari, proses fotosintesis terhenti sehingga produsen tidak dapat menghasilkan makanan.",
    correct: "produsen",
  },
  produsen: {
    cascade: "Sumber makanan utama bagi Konsumen I hilang, sehingga populasi kepiting dan udang kecil akan menurun drastis.",
    correct: "konsumen1",
  },
  konsumen1: {
    cascade: "Konsumen II kehilangan sumber makanan utamanya, sehingga ikan dan burung akan kesulitan mencari makan di kawasan ini.",
    correct: "konsumen2",
  },
  konsumen2: {
    cascade: "Tanpa predator alami, populasi kepiting dan udang kecil (Konsumen I) bisa meningkat tajam dan mengubah keseimbangan rantai makanan.",
    correct: "konsumen1",
  },
  pengurai: {
    cascade: "Sisa organisme mati menumpuk dan proses penguraian nutrisi terhambat, sehingga kesuburan lumpur bagi produsen ikut menurun.",
    correct: "produsen",
  },
};

/* ================= PERTANYAAN PEMANTIK 1 ================= */
const quiz1 = {
  question:
    "Kepiting menguraikan serasah daun mangrove menjadi nutrisi, yang kemudian diserap kembali oleh akar pohon mangrove lewat lumpur. Interaksi ini menunjukkan bahwa...",
  options: [
    "Kepiting dan lumpur tidak memiliki hubungan sama sekali dengan pohon mangrove",
    "Komponen biotik dan abiotik saling terhubung membentuk siklus yang menopang satu sama lain",
    "Pohon mangrove dapat tumbuh tanpa bantuan komponen lain di sekitarnya",
  ],
  correct: 1,
  feedbackCorrect:
    "Tepat! Ekosistem mangrove adalah jaringan interaksi — komponen biotik dan abiotik saling memengaruhi dan menopang satu sama lain.",
  feedbackWrong:
    "Belum tepat. Coba perhatikan lagi bagaimana kepiting, lumpur, dan pohon mangrove saling terhubung dalam diagram di atas.",
};

export default function InteraksiEkosistem() {
  const [activeNode, setActiveNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [q1Selected, setQ1Selected] = useState(null);
  const [q1Submitted, setQ1Submitted] = useState(false);

  const [activeChainNode, setActiveChainNode] = useState(null);
  const [visitedChain, setVisitedChain] = useState(new Set());
  const [removedNode, setRemovedNode] = useState(null);
  const [predictSelected, setPredictSelected] = useState(null);
  const [predictSubmitted, setPredictSubmitted] = useState(false);

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

  const handleNodeClick = (n) => {
    setActiveNode(n);
    setVisitedNodes((prev) => new Set(prev).add(n.id));
  };
  const allNodesVisited = visitedNodes.size === nodes.length;

  const handleChainClick = (n) => {
    setActiveChainNode(n);
    setVisitedChain((prev) => new Set(prev).add(n.id));
  };

  const handleRemove = (id) => {
    setRemovedNode(id);
    setPredictSelected(null);
    setPredictSubmitted(false);
  };
  const resetScenario = () => {
    setRemovedNode(null);
    setPredictSelected(null);
    setPredictSubmitted(false);
  };

  const remainingNodes = foodChain.filter((n) => n.id !== removedNode);
  const isPredictCorrect = removedNode && predictSelected === removeEffects[removedNode].correct;

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
        .btn-sm{ padding:8px 16px; font-size:0.8rem; }
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

        /* ===== Diagram interaksi (radial) ===== */
        .diagram-wrap{ display:grid; grid-template-columns:1.2fr 1fr; gap:28px; align-items:stretch; }
        .diagram-scene{
          position:relative; border-radius:var(--radius-lg); overflow:hidden;
          background:linear-gradient(160deg,var(--sand-deep) 0%,var(--tide-pale) 100%);
          aspect-ratio:1/1; box-shadow:0 20px 40px -20px rgba(15,36,29,0.25);
        }
        .diagram-scene svg.edges{ position:absolute; inset:0; width:100%; height:100%; }
        .diagram-scene svg.edges line{ stroke:rgba(15,36,29,0.16); stroke-width:0.6; transition:stroke .3s ease, stroke-width .3s ease; }
        .diagram-scene svg.edges line.hl{ stroke:var(--amber); stroke-width:1; }
        .diagram-node{
          position:absolute; transform:translate(-50%,-50%);
          width:64px; height:64px; border-radius:50%;
          background:var(--paper); border:2px solid rgba(47,107,87,0.25);
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;
          cursor:pointer; box-shadow:0 6px 16px -8px rgba(15,36,29,0.3);
          transition:transform .2s ease, border-color .2s ease, box-shadow .2s ease;
          font-size:0.6rem; font-weight:700; color:var(--canopy); text-align:center; padding:4px;
        }
        .diagram-node.center{ width:84px; height:84px; background:var(--canopy); color:var(--paper); border-color:var(--amber); font-size:0.66rem; }
        .diagram-node .emoji{ font-size:1.25rem; line-height:1; }
        .diagram-node:hover{ transform:translate(-50%,-50%) scale(1.08); }
        .diagram-node.visited{ border-color:var(--estuary); }
        .diagram-node.active{ border-color:var(--amber); box-shadow:0 0 0 6px rgba(232,163,61,0.22); }

        .diagram-progress{
          position:absolute; top:12px; left:12px; z-index:3;
          background:rgba(15,36,29,0.85); color:var(--paper); font-size:0.72rem; font-weight:700;
          padding:8px 14px; border-radius:14px; font-family:'Space Mono', monospace;
        }

        .info-panel{
          background:var(--paper); border-radius:var(--radius-lg); padding:26px;
          display:flex; flex-direction:column; box-shadow:0 20px 40px -24px rgba(15,36,29,0.3);
        }
        .info-panel-empty{ color:#7A8A83; font-size:0.94rem; margin:auto; text-align:center; }
        .info-panel h3{ font-size:1.2rem; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
        .info-facts{ display:flex; flex-direction:column; gap:10px; list-style:none; }
        .info-facts li{ display:flex; align-items:flex-start; gap:10px; font-size:0.92rem; color:#33473F; line-height:1.5; }
        .info-facts li svg{ width:15px; height:15px; color:var(--estuary); flex-shrink:0; margin-top:3px; }

        /* ===== Pertanyaan pemantik ===== */
        .quiz-box{ background:var(--paper); border-radius:var(--radius-lg); padding:34px; box-shadow:0 20px 40px -24px rgba(15,36,29,0.28); margin-top:36px; }
        .quiz-locked{ background:var(--sand-deep); border-radius:var(--radius-lg); padding:26px 32px; margin-top:36px; color:#5F726A; font-size:0.92rem; display:flex; align-items:center; gap:14px; }
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

        /* ===== Rantai makanan ===== */
        .chain-row{ display:flex; align-items:center; gap:6px; overflow-x:auto; padding:8px 4px 24px; }
        .chain-node{
          flex:0 0 auto; width:150px; background:var(--paper); border-radius:18px; padding:18px 14px;
          text-align:center; border:2px solid rgba(15,36,29,0.08); cursor:pointer;
          transition:border-color .2s ease, transform .2s ease; box-shadow:0 4px 14px -10px rgba(15,36,29,0.15);
        }
        .chain-node:hover{ transform:translateY(-4px); }
        .chain-node.visited{ border-color:var(--estuary); }
        .chain-node.active{ border-color:var(--amber); }
        .chain-node.removed{ opacity:0.35; filter:grayscale(1); border-style:dashed; }
        .chain-node .emoji{ font-size:1.8rem; display:block; margin-bottom:8px; }
        .chain-node .role{ font-family:'Space Mono', monospace; font-size:0.62rem; font-weight:700; text-transform:uppercase; color:var(--estuary); letter-spacing:0.05em; margin-bottom:4px; }
        .chain-node .label{ font-size:0.82rem; font-weight:700; color:var(--canopy); line-height:1.3; }
        .chain-arrow{ flex:0 0 auto; color:var(--silt); }
        .chain-arrow svg{ width:20px; height:20px; }
        .chain-info{
          background:var(--paper); border-radius:18px; padding:22px 24px; box-shadow:0 4px 16px -10px rgba(15,36,29,0.15);
          margin-bottom:8px; min-height:60px; display:flex; align-items:center;
        }
        .chain-info p{ font-size:0.92rem; color:#33473F; }
        .chain-info .empty{ color:#8A9A93; }

        .remove-panel{ background:var(--sand-deep); border-radius:var(--radius-lg); padding:28px; margin-top:28px; }
        .remove-panel h4{ font-size:1.02rem; margin-bottom:6px; }
        .remove-panel > p{ font-size:0.9rem; color:#556961; margin-bottom:18px; }
        .remove-btn-row{ display:flex; flex-wrap:wrap; gap:10px; }
        .remove-btn{
          padding:10px 16px; border-radius:999px; border:1.5px solid rgba(194,74,95,0.3);
          background:var(--paper); color:var(--danger); font-size:0.82rem; font-weight:700; cursor:pointer;
        }
        .remove-btn:hover{ background:#F8E4E7; }
        .cascade-box{
          margin-top:20px; background:var(--paper); border-radius:16px; padding:20px 22px;
          border-left:4px solid var(--danger);
        }
        .cascade-box p{ font-size:0.92rem; color:#33473F; }
        .cascade-box .tag{ font-family:'Space Mono', monospace; font-size:0.68rem; font-weight:700; color:var(--danger); text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:8px; }

        .materi-nav{ display:flex; justify-content:space-between; align-items:center; margin-top:60px; padding-top:30px; border-top:1px solid rgba(15,36,29,0.1); flex-wrap:wrap; gap:16px; }

        @media (max-width:980px){
          .diagram-wrap{ grid-template-columns:1fr; }
        }
        @media (max-width:768px){
          .page-banner{ padding:110px 0 44px; }
          .section{ padding:50px 0; }
          .quiz-box{ padding:24px 20px; }
          .diagram-node{ width:52px; height:52px; font-size:0.52rem; }
          .diagram-node.center{ width:68px; height:68px; font-size:0.58rem; }
          .diagram-node .emoji{ font-size:1rem; }
        }
        @media (max-width:600px){
          .container{ padding:0 20px; }
          .materi-nav{ flex-direction:column; align-items:stretch; }
          .page-banner h1{ font-size:1.6rem; }
          .section-head h2{ font-size:1.4rem; }
          .chain-node{ width:130px; }
        }
      `}</style>

      <Navbar />

      {/* ================= BANNER ================= */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb reveal">
            <Link to="/">Beranda</Link><span>/</span>
            <Link to="/materi">Materi</Link><span>/</span>
            <span className="current">Interaksi dalam Ekosistem</span>
          </div>
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Materi 2 dari 5</span>
          <h1 className="reveal">Interaksi dalam Ekosistem</h1>
          <p className="reveal">
            Jelajahi bagaimana komponen biotik dan abiotik saling terhubung,
            lalu telusuri rantai makanan dan pengaruhnya jika salah satu
            komponen hilang.
          </p>
        </div>
      </section>

      {/* ================= AKTIVITAS 1: DIAGRAM INTERAKSI ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Aktivitas 1</span>
            <h2>Diagram Interaksi Biotik &amp; Abiotik</h2>
            <p>Klik salah satu komponen untuk melihat bentuk interaksi dan perannya dalam ekosistem mangrove.</p>
          </div>

          <div className="diagram-wrap reveal">
            <div className="diagram-scene">
              <span className="diagram-progress">{visitedNodes.size}/{nodes.length} komponen dijelajahi</span>
              <svg className="edges" viewBox="0 0 100 100" preserveAspectRatio="none">
                {edges.map(([a, b], i) => {
                  const na = nodes.find((n) => n.id === a);
                  const nb = nodes.find((n) => n.id === b);
                  const hl = activeNode && (activeNode.id === a || activeNode.id === b);
                  return (
                    <line
                      key={i}
                      className={hl ? "hl" : ""}
                      x1={parseFloat(na.left)} y1={parseFloat(na.top)}
                      x2={parseFloat(nb.left)} y2={parseFloat(nb.top)}
                    />
                  );
                })}
              </svg>
              {nodes.map((n) => (
                <button
                  key={n.id}
                  className={`diagram-node${n.center ? " center" : ""}${visitedNodes.has(n.id) ? " visited" : ""}${activeNode?.id === n.id ? " active" : ""}`}
                  style={{ top: n.top, left: n.left }}
                  onClick={() => handleNodeClick(n)}
                >
                  <span className="emoji">{n.emoji}</span>
                  {n.label}
                </button>
              ))}
            </div>

            <div className="info-panel">
              {!activeNode && <p className="info-panel-empty">Klik salah satu node pada diagram untuk melihat perannya dalam ekosistem.</p>}
              {activeNode && (
                <>
                  <h3><span>{activeNode.emoji}</span> {activeNode.label}</h3>
                  <ul className="info-facts">
                    {activeNode.facts.map((f, i) => (
                      <li key={i}><CheckIcon />{f}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {!allNodesVisited && (
            <div className="quiz-locked reveal">
              <span style={{ fontSize: "1.3rem" }}>🔒</span>
              <span>Jelajahi semua komponen pada diagram di atas untuk membuka pertanyaan pemantik.</span>
            </div>
          )}
          {allNodesVisited && (
            <div className="quiz-box reveal">
              <span className="eyebrow">Pertanyaan Pemantik</span>
              <h3>{quiz1.question}</h3>
              {quiz1.options.map((opt, i) => {
                const state = !q1Submitted ? (q1Selected === i ? "selected" : "") : i === quiz1.correct ? "correct" : q1Selected === i ? "wrong" : "";
                return (
                  <button key={i} className={`quiz-option ${state}`} onClick={() => !q1Submitted && setQ1Selected(i)} disabled={q1Submitted}>
                    <span className="quiz-option-dot">
                      {q1Submitted && i === quiz1.correct && <CheckIcon />}
                      {q1Submitted && q1Selected === i && i !== quiz1.correct && <XIcon />}
                    </span>
                    {opt}
                  </button>
                );
              })}
              {!q1Submitted ? (
                <button className="btn btn-primary" disabled={q1Selected === null} onClick={() => setQ1Submitted(true)} style={{ marginTop: 8 }}>
                  Periksa Jawaban <ArrowIcon />
                </button>
              ) : (
                <div className={`quiz-feedback ${q1Selected === quiz1.correct ? "correct" : "wrong"}`}>
                  {q1Selected === quiz1.correct ? <CheckIcon /> : <XIcon />}
                  <span>{q1Selected === quiz1.correct ? quiz1.feedbackCorrect : quiz1.feedbackWrong}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================= AKTIVITAS 2: RANTAI MAKANAN ================= */}
      <section className="section" style={{ background: "var(--sand-deep)" }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Aktivitas 2</span>
            <h2>Rantai Makanan Ekosistem Mangrove</h2>
            <p>Klik tiap organisme untuk mengetahui peran dan hubungan makannya, lalu coba hilangkan satu komponen untuk melihat dampaknya.</p>
          </div>

          <div className="reveal">
            <div className="chain-row">
              {foodChain.map((n, i) => (
                <React.Fragment key={n.id}>
                  <div
                    className={`chain-node${visitedChain.has(n.id) ? " visited" : ""}${activeChainNode?.id === n.id ? " active" : ""}${removedNode === n.id ? " removed" : ""}`}
                    onClick={() => handleChainClick(n)}
                  >
                    <span className="emoji">{n.emoji}</span>
                    <span className="role">{n.role}</span>
                    <span className="label">{n.label}</span>
                  </div>
                  {i < foodChain.length - 1 && <span className="chain-arrow"><ArrowIcon /></span>}
                </React.Fragment>
              ))}
            </div>

            <div className="chain-info">
              {!activeChainNode && <p className="empty">Klik salah satu organisme di atas untuk melihat penjelasannya di sini.</p>}
              {activeChainNode && <p><strong>{activeChainNode.label}</strong> — {activeChainNode.desc}</p>}
            </div>

            <div className="remove-panel">
              <h4>Simulasi: Hilangkan Satu Komponen</h4>
              <p>Pilih salah satu komponen untuk dihilangkan dari rantai makanan, lalu amati dan prediksi dampaknya.</p>
              <div className="remove-btn-row">
                {foodChain.map((n) => (
                  <button key={n.id} className="remove-btn" onClick={() => handleRemove(n.id)} disabled={removedNode === n.id}>
                    Hilangkan {n.label}
                  </button>
                ))}
              </div>

              {removedNode && (
                <>
                  <div className="cascade-box">
                    <span className="tag">Perubahan yang Terjadi</span>
                    <p>{removeEffects[removedNode].cascade}</p>
                  </div>

                  <div className="quiz-box" style={{ marginTop: 20, padding: 26 }}>
                    <span className="eyebrow">Prediksi Dampak</span>
                    <h3 style={{ fontSize: "1.02rem" }}>Menurutmu, organisme mana yang paling terdampak akibat hilangnya {foodChain.find((n) => n.id === removedNode).label}?</h3>
                    {remainingNodes.map((n) => {
                      const state = !predictSubmitted
                        ? (predictSelected === n.id ? "selected" : "")
                        : n.id === removeEffects[removedNode].correct ? "correct" : predictSelected === n.id ? "wrong" : "";
                      return (
                        <button key={n.id} className={`quiz-option ${state}`} onClick={() => !predictSubmitted && setPredictSelected(n.id)} disabled={predictSubmitted}>
                          <span className="quiz-option-dot">
                            {predictSubmitted && n.id === removeEffects[removedNode].correct && <CheckIcon />}
                            {predictSubmitted && predictSelected === n.id && n.id !== removeEffects[removedNode].correct && <XIcon />}
                          </span>
                          {n.emoji} {n.label}
                        </button>
                      );
                    })}
                    {!predictSubmitted ? (
                      <button className="btn btn-primary" disabled={predictSelected === null} onClick={() => setPredictSubmitted(true)} style={{ marginTop: 8 }}>
                        Periksa Jawaban <ArrowIcon />
                      </button>
                    ) : (
                      <>
                        <div className={`quiz-feedback ${isPredictCorrect ? "correct" : "wrong"}`}>
                          {isPredictCorrect ? <CheckIcon /> : <XIcon />}
                          <span>
                            {isPredictCorrect
                              ? "Tepat! Kamu berhasil memprediksi organisme yang paling terdampak dari perubahan rantai makanan ini."
                              : `Belum tepat. Perhatikan lagi urutan rantai makanannya — organisme yang paling terdampak adalah ${foodChain.find((n) => n.id === removeEffects[removedNode].correct).label}.`}
                          </span>
                        </div>
                        <button className="btn btn-outline btn-sm" onClick={resetScenario} style={{ marginTop: 14 }}>
                          Coba Skenario Lain
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="materi-nav reveal">
            <Link to="/materi" className="btn btn-outline"><ArrowLeftIcon /> Daftar Materi</Link>
            <Link to="/materi/perubahan-lingkungan" className="btn btn-primary">
              Materi 3: Perubahan Lingkungan <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
