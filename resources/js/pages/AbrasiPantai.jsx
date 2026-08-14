import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import api from "../lib/api";
import imgPantaiA from "./abrasi-pantai-a.png";
import imgPantaiB from "./abrasi-pantai-b.png";
import imgAbrasiTahap1 from "./abrasi-tahap-1.png";
import imgAbrasiTahap2 from "./abrasi-tahap-2.png";
import imgAbrasiTahap3 from "./abrasi-tahap-3.png";
import imgAbrasiTahap4 from "./abrasi-tahap-4.png";

/* ===== ICONS ===== */
const ArrowIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
const ArrowLeftIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
const CheckIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>);
const XIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>);
const RefreshIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v5h5" /><path d="M20 20v-5h-5" /><path d="M5.5 9a7 7 0 0 1 12.3-2.5M18.5 15a7 7 0 0 1-12.3 2.5" /></svg>);
const LockIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>);
const ChevronLeftIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>);
const ChevronRightIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>);
const PlayIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>);
const PauseIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>);
const ZoomInIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" /></svg>);

/* ===== DATA ===== */
const PROCESS_ITEMS = [
  { id: "p1", emoji: "🌊", label: "Gelombang Menghantam", text: "Gelombang laut menghantam pantai" },
  { id: "p2", emoji: "🏖️", label: "Material Terkikis", text: "Material pantai mengalami pengikisan" },
  { id: "p3", emoji: "💨", label: "Material Berpindah", text: "Material yang terkikis terbawa/berpindah" },
  { id: "p4", emoji: "📉", label: "Garis Pantai Berubah", text: "Garis pantai mengalami perubahan" },
];
const processOrder = PROCESS_ITEMS.map(p => p.id);
const initialProcessPoolOrder = ["p3", "p1", "p4", "p2"];
const processExplanations = {
  p1: "Gelombang laut menghantam pantai secara terus-menerus dan memberi tekanan pada material di sepanjang garis pantai.",
  p2: "Akibat hantaman gelombang yang berulang, material pantai seperti pasir dan tanah mulai mengalami pengikisan.",
  p3: "Material yang terkikis kemudian terbawa oleh arus dan gelombang, sehingga berpindah dari posisi asalnya.",
  p4: "Setelah material terus berkurang dan berpindah, garis pantai bergeser ke arah daratan  inilah yang disebut abrasi.",
};

const IMPACT_ITEMS = [
  {
    id: "pantai", emoji: "🏖️", label: "Pantai", color: "#3D8267", bg: "#E1EAE2",
    desc: "Ketika abrasi terus berlangsung, garis pantai dapat berubah dan lahan pesisir dapat mengalami pengikisan.",
    detail: "Area pantai semakin sempit dan garis pantai bergeser ke arah daratan."
  },
  {
    id: "bangunan", emoji: "🏠", label: "Rumah/Bangunan", color: "#C24A5F", bg: "#F8E4E7",
    desc: "Abrasi dapat berdampak pada bangunan atau lahan masyarakat yang berada di sekitar wilayah pesisir.",
    detail: "Bangunan berada semakin dekat dengan garis pantai. Daratan di sekitarnya mengalami pengikisan."
  },
  {
    id: "vegetasi", emoji: "🌳", label: "Vegetasi Pesisir", color: "#2F6B57", bg: "#D6EAE1",
    desc: "Abrasi dapat memengaruhi vegetasi pesisir dan habitat yang berada di sekitar garis pantai.",
    detail: "Vegetasi berada dekat dengan area yang terkikis. Sebagian area habitat mengalami perubahan."
  },
  {
    id: "masyarakat", emoji: "👥", label: "Masyarakat", color: "#E8A33D", bg: "#FDF0D5",
    desc: "Abrasi dapat berdampak pada aktivitas atau kehidupan masyarakat yang tinggal dan beraktivitas di wilayah pesisir.",
    detail: "Masyarakat pesisir dan aktivitas mereka di sekitar pantai dapat terdampak."
  },
];

const SUMMARY_CARDS = [
  { emoji: "", title: "Abrasi", body: "Abrasi berkaitan dengan pengikisan material pantai oleh gelombang laut yang dapat menyebabkan perubahan garis pantai." },
  { emoji: "", title: "Proses Abrasi", body: "Gelombang laut menghantam pantai  material pantai mengalami pengikisan  material terkikis terbawa/berpindah  garis pantai mengalami perubahan." },
  { emoji: "", title: "Dampak pada Wilayah Pesisir", body: "Abrasi yang terus berlangsung dapat berdampak terhadap garis pantai dan lahan pesisir." },
  { emoji: "", title: "Dampak bagi Kehidupan", body: "Bangunan atau lahan masyarakat, vegetasi pesisir, habitat, serta aktivitas masyarakat pesisir dapat terdampak." },
];

const REFLEKSI_Q = {
  question: "Setelah mengamati proses abrasi, menurutmu mengapa perubahan garis pantai perlu diperhatikan?",
  options: [
    "Karena perubahan garis pantai dapat berdampak pada wilayah pesisir dan kehidupan masyarakat di sekitarnya.",
    "Karena perubahan garis pantai hanya memengaruhi warna air laut.",
    "Karena abrasi membuat semua tanaman tumbuh lebih cepat.",
  ],
  correct: 0,
  feedbackCorrect: " Benar! Perubahan garis pantai akibat abrasi dapat berdampak pada pantai, bangunan atau lahan masyarakat, vegetasi pesisir, serta aktivitas atau kehidupan masyarakat pesisir.",
  feedbackWrong: " Coba pikirkan kembali. Jika garis pantai terus bergeser ke arah daratan, bagian wilayah mana saja yang mungkin ikut terdampak?",
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ===== STYLES ===== */
const STYLES = `
  :root{--canopy:#0F241D;--estuary:#2F6B57;--estuary-light:#3D8267;--tide:#89AE9E;--tide-pale:#E1EAE2;--sand:#F1F4EC;--sand-deep:#E7EDDF;--silt:#A9784F;--amber:#E8A33D;--amber-deep:#CE8324;--ink:#12261F;--paper:#FBFAF5;--danger:#C24A5F;--radius-lg:28px;--radius-md:18px;}
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--sand);color:var(--ink);line-height:1.6;}
  h1,h2,h3,h4{font-family:'Fraunces',serif;font-weight:600;color:var(--canopy);line-height:1.16;letter-spacing:-0.01em;}
  a{text-decoration:none;color:inherit;}
  .container{max-width:1100px;margin:0 auto;padding:0 32px;}
  .eyebrow{font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:0.14em;font-size:0.72rem;color:var(--estuary);font-weight:700;display:inline-flex;align-items:center;gap:10px;}
  .reveal{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease;}
  .reveal.show{opacity:1;transform:translateY(0);}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:999px;font-weight:700;font-size:0.9rem;cursor:pointer;border:none;transition:transform .25s ease,box-shadow .25s ease;font-family:'Plus Jakarta Sans',sans-serif;}
  .btn svg{width:16px;height:16px;flex-shrink:0;}
  .btn-primary{background:var(--amber);color:var(--canopy);box-shadow:0 12px 24px -10px rgba(232,163,61,0.7);}
  .btn-primary:hover{transform:translateY(-3px);}
  .btn-outline{background:transparent;color:var(--estuary);border:1.5px solid rgba(47,107,87,0.3);}
  .btn-outline:hover{background:var(--tide-pale);}
  .btn-sm{padding:8px 16px;font-size:0.8rem;}
  .btn:disabled{opacity:0.45;cursor:not-allowed;transform:none!important;}
  .btn-finished:disabled{opacity:1;background:var(--estuary);color:var(--paper);box-shadow:none;}
  .btn-block{width:100%;justify-content:center;}
  .section{padding:70px 0;}
  .section-alt{background:var(--sand-deep);}
  .section-head{max-width:660px;margin-bottom:36px;}
  .section-head h2{font-size:clamp(1.6rem,2.6vw,2.1rem);margin-top:12px;}
  .section-head p{color:#4C5F58;margin-top:12px;}
  .page-banner{background:var(--canopy);padding:130px 0 40px;}
  .breadcrumb{display:flex;align-items:center;gap:8px;font-size:0.85rem;color:rgba(251,250,245,0.65);margin-bottom:18px;flex-wrap:wrap;}
  .breadcrumb a:hover{color:var(--amber);}
  .breadcrumb span.current{color:rgba(251,250,245,0.9);}
  .page-banner h1{color:var(--paper);font-size:clamp(1.9rem,3.6vw,2.7rem);max-width:640px;margin-bottom:14px;}
  .page-banner p{color:rgba(251,250,245,0.78);max-width:600px;}
  .progress-wrap{background:var(--canopy);padding:0 0 26px;}
  .progress-bar-row{display:flex;align-items:center;gap:14px;}
  .progress-label{font-family:'Space Mono',monospace;font-size:0.72rem;font-weight:700;color:var(--amber);white-space:nowrap;}
  .progress-track{flex:1;height:6px;border-radius:999px;background:rgba(251,250,245,0.14);overflow:hidden;}
  .progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--estuary-light),var(--amber));transition:width .5s ease;}
  .quiz-box{background:var(--paper);border-radius:var(--radius-lg);padding:34px;box-shadow:0 20px 40px -24px rgba(15,36,29,0.28);margin-top:30px;}
  .quiz-box h3{font-size:1.15rem;margin-bottom:22px;margin-top:10px;}
  .quiz-option{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:15px 18px;border-radius:14px;border:1.5px solid rgba(15,36,29,0.12);background:var(--sand);margin-bottom:10px;cursor:pointer;font-size:0.92rem;transition:border-color .2s ease,background .2s ease;}
  .quiz-option:hover{border-color:var(--estuary);}
  .quiz-option.selected{border-color:var(--estuary);background:var(--tide-pale);font-weight:600;}
  .quiz-option.correct{border-color:var(--estuary);background:#E4EFE7;}
  .quiz-option.wrong{border-color:var(--danger);background:#F8E4E7;}
  .quiz-option-dot{width:22px;height:22px;border-radius:50%;border:1.5px solid rgba(15,36,29,0.2);flex-shrink:0;display:flex;align-items:center;justify-content:center;}
  .feedback{margin-top:16px;padding:16px 18px;border-radius:14px;font-size:0.9rem;display:flex;gap:10px;align-items:flex-start;}
  .feedback.correct{background:#E4EFE7;color:var(--canopy);}
  .feedback.wrong{background:#F8E4E7;color:#7A2E3C;}
  .feedback svg{width:18px;height:18px;flex-shrink:0;margin-top:2px;}
  .compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
  .compare-card{border-radius:var(--radius-lg);overflow:hidden;box-shadow:0 20px 40px -22px rgba(15,36,29,0.3);}
  .compare-card img{width:100%;height:220px;object-fit:cover;display:block;}
  .compare-img-wrap{position:relative;cursor:pointer;}
  .compare-zoom-btn{position:absolute;bottom:10px;right:10px;background:rgba(15,36,29,0.78);color:var(--paper);border:none;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transform:translateY(4px);transition:opacity .2s ease,transform .2s ease;z-index:3;}
  .compare-zoom-btn svg{width:16px;height:16px;}
  .compare-img-wrap:hover .compare-zoom-btn{opacity:1;transform:translateY(0);}
  .compare-zoom-btn:hover{background:var(--estuary);}
  .compare-footer{background:var(--paper);padding:16px 20px;display:flex;align-items:center;gap:10px;}
  .compare-dot{width:10px;height:10px;border-radius:50%;}
  .compare-card.card-a .compare-dot{background:var(--estuary);}
  .compare-card.card-b .compare-dot{background:var(--danger);}
  /* ── image lightbox (zoom) ─── */
  .lightbox-overlay{position:fixed;inset:0;background:rgba(6,14,11,0.94);z-index:2000;display:flex;align-items:center;justify-content:center;overflow:hidden;animation:fadeOv .2s ease;touch-action:none;}
  @keyframes fadeOv{from{opacity:0;}to{opacity:1;}}
  .lightbox-img{max-width:88vw;max-height:80vh;object-fit:contain;transition:transform .12s ease-out;user-select:none;-webkit-user-drag:none;border-radius:6px;}
  .lightbox-close{position:fixed;top:20px;right:20px;background:rgba(251,250,245,0.12);border:1px solid rgba(251,250,245,0.25);border-radius:50%;width:42px;height:42px;display:flex;align-items:center;justify-content:center;color:var(--paper);cursor:pointer;z-index:2001;}
  .lightbox-close svg{width:18px;height:18px;}
  .lightbox-close:hover{background:rgba(251,250,245,0.22);}
  .lightbox-caption{position:fixed;top:24px;left:24px;color:rgba(251,250,245,0.85);font-family:'Fraunces',serif;font-style:italic;font-size:1.05rem;z-index:2001;}
  .lightbox-zoom-controls{position:fixed;bottom:24px;right:24px;display:flex;gap:8px;z-index:2001;}
  .lightbox-zoom-btn{background:rgba(251,250,245,0.12);border:1px solid rgba(251,250,245,0.25);border-radius:50%;width:38px;height:38px;color:var(--paper);font-size:1.1rem;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;}
  .lightbox-zoom-btn:hover{background:rgba(251,250,245,0.22);}
  .lightbox-hint{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:rgba(251,250,245,0.12);color:rgba(251,250,245,0.85);padding:8px 18px;border-radius:999px;font-size:0.78rem;z-index:2001;pointer-events:none;white-space:nowrap;}
  /* ===== susun proses (chain-style, mengikuti pola rantai makanan Materi 2) ===== */
  .chain-pool{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:30px;min-height:110px;}
  .chain-card{flex:0 0 auto;width:150px;background:var(--paper);border-radius:16px;padding:16px 12px;text-align:center;border:2px solid rgba(15,36,29,0.1);cursor:pointer;box-shadow:0 4px 14px -10px rgba(15,36,29,0.15);transition:border-color .2s ease,transform .2s ease,box-shadow .2s ease;}
  .chain-card:hover{transform:translateY(-3px);}
  .chain-card.selected{border-color:var(--amber);box-shadow:0 0 0 5px rgba(232,163,61,0.2);transform:translateY(-3px);}
  .chain-card .emoji{font-size:1.7rem;display:block;margin-bottom:6px;}
  .chain-card .label{display:block;font-size:0.78rem;font-weight:700;color:var(--canopy);line-height:1.3;}
  .chain-card[draggable]{cursor:grab;}
  .chain-card.dragging{opacity:0.4;}
  .chain-pool-empty{color:#8A9A93;font-size:0.86rem;display:flex;align-items:center;}
  .chain-slots{display:flex;align-items:stretch;gap:6px;flex-wrap:wrap;}
  .chain-slot-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;flex:1 1 140px;min-width:130px;}
  .chain-slot-role{font-family:'Space Mono',monospace;font-size:0.62rem;font-weight:700;text-transform:uppercase;color:var(--silt);letter-spacing:0.05em;text-align:center;}
  .chain-slot{width:100%;min-height:110px;border-radius:16px;border:2px dashed rgba(15,36,29,0.22);background:var(--sand-deep);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:10px;text-align:center;transition:border-color .2s ease,background .2s ease;}
  .chain-slot:hover{border-color:var(--estuary);}
  .chain-slot.filled{border-style:solid;background:var(--paper);border-color:rgba(15,36,29,0.12);}
  .chain-slot.drag-over{border-color:var(--amber);background:var(--tide-pale);}
  .chain-slot .placeholder{color:#94A39B;font-size:1.4rem;}
  .chain-slot .filled-emoji{font-size:1.6rem;display:block;margin-bottom:4px;}
  .chain-slot .filled-label{font-size:0.74rem;font-weight:700;color:var(--canopy);}
  .chain-slot.correct-slot{border-color:var(--estuary);background:#E4EFE7;animation:chainPop .4s ease;}
  .chain-slot.wrong-slot{border-color:var(--danger);background:#F8E4E7;}
  @keyframes chainPop{0%{transform:scale(0.9);}50%{transform:scale(1.05);}100%{transform:scale(1);}}
  .chain-slot-arrow{display:none;}
  @media(min-width:860px){.chain-slot-arrow{display:flex;align-items:center;color:var(--silt);flex:0 0 auto;padding-top:24px;}.chain-slot-arrow svg{width:18px;height:18px;}}
  .chain-actions{display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;align-items:center;}
  .chain-explain{margin-top:30px;display:flex;flex-direction:column;gap:14px;}
  .chain-explain-item{display:flex;gap:14px;background:var(--paper);border-radius:16px;padding:18px 20px;box-shadow:0 4px 16px -10px rgba(15,36,29,0.14);align-items:flex-start;}
  .chain-explain-item .emoji{font-size:1.5rem;flex-shrink:0;}
  .chain-explain-item .role{font-family:'Space Mono',monospace;font-size:0.62rem;font-weight:700;text-transform:uppercase;color:var(--estuary);letter-spacing:0.05em;display:block;margin-bottom:3px;}
  .chain-explain-item p{font-size:0.86rem;color:#4C5F58;line-height:1.55;}
  .impact-scene{position:relative;border-radius:var(--radius-lg);overflow:hidden;background:linear-gradient(135deg,#BFE0DA 0%,#E1EAE2 100%);padding:40px;}
  .impact-grid{display:flex;flex-direction:column;gap:14px;}
  .impact-btn{background:var(--paper);border-radius:18px;padding:0;text-align:left;cursor:pointer;border:2px solid rgba(15,36,29,0.06);transition:border-color .2s ease,box-shadow .2s ease;box-shadow:0 4px 14px -10px rgba(15,36,29,0.12);overflow:hidden;width:100%;display:block;}
  .impact-btn:hover{box-shadow:0 10px 24px -12px rgba(15,36,29,0.2);}
  .impact-btn.visited{border-color:var(--estuary);}
  .impact-btn.active{border-color:var(--amber);box-shadow:0 0 0 3px rgba(232,163,61,0.25);}
  .impact-btn-head{display:flex;align-items:center;gap:16px;padding:18px 20px;background:none;border:none;width:100%;cursor:pointer;text-align:left;font-family:'Plus Jakarta Sans',sans-serif;}
  .impact-icon{width:48px;height:48px;flex-shrink:0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.4rem;}
  .impact-btn-title{flex:1;display:flex;flex-direction:column;gap:2px;}
  .impact-btn-title strong{font-weight:700;font-size:0.95rem;color:var(--canopy);}
  .impact-btn-title span.visited-tag{font-size:0.74rem;color:var(--estuary);font-weight:600;}
  .impact-chevron{flex-shrink:0;width:20px;height:20px;color:var(--estuary);transition:transform .25s ease;}
  .impact-chevron svg{width:100%;height:100%;}
  .impact-btn.active .impact-chevron{transform:rotate(90deg);}
  .impact-detail{max-height:0;overflow:hidden;transition:max-height .35s ease;}
  .impact-btn.active .impact-detail{max-height:260px;}
  .impact-detail-inner{padding:0 20px 20px 84px;display:flex;flex-direction:column;gap:8px;}
  .impact-detail-inner p{font-size:0.92rem;color:#33473F;line-height:1.65;}
  .impact-detail-inner p.impact-sub{color:#556961;font-size:0.85rem;border-top:1px solid rgba(15,36,29,0.08);padding-top:10px;margin-top:2px;}
  .summary-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:30px;}
  .summary-card{background:var(--paper);border-radius:var(--radius-lg);padding:28px 24px;box-shadow:0 12px 30px -18px rgba(15,36,29,0.22);}
  .summary-card .emoji{font-size:2rem;margin-bottom:12px;}
  .summary-card h4{font-size:1rem;margin-bottom:8px;}
  .summary-card p{font-size:0.88rem;color:#4C5F58;line-height:1.65;}
  .materi-nav{display:flex;justify-content:space-between;align-items:center;margin-top:60px;padding-top:30px;border-top:1px solid rgba(15,36,29,0.1);flex-wrap:wrap;gap:16px;}
  .chain-visual{display:flex;flex-direction:column;align-items:center;gap:0;margin:28px auto;max-width:400px;}
  .chain-box{background:var(--paper);border-radius:14px;padding:14px 28px;font-size:0.92rem;font-weight:600;color:var(--canopy);border:2px solid rgba(15,36,29,0.1);text-align:center;width:100%;box-shadow:0 6px 16px -10px rgba(15,36,29,0.15);transition:transform .2s ease,box-shadow .2s ease;}
  .chain-box:hover{transform:translateY(-2px);box-shadow:0 10px 20px -10px rgba(15,36,29,0.25);}
  .chain-box.highlight{background:linear-gradient(135deg,var(--tide-pale),var(--sand));border-color:var(--estuary);box-shadow:0 8px 20px -10px rgba(47,107,87,0.35);}
  .chain-arrow{color:var(--amber);display:flex;justify-content:center;padding:4px 0;}
  .chain-arrow svg{width:20px;height:20px;transform:rotate(90deg);}
  .chain-leaf{display:flex;gap:10px;width:100%;justify-content:center;flex-wrap:wrap;position:relative;padding-top:14px;}
  .chain-leaf::before{content:"";position:absolute;top:0;left:50%;width:1px;height:14px;background:rgba(15,36,29,0.18);transform:translateX(-50%);}
  .chain-leaf-item{border-radius:12px;padding:10px 18px;font-size:0.85rem;font-weight:600;border:1.5px solid rgba(15,36,29,0.1);display:inline-flex;align-items:center;gap:6px;cursor:default;transition:transform .2s ease,box-shadow .2s ease;}
  .chain-leaf-item:hover{transform:translateY(-3px);box-shadow:0 10px 20px -12px rgba(15,36,29,0.25);}
  .chain-leaf-emoji{font-size:1rem;}
  .anim-layout{display:grid;grid-template-columns:1.7fr 1fr;gap:26px;align-items:start;}
  .anim-scene-wrap{width:100%;}
  .anim-scene{position:relative;border-radius:var(--radius-lg);overflow:hidden;aspect-ratio:16/10;width:100%;background:linear-gradient(180deg,#DCEFF7 0%,#EFE3C8 100%);box-shadow:0 20px 40px -22px rgba(15,36,29,0.3);}
  .anim-photo-scene{position:relative;width:100%;height:100%;}
  .anim-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;transform:scale(1.045);transition:opacity 1.1s ease,transform 6s cubic-bezier(.19,1,.22,1);}
  .anim-photo.active{opacity:1;transform:scale(1);}
  .anim-photo-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(15,36,29,0.4) 0%,rgba(15,36,29,0) 26%);pointer-events:none;}
  .anim-stage-badge{position:absolute;top:14px;left:14px;background:rgba(15,36,29,0.68);backdrop-filter:blur(4px);color:#fff;font-size:0.7rem;font-weight:700;letter-spacing:0.02em;padding:5px 12px;border-radius:20px;font-family:'Space Mono',monospace;z-index:2;}
  .anim-nav-btn{position:absolute;top:50%;transform:translateY(-50%);width:38px;height:38px;border-radius:50%;background:rgba(251,250,245,0.92);backdrop-filter:blur(2px);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--canopy);box-shadow:0 8px 18px -8px rgba(15,36,29,0.45);transition:transform .2s ease,background .2s ease,opacity .2s ease;z-index:2;}
  .anim-nav-btn svg{width:18px;height:18px;}
  .anim-nav-btn:hover:not(:disabled){background:#fff;transform:translateY(-50%) scale(1.1);}
  .anim-nav-btn:disabled{opacity:0.3;cursor:not-allowed;}
  .anim-nav-prev{left:12px;}
  .anim-nav-next{right:12px;}
  .anim-progress-track{margin-top:14px;height:5px;border-radius:999px;background:rgba(15,36,29,0.1);overflow:hidden;}
  .anim-progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--estuary-light),var(--amber));transition:width .5s ease;}
  .anim-caption{margin-top:18px;background:var(--paper);border-radius:14px;padding:16px 20px;font-size:0.92rem;color:#33473F;display:flex;gap:14px;align-items:center;box-shadow:0 4px 14px -10px rgba(15,36,29,0.12);animation:animFadeUp .4s ease;}
  .anim-caption .num{width:30px;height:30px;border-radius:50%;background:var(--tide-pale);color:var(--estuary);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.82rem;flex-shrink:0;font-family:'Space Mono',monospace;transition:background .3s ease,color .3s ease;}
  @keyframes animFadeUp{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
  .anim-thumbs{display:flex;flex-direction:column;gap:12px;height:100%;}
  .anim-thumb{border:2px solid rgba(15,36,29,0.1);border-radius:16px;overflow:hidden;background:var(--paper);cursor:pointer;padding:0;display:flex;flex-direction:column;transition:border-color .2s ease,transform .2s ease,box-shadow .2s ease;font-family:'Plus Jakarta Sans',sans-serif;flex:1;}
  .anim-thumb:hover{transform:translateY(-3px);box-shadow:0 10px 20px -12px rgba(15,36,29,0.25);}
  .anim-thumb.active{border-color:var(--amber);box-shadow:0 0 0 3px rgba(232,163,61,0.22);}
  .anim-thumb-img-wrap{position:relative;width:100%;flex:1;min-height:64px;}
  .anim-thumb img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(0.9);transition:filter .2s ease;position:absolute;inset:0;}
  .anim-thumb.active img{filter:saturate(1.1);}
  .anim-thumb-num{position:absolute;top:6px;left:6px;width:20px;height:20px;border-radius:50%;background:rgba(15,36,29,0.68);color:#fff;font-size:0.65rem;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;}
  .anim-thumb.active .anim-thumb-num{background:var(--amber);color:var(--canopy);}
  .anim-thumb-label{font-size:0.72rem;font-weight:700;color:var(--canopy);padding:8px 10px;line-height:1.3;text-align:center;}
  .anim-controls{display:flex;gap:12px;margin-top:20px;flex-wrap:wrap;align-items:center;}
  .anim-controls .btn svg{width:15px;height:15px;}
  @media(max-width:860px){.anim-layout{grid-template-columns:1fr;}.anim-thumbs{flex-direction:row;}.anim-thumb-img-wrap{min-height:56px;}}
  @media(max-width:600px){.anim-thumbs{display:none;}.anim-controls{flex-direction:column;align-items:stretch;}.anim-controls .btn{width:100%;justify-content:center;}}
  @keyframes confettiPop{0%{transform:scale(0) rotate(0);opacity:1;}100%{transform:scale(1.6) rotate(45deg);opacity:0;}}
  .success-pop{animation:confettiPop 0.6s ease-out forwards;}
  .lock-overlay{position:fixed;inset:0;background:rgba(10,20,16,0.6);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}
  .lock-modal{position:relative;background:var(--paper);border-radius:22px;padding:38px 32px 32px;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 44px -18px rgba(15,36,29,0.4);}
  .lock-close{position:absolute;top:16px;right:16px;width:32px;height:32px;border:none;border-radius:50%;background:var(--sand-deep);color:var(--canopy);display:flex;align-items:center;justify-content:center;cursor:pointer;}
  .lock-icon{width:56px;height:56px;margin:0 auto 18px;border-radius:50%;background:#FBEEDA;color:var(--amber-deep);display:flex;align-items:center;justify-content:center;font-size:1.6rem;}
  .lock-modal h3{font-size:1.3rem;margin-bottom:10px;}
  .lock-modal p{color:#556961;font-size:0.92rem;line-height:1.6;margin-bottom:26px;}
  .impact-modal-overlay{position:fixed;inset:0;background:rgba(10,20,16,0.55);z-index:900;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);}
  .impact-modal{background:var(--paper);border-radius:22px;padding:32px 28px;max-width:440px;width:100%;box-shadow:0 20px 44px -18px rgba(15,36,29,0.4);position:relative;}
  .impact-modal-close{position:absolute;top:14px;right:14px;width:32px;height:32px;border:none;border-radius:50%;background:var(--sand-deep);cursor:pointer;display:flex;align-items:center;justify-content:center;}
  .impact-modal h3{font-size:1.2rem;margin:14px 0 10px;}
  .impact-modal p{font-size:0.92rem;color:#33473F;line-height:1.65;}
  .drag-connect-zone{background:var(--paper);border-radius:var(--radius-lg);padding:28px;box-shadow:0 12px 30px -18px rgba(15,36,29,0.22);margin-top:28px;}
  .dc-source{background:linear-gradient(135deg,var(--canopy),var(--estuary));color:#fff;border-radius:14px;padding:16px 22px;text-align:center;font-weight:700;font-size:1rem;margin-bottom:20px;}
  .dc-targets{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
  .dc-target{border-radius:14px;padding:14px 16px;border:2px dashed rgba(15,36,29,0.25);background:var(--sand-deep);text-align:center;font-size:0.88rem;cursor:pointer;transition:border-color .2s ease,background .2s ease;}
  .dc-target.linked{border-style:solid;border-color:var(--estuary);background:var(--tide-pale);font-weight:600;}
  .dc-target:hover{border-color:var(--estuary-light);}
  @media(max-width:980px){.compare-grid{grid-template-columns:1fr;}.summary-cards{grid-template-columns:1fr;}}
  @media(max-width:600px){.impact-detail-inner{padding-left:20px;}}
  @media(max-width:768px){.page-banner{padding:110px 0 44px;}.section{padding:50px 0;}.quiz-box{padding:24px 20px;}.impact-scene{padding:20px;}}
  @media(max-width:600px){.container{padding:0 20px;}.page-banner h1{font-size:1.6rem;}.section-head h2{font-size:1.4rem;}.materi-nav{flex-direction:column;align-items:stretch;}.dc-targets{grid-template-columns:1fr;}.compare-zoom-btn{opacity:1;transform:translateY(0);}.lightbox-caption{top:16px;left:16px;font-size:0.9rem;}.lightbox-hint{display:none;}}
`;

/* ===== ANIMATION SCENE COMPONENT ===== */
const ANIM_CAPTIONS = [
  "Gelombang laut menghantam pantai secara terus-menerus.",
  "Material pantai mulai terkikis oleh energi gelombang.",
  "Material yang terkikis terbawa dan berpindah tempat.",
  "Garis pantai bergeser ke arah daratan  abrasi terjadi.",
];
const ANIM_TITLES = ["Gelombang Menghantam", "Material Terkikis", "Material Berpindah", "Garis Pantai Bergeser"];

const ANIM_IMAGES = [imgAbrasiTahap1, imgAbrasiTahap2, imgAbrasiTahap3, imgAbrasiTahap4];

function AnimScene({ stage }) {
  return (
    <div className="anim-photo-scene">
      {ANIM_IMAGES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={ANIM_CAPTIONS[i]}
          className={`anim-photo${i === stage ? " active" : ""}`}
        />
      ))}
      <div className="anim-photo-overlay" />
    </div>
  );
}

/* ===== IMAGE LIGHTBOX (ZOOM VIEWER) ===== */
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

  const overlayRef = useRef(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const onWheelNative = (e) => {
      e.preventDefault();
      zoomStep(-e.deltaY * 0.0018);
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, []);

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
      ref={overlayRef}
      className="lightbox-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Tutup">
        <XIcon />
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

/* ===== MAIN COMPONENT ===== */
export default function AbrasiPantai() {
  const navigate = useNavigate();

  // Section 1+2  amati dua kondisi pantai (zoom)
  const [lightbox, setLightbox] = useState(null); // { src, alt } | null

  // Section 3  penyebab
  const [qaSelected, setQaSelected] = useState(null);
  const [qaSubmitted, setQaSubmitted] = useState(false);
  const qaCorrect = 0;

  // Section 4  susun proses (DnD)
  const [pool, setPool] = useState(initialProcessPoolOrder);
  const [slots, setSlots] = useState([null, null, null, null]);
  const [dndChecked, setDndChecked] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const allSlotsFilled = slots.every(s => s !== null);
  const isOrderCorrect = allSlotsFilled && slots.every((id, i) => id === PROCESS_ITEMS[i].id);
  const dndLocked = dndChecked;
  const cardById = id => PROCESS_ITEMS.find(p => p.id === id);

  // Section 5  animasi
  const [animStage, setAnimStage] = useState(0);
  const [animPlaying, setAnimPlaying] = useState(false);
  const [animViewed, setAnimViewed] = useState(false);
  const animRef = useRef(null);

  // Section 6  eksplorasi dampak
  const [activeImpact, setActiveImpact] = useState(null);
  const [visitedImpact, setVisitedImpact] = useState(new Set());
  const allImpactVisited = visitedImpact.size === IMPACT_ITEMS.length;

  // Section 8  drag connect
  const [linked, setLinked] = useState(new Set());
  const allLinked = linked.size === IMPACT_ITEMS.length;

  // Section 9  refleksi
  const [reflSelected, setReflSelected] = useState(null);
  const [reflSubmitted, setReflSubmitted] = useState(false);

  // Finish
  const [finishing, setFinishing] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finishError, setFinishError] = useState(null);
  const [showLock, setShowLock] = useState(false);

  // Status loading progres tersimpan — true sampai GET /materi4/jawaban selesai,
  // dipakai untuk menampilkan "Memuat progres tersimpan…" di label progress.
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Progress: 7 milestones each 1/7
  const pct =
    Math.round((
      (qaSubmitted ? 1 : 0) +
      (dndChecked ? 1 : 0) +
      (animViewed ? 1 : 0) +
      (allImpactVisited ? 1 : 0) +
      (allLinked ? 1 : 0) +
      (reflSubmitted ? 1 : 0) +
      (finished ? 1 : 0)
    ) / 7 * 100);

  // ── rehydrate semua jawaban tersimpan dari database saat halaman dibuka ──
  // Tanpa ini, qaSelected/slots/linked/reflSelected selalu mulai kosong lagi
  // tiap kali halaman di-refresh, walau datanya sudah ada di server.
  useEffect(() => {
    let cancelled = false;
    api
      .get("/materi4/jawaban")
      .then(({ data }) => {
        if (cancelled) return;
        const rows = data?.data || [];

        rows.forEach((row) => {
          const detail = row.detail || {};
          if (row.item_type === "mcq" && row.item_id === "penyebab-abrasi") {
            setQaSelected(detail.selected ?? null);
            setQaSubmitted(true);
          } else if (row.item_type === "drag" && row.item_id === "susun-proses") {
            if (Array.isArray(detail.urutan)) {
              setSlots(detail.urutan);
              setPool([]);
              setDndChecked(true);
            }
          } else if (row.item_type === "koneksi") {
            if (row.item_id === "anim-viewed") {
              setAnimViewed(true);
            } else if (row.item_id.startsWith("lihat-")) {
              const realId = row.item_id.replace("lihat-", "");
              setVisitedImpact((prev) => new Set(prev).add(realId));
            } else {
              setLinked((prev) => new Set(prev).add(row.item_id));
            }
          } else if (row.item_type === "refleksi" && row.item_id === "kesimpulan") {
            setReflSelected(detail.selected ?? null);
            setReflSubmitted(true);
          }
        });
      })
      .catch((err) => console.error("Gagal memuat progres Materi 4:", err))
      .finally(() => {
        if (!cancelled) setLoadingProgress(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── rehydrate status "Materi 4 selesai" dari database ──
  useEffect(() => {
    let cancelled = false;
    api
      .get("/materi/progress")
      .then((res) => {
        if (cancelled) return;
        const completed = res.data?.completed || [];
        if (completed.includes("abrasi-pantai")) {
          setFinished(true);
        }
      })
      .catch((err) => console.error("Gagal memuat status penyelesaian Materi 4:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });

  useEffect(() => () => { if (animRef.current) clearInterval(animRef.current); }, []);

  // Tandai animasi sudah ditonton sampai selesai, dan simpan ke server
  // (hanya sekali per sesi, biar tidak spam request tiap klik ulang).
  const markAnimViewed = () => {
    setAnimViewed(prev => {
      if (!prev) saveJawaban("koneksi", "anim-viewed", { label: "Animasi proses abrasi" }, true);
      return true;
    });
  };

  const playAnim = () => {
    if (animPlaying) return;
    if (animRef.current) clearInterval(animRef.current);
    setAnimPlaying(true);
    setAnimStage(0);
    let s = 0;
    animRef.current = setInterval(() => {
      s += 1;
      if (s > 3) {
        clearInterval(animRef.current);
        animRef.current = null;
        setAnimPlaying(false);
        markAnimViewed();
        return;
      }
      setAnimStage(s);
    }, 1800);
  };
  const pauseAnim = () => {
    if (animRef.current) clearInterval(animRef.current);
    animRef.current = null;
    setAnimPlaying(false);
  };
  const resetAnim = () => {
    pauseAnim();
    setAnimStage(0);
  };
  const goToStage = (i) => {
    pauseAnim();
    setAnimStage(i);
    if (i === 3) markAnimViewed();
  };
  const nextStage = () => {
    pauseAnim();
    setAnimStage(prev => {
      const n = Math.min(prev + 1, 3);
      if (n === 3) markAnimViewed();
      return n;
    });
  };
  const prevStage = () => {
    pauseAnim();
    setAnimStage(prev => Math.max(prev - 1, 0));
  };

  // Handler susun proses (tap-to-place, sama seperti rantai makanan Materi 2)
  const onPoolCardClick = (id) => {
    if (dndLocked) return;
    setSelectedCard(prev => (prev === id ? null : id));
  };
  const onSlotClick = (index) => {
    if (dndLocked) return;
    const current = slots[index];
    if (selectedCard) {
      const newSlots = [...slots];
      newSlots[index] = selectedCard;
      let newPool = pool.filter(id => id !== selectedCard);
      if (current) newPool = [...newPool, current];
      setSlots(newSlots);
      setPool(newPool);
      setSelectedCard(null);
      setDndChecked(false);
    } else if (current) {
      const newSlots = [...slots];
      newSlots[index] = null;
      setSlots(newSlots);
      setPool(prev => [...prev, current]);
      setSelectedCard(current);
      setDndChecked(false);
    }
  };
  const handleDragStart = (id, e) => {
    if (dndLocked) return;
    setDraggingId(id);
    setSelectedCard(null);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };
  const handleDragEnd = () => { setDraggingId(null); setDragOverSlot(null); };
  const moveCardToSlot = (id, destIndex) => {
    if (dndLocked || !id) return;
    const fromSlotIndex = slots.indexOf(id);
    const destCurrent = slots[destIndex];
    if (fromSlotIndex === destIndex) return;
    const newSlots = [...slots];
    let newPool = pool.filter(p => p !== id);
    if (fromSlotIndex !== -1) {
      newSlots[fromSlotIndex] = destCurrent && fromSlotIndex !== destIndex ? destCurrent : null;
    } else if (destCurrent) {
      newPool = [...newPool, destCurrent];
    }
    newSlots[destIndex] = id;
    setSlots(newSlots);
    setPool(newPool);
    setSelectedCard(null);
    setDndChecked(false);
  };
  const moveCardToPool = (id) => {
    if (dndLocked || !id) return;
    const fromSlotIndex = slots.indexOf(id);
    if (fromSlotIndex === -1) return;
    const newSlots = [...slots];
    newSlots[fromSlotIndex] = null;
    setSlots(newSlots);
    setPool(prev => [...prev, id]);
    setSelectedCard(null);
    setDndChecked(false);
  };
  const handleSlotDragOver = (index, e) => { e.preventDefault(); setDragOverSlot(index); };
  const handleSlotDrop = (index, e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    moveCardToSlot(id, index);
    setDraggingId(null);
    setDragOverSlot(null);
  };
  const handlePoolDragOver = (e) => e.preventDefault();
  const handlePoolDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    moveCardToPool(id);
    setDraggingId(null);
  };
  const submitDnd = () => {
    if (!allSlotsFilled) return;
    setDndChecked(true);
    saveJawaban("drag", "susun-proses", { urutan: slots }, isOrderCorrect);
  };

  const handleImpact = (item) => {
    setActiveImpact(prev => (prev?.id === item.id ? null : item));
    setVisitedImpact(prev => {
      if (prev.has(item.id)) return prev; // sudah pernah dilihat, jangan kirim ulang
      saveJawaban("koneksi", `lihat-${item.id}`, { label: item.label }, true);
      return new Set(prev).add(item.id);
    });
  };

  // Simpan satu jawaban pertanyaan ke server (upsert per item_type + item_id).
  // Dibuat "fire-and-forget" supaya tidak mengganggu alur belajar kalau request gagal.
  const saveJawaban = (itemType, itemId, detail, isCorrect) => {
    api.post("/materi4/jawaban", {
      item_type: itemType,
      item_id: itemId,
      detail,
      is_correct: !!isCorrect,
    }).catch(() => { /* diabaikan: jawaban tetap tersimpan di state lokal */ });
  };


  // Daftar aktivitas yang wajib dituntaskan sebelum tombol "Selesaikan Materi 4"
  // boleh diklik. Dipakai untuk validasi tombol sekaligus menampilkan pesan
  // aktivitas mana saja yang masih kurang.
  const finishRequirements = [
    { done: qaSubmitted, label: "Pertanyaan Pemantik — Penyebab Abrasi" },
    { done: dndChecked, label: "Aktivitas 2 — Susun Bagaimana Abrasi Terjadi" },
    { done: animViewed, label: "Visualisasi Proses Abrasi" },
    { done: allImpactVisited, label: "Aktivitas 3 — Eksplorasi Dampak Abrasi" },
    { done: allLinked, label: "Aktivitas 4 — Hubungkan Dampak Abrasi" },
    { done: reflSubmitted, label: "Pertanyaan Refleksi" },
  ];
  const allActivitiesDone = finishRequirements.every(r => r.done);
  const missingActivities = finishRequirements.filter(r => !r.done);

  const handleFinish = () => {
    if (finishing || finished || !allActivitiesDone) return;
    setFinishing(true);
    setFinishError(null);
    api.post("/materi/abrasi-pantai/complete")
      .then(() => setFinished(true))
      .catch(err => setFinishError(err?.response?.data?.message || "Gagal menyimpan ke server."))
      .finally(() => setFinishing(false));
  };

  return (
    <>
      <style>{STYLES}</style>
      <Navbar />

      {/* BANNER */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb reveal">
            <Link to="/">Beranda</Link><span>/</span>
            <Link to="/materi">Materi</Link><span>/</span>
            <span className="current">Abrasi Pantai</span>
          </div>
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Materi 4 dari 5</span>
          <h1 className="reveal"> Apa yang Terjadi pada Garis Pantai?</h1>
          <p className="reveal">Amati perubahan garis pantai, pahami proses abrasi, dan eksplorasi dampaknya bagi wilayah pesisir.</p>
        </div>
      </section>

      {/* PROGRESS BAR */}
      <div className="progress-wrap">
        <div className="container">
          <div className="progress-bar-row reveal">
            <span className="progress-label">{loadingProgress ? "Memuat progres tersimpan…" : `Materi 4  ${pct}%`}</span>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          </div>
        </div>
      </div>

      {/* SECTION 1+2  AMATI DUA KONDISI PANTAI */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Aktivitas 1</span>
            <h2>Amati Dua Kondisi Pantai</h2>
            <p>Perhatikan dua kondisi pantai berikut. Apakah kamu melihat adanya perbedaan pada garis pantai?</p>
          </div>
          <div className="compare-grid reveal">
            <div className="compare-card card-a">
              <div className="compare-img-wrap" onClick={() => setLightbox({ src: imgPantaiA, alt: "Pantai A  kondisi awal dengan vegetasi lebat" })}>
                <img src={imgPantaiA} alt="Pantai A  kondisi awal dengan vegetasi lebat" />
                <button
                  className="compare-zoom-btn"
                  onClick={(e) => { e.stopPropagation(); setLightbox({ src: imgPantaiA, alt: "Pantai A  kondisi awal dengan vegetasi lebat" }); }}
                  aria-label="Perbesar gambar Pantai A"
                  title="Perbesar gambar"
                >
                  <ZoomInIcon />
                </button>
              </div>
              <div className="compare-footer">
                <span className="compare-dot" />
                <div>
                  <strong style={{ fontSize: "0.88rem", color: "var(--canopy)" }}>Pantai A</strong>
                  <p style={{ fontSize: "0.82rem", color: "#4C5F58", marginTop: 2 }}>Garis pantai masih jauh dari daratan. Area pantai terlihat lebih lebar.</p>
                </div>
              </div>
            </div>
            <div className="compare-card card-b">
              <div className="compare-img-wrap" onClick={() => setLightbox({ src: imgPantaiB, alt: "Pantai B  kondisi setelah abrasi" })}>
                <img src={imgPantaiB} alt="Pantai B  kondisi setelah abrasi" />
                <button
                  className="compare-zoom-btn"
                  onClick={(e) => { e.stopPropagation(); setLightbox({ src: imgPantaiB, alt: "Pantai B  kondisi setelah abrasi" }); }}
                  aria-label="Perbesar gambar Pantai B"
                  title="Perbesar gambar"
                >
                  <ZoomInIcon />
                </button>
              </div>
              <div className="compare-footer">
                <span className="compare-dot" />
                <div>
                  <strong style={{ fontSize: "0.88rem", color: "var(--canopy)" }}>Pantai B</strong>
                  <p style={{ fontSize: "0.82rem", color: "#4C5F58", marginTop: 2 }}>Garis pantai sudah bergeser ke arah daratan. Area pantai terlihat lebih sempit.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3  PERTANYAAN PENYEBAB */}
          <div className="quiz-box reveal">
            <span className="eyebrow">Pertanyaan Pemantik</span>
            <h3>Menurutmu, apa yang mungkin menyebabkan garis pantai pada kedua kondisi tersebut berbeda?</h3>
            {["Pengikisan material pantai oleh gelombang", "Bertambahnya pasir di pantai", "Pertumbuhan tanaman di pantai"].map((opt, i) => {
              const state = !qaSubmitted ? (qaSelected === i ? "selected" : "") : i === qaCorrect ? "correct" : qaSelected === i ? "wrong" : "";
              return (
                <button key={i} className={`quiz-option ${state}`} onClick={() => !qaSubmitted && setQaSelected(i)} disabled={qaSubmitted}>
                  <span className="quiz-option-dot">
                    {qaSubmitted && i === qaCorrect && <CheckIcon />}
                    {qaSubmitted && qaSelected === i && i !== qaCorrect && <XIcon />}
                  </span>
                  {opt}
                </button>
              );
            })}
            {!qaSubmitted ? (
              <button className="btn btn-primary" disabled={qaSelected === null} onClick={() => {
                setQaSubmitted(true);
                saveJawaban("mcq", "penyebab-abrasi", { selected: qaSelected }, qaSelected === qaCorrect);
              }} style={{ marginTop: 8 }}>
                Periksa Jawaban <ArrowIcon />
              </button>
            ) : (
              <>
                <div className={`feedback ${qaSelected === qaCorrect ? "correct" : "wrong"}`}>
                  {qaSelected === qaCorrect ? <CheckIcon /> : <XIcon />}
                  <span>{qaSelected === qaCorrect
                    ? " Benar! Gelombang laut dapat mengikis material pantai sehingga garis pantai dapat mengalami perubahan. Sekarang, yuk kita lihat bagaimana proses abrasi terjadi."
                    : qaSelected === 1
                      ? " Belum tepat. Coba perhatikan kembali kondisi kedua pantai. Apakah perubahan garis pantai terjadi karena pasir bertambah atau karena material pantai mengalami pengikisan?"
                      : " Belum tepat. Pertumbuhan tanaman bukan penyebab utama perubahan garis pantai pada ilustrasi tersebut. Coba perhatikan kembali perubahan pada area pasir dan garis pantainya."
                  }</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4  SUSUN PROSES ABRASI (DnD) */}
      {qaSubmitted && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Aktivitas 2</span>
              <h2> Susun Bagaimana Abrasi Terjadi!</h2>
              <p>Susun kartu berikut sesuai urutan proses terjadinya abrasi, mulai dari penyebab hingga dampak akhirnya.</p>
            </div>
            <div className="reveal">
              <div className="chain-pool" onDragOver={handlePoolDragOver} onDrop={handlePoolDrop}>
                {pool.length === 0 && <span className="chain-pool-empty">Semua kartu sudah ditempatkan.</span>}
                {pool.map(id => {
                  const c = cardById(id);
                  return (
                    <div
                      key={id}
                      className={`chain-card${selectedCard === id ? " selected" : ""}${draggingId === id ? " dragging" : ""}`}
                      onClick={() => onPoolCardClick(id)}
                      draggable={!dndLocked}
                      onDragStart={e => handleDragStart(id, e)}
                      onDragEnd={handleDragEnd}>
                      <span className="emoji">{c.emoji}</span>
                      <span className="label">{c.text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="chain-slots">
                {slots.map((filledId, i) => {
                  const filled = filledId ? cardById(filledId) : null;
                  let slotClass = "";
                  if (dndChecked) slotClass = filledId === PROCESS_ITEMS[i].id ? " correct-slot" : " wrong-slot";
                  return (
                    <React.Fragment key={i}>
                      <div className="chain-slot-wrap">
                        <span className="chain-slot-role">Tahap {i + 1}</span>
                        <div
                          className={`chain-slot${filled ? " filled" : ""}${slotClass}${dragOverSlot === i ? " drag-over" : ""}`}
                          onClick={() => onSlotClick(i)}
                          onDragOver={e => handleSlotDragOver(i, e)}
                          onDragLeave={() => setDragOverSlot(cur => cur === i ? null : cur)}
                          onDrop={e => handleSlotDrop(i, e)}>
                          {filled ? (
                            <div draggable={!dndLocked} onDragStart={e => handleDragStart(filledId, e)} onDragEnd={handleDragEnd}>
                              <span className="filled-emoji">{filled.emoji}</span>
                              <span className="filled-label">{filled.text}</span>
                            </div>
                          ) : (
                            <span className="placeholder">?</span>
                          )}
                        </div>
                      </div>
                      {i < slots.length - 1 && <span className="chain-slot-arrow"><ArrowIcon /></span>}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="chain-actions">
                {!dndLocked ? (
                  <button className="btn btn-primary" disabled={!allSlotsFilled} onClick={submitDnd}>
                    Periksa Jawaban <ArrowIcon />
                  </button>
                ) : isOrderCorrect ? (
                  <div className="feedback correct" style={{ margin: 0 }}>
                    <CheckIcon />
                    <span> Benar! Kamu berhasil menyusun tahapan terjadinya abrasi. Sekarang, lihat apa saja yang dapat terjadi ketika abrasi terus berlangsung.</span>
                  </div>
                ) : (
                  <div className="feedback wrong" style={{ margin: 0 }}>
                    <XIcon />
                    <span>Belum tepat, tapi tidak apa-apa  perhatikan urutan yang benar pada penjelasan di bawah ini.</span>
                  </div>
                )}
              </div>

              {dndLocked && (
                <div className="chain-explain reveal">
                  <p style={{ color: "#4C5F58", fontSize: "0.92rem", marginBottom: 4 }}>
                    {isOrderCorrect
                      ? "Hebat! Kamu berhasil memahami urutan proses terjadinya abrasi, mulai dari gelombang menghantam pantai hingga garis pantai berubah."
                      : "Berikut urutan proses abrasi yang tepat, mulai dari gelombang menghantam pantai hingga garis pantai berubah."}
                  </p>
                  {processOrder.map(id => {
                    const c = cardById(id);
                    return (
                      <div className="chain-explain-item" key={id}>
                        <span className="emoji">{c.emoji}</span>
                        <div>
                          <span className="role">{c.label}</span>
                          <p>{processExplanations[id]}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5  ANIMASI PROSES ABRASI */}
      {dndChecked && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Visualisasi</span>
              <h2>Lihat Bagaimana Proses Abrasi Terjadi</h2>
              <p>Putar animasi untuk melihat tahap demi tahap proses abrasi, dari gelombang menghantam pantai hingga garis pantai berubah.</p>
            </div>
            <div className="reveal anim-layout">
              <div className="anim-scene-wrap">
                <div className="anim-scene">
                  <AnimScene stage={animStage} />
                  <span className="anim-stage-badge">Tahap {animStage + 1} / 4</span>
                  <button
                    className="anim-nav-btn anim-nav-prev"
                    onClick={prevStage}
                    disabled={animStage === 0}
                    aria-label="Tahap sebelumnya"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    className="anim-nav-btn anim-nav-next"
                    onClick={nextStage}
                    disabled={animStage === 3}
                    aria-label="Tahap berikutnya"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>

                <div className="anim-progress-track">
                  <div className="anim-progress-fill" style={{ width: `${((animStage + 1) / 4) * 100}%` }} />
                </div>

                <div className="anim-caption" key={animStage}>
                  <span className="num">{animStage + 1}</span>
                  <span>{ANIM_CAPTIONS[animStage]}</span>
                </div>

                <div className="anim-controls">
                  <button className="btn btn-primary" onClick={animPlaying ? pauseAnim : playAnim}>
                    {animPlaying ? (<><PauseIcon /> Jeda</>) : (<><PlayIcon /> Putar Proses</>)}
                  </button>
                  <button className="btn btn-outline" onClick={resetAnim}><RefreshIcon /> Ulangi</button>
                </div>
              </div>

              <div className="anim-thumbs">
                {ANIM_IMAGES.map((src, i) => (
                  <button
                    key={i}
                    className={`anim-thumb${i === animStage ? " active" : ""}`}
                    onClick={() => goToStage(i)}
                    aria-label={`Lompat ke tahap ${i + 1}: ${ANIM_TITLES[i]}`}
                  >
                    <div className="anim-thumb-img-wrap">
                      <img src={src} alt={ANIM_TITLES[i]} />
                      <span className="anim-thumb-num">{i + 1}</span>
                    </div>
                    <span className="anim-thumb-label">{ANIM_TITLES[i]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6  EKSPLORASI DAMPAK */}
      {dndChecked && qaSubmitted && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Aktivitas 3</span>
              <h2> Apa yang Terdampak Ketika Abrasi Terus Terjadi?</h2>
              <p>Klik setiap objek untuk menemukan dampak abrasi terhadap wilayah pesisir.</p>
            </div>
            <div className="impact-grid reveal">
              {IMPACT_ITEMS.map(item => {
                const isActive = activeImpact?.id === item.id;
                return (
                  <div key={item.id}
                    className={`impact-btn${visitedImpact.has(item.id) ? " visited" : ""}${isActive ? " active" : ""}`}>
                    <button
                      className="impact-btn-head"
                      onClick={() => handleImpact(item)}
                      aria-expanded={isActive}
                    >
                      <div className="impact-icon" style={{ background: item.bg, color: item.color }}>
                        <span>{item.emoji}</span>
                      </div>
                      <div className="impact-btn-title">
                        <strong>{item.label}</strong>
                        {visitedImpact.has(item.id) && <span className="visited-tag"> Sudah dilihat</span>}
                      </div>
                      <span className="impact-chevron"><ChevronRightIcon /></span>
                    </button>
                    <div className="impact-detail">
                      <div className="impact-detail-inner">
                        <p>{item.desc}</p>
                        <p className="impact-sub">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {allImpactVisited && (
              <div className="feedback correct reveal" style={{ marginTop: 22 }}>
                <CheckIcon />
                <span> Kamu sudah menemukan berbagai dampak abrasi! Lanjutkan ke aktivitas berikutnya.</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 7  RANGKUMAN DAMPAK (chain visual) */}
      {allImpactVisited && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Ringkasan Dampak</span>
              <h2>Dampak Abrasi Secara Menyeluruh</h2>
              <p>Abrasi tidak hanya mengubah garis pantai, tetapi juga memengaruhi berbagai bagian wilayah pesisir dan kehidupan di sekitarnya.</p>
            </div>
            <div className="chain-visual reveal">
              <div className="chain-box highlight">🌊 Abrasi</div>
              <div className="chain-arrow"><ArrowIcon /></div>
              <div className="chain-box">📉 Perubahan Garis Pantai</div>
              <div className="chain-arrow"><ArrowIcon /></div>
              <div className="chain-box">📍 Dampak terhadap Wilayah Pesisir</div>
              <div className="chain-arrow"><ArrowIcon /></div>
              <div className="chain-leaf">
                {IMPACT_ITEMS.map(item => (
                  <div key={item.id} className="chain-leaf-item" style={{ color: item.color, borderColor: item.color, background: item.bg }}>
                    <span className="chain-leaf-emoji">{item.emoji}</span> {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 8  HUBUNGKAN DAMPAK (connect activity) */}
      {allImpactVisited && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Aktivitas 4</span>
              <h2>Hubungkan Dampak Abrasi</h2>
              <p>Klik setiap kotak dampak untuk menghubungkannya dengan abrasi. Temukan hubungan sebab-akibatnya!</p>
            </div>
            <div className="drag-connect-zone reveal">
              <div className="dc-source"> Abrasi terus terjadi  apa dampaknya?</div>
              <div className="dc-targets">
                {IMPACT_ITEMS.map(item => (
                  <div key={item.id}
                    className={`dc-target${linked.has(item.id) ? " linked" : ""}`}
                    onClick={() => {
                      setLinked(prev => {
                        const n = new Set(prev);
                        if (n.has(item.id)) {
                          n.delete(item.id);
                        } else {
                          n.add(item.id);
                          saveJawaban("koneksi", item.id, { label: item.label }, true);
                        }
                        return n;
                      });
                    }}>
                    {linked.has(item.id) && " "}{item.emoji} {item.label}
                  </div>
                ))}
              </div>
              {allLinked && (
                <div className="feedback correct" style={{ marginTop: 18 }}>
                  <CheckIcon />
                  <span> Benar! Abrasi tidak hanya mengubah garis pantai, tetapi juga dapat berdampak pada berbagai bagian wilayah pesisir.</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 9  REFLEKSI */}
      {allLinked && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Refleksi</span>
              <h2>Apa yang Kamu Pikirkan?</h2>
            </div>
            <div className="quiz-box reveal">
              <span className="eyebrow" style={{ marginBottom: 8 }}>Pertanyaan Refleksi</span>
              <h3>{REFLEKSI_Q.question}</h3>
              {REFLEKSI_Q.options.map((opt, i) => {
                const state = !reflSubmitted ? (reflSelected === i ? "selected" : "") : i === REFLEKSI_Q.correct ? "correct" : reflSelected === i ? "wrong" : "";
                return (
                  <button key={i} className={`quiz-option ${state}`}
                    onClick={() => !reflSubmitted && setReflSelected(i)} disabled={reflSubmitted}>
                    <span className="quiz-option-dot">
                      {reflSubmitted && i === REFLEKSI_Q.correct && <CheckIcon />}
                      {reflSubmitted && reflSelected === i && i !== REFLEKSI_Q.correct && <XIcon />}
                    </span>
                    {opt}
                  </button>
                );
              })}
              {!reflSubmitted ? (
                <button className="btn btn-primary" disabled={reflSelected === null}
                  onClick={() => {
                    setReflSubmitted(true);
                    saveJawaban("refleksi", "kesimpulan", { selected: reflSelected }, reflSelected === REFLEKSI_Q.correct);
                  }} style={{ marginTop: 8 }}>
                  Periksa Jawaban <ArrowIcon />
                </button>
              ) : (
                <>
                  <div className={`feedback ${reflSelected === REFLEKSI_Q.correct ? "correct" : "wrong"}`}>
                    {reflSelected === REFLEKSI_Q.correct ? <CheckIcon /> : <XIcon />}
                    <span>{reflSelected === REFLEKSI_Q.correct ? REFLEKSI_Q.feedbackCorrect : REFLEKSI_Q.feedbackWrong}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 10  RINGKASAN */}
      {reflSubmitted && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Ringkasan</span>
              <h2> Yang Sudah Kamu Pelajari</h2>
              <p>Selamat! Kamu telah menyelesaikan seluruh aktivitas Materi 4 tentang Abrasi Pantai.</p>
            </div>
            <div className="summary-cards reveal">
              {SUMMARY_CARDS.map((c, i) => (
                <div key={i} className="summary-card">
                  <div className="emoji">{c.emoji}</div>
                  <h4>{c.title}</h4>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>
            <div className="quiz-box reveal" style={{ marginTop: 32, textAlign: "center", background: "linear-gradient(135deg,var(--canopy),var(--estuary))" }}>
              <p style={{ color: "rgba(251,250,245,0.88)", fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 20px" }}>
                <strong style={{ color: "var(--amber)" }}>Perubahan garis pantai bukan hanya perubahan bentuk pantai.</strong><br />
                Abrasi yang terus berlangsung dapat memengaruhi berbagai bagian wilayah pesisir dan kehidupan di sekitarnya.
              </p>
              <button
                className={`btn btn-primary${finished ? " btn-finished" : ""}`}
                onClick={handleFinish}
                disabled={finishing || finished || !allActivitiesDone}
                title={!allActivitiesDone && !finished ? "Selesaikan semua aktivitas Materi 4 terlebih dahulu" : undefined}
              >
                {finished
                  ? <>✅ Materi Telah Diselesaikan</>
                  : finishing
                    ? "Menyimpan..."
                    : <>🎉 Selesaikan Materi 4 <ArrowIcon /></>}
              </button>
              {finishError && <p style={{ color: "#ffbbbb", marginTop: 12, fontSize: "0.85rem" }}>{finishError}</p>}
              {!finished && !allActivitiesDone && (
                <div style={{ marginTop: 16, textAlign: "left", background: "rgba(251,250,245,0.1)", borderRadius: 12, padding: "14px 18px" }}>
                  <p style={{ color: "var(--amber)", fontSize: "0.85rem", fontWeight: 700, margin: "0 0 8px" }}>
                    ⚠️ Lengkapi aktivitas berikut sebelum menyelesaikan Materi 4:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "rgba(251,250,245,0.88)", fontSize: "0.82rem", lineHeight: 1.8 }}>
                    {missingActivities.map((r, i) => <li key={i}>{r.label}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* NAVIGATION */}
            <div className="materi-nav reveal">
              <Link to="/materi" className="btn btn-outline"><ArrowLeftIcon /> Daftar Materi</Link>
              <button
                className="btn btn-primary"
                onClick={() => { if (!finished) { setShowLock(true); } else { navigate("/materi/konservasi-mangrove"); } }}>
                Materi 5  Konservasi <ArrowIcon />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* IMAGE LIGHTBOX */}
      {lightbox && (
        <ImageLightbox img={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}

      {/* LOCK MODAL */}
      {showLock && (
        <div className="lock-overlay" onClick={() => setShowLock(false)}>
          <div className="lock-modal" onClick={e => e.stopPropagation()}>
            <button className="lock-close" onClick={() => setShowLock(false)}><XIcon /></button>
            <div className="lock-icon"></div>
            <h3>Materi Belum Selesai</h3>
            <p>Selesaikan seluruh aktivitas Materi 4 dan klik tombol <strong>"Selesaikan Materi 4"</strong> terlebih dahulu sebelum melanjutkan ke Materi 5.</p>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setShowLock(false)}>
              Kembali ke Materi 4
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}