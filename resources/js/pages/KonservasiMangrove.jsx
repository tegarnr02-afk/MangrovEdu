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
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 2 20h20L12 3Z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);

/* ================= DATA: ANCAMAN KELESTARIAN MANGROVE ================= */
const ancamanList = [
  { id: "penebangan", label: "Penebangan Liar", desc: "Pohon mangrove ditebangi untuk kayu bakar atau bahan bangunan tanpa upaya penanaman kembali." },
  { id: "tambak", label: "Alih Fungsi Lahan Tambak", desc: "Kawasan mangrove dibuka menjadi tambak udang atau ikan, sehingga vegetasi aslinya hilang." },
  { id: "sampah", label: "Sampah Plastik", desc: "Sampah yang terbawa aliran sungai menumpuk di sekitar akar mangrove dan mengganggu pertumbuhannya." },
  { id: "reklamasi", label: "Reklamasi Pantai", desc: "Kawasan mangrove ditimbun untuk perluasan lahan pembangunan di wilayah pesisir." },
];

/* ================= DATA: SKENARIO INTERAKTIF ================= */
const skenario = {
  prompt: "Kawasan mangrove di desamu mulai rusak akibat penebangan liar. Sebagai warga yang peduli, tindakan apa yang akan kamu ambil?",
  actions: [
    {
      id: "tanam", label: "Menanam kembali bibit mangrove bersama warga sekitar", level: "baik",
      consequence: "Langkah ini membantu memulihkan kawasan secara bertahap. Bibit yang ditanam akan tumbuh menjadi penahan alami gelombang dalam beberapa tahun ke depan.",
      info: "Mangrove yang sehat berfungsi sebagai penyimpan karbon dalam jumlah besar — jauh lebih efisien dibanding banyak hutan daratan.",
    },
    {
      id: "lapor", label: "Melaporkan ke dinas lingkungan sekaligus mengajak warga menanam bersama", level: "baik",
      consequence: "Langkah ini paling efektif karena melibatkan pihak berwenang sekaligus partisipasi warga, sehingga pemulihan dapat berjalan lebih terorganisir dan berkelanjutan.",
      info: "Mangrove menjadi habitat penting bagi ikan dan udang di tahap pertumbuhan awal (nursery ground), yang berdampak langsung pada hasil tangkapan nelayan setempat.",
    },
    {
      id: "diam", label: "Membiarkan saja karena dianggap bukan urusan pribadi", level: "buruk",
      consequence: "Kerusakan akan terus berlanjut tanpa ada upaya pemulihan. Kawasan pesisir semakin kehilangan pelindung alaminya dari abrasi dan gelombang.",
      info: "Mangrove berperan sebagai bagian dari perlindungan kawasan pesisir — tanpa penanganan, risiko abrasi dan banjir rob akan terus meningkat.",
    },
    {
      id: "tebang", label: "Menebang sisa pohon yang ada untuk dijadikan bahan bangunan", level: "buruk",
      consequence: "Tindakan ini justru mempercepat kerusakan. Kawasan akan kehilangan seluruh vegetasi pelindungnya dan semakin rentan terhadap abrasi.",
      info: "Akar mangrove yang hilang berarti hilangnya penahan sedimen dan peredam gelombang — pemulihannya bisa memakan waktu bertahun-tahun.",
    },
  ],
};

/* ================= PERTANYAAN PEMANTIK 1 ================= */
const quiz1 = {
  question: "Dari keempat ancaman di atas, apa benang merah yang membuat semuanya bisa mengancam kelestarian ekosistem mangrove?",
  options: [
    "Semuanya terjadi secara alami tanpa campur tangan manusia",
    "Semuanya melibatkan aktivitas manusia yang mengurangi luas atau kualitas kawasan mangrove",
    "Semuanya hanya berdampak pada manusia, bukan pada ekosistem",
  ],
  correct: 1,
  feedbackCorrect: "Tepat! Keempat ancaman ini sama-sama berasal dari aktivitas manusia yang mengurangi luas atau kualitas kawasan mangrove.",
  feedbackWrong: "Belum tepat. Coba amati lagi keempat ancaman di atas — perhatikan siapa pelaku di balik masing-masing ancaman tersebut.",
};

/* ================= PERTANYAAN PEMANTIK PENUTUP ================= */
const quiz2 = {
  question: "Bagaimana kondisi kelestarian mangrove dapat berkaitan dengan tingkat perlindungan kawasan pesisir?",
  options: [
    "Tidak ada hubungannya sama sekali dengan perlindungan pesisir",
    "Semakin lestari kondisi mangrove, semakin kuat perlindungan alami yang didapat kawasan pesisir dari gelombang dan abrasi",
    "Kondisi mangrove hanya penting untuk keindahan pemandangan pesisir",
  ],
  correct: 1,
  feedbackCorrect: "Tepat! Semakin lestari kondisi mangrove, semakin kuat perlindungan alami yang didapat kawasan pesisir. Yuk, uji hubungan ini langsung di Laboratorium Virtual!",
  feedbackWrong: "Belum tepat. Ingat kembali peran akar mangrove dalam meredam gelombang dan menahan sedimen sepanjang materi ini.",
};

export default function KonservasiMangrove() {
  const [activeAncaman, setActiveAncaman] = useState(null);
  const [visitedAncaman, setVisitedAncaman] = useState(new Set());
  const [q1Selected, setQ1Selected] = useState(null);
  const [q1Submitted, setQ1Submitted] = useState(false);

  const [selectedAction, setSelectedAction] = useState(null);

  const [q2Selected, setQ2Selected] = useState(null);
  const [q2Submitted, setQ2Submitted] = useState(false);

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

  const handleAncamanClick = (a) => {
    setActiveAncaman(a);
    setVisitedAncaman((prev) => new Set(prev).add(a.id));
  };
  const allAncamanVisited = visitedAncaman.size === ancamanList.length;

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

        /* ===== Ancaman kelestarian ===== */
        .ancaman-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .ancaman-card{
          background:var(--paper); border-radius:16px; padding:20px 16px; text-align:center; cursor:pointer;
          border:2px solid rgba(15,36,29,0.06); transition:border-color .2s ease, transform .2s ease;
          box-shadow:0 4px 14px -10px rgba(15,36,29,0.12);
        }
        .ancaman-card:hover{ transform:translateY(-4px); }
        .ancaman-card.visited{ border-color:var(--estuary); }
        .ancaman-card.active{ border-color:var(--amber); }
        .ancaman-icon{
          width:44px; height:44px; border-radius:50%; background:#F8E4E7; color:var(--danger);
          display:flex; align-items:center; justify-content:center; margin:0 auto 12px;
        }
        .ancaman-icon svg{ width:20px; height:20px; }
        .ancaman-card span{ font-size:0.82rem; font-weight:700; color:var(--canopy); }
        .ancaman-detail{
          margin-top:20px; background:var(--paper); border-radius:16px; padding:20px 22px;
          border-left:4px solid var(--danger); min-height:40px; display:flex; align-items:center;
        }
        .ancaman-detail p{ font-size:0.92rem; color:#33473F; }
        .ancaman-detail .empty{ color:#8A9A93; }

        /* ===== Pertanyaan pemantik ===== */
        .quiz-box{ background:var(--paper); border-radius:var(--radius-lg); padding:34px; box-shadow:0 20px 40px -24px rgba(15,36,29,0.28); margin-top:30px; }
        .quiz-locked{ background:var(--sand-deep); border-radius:var(--radius-lg); padding:26px 32px; margin-top:30px; color:#5F726A; font-size:0.92rem; display:flex; align-items:center; gap:14px; }
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

        /* ===== Skenario interaktif ===== */
        .skenario-prompt{ background:var(--canopy); color:var(--paper); border-radius:var(--radius-lg); padding:28px 30px; margin-bottom:24px; }
        .skenario-prompt .eyebrow{ color:var(--amber); margin-bottom:10px; }
        .skenario-prompt p{ font-size:1rem; line-height:1.7; }
        .skenario-actions{ display:flex; flex-direction:column; gap:12px; margin-bottom:24px; }
        .skenario-action{
          display:flex; align-items:center; gap:14px; text-align:left; width:100%;
          padding:17px 20px; border-radius:16px; border:1.5px solid rgba(15,36,29,0.12);
          background:var(--paper); cursor:pointer; font-size:0.92rem; color:var(--canopy);
          transition:border-color .2s ease, background .2s ease;
        }
        .skenario-action:hover{ border-color:var(--estuary); }
        .skenario-action.selected.baik{ border-color:var(--estuary); background:#E4EFE7; }
        .skenario-action.selected.buruk{ border-color:var(--danger); background:#F8E4E7; }
        .skenario-action-dot{ width:24px; height:24px; border-radius:50%; border:1.5px solid rgba(15,36,29,0.2); flex-shrink:0; display:flex; align-items:center; justify-content:center; }

        .konsekuensi-box{ border-radius:16px; padding:22px 24px; margin-bottom:16px; display:flex; gap:14px; align-items:flex-start; }
        .konsekuensi-box.baik{ background:#E4EFE7; }
        .konsekuensi-box.buruk{ background:#F8E4E7; }
        .konsekuensi-box svg{ width:22px; height:22px; flex-shrink:0; margin-top:2px; }
        .konsekuensi-box.baik svg{ color:var(--estuary); }
        .konsekuensi-box.buruk svg{ color:var(--danger); }
        .konsekuensi-box .tag{ font-family:'Space Mono', monospace; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:6px; }
        .konsekuensi-box.baik .tag{ color:var(--estuary); }
        .konsekuensi-box.buruk .tag{ color:var(--danger); }
        .konsekuensi-box p{ font-size:0.92rem; color:#33473F; }

        .info-box{ background:var(--tide-pale); border-radius:16px; padding:20px 22px; display:flex; gap:14px; align-items:flex-start; }
        .info-box svg{ width:20px; height:20px; color:var(--estuary); flex-shrink:0; margin-top:2px; }
        .info-box .tag{ font-family:'Space Mono', monospace; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--estuary); display:block; margin-bottom:6px; }
        .info-box p{ font-size:0.9rem; color:#2A3F37; }

        .materi-nav{ display:flex; justify-content:space-between; align-items:center; margin-top:60px; padding-top:30px; border-top:1px solid rgba(15,36,29,0.1); flex-wrap:wrap; gap:16px; }
        .lab-cta{
          background:linear-gradient(135deg, var(--estuary) 0%, var(--canopy) 100%); color:var(--paper);
          border-radius:var(--radius-lg); padding:32px 34px; margin-top:30px;
          display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;
        }
        .lab-cta h3{ color:var(--paper); font-size:1.2rem; margin-bottom:6px; }
        .lab-cta p{ color:rgba(251,250,245,0.8); font-size:0.9rem; max-width:420px; }

        @media (max-width:980px){
          .ancaman-grid{ grid-template-columns:repeat(2,1fr); }
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
          .lab-cta{ flex-direction:column; align-items:flex-start; }
        }
      `}</style>

      <Navbar />

      {/* ================= BANNER ================= */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb reveal">
            <Link to="/">Beranda</Link><span>/</span>
            <Link to="/materi">Materi</Link><span>/</span>
            <span className="current">Konservasi Mangrove</span>
          </div>
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Materi 5 dari 5</span>
          <h1 className="reveal">Konservasi Mangrove</h1>
          <p className="reveal">
            Kenali ancaman yang membahayakan kelestarian mangrove, lalu uji
            keputusanmu lewat skenario konservasi interaktif.
          </p>
        </div>
      </section>

      {/* ================= AKTIVITAS 1: ANCAMAN KELESTARIAN ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Aktivitas 1</span>
            <h2>Ancaman terhadap Kelestarian Mangrove</h2>
            <p>Klik tiap kartu untuk mengenali permasalahan yang dapat mengancam ekosistem mangrove.</p>
          </div>

          <div className="ancaman-grid reveal">
            {ancamanList.map((a) => (
              <button
                key={a.id}
                className={`ancaman-card${visitedAncaman.has(a.id) ? " visited" : ""}${activeAncaman?.id === a.id ? " active" : ""}`}
                onClick={() => handleAncamanClick(a)}
              >
                <div className="ancaman-icon"><AlertIcon /></div>
                <span>{a.label}</span>
              </button>
            ))}
          </div>

          <div className="ancaman-detail reveal">
            {!activeAncaman && <p className="empty">Klik salah satu kartu di atas untuk melihat penjelasannya.</p>}
            {activeAncaman && <p><strong>{activeAncaman.label}</strong> — {activeAncaman.desc}</p>}
          </div>

          {!allAncamanVisited && (
            <div className="quiz-locked reveal">
              <span style={{ fontSize: "1.3rem" }}>🔒</span>
              <span>Kenali keempat ancaman di atas untuk membuka pertanyaan pemantik.</span>
            </div>
          )}
          {allAncamanVisited && (
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

      {/* ================= AKTIVITAS 2: SKENARIO INTERAKTIF ================= */}
      {q1Submitted && (
        <section className="section" style={{ background: "var(--sand-deep)" }}>
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Aktivitas 2</span>
              <h2>Skenario Konservasi</h2>
              <p>Pilih tindakan yang menurutmu paling tepat, lalu amati konsekuensinya.</p>
            </div>

            <div className="reveal">
              <div className="skenario-prompt">
                <span className="eyebrow">Skenario</span>
                <p>{skenario.prompt}</p>
              </div>

              <div className="skenario-actions">
                {skenario.actions.map((a) => (
                  <button
                    key={a.id}
                    className={`skenario-action${selectedAction?.id === a.id ? ` selected ${a.level}` : ""}`}
                    onClick={() => setSelectedAction(a)}
                  >
                    <span className="skenario-action-dot">
                      {selectedAction?.id === a.id && <CheckIcon />}
                    </span>
                    {a.label}
                  </button>
                ))}
              </div>

              {selectedAction && (
                <>
                  <div className={`konsekuensi-box ${selectedAction.level}`}>
                    {selectedAction.level === "baik" ? <CheckIcon /> : <AlertIcon />}
                    <div>
                      <span className="tag">{selectedAction.level === "baik" ? "Konsekuensi Positif" : "Konsekuensi Negatif"}</span>
                      <p>{selectedAction.consequence}</p>
                    </div>
                  </div>
                  <div className="info-box">
                    <InfoIcon />
                    <div>
                      <span className="tag">Tahukah Kamu?</span>
                      <p>{selectedAction.info}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {selectedAction && (
              <div className="quiz-box reveal">
                <span className="eyebrow">Pertanyaan Pemantik Penutup</span>
                <h3>{quiz2.question}</h3>
                {quiz2.options.map((opt, i) => {
                  const state = !q2Submitted ? (q2Selected === i ? "selected" : "") : i === quiz2.correct ? "correct" : q2Selected === i ? "wrong" : "";
                  return (
                    <button key={i} className={`quiz-option ${state}`} onClick={() => !q2Submitted && setQ2Selected(i)} disabled={q2Submitted}>
                      <span className="quiz-option-dot">
                        {q2Submitted && i === quiz2.correct && <CheckIcon />}
                        {q2Submitted && q2Selected === i && i !== quiz2.correct && <XIcon />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
                {!q2Submitted ? (
                  <button className="btn btn-primary" disabled={q2Selected === null} onClick={() => setQ2Submitted(true)} style={{ marginTop: 8 }}>
                    Periksa Jawaban <ArrowIcon />
                  </button>
                ) : (
                  <div className={`quiz-feedback ${q2Selected === quiz2.correct ? "correct" : "wrong"}`}>
                    {q2Selected === quiz2.correct ? <CheckIcon /> : <XIcon />}
                    <span>{q2Selected === quiz2.correct ? quiz2.feedbackCorrect : quiz2.feedbackWrong}</span>
                  </div>
                )}
              </div>
            )}

            {q2Submitted && (
              <div className="lab-cta reveal">
                <div>
                  <h3>Saatnya Menguji di Laboratorium Virtual</h3>
                  <p>Coba manipulasi kerapatan mangrove dan tinggi gelombang untuk melihat langsung hubungan antara vegetasi mangrove dan perlindungan pesisir.</p>
                </div>
                <Link to="/lab" className="btn btn-primary">
                  Buka Laboratorium Virtual <ArrowIcon />
                </Link>
              </div>
            )}

            <div className="materi-nav reveal">
              <Link to="/materi" className="btn btn-outline"><ArrowLeftIcon /> Daftar Materi</Link>
              <Link to="/lab" className="btn btn-outline">
                Laboratorium Virtual <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
