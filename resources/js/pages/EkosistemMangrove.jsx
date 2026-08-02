import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import sceneImg from "./ekosistem-mangrove-scene.png";

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
const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20c9 0 16-7 16-16-9 0-16 7-16 16Z" />
    <path d="M5 19c3.5-3.5 6-7 7.5-11" />
  </svg>
);

/* ================= DATA: HOTSPOT OBJEK EKOSISTEM =================
   Posisi (top/left) dikalibrasi manual mengikuti letak objek pada
   ilustrasi ekosistem-mangrove-scene.png (1536x1024). */
const hotspots = [
  {
    id: "matahari",
    label: "Cahaya Matahari",
    emoji: "☀️",
    type: "abiotik",
    top: "9%",
    left: "16%",
    facts: [
      "Menjadi sumber energi utama untuk proses fotosintesis mangrove.",
      "Tanpa cahaya matahari, tumbuhan tidak dapat menghasilkan makanan bagi seluruh ekosistem.",
    ],
  },
  {
    id: "burung",
    label: "Elang Laut",
    emoji: "🦅",
    type: "biotik",
    top: "24%",
    left: "75%",
    facts: [
      "Berburu ikan di sekitar perairan mangrove sebagai predator puncak.",
      "Kehadirannya menandakan rantai makanan di ekosistem ini berjalan sehat.",
    ],
  },
  {
    id: "pohon",
    label: "Pohon & Akar Mangrove",
    emoji: "🌳",
    type: "biotik",
    top: "34%",
    left: "52%",
    facts: [
      "Menjadi produsen utama yang menghasilkan makanan lewat fotosintesis.",
      "Akarnya yang menjulang menyaring air, menahan sedimen, dan meredam gelombang.",
      "Menjadi tempat berlindung bagi berbagai hewan kecil di sekitarnya.",
    ],
  },
  {
    id: "kepiting",
    label: "Kepiting Bakau",
    emoji: "🦀",
    type: "biotik",
    top: "66%",
    left: "24%",
    facts: [
      "Hidup di sekitar akar dan lumpur mangrove.",
      "Membantu menguraikan bahan organik dari serasah daun.",
      "Menjadi makanan bagi hewan lain seperti burung dan ikan.",
    ],
  },
  {
    id: "kerang",
    label: "Kerang",
    emoji: "🐚",
    type: "biotik",
    top: "82%",
    left: "48%",
    facts: [
      "Menempel dan hidup di sekitar akar serta lumpur mangrove.",
      "Menyaring partikel organik dari air di sekitarnya.",
    ],
  },
  {
    id: "ikan",
    label: "Ikan",
    emoji: "🐟",
    type: "biotik",
    top: "78%",
    left: "80%",
    facts: [
      "Mencari makan dan berlindung di antara akar mangrove yang terendam air.",
      "Menjadikan kawasan mangrove sebagai tempat pembesaran alami.",
    ],
  },
  {
    id: "lumpur",
    label: "Lumpur",
    emoji: "🪨",
    type: "abiotik",
    top: "94%",
    left: "12%",
    facts: [
      "Menjadi media tempat akar mangrove mencengkeram.",
      "Menyimpan bahan organik yang menopang seluruh rantai makanan.",
    ],
  },
  {
    id: "air",
    label: "Air Laut",
    emoji: "🌊",
    type: "abiotik",
    top: "50%",
    left: "85%",
    facts: [
      "Membawa nutrisi dari laut ke kawasan mangrove.",
      "Menentukan ritme pasang surut yang memengaruhi aktivitas hewan di sekitarnya.",
    ],
  },
];

/* ================= DATA: 5 JENIS MANGROVE ================= */
const mangroveSpecies = [
  {
    id: "bakau",
    nama: "Rhizophora mucronata",
    namaUmum: "Bakau",
    ciri: "Memiliki akar tunjang yang mencuat melengkung seperti kaki laba-laba dari permukaan lumpur.",
    habitat: "Hidup dan tumbuh subur di daerah pesisir yang berlumpur, pada zona terdepan dekat laut.",
    peran: "Melindungi pantai dari hantaman gelombang berkat jalinan akarnya yang rapat dan kuat.",
    accent: "#2F6B57",
    accentBg: "#E4EFE7",
  },
  {
    id: "apiapi",
    nama: "Avicennia marina",
    namaUmum: "Api-api",
    ciri: "Memiliki akar napas (pneumatofor) yang mencuat tegak lurus dari lumpur, dengan daun hijau keperakan.",
    habitat: "Tumbuh sebagai perintis di zona depan yang tahan terhadap kondisi salinitas tinggi.",
    peran: "Menjadi habitat awal bagi berbagai organisme pesisir sekaligus penstabil lumpur baru.",
    accent: "#C97C1E",
    accentBg: "#FBEEDA",
  },
  {
    id: "pedada",
    nama: "Sonneratia alba",
    namaUmum: "Pedada",
    ciri: "Memiliki buah berbentuk bulat dengan aroma khas dan akar napas berbentuk kerucut.",
    habitat: "Tumbuh di tepi laut, pada substrat berpasir hingga berlumpur di area muara.",
    peran: "Menahan gelombang dan membantu menstabilkan garis pantai di sekitarnya.",
    accent: "#1E8A8C",
    accentBg: "#E1F1F1",
  },
  {
    id: "tancang",
    nama: "Bruguiera gymnorrhiza",
    namaUmum: "Tancang",
    ciri: "Memiliki batang yang kuat serta akar lutut yang melengkung rendah di atas tanah.",
    habitat: "Tumbuh di zona tengah hutan mangrove yang kondisinya lebih stabil dibanding zona depan.",
    peran: "Menjadi tempat hidup berbagai fauna mangrove dan menyimpan banyak karbon di sedimennya.",
    accent: "#6C63B5",
    accentBg: "#EAE8F6",
  },
  {
    id: "nipah",
    nama: "Nypa fruticans",
    namaUmum: "Nipah",
    ciri: "Merupakan palma mangrove tanpa batang tegak yang terlihat, dengan daun menjulang panjang.",
    habitat: "Banyak ditemukan tumbuh di muara sungai yang beraliran payau.",
    peran: "Daunnya banyak dimanfaatkan masyarakat sekitar untuk berbagai keperluan sehari-hari.",
    accent: "#C24A5F",
    accentBg: "#F8E4E7",
  },
];

const speciesSteps = ["ciri", "habitat", "peran"];
const speciesStepLabel = { ciri: "Ciri yang Diamati", habitat: "Habitat", peran: "Peran Ekologis" };

/* ================= PERTANYAAN PEMANTIK 1 ================= */
const quiz1 = {
  question:
    "Lumpur dan air pasang surut sangat memengaruhi kehidupan makhluk hidup di ekosistem mangrove. Mengapa keduanya tetap dikategorikan sebagai komponen abiotik?",
  options: [
    "Karena keduanya termasuk makhluk hidup yang dapat bergerak sendiri",
    "Karena keduanya adalah faktor tak hidup yang menyediakan tempat tinggal dan nutrisi bagi komponen biotik",
    "Karena keduanya hanya dapat ditemukan di ekosistem mangrove",
  ],
  correct: 1,
  feedbackCorrect:
    "Tepat! Komponen abiotik adalah unsur tak hidup, namun perannya sangat besar dalam menopang kehidupan komponen biotik di sekitarnya.",
  feedbackWrong:
    "Belum tepat. Ingat, komponen abiotik dikenali dari sifatnya yang tak hidup — coba perhatikan lagi peran lumpur dan air pasang surut bagi makhluk hidup di sekitarnya.",
};

/* ================= PERTANYAAN PEMANTIK 2 (pilihan ganda kompleks) ================= */
const quiz2 = {
  type: "multi",
  question:
    "Pilih SEMUA pernyataan yang benar mengenai zonasi dan peran jenis-jenis mangrove berikut ini:",
  options: [
    "Xylocarpus (Nyirih) tumbuh di zona terdepan yang langsung berhadapan dengan laut.",
    "Avicennia (Api-api) berperan sebagai spesies pionir yang menstabilkan lumpur baru.",
    "Rhizophora (Bakau) adalah penahan utama gelombang karena jalinan akar tunjangnya yang rapat.",
    "Bruguiera (Tancang) memiliki akar napas berbentuk kerucut yang mencuat dari lumpur.",
  ],
  correct: [1, 2],
  feedbackCorrect:
    "Tepat! Kamu berhasil mengenali peran spesifik tiap jenis mangrove berdasarkan zonasi dan cirinya masing-masing.",
  feedbackWrong:
    "Belum semua tepat. Coba cek lagi bagian habitat dan ciri pada galeri di atas — perhatikan baik-baik posisi zonasi dan bentuk akar tiap jenis.",
};

export default function EkosistemMangrove() {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [visited, setVisited] = useState(new Set());
  const [q1Selected, setQ1Selected] = useState(null);
  const [q1Submitted, setQ1Submitted] = useState(false);

  const [speciesStep, setSpeciesStep] = useState({});
  const [speciesDone, setSpeciesDone] = useState(new Set());
  const [q2Selected, setQ2Selected] = useState(new Set());
  const [q2Submitted, setQ2Submitted] = useState(false);

  const toggleQ2 = (i) => {
    setQ2Selected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const q2IsCorrect =
    q2Selected.size === quiz2.correct.length &&
    quiz2.correct.every((c) => q2Selected.has(c));

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

  const handleHotspotClick = (h) => {
    setActiveHotspot(h);
    setVisited((prev) => new Set(prev).add(h.id));
  };

  const allVisited = visited.size === hotspots.length;
  const allSpeciesDone = speciesDone.size === mangroveSpecies.length;

  const nextSpeciesStep = (id) => {
    setSpeciesStep((prev) => {
      const current = prev[id] ?? 0;
      const next = Math.min(current + 1, speciesSteps.length - 1);
      if (next === speciesSteps.length - 1) {
        setSpeciesDone((d) => new Set(d).add(id));
      }
      return { ...prev, [id]: next };
    });
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
        .btn svg{ width:16px; height:16px; flex-shrink:0; }
        .btn-primary{ background:var(--amber); color:var(--canopy); box-shadow:0 12px 24px -10px rgba(232,163,61,0.7); }
        .btn-primary:hover{ transform:translateY(-3px); }
        .btn-outline{ background:transparent; color:var(--estuary); border:1.5px solid rgba(47,107,87,0.3); }
        .btn-outline:hover{ background:var(--tide-pale); }
        .btn:disabled{ opacity:0.45; cursor:not-allowed; transform:none !important; }

        /* ===== Banner ===== */
        .page-banner{ background:var(--canopy); padding:130px 0 60px; }
        .breadcrumb{ display:flex; align-items:center; gap:8px; font-size:0.85rem; color:rgba(251,250,245,0.65); margin-bottom:18px; }
        .breadcrumb a:hover{ color:var(--amber); }
        .breadcrumb span.current{ color:rgba(251,250,245,0.9); }
        .page-banner h1{ color:var(--paper); font-size:clamp(1.9rem,3.6vw,2.7rem); max-width:640px; margin-bottom:14px; }
        .page-banner p{ color:rgba(251,250,245,0.78); max-width:600px; }

        /* ===== Section shell ===== */
        .section{ padding:70px 0; }
        .section-head{ max-width:640px; margin-bottom:36px; }
        .section-head h2{ font-size:clamp(1.6rem,2.6vw,2.1rem); margin-top:12px; }
        .section-head p{ color:#4C5F58; margin-top:12px; }

        /* ===== Scene / illustration =====
           aspect-ratio dikunci mengikuti rasio asli gambar (1536x1024 = 3:2)
           supaya posisi hotspot (dalam %) selalu tepat di atas objeknya,
           di layar berapa pun — tidak ter-crop seperti kalau pakai
           min-height tetap. */
        .scene-wrap{ display:grid; grid-template-columns:1.3fr 1fr; gap:28px; align-items:stretch; }
        .scene{
          position:relative; border-radius:var(--radius-lg); overflow:hidden;
          background:var(--canopy); width:100%; aspect-ratio:3/2;
          box-shadow:0 20px 40px -20px rgba(15,36,29,0.35);
        }
        .scene-img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
        .hotspot{
          position:absolute; transform:translate(-50%,-50%);
          width:34px; height:34px; border-radius:50%;
          background:rgba(251,250,245,0.92); border:2px solid var(--amber);
          display:flex; align-items:center; justify-content:center; cursor:pointer;
          box-shadow:0 0 0 0 rgba(232,163,61,0.6);
          animation:pulseHotspot 2.2s ease-in-out infinite;
          font-family:'Space Mono', monospace; font-weight:700; font-size:0.7rem; color:var(--canopy);
        }
        .hotspot.visited{ background:var(--estuary); border-color:var(--estuary); color:var(--paper); animation:discoveredPop .5s ease; }
        .hotspot.active{ box-shadow:0 0 0 8px rgba(232,163,61,0.25); }
        @keyframes pulseHotspot{
          0%,100%{ box-shadow:0 0 0 0 rgba(232,163,61,0.5); }
          50%{ box-shadow:0 0 0 10px rgba(232,163,61,0); }
        }
        @keyframes discoveredPop{
          0%{ transform:translate(-50%,-50%) scale(1); }
          45%{ transform:translate(-50%,-50%) scale(1.45); }
          100%{ transform:translate(-50%,-50%) scale(1); }
        }
        /* Kanan-atas: area ini kosong di ilustrasi (tidak ada hotspot di sana),
           jadi badge ini tidak akan pernah menutupi titik interaktif manapun. */
        .scene-progress{
          position:absolute; top:16px; right:16px; z-index:3;
          background:rgba(15,36,29,0.85); color:var(--paper); font-size:0.78rem; font-weight:700;
          padding:9px 16px; border-radius:16px; font-family:'Space Mono', monospace;
          display:flex; flex-direction:column; gap:7px; min-width:170px;
        }
        .scene-progress-bar{ height:4px; background:rgba(251,250,245,0.22); border-radius:99px; overflow:hidden; }
        .scene-progress-bar span{ display:block; height:100%; background:var(--amber); border-radius:99px; transition:width .45s ease; }

        .info-panel{
          background:var(--paper); border-radius:var(--radius-lg); padding:28px;
          display:flex; flex-direction:column; box-shadow:0 20px 40px -24px rgba(15,36,29,0.3);
        }
        .info-panel-empty{ color:#7A8A83; font-size:0.94rem; margin-top:auto; margin-bottom:auto; }
        .info-badge{
          display:inline-flex; align-items:center; gap:6px; font-size:0.7rem; font-weight:700;
          text-transform:uppercase; letter-spacing:0.06em; padding:5px 12px; border-radius:999px;
          width:fit-content; margin-bottom:14px;
        }
        .info-badge.biotik{ background:#E4EFE7; color:var(--estuary); }
        .info-badge.abiotik{ background:#FBEEDA; color:var(--amber-deep); }
        .info-panel h3{ font-size:1.3rem; margin-bottom:14px; }
        .info-panel p{ color:#4C5F58; font-size:0.95rem; }
        .info-facts{ display:flex; flex-direction:column; gap:10px; list-style:none; }
        .info-facts li{
          display:flex; align-items:flex-start; gap:10px; font-size:0.92rem; color:#33473F; line-height:1.5;
        }
        .info-facts li svg{ width:15px; height:15px; color:var(--estuary); flex-shrink:0; margin-top:3px; }
        .species-nama-umum{ font-size:0.76rem; color:#7A8A83; font-style:italic; margin-top:-2px; }

        /* ===== Pertanyaan pemantik ===== */
        .quiz-box{
          background:var(--paper); border-radius:var(--radius-lg); padding:34px;
          box-shadow:0 20px 40px -24px rgba(15,36,29,0.28); margin-top:36px;
        }
        .quiz-locked{
          background:var(--sand-deep); border-radius:var(--radius-lg); padding:28px 34px;
          margin-top:36px; color:#5F726A; font-size:0.92rem; display:flex; align-items:center; gap:14px;
        }
        .quiz-box .eyebrow{ margin-bottom:10px; }
        .quiz-type-tag{
          display:inline-block; font-size:0.72rem; font-weight:700; color:var(--silt);
          background:var(--sand); padding:4px 10px; border-radius:999px; margin-bottom:14px; margin-left:10px;
        }
        .quiz-box h3{ font-size:1.2rem; margin-bottom:22px; }
        .quiz-option-dot.square{ border-radius:6px; }
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
        .quiz-option-dot{
          width:22px; height:22px; border-radius:50%; border:1.5px solid rgba(15,36,29,0.2);
          flex-shrink:0; display:flex; align-items:center; justify-content:center;
        }
        .quiz-feedback{
          margin-top:16px; padding:16px 18px; border-radius:14px; font-size:0.9rem;
          display:flex; gap:10px; align-items:flex-start;
        }
        .quiz-feedback.correct{ background:#E4EFE7; color:var(--canopy); }
        .quiz-feedback.wrong{ background:#F8E4E7; color:#7A2E3C; }
        .quiz-feedback svg{ width:18px; height:18px; flex-shrink:0; margin-top:2px; }

        /* ===== Galeri species ===== */
        .species-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
        .species-card{
          background:var(--paper); border-radius:20px; padding:24px; display:flex; flex-direction:column;
          border:1px solid rgba(15,36,29,0.06); box-shadow:0 4px 16px -10px rgba(15,36,29,0.12);
          transition:box-shadow .3s ease;
        }
        .species-card.done{ box-shadow:0 16px 28px -18px rgba(15,36,29,0.22); }
        .species-top{ display:flex; align-items:center; gap:12px; margin-bottom:16px; }
        .species-icon{
          width:44px; height:44px; border-radius:12px; background:var(--accent-bg); color:var(--accent);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .species-icon svg{ width:22px; height:22px; }
        .species-card h4{ font-size:1.02rem; }
        .species-step-label{
          font-family:'Space Mono', monospace; font-size:0.68rem; font-weight:700; text-transform:uppercase;
          letter-spacing:0.06em; color:var(--accent); margin-bottom:6px;
          animation:fadeSlideIn .35s ease;
        }
        .species-card p{ font-size:0.88rem; color:#4C5F58; flex:1; margin-bottom:16px; min-height:64px; animation:fadeSlideIn .35s ease; }
        @keyframes fadeSlideIn{
          from{ opacity:0; transform:translateY(6px); }
          to{ opacity:1; transform:translateY(0); }
        }
        .species-done-tag{ animation:popCheckSpecies .4s ease; }
        @keyframes popCheckSpecies{
          from{ transform:scale(0.6); opacity:0; }
          to{ transform:scale(1); opacity:1; }
        }
        .species-dots{ display:flex; gap:6px; margin-bottom:14px; }
        .species-dots span{ width:6px; height:6px; border-radius:50%; background:rgba(15,36,29,0.15); }
        .species-dots span.active{ background:var(--accent); width:16px; border-radius:4px; }
        .species-card .btn{ width:100%; justify-content:center; padding:10px; font-size:0.82rem; }
        .species-card .btn-outline{ border-color:var(--accent); color:var(--accent); }
        .species-done-tag{
          display:inline-flex; align-items:center; gap:6px; font-size:0.78rem; font-weight:700;
          color:var(--estuary); justify-content:center; padding:10px;
        }

        /* ===== CTA bawah ===== */
        .materi-nav{
          display:flex; justify-content:space-between; align-items:center; margin-top:60px;
          padding-top:30px; border-top:1px solid rgba(15,36,29,0.1); flex-wrap:wrap; gap:16px;
        }

        @media (max-width:980px){
          .scene-wrap{ grid-template-columns:1fr; }
          .species-grid{ grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width:768px){
          .page-banner{ padding:110px 0 44px; }
          .section{ padding:50px 0; }
          .quiz-box{ padding:24px 20px; }
          .quiz-locked{ padding:20px 22px; flex-direction:column; align-items:flex-start; text-align:left; }
          .info-panel{ padding:22px; }
          .scene-progress{ top:10px; right:10px; min-width:auto; padding:7px 12px; font-size:0.68rem; }
          .scene-progress span:first-child{ white-space:nowrap; }
          .hotspot{ width:30px; height:30px; font-size:0.62rem; }
        }
        @media (max-width:600px){
          .container{ padding:0 20px; }
          .species-grid{ grid-template-columns:1fr; }
          .materi-nav{ flex-direction:column; align-items:stretch; }
          .page-banner h1{ font-size:1.6rem; }
          .section-head h2{ font-size:1.4rem; }
          .quiz-box h3{ font-size:1.05rem; }
          .quiz-option{ padding:13px 14px; font-size:0.86rem; }
          .hotspot{ width:26px; height:26px; font-size:0.58rem; }
          .breadcrumb{ font-size:0.76rem; flex-wrap:wrap; }
        }
      `}</style>

      <Navbar />

      {/* ================= BANNER ================= */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb reveal">
            <Link to="/">Beranda</Link><span>/</span>
            <Link to="/materi">Materi</Link><span>/</span>
            <span className="current">Ekosistem Mangrove</span>
          </div>
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Materi 1 dari 5</span>
          <h1 className="reveal">Ekosistem Mangrove</h1>
          <p className="reveal">
            Amati ilustrasi ekosistem mangrove, identifikasi komponen biotik dan
            abiotiknya, lalu jelajahi lima jenis mangrove yang ditemukan di Indonesia.
          </p>
        </div>
      </section>

      {/* ================= AKTIVITAS 1: IDENTIFIKASI OBJEK ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Aktivitas 1</span>
            <h2>Komponen Ekosistem Mangrove (Interaktif)</h2>
            <p>Klik setiap objek pada ilustrasi untuk mengetahui apakah objek tersebut termasuk komponen biotik atau abiotik.</p>
          </div>

          <div className="scene-wrap reveal">
            <div className="scene">
              <span className="scene-progress">
                <span>{visited.size}/{hotspots.length} objek ditemukan</span>
                <span className="scene-progress-bar"><span style={{ width: `${(visited.size / hotspots.length) * 100}%` }} /></span>
              </span>
              <img
                src={sceneImg}
                alt="Ilustrasi ekosistem mangrove: pohon, akar, hewan, dan lingkungan sekitarnya"
                className="scene-img"
              />

              {hotspots.map((h) => (
                <button
                  key={h.id}
                  className={`hotspot${visited.has(h.id) ? " visited" : ""}${activeHotspot?.id === h.id ? " active" : ""}`}
                  style={{ top: h.top, left: h.left }}
                  onClick={() => handleHotspotClick(h)}
                  aria-label={h.label}
                >
                  {visited.has(h.id) ? <CheckIcon /> : "?"}
                </button>
              ))}
            </div>

            <div className="info-panel">
              {!activeHotspot && (
                <p className="info-panel-empty">Klik salah satu titik pada ilustrasi untuk melihat penjelasannya di sini.</p>
              )}
              {activeHotspot && (
                <>
                  <span className={`info-badge ${activeHotspot.type}`}>
                    {activeHotspot.type === "biotik" ? "Komponen Biotik" : "Komponen Abiotik"}
                  </span>
                  <h3>{activeHotspot.emoji} {activeHotspot.label}</h3>
                  <ul className="info-facts">
                    {activeHotspot.facts.map((f, i) => (
                      <li key={i}><CheckIcon />{f}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Pertanyaan pemantik 1 */}
          {!allVisited && (
            <div className="quiz-locked reveal">
              <span style={{ fontSize: "1.3rem" }}>🔒</span>
              <span>Temukan semua objek pada ilustrasi di atas untuk membuka pertanyaan pemantik.</span>
            </div>
          )}
          {allVisited && (
            <div className="quiz-box reveal">
              <span className="eyebrow">Pertanyaan Pemantik</span>
              <h3>{quiz1.question}</h3>
              {quiz1.options.map((opt, i) => {
                const state = !q1Submitted ? (q1Selected === i ? "selected" : "") : i === quiz1.correct ? "correct" : q1Selected === i ? "wrong" : "";
                return (
                  <button
                    key={i}
                    className={`quiz-option ${state}`}
                    onClick={() => !q1Submitted && setQ1Selected(i)}
                    disabled={q1Submitted}
                  >
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

      {/* ================= AKTIVITAS 2: GALERI 5 JENIS MANGROVE ================= */}
      <section className="section" style={{ background: "var(--sand-deep)" }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Aktivitas 2</span>
            <h2>Galeri Jenis Mangrove</h2>
            <p>Klik "Lanjut" pada tiap kartu untuk menjelajahi ciri, habitat, dan peran ekologisnya secara bertahap.</p>
          </div>

          <div className="species-grid">
            {mangroveSpecies.map((s, i) => {
              const step = speciesStep[s.id] ?? 0;
              const isDone = speciesDone.has(s.id);
              const stepKey = speciesSteps[step];
              return (
                <div
                  className={`species-card reveal${isDone ? " done" : ""}`}
                  key={s.id}
                  style={{ transitionDelay: `${i * 80}ms`, "--accent": s.accent, "--accent-bg": s.accentBg }}
                >
                  <div className="species-top">
                    <div className="species-icon"><LeafIcon /></div>
                    <div>
                      <h4>{s.nama}</h4>
                      <div className="species-nama-umum">{s.namaUmum}</div>
                    </div>
                  </div>
                  <div className="species-dots">
                    {speciesSteps.map((_, di) => (
                      <span key={di} className={di <= step ? "active" : ""} />
                    ))}
                  </div>
                  <div className="species-step-label" key={`label-${s.id}-${step}`}>{speciesStepLabel[stepKey]}</div>
                  <p key={`text-${s.id}-${step}`}>{s[stepKey]}</p>
                  {step < speciesSteps.length - 1 ? (
                    <button className="btn btn-outline" onClick={() => nextSpeciesStep(s.id)}>
                      Lanjut <ArrowIcon />
                    </button>
                  ) : (
                    <span className="species-done-tag"><CheckIcon /> Selesai dijelajahi</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pertanyaan pemantik 2 */}
          {!allSpeciesDone && (
            <div className="quiz-locked reveal">
              <span style={{ fontSize: "1.3rem" }}>🔒</span>
              <span>Jelajahi seluruh tahap pada kelima kartu mangrove untuk membuka pertanyaan pemantik.</span>
            </div>
          )}
          {allSpeciesDone && (
            <div className="quiz-box reveal">
              <span className="eyebrow">Pertanyaan Pemantik</span>
              <span className="quiz-type-tag">Pilihan ganda kompleks — jawaban bisa lebih dari satu</span>
              <h3>{quiz2.question}</h3>
              {quiz2.options.map((opt, i) => {
                const isCorrectOpt = quiz2.correct.includes(i);
                const isSelected = q2Selected.has(i);
                let state = "";
                if (!q2Submitted) state = isSelected ? "selected" : "";
                else if (isCorrectOpt) state = "correct";
                else if (isSelected) state = "wrong";
                return (
                  <button
                    key={i}
                    className={`quiz-option ${state}`}
                    onClick={() => !q2Submitted && toggleQ2(i)}
                    disabled={q2Submitted}
                  >
                    <span className="quiz-option-dot square">
                      {q2Submitted && isCorrectOpt && <CheckIcon />}
                      {q2Submitted && isSelected && !isCorrectOpt && <XIcon />}
                      {!q2Submitted && isSelected && <CheckIcon />}
                    </span>
                    {opt}
                  </button>
                );
              })}
              {!q2Submitted ? (
                <button className="btn btn-primary" disabled={q2Selected.size === 0} onClick={() => setQ2Submitted(true)} style={{ marginTop: 8 }}>
                  Periksa Jawaban <ArrowIcon />
                </button>
              ) : (
                <div className={`quiz-feedback ${q2IsCorrect ? "correct" : "wrong"}`}>
                  {q2IsCorrect ? <CheckIcon /> : <XIcon />}
                  <span>{q2IsCorrect ? quiz2.feedbackCorrect : quiz2.feedbackWrong}</span>
                </div>
              )}
            </div>
          )}

          {/* Navigasi materi */}
          <div className="materi-nav reveal">
            <Link to="/materi" className="btn btn-outline"><ArrowLeftIcon /> Daftar Materi</Link>
            <Link to="/materi/interaksi-ekosistem" className="btn btn-primary">
              Materi 2: Interaksi dalam Ekosistem <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}