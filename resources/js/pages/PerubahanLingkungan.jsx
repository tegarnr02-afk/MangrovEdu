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
const AxeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20 15 9" />
    <path d="M13 3c3 0 6 2 7 5-3 1-6 0-8-2-1-1-1-2 1-3Z" />
  </svg>
);
const DropIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c4 5 7 9 7 12.5A7 7 0 0 1 5 15.5C5 12 8 8 12 3Z" />
  </svg>
);
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="9" width="7" height="12" />
    <rect x="13" y="4" width="7" height="17" />
    <path d="M6.5 12h2M6.5 15h2M6.5 18h2M15.5 7h2M15.5 10h2M15.5 13h2M15.5 16h2" />
  </svg>
);

/* ================= DATA: FENOMENA PERUBAHAN LINGKUNGAN ================= */
const fenomena = [
  {
    id: "penebangan",
    title: "Penebangan Mangrove",
    icon: <AxeIcon />,
    accent: "#C24A5F",
    accentBg: "#F8E4E7",
    ilustrasi: "Kawasan mangrove yang lebat ditebangi untuk membuka lahan tambak dan permukiman.",
    quiz: {
      question: "Apa dampak yang paling mungkin terjadi jika sebagian besar pohon mangrove di suatu kawasan ditebang?",
      options: [
        "Garis pantai menjadi lebih terlindungi dari gelombang",
        "Kawasan pesisir kehilangan penahan alami dan lebih rentan terhadap abrasi",
        "Populasi ikan dan kepiting di sekitar area tersebut akan meningkat",
      ],
      correct: 1,
      feedbackCorrect: "Tepat! Tanpa akar mangrove yang menahan sedimen dan meredam gelombang, kawasan pesisir jadi jauh lebih rentan abrasi.",
      feedbackWrong: "Belum tepat. Ingat kembali peran akar mangrove sebagai penahan alami gelombang dan sedimen pantai.",
    },
    chain: [
      { title: "Penyebab", desc: "Pohon mangrove ditebang untuk membuka lahan tambak, permukiman, atau kayu bakar." },
      { title: "Akibat Langsung", desc: "Akar-akar yang biasa menahan sedimen dan meredam gelombang ikut hilang." },
      { title: "Akibat Lanjutan", desc: "Garis pantai lebih mudah terkikis air laut karena tidak ada lagi penahan alami." },
      { title: "Dampak pada Ekosistem", desc: "Hewan yang bergantung pada akar mangrove sebagai habitat kehilangan tempat tinggal dan sumber makanan." },
    ],
  },
  {
    id: "pencemaran",
    title: "Pencemaran",
    icon: <DropIcon />,
    accent: "#1E8A8C",
    accentBg: "#E1F1F1",
    ilustrasi: "Limbah rumah tangga dan sampah plastik menumpuk di sekitar akar mangrove dan aliran air.",
    quiz: {
      question: "Bagaimana pencemaran limbah dapat memengaruhi kehidupan di ekosistem mangrove?",
      options: [
        "Tidak berpengaruh karena mangrove tahan terhadap segala jenis limbah",
        "Menurunkan kualitas air dan lumpur sehingga mengganggu pertumbuhan mangrove serta biota di dalamnya",
        "Membantu mangrove tumbuh lebih cepat karena mendapat tambahan nutrisi",
      ],
      correct: 1,
      feedbackCorrect: "Benar! Limbah dan sampah menurunkan kualitas air dan lumpur, mengganggu pertumbuhan mangrove serta kehidupan biota di sekitarnya.",
      feedbackWrong: "Belum tepat. Pikirkan bagaimana kualitas air dan lumpur yang tercemar memengaruhi makhluk hidup yang bergantung padanya.",
    },
    chain: [
      { title: "Penyebab", desc: "Limbah rumah tangga, industri, dan sampah plastik dibuang ke aliran air menuju kawasan mangrove." },
      { title: "Akibat Langsung", desc: "Kualitas air dan lumpur menurun akibat kandungan zat pencemar yang terakumulasi." },
      { title: "Akibat Lanjutan", desc: "Pertumbuhan pohon mangrove terganggu, dan sebagian biota kesulitan bertahan hidup." },
      { title: "Dampak pada Ekosistem", desc: "Rantai makanan terganggu karena populasi biota dasar seperti kepiting dan kerang ikut menurun." },
    ],
  },
  {
    id: "pembangunan",
    title: "Pembangunan Pesisir",
    icon: <BuildingIcon />,
    accent: "#6C63B5",
    accentBg: "#EAE8F6",
    ilustrasi: "Kawasan mangrove direklamasi dan diubah menjadi area pembangunan pelabuhan atau pemukiman pesisir.",
    quiz: {
      question: "Apa kemungkinan dampak jangka panjang dari alih fungsi kawasan mangrove menjadi area pembangunan?",
      options: [
        "Kawasan pesisir akan semakin stabil dan aman dari abrasi",
        "Luas habitat alami berkurang dan risiko abrasi serta banjir rob meningkat",
        "Tidak ada dampak karena pembangunan tidak berhubungan dengan ekosistem",
      ],
      correct: 1,
      feedbackCorrect: "Tepat! Berkurangnya luas kawasan mangrove berarti hilangnya penahan alami, sehingga risiko abrasi dan banjir rob meningkat.",
      feedbackWrong: "Belum tepat. Coba pikirkan kembali fungsi mangrove sebagai pelindung alami kawasan pesisir.",
    },
    chain: [
      { title: "Penyebab", desc: "Kawasan mangrove direklamasi untuk pembangunan pelabuhan, jalan, atau permukiman pesisir." },
      { title: "Akibat Langsung", desc: "Luas kawasan mangrove menyusut drastis dalam waktu singkat." },
      { title: "Akibat Lanjutan", desc: "Kawasan pesisir kehilangan penahan alami dari gelombang dan pasang air laut." },
      { title: "Dampak pada Ekosistem", desc: "Risiko abrasi dan banjir rob meningkat, sekaligus menghilangkan habitat berbagai biota pesisir." },
    ],
  },
];

export default function PerubahanLingkungan() {
  const [selected, setSelected] = useState(null);
  const [qSelected, setQSelected] = useState(null);
  const [qSubmitted, setQSubmitted] = useState(false);
  const [openStep, setOpenStep] = useState(null);

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

  const pickFenomena = (f) => {
    setSelected(f);
    setQSelected(null);
    setQSubmitted(false);
    setOpenStep(null);
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

        /* ===== Fenomena cards ===== */
        .fenomena-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
        .fenomena-card{
          background:var(--paper); border-radius:20px; padding:26px; text-align:left; cursor:pointer;
          border:2px solid rgba(15,36,29,0.06); box-shadow:0 4px 16px -10px rgba(15,36,29,0.12);
          transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .fenomena-card:hover{ transform:translateY(-6px); box-shadow:0 18px 30px -18px rgba(15,36,29,0.24); }
        .fenomena-card.active{ border-color:var(--accent); }
        .fenomena-icon{
          width:48px; height:48px; border-radius:14px; background:var(--accent-bg); color:var(--accent);
          display:flex; align-items:center; justify-content:center; margin-bottom:16px;
        }
        .fenomena-icon svg{ width:24px; height:24px; }
        .fenomena-card h4{ font-size:1.05rem; margin-bottom:10px; }
        .fenomena-card p{ font-size:0.88rem; color:#556961; line-height:1.6; }
        .fenomena-select-tag{ margin-top:14px; font-size:0.78rem; font-weight:700; color:var(--accent); display:inline-flex; align-items:center; gap:6px; }

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

        /* ===== Diagram sebab-akibat ===== */
        .chain-diagram{ margin-top:30px; }
        .chain-diagram-head{ display:flex; align-items:center; gap:10px; margin-bottom:16px; }
        .chain-step{
          background:var(--paper); border-radius:16px; margin-bottom:12px; overflow:hidden;
          border:1.5px solid rgba(15,36,29,0.08); box-shadow:0 4px 14px -10px rgba(15,36,29,0.12);
        }
        .chain-step-head{
          display:flex; align-items:center; gap:14px; padding:18px 20px; cursor:pointer; user-select:none;
        }
        .chain-step-num{
          width:32px; height:32px; border-radius:50%; background:var(--tide-pale); color:var(--estuary);
          display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem; flex-shrink:0;
          font-family:'Space Mono', monospace;
        }
        .chain-step.open .chain-step-num{ background:var(--estuary); color:var(--paper); }
        .chain-step-title{ font-weight:700; font-size:0.95rem; color:var(--canopy); flex:1; }
        .chain-step-toggle{ color:var(--silt); transition:transform .25s ease; }
        .chain-step.open .chain-step-toggle{ transform:rotate(90deg); }
        .chain-step-toggle svg{ width:16px; height:16px; }
        .chain-step-body{ max-height:0; overflow:hidden; transition:max-height .3s ease; }
        .chain-step.open .chain-step-body{ max-height:200px; }
        .chain-step-body p{ padding:0 20px 20px 66px; font-size:0.9rem; color:#4C5F58; }
        .chain-connector{ width:2px; height:14px; background:rgba(15,36,29,0.15); margin-left:36px; }

        .materi-nav{ display:flex; justify-content:space-between; align-items:center; margin-top:60px; padding-top:30px; border-top:1px solid rgba(15,36,29,0.1); flex-wrap:wrap; gap:16px; }

        @media (max-width:980px){
          .fenomena-grid{ grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width:768px){
          .page-banner{ padding:110px 0 44px; }
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

      {/* ================= BANNER ================= */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb reveal">
            <Link to="/">Beranda</Link><span>/</span>
            <Link to="/materi">Materi</Link><span>/</span>
            <span className="current">Perubahan Lingkungan</span>
          </div>
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Materi 3 dari 5</span>
          <h1 className="reveal">Perubahan Lingkungan</h1>
          <p className="reveal">
            Amati fenomena perubahan lingkungan pada ekosistem mangrove akibat
            faktor alam maupun aktivitas manusia, lalu telusuri hubungan
            sebab-akibatnya.
          </p>
        </div>
      </section>

      {/* ================= AKTIVITAS: FENOMENA PERUBAHAN ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Aktivitas</span>
            <h2>Pilih Fenomena Perubahan Lingkungan</h2>
            <p>Klik salah satu kartu di bawah untuk mempelajari fenomena tersebut lebih dalam.</p>
          </div>

          <div className="fenomena-grid reveal">
            {fenomena.map((f, i) => (
              <button
                key={f.id}
                className={`fenomena-card${selected?.id === f.id ? " active" : ""}`}
                style={{ "--accent": f.accent, "--accent-bg": f.accentBg }}
                onClick={() => pickFenomena(f)}
              >
                <div className="fenomena-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.ilustrasi}</p>
                <span className="fenomena-select-tag">
                  {selected?.id === f.id ? <><CheckIcon /> Dipilih</> : "Pilih fenomena ini →"}
                </span>
              </button>
            ))}
          </div>

          {!selected && (
            <div className="quiz-locked reveal">
              <span style={{ fontSize: "1.3rem" }}>🔒</span>
              <span>Pilih salah satu fenomena di atas untuk membuka pertanyaan pemantik dan diagram sebab-akibatnya.</span>
            </div>
          )}

          {selected && (
            <div className="quiz-box reveal">
              <span className="eyebrow">Pertanyaan Pemantik — {selected.title}</span>
              <h3>{selected.quiz.question}</h3>
              {selected.quiz.options.map((opt, i) => {
                const state = !qSubmitted ? (qSelected === i ? "selected" : "") : i === selected.quiz.correct ? "correct" : qSelected === i ? "wrong" : "";
                return (
                  <button key={i} className={`quiz-option ${state}`} onClick={() => !qSubmitted && setQSelected(i)} disabled={qSubmitted}>
                    <span className="quiz-option-dot">
                      {qSubmitted && i === selected.quiz.correct && <CheckIcon />}
                      {qSubmitted && qSelected === i && i !== selected.quiz.correct && <XIcon />}
                    </span>
                    {opt}
                  </button>
                );
              })}
              {!qSubmitted ? (
                <button className="btn btn-primary" disabled={qSelected === null} onClick={() => setQSubmitted(true)} style={{ marginTop: 8 }}>
                  Periksa Jawaban <ArrowIcon />
                </button>
              ) : (
                <div className={`quiz-feedback ${qSelected === selected.quiz.correct ? "correct" : "wrong"}`}>
                  {qSelected === selected.quiz.correct ? <CheckIcon /> : <XIcon />}
                  <span>{qSelected === selected.quiz.correct ? selected.quiz.feedbackCorrect : selected.quiz.feedbackWrong}</span>
                </div>
              )}

              {qSubmitted && (
                <div className="chain-diagram">
                  <div className="chain-diagram-head">
                    <span className="eyebrow" style={{ marginBottom: 0 }}>Diagram Sebab-Akibat</span>
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "#556961", marginBottom: 18 }}>
                    Klik tiap tahap untuk melihat penjelasan hubungan antarperubahan yang terjadi.
                  </p>
                  {selected.chain.map((step, i) => (
                    <React.Fragment key={i}>
                      <div className={`chain-step${openStep === i ? " open" : ""}`}>
                        <div className="chain-step-head" onClick={() => setOpenStep(openStep === i ? null : i)}>
                          <span className="chain-step-num">{i + 1}</span>
                          <span className="chain-step-title">{step.title}</span>
                          <span className="chain-step-toggle"><ArrowIcon /></span>
                        </div>
                        <div className="chain-step-body"><p>{step.desc}</p></div>
                      </div>
                      {i < selected.chain.length - 1 && <div className="chain-connector" />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="materi-nav reveal">
            <Link to="/materi" className="btn btn-outline"><ArrowLeftIcon /> Daftar Materi</Link>
            <Link to="/materi/abrasi-pantai" className="btn btn-primary">
              Materi 4: Abrasi Pantai <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
