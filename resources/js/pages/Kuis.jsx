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
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12a8 8 0 0 1 14-5.2M20 12a8 8 0 0 1-14 5.2" />
    <path d="M17.5 3v4h-4M6.5 21v-4h4" />
  </svg>
);
const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4" />
    <path d="M12 14v3M9 21h6M10 17h4v4h-4z" />
  </svg>
);

/* ================= DATA SOAL ================= */
const questions = [
  {
    id: 1,
    type: "pg",
    q: "Jika kerapatan hutan mangrove di suatu kawasan menurun drastis akibat penebangan, apa yang paling mungkin terjadi pada risiko abrasi pantai di kawasan tersebut?",
    options: [
      "Risiko abrasi menurun karena air laut jadi lebih tenang",
      "Risiko abrasi meningkat karena akar penahan sedimen berkurang",
      "Tidak ada pengaruh karena abrasi hanya disebabkan oleh pasang laut",
      "Risiko abrasi tetap sama karena mangrove tidak berkaitan dengan garis pantai",
    ],
    correct: 1,
    explanation: "Akar mangrove menahan sedimen dan meredam energi gelombang. Saat kerapatannya berkurang, perlindungan alami itu hilang sehingga abrasi lebih mudah terjadi.",
  },
  {
    id: 2,
    type: "pg",
    q: "Manakah dari berikut yang termasuk komponen abiotik dalam ekosistem mangrove?",
    options: ["Kepiting bakau", "Burung bangau", "Salinitas air", "Akar pohon mangrove"],
    correct: 2,
    explanation: "Salinitas air adalah faktor fisik/kimia lingkungan (abiotik). Kepiting, burung, dan pohon mangrove tergolong komponen biotik karena merupakan makhluk hidup.",
  },
  {
    id: 3,
    type: "pg",
    q: "Dalam rantai makanan ekosistem mangrove, jika populasi ikan kecil menurun drastis akibat pencemaran, apa dampak paling mungkin terhadap populasi burung pemangsa ikan di kawasan itu?",
    options: [
      "Populasi burung pemangsa akan meningkat pesat",
      "Populasi burung pemangsa kemungkinan menurun karena sumber makanannya berkurang",
      "Tidak ada pengaruh karena burung bisa mencari makanan di tempat lain",
      "Populasi burung pemangsa akan berubah menjadi herbivora",
    ],
    correct: 1,
    explanation: "Burung pemangsa ikan bergantung pada ikan kecil sebagai sumber makanan utama, sehingga penurunan populasi ikan mengurangi ketersediaan makanannya.",
  },
  {
    id: 4,
    type: "pg",
    q: "Sebuah kawasan mangrove dialihfungsikan menjadi tambak udang. Apa akibat langsung yang paling mungkin terjadi terhadap garis pantai di sekitarnya?",
    options: [
      "Garis pantai akan semakin stabil karena tambak menahan air",
      "Garis pantai berpotensi mundur akibat berkurangnya vegetasi penahan sedimen",
      "Garis pantai tidak akan berubah karena tambak tidak memengaruhi laut",
      "Garis pantai akan meluas karena tambak menambah daratan",
    ],
    correct: 1,
    explanation: "Hilangnya vegetasi mangrove membuat kawasan pesisir kehilangan pelindung alami dari erosi, sehingga garis pantai berisiko mundur akibat abrasi.",
  },
  {
    id: 5,
    type: "pg",
    q: "Ekosistem mangrove dikenal sebagai penyimpan karbon yang sangat efektif. Istilah yang tepat untuk menyebut peran ini adalah…",
    options: ["Blue carbon", "Green carbon", "Deep carbon", "Solar carbon"],
    correct: 0,
    explanation: "Blue carbon adalah istilah untuk karbon yang tersimpan pada ekosistem pesisir seperti mangrove, lamun, dan rawa asin.",
  },
  {
    id: 6,
    type: "uraian",
    q: "Menurutmu, mengapa menjaga kerapatan vegetasi mangrove penting untuk melindungi kawasan pesisir? Jelaskan dengan kata-katamu sendiri, minimal dua kalimat.",
  },
];

const pgQuestions = questions.filter((q) => q.type === "pg");

export default function Kuis() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
  }, [submitted]);

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const answered =
    q.type === "pg" ? answers[q.id] !== undefined : (answers[q.id] || "").trim().length > 0;

  const selectOption = (idx) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [q.id]: idx }));
  };
  const setEssay = (val) => setAnswers((a) => ({ ...a, [q.id]: val }));

  const goNext = () => {
    if (isLast) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrent((c) => c + 1);
    }
  };
  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));

  const resetQuiz = () => {
    setAnswers({});
    setCurrent(0);
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const score = pgQuestions.reduce((acc, item) => (answers[item.id] === item.correct ? acc + 1 : acc), 0);
  const total = pgQuestions.length;
  const percent = Math.round((score / total) * 100);

  let category = { label: "Perlu Belajar Lagi", color: "#C24A5F", bg: "#F8E4E7" };
  if (score >= 4) category = { label: "Sangat Baik", color: "#2F6B57", bg: "#E4EFE7" };
  else if (score >= 2) category = { label: "Cukup Baik", color: "#CE8324", bg: "#FBEEDA" };

  const progressPct = Math.round(((current + 1) / questions.length) * 100);

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
          display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:999px;
          font-weight:700; font-size:0.92rem; cursor:pointer; border:none;
          transition:transform .25s ease, box-shadow .25s ease; font-family:'Plus Jakarta Sans', sans-serif;
        }
        .btn-primary{ background:var(--amber); color:var(--canopy); box-shadow:0 12px 24px -10px rgba(232,163,61,0.7); }
        .btn-primary:hover{ transform:translateY(-3px); }
        .btn-primary:disabled{ opacity:0.45; cursor:not-allowed; transform:none !important; box-shadow:none; }
        .btn-outline{ background:transparent; color:var(--estuary); border:1.5px solid rgba(47,107,87,0.3); }
        .btn-outline:hover{ background:var(--tide-pale); }

        /* ===== Banner ===== */
        .page-banner{ background:var(--canopy); padding:130px 0 60px; }
        .breadcrumb{ display:flex; align-items:center; gap:8px; font-size:0.85rem; color:rgba(251,250,245,0.65); margin-bottom:18px; }
        .breadcrumb a:hover{ color:var(--amber); }
        .breadcrumb span.current{ color:rgba(251,250,245,0.9); }
        .page-banner h1{ color:var(--paper); font-size:clamp(1.9rem,3.6vw,2.7rem); max-width:640px; margin-bottom:14px; }
        .page-banner p{ color:rgba(251,250,245,0.78); max-width:600px; }

        .section{ padding:64px 0 100px; }

        /* ===== Quiz shell ===== */
        .quiz-shell{ max-width:720px; margin:0 auto; }
        .quiz-progress-row{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; font-size:0.85rem; color:#556961; font-weight:600; }
        .quiz-progress-track{ height:8px; border-radius:999px; background:var(--sand-deep); overflow:hidden; margin-bottom:34px; }
        .quiz-progress-fill{ height:100%; border-radius:999px; background:var(--estuary); transition:width .4s ease; }

        .quiz-box{
          background:var(--paper); border-radius:var(--radius-lg); padding:38px 34px;
          border:1px solid rgba(15,36,29,0.06); box-shadow:0 20px 40px -24px rgba(15,36,29,0.2);
        }
        .quiz-type-tag{
          display:inline-block; font-size:0.72rem; font-weight:700; color:var(--silt);
          background:var(--sand); padding:4px 10px; border-radius:999px; margin-bottom:16px;
        }
        .quiz-box h3{ font-size:1.2rem; margin-bottom:24px; line-height:1.45; }

        .quiz-option{
          display:flex; align-items:center; gap:12px; width:100%; text-align:left;
          padding:15px 18px; border-radius:14px; border:1.5px solid rgba(15,36,29,0.12);
          background:var(--sand); margin-bottom:10px; cursor:pointer; font-size:0.92rem;
          transition:border-color .2s ease, background .2s ease;
        }
        .quiz-option:hover{ border-color:var(--estuary); }
        .quiz-option.selected{ border-color:var(--estuary); background:var(--tide-pale); font-weight:600; }
        .quiz-option-dot{
          width:22px; height:22px; border-radius:50%; border:1.5px solid rgba(15,36,29,0.2);
          flex-shrink:0; display:flex; align-items:center; justify-content:center;
          font-family:'Space Mono', monospace; font-size:0.72rem; color:#556961;
        }
        .quiz-option.selected .quiz-option-dot{ border-color:var(--estuary); background:var(--estuary); color:var(--paper); }

        .quiz-essay{
          width:100%; min-height:140px; border-radius:14px; border:1.5px solid rgba(15,36,29,0.12);
          background:var(--sand); padding:16px 18px; font-size:0.94rem; font-family:'Plus Jakarta Sans', sans-serif;
          resize:vertical; color:var(--ink);
        }
        .quiz-essay:focus{ outline:none; border-color:var(--estuary); }
        .quiz-hint{ font-size:0.78rem; color:#8A9A93; margin-top:8px; }

        .quiz-nav-row{ display:flex; justify-content:space-between; align-items:center; margin-top:26px; }

        /* ===== Result ===== */
        .result-hero{ text-align:center; margin-bottom:40px; }
        .result-ring{
          width:130px; height:130px; border-radius:50%; margin:0 auto 20px;
          display:flex; align-items:center; justify-content:center; flex-direction:column;
          background:conic-gradient(var(--estuary) ${percent * 3.6}deg, var(--sand-deep) 0deg);
        }
        .result-ring-inner{
          width:104px; height:104px; border-radius:50%; background:var(--paper);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
        }
        .result-ring-inner strong{ font-family:'Fraunces', serif; font-size:1.6rem; color:var(--canopy); }
        .result-ring-inner span{ font-size:0.7rem; color:#8A9A93; }
        .result-badge{
          display:inline-flex; align-items:center; gap:8px; padding:9px 20px; border-radius:999px;
          font-weight:700; font-size:0.92rem; margin-bottom:10px;
        }
        .result-hero p{ color:#556961; max-width:460px; margin:10px auto 0; font-size:0.94rem; }

        .review-item{
          background:var(--paper); border-radius:18px; padding:22px 24px; margin-bottom:16px;
          border:1px solid rgba(15,36,29,0.06);
        }
        .review-item h4{ font-size:0.98rem; margin-bottom:14px; line-height:1.5; }
        .review-option{
          display:flex; align-items:center; gap:10px; padding:11px 14px; border-radius:12px;
          font-size:0.88rem; margin-bottom:8px; background:var(--sand);
        }
        .review-option.correct{ background:#E4EFE7; color:var(--canopy); font-weight:600; }
        .review-option.wrong{ background:#F8E4E7; color:#7A2E3C; font-weight:600; }
        .review-option svg{ width:16px; height:16px; flex-shrink:0; }
        .review-explain{
          margin-top:12px; padding:14px 16px; border-radius:12px; background:var(--tide-pale);
          font-size:0.85rem; color:#33473F; line-height:1.6;
        }
        .review-essay-box{
          margin-top:8px; padding:16px 18px; border-radius:12px; background:var(--sand);
          font-size:0.9rem; color:#33473F; font-style:italic; line-height:1.65;
        }
        .review-note{ font-size:0.78rem; color:#8A9A93; margin-top:10px; }

        .result-actions{ display:flex; gap:14px; justify-content:center; margin-top:36px; flex-wrap:wrap; }

        @media (max-width:600px){
          .container{ padding:0 20px; }
          .quiz-box{ padding:26px 20px; }
          .result-actions{ flex-direction:column; align-items:stretch; }
        }
      `}</style>

      <Navbar />

      {/* ================= BANNER ================= */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb reveal">
            <Link to="/">Beranda</Link><span>/</span>
            <span className="current">Kuis</span>
          </div>
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Uji Pemahamanmu</span>
          <h1 className="reveal">Kuis Berpikir Kausal</h1>
          <p className="reveal">
            Enam soal yang mengukur kemampuanmu mengidentifikasi penyebab,
            akibat, dan hubungan antar variabel dalam ekosistem mangrove.
          </p>
        </div>
      </section>

      {/* ================= KUIS ================= */}
      <section className="section">
        <div className="container quiz-shell">
          {!submitted ? (
            <>
              <div className="quiz-progress-row">
                <span>Soal {current + 1} dari {questions.length}</span>
                <span>{progressPct}%</span>
              </div>
              <div className="quiz-progress-track">
                <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>

              <div className="quiz-box reveal show">
                <span className="quiz-type-tag">{q.type === "pg" ? "Pilihan Ganda" : "Uraian"}</span>
                <h3>{q.q}</h3>

                {q.type === "pg" ? (
                  q.options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`quiz-option ${answers[q.id] === i ? "selected" : ""}`}
                      onClick={() => selectOption(i)}
                    >
                      <span className="quiz-option-dot">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  ))
                ) : (
                  <>
                    <textarea
                      className="quiz-essay"
                      placeholder="Tulis jawabanmu di sini..."
                      value={answers[q.id] || ""}
                      onChange={(e) => setEssay(e.target.value)}
                    />
                    <div className="quiz-hint">Jawaban uraian ditinjau sebagai latihan reflektif dan tidak memengaruhi skor pilihan ganda.</div>
                  </>
                )}

                <div className="quiz-nav-row">
                  <button className="btn btn-outline" onClick={goPrev} disabled={current === 0} style={{ opacity: current === 0 ? 0.4 : 1 }}>
                    <ArrowLeftIcon /> Sebelumnya
                  </button>
                  <button className="btn btn-primary" onClick={goNext} disabled={!answered}>
                    {isLast ? "Selesai & Lihat Hasil" : "Lanjut"} <ArrowIcon />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="result-hero reveal show">
                <div className="result-ring">
                  <div className="result-ring-inner">
                    <strong>{score}/{total}</strong>
                    <span>BENAR</span>
                  </div>
                </div>
                <div className="result-badge" style={{ color: category.color, background: category.bg }}>
                  <TrophyIcon /> {category.label}
                </div>
                <p>
                  Kamu menjawab benar {score} dari {total} soal pilihan ganda ({percent}%).
                  Lihat ulasan tiap soal di bawah untuk memahami hubungan sebab-akibatnya.
                </p>
              </div>

              {pgQuestions.map((item) => {
                const userAns = answers[item.id];
                const isCorrect = userAns === item.correct;
                return (
                  <div className="review-item reveal show" key={item.id}>
                    <h4>{item.q}</h4>
                    {item.options.map((opt, i) => {
                      let cls = "";
                      if (i === item.correct) cls = "correct";
                      else if (i === userAns) cls = "wrong";
                      return (
                        <div className={`review-option ${cls}`} key={i}>
                          {i === item.correct && <CheckIcon />}
                          {i === userAns && i !== item.correct && <XIcon />}
                          {opt}
                        </div>
                      );
                    })}
                    <div className="review-explain">{item.explanation}</div>
                    {!isCorrect && userAns === undefined && (
                      <div className="review-note">Belum dijawab.</div>
                    )}
                  </div>
                );
              })}

              <div className="review-item reveal show">
                <h4>{questions.find((q2) => q2.type === "uraian").q}</h4>
                <div className="review-essay-box">
                  {answers[6] && answers[6].trim().length > 0 ? `"${answers[6]}"` : "Belum dijawab."}
                </div>
                <div className="review-note">Jawaban uraian tidak memengaruhi skor — gunakan sebagai bahan refleksi.</div>
              </div>

              <div className="result-actions">
                <button className="btn btn-outline" onClick={resetQuiz}><RefreshIcon /> Ulangi Kuis</button>
                <Link to="/dashboard" className="btn btn-primary">Lihat Dasbor <ArrowIcon /></Link>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
