import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import api from "../lib/api";
import heroBg from "./konservasi-mangrove-sehat.png";
import backgroundImg from "./background.png";
import mangroveImg from "./mangrove.png";
import waveLowImg from "./wave-low.png";
import waveMediumImg from "./wave-medium.png";
import waveHighImg from "./wave-high.png";

/* ================= VISUAL ASSET =================
   Seluruh visualisasi memakai PNG yang sudah tersedia:
   - background.png            : latar area simulasi
   - mangrove.png              : satu pohon (diulang dengan posisi berbeda)
   - wave-low/medium/high.png  : ilustrasi gelombang, di-crossfade mengikuti
                                  slider "Tinggi Gelombang" (bukan digambar
                                  ulang secara prosedural) supaya teksturnya
                                  tetap terlihat seperti ombak sungguhan.
================================================================ */

// Tinggi dasar satu pohon (persen dari tinggi container). Ukuran final =
// TREE_BASE × scale, sehingga variasi skala 0.75–1.05 terasa natural tanpa
// perbedaan ekstrem. Asset mangrove.png ber-aspek 2:3 (potret), jadi lebar
// otomatis mengikuti tinggi (width:auto).
const TREE_BASE = 26;

// Posisi + skala + kemiringan untuk maksimal 10 pohon mangrove.
// Ditentukan secara deterministik (bukan Math.random) supaya posisi stabil
// saat React re-render. Akar disejajarkan dengan garis pantai (pasir) pada
// background.png (~bottom 42–56%): baris belakang lebih kecil & sedikit lebih
// tinggi; baris depan lebih besar & lebih jelas (memberi kesan kedalaman).
const TREE_SLOTS = [
  { left: 5,  bottom: 52, scale: 0.78, rotate: -2 },
  { left: 14, bottom: 44, scale: 0.92, rotate: 1 },
  { left: 23, bottom: 53, scale: 0.80, rotate: -1 },
  { left: 32, bottom: 43, scale: 1.00, rotate: 2 },
  { left: 41, bottom: 52, scale: 0.82, rotate: -2 },
  { left: 50, bottom: 42, scale: 1.04, rotate: 1 },
  { left: 59, bottom: 53, scale: 0.79, rotate: -1 },
  { left: 68, bottom: 44, scale: 0.94, rotate: 2 },
  { left: 77, bottom: 52, scale: 0.81, rotate: -2 },
  { left: 86, bottom: 42, scale: 0.88, rotate: 1 },
];

// Jumlah pohon mengikuti kerapatan: 20% → 2, 40% → 4, …, 100% → 10.
function treeCount(density) {
  return Math.round(density / 10);
}

/* ================= WAVE CROSSFADE =================
   Tiga ilustrasi (low/medium/high) ditumpuk pas di atas satu sama lain lalu
   di-crossfade lewat opacity mengikuti slider "Tinggi Gelombang":
   0–50%  → low  memudar ke medium
   50–100 → medium memudar ke high
   Hasilnya transisi mulus dari tenang ke ombak besar tanpa patahan, dan
   teksturnya tetap ilustrasi asli (bukan bentuk geometris). */
function waveCrossfade(wh) {
  if (wh <= 0.5) {
    const t = wh / 0.5;
    return { low: 1 - t, medium: t, high: 0 };
  }
  const t = (wh - 0.5) / 0.5;
  return { low: 0, medium: 1 - t, high: t };
}

/* ================================================================
   LOGIKA KATEGORI & HASIL PENGAMATAN
================================================================ */
// Kategori umum untuk gelombang & skor abrasi (tidak ada standar baku resmi,
// jadi tetap dibagi rata 3 bagian): 0–33% Rendah, 34–66% Sedang, 67–100% Tinggi.
function kategori(v) {
  if (v <= 33) return "Rendah";
  if (v <= 66) return "Sedang";
  return "Tinggi";
}

// Kategori kerapatan mangrove mengikuti Tabel 1 "Standar baku kerusakan
// hutan mangrove" (Rafdinal et al., berdasarkan Kepmen LH No. 201/2004):
//   Kriteria Baik, Padat  : tutupan ≥ 75%   (kerapatan ≥ 1.500 ind/ha)
//   Kriteria Baik, Sedang : tutupan 50–75%  (kerapatan 1.000–1.500 ind/ha)
//   Kriteria Rusak, Jarang: tutupan < 50%   (kerapatan < 1.000 ind/ha)
// Nilai slider "Kerapatan Mangrove" (0–100%) dipetakan langsung sebagai
// persentase tutupan pada standar ini.
function densityKategori(v) {
  if (v < 50) return "Jarang";
  if (v < 75) return "Sedang";
  return "Padat";
}

// Kriteria kerusakan sesuai Tabel 1: Padat & Sedang = Baik, Jarang = Rusak.
function densityKriteria(v) {
  return densityKategori(v) === "Jarang" ? "Rusak" : "Baik";
}

function protectionLabel(density) {
  const k = densityKategori(density);
  if (k === "Padat") return "Kuat";
  if (k === "Sedang") return "Cukup";
  return "Lemah";
}

// Deskripsi hasil pengamatan. Sengaja memakai bahasa yang tidak absolut:
// "menunjukkan", "cenderung", "dapat", "lebih rentan".
function computeObservation(density, waveHeight) {
  const d = densityKategori(density);
  const w = kategori(waveHeight);
  const dLow = d === "Jarang";
  const dHigh = d === "Padat";
  const wLow = w === "Rendah";
  const wHigh = w === "Tinggi";

  if (dHigh && wLow) {
    return "Vegetasi mangrove yang rapat dan gelombang yang relatif rendah menunjukkan kondisi perlindungan pesisir yang cenderung lebih baik.";
  }
  if (dLow && wHigh) {
    return "Vegetasi mangrove yang jarang dan gelombang yang tinggi menunjukkan kondisi yang lebih rentan terhadap energi gelombang.";
  }
  if (dHigh && wHigh) {
    return "Meski vegetasi mangrove rapat, gelombang yang tinggi dapat menimbulkan tekanan yang lebih besar. Perlindungan pesisir cenderung tetap terjaga, tetapi perlu pengamatan lebih lanjut.";
  }
  if (dLow && wLow) {
    return "Vegetasi mangrove yang jarang dengan gelombang rendah menunjukkan perlindungan pesisir yang masih memadai, namun lebih rentan apabila gelombang meningkat.";
  }
  if (dHigh) {
    return "Vegetasi mangrove yang rapat cenderung dapat meredam energi gelombang sedang, sehingga perlindungan pesisir tetap cukup baik.";
  }
  if (dLow) {
    return "Vegetasi mangrove yang jarang menunjukkan perlindungan pesisir yang lebih terbatas dan cenderung lebih rentan terhadap energi gelombang.";
  }
  if (wHigh) {
    return "Gelombang yang tinggi dapat menimbulkan tekanan yang lebih besar, sehingga kondisi perlindungan pesisir cenderung perlu diperhatikan.";
  }
  if (wLow) {
    return "Gelombang yang rendah menunjukkan tekanan yang relatif kecil terhadap pesisir, sehingga kondisi perlindungan cenderung cukup baik.";
  }
  return "Vegetasi mangrove dengan kerapatan sedang dan gelombang sedang menunjukkan perlindungan pesisir yang cukup seimbang, namun dapat lebih rentan saat gelombang meningkat.";
}

// Peringkat level (0=rendah/jarang, 1=sedang, 2=tinggi/padat) supaya tone
// bisa dipakai untuk dua sistem label sekaligus: Rendah/Sedang/Tinggi
// (gelombang, abrasi) dan Jarang/Sedang/Padat (kerapatan mangrove).
function levelRank(level) {
  if (level === "Sedang") return 1;
  if (level === "Tinggi" || level === "Padat") return 2;
  return 0; // "Rendah" atau "Jarang"
}

// tone untuk pewarnaan indikator diagram & badge: good(green)/mid(amber)/bad(red)
function toneOfLevel(level, goodWhenHigh) {
  const rank = levelRank(level);
  if (rank === 2) return goodWhenHigh ? "good" : "bad";
  if (rank === 1) return "mid";
  return goodWhenHigh ? "bad" : "good";
}

/* ================= NODE DIAGRAM SEBAB-AKIBAT ================= */
function CausalNode({ icon, label, value, note, fill, tone }) {
  return (
    <div className={`causal-node tone-${tone}`}>
      <div className="causal-icon">{icon}</div>
      <div className="causal-body">
        <span className="causal-label">{label}</span>
        <div className="causal-bar">
          <div className="causal-fill" style={{ width: `${fill}%` }} />
        </div>
        <div className="causal-meta">
          <b>{value}</b>
          <span>{note}</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   HALAMAN UTAMA
================================================================ */
export default function LabVirtual() {
  const [density, setDensity] = useState(60);
  const [waveHeight, setWaveHeight] = useState(40);
  const [experimentCount, setExperimentCount] = useState(0);

  // Ambil jumlah percobaan yang sudah tersimpan di database (bukan localStorage lagi).
  useEffect(() => {
    let cancelled = false;
    api.get("/lab-virtual/eksperimen")
      .then((res) => {
        if (!cancelled) setExperimentCount(res.data?.data?.total ?? 0);
      })
      .catch(() => { /* biarkan tetap 0 kalau gagal ambil */ });
    return () => { cancelled = true; };
  }, []);

  const DEFAULT_DENSITY = 60;
  const DEFAULT_WAVE = 40;

  const densityK = densityKategori(density);
  const waveK = kategori(waveHeight);
  const protection = protectionLabel(density);
  const protectionTone = protection === "Kuat" ? "good" : protection === "Cukup" ? "mid" : "bad";
  // Risiko abrasi naik seiring tinggi gelombang, turun seiring kerapatan mangrove.
  const abrasionScore = Math.round(Math.max(0, Math.min(100, waveHeight - density * 0.5)));
  const abrasionK = kategori(abrasionScore);
  const observation = computeObservation(density, waveHeight);

  const pohonCount = treeCount(density);

  // "Tinggi Gelombang" mengatur dua hal: seberapa besar area panel yang
  // ditutupi air (waveLayerHeight), dan crossfade antara tiga ilustrasi
  // gelombang (low/medium/high) supaya teksturnya tetap terlihat seperti
  // ombak sungguhan di semua posisi slider.
  const wh = waveHeight / 100; // 0..1
  const waveLayerHeight = 30 + wh * 20; // 30% (tenang) → 50% (kuat)
  const waveMix = waveCrossfade(wh);
  // Tiga salinan (belakang → tengah → depan), semuanya pakai kotak crop yang
  // SAMA (cuma digeser lewat transform) supaya tidak ada potongan/sambungan
  // yang kelihatan — hasilnya air terasa penuh & berlapis sampai ke dasar
  // panel, bukan cuma satu garis wave yang mengambang di tengah.
  const waveDepths = [
    { className: "wave-copy-back", opacityScale: 0.55 },
    { className: "wave-copy-mid", opacityScale: 0.8 },
    { className: "wave-copy-front", opacityScale: 1 },
  ];

  const handleReset = () => {
    setDensity(DEFAULT_DENSITY);
    setWaveHeight(DEFAULT_WAVE);
  };

  // "🔬 Coba Kondisi Lain": catat eksperimen saat ini (kerapatan, gelombang,
  // perlindungan, skor abrasi) ke database, lalu geser ke kombinasi lain
  // agar siswa tidak hanya mengamati satu kondisi.
  const handleTryOther = () => {
    api.post("/lab-virtual/eksperimen", {
      kerapatan_mangrove: density,
      tinggi_gelombang: waveHeight,
      perlindungan: protection,
      skor_abrasi: abrasionScore,
    })
      .then((res) => {
        if (typeof res.data?.total === "number") setExperimentCount(res.data.total);
        else setExperimentCount((c) => c + 1);
      })
      .catch(() => { /* tetap lanjut walau gagal tersimpan */ });

    const presets = [
      [85, 20],
      [20, 85],
      [90, 90],
      [20, 20],
      [55, 55],
    ];
    const next = presets.find((p) => Math.abs(p[0] - density) > 15 || Math.abs(p[1] - waveHeight) > 15) || presets[0];
    setDensity(next[0]);
    setWaveHeight(next[1]);
  };

  // Animasi reveal saat elemen masuk viewport — pola yang sama dengan
  // halaman lain (Materi, Dasbor, Simulasi).
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
          --canopy:#0F241D; --estuary:#2F6B57; --tide:#89AE9E; --tide-pale:#E1EAE2;
          --sand:#F1F4EC; --sand-deep:#E7EDDF; --silt:#A9784F; --amber:#E8A33D; --amber-deep:#CE8324;
          --ink:#12261F; --paper:#FBFAF5; --danger:#C24A5F;
          --shadow: 0 20px 40px -20px rgba(15,36,29,0.35);
          --radius-lg: 28px; --radius-md: 18px;
        }
        *{box-sizing:border-box; margin:0; padding:0;}
        body{ font-family:'Plus Jakarta Sans', sans-serif; background:var(--sand); color:var(--ink); line-height:1.6; }
        h1,h2,h3,h4{ font-family:'Fraunces', serif; font-weight:600; color:var(--canopy); line-height:1.15; letter-spacing:-0.01em; }
        a{ text-decoration:none; color:inherit; }
        .container{ max-width:1120px; margin:0 auto; padding:0 32px; }
        .eyebrow{ font-family:'Space Mono', monospace; text-transform:uppercase; letter-spacing:0.14em; font-size:0.72rem; color:var(--estuary); font-weight:700; display:inline-flex; align-items:center; gap:8px; }
        .reveal{ opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s ease; }
        .reveal.show{ opacity:1; transform:translateY(0); }

        .btn{ display:inline-flex; align-items:center; gap:8px; padding:13px 26px; border-radius:999px; font-weight:700; font-size:0.92rem; cursor:pointer; border:none; transition:transform .25s ease, box-shadow .25s ease, background .25s ease; font-family:'Plus Jakarta Sans', sans-serif; }
        .btn-primary{ background:var(--amber); color:var(--canopy); box-shadow:0 12px 24px -10px rgba(232,163,61,0.7); }
        .btn-primary:hover{ transform:translateY(-3px); box-shadow:0 16px 30px -10px rgba(232,163,61,0.85); }
        .btn-outline{ background:transparent; color:var(--estuary); border:1.5px solid rgba(47,107,87,0.35); }
        .btn-outline:hover{ background:var(--tide-pale); transform:translateY(-2px); }

        /* ===== Banner ===== */
        .wave-divider{ position:absolute; left:0; right:0; bottom:-1px; line-height:0; pointer-events:none; z-index:5; }
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

        .lab-main{ padding:52px 0 90px; }

        /* ===== Grid kontrol + visualisasi ===== */
        .lab-grid{ display:grid; grid-template-columns:1.35fr 0.9fr; gap:30px; align-items:start; }
        .viz-panel{ order:1; }
        .control-panel{ order:2; }

        /* ===== Visualisasi ===== */
        .viz-panel{
          position:relative; border-radius:var(--radius-lg); overflow:hidden;
          height:470px; background:var(--tide-pale);
          box-shadow:var(--shadow); border:1px solid rgba(15,36,29,0.06);
        }
        .viz-bg{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:1; }
        .viz-readout{
          position:absolute; top:16px; left:16px; z-index:5;
          background:rgba(15,36,29,0.7); color:var(--paper); font-family:'Space Mono', monospace;
          font-size:0.72rem; padding:10px 14px; border-radius:12px; display:flex; flex-direction:column; gap:4px;
        }
        .viz-readout .protect{ font-weight:700; }
        .viz-readout .protect.good{ color:#8FD6A8; }
        .viz-readout .protect.mid{ color:#F4C268; }
        .viz-readout .protect.bad{ color:#F29AAC; }

        /* mangrove.png — pohon muncul satu per satu mengikuti kerapatan.
           --rot dipakai di keyframe supaya kemiringan tetap setelah animasi selesai. */
        .mangrove-layer{ position:absolute; inset:0; z-index:3; pointer-events:none; }
        .mangrove-tree{
          position:absolute; width:auto; transform-origin:bottom center;
          animation:treeAppear 440ms ease both;
          will-change:opacity, transform;
        }
        @keyframes treeAppear{
          from{ opacity:0; transform:translateY(12px) scale(0.9) rotate(var(--rot, 0deg)); }
          to{ opacity:1; transform:translateY(0) scale(1) rotate(var(--rot, 0deg)); }
        }

        /* Wave PNG — sebelumnya tiap "baris" punya kotak crop berbeda (tinggi
           beda-beda) sehingga object-fit:cover memotong ilustrasi di titik
           berbeda dan terlihat ada sambungan/potongan horizontal. Sekarang
           SEMUA salinan (.wave-copy) memakai kotak crop yang identik (extend
           -8%..-10% di luar batas panel) — bedanya cuma digeser vertikal
           lewat transform (bukan re-crop), jadi hasilnya tetap satu ilustrasi
           utuh yang ditumpuk, tanpa potongan. Buffer bawah dibuat lebih besar
           supaya air benar-benar rapat sampai dasar panel. Titik crop
           (object-position) sengaja TIDAK persis di tepi bawah gambar — tepi
           bawah asli ilustrasi wave-*.png sebagian besar transparan (jejak
           riak/busa memudar), jadi kalau dipatok pas di tepi, area transparan
           itu ikut ke-crop ke dasar kotak dan terlihat bolong/mengambang.
           Anchor digeser ke ~82% supaya yang ter-crop adalah bagian "badan"
           gelombang yang solid warnanya, bukan area kosongnya. */
        .wave-layer{
          position:absolute; left:0; right:0; bottom:0;
          overflow:hidden; z-index:4; pointer-events:none;
          transition:height .35s ease;
        }
        /* Lapisan warna air polos di paling belakang wave-layer — jaring
           pengaman kalau tepi bawah PNG wave-*.png (yang memang transparan)
           masih menyisakan celah walau sudah di-crop. Warnanya nge-blend ke
           transparan di atas supaya tidak terlihat sebagai garis tegas. */
        .wave-fallback{
          position:absolute; left:0; right:0; bottom:0; top:35%;
          background:linear-gradient(to bottom, transparent 0%, rgba(45,130,150,0.55) 35%, rgba(18,88,125,0.92) 100%);
        }
        /* Tiga salinan wave sekarang benar-benar "ditumpuk" (bukan cuma
           sedikit bergeser) — baris belakang & tengah digeser cukup jauh ke
           atas supaya beberapa gelombang terlihat sekaligus, dan baris depan
           tetap menutupi dasar panel sepenuhnya. */
        .wave-copy{ position:absolute; left:0; right:0; top:-10%; bottom:-16%; }
        .wave-copy-back{ transform:translateY(-16%); }
        .wave-copy-mid{ transform:translateY(-7%); }
        .wave-copy-front{ transform:translateY(0); }
        .wave-img{
          position:absolute; left:50%; bottom:0; width:128%; height:100%;
          object-fit:cover; object-position:center 82%;
          transform:translateX(-50%);
          transition:opacity .5s ease;
          animation:waveFlow 10s ease-in-out infinite;
          will-change:opacity, transform;
        }
        /* Tiap salinan & gambar diberi durasi/arah berbeda supaya airnya
           terlihat "berjalan" mengalir — bukan cuma naik-turun di tempat.
           Salinan depan mengalir lebih cepat (lebih dekat), salinan belakang
           lebih lambat & berlawanan arah (efek parallax). */
        .wave-copy-back .wave-img{ animation-name:waveFlowReverse; }
        .wave-copy-front .wave-img{ animation-duration:6.5s; }
        .wave-img.wave-medium{ animation-duration:9.5s; animation-delay:-3s; }
        .wave-img.wave-high{ animation-duration:6.8s; animation-delay:-1.5s; }
        @keyframes waveFlow{
          0%{ transform:translateX(-55%) translateY(0); }
          50%{ transform:translateX(-45%) translateY(-1.8%); }
          100%{ transform:translateX(-55%) translateY(0); }
        }
        @keyframes waveFlowReverse{
          0%{ transform:translateX(-45%) translateY(0); }
          50%{ transform:translateX(-55%) translateY(-1.8%); }
          100%{ transform:translateX(-45%) translateY(0); }
        }

        /* ===== Panel kontrol ===== */
        .control-panel{ background:var(--paper); border-radius:var(--radius-lg); padding:30px 26px; box-shadow:var(--shadow); border:1px solid rgba(15,36,29,0.06); }
        .control-panel h3{ font-size:1.1rem; margin-bottom:24px; }
        .slider-group{ margin-bottom:26px; }
        .slider-label{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .slider-name{ display:flex; align-items:center; gap:9px; font-size:0.94rem; font-weight:700; color:var(--canopy); }
        .slider-name .ic{ font-size:1.05rem; }
        .slider-right{ display:flex; align-items:center; gap:9px; }
        .slider-value{ font-family:'Space Mono', monospace; color:var(--estuary); background:var(--tide-pale); padding:3px 11px; border-radius:999px; font-size:0.82rem; font-weight:700; }
        .kondisi-badge{ font-size:0.72rem; font-weight:700; padding:3px 11px; border-radius:999px; }
        .kondisi-badge.good{ background:#E1F1E4; color:#2F6B57; }
        .kondisi-badge.mid{ background:#FBEEDA; color:var(--amber-deep); }
        .kondisi-badge.bad{ background:#F8E4E7; color:var(--danger); }

        input[type="range"]{
          -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px;
          background:linear-gradient(90deg, var(--estuary) var(--fill,50%), var(--tide-pale) var(--fill,50%));
          outline:none; cursor:pointer;
        }
        input[type="range"]::-webkit-slider-thumb{
          -webkit-appearance:none; width:22px; height:22px; border-radius:50%;
          background:var(--amber); border:3px solid var(--paper); box-shadow:0 3px 8px rgba(15,36,29,0.3); cursor:pointer;
        }
        input[type="range"]::-moz-range-thumb{
          width:22px; height:22px; border-radius:50%; background:var(--amber); border:3px solid var(--paper);
          box-shadow:0 3px 8px rgba(15,36,29,0.3); cursor:pointer;
        }
        .slider-scale{ display:flex; justify-content:space-between; font-size:0.72rem; color:#8A9A93; margin-top:7px; }

        .control-actions{ display:flex; flex-direction:column; gap:11px; margin-top:6px; }
        .control-actions .btn{ justify-content:center; }
        .experiment-note{ margin-top:14px; font-size:0.78rem; color:#7A8A83; text-align:center; }

        /* ===== Hasil pengamatan ===== */
        .obs-panel{ margin-top:44px; background:var(--paper); border-radius:var(--radius-lg); padding:34px 30px; box-shadow:var(--shadow); border:1px solid rgba(15,36,29,0.06); }
        .obs-panel h2{ font-size:1.45rem; margin-top:10px; }
        .obs-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin:22px 0; }
        .obs-card{ background:var(--sand); border-radius:16px; padding:18px 20px; display:flex; align-items:center; gap:14px; }
        .obs-card .obs-ic{ width:42px; height:42px; border-radius:12px; background:var(--tide-pale); display:flex; align-items:center; justify-content:center; font-size:1.3rem; }
        .obs-card small{ display:block; font-size:0.72rem; color:#7A8A83; }
        .obs-card b{ font-family:'Fraunces', serif; font-size:1.3rem; color:var(--canopy); }
        .obs-card .obs-sub{ margin-top:2px; color:#8A9A93; }
        .obs-card .obs-kondisi{ margin-left:auto; }
        .obs-desc{ font-size:0.95rem; color:#33473F; line-height:1.7; background:var(--tide-pale); border-radius:16px; padding:18px 20px; }

        /* ===== Hubungan sebab-akibat ===== */
        .causal-panel{ margin-top:26px; background:var(--paper); border-radius:var(--radius-lg); padding:34px 30px; box-shadow:var(--shadow); border:1px solid rgba(15,36,29,0.06); }
        .causal-panel h2{ font-size:1.45rem; margin-top:10px; }
        .causal-flow{ display:flex; flex-direction:column; align-items:center; gap:6px; margin-top:24px; max-width:560px; margin-left:auto; margin-right:auto; }
        .causal-node{
          width:100%; display:flex; align-items:center; gap:14px; background:var(--sand);
          border-radius:16px; padding:14px 16px; border:1px solid rgba(15,36,29,0.05);
        }
        .causal-icon{ width:44px; height:44px; border-radius:12px; background:var(--paper); display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0; box-shadow:0 4px 10px -6px rgba(15,36,29,0.3); }
        .causal-body{ flex:1; min-width:0; }
        .causal-label{ display:block; font-size:0.82rem; font-weight:700; color:var(--canopy); margin-bottom:7px; }
        .causal-bar{ height:10px; border-radius:99px; background:var(--sand-deep); overflow:hidden; margin-bottom:7px; }
        .causal-fill{ height:100%; border-radius:99px; transition:width .45s ease; }
        .causal-node.tone-good .causal-fill{ background:var(--estuary); }
        .causal-node.tone-mid .causal-fill{ background:var(--amber); }
        .causal-node.tone-bad .causal-fill{ background:var(--danger); }
        .causal-meta{ display:flex; align-items:baseline; gap:8px; }
        .causal-meta b{ font-family:'Fraunces', serif; font-size:1.02rem; color:var(--canopy); }
        .causal-meta span{ font-size:0.76rem; color:#7A8A83; }
        .causal-arrow{ font-size:1.25rem; color:var(--tide); line-height:1; padding:2px 0; }

        /* ===== Coba amati ===== */
        .note-panel{ margin-top:26px; background:linear-gradient(135deg,#FBEEDA 0%,#F6F0DC 100%); border:1px solid rgba(206,131,36,0.25); border-radius:var(--radius-lg); padding:28px 30px; }
        .note-panel h2{ font-size:1.2rem; margin-bottom:14px; display:flex; align-items:center; gap:9px; }
        .note-list{ list-style:none; display:flex; flex-direction:column; gap:11px; }
        .note-list li{ display:flex; gap:10px; font-size:0.93rem; color:#4C5340; line-height:1.5; }
        .note-list li::before{ content:"•"; color:var(--amber-deep); font-weight:700; }

        @media (max-width:960px){
          .lab-grid{ grid-template-columns:1fr; }
          .viz-panel{ order:2; height:360px; }
          .control-panel{ order:1; }
          .obs-grid{ grid-template-columns:1fr; }
          .page-banner{ min-height:50vh; }
        }
        @media (max-width:600px){
          .container{ padding:0 20px; }
          .viz-panel{ height:300px; }
        }
      `}</style>

      <Navbar />

      <section className="page-banner">
        <div className="container">
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Laboratorium Virtual</span>
          <h1 className="reveal">Lab Virtual Mangrove</h1>
          <p className="reveal">
            Lakukan eksperimen virtual dengan mengatur kerapatan mangrove dan tinggi gelombang, lalu amati perubahan kondisi pesisir.
          </p>
        </div>
        <WaveDividerLocal fill="var(--sand)" />
      </section>

      <section className="lab-main">
        <div className="container">
          <div className="lab-grid">
            {/* ================= PANEL KONTROL ================= */}
            <div className="control-panel reveal">
              <h3>Atur Variabel</h3>

              <div className="slider-group">
                <div className="slider-label">
                  <span className="slider-name"><span className="ic">🌱</span>Kerapatan Mangrove</span>
                  <span className="slider-right">
                    <span className={`kondisi-badge ${toneOfLevel(densityK, true)}`}>{densityK}</span>
                    <span className="slider-value">{density}%</span>
                  </span>
                </div>
                <input
                  type="range" min="0" max="100" value={density}
                  style={{ "--fill": `${density}%` }}
                  onChange={(e) => setDensity(Number(e.target.value))}
                />
                <div className="slider-scale"><span>Jarang (&lt;50%)</span><span>Sedang</span><span>Padat (≥75%)</span></div>
              </div>

              <div className="slider-group">
                <div className="slider-label">
                  <span className="slider-name"><span className="ic">🌊</span>Tinggi Gelombang</span>
                  <span className="slider-right">
                    <span className={`kondisi-badge ${toneOfLevel(waveK, false)}`}>{waveK}</span>
                    <span className="slider-value">{waveHeight}%</span>
                  </span>
                </div>
                <input
                  type="range" min="0" max="100" value={waveHeight}
                  style={{ "--fill": `${waveHeight}%` }}
                  onChange={(e) => setWaveHeight(Number(e.target.value))}
                />
                <div className="slider-scale"><span>Rendah</span><span>Sedang</span><span>Tinggi</span></div>
              </div>

              <div className="control-actions">
                <button className="btn btn-outline" onClick={handleReset}>↻ Atur Ulang</button>
                <button className="btn btn-primary" onClick={handleTryOther}>🔬 Coba Kondisi Lain</button>
              </div>
              {experimentCount > 0 && (
                <p className="experiment-note">Sudah mencatat {experimentCount} percobaan di perangkat ini.</p>
              )}
            </div>

            {/* ================= VISUALISASI UTAMA ================= */}
            <div className="viz-panel reveal">
              <div className="viz-readout">
                <span>Kerapatan: {density}%</span>
                <span>Gelombang: {waveHeight}%</span>
                <span className={`protect ${protectionTone}`}>Perlindungan: {protection}</span>
              </div>

              {/* background.png — latar area simulasi */}
              <img src={backgroundImg} className="viz-bg" alt="" />

              {/* mangrove.png — muncul satu per satu mengikuti kerapatan */}
              <div className="mangrove-layer">
                {TREE_SLOTS.slice(0, pohonCount).map((slot, i) => (
                  <img
                    key={i}
                    src={mangroveImg}
                    className="mangrove-tree"
                    alt=""
                    style={{
                      left: `${slot.left}%`,
                      bottom: `${slot.bottom}%`,
                      height: `${(TREE_BASE * slot.scale).toFixed(1)}%`,
                      "--rot": `${slot.rotate}deg`,
                      animationDelay: `${i * 70}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Wave PNG — tiga salinan bertumpuk (kotak crop identik, cuma
                  digeser transform) + tiga ilustrasi di-crossfade lewat
                  opacity inline. Tinggi area mengikuti slider "Tinggi
                  Gelombang". */}
              <div className="wave-layer" style={{ height: `${waveLayerHeight}%` }}>
                <div className="wave-fallback" />
                {waveDepths.map((depth) => (
                  <div key={depth.className} className={`wave-copy ${depth.className}`}>
                    <img src={waveLowImg} className="wave-img wave-low" alt="" style={{ opacity: waveMix.low * depth.opacityScale }} />
                    <img src={waveMediumImg} className="wave-img wave-medium" alt="" style={{ opacity: waveMix.medium * depth.opacityScale }} />
                    <img src={waveHighImg} className="wave-img wave-high" alt="" style={{ opacity: waveMix.high * depth.opacityScale }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= HASIL PENGAMATAN ================= */}
          <div className="obs-panel reveal">
            <span className="eyebrow">🔎 Hasil Pengamatan</span>
            <h2>Apa yang terlihat dari kombinasimu?</h2>

            <div className="obs-grid">
              <div className="obs-card">
                <div className="obs-ic">🌱</div>
                <div>
                  <small>Kerapatan Mangrove</small>
                  <b>{density}%</b>
                  <small className="obs-sub">Kriteria: {densityKriteria(density)} (standar tutupan hutan mangrove)</small>
                </div>
                <span className={`kondisi-badge obs-kondisi ${toneOfLevel(densityK, true)}`}>{densityK}</span>
              </div>
              <div className="obs-card">
                <div className="obs-ic">🌊</div>
                <div>
                  <small>Tinggi Gelombang</small>
                  <b>{waveHeight}%</b>
                </div>
                <span className={`kondisi-badge obs-kondisi ${toneOfLevel(waveK, false)}`}>{waveK}</span>
              </div>
            </div>

            <p className="obs-desc">{observation}</p>
          </div>

          {/* ================= HUBUNGAN SEBAB-AKIBAT ================= */}
          <div className="causal-panel reveal">
            <span className="eyebrow">🔗 Hubungan yang Diamati</span>
            <h2>Dari mangrove ke risiko abrasi</h2>

            <div className="causal-flow">
              <CausalNode icon="🌱" label="Kerapatan Mangrove" value={`${density}%`} note={`kondisi ${densityK.toLowerCase()}`} fill={density} tone={toneOfLevel(densityK, true)} />
              <div className="causal-arrow">↓</div>
              <CausalNode icon="🛡️" label="Kemampuan Perlindungan Pesisir" value={protection} note={`dari kerapatan ${density}%`} fill={density} tone={protectionTone} />
              <div className="causal-arrow">↓</div>
              <CausalNode icon="🌊" label="Dampak Gelombang" value={`${waveHeight}%`} note={`kondisi ${waveK.toLowerCase()}`} fill={waveHeight} tone={toneOfLevel(waveK, false)} />
              <div className="causal-arrow">↓</div>
              <CausalNode icon="🏖️" label="Risiko Abrasi" value={`${abrasionScore}%`} note={`kondisi ${abrasionK.toLowerCase()}`} fill={abrasionScore} tone={toneOfLevel(abrasionK, false)} />
            </div>
          </div>

          {/* ================= CATATAN EDUKATIF ================= */}
          <div className="note-panel reveal">
            <h2>💡 Coba Amati</h2>
            <ul className="note-list">
              <li>Bagaimana perubahan kerapatan mangrove ketika tinggi gelombang tetap?</li>
              <li>Bagaimana perubahan gelombang ketika kerapatan mangrove tetap?</li>
              <li>Apa yang terjadi ketika mangrove semakin jarang dan gelombang semakin tinggi?</li>
            </ul>
          </div>
        </div>
      </section>

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