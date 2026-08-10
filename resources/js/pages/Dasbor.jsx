import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

/* ================= ICONS ================= */
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5C4.7 20 4 19.3 4 18.5v-13Z" />
    <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5v-13Z" />
  </svg>
);
const FlaskIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6M10 3v6.2L4.8 18a1.6 1.6 0 0 0 1.4 2.4h11.6a1.6 1.6 0 0 0 1.4-2.4L14 9.2V3" />
    <path d="M7.5 15h9" />
  </svg>
);
const QuizIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 9.5a3 3 0 1 1 4.2 2.7c-.9.4-1.7 1.1-1.7 2.1v.7" />
    <circle cx="11.5" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
    <rect x="3" y="3" width="18" height="18" rx="4" />
  </svg>
);
const MedalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="14" r="7" />
    <path d="M9 8 6 2M15 8l3-6M9.5 14.5 11 16l3.5-3.5" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l5 5L20 6" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20c9 0 16-7 16-16-9 0-16 7-16 16Z" />
    <path d="M5 19c3.5-3.5 6-7 7.5-11" />
  </svg>
);

/* ================================================================
   MOCK DATA — ganti dengan data dari API/auth sesungguhnya nanti.
   Struktur sudah disiapkan supaya tinggal disambungkan.
================================================================ */
const studentName = "Raka";

const materiProgress = [
  { title: "Ekosistem Mangrove", href: "/materi/ekosistem-mangrove", status: "selesai", pct: 100 },
  { title: "Interaksi dalam Ekosistem", href: "/materi/interaksi-ekosistem", status: "selesai", pct: 100 },
  { title: "Perubahan Lingkungan", href: "/materi/perubahan-lingkungan", status: "berjalan", pct: 60 },
  { title: "Abrasi Pantai", href: "/materi/abrasi-pantai", status: "belum", pct: 0 },
  { title: "Konservasi Mangrove", href: "/materi/konservasi-mangrove", status: "belum", pct: 0 },
];

const quizHistory = [
  { date: "28 Jul 2026", score: 4, total: 5, category: "Sangat Baik" },
  { date: "22 Jul 2026", score: 3, total: 5, category: "Cukup Baik" },
  { date: "15 Jul 2026", score: 2, total: 5, category: "Cukup Baik" },
];

const badges = [
  { title: "Penjelajah Mangrove", desc: "Selesaikan Materi 1", unlocked: true, icon: <LeafIcon /> },
  { title: "Ahli Ekosistem", desc: "Selesaikan Materi 2", unlocked: true, icon: <BookIcon /> },
  { title: "Ilmuwan Lab", desc: "Jalankan 5 simulasi", unlocked: true, icon: <FlaskIcon /> },
  { title: "Kausal Master", desc: "Skor kuis ≥ 80%", unlocked: false, icon: <QuizIcon /> },
];

const materiSelesai = materiProgress.filter((m) => m.status === "selesai").length;
const eksperimenLab = 7;
const skorTerakhir = quizHistory[0];
const lencanaDiperoleh = badges.filter((b) => b.unlocked).length;
const overallPct = Math.round(
  (materiProgress.reduce((a, m) => a + m.pct, 0) / (materiProgress.length * 100)) * 100
);

export default function Dasbor() {
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
        .btn-outline{ background:transparent; color:var(--paper); border:1.5px solid rgba(251,250,245,0.35); }
        .btn-outline:hover{ background:rgba(251,250,245,0.1); }

        /* ===== Banner / greeting ===== */
        .page-banner{ background:var(--canopy); padding:120px 0 90px; position:relative; overflow:hidden; }
        .page-banner::before{
          content:""; position:absolute; width:520px; height:520px; border-radius:50%;
          background:radial-gradient(circle, rgba(232,163,61,0.16), transparent 65%);
          top:-220px; right:-140px; pointer-events:none;
        }
        .breadcrumb{ display:flex; align-items:center; gap:8px; font-size:0.85rem; color:rgba(251,250,245,0.65); margin-bottom:18px; position:relative; z-index:1; }
        .breadcrumb a:hover{ color:var(--amber); }
        .breadcrumb span.current{ color:rgba(251,250,245,0.9); }
        .banner-flex{ display:flex; align-items:flex-end; justify-content:space-between; gap:40px; flex-wrap:wrap; position:relative; z-index:1; }
        .page-banner h1{ color:var(--paper); font-size:clamp(1.9rem,3.4vw,2.6rem); margin-bottom:10px; }
        .page-banner p{ color:rgba(251,250,245,0.75); max-width:480px; }
        .banner-ring-wrap{ display:flex; align-items:center; gap:16px; }
        .banner-ring{
          width:96px; height:96px; border-radius:50%;
          background:conic-gradient(var(--amber) ${overallPct * 3.6}deg, rgba(251,250,245,0.14) 0deg);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .banner-ring-inner{
          width:76px; height:76px; border-radius:50%; background:var(--canopy);
          border:1px solid rgba(251,250,245,0.15);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
        }
        .banner-ring-inner strong{ font-family:'Fraunces', serif; color:var(--paper); font-size:1.15rem; }
        .banner-ring-inner span{ font-size:0.62rem; color:rgba(251,250,245,0.55); }
        .banner-ring-label strong{ display:block; color:var(--paper); font-size:0.92rem; }
        .banner-ring-label span{ color:rgba(251,250,245,0.6); font-size:0.8rem; }

        .section{ padding:64px 0; }
        .section-head{ max-width:640px; margin-bottom:32px; }
        .section-head h2{ font-size:clamp(1.5rem,2.4vw,1.9rem); margin-top:10px; }
        .section-head p{ color:#4C5F58; margin-top:10px; font-size:0.95rem; }

        /* ===== Stat cards ===== */
        .stat-row{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-top:-58px; position:relative; z-index:2; }
        .stat-card{
          background:var(--paper); border-radius:20px; padding:24px 22px;
          border:1px solid rgba(15,36,29,0.06); box-shadow:0 16px 32px -20px rgba(15,36,29,0.25);
        }
        .stat-icon{
          width:40px; height:40px; border-radius:12px; background:var(--tide-pale); color:var(--estuary);
          display:flex; align-items:center; justify-content:center; margin-bottom:14px;
        }
        .stat-icon svg{ width:20px; height:20px; }
        .stat-card strong{ display:block; font-family:'Fraunces', serif; font-size:1.5rem; color:var(--canopy); }
        .stat-card span{ font-size:0.82rem; color:#556961; }

        /* ===== Progress materi ===== */
        .progress-list{ display:flex; flex-direction:column; gap:14px; }
        .progress-row{
          display:flex; align-items:center; gap:18px; background:var(--paper);
          border:1px solid rgba(15,36,29,0.06); border-radius:16px; padding:18px 20px;
          transition:transform .25s ease, box-shadow .25s ease;
        }
        .progress-row:hover{ transform:translateY(-3px); box-shadow:0 14px 26px -18px rgba(15,36,29,0.25); }
        .progress-status{
          width:34px; height:34px; border-radius:50%; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
        }
        .progress-status svg{ width:16px; height:16px; }
        .progress-status.selesai{ background:#E4EFE7; color:var(--estuary); }
        .progress-status.berjalan{ background:#FBEEDA; color:var(--amber-deep); }
        .progress-status.belum{ background:var(--sand); color:#9AAAA3; }
        .progress-main{ flex:1; }
        .progress-main-top{ display:flex; justify-content:space-between; font-size:0.92rem; font-weight:600; margin-bottom:8px; }
        .progress-main-top span.tag{ font-weight:600; font-size:0.76rem; color:#8A9A93; }
        .progress-track{ height:7px; border-radius:999px; background:var(--sand-deep); overflow:hidden; }
        .progress-fill{ height:100%; border-radius:999px; background:var(--estuary); transition:width .5s ease; }

        /* ===== Quiz history ===== */
        .quiz-history{ display:flex; flex-direction:column; gap:12px; }
        .quiz-history-row{
          display:flex; align-items:center; justify-content:space-between; gap:16px;
          background:var(--paper); border:1px solid rgba(15,36,29,0.06); border-radius:14px; padding:16px 20px;
        }
        .quiz-history-left{ display:flex; align-items:center; gap:14px; }
        .quiz-history-icon{ width:36px; height:36px; border-radius:10px; background:var(--tide-pale); color:var(--estuary); display:flex; align-items:center; justify-content:center; }
        .quiz-history-icon svg{ width:18px; height:18px; }
        .quiz-history-date{ font-size:0.78rem; color:#8A9A93; }
        .quiz-history-score{ font-family:'Space Mono', monospace; font-weight:700; }
        .quiz-history-tag{
          font-size:0.74rem; font-weight:700; padding:5px 12px; border-radius:999px;
        }

        /* ===== Badges ===== */
        .badge-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
        .badge-card{
          text-align:center; padding:26px 16px; border-radius:18px; background:var(--paper);
          border:1px solid rgba(15,36,29,0.06);
        }
        .badge-card.locked{ opacity:0.5; }
        .badge-icon{
          width:56px; height:56px; border-radius:50%; margin:0 auto 14px;
          display:flex; align-items:center; justify-content:center;
          background:var(--tide-pale); color:var(--estuary);
        }
        .badge-card.locked .badge-icon{ background:var(--sand); color:#9AAAA3; }
        .badge-icon svg{ width:24px; height:24px; }
        .badge-card h4{ font-size:0.9rem; margin-bottom:6px; }
        .badge-card p{ font-size:0.76rem; color:#8A9A93; }

        @media (max-width:980px){
          .stat-row{ grid-template-columns:repeat(2,1fr); margin-top:24px; }
          .badge-grid{ grid-template-columns:repeat(2,1fr); }
          .banner-flex{ align-items:flex-start; }
        }
        @media (max-width:600px){
          .container{ padding:0 20px; }
          .stat-row{ grid-template-columns:1fr; }
          .badge-grid{ grid-template-columns:1fr; }
          .quiz-history-row{ flex-direction:column; align-items:flex-start; gap:10px; }
        }
      `}</style>

      <Navbar />

      {/* ================= BANNER / GREETING ================= */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb reveal">
            <Link to="/">Beranda</Link><span>/</span>
            <span className="current">Dasbor</span>
          </div>
          <div className="banner-flex">
            <div className="reveal">
              <span className="eyebrow" style={{ color: "var(--amber)" }}>Progres Belajar</span>
              <h1>Halo, {studentName}! 👋</h1>
              <p>Terus lanjutkan — kamu sudah menyelesaikan {materiSelesai} dari {materiProgress.length} materi ekosistem mangrove.</p>
            </div>
            <div className="banner-ring-wrap reveal">
              <div className="banner-ring">
                <div className="banner-ring-inner">
                  <strong>{overallPct}%</strong>
                  <span>PROGRES</span>
                </div>
              </div>
              <div className="banner-ring-label">
                <strong>Progres Keseluruhan</strong>
                <span>Materi &amp; aktivitas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STAT CARDS ================= */}
      <div className="container">
        <div className="stat-row">
          <div className="stat-card reveal show">
            <div className="stat-icon"><BookIcon /></div>
            <strong>{materiSelesai}/{materiProgress.length}</strong>
            <span>Materi Selesai</span>
          </div>
          <div className="stat-card reveal show">
            <div className="stat-icon"><FlaskIcon /></div>
            <strong>{eksperimenLab}x</strong>
            <span>Eksperimen Lab Virtual</span>
          </div>
          <div className="stat-card reveal show">
            <div className="stat-icon"><QuizIcon /></div>
            <strong>{skorTerakhir.score}/{skorTerakhir.total}</strong>
            <span>Skor Kuis Terakhir</span>
          </div>
          <div className="stat-card reveal show">
            <div className="stat-icon"><MedalIcon /></div>
            <strong>{lencanaDiperoleh}/{badges.length}</strong>
            <span>Lencana Diperoleh</span>
          </div>
        </div>
      </div>

      {/* ================= PROGRES MATERI ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Progres Materi</span>
            <h2>Lanjutkan Belajarmu</h2>
            <p>Status penyelesaian tiap modul — klik untuk melanjutkan dari sana.</p>
          </div>
          <div className="progress-list">
            {materiProgress.map((m, i) => (
              <Link to={m.href} className="progress-row reveal" style={{ transitionDelay: `${i * 60}ms` }} key={m.title}>
                <div className={`progress-status ${m.status}`}>
                  {m.status === "selesai" ? <CheckIcon /> : m.status === "belum" ? <LockIcon /> : <BookIcon />}
                </div>
                <div className="progress-main">
                  <div className="progress-main-top">
                    <span>{m.title}</span>
                    <span className="tag">
                      {m.status === "selesai" ? "Selesai" : m.status === "berjalan" ? "Sedang Berjalan" : "Belum Dimulai"}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RIWAYAT KUIS ================= */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Riwayat Kuis</span>
            <h2>Hasil Kuis Berpikir Kausal</h2>
            <p>Rekam jejak percobaan kuismu — coba lagi untuk memperbaiki skor.</p>
          </div>
          <div className="quiz-history">
            {quizHistory.map((h, i) => {
              const tagColor =
                h.category === "Sangat Baik"
                  ? { color: "#2F6B57", bg: "#E4EFE7" }
                  : h.category === "Cukup Baik"
                  ? { color: "#CE8324", bg: "#FBEEDA" }
                  : { color: "#C24A5F", bg: "#F8E4E7" };
              return (
                <div className="quiz-history-row reveal" style={{ transitionDelay: `${i * 60}ms` }} key={i}>
                  <div className="quiz-history-left">
                    <div className="quiz-history-icon"><QuizIcon /></div>
                    <div>
                      <div className="quiz-history-score">{h.score}/{h.total} Benar</div>
                      <div className="quiz-history-date">{h.date}</div>
                    </div>
                  </div>
                  <span className="quiz-history-tag" style={{ color: tagColor.color, background: tagColor.bg }}>
                    {h.category}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 24 }}>
            <Link to="/kuis" className="btn btn-primary">Coba Kuis Lagi <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      {/* ================= LENCANA ================= */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Pencapaian</span>
            <h2>Lencana Kamu</h2>
            <p>Kumpulkan lencana dengan menyelesaikan materi, eksperimen, dan kuis.</p>
          </div>
          <div className="badge-grid">
            {badges.map((b, i) => (
              <div className={`badge-card reveal ${b.unlocked ? "" : "locked"}`} style={{ transitionDelay: `${i * 70}ms` }} key={b.title}>
                <div className="badge-icon">{b.unlocked ? b.icon : <LockIcon />}</div>
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
