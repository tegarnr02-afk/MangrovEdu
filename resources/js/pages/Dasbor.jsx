import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import api from "../lib/api";
import heroBg from "./konservasi-mangrove-sehat.png";

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

const statusLabel = {
  selesai: "Selesai",
  berjalan: "Sedang dipelajari",
  belum: "Belum dimulai",
};

export default function Dasbor() {
  const [status, setStatus] = useState({ loading: true, error: false, data: null });
  const [attempt, setAttempt] = useState(0);

  // Ambil data dasbor dari endpoint agregasi (GET /api/dashboard).
  useEffect(() => {
    let cancelled = false;
    setStatus({ loading: true, error: false, data: null });

    api
      .get("/dashboard")
      .then((res) => {
        if (!cancelled) setStatus({ loading: false, error: false, data: res.data?.data ?? null });
      })
      .catch(() => {
        if (!cancelled) setStatus({ loading: false, error: true, data: null });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // Jalankan animasi .reveal setiap kali konten selesai dirender ulang.
  useEffect(() => {
    if (status.loading) return;
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
  }, [status.loading]);

  const d = status.data;
  const materi = d?.materi;
  const items = materi?.items ?? [];
  const selesai = materi?.selesai ?? 0;
  const total = materi?.total ?? 0;
  const eksperimen = d?.eksperimen;
  const kuis = d?.kuis;

  // Lencana diturunkan dari data nyata: dua lencana dari status materi,
  // dua lencana lainnya menunggu data lab/kuis yang belum tersedia di DB.
  const badges = [
    { title: "Penjelajah Mangrove", desc: "Selesaikan Materi 1", unlocked: items[0]?.status === "selesai", icon: <LeafIcon /> },
    { title: "Ahli Ekosistem", desc: "Selesaikan Materi 2", unlocked: items[1]?.status === "selesai", icon: <BookIcon /> },
    { title: "Ilmuwan Lab", desc: "Jalankan 5 eksperimen", unlocked: !!eksperimen?.tersedia && (eksperimen?.total ?? 0) >= 5, icon: <FlaskIcon /> },
    { title: "Kausal Master", desc: "Skor kuis ≥ 80%", unlocked: !!kuis?.tersedia && (kuis?.nilai_terbaik ?? 0) >= 80, icon: <QuizIcon /> },
  ];
  const lencanaDiperoleh = badges.filter((b) => b.unlocked).length;

  const retry = () => setAttempt((a) => a + 1);

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
        .wave-divider{ position:absolute; left:0; right:0; bottom:-1px; line-height:0; pointer-events:none; z-index:1; }
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
        .stat-card strong.stat-muted{ color:#B9C2BD; }
        .stat-note{ display:block; font-size:0.72rem; color:#AEB8B2; font-style:normal; margin-top:4px; }

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
        .progress-sub{ font-size:0.74rem; color:#8A9A93; margin-top:8px; }

        /* ===== Empty state ===== */
        .empty-state{
          background:var(--paper); border:1.5px dashed rgba(15,36,29,0.16); border-radius:18px;
          padding:48px 24px; text-align:center;
        }
        .empty-icon{
          width:52px; height:52px; border-radius:50%; background:var(--tide-pale); color:var(--estuary);
          display:flex; align-items:center; justify-content:center; margin:0 auto 16px;
        }
        .empty-icon svg{ width:24px; height:24px; }
        .empty-state h3{ font-size:1.15rem; margin-bottom:8px; }
        .empty-state p{ font-size:0.88rem; color:#556961; max-width:420px; margin:0 auto; }

        /* ===== Error state ===== */
        .error-panel{
          background:var(--paper); border:1.5px solid rgba(194,74,95,0.25); border-radius:20px;
          padding:56px 24px; text-align:center; max-width:560px; margin:0 auto;
        }
        .error-panel .empty-icon{ background:#F8E4E7; color:var(--danger); }
        .error-panel h3{ font-size:1.3rem; margin-bottom:8px; }
        .error-panel p{ font-size:0.9rem; color:#556961; margin-bottom:20px; }

        /* ===== Loading skeleton ===== */
        .skeleton{
          background:linear-gradient(90deg,var(--sand-deep) 25%, #eef3ea 50%, var(--sand-deep) 75%);
          background-size:200% 100%; animation:shimmer 1.3s infinite; border-radius:8px;
        }
        @keyframes shimmer{ 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
        .skeleton-line{ height:14px; margin-bottom:12px; }
        .skeleton-card{ height:150px; border-radius:20px; }

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
          .page-banner{ min-height:50vh; }
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
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Progres Belajar</span>
          <h1 className="reveal">Dasbor Pembelajaran</h1>
          <p className="reveal">
            Pantau perkembangan belajar, aktivitas eksperimen, dan hasil pembelajaranmu di MangrovEdu.
          </p>
        </div>
        <WaveDividerLocal fill="var(--sand)" />
      </section>

      {/* ================= KONTEN UTAMA ================= */}
      {status.loading ? (
        <div className="container">
          <div className="stat-row">
            {[0, 1, 2, 3].map((i) => (
              <div className="skeleton skeleton-card" key={i} />
            ))}
          </div>
          <section className="section">
            <div className="skeleton skeleton-line" style={{ width: "220px", height: "22px" }} />
            <div className="skeleton skeleton-line" style={{ width: "100%", height: "18px" }} />
            <div className="skeleton skeleton-line" style={{ width: "70%", height: "18px" }} />
            {[0, 1, 2, 3, 4].map((i) => (
              <div className="skeleton skeleton-line" style={{ height: "64px", marginTop: "14px" }} key={i} />
            ))}
          </section>
        </div>
      ) : status.error ? (
        <section className="section">
          <div className="container">
            <div className="error-panel">
              <div className="empty-icon"><LockIcon /></div>
              <h3>Gagal memuat dasbor</h3>
              <p>Terjadi kendala saat mengambil data dari server. Pastikan kamu sudah masuk dan koneksi tersedia, lalu coba lagi.</p>
              <button className="btn btn-primary" onClick={retry}>Coba Lagi <ArrowIcon /></button>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* ================= STAT CARDS ================= */}
          <div className="container">
            <div className="stat-row">
              <div className="stat-card reveal show">
                <div className="stat-icon"><BookIcon /></div>
                <strong>{selesai}/{total}</strong>
                <span>Materi Selesai</span>
              </div>
              <div className="stat-card reveal show">
                <div className="stat-icon"><FlaskIcon /></div>
                {eksperimen?.tersedia ? (
                  <strong>{eksperimen.total}x</strong>
                ) : (
                  <strong className="stat-muted">—</strong>
                )}
                <span>Eksperimen Lab Virtual</span>
                {!eksperimen?.tersedia && <em className="stat-note">Belum ada data</em>}
              </div>
              <div className="stat-card reveal show">
                <div className="stat-icon"><QuizIcon /></div>
                {kuis?.tersedia ? (
                  <strong>{kuis.nilai_terakhir ?? 0}</strong>
                ) : (
                  <strong className="stat-muted">—</strong>
                )}
                <span>Skor Kuis Terakhir</span>
                {!kuis?.tersedia && <em className="stat-note">Belum ada data</em>}
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
                {items.map((m, i) => {
                  const fillPct = m.status === "selesai" ? 100 : m.status === "berjalan" ? (m.nilai_rata ?? 0) : 0;
                  return (
                    <Link to={`/materi/${m.slug}`} className="progress-row reveal" style={{ transitionDelay: `${i * 60}ms` }} key={m.slug}>
                      <div className={`progress-status ${m.status}`}>
                        {m.status === "selesai" ? <CheckIcon /> : m.status === "belum" ? <LockIcon /> : <BookIcon />}
                      </div>
                      <div className="progress-main">
                        <div className="progress-main-top">
                          <span>{m.judul}</span>
                          <span className="tag">{statusLabel[m.status] ?? m.status}</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${fillPct}%` }} />
                        </div>
                        {m.status === "berjalan" && (
                          <div className="progress-sub">
                            {m.aktivitas} aktivitas tersimpan · rata-rata nilai {m.nilai_rata ?? 0}%
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ================= RIWAYAT KUIS ================= */}
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="section-head reveal">
                <span className="eyebrow">Riwayat Kuis</span>
                <h2>Hasil Kuis Berpikir Kausal</h2>
                <p>Rekam jejak percobaan kuismu.</p>
              </div>
              <div className="empty-state reveal">
                <div className="empty-icon"><QuizIcon /></div>
                <h3>Belum ada hasil kuis</h3>
                <p>Hasil Kuis Berpikir Kausal belum tersimpan di database, jadi belum ada riwayat yang bisa ditampilkan.</p>
                <Link to="/kuis" className="btn btn-primary" style={{ marginTop: 18 }}>Mulai Kuis <ArrowIcon /></Link>
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
