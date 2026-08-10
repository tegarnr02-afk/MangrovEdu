import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import sceneImg from "./ekosistem-mangrove-scene.png";
import imgCeriops from "./ceriops-tagal.png";
import imgSonneratia from "./sonneratia-alba.png";
import imgRhizophora from "./rhizophora-apiculata.png";
import imgBruguieraG from "./bruguiera-gymnorhiza.png";
import imgBruguieraC from "./bruguiera-cylindrica.png";

/* ── SVG icons ─────────────────────────────────────────── */
const Ico = {
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  Arrow: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  ArrowL: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  ),
  Leaf: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20c9 0 16-7 16-16-9 0-16 7-16 16Z" />
      <path d="M5 19c3.5-3.5 6-7 7.5-11" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="3" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  ZoomIn: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  ),
};


const HOTSPOTS = [
  {
    id: "mangrove", emoji: "🌱", label: "Mangrove", top: "39%", left: "53%", correct: 0,
    question: "Menurutmu, mangrove termasuk komponen apa dalam ekosistem?",
    ok: "Benar! Mangrove merupakan komponen biotik karena merupakan makhluk hidup.",
    no: "Belum tepat. Mangrove merupakan tumbuhan sehingga termasuk komponen biotik."
  },
  {
    id: "ikan", emoji: "🐟", label: "Ikan", top: "80%", left: "84%", correct: 0,
    question: "Menurutmu, ikan termasuk komponen apa dalam ekosistem mangrove?",
    ok: "Benar! Ikan merupakan makhluk hidup sehingga termasuk komponen biotik dalam ekosistem mangrove.",
    no: "Belum tepat. Ikan merupakan makhluk hidup sehingga termasuk komponen biotik."
  },
  {
    id: "kepiting", emoji: "🦀", label: "Kepiting", top: "68%", left: "22%", correct: 0,
    question: "Menurutmu, kepiting termasuk komponen apa dalam ekosistem mangrove?",
    ok: "Benar! Kepiting merupakan makhluk hidup sehingga termasuk komponen biotik.",
    no: "Belum tepat. Kepiting merupakan hewan yang hidup di ekosistem mangrove sehingga termasuk komponen biotik."
  },
  {
    id: "burung", emoji: "🐦", label: "Burung", top: "21%", left: "79%", correct: 0,
    question: "Menurutmu, burung termasuk komponen apa dalam ekosistem mangrove?",
    ok: "Benar! Burung merupakan makhluk hidup sehingga termasuk komponen biotik dalam ekosistem.",
    no: "Belum tepat. Burung merupakan makhluk hidup sehingga termasuk komponen biotik."
  },
  {
    id: "air", emoji: "🌊", label: "Air", top: "50%", left: "82%", correct: 1,
    question: "Menurutmu, air termasuk komponen apa dalam ekosistem mangrove?",
    ok: "Benar! Air merupakan komponen abiotik, yaitu bagian tidak hidup dari ekosistem yang dapat memengaruhi kehidupan organisme.",
    no: "Belum tepat. Air bukan makhluk hidup sehingga termasuk komponen abiotik."
  },
  {
    id: "tanah", emoji: "🟤", label: "Tanah / Sedimen", top: "83%", left: "20%", correct: 1,
    question: "Menurutmu, tanah atau sedimen termasuk komponen apa dalam ekosistem mangrove?",
    ok: "Benar! Tanah atau sedimen merupakan komponen abiotik dalam ekosistem mangrove.",
    no: "Belum tepat. Tanah atau sedimen bukan makhluk hidup sehingga termasuk komponen abiotik."
  },
  {
    id: "cahaya", emoji: "☀️", label: "Cahaya Matahari", top: "10%", left: "12%", correct: 1,
    question: "Menurutmu, cahaya matahari termasuk komponen apa dalam ekosistem mangrove?",
    ok: "Benar! Cahaya matahari merupakan komponen abiotik yang menjadi salah satu faktor lingkungan bagi kehidupan organisme.",
    no: "Belum tepat. Cahaya matahari bukan makhluk hidup sehingga termasuk komponen abiotik."
  },
];

const QUIZ_REFL = {
  question: "Apakah komponen biotik dapat hidup tanpa dipengaruhi oleh komponen abiotik di sekitarnya?",
  opts: ["Ya", "Tidak"],
  correct: 1,
  ok: "Benar! Makhluk hidup dalam ekosistem dipengaruhi oleh kondisi lingkungan di sekitarnya. Misalnya, mangrove membutuhkan kondisi air, tanah, cahaya, dan faktor lingkungan lainnya untuk dapat tumbuh.",
  no: "Belum tepat. Coba perhatikan kembali hubungan antara makhluk hidup dengan lingkungan tempat hidupnya. Kondisi lingkungan dapat memengaruhi kehidupan organisme.",
};

const SPECIES = [
  {
    id: "ceriops", nama: "Ceriops tagal", img: imgCeriops, accent: "#2F6B57", accentBg: "#E4EFE7",
    question: "Ceriops tagal dapat tumbuh pada tanah berlumpur yang tergenang air. Menurutmu, mengapa kondisi tersebut penting bagi mangrove ini?",
    opts: ["Karena kondisi tanah dan air merupakan bagian dari lingkungan tempat mangrove tumbuh.", "Karena mangrove hanya dapat hidup tanpa air."],
    correct: 0,
    ok: "Benar! Kondisi tanah dan air merupakan bagian dari lingkungan tempat mangrove tumbuh. Ceriops tagal ditemukan pada habitat tanah berlumpur yang tergenang air.",
    no: "Belum tepat. Coba perhatikan habitat Ceriops tagal. Mangrove ini tumbuh pada tanah berlumpur yang tergenang air.",
    ciri: "Kulit kayu berwarna coklat hingga abu-abu dengan lentisel tersebar acak. Daun berbentuk elips, permukaan atas hijau tua dan bawah hijau kekuningan. Buah berbentuk tabung berwarna coklat, hipokotil hijau dengan alur bergaris dari pangkal hingga ujung.",
    habitat: "Tumbuh pada tanah berlumpur yang tergenang oleh air.",
    peran: "Berperan dalam penyediaan hara, sebagai bahan penyamak alami, serta penstabil ekosistem pesisir.",
  },
  {
    id: "sonneratia", nama: "Sonneratia alba", img: imgSonneratia, accent: "#1E8A8C", accentBg: "#E1F1F1",
    question: "Sonneratia alba memiliki akar napas yang tumbuh di sekitar pohon. Menurutmu, apa hubungan ciri tersebut dengan tempat hidupnya?",
    opts: ["Akar tersebut merupakan salah satu ciri yang berkaitan dengan kehidupannya di lingkungan pesisir.", "Akar tersebut membuat Sonneratia alba tidak membutuhkan lingkungan untuk hidup."],
    correct: 0,
    ok: "Benar! Sonneratia alba memiliki akar napas dan dapat tumbuh pada substrat tanah bercampur lumpur, pasir, bahkan pada kondisi berbatu atau berkarang.",
    no: "Belum tepat. Perhatikan kembali akar yang terlihat pada gambar dan habitat Sonneratia alba.",
    ciri: "Kulit kayu berwarna coklat hingga putih tua. Memiliki akar napas berbentuk kerucut tumpul setinggi hingga 25 cm. Daun berbentuk bulat telur terbalik, ujung membundar. Bunga berbenang sari putih. Buah berbentuk bola dengan ujung bertangkai.",
    habitat: "Tumbuh pada substrat tanah bercampur lumpur dan pasir, terkadang pada bebatuan dan karang.",
    peran: "Menjaga keseimbangan ekosistem pesisir, memberi perlindungan bagi fauna sekitarnya, dan menjadi penopang ekologi di zona intertidal.",
  },
  {
    id: "rhizophora", nama: "Rhizophora apiculata", img: imgRhizophora, accent: "#C97C1E", accentBg: "#FBEEDA",
    question: "Jika Rhizophora apiculata tumbuh di tanah berlumpur dan memiliki sistem akar yang kuat, menurutmu apa yang dapat terjadi pada lingkungan pantai?",
    opts: ["Mangrove dapat membantu menjaga kestabilan pantai.", "Mangrove menyebabkan pantai kehilangan semua organismenya."],
    correct: 0,
    ok: "Benar! Rhizophora apiculata tumbuh pada substrat berlumpur dan berperan menjaga kestabilan pantai serta menyediakan habitat bagi berbagai organisme.",
    no: "Belum tepat. Coba hubungkan ciri akar, habitat berlumpur, dan peran Rhizophora apiculata terhadap lingkungan pantai.",
    ciri: "Memiliki akar tunggang dan akar udara yang keluar dari cabang. Kulit kayu abu-abu hingga kecoklatan. Daun tunggal berbentuk elips, ujung meruncing. Bunga kuning dengan 4 kelopak. Buah bulat memanjang berwarna coklat, hipokotil silindris berbintil hijau.",
    habitat: "Tumbuh pada substrat tanah berlumpur.",
    peran: "Menjaga kestabilan pantai, menyediakan habitat bagi berbagai organisme, serta memengaruhi siklus nutrisi dan perlindungan terhadap erosi pantai.",
  },
  {
    id: "bruguiera-g", nama: "Bruguiera gymnorhiza", img: imgBruguieraG, accent: "#6C63B5", accentBg: "#EAE8F6",
    question: "Bruguiera gymnorhiza memiliki akar lutut dan dapat tumbuh pada tanah bercampur lumpur dan pasir. Apa manfaat keberadaan mangrove ini bagi lingkungan?",
    opts: ["Membantu menjaga kestabilan pantai dan menyediakan habitat bagi fauna.", "Mengurangi jumlah organisme yang dapat hidup di wilayah estuari."],
    correct: 0,
    ok: "Benar! Bruguiera gymnorhiza berperan menjaga kestabilan pantai, menyediakan habitat bagi fauna, dan memperkaya keanekaragaman hayati di wilayah estuari.",
    no: "Belum tepat. Coba perhatikan kembali peran Bruguiera gymnorhiza bagi lingkungan pesisir.",
    ciri: "Memiliki akar lutut berwarna coklat, batang berlentisel. Daun hijau licin dan mengkilap, tebal seperti kulit, berbentuk elips hingga lanset. Bunga berwarna oranye hingga merah. Buah melingkar spiral, bundar melintang sepanjang 2–2,5 cm.",
    habitat: "Tumbuh pada substrat tanah bercampur lumpur dan pasir, terkadang pada bebatuan dan karang.",
    peran: "Menjaga kestabilan pantai, menyediakan habitat bagi berbagai spesies fauna, serta memperkaya keanekaragaman hayati di wilayah estuari.",
  },
  {
    id: "bruguiera-c", nama: "Bruguiera cylindrica", img: imgBruguieraC, accent: "#C24A5F", accentBg: "#F8E4E7",
    question: "Bruguiera cylindrica tumbuh di pantai berlumpur dan berpasir. Jika mangrove ini berkurang, apa yang mungkin terjadi pada lingkungan pantai?",
    opts: ["Perlindungan garis pantai dari abrasi dapat berkurang.", "Garis pantai menjadi semakin terlindungi dari abrasi."],
    correct: 0,
    ok: "Benar! Bruguiera cylindrica berperan sebagai penstabil substrat lumpur, pelindung garis pantai dari abrasi, dan habitat asuhan biota laut. Jika keberadaannya berkurang, fungsi tersebut ikut berkurang.",
    no: "Belum tepat. Coba perhatikan kembali peran Bruguiera cylindrica sebagai penstabil substrat dan pelindung garis pantai dari abrasi.",
    ciri: "Memiliki akar lutut, batang besar dan tinggi hingga 30 meter dengan kulit berwarna abu-abu. Daun berbentuk elips dengan ujung runcing. Bunga berwarna hijau kekuningan. Buah bulat panjang dan bengkok di bagian tengah.",
    habitat: "Tumbuh di pantai yang berlumpur dan berpasir.",
    peran: "Berperan sebagai penstabil substrat lumpur, pelindung garis pantai dari abrasi, dan habitat asuhan biota laut.",
  },
];

/* ── CSS ─────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@600;700&family=Space+Mono:wght@400;700&display=swap');

:root {
  --canopy:#0F241D; --estuary:#2F6B57; --estuary-l:#3D8267;
  --tide:#89AE9E; --tide-pale:#E1EAE2; --sand:#F1F4EC; --sand-deep:#E7EDDF;
  --silt:#A9784F; --amber:#E8A33D; --amber-d:#CE8324;
  --ink:#12261F; --paper:#FBFAF5; --danger:#C24A5F;
  --r-lg:28px; --r-md:18px; --r-sm:12px;
}
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
.em-page{font-family:'Plus Jakarta Sans',sans-serif;background:var(--sand);color:var(--ink);line-height:1.6;}
.em-page h1,.em-page h2,.em-page h3,.em-page h4{font-family:'Fraunces',serif;font-weight:600;color:var(--canopy);line-height:1.16;letter-spacing:-0.01em;}
.em-page a{text-decoration:none;color:inherit;}
.em-wrap{max-width:1120px;margin:0 auto;padding:0 32px;}

/* eyebrow */
.eyebrow{font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:.14em;font-size:.72rem;color:var(--estuary);font-weight:700;display:inline-flex;align-items:center;gap:8px;}

/* reveal */
.reveal{opacity:0;transform:translateY(22px);transition:opacity .55s ease,transform .55s ease;}
.reveal.show{opacity:1;transform:translateY(0);}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:7px;padding:12px 24px;border-radius:999px;font-weight:700;font-size:.88rem;cursor:pointer;border:none;transition:transform .22s,box-shadow .22s;font-family:'Plus Jakarta Sans',sans-serif;}
.btn svg{width:15px;height:15px;flex-shrink:0;}
.btn-primary{background:var(--amber);color:var(--canopy);box-shadow:0 12px 24px -10px rgba(232,163,61,.65);}
.btn-primary:hover{transform:translateY(-2px);}
.btn-outline{background:transparent;color:var(--estuary);border:1.5px solid rgba(47,107,87,.3);}
.btn-outline:hover{background:var(--tide-pale);}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important;}
.btn-full{width:100%;justify-content:center;}

/* ── banner ─── */
.page-banner{background:linear-gradient(135deg,#0a1c16 0%,#1a3d2d 60%,#0e2920 100%);padding:130px 0 64px;position:relative;overflow:hidden;}
.page-banner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 70% 40%,rgba(47,107,87,.25) 0%,transparent 70%);pointer-events:none;}
.breadcrumb{display:flex;align-items:center;gap:8px;font-size:.83rem;color:rgba(251,250,245,.6);margin-bottom:16px;}
.breadcrumb a:hover{color:var(--amber);}
.breadcrumb .cur{color:rgba(251,250,245,.9);}
.page-banner h1{color:var(--paper);font-size:clamp(1.9rem,3.5vw,2.8rem);max-width:640px;margin-bottom:14px;}
.page-banner p{color:rgba(251,250,245,.78);max-width:600px;}
.banner-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(232,163,61,.18);border:1px solid rgba(232,163,61,.4);color:var(--amber);padding:6px 14px;border-radius:999px;font-family:'Space Mono',monospace;font-size:.72rem;font-weight:700;letter-spacing:.1em;margin-bottom:20px;}

/* ── section ─── */
.section{padding:68px 0;}
.section-head{max-width:640px;margin-bottom:36px;}
.section-head h2{font-size:clamp(1.55rem,2.5vw,2rem);margin-top:10px;}
.section-head p{color:#4C5F58;margin-top:10px;font-size:.95rem;}

/* ── scene / hotspot ─── */
.scene-wrap{display:grid;grid-template-columns:1.4fr 1fr;gap:24px;align-items:stretch;}
.scene{position:relative;border-radius:var(--r-lg);overflow:hidden;background:var(--canopy);aspect-ratio:4/3;box-shadow:0 20px 44px -18px rgba(15,36,29,.38);}
.scene-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.scene-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(15,36,29,.18) 0%,transparent 50%);pointer-events:none;}
.scene-badge{position:absolute;top:14px;right:14px;z-index:4;background:rgba(15,36,29,.82);color:var(--paper);padding:7px 14px;border-radius:14px;font-family:'Space Mono',monospace;font-size:.7rem;font-weight:700;display:flex;flex-direction:column;gap:6px;min-width:160px;backdrop-filter:blur(8px);}
.prog-bar{height:4px;background:rgba(255,255,255,.18);border-radius:99px;overflow:hidden;margin-top:2px;}
.prog-bar span{display:block;height:100%;background:var(--amber);border-radius:99px;transition:width .4s ease;}
.scene-hint{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);background:rgba(15,36,29,.78);color:rgba(251,250,245,.9);padding:7px 16px;border-radius:999px;font-size:.76rem;font-weight:600;white-space:nowrap;pointer-events:none;backdrop-filter:blur(6px);animation:hintPulse 2.8s ease-in-out infinite;}
@keyframes hintPulse{0%,100%{opacity:.8;}50%{opacity:1;}}

.hotspot{position:absolute;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;background:rgba(251,250,245,.92);border:2.5px solid var(--amber);display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:'Space Mono',monospace;font-weight:700;font-size:.72rem;color:var(--canopy);animation:pulse 2.2s ease-in-out infinite;transition:background .25s,border-color .25s;}
.hotspot:hover{transform:translate(-50%,-50%) scale(1.15);}
.hotspot.visited{background:var(--estuary);border-color:var(--estuary);color:var(--paper);animation:pop .4s ease;}
.hotspot.visited svg{width:15px;height:15px;}
.hotspot.active{box-shadow:0 0 0 8px rgba(232,163,61,.25);animation:none;}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(232,163,61,.55);}50%{box-shadow:0 0 0 10px rgba(232,163,61,0);}}
@keyframes pop{0%{transform:translate(-50%,-50%) scale(1);}45%{transform:translate(-50%,-50%) scale(1.45);}100%{transform:translate(-50%,-50%) scale(1);}}

/* ── info panel ─── */
.info-panel{background:var(--paper);border-radius:var(--r-lg);padding:28px;display:flex;flex-direction:column;box-shadow:0 20px 44px -22px rgba(15,36,29,.28);min-height:320px;}
.info-empty{color:#7A8A83;font-size:.93rem;margin:auto;text-align:center;padding:20px 0;}
.info-empty span{display:block;font-size:2rem;margin-bottom:10px;}
.info-badge{display:inline-flex;align-items:center;gap:6px;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:5px 12px;border-radius:999px;margin-bottom:12px;}
.info-badge.biotik{background:#E4EFE7;color:var(--estuary);}
.info-badge.abiotik{background:#FBEEDA;color:var(--amber-d);}
.info-panel h3{font-size:1.28rem;margin-bottom:12px;}
.info-q{font-size:.92rem;color:#33473F;font-weight:600;margin-bottom:14px;line-height:1.5;}

/* ── quiz options ─── */
.opt{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:13px 16px;border-radius:12px;border:1.5px solid rgba(15,36,29,.1);background:var(--sand);margin-bottom:9px;cursor:pointer;font-size:.9rem;transition:border-color .2s,background .2s;font-family:'Plus Jakarta Sans',sans-serif;color:var(--ink);}
.opt:hover:not(:disabled){border-color:var(--estuary);}
.opt.sel{border-color:var(--estuary);background:var(--tide-pale);font-weight:600;}
.opt.ok{border-color:var(--estuary);background:#E4EFE7;}
.opt.no{border-color:var(--danger);background:#F8E4E7;}
.opt:disabled{cursor:default;}
.opt-dot{width:22px;height:22px;border-radius:50%;border:1.5px solid rgba(15,36,29,.18);flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.opt-dot svg{width:14px;height:14px;}
.feedback{margin-top:14px;padding:14px 16px;border-radius:12px;font-size:.88rem;display:flex;gap:9px;align-items:flex-start;line-height:1.5;}
.feedback svg{width:17px;height:17px;flex-shrink:0;margin-top:2px;}
.feedback.ok{background:#E4EFE7;color:var(--canopy);}
.feedback.no{background:#F8E4E7;color:#7A2E3C;}

/* ── locked / quiz box ─── */
.quiz-locked{background:var(--sand-deep);border-radius:var(--r-lg);padding:26px 30px;margin-top:32px;color:#5F726A;font-size:.92rem;display:flex;align-items:center;gap:14px;}
.quiz-locked svg{width:22px;height:22px;flex-shrink:0;color:var(--tide);}
.quiz-box{background:var(--paper);border-radius:var(--r-lg);padding:32px;box-shadow:0 20px 44px -22px rgba(15,36,29,.26);margin-top:32px;}
.quiz-box .eyebrow{margin-bottom:10px;}
.quiz-box h3{font-size:1.15rem;margin-bottom:20px;line-height:1.4;}

/* ── species grid ─── */
.species-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start;}
.sp-card{background:var(--paper);border-radius:20px;overflow:hidden;border:1.5px solid rgba(15,36,29,.06);box-shadow:0 4px 18px -10px rgba(15,36,29,.12);transition:box-shadow .3s,transform .3s;cursor:pointer;}
.sp-card:hover{box-shadow:0 12px 30px -14px rgba(15,36,29,.22);transform:translateY(-3px);}
.sp-card.done{border-color:rgba(47,107,87,.25);}
.sp-img-wrap{height:180px;overflow:hidden;position:relative;background:#EEF3EE;}
.sp-img-wrap img{width:100%;height:100%;object-fit:contain;padding:12px;transition:transform .4s ease;}
.sp-card:hover .sp-img-wrap img{transform:scale(1.05);}
.sp-done-ribbon{position:absolute;top:10px;right:10px;background:var(--estuary);color:var(--paper);padding:4px 10px;border-radius:999px;font-size:.68rem;font-weight:700;font-family:'Space Mono',monospace;display:flex;align-items:center;gap:5px;}
.sp-done-ribbon svg{width:11px;height:11px;}
.sp-zoom-btn{position:absolute;bottom:10px;right:10px;background:rgba(15,36,29,.78);color:var(--paper);border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transform:translateY(4px);transition:opacity .2s,transform .2s;z-index:3;}
.sp-zoom-btn svg{width:15px;height:15px;}
.sp-card:hover .sp-zoom-btn{opacity:1;transform:translateY(0);}
.sp-zoom-btn:hover{background:var(--estuary);}
.sp-body{padding:18px;}
.sp-body h4{font-size:.98rem;font-style:italic;margin-bottom:6px;}
.sp-hint{font-size:.8rem;color:#7A8A83;display:flex;align-items:center;gap:5px;}

/* ── species modal ─── */
.modal-overlay{position:fixed;inset:0;background:rgba(10,20,16,.6);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeOv .25s ease;backdrop-filter:blur(4px);}
@keyframes fadeOv{from{opacity:0;}to{opacity:1;}}
.modal{background:var(--paper);border-radius:var(--r-lg);max-width:620px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 30px 60px -20px rgba(10,20,16,.5);animation:slideUp .3s ease;}
@keyframes slideUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
.modal-img{height:220px;background:#EEF3EE;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;cursor:zoom-in;}
.modal-img img{width:100%;height:100%;object-fit:contain;padding:16px;}
.modal-img-zoom-hint{position:absolute;bottom:12px;right:14px;background:rgba(15,36,29,.75);color:var(--paper);font-size:.72rem;font-weight:700;padding:5px 12px;border-radius:999px;display:flex;align-items:center;gap:5px;pointer-events:none;}
.modal-img-zoom-hint svg{width:12px;height:12px;}
.modal-body{padding:28px;}
.modal-body h3{font-size:1.4rem;font-style:italic;margin-bottom:20px;}
.info-tab-bar{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap;}
.info-tab{padding:7px 14px;border-radius:999px;font-size:.78rem;font-weight:700;border:1.5px solid transparent;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s;}
.info-tab.active{color:var(--paper);}
.info-content{background:var(--sand);border-radius:14px;padding:16px 18px;font-size:.9rem;color:#33473F;line-height:1.6;animation:fadeSlide .3s ease;}
@keyframes fadeSlide{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);}}
.modal-close{position:absolute;top:14px;right:14px;background:rgba(15,36,29,.08);border:none;border-radius:50%;width:36px;height:36px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--ink);z-index:2;}
.modal-close:hover{background:rgba(15,36,29,.15);}
.modal-close svg{width:16px;height:16px;}
.modal-footer{padding:0 28px 24px;display:flex;gap:10px;flex-wrap:wrap;}

/* ── image lightbox (zoom) ─── */
.lightbox-overlay{position:fixed;inset:0;background:rgba(6,14,11,.94);z-index:2000;display:flex;align-items:center;justify-content:center;overflow:hidden;animation:fadeOv .2s ease;touch-action:none;}
.lightbox-img{max-width:88vw;max-height:80vh;object-fit:contain;transition:transform .12s ease-out;user-select:none;-webkit-user-drag:none;border-radius:6px;}
.lightbox-close{position:fixed;top:20px;right:20px;background:rgba(251,250,245,.12);border:1px solid rgba(251,250,245,.25);border-radius:50%;width:42px;height:42px;display:flex;align-items:center;justify-content:center;color:var(--paper);cursor:pointer;z-index:2001;}
.lightbox-close svg{width:18px;height:18px;}
.lightbox-close:hover{background:rgba(251,250,245,.22);}
.lightbox-caption{position:fixed;top:24px;left:24px;color:rgba(251,250,245,.85);font-family:'Fraunces',serif;font-style:italic;font-size:1.05rem;z-index:2001;}
.lightbox-hint{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:rgba(251,250,245,.12);color:rgba(251,250,245,.85);padding:8px 18px;border-radius:999px;font-size:.78rem;z-index:2001;pointer-events:none;white-space:nowrap;}
.lightbox-zoom-controls{position:fixed;bottom:24px;right:24px;display:flex;gap:8px;z-index:2001;}
.lightbox-zoom-btn{background:rgba(251,250,245,.12);border:1px solid rgba(251,250,245,.25);border-radius:50%;width:38px;height:38px;color:var(--paper);font-size:1.1rem;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.lightbox-zoom-btn:hover{background:rgba(251,250,245,.22);}

/* ── summary ─── */
.summary-card{background:var(--canopy);border-radius:var(--r-lg);padding:40px;box-shadow:0 20px 44px -18px rgba(15,36,29,.4);color:var(--paper);}
.summary-card h3{color:var(--paper);font-size:1.5rem;margin-bottom:24px;}
.summary-cols{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px;}
.summary-group{background:rgba(255,255,255,.06);border-radius:16px;padding:20px;}
.summary-group h4{color:var(--amber);font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;font-family:'Space Mono',monospace;margin-bottom:14px;}
.summary-item{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:.9rem;color:rgba(251,250,245,.88);}
.summary-item:last-child{border-bottom:none;}
.summary-item span:first-child{font-size:1.2rem;}
.summary-note{font-size:.9rem;color:rgba(251,250,245,.72);line-height:1.6;margin-bottom:28px;padding:16px 20px;background:rgba(255,255,255,.05);border-radius:12px;border-left:3px solid var(--amber);}

.materi-nav{display:flex;justify-content:space-between;align-items:center;padding-top:30px;border-top:1px solid rgba(15,36,29,.09);flex-wrap:wrap;gap:14px;margin-top:56px;}

/* ── responsive ─── */
@media(max-width:980px){.scene-wrap{grid-template-columns:1fr;}.species-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:768px){.page-banner{padding:110px 0 44px;}.section{padding:50px 0;}.tujuan-card{padding:22px 20px;}.info-panel{min-height:auto;}.quiz-box{padding:22px 18px;}.summary-cols{grid-template-columns:1fr;}}
@media(max-width:600px){.em-wrap{padding:0 18px;}.species-grid{grid-template-columns:1fr;}.materi-nav{flex-direction:column;align-items:stretch;}.summary-card{padding:28px 20px;}.sp-zoom-btn{opacity:1;transform:translateY(0);}.lightbox-caption{top:16px;left:16px;font-size:.9rem;}.lightbox-hint{display:none;}}
`;

/* ── QuizOptions helper ─────────────────────────────────── */
function QuizOptions({ opts, correct, state, onSelect, onSubmit, onRetry }) {
  const { selected, submitted, isCorrect } = state;
  return (
    <div>
      {opts.map((o, i) => {
        let cls = "";
        if (!submitted) cls = selected === i ? "sel" : "";
        else if (i === correct) cls = "ok";
        else if (selected === i) cls = "no";
        return (
          <button key={i} className={`opt ${cls}`} onClick={() => !submitted && onSelect(i)} disabled={submitted}>
            <span className="opt-dot">
              {submitted && i === correct && <Ico.Check />}
              {submitted && selected === i && i !== correct && <Ico.X />}
            </span>
            {o}
          </button>
        );
      })}
      {!submitted ? (
        <button className="btn btn-primary" style={{ marginTop: 10 }} disabled={selected === null || selected === undefined} onClick={onSubmit}>
          Periksa Jawaban <Ico.Arrow />
        </button>
      ) : (
        <>
          <div className={`feedback ${isCorrect ? "ok" : "no"}`}>
            {isCorrect ? <Ico.Check /> : <Ico.X />}
            <span>{isCorrect ? state.feedbackOk : state.feedbackNo}</span>
          </div>
          {!isCorrect && (
            <button className="btn btn-outline" style={{ marginTop: 10 }} onClick={onRetry}>
              Coba Lagi <Ico.Arrow />
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ── ImageLightbox (zoom viewer) ─────────────────────────── */
function ImageLightbox({ img, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const clampScale = (s) => Math.min(4, Math.max(1, s));

  const zoomStep = (delta) => {
    setScale((s) => {
      const next = clampScale(s + delta);
      if (next === 1) setPos({ x: 0, y: 0 });
      return next;
    });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    zoomStep(-e.deltaY * 0.0018);
  };

  const toggleZoom = (e) => {
    e.stopPropagation();
    if (scale > 1) {
      setScale(1);
      setPos({ x: 0, y: 0 });
    } else {
      setScale(2.2);
    }
  };

  const onMouseDown = (e) => {
    if (scale === 1) return;
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  };
  const stopDrag = () => { dragging.current = false; };

  return (
    <div
      className="lightbox-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onWheel={handleWheel}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Tutup">
        <Ico.X />
      </button>
      {alt && <div className="lightbox-caption">{alt}</div>}
      <img
        src={img}
        alt={alt}
        className="lightbox-img"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          cursor: scale === 1 ? "zoom-in" : dragging.current ? "grabbing" : "grab",
        }}
        onClick={toggleZoom}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        draggable={false}
      />
      <div className="lightbox-zoom-controls" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-zoom-btn" onClick={() => zoomStep(-0.6)} aria-label="Perkecil">−</button>
        <button className="lightbox-zoom-btn" onClick={() => zoomStep(0.6)} aria-label="Perbesar">+</button>
      </div>
      <div className="lightbox-hint">
        {scale === 1 ? "Klik gambar atau scroll untuk memperbesar" : "Geser untuk menjelajah • Klik untuk reset"}
      </div>
    </div>
  );
}

/* ── SpeciesModal ────────────────────────────────────────── */
const INFO_TABS = [
  { key: "ciri", label: "Ciri yang Diamati" },
  { key: "habitat", label: "Habitat" },
  { key: "peran", label: "Peran Ekologis" },
];

function SpeciesModal({ sp, quizState, onSelect, onSubmit, onRetry, onMarkDone, onClose, onZoom }) {
  const [infoTab, setInfoTab] = useState("ciri");
  const { selected, submitted, isCorrect } = quizState;
  const isDone = quizState.done;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ position: "relative" }}>
        <button className="modal-close" onClick={onClose} aria-label="Tutup"><Ico.X /></button>
        <div className="modal-img" onClick={onZoom} title="Klik untuk memperbesar gambar">
          <img src={sp.img} alt={sp.nama} />
          <span className="modal-img-zoom-hint"><Ico.ZoomIn /> Perbesar</span>
        </div>
        <div className="modal-body">
          <h3>{sp.nama}</h3>

          {!isCorrect ? (
            <>
              <p className="info-q">{sp.question}</p>
              <QuizOptions
                opts={sp.opts} correct={sp.correct} state={{ ...quizState, feedbackOk: sp.ok, feedbackNo: sp.no }}
                onSelect={onSelect} onSubmit={onSubmit} onRetry={onRetry}
              />
            </>
          ) : (
            <>
              {!isDone && (
                <div className="feedback ok" style={{ marginBottom: 16 }}>
                  <Ico.Check /><span>{sp.ok}</span>
                </div>
              )}
              <div className="info-tab-bar">
                {INFO_TABS.map((t) => (
                  <button
                    key={t.key}
                    className={`info-tab ${infoTab === t.key ? "active" : ""}`}
                    style={infoTab === t.key ? { background: sp.accent, borderColor: sp.accent } : { color: sp.accent, borderColor: sp.accent }}
                    onClick={() => setInfoTab(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="info-content">{sp[infoTab]}</div>
            </>
          )}
        </div>
        {isCorrect && (
          <div className="modal-footer">
            {!isDone ? (
              <button className="btn btn-primary btn-full" onClick={onMarkDone}>
                Selesai Eksplorasi <Ico.Check />
              </button>
            ) : (
              <button className="btn btn-outline btn-full" onClick={onClose}>
                Tutup <Ico.X />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function EkosistemMangrove() {
  const navigate = useNavigate();

  /* hotspot state: { [id]: { selected, submitted, isCorrect } } */
  const [hotspotState, setHotspotState] = useState({});
  const [activeHotspot, setActiveHotspot] = useState(null);
  const visited = Object.keys(hotspotState).filter((k) => hotspotState[k]?.isCorrect);
  const allVisited = visited.length === HOTSPOTS.length;

  /* reflective quiz */
  const [reflState, setReflState] = useState({ selected: null, submitted: false });

  /* species state: { [id]: { selected, submitted, isCorrect, done } } */
  const [speciesState, setSpeciesState] = useState({});
  const [openSpecies, setOpenSpecies] = useState(null);
  const speciesDone = SPECIES.filter((s) => speciesState[s.id]?.done);
  const allSpeciesDone = speciesDone.length === SPECIES.length;

  /* image lightbox (zoom viewer) */
  const [lightbox, setLightbox] = useState(null); // { src, alt } | null

  /* which species cards have already played their reveal-on-scroll animation.
     Tracked in React state (not just a DOM class) so that re-renders triggered
     by answering a quiz / marking a card done don't wipe the "show" class when
     React rewrites className. */
  const [revealedSpecies, setRevealedSpecies] = useState(() => new Set());

  /* reveal on scroll */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.show)");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          const revealId = e.target.dataset.revealId;
          if (revealId) {
            setRevealedSpecies((prev) => (prev.has(revealId) ? prev : new Set(prev).add(revealId)));
          }
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [allVisited, allSpeciesDone]);

  /* lock body scroll when modal or lightbox open */
  useEffect(() => {
    document.body.style.overflow = (openSpecies || lightbox) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openSpecies, lightbox]);

  /* ── hotspot handlers ── */
  const hsState = (id) => hotspotState[id] || { selected: null, submitted: false, isCorrect: false };

  const hsSelect = (id, idx) => {
    setHotspotState((p) => {
      const cur = p[id] || {};
      if (cur.isCorrect) return p;
      return { ...p, [id]: { ...cur, selected: idx, submitted: false } };
    });
  };

  const hsSubmit = (h) => {
    const cur = hsState(h.id);
    if (cur.selected === null || cur.selected === undefined) return;
    const isCorrect = cur.selected === h.correct;
    setHotspotState((p) => ({ ...p, [h.id]: { ...cur, submitted: true, isCorrect } }));
  };

  const hsRetry = (id) => setHotspotState((p) => ({ ...p, [id]: { selected: null, submitted: false, isCorrect: false } }));

  const activeH = HOTSPOTS.find((h) => h.id === activeHotspot);
  const activeHS = activeH ? hsState(activeH.id) : null;

  /* ── species handlers ── */
  const spState = (id) => speciesState[id] || { selected: null, submitted: false, isCorrect: false, done: false };

  const spSelect = (id, idx) => {
    setSpeciesState((p) => {
      const cur = p[id] || {};
      if (cur.isCorrect) return p;
      return { ...p, [id]: { ...cur, selected: idx, submitted: false } };
    });
  };

  const spSubmit = (s) => {
    const cur = spState(s.id);
    if (cur.selected === null || cur.selected === undefined) return;
    const isCorrect = cur.selected === s.correct;
    setSpeciesState((p) => ({ ...p, [s.id]: { ...cur, submitted: true, isCorrect } }));
  };

  const spRetry = (id) => setSpeciesState((p) => ({ ...p, [id]: { selected: null, submitted: false, isCorrect: false, done: false } }));

  const spMarkDone = (id) => setSpeciesState((p) => ({ ...p, [id]: { ...p[id], done: true } }));

  return (
    <>
      <style>{CSS}</style>
      <div className="em-page">
        <Navbar />

        {/* ── BANNER ── */}
        <section className="page-banner">
          <div className="em-wrap">
            <div className="breadcrumb reveal">
              <Link to="/">Beranda</Link><span>/</span>
              <Link to="/materi">Materi</Link><span>/</span>
              <span className="cur">Ekosistem Mangrove</span>
            </div>
            <div className="banner-badge reveal">📚 Materi 1 dari 5</div>
            <h1 className="reveal">Kenali Ekosistem Mangrove</h1>
            <p className="reveal">
              Yuk, kenali kehidupan di ekosistem mangrove! Amati lingkungan di sekitarmu dan temukan berbagai komponen yang ada di dalamnya.
            </p>
          </div>
        </section>



        {/* ── SECTION 1 & 2: IDENTIFIKASI KOMPONEN ── */}
        <section className="section">
          <div className="em-wrap">
            <div className="section-head reveal">
              <span className="eyebrow">🔍 Aktivitas 1</span>
              <h2>Kenali Ekosistem Mangrove</h2>
              <p>Klik objek yang kamu temukan untuk mengetahui lebih lanjut! Jawab pertanyaan: termasuk komponen <strong>biotik</strong> atau <strong>abiotik</strong>?</p>
            </div>

            <div className="scene-wrap reveal">
              {/* Scene illustration */}
              <div className="scene">
                <img src={sceneImg} alt="Ilustrasi ekosistem mangrove" className="scene-img" />
                <div className="scene-overlay" />
                <div className="scene-badge">
                  <span>Eksplorasi {visited.length}/{HOTSPOTS.length}</span>
                  <div className="prog-bar"><span style={{ width: `${(visited.length / HOTSPOTS.length) * 100}%` }} /></div>
                </div>
                {visited.length < HOTSPOTS.length && (
                  <div className="scene-hint">👆 Klik objek yang kamu temukan!</div>
                )}
                {HOTSPOTS.map((h) => {
                  const s = hsState(h.id);
                  return (
                    <button
                      key={h.id}
                      className={`hotspot${s.isCorrect ? " visited" : ""}${activeHotspot === h.id ? " active" : ""}`}
                      style={{ top: h.top, left: h.left }}
                      onClick={() => setActiveHotspot(h.id)}
                      aria-label={h.label}
                      title={h.label}
                    >
                      {s.isCorrect ? <Ico.Check /> : h.emoji}
                    </button>
                  );
                })}
              </div>

              {/* Info panel */}
              <div className="info-panel">
                {!activeH ? (
                  <div className="info-empty">
                    <span>🌿</span>
                    Klik salah satu titik pada ilustrasi untuk menjawab pertanyaannya di sini.
                  </div>
                ) : (
                  <>
                    {activeHS.isCorrect && (
                      <span className={`info-badge ${activeH.correct === 0 ? "biotik" : "abiotik"}`}>
                        {activeH.correct === 0 ? "✅ Komponen Biotik" : "✅ Komponen Abiotik"}
                      </span>
                    )}
                    <h3>{activeH.emoji} {activeH.label}</h3>
                    <p className="info-q">{activeH.question}</p>
                    <QuizOptions
                      opts={["Biotik", "Abiotik"]}
                      correct={activeH.correct}
                      state={{ ...activeHS, feedbackOk: activeH.ok, feedbackNo: activeH.no }}
                      onSelect={(idx) => hsSelect(activeH.id, idx)}
                      onSubmit={() => hsSubmit(activeH)}
                      onRetry={() => hsRetry(activeH.id)}
                    />
                  </>
                )}
              </div>
            </div>

            {/* ── SECTION 3: REFLEKSI ── */}
            {!allVisited ? (
              <div className="quiz-locked reveal" style={{ marginTop: 28 }}>
                <Ico.Lock />
                <span>Temukan dan jawab dengan benar semua <strong>{HOTSPOTS.length} objek</strong> pada ilustrasi di atas untuk membuka pertanyaan reflektif.</span>
              </div>
            ) : (
              <div className="quiz-box reveal" style={{ marginTop: 28 }}>
                <span className="eyebrow">💡 Pertanyaan Reflektif</span>
                <h3>{QUIZ_REFL.question}</h3>
                <QuizOptions
                  opts={QUIZ_REFL.opts}
                  correct={QUIZ_REFL.correct}
                  state={{
                    selected: reflState.selected,
                    submitted: reflState.submitted,
                    isCorrect: reflState.submitted && reflState.selected === QUIZ_REFL.correct,
                    feedbackOk: QUIZ_REFL.ok,
                    feedbackNo: QUIZ_REFL.no,
                  }}
                  onSelect={(idx) => !reflState.submitted && setReflState({ selected: idx, submitted: false })}
                  onSubmit={() => setReflState((p) => ({ ...p, submitted: true }))}
                  onRetry={() => setReflState({ selected: null, submitted: false })}
                />
              </div>
            )}
          </div>
        </section>

        {/* ── SECTION 4: 5 JENIS MANGROVE ── */}
        <section className="section" style={{ background: "var(--sand-deep)" }}>
          <div className="em-wrap">
            <div className="section-head reveal">
              <span className="eyebrow">🌿 Aktivitas 2</span>
              <h2>Jelajahi 5 Jenis Mangrove</h2>
              <p>Klik kartu untuk membuka eksplorasi. Jawab pertanyaan terlebih dahulu, lalu jelajahi ciri, habitat, dan peran ekologis tiap jenis mangrove. Gunakan ikon kaca pembesar untuk melihat gambar lebih jelas.</p>
            </div>

            <div className="species-grid">
              {SPECIES.map((sp, i) => {
                const state = spState(sp.id);
                const done = state.done;
                return (
                  <div
                    key={sp.id}
                    data-reveal-id={sp.id}
                    className={`sp-card reveal${revealedSpecies.has(sp.id) ? " show" : ""}${done ? " done" : ""}`}
                    style={{ transitionDelay: `${i * 70}ms` }}
                    onClick={() => setOpenSpecies(sp.id)}
                  >
                    <div className="sp-img-wrap">
                      <img src={sp.img} alt={sp.nama} />
                      <button
                        className="sp-zoom-btn"
                        onClick={(e) => { e.stopPropagation(); setLightbox({ src: sp.img, alt: sp.nama }); }}
                        aria-label={`Perbesar gambar ${sp.nama}`}
                        title="Perbesar gambar"
                      >
                        <Ico.ZoomIn />
                      </button>
                      {done && (
                        <div className="sp-done-ribbon">
                          <Ico.Check /> Selesai
                        </div>
                      )}
                    </div>
                    <div className="sp-body">
                      <h4>{sp.nama}</h4>
                      <span className="sp-hint" style={{ color: done ? "var(--estuary)" : "#7A8A83" }}>
                        {done ? "✅ Sudah dieksplorasi" : "👆 Klik untuk eksplorasi"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── SECTION 5: RINGKASAN ── */}
            {allSpeciesDone && (
              <div className="summary-card reveal" style={{ marginTop: 40 }}>
                <h3>🌊 Ringkasan Ekosistem Mangrove</h3>
                <div className="summary-cols">
                  <div className="summary-group">
                    <h4>🌿 Komponen Biotik</h4>
                    {[["🌱", "Mangrove"], ["🐟", "Ikan"], ["🦀", "Kepiting"], ["🐦", "Burung"]].map(([e, l]) => (
                      <div key={l} className="summary-item"><span>{e}</span><span>{l}</span></div>
                    ))}
                  </div>
                  <div className="summary-group">
                    <h4>💧 Komponen Abiotik</h4>
                    {[["🌊", "Air"], ["🟤", "Tanah / Sedimen"], ["☀️", "Cahaya Matahari"]].map(([e, l]) => (
                      <div key={l} className="summary-item"><span>{e}</span><span>{l}</span></div>
                    ))}
                  </div>
                </div>
                <p className="summary-note">
                  Setiap komponen dalam ekosistem mangrove saling berkaitan. Kondisi lingkungan seperti air, tanah, dan cahaya dapat memengaruhi kehidupan mangrove dan organisme di sekitarnya.
                </p>
                <button className="btn btn-primary" style={{ fontSize: "1rem", padding: "14px 32px" }} onClick={() => navigate("/materi")}>
                  🎉 Selesai Materi 1 <Ico.Arrow />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── NAV BOTTOM ── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="em-wrap">
            <div className="materi-nav">
              <Link to="/materi">
                <button className="btn btn-outline"><Ico.ArrowL /> Kembali ke Materi</button>
              </Link>
              <Link to="/materi/interaksi-ekosistem">
                <button className="btn btn-primary">Materi 2: Interaksi Ekosistem <Ico.Arrow /></button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* ── SPECIES MODAL ── */}
      {openSpecies && (() => {
        const sp = SPECIES.find((s) => s.id === openSpecies);
        if (!sp) return null;
        const state = spState(sp.id);
        return (
          <SpeciesModal
            sp={sp}
            quizState={state}
            onSelect={(idx) => spSelect(sp.id, idx)}
            onSubmit={() => spSubmit(sp)}
            onRetry={() => spRetry(sp.id)}
            onMarkDone={() => { spMarkDone(sp.id); setOpenSpecies(null); }}
            onClose={() => setOpenSpecies(null)}
            onZoom={() => setLightbox({ src: sp.img, alt: sp.nama })}
          />
        );
      })()}

      {/* ── IMAGE LIGHTBOX (ZOOM VIEWER) ── */}
      {lightbox && (
        <ImageLightbox
          img={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}