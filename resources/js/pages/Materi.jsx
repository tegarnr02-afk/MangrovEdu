import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api"; // sesuaikan path jika file ini bukan di src/pages/
import heroBg from "./konservasi-mangrove-sehat.png";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20c9 0 16-7 16-16-9 0-16 7-16 16Z" />
    <path d="M5 19c3.5-3.5 6-7 7.5-11" />
  </svg>
);

const InteractionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="7" r="2.6" />
    <circle cx="18" cy="7" r="2.6" />
    <circle cx="12" cy="18" r="2.6" />
    <path d="M8.2 8.4 10 16M15.8 8.4 14 16M8.6 7h6.8" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12a8 8 0 0 1 14-5.2M20 12a8 8 0 0 1-14 5.2" />
    <path d="M17.5 3v4h-4M6.5 21v-4h4" />
  </svg>
);

const WaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 8c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
    <path d="M2 14c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
    <path d="M2 20c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12.5 9.5 18 20 6" />
  </svg>
);

const SproutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21V11" />
    <path d="M12 11C12 6 8 5 4 5c0 4 1 8 8 8Z" />
    <path d="M12 13C12 8.5 15.5 7 20 7c0 4-1.2 7.8-8 8Z" />
  </svg>
);

const materiList = [
  {
    slug: "ekosistem-mangrove",
    icon: <LeafIcon />,
    title: "Ekosistem Mangrove",
    desc: "Amati ilustrasi ekosistem mangrove dan identifikasi komponen biotik & abiotik lewat klik objek interaktif, lalu jelajahi galeri lima jenis mangrove yang ditemukan di Indonesia.",
    tags: ["Klik Objek", "Galeri 5 Jenis Mangrove"],
    accent: "#2F6B57",
    accentBg: "#E4EFE7",
    href: "/materi/ekosistem-mangrove",
  },
  {
    slug: "interaksi-ekosistem",
    icon: <InteractionIcon />,
    title: "Interaksi dalam Ekosistem",
    desc: "Eksplorasi hubungan antar komponen lewat diagram interaktif, lalu telusuri rantai makanan produsen–konsumen–pengurai dan prediksi dampaknya bila satu komponen hilang.",
    tags: ["Diagram Interaktif", "Rantai Makanan"],
    accent: "#C97C1E",
    accentBg: "#FBEEDA",
    href: "/materi/interaksi-ekosistem",
  },
  {
    slug: "perubahan-lingkungan",
    icon: <RefreshIcon />,
    title: "Perubahan Lingkungan",
    desc: "Amati fenomena perubahan lingkungan akibat faktor alam maupun aktivitas manusia, lalu telusuri hubungan sebab-akibatnya lewat diagram interaktif bertahap.",
    tags: ["Studi Kasus", "Sebab-Akibat"],
    accent: "#1E8A8C",
    accentBg: "#E1F1F1",
    href: "/materi/perubahan-lingkungan",
  },
  {
    slug: "abrasi-pantai",
    icon: <WaveIcon />,
    title: "Abrasi Pantai",
    desc: "Susun tahapan terjadinya abrasi lewat aktivitas drag-and-drop, lalu pelajari dampaknya terhadap lingkungan pesisir sebagai pengantar menuju Laboratorium Virtual.",
    tags: ["Drag & Drop", "Menuju Lab Virtual"],
    accent: "#6C63B5",
    accentBg: "#EAE8F6",
    href: "/materi/abrasi-pantai",
  },
  {
    slug: "konservasi-mangrove",
    icon: <SproutIcon />,
    title: "Konservasi Mangrove",
    desc: "Pilih tindakan konservasi lewat skenario interaktif dan amati konsekuensinya terhadap kelestarian ekosistem, sebelum menguji hubungan itu di Laboratorium Virtual.",
    tags: ["Skenario Interaktif", "Menuju Lab Virtual"],
    accent: "#C24A5F",
    accentBg: "#F8E4E7",
    href: "/materi/konservasi-mangrove",
  },
];

export default function Materi() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [lockedItem, setLockedItem] = useState(null); // { title, prevTitle } | null

  // Notifikasi toast singkat saat user klik kartu materi ketika progres
  // dari server (GET /materi/progress) masih dalam proses dimuat — supaya
  // status locked/completed belum bisa dipastikan dulu, jadi klik ditahan
  // dan user diberi tahu untuk menunggu sebentar, bukan langsung dianggap
  // "terkunci" (yang salah, karena completedSlugs masih kosong sementara).
  const [showLoadingToast, setShowLoadingToast] = useState(false);

  const isLoggedIn = () => !!localStorage.getItem("token");
  const loggedIn = isLoggedIn();

  // Progres materi yang sudah diselesaikan user, diambil dari
  // GET /materi/progress (lihat MateriProgressController@index).
  // Hanya di-fetch kalau user sudah login — pengunjung yang belum
  // login tidak perlu tahu status progres siapa pun.
  const [completedSlugs, setCompletedSlugs] = useState([]);

  // Status pemuatan progres — dipakai untuk menampilkan indikator
  // "Memuat progres tersimpan…" supaya user tahu status Selesai/Terkunci
  // pada tiap kartu masih dalam proses diambil dari server, bukan langsung
  // final begitu halaman terbuka. Kalau tidak login, tidak ada progres
  // yang perlu dimuat, jadi mulai dari false.
  const [loadingProgress, setLoadingProgress] = useState(loggedIn);

  useEffect(() => {
    if (!loggedIn) return;
    let mounted = true;
    api
      .get("/materi/progress")
      .then((res) => {
        if (!mounted) return;
        setCompletedSlugs(res.data?.completed || []);
      })
      .catch((err) => {
        console.error("Gagal memuat progres materi:", err);
      })
      .finally(() => {
        if (mounted) setLoadingProgress(false);
      });
    return () => { mounted = false; };
  }, [loggedIn]);

  // Sebelum login: semua kartu tampil polos dengan warna aslinya, tanpa
  // badge "Terkunci"/"Selesai" — status progres memang belum relevan buat
  // pengunjung yang belum masuk. Setelah login, baru status locked/completed
  // dihitung: materi ke-0 selalu terbuka, materi ke-N baru terbuka kalau
  // materi ke-(N-1) sudah ada di daftar completedSlugs.
  // Kartu materi mana saja yang sudah pernah "muncul" lewat animasi scroll
  // reveal. Dilacak lewat React state (bukan cuma classList.add manual),
  // karena className kartu ini dibangun dinamis dari status locked/completed
  // yang berubah setelah progres selesai di-fetch dari server. Kalau cuma
  // mengandalkan classList manual, re-render akibat perubahan status itu
  // akan menimpa className dan menghapus class "show" yang sudah ditambahkan,
  // membuat kartu jadi transparan (bug yang sempat terjadi pada kartu
  // Materi 2 begitu progres Materi 1 selesai di-fetch).
  const [revealedCards, setRevealedCards] = useState(() => new Set());

  const materiWithStatus = materiList.map((m, i) => {
    const prevMateri = i > 0 ? materiList[i - 1] : null;
    const completed = loggedIn && completedSlugs.includes(m.slug);
    const locked = loggedIn && prevMateri ? !completedSlugs.includes(prevMateri.slug) : false;
    return { ...m, completed, locked, prevTitle: prevMateri?.title };
  });

  const handleMateriClick = (item) => (e) => {
    if (!isLoggedIn()) {
      e.preventDefault();
      setShowLoginModal(true);
      return;
    }
    if (loadingProgress) {
      // Progres belum selesai dimuat — status locked/completed kartu ini
      // belum bisa dipercaya, jadi tahan navigasi dan tampilkan toast
      // singkat alih-alih modal "terkunci" yang bisa salah.
      e.preventDefault();
      setShowLoadingToast(true);
      return;
    }
    if (item.locked) {
      e.preventDefault();
      setLockedItem(item);
      return;
    }
    // Sudah login & tidak terkunci → biarkan Link navigasi seperti biasa
  };

  // Toast otomatis hilang setelah beberapa detik.
  useEffect(() => {
    if (!showLoadingToast) return;
    const t = setTimeout(() => setShowLoadingToast(false), 2500);
    return () => clearTimeout(t);
  }, [showLoadingToast]);

  const goToLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  // Scroll reveal — identik dengan pola di Home.jsx, plus pelacakan
  // revealedCards khusus untuk kartu materi (lihat komentar di atas).
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal:not(.show)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("show");
            const cardIndex = e.target.dataset.cardIndex;
            if (cardIndex !== undefined) {
              setRevealedCards((prev) => (prev.has(cardIndex) ? prev : new Set(prev).add(cardIndex)));
            }
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        :root{
          --canopy:#0F241D;
          --estuary:#2F6B57;
          --estuary-light:#3D8267;
          --tide:#89AE9E;
          --tide-pale:#E1EAE2;
          --sand:#F1F4EC;
          --sand-deep:#E7EDDF;
          --silt:#A9784F;
          --silt-light:#C79A6C;
          --amber:#E8A33D;
          --amber-deep:#CE8324;
          --ink:#12261F;
          --paper:#FBFAF5;
          --shadow: 0 20px 40px -20px rgba(15,36,29,0.35);
          --radius-lg: 28px;
          --radius-md: 18px;
        }
        *{box-sizing:border-box; margin:0; padding:0;}
        html{scroll-behavior:smooth;}
        body{
          font-family:'Plus Jakarta Sans', sans-serif;
          background:var(--sand);
          color:var(--ink);
          line-height:1.6;
          overflow-x:hidden;
        }
        h1,h2,h3,h4{
          font-family:'Fraunces', serif;
          font-weight:600;
          color:var(--canopy);
          line-height:1.12;
          letter-spacing:-0.01em;
        }
        .eyebrow{
          font-family:'Space Mono', monospace;
          text-transform:uppercase;
          letter-spacing:0.14em;
          font-size:0.72rem;
          color:var(--estuary);
          font-weight:700;
          display:inline-flex;
          align-items:center;
          gap:10px;
        }
        a{text-decoration:none; color:inherit;}
        ul{list-style:none;}
        img{max-width:100%; display:block;}
        .container{ max-width:1180px; margin:0 auto; padding:0 32px; }
        section{position:relative;}
        .btn{
          display:inline-flex; align-items:center; gap:8px;
          padding:15px 30px; border-radius:999px; font-weight:700; font-size:0.95rem;
          cursor:pointer; border:none;
          transition:transform .25s ease, box-shadow .25s ease, background .25s ease;
          font-family:'Plus Jakarta Sans', sans-serif;
        }
        .btn-primary{
          background:var(--amber); color:var(--canopy);
          box-shadow:0 12px 24px -10px rgba(232,163,61,0.7);
        }
        .btn-primary:hover{ transform:translateY(-3px); box-shadow:0 16px 30px -10px rgba(232,163,61,0.85); }

        .reveal{ opacity:0; transform:translateY(26px); transition:opacity .7s ease, transform .7s ease; }
        .reveal.show{ opacity:1; transform:translateY(0); }

        .wave-divider{ position:absolute; left:0; right:0; bottom:-1px; line-height:0; pointer-events:none; z-index:5; }
        .wave-divider svg{ display:block; width:100%; height:80px; }

        /* ===== Page banner ===== */
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

        /* ===== Materi grid ===== */
        .materi-index{ background:var(--sand-deep); padding:100px 0; }
        .section-head{ max-width:640px; margin-bottom:52px; }
        .section-head h2{ font-size:clamp(2rem,3.2vw,2.7rem); margin-top:14px; }
        .section-head p{ color:#4C5F58; margin-top:14px; font-size:1.02rem; }
        .materi-progress-loading{
          display:inline-flex; align-items:center; gap:8px; margin-top:16px;
          font-family:'Space Mono', monospace; font-size:0.78rem; font-weight:700;
          color:var(--estuary); letter-spacing:0.02em;
        }
        .materi-progress-spinner{
          width:13px; height:13px; border-radius:50%;
          border:2px solid rgba(47,107,87,0.25); border-top-color:var(--estuary);
          animation:materiSpin 0.7s linear infinite;
        }
        @keyframes materiSpin{ to{ transform:rotate(360deg); } }

        /* ===== Toast notifikasi "masih memuat" ===== */
        .materi-toast{
          position:fixed; left:50%; bottom:32px; transform:translateX(-50%) translateY(0);
          display:inline-flex; align-items:center; gap:10px;
          background:var(--canopy); color:var(--paper);
          padding:13px 20px; border-radius:12px; font-size:0.86rem; font-weight:600;
          box-shadow:0 10px 30px rgba(15,36,29,0.25); z-index:200;
          animation:materiToastIn 0.25s ease;
        }
        .materi-toast .materi-progress-spinner{ border-color:rgba(251,250,245,0.25); border-top-color:var(--amber); }
        @keyframes materiToastIn{ from{ opacity:0; transform:translateX(-50%) translateY(12px); } to{ opacity:1; transform:translateX(-50%) translateY(0); } }


        .materi-index-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .materi-index-card{
          display:flex; flex-direction:column;
          background:var(--paper);
          border-radius:20px;
          padding:30px 26px;
          border:1px solid rgba(15,36,29,0.06);
          box-shadow:0 4px 16px -10px rgba(15,36,29,0.12);
          transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;
          position:relative;
        }
        .materi-index-card:hover{
          transform:translateY(-8px);
          box-shadow:0 20px 34px -18px rgba(15,36,29,0.24);
          border-color:var(--accent, var(--estuary));
        }
        .materi-index-card::before{
          content:""; position:absolute; top:0; left:26px; right:26px; height:3px;
          background:var(--accent, var(--estuary)); border-radius:0 0 4px 4px;
          transform:scaleX(0); transform-origin:left; transition:transform .35s ease;
        }
        .materi-index-card:hover::before{ transform:scaleX(1); }
        .materi-index-top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .materi-index-icon{
          width:50px; height:50px; border-radius:14px;
          background:var(--accent-bg, var(--tide-pale));
          color:var(--accent, var(--estuary));
          display:flex; align-items:center; justify-content:center;
          transition:transform .35s ease;
        }
        .materi-index-icon svg{ width:24px; height:24px; }
        .materi-index-card:hover .materi-index-icon{ transform:scale(1.08) rotate(-6deg); }
        .materi-index-num{
          font-family:'Space Mono', monospace; font-size:0.78rem; font-weight:700; color:var(--silt);
        }
        .materi-index-card h4{ font-size:1.1rem; margin-bottom:10px; color:var(--canopy); }
        .materi-index-card p{ font-size:0.9rem; color:#556961; line-height:1.6; margin-bottom:18px; flex:1; }
        .materi-index-tags{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
        .materi-index-tags span{
          font-size:0.72rem; font-weight:600; color:var(--accent, var(--estuary));
          background:var(--accent-bg, var(--tide-pale));
          padding:5px 10px; border-radius:999px;
        }
        .materi-index-link{
          font-weight:700; font-size:0.85rem; color:var(--accent, var(--estuary));
          display:inline-flex; align-items:center; gap:6px;
        }
        .materi-index-link svg{ width:14px; height:14px; transition:transform .25s ease; }
        .materi-index-card:hover .materi-index-link svg{ transform:translateX(5px); }

        /* ===== Status badge: Selesai / Terkunci ===== */
        .materi-status-badge{
          position:absolute; top:18px; right:18px; z-index:1;
          display:inline-flex; align-items:center; gap:5px;
          font-size:0.7rem; font-weight:700; padding:5px 10px; border-radius:999px;
        }
        .materi-status-badge svg{ width:12px; height:12px; }
        .materi-status-badge.done{ background:#E4EFE7; color:var(--estuary); }
        .materi-status-badge.locked{ background:rgba(15,36,29,0.08); color:#6B7A73; }

        /* ===== Kartu terkunci: nonaktif secara visual, tetap bisa diklik
           (biar handler onClick tetap jalan dan modal "terkunci" muncul) ===== */
        .materi-index-card.is-locked{ cursor:not-allowed; }
        .materi-index-card.is-locked:hover{ transform:none; box-shadow:0 4px 16px -10px rgba(15,36,29,0.12); border-color:rgba(15,36,29,0.06); }
        .materi-index-card.is-locked:hover::before{ transform:scaleX(0); }
        .materi-index-card.is-locked .materi-index-icon{
          background:#EDEFEA; color:#8B978F; filter:grayscale(0.4);
        }
        .materi-index-card.is-locked:hover .materi-index-icon{ transform:none; }
        .materi-index-card.is-locked h4,
        .materi-index-card.is-locked p{ color:#8B978F; }
        .materi-index-card.is-locked .materi-index-tags span{ background:#EDEFEA; color:#8B978F; }
        .materi-index-card.is-locked .materi-index-link{ color:#8B978F; }
        .materi-index-card.is-locked:hover .materi-index-link svg{ transform:none; }

        @media (max-width:980px){
          .materi-index-grid{ grid-template-columns:repeat(2,1fr); }
          .page-banner{ min-height:50vh; }
        }
        @media (max-width:600px){
          .container{ padding:0 20px; }
          .materi-index-grid{ grid-template-columns:1fr; }
        }

        /* ===== Login modal ===== */
        .login-modal-overlay{
          position:fixed; inset:0; z-index:100;
          background:rgba(10,22,17,0.55);
          display:flex; align-items:center; justify-content:center;
          padding:20px;
          animation:fadeIn .2s ease;
        }
        @keyframes fadeIn{ from{opacity:0;} to{opacity:1;} }
        .login-modal{
          position:relative;
          background:var(--paper);
          border-radius:var(--radius-md);
          padding:38px 32px 32px;
          max-width:380px; width:100%;
          text-align:center;
          box-shadow:var(--shadow);
          animation:popIn .25s ease;
        }
        @keyframes popIn{ from{opacity:0; transform:translateY(12px) scale(.97);} to{opacity:1; transform:translateY(0) scale(1);} }
        .login-modal-close{
          position:absolute; top:16px; right:16px;
          width:32px; height:32px; border:none; border-radius:50%;
          background:var(--sand-deep); color:var(--canopy);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer;
        }
        .login-modal-close svg{ width:16px; height:16px; }
        .login-modal-icon{
          width:56px; height:56px; margin:0 auto 18px;
          border-radius:50%;
          background:var(--tide-pale); color:var(--estuary);
          display:flex; align-items:center; justify-content:center;
        }
        .login-modal-icon.locked{ background:#FBEEDA; color:var(--amber-deep); }
        .login-modal-icon svg{ width:26px; height:26px; }
        .login-modal h3{ font-size:1.35rem; margin-bottom:10px; }
        .login-modal p{ color:#556961; font-size:0.92rem; margin-bottom:26px; }
        .login-modal-actions{ display:flex; flex-direction:column; gap:10px; }
        .login-modal-actions .btn-primary{ width:100%; justify-content:center; }
        .login-modal-cancel{
          background:none; border:none; color:#7A8A83; font-weight:600;
          font-size:0.88rem; cursor:pointer; padding:8px;
        }
        .login-modal-cancel:hover{ color:var(--canopy); }
      `}</style>

      <Navbar />

      {/* ================= PAGE BANNER ================= */}
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>5 Modul Pembelajaran</span>
          <h1 className="reveal">Materi Ekosistem Mangrove</h1>
          <p className="reveal">
            Pelajari komponen, interaksi, perubahan, dan upaya konservasi
            ekosistem mangrove lewat lima modul interaktif — lengkap dengan
            ilustrasi, diagram, dan pertanyaan pemantik di setiap langkahnya.
          </p>
        </div>
        <WaveDividerLocal fill="var(--sand-deep)" />
      </section>

      {/* ================= DAFTAR MATERI ================= */}
      <section className="materi-index">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Pilih modul</span>
            <h2>Lima Topik Utama</h2>
            <p>Setiap modul disusun bertahap — mulai dari pengamatan, pertanyaan pemantik, hingga umpan balik interaktif.</p>
            {loadingProgress && (
              <span className="materi-progress-loading">
                <span className="materi-progress-spinner" aria-hidden="true" />
                Memuat progres tersimpan…
              </span>
            )}
          </div>
          <div className="materi-index-grid">
            {materiWithStatus.map((m, i) => (
              <Link
                to={m.href}
                className={`materi-index-card reveal${revealedCards.has(String(i)) ? " show" : ""}${m.locked ? " is-locked" : ""}`}
                key={i}
                data-card-index={i}
                onClick={handleMateriClick(m)}
                aria-disabled={m.locked}
                style={{ transitionDelay: `${i * 90}ms`, "--accent": m.accent, "--accent-bg": m.accentBg }}
              >
                {m.completed && (
                  <span className="materi-status-badge done"><CheckIcon /> Selesai</span>
                )}
                {m.locked && (
                  <span className="materi-status-badge locked"><LockIcon /> Terkunci</span>
                )}
                <div className="materi-index-top">
                  <div className="materi-index-icon">{m.icon}</div>
                  <span className="materi-index-num">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
                <div className="materi-index-tags">
                  {m.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <span className="materi-index-link">
                  {m.locked ? "Terkunci" : m.completed ? "Buka Lagi" : "Mulai Materi"} <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {showLoginModal && (
        <div className="login-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setShowLoginModal(false)} aria-label="Tutup">
              <CloseIcon />
            </button>
            <div className="login-modal-icon"><LockIcon /></div>
            <h3>Masuk Terlebih Dahulu</h3>
            <p>Kamu perlu login untuk mengakses materi ini. Silakan masuk ke akunmu untuk melanjutkan pembelajaran.</p>
            <div className="login-modal-actions">
              <button className="btn btn-primary" onClick={goToLogin}>Login Sekarang</button>
              <button className="login-modal-cancel" onClick={() => setShowLoginModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {lockedItem && (
        <div className="login-modal-overlay" onClick={() => setLockedItem(null)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setLockedItem(null)} aria-label="Tutup">
              <CloseIcon />
            </button>
            <div className="login-modal-icon locked"><LockIcon /></div>
            <h3>Materi Ini Masih Terkunci</h3>
            <p>
              Selesaikan <strong>{lockedItem.prevTitle}</strong> terlebih dahulu
              sebelum melanjutkan ke <strong>{lockedItem.title}</strong>.
            </p>
            <div className="login-modal-actions">
              <button className="login-modal-cancel" onClick={() => setLockedItem(null)} style={{ margin: "0 auto" }}>
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoadingToast && (
        <div className="materi-toast" role="status">
          <span className="materi-progress-spinner" aria-hidden="true" />
          Progres masih dimuat, mohon tunggu sebentar…
        </div>
      )}

      <Footer />
    </>
  );
}

// Wave divider lokal (identik dengan komponen di Home.jsx) supaya halaman
// ini tetap berdiri sendiri tanpa bergantung pada file Home.jsx.
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