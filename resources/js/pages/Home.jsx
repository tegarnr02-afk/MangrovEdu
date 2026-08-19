import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import heroBg from "./hero-mangrove.png";
import misiImg from "./misi.png";
import Navbar from "./Navbar";
import Footer from "./Footer";

const faqs = [
  {
    q: "Apa itu MangrovEdu?",
    a: "MangrovEdu adalah platform belajar interaktif tentang ekosistem mangrove yang dirancang khusus untuk siswa SMP, lengkap dengan materi, lab virtual, simulasi, dan kuis.",
  },
  {
    q: "Apakah gratis?",
    a: "Ya, seluruh materi, simulasi, dan kuis di MangrovEdu dapat diakses secara gratis untuk mendukung pembelajaran di sekolah maupun mandiri.",
  },
  {
    q: "Bagaimana menggunakan simulasi?",
    a: "Masuk ke menu Simulasi, atur kondisi mangrove seperti kerapatan dan tinggi gelombang, lalu lihat hasilnya secara langsung dalam bentuk visual dan grafik.",
  },
  {
    q: "Apakah bisa di HP?",
    a: "Bisa. Tampilan MangrovEdu responsif dan tetap nyaman digunakan baik di laptop, tablet, maupun ponsel.",
  },
];

const testimonials = [
  {
    quote:
      "Belajar mangrove jadi lebih mudah dipahami lewat simulasinya, aku jadi tahu kenapa pantai rumah nenekku nggak gampang terkikis.",
    name: "Raka Pratama",
    role: "Siswa Kelas VIII",
    avatar: "R",
    accent: "#2F6B57",
  },
  {
    quote:
      "Fitur Lab Virtualnya seru banget, aku bisa coba-coba ubah kerapatan mangrove dan langsung lihat efeknya ke gelombang.",
    name: "Salsabila Putri",
    role: "Siswa Kelas VII",
    avatar: "S",
    accent: "#C97C1E",
  },
  {
    quote:
      "Sebagai guru IPA, MangrovEdu sangat membantu menjelaskan konsep abrasi tanpa harus membawa siswa langsung ke pantai.",
    name: "Bu Wulan",
    role: "Guru IPA SMP",
    avatar: "B",
    accent: "#1E8A8C",
  },
];

const tujuanGoals = [
  "Mengidentifikasi komponen dan hubungan antar komponen dalam ekosistem mangrove.",
  "Menganalisis perubahan lingkungan dan hubungan sebab-akibat yang terjadi pada ekosistem mangrove.",
  "Menjelaskan proses dan dampak abrasi terhadap lingkungan pesisir dan kehidupan masyarakat.",
  "Menjelaskan fungsi ekologis dan manfaat mangrove bagi masyarakat serta pentingnya pemanfaatan dan konservasi mangrove secara berkelanjutan.",
  "Memprediksi dan menguji hubungan antara kondisi mangrove dan perlindungan kawasan pesisir melalui Laboratorium Virtual.",
];

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

const WaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 8c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
    <path d="M2 14c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
    <path d="M2 20c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

const QuizIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 9.5a3 3 0 1 1 4.2 2.7c-.9.4-1.7 1.1-1.7 2.1v.7" />
    <circle cx="11.5" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
    <rect x="3" y="3" width="18" height="18" rx="4" />
  </svg>
);

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="5" rx="1.5" />
    <rect x="13" y="10" width="8" height="11" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.8 20c.7-3.4 3.2-5.4 6.2-5.4s5.5 2 6.2 5.4" />
    <path d="M15.5 5.2a3.2 3.2 0 0 1 0 6.2M20 20c-.5-2.6-1.9-4.4-3.9-5.1" />
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

const DeviceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="4" width="14" height="10" rx="1.4" />
    <path d="M6 18h6" />
    <rect x="15.5" y="8.5" width="6" height="10.5" rx="1.2" />
    <path d="M18.5 16.2h.01" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3.5 14.5 9l6 .8-4.4 4.1 1.2 5.9L12 16.9l-5.3 2.9 1.2-5.9L3.5 9.8l6-.8Z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

// Angka yang berjalan naik dari 0 ke nilai akhir saat elemen terlihat di layar.
const CountUp = ({ end, suffix = "", duration = 1200, delay = 0, start }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf;
    let startTime = null;

    const tick = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    const timeoutId = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [start, end, duration, delay]);

  return <>{value}{suffix}</>;
};

// Pembatas antar section berbentuk gelombang laut.
// Ditempel LANGSUNG di dalam bagian bawah tiap section (position:absolute),
// `fill` = warna section berikutnya. Pendekatan ini menghindari bug
// margin negatif + z-index yang sebelumnya menyebabkan pita warna dobel.
const WaveDivider = ({ fill, flip = false }) => (
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

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  // Scroll reveal
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
  }, []);

  // Trigger animasi count-up saat badge "Sekilas Angka" masuk viewport
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStatsVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const modules = [
    {
      icon: <LeafIcon />,
      title: "Komponen Biotik & Abiotik",
      desc: "Pelajari karakteristik spesies mangrove dan unsur fisik pendukungnya, seperti salinitas, pasang surut air laut, dan tingkat kelembapan.",
      accent: "#2F6B57",
      accentBg: "#E4EFE7",
      to: "/materi/ekosistem-mangrove",
    },
    {
      icon: <InteractionIcon />,
      title: "Interaksi Ekosistem",
      desc: "Visualisasi dinamis yang menunjukkan bagaimana setiap komponen saling terhubung sebagai satu jaringan kehidupan.",
      accent: "#C97C1E",
      accentBg: "#FBEEDA",
      id: "materi",
      to: "/materi/interaksi-ekosistem",
    },
    {
      icon: <RefreshIcon />,
      title: "Perubahan Lingkungan",
      desc: "Analisis dampak abrasi pantai, perambahan lahan, serta perubahan iklim terhadap kelangsungan hutan mangrove.",
      accent: "#1E8A8C",
      accentBg: "#E1F1F1",
      to: "/materi/perubahan-lingkungan",
    },
    {
      icon: <FlaskIcon />,
      title: "Lab Virtual & Simulasi",
      desc: "Eksperimen interaktif dengan mengubah variabel — kerapatan vegetasi, tinggi gelombang, dan lihat efeknya secara langsung.",
      accent: "#6C63B5",
      accentBg: "#EAE8F6",
      id: "simulasi",
      to: "/lab",
    },
    {
      icon: <QuizIcon />,
      title: "Kuis Causal Reasoning",
      desc: "Evaluasi pemahaman sebab-akibat melalui soal kontekstual yang melatih penalaran kritis, bukan sekadar hafalan.",
      accent: "#C24A5F",
      accentBg: "#F8E4E7",
      id: "kuis",
      to: "/kuis",
    },
    {
      icon: <DashboardIcon />,
      title: "Dasbor Progres Belajar",
      desc: "Lacak riwayat belajar, pencapaian lencana, statistik kuis, dan rekomendasi materi lanjutan berdasarkan capaian kamu.",
      accent: "#1E8A8C",
      accentBg: "#E1F1F1",
      id: "dashboard",
      to: "/dashboard",
    },
  ];

  const caraSteps = [
    { icon: <UsersIcon />, title: "Buat Akun / Masuk", desc: "Daftar sebagai siswa atau pengajar untuk mengakses seluruh materi dan fitur modul.", href: "#register" },
    { icon: <BookIcon />, title: "Pilih Materi & Lab", desc: "Pilih topik interaktif yang ingin dipelajari atau buka simulasi di Lab Virtual.", href: "#materi" },
    { icon: <FlaskIcon />, title: "Simulasi & Kuis Causal", desc: "Uji variabel lingkungan dan selesaikan kuis untuk melatih pemahaman sebab-akibat.", href: "#kuis" },
    { icon: <DashboardIcon />, title: "Pantau Dasbor Progres", desc: "Lihat rekap capaian nilai, tingkat pemahaman, serta klaim lencana kelulusan modul.", href: "#dashboard" },
  ];

  const mengapaBenefits = [
    { icon: <BookIcon />, title: "Materi Interaktif", desc: "Bukan sekadar teks — tiap topik dilengkapi ilustrasi dan visual yang mudah dicerna." },
    { icon: <FlaskIcon />, title: "Lab & Simulasi Nyata", desc: "Ubah variabel lingkungan dan lihat dampaknya secara langsung, bukan cuma teori." },
    { icon: <DeviceIcon />, title: "Akses Kapan Saja", desc: "Bisa dibuka dari HP, tablet, atau laptop — di sekolah maupun di rumah." },
    { icon: <StarIcon />, title: "100% Gratis", desc: "Seluruh materi, lab, dan kuis bisa diakses tanpa biaya apa pun." },
    { icon: <ClockIcon />, title: "Belajar Mandiri", desc: "Atur ritme belajarmu sendiri, tanpa tekanan tenggat waktu." },
    { icon: <UsersIcon />, title: "Cocok untuk Kelas", desc: "Mendukung siswa dan pengajar dengan dasbor progres masing-masing." },
  ];

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
        .container{
          max-width:1180px;
          margin:0 auto;
          padding:0 32px;
        }
        section{position:relative;}
        .btn{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:15px 30px;
          border-radius:999px;
          font-weight:700;
          font-size:0.95rem;
          cursor:pointer;
          border:none;
          transition:transform .25s ease, box-shadow .25s ease, background .25s ease;
          font-family:'Plus Jakarta Sans', sans-serif;
        }
        .btn-primary{
          background:var(--amber);
          color:var(--canopy);
          box-shadow:0 12px 24px -10px rgba(232,163,61,0.7);
        }
        .btn-primary:hover{ transform:translateY(-3px); box-shadow:0 16px 30px -10px rgba(232,163,61,0.85); }
        .btn-outline{
          background:transparent;
          color:var(--paper);
          border:1.5px solid rgba(251,250,245,0.5);
        }
        .btn-outline:hover{ background:rgba(251,250,245,0.12); transform:translateY(-3px);}
        .btn-dark{
          background:var(--canopy);
          color:var(--paper);
        }
        .btn-dark:hover{ background:var(--estuary); transform:translateY(-3px);}

        .hero{
          position:relative;
          min-height:100vh;
          display:flex;
          align-items:center;
          background-size:cover;
          background-position:center 38%;
          background-repeat:no-repeat;
          overflow:hidden;
          isolation:isolate;
        }
        .hero::before{
          content:"";
          position:absolute; inset:0; z-index:0;
          background:
            linear-gradient(90deg, rgba(10,22,17,0.82) 0%, rgba(10,22,17,0.58) 32%, rgba(10,22,17,0.18) 58%, rgba(10,22,17,0) 78%),
            linear-gradient(0deg, rgba(10,22,17,0.55) 0%, rgba(10,22,17,0.05) 32%, rgba(10,22,17,0.15) 100%);
        }
        /* Fade halus di dasar Hero jadi solid var(--canopy),
           supaya menyatu dengan area transparan di atas kurva WaveDivider
           yang sekarang ditempel absolute di dalam section ini. */
        .hero::after{
          content:"";
          position:absolute; left:0; right:0; bottom:0; z-index:0;
          height:220px;
          background:linear-gradient(0deg, var(--canopy) 0%, rgba(15,36,29,0) 100%);
          pointer-events:none;
        }
        .hero-inner{
          position:relative; z-index:1;
          width:100%;
          max-width:1440px;
          margin:0 auto;
          padding:150px clamp(24px, 6vw, 90px) 110px;
        }
        .hero-content{ max-width:640px; }
        .hero h1{
          font-family:'Plus Jakarta Sans', sans-serif;
          font-weight:800;
          color:var(--paper);
          font-size:clamp(2.2rem, 4.4vw, 3.4rem);
          letter-spacing:-0.01em;
          margin-bottom:22px;
          text-wrap:balance;
        }
        .hero h1 em{ font-style:normal; color:var(--amber); }
        .hero p.lead{
          font-size:1.08rem; color:rgba(251,250,245,0.88); max-width:560px; margin-bottom:34px;
        }
        .hero-btns{display:flex; gap:16px; flex-wrap:wrap;}
        .hero-btn-secondary{
          background:transparent; color:var(--paper); border:1.5px solid rgba(251,250,245,0.6);
        }
        .hero-btn-secondary:hover{ background:rgba(251,250,245,0.12); border-color:var(--paper); transform:translateY(-3px); }

        .section-head{ max-width:640px; margin-bottom:52px; }
        .section-head.center{ margin-left:auto; margin-right:auto; text-align:center; }
        .section-head h2{ font-size:clamp(2rem,3.2vw,2.9rem); margin-top:14px; }
        .section-head p{ color:#4C5F58; margin-top:14px; font-size:1.02rem; }

        .wave-divider{ position:absolute; left:0; right:0; bottom:-1px; line-height:0; pointer-events:none; z-index:5; }
        .wave-divider svg{ display:block; width:100%; height:80px; }
        @media (max-width:768px){ .wave-divider svg{ height:50px; } .hero::after{ height:150px; } }
        @media (max-width:480px){ .wave-divider svg{ height:34px; } .hero::after{ height:110px; } }

        .about{ background:var(--paper); padding:100px 0; }

        /* Kolom ditukar: narasi di kiri, visual foto + floating stat card di kanan */
        .about-grid{
          display:grid;
          grid-template-columns:1.05fr 0.95fr;
          grid-template-areas:"copy visual";
          gap:64px;
          align-items:start;
        }
        .about-copy{ grid-area:copy; }
        .about-copy h2{ font-size:clamp(1.6rem,2.4vw,2.2rem); margin-top:14px; margin-bottom:18px; }
        .about-copy p{ color:#3C5049; margin-bottom:18px; font-size:1.02rem; }
        .about-visual{ grid-area:visual; }

        /* Strip angka ringkas di bagian atas narasi, dipisah garis vertikal tipis */
        .about-lede-stats{ display:flex; margin:8px 0 30px; }
        .about-lede-stats div{ flex:1; padding:0 22px; border-left:1px solid rgba(15,36,29,0.12); }
        .about-lede-stats div:first-child{ padding-left:0; border-left:none; }
        .about-lede-stats b{
          font-family:'Fraunces', serif; font-size:1.9rem; font-weight:600;
          color:var(--estuary); display:block; line-height:1; margin-bottom:6px;
        }
        .about-lede-stats span{ font-size:0.8rem; color:#4C5F58; }

        /* Kartu foto + kartu stat mengambang yang menumpang di tepi bawahnya */
        .about-photo{
          background:var(--canopy);
          background-size:cover; background-repeat:no-repeat;
          border-radius:var(--radius-lg);
          min-height:400px;
          position:relative;
          display:flex; align-items:flex-start;
          overflow:hidden;
        }
        .about-photo-img{
          position:absolute; inset:0; width:100%; height:100%;
          object-fit:cover; z-index:0;
        }
        .about-photo::before{
          content:"";
          position:absolute; inset:0; z-index:1;
          background:linear-gradient(180deg, rgba(15,36,29,0.92) 0%, rgba(15,36,29,0.55) 35%, rgba(15,36,29,0.15) 65%, rgba(15,36,29,0) 85%);
        }
        .about-photo-overlay{ position:relative; z-index:2; padding:36px 34px; color:var(--paper); }
        .about-photo-overlay .eyebrow{ text-shadow:0 1px 4px rgba(0,0,0,0.4); }
        .about-photo-overlay .big-quote{
          font-family:'Fraunces', serif; font-style:italic; font-size:1.4rem; font-weight:500;
          margin-top:16px; line-height:1.35; text-shadow:0 1px 6px rgba(0,0,0,0.45);
        }
        .about-float-card{
          position:relative; z-index:2;
          margin:-46px 22px 0; padding:20px 22px;
          background:var(--paper); border-radius:var(--radius-md); box-shadow:var(--shadow);
        }
        .about-float-grid{ display:grid; grid-template-columns:repeat(5,1fr); gap:10px; margin-top:14px; }
        .about-float-item{ display:flex; flex-direction:column; align-items:flex-start; gap:6px; }
        .about-float-icon{
          width:30px; height:30px; border-radius:9px; background:var(--tide-pale); color:var(--estuary);
          display:flex; align-items:center; justify-content:center;
        }
        .about-float-icon svg{ width:15px; height:15px; }
        .about-float-item b{ font-family:'Space Mono', monospace; color:var(--canopy); font-size:0.95rem; display:block; }
        .about-float-item span{ font-size:0.72rem; color:#5C6F67; line-height:1.25; }

        .tujuan{ background:var(--tide-pale); padding:100px 0; }
        .tujuan-list{ display:grid; grid-template-columns:repeat(2,1fr); gap:18px; margin-top:12px; }
        .tujuan-item{
          display:flex; align-items:flex-start; gap:16px;
          background:var(--paper); border-radius:18px; padding:24px 22px;
          border:1px solid rgba(15,36,29,0.06);
          box-shadow:0 4px 16px -10px rgba(15,36,29,0.12);
          transition:transform .3s ease, box-shadow .3s ease;
        }
        .tujuan-item:hover{ transform:translateY(-4px); box-shadow:0 16px 28px -16px rgba(15,36,29,0.22); }
        .tujuan-item:last-child{ grid-column: span 2; }
        .tujuan-num{
          width:38px; height:38px; border-radius:50%; flex-shrink:0;
          background:var(--tide-pale); color:var(--estuary);
          display:flex; align-items:center; justify-content:center;
          font-family:'Space Mono', monospace; font-weight:700; font-size:0.95rem;
        }
        .tujuan-item p{ font-size:0.94rem; color:#33473F; line-height:1.6; padding-top:6px; }
        @media (max-width:768px){
          .tujuan-list{ grid-template-columns:1fr; }
          .tujuan-item:last-child{ grid-column: span 1; }
        }

        .showcase{ background:var(--sand); padding:100px 0; }
        .modul-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .modul-card{
          display:block;
          background:var(--paper);
          border-radius:20px;
          padding:30px 26px;
          border:1px solid rgba(15,36,29,0.06);
          box-shadow:0 4px 16px -10px rgba(15,36,29,0.12);
          transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;
          position:relative;
        }
        .modul-card:hover{
          transform:translateY(-8px);
          box-shadow:0 20px 34px -18px rgba(15,36,29,0.24);
          border-color:var(--accent, var(--estuary));
        }
        .modul-icon{
          width:50px; height:50px; border-radius:14px;
          background:var(--accent-bg, var(--tide-pale));
          color:var(--accent, var(--estuary));
          display:flex; align-items:center; justify-content:center;
          margin-bottom:20px;
          transition:transform .35s ease, rotate .35s ease;
        }
        .modul-icon svg{ width:24px; height:24px; }
        .modul-card:hover .modul-icon{ transform:scale(1.08) rotate(-6deg); }
        .modul-card h4{ font-size:1.08rem; margin-bottom:9px; color:var(--canopy); }
        .modul-card p{ font-size:0.9rem; color:#556961; margin-bottom:20px; line-height:1.55; }
        .modul-link{
          font-weight:700; font-size:0.85rem; color:var(--accent, var(--estuary));
          display:inline-flex; align-items:center; gap:6px;
        }
        .modul-link svg{ width:14px; height:14px; transition:transform .25s ease; }
        .modul-card:hover .modul-link svg{ transform:translateX(5px); }
        .modul-card::before{
          content:""; position:absolute; top:0; left:26px; right:26px; height:3px;
          background:var(--accent, var(--estuary)); border-radius:0 0 4px 4px;
          transform:scaleX(0); transform-origin:left; transition:transform .35s ease;
        }
        .modul-card:hover::before{ transform:scaleX(1); }

        .cara{ background:var(--sand); padding:100px 0; }
        .eyebrow-pill{
          background:#DCEEE2; color:var(--estuary);
          padding:9px 18px; border-radius:999px;
        }
        .eyebrow-pill svg{ width:15px; height:15px; }
        .cara-grid{ position:relative; display:grid; grid-template-columns:repeat(4,1fr); gap:22px; margin-top:12px; }
        .cara-line{
          position:absolute; top:62px; left:12%; right:12%; height:2px; z-index:0;
          background:repeating-linear-gradient(90deg, var(--estuary) 0 10px, transparent 10px 18px);
        }
        .cara-card{
          position:relative; z-index:1;
          display:block; text-decoration:none; color:inherit;
          background:var(--paper);
          border:1px solid rgba(15,36,29,0.08);
          border-radius:18px;
          padding:36px 24px;
          text-align:center;
          transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .cara-card:hover{
          transform:translateY(-6px);
          box-shadow:0 18px 30px -18px rgba(15,36,29,0.22);
          border-color:var(--estuary);
        }
        .cara-badge{
          position:relative;
          width:52px; height:52px; border-radius:50%;
          background:var(--estuary); color:var(--paper);
          overflow:hidden;
          margin:0 auto 22px;
          transition:transform .35s ease, background .35s ease;
        }
        .cara-card:hover .cara-badge{ transform:scale(1.1) rotate(-6deg); background:var(--canopy); }
        .cara-badge-num, .cara-badge-icon{
          position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          transition:opacity .3s ease, transform .3s ease;
        }
        .cara-badge-num{ font-family:'Space Mono', monospace; font-weight:700; font-size:1.05rem; }
        .cara-badge-icon{ opacity:0; transform:scale(0.4) rotate(-40deg); }
        .cara-badge-icon svg{ width:22px; height:22px; }
        .cara-card:hover .cara-badge-num{ opacity:0; transform:scale(0.4) rotate(40deg); }
        .cara-card:hover .cara-badge-icon{ opacity:1; transform:scale(1) rotate(0deg); }
        .cara-card h4{ font-size:1.04rem; margin-bottom:10px; }
        .cara-card p{ font-size:0.88rem; color:#556961; line-height:1.65; }
        .cara-mobile-arrow{ display:none; color:var(--estuary); font-size:1.2rem; margin-top:16px; }

        .mengapa{ background:var(--canopy); color:var(--paper); padding:100px 0; }
        .mengapa .eyebrow{ color:var(--tide); }
        .mengapa h2{ color:var(--paper); }
        .mengapa .section-head p{ color:rgba(251,250,245,0.72); }
        .mengapa-benefit-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-top:12px; }
        .mengapa-benefit-card{
          background:rgba(251,250,245,0.05);
          border:1px solid rgba(251,250,245,0.12);
          border-radius:16px;
          padding:26px 22px;
          transition:transform .3s ease, background .3s ease, border-color .3s ease;
        }
        .mengapa-benefit-card:hover{
          transform:translateY(-6px);
          background:rgba(251,250,245,0.09);
          border-color:var(--amber);
        }
        .mengapa-benefit-icon{
          width:42px; height:42px; border-radius:12px;
          background:rgba(232,163,61,0.16); color:var(--amber);
          display:flex; align-items:center; justify-content:center;
          margin-bottom:16px;
          transition:transform .35s ease;
        }
        .mengapa-benefit-icon svg{ width:20px; height:20px; }
        .mengapa-benefit-card:hover .mengapa-benefit-icon{ transform:scale(1.1) rotate(-6deg); }
        .mengapa-benefit-card h4{ color:var(--paper); font-size:0.98rem; margin-bottom:7px; }
        .mengapa-benefit-card p{ color:rgba(251,250,245,0.62); font-size:0.85rem; line-height:1.6; }

        .testi{ background:var(--sand-deep); padding:100px 0; }
        .testi-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; align-items:stretch; }
        .testi-box{
          position:relative;
          display:flex; flex-direction:column;
          background:var(--paper); border-radius:var(--radius-lg); padding:40px 30px 32px; text-align:center;
          border:1px solid rgba(15,36,29,0.06);
          border-top:3px solid transparent;
          overflow:hidden;
          transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .testi-box:hover{
          transform:translateY(-8px);
          box-shadow:0 20px 34px -18px rgba(15,36,29,0.24);
          border-color:rgba(15,36,29,0.06);
          border-top-color:var(--accent, var(--estuary));
        }
        .testi-quote-mark{
          position:absolute; top:-6px; left:18px;
          font-family:'Fraunces', serif; font-size:5rem; line-height:1;
          color:var(--accent, var(--estuary)); opacity:0.12;
          pointer-events:none;
        }
        .stars{ color:var(--amber); font-size:1rem; letter-spacing:3px; margin-bottom:18px; position:relative; }
        .testi-box p.quote{
          font-family:'Fraunces', serif; font-style:italic; font-size:1.05rem; color:var(--canopy);
          margin-bottom:24px; line-height:1.6; position:relative; flex:1;
        }
        .testi-person{ display:flex; align-items:center; justify-content:center; gap:12px; margin-top:auto; }
        .testi-avatar{
          width:44px; height:44px; border-radius:50%;
          background:var(--accent, var(--estuary)); color:var(--paper);
          display:flex; align-items:center; justify-content:center; font-weight:700; font-family:'Space Mono',monospace;
          transition:transform .3s ease;
        }
        .testi-box:hover .testi-avatar{ transform:scale(1.1); }
        .testi-person{ text-align:left; }
        .testi-person b{ display:block; font-size:0.92rem; }
        .testi-person span{ font-size:0.8rem; color:#688079; }

        .faq{ background:var(--paper); padding:100px 0; }
        .faq-list{ max-width:760px; margin:0 auto; }
        .faq-item{ border-bottom:1px solid rgba(15,36,29,0.1); }
        .faq-q{
          width:100%; background:none; border:none; text-align:left; padding:24px 4px;
          display:flex; justify-content:space-between; align-items:center; cursor:pointer;
          font-family:'Fraunces', serif; font-size:1.08rem; font-weight:500; color:var(--canopy);
        }
        .faq-q .plus{
          width:26px; height:26px; border-radius:50%; border:1.5px solid var(--estuary); flex-shrink:0;
          display:flex; align-items:center; justify-content:center; position:relative; transition:transform .3s ease, background .3s ease;
        }
        .faq-q .plus::before, .faq-q .plus::after{
          content:""; position:absolute; background:var(--estuary); transition:transform .3s ease;
        }
        .faq-q .plus::before{ width:10px; height:1.6px; }
        .faq-q .plus::after{ width:1.6px; height:10px; }
        .faq-item.open .faq-q .plus{ background:var(--estuary); }
        .faq-item.open .faq-q .plus::before, .faq-item.open .faq-q .plus::after{ background:var(--paper); }
        .faq-item.open .faq-q .plus::after{ transform:scaleY(0); }
        .faq-a{ max-height:0; overflow:hidden; transition:max-height .35s ease; }
        .faq-item.open .faq-a{ max-height:400px; }
        .faq-a p{ padding:0 4px 26px; color:#4C5F58; font-size:0.96rem; max-width:600px; }

        .cta{
          /* Diubah ke arah vertikal (atas->bawah) supaya seluruh tepi atas section
             ini rata warna var(--estuary), persis sama dengan fill WaveDivider
             sebelumnya. Kalau diagonal (135deg), sisi kanan tepi atas sudah
             kecampur ke arah canopy sehingga warnanya tidak pas dengan divider. */
          background:linear-gradient(180deg, var(--estuary) 0%, var(--canopy) 100%);
          padding:110px 0; text-align:center; position:relative; overflow:hidden;
        }
        .cta::before{
          content:""; position:absolute; width:600px; height:600px; border-radius:50%;
          background:radial-gradient(circle, rgba(232,163,61,0.25), transparent 65%);
          top:-260px; right:-160px;
        }
        .cta h2{ color:var(--paper); font-size:clamp(2rem,3.4vw,2.8rem); position:relative; z-index:1; }
        .cta p{ color:rgba(251,250,245,0.78); margin:18px auto 34px; max-width:480px; position:relative; z-index:1; }
        .cta .btn-primary{ position:relative; z-index:1; }

        .reveal{ opacity:0; transform:translateY(26px); transition:opacity .7s ease, transform .7s ease; }
        .reveal.show{ opacity:1; transform:translateY(0); }

        @media (max-width:980px){
          .hero{ min-height:88vh; }
          .hero-inner{ padding:130px clamp(20px, 6vw, 56px) 90px; }
          .about-grid{ grid-template-columns:1fr; grid-template-areas:"visual" "copy"; gap:44px; }
          .modul-grid{ grid-template-columns:repeat(2,1fr); }
          .cara-grid{ grid-template-columns:repeat(2,1fr); }
          .cara-line{ display:none; }
          .mengapa-benefit-grid{ grid-template-columns:repeat(2,1fr); }
          .testi-grid{ grid-template-columns:1fr; }
        }
        @media (max-width:600px){
          .container{ padding:0 20px; }
          .modul-grid{ grid-template-columns:1fr; }
          .cara-grid{ grid-template-columns:1fr; }
          .cara-mobile-arrow{ display:block; }
          .mengapa-benefit-grid{ grid-template-columns:1fr; }
          .about-lede-stats{
            display:grid; grid-template-columns:repeat(3,1fr); gap:10px;
          }
          .about-lede-stats div{
            flex:none; border-left:none; padding:14px 6px;
            text-align:center; border:1px solid rgba(15,36,29,0.12);
            border-radius:14px; background:rgba(15,36,29,0.03);
          }
          .about-lede-stats div:first-child{ padding:14px 6px; }
          .about-lede-stats b{ font-size:1.3rem; }
          .about-lede-stats span{ font-size:0.7rem; line-height:1.3; display:block; }
          .about-float-grid{ grid-template-columns:repeat(3,1fr); }
          .about-float-card{ margin:-30px 14px 0; }
          .hero-btns{ flex-direction:column; align-items:stretch; }
          .cta{ padding:80px 0; }
        }
      `}</style>

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section
        className="hero"
        id="beranda"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="hero-inner">
          <div className="hero-content">
            <h1>
              MangrovEdu: Platform Pembelajaran Interaktif
            </h1>
            <p className="lead">
              Jelajahi ekosistem mangrove melalui Materi (komponen
              biotik/abiotik, interaksi, perubahan lingkungan), Lab Virtual
              &amp; Simulasi interaktif, Kuis Causal, dan pantau progres di
              Dasbor.
            </p>
            <div className="hero-btns">
              <Link to="/materi" className="btn btn-primary">Mulai Belajar</Link>
              <Link to="/lab" className="btn hero-btn-secondary">Eksplorasi Lab</Link>
            </div>
          </div>
        </div>
        <WaveDivider fill="var(--paper)" />
      </section>

      {/* ================= TENTANG ================= */}
      <section className="about" id="tentang">
        <div className="container">
          <div className="about-grid">
            <div className="about-copy reveal">
              <span className="eyebrow">Tentang kami</span>
              <h2>Ruang belajar digital untuk mengenal hutan mangrove lebih dekat</h2>
              <p>
                MangrovEdu adalah platform pembelajaran interaktif yang
                dirancang untuk membantu siswa SMP memahami ekosistem mangrove
                — mulai dari struktur dan penghuninya, hingga perannya menahan
                abrasi pantai. Dibuat karena banyak siswa hanya mengenal
                mangrove lewat teks di buku, padahal ekosistem ini paling
                mudah dipahami lewat visual, eksperimen, dan simulasi
                sebab-akibat yang bisa dicoba berulang kali tanpa risiko.
              </p>

              <div className="about-lede-stats">
                <div><b>SMP</b><span>Jenjang sasaran</span></div>
                <div><b>4</b><span>Mode belajar</span></div>
                <div><b>100%</b><span>Berbasis web</span></div>
              </div>
            </div>

            <div className="about-visual reveal">
              <div className="about-photo">
                <img
                  src={misiImg}
                  alt="Ilustrasi dua siswa belajar ekosistem mangrove lewat laptop"
                  className="about-photo-img"
                />
                <div className="about-photo-overlay">
                  <span className="eyebrow" style={{ color: "#C9DCCF" }}>Misi kami</span>
                  <p className="big-quote">
                    "Sekolah pesisir yang bisa dibuka kapan saja, dari mana saja."
                  </p>
                </div>
              </div>

              <div className="about-float-card" ref={statsRef}>
                <span className="eyebrow" style={{ fontSize: "0.68rem" }}>Sekilas angka</span>
                <div className="about-float-grid">
                  <div className="about-float-item"><span className="about-float-icon"><BookIcon /></span><b><CountUp end={5} start={statsVisible} delay={0} /></b><span>Materi</span></div>
                  <div className="about-float-item"><span className="about-float-icon"><FlaskIcon /></span><b><CountUp end={1} start={statsVisible} delay={80} /></b><span>Lab Virtual</span></div>
                  <div className="about-float-item"><span className="about-float-icon"><WaveIcon /></span><b><CountUp end={1} start={statsVisible} delay={160} /></b><span>Simulasi</span></div>
                  <div className="about-float-item"><span className="about-float-icon"><QuizIcon /></span><b><CountUp end={50} suffix="+" start={statsVisible} delay={240} /></b><span>Soal Kuis</span></div>
                  <div className="about-float-item"><span className="about-float-icon"><UsersIcon /></span><b><CountUp end={100} suffix="+" start={statsVisible} delay={320} /></b><span>Pengguna</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <WaveDivider fill="var(--tide-pale)" />
      </section>

      {/* ================= TUJUAN PEMBELAJARAN ================= */}
      <section className="tujuan" id="tujuan">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow" style={{ justifyContent: "center" }}>Tujuan pembelajaran</span>
            <h2>Setelah menggunakan website pembelajaran, siswa diharapkan mampu:</h2>
          </div>
          <div className="tujuan-list">
            {tujuanGoals.map((g, i) => (
              <div className="tujuan-item reveal" style={{ transitionDelay: `${i * 90}ms` }} key={i}>
                <span className="tujuan-num">{String(i + 1).padStart(2, "0")}</span>
                <p>{g}</p>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider fill="var(--sand)" />
      </section>

      {/* ================= FITUR & MATERI ================= */}
      <section className="showcase" id="lab">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow" style={{ justifyContent: "center" }}>Fitur & materi utama</span>
            <h2>Modul Pembelajaran Interaktif &amp; Alat Simulasi</h2>
            <p>Rangkaian materi dirancang khusus untuk mendukung kemampuan penalaran kritis dan pemahaman ekologi secara menyeluruh.</p>
          </div>
          <div className="modul-grid">
            {modules.map((m, i) => (
              <Link
                to={m.to}
                className="modul-card reveal"
                key={i}
                id={m.id}
                style={{ "--accent": m.accent, "--accent-bg": m.accentBg }}
              >
                <div className="modul-icon">{m.icon}</div>
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
                <span className="modul-link">Pelajari Selengkapnya <ArrowIcon /></span>
              </Link>
            ))}
          </div>
        </div>
        <WaveDivider fill="var(--sand)" />
      </section>

      {/* ================= CARA MENGGUNAKAN ================= */}
      <section className="cara">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow eyebrow-pill" style={{ justifyContent: "center" }}>
              <InteractionIcon /> Alur pembelajaran
            </span>
            <h2>Cara Menggunakan MangrovEdu</h2>
            <p>4 langkah mudah memulai pembelajaran interaktif ekosistem mangrove bagi siswa dan pendidik.</p>
          </div>
          <div className="cara-grid">
            <div className="cara-line" aria-hidden="true" />
            {caraSteps.map((s, i) => (
              <a
                href={s.href}
                className="cara-card reveal"
                key={i}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="cara-badge">
                  <span className="cara-badge-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cara-badge-icon">{s.icon}</span>
                </div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
                {i < caraSteps.length - 1 && <span className="cara-mobile-arrow" aria-hidden="true">↓</span>}
              </a>
            ))}
          </div>
        </div>
        <WaveDivider fill="var(--canopy)" />
      </section>

      {/* ================= MENGAPA ================= */}
      <section className="mengapa">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow" style={{ justifyContent: "center" }}>Kenapa memilih kami</span>
            <h2>Mengapa Harus MangrovEdu?</h2>
            <p style={{ color: "rgba(251,250,245,0.78)" }}>
              Dirancang agar belajar ekosistem mangrove terasa ringan, jelas,
              dan bisa dilakukan di mana saja — bahkan dari ponsel di sekolah
              maupun rumah.
            </p>
          </div>
          <div className="mengapa-benefit-grid">
            {mengapaBenefits.map((b, i) => (
              <div className="mengapa-benefit-card reveal" style={{ transitionDelay: `${i * 90}ms` }} key={b.title}>
                <div className="mengapa-benefit-icon">{b.icon}</div>
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider fill="var(--sand-deep)" />
      </section>

      {/* ================= TESTIMONI ================= */}
      <section className="testi">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow" style={{ justifyContent: "center" }}>Kata mereka</span>
            <h2>Testimoni Pengguna</h2>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div
                className="testi-box reveal"
                style={{ transitionDelay: `${i * 100}ms`, "--accent": t.accent }}
                key={i}
              >
                <span className="testi-quote-mark" aria-hidden="true">&ldquo;</span>
                <div className="stars">★★★★★</div>
                <p className="quote">{t.quote}</p>
                <div className="testi-person">
                  <div className="testi-avatar">{t.avatar}</div>
                  <div><b>{t.name}</b><span>{t.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider fill="var(--paper)" />
      </section>

      {/* ================= FAQ ================= */}
      <section className="faq">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow" style={{ justifyContent: "center" }}>Pertanyaan umum</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list reveal">
            {faqs.map((item, i) => (
              <div className={`faq-item ${openFaqIndex === i ? "open" : ""}`} key={i}>
                <button
                  className="faq-q"
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? -1 : i)}
                >
                  {item.q} <span className="plus"></span>
                </button>
                <div className="faq-a">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider fill="var(--estuary)" />
      </section>

      {/* ================= CTA ================= */}
      <section className="cta">
        <div className="container">
          <h2>Siap Belajar Ekosistem Mangrove?</h2>
          <p>Mulai jelajahi materi, coba simulasi, dan uji pemahamanmu sekarang juga — gratis untuk semua siswa.</p>
          <Link to="/materi" className="btn btn-primary">Mulai Belajar</Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </>
  );
}