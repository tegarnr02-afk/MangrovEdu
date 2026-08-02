import React, { useState, useMemo, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot,
} from "recharts";
import {
  Home, BookOpen, FlaskConical, HelpCircle, LayoutDashboard, Menu, X,
  Waves, Bird, Fish, Droplets, ChevronRight, ChevronDown,
  Play, CheckCircle2, Circle, Trash2, AlertTriangle, Leaf, Shell,
  BarChart3, ArrowRight,
} from "lucide-react";

/* ============================== DATA ============================== */

const MATERI_LIST = [
  { id: "materi1", title: "Ekosistem Mangrove", num: "01" },
  { id: "materi2", title: "Interaksi dalam Ekosistem", num: "02" },
  { id: "materi3", title: "Perubahan Lingkungan", num: "03" },
  { id: "materi4", title: "Abrasi Pantai", num: "04" },
  { id: "materi5", title: "Konservasi Mangrove", num: "05" },
];

const NAV_ITEMS = [
  { id: "beranda", label: "Beranda", icon: Home },
  { id: "materi", label: "Materi", icon: BookOpen },
  { id: "lab", label: "Lab Virtual", icon: FlaskConical },
  { id: "kuis", label: "Kuis", icon: HelpCircle },
  { id: "dasbor", label: "Dasbor", icon: LayoutDashboard },
];

const HOTSPOTS = [
  { id: "mangrove", x: 22, y: 40, kind: "biotik", label: "Pohon Mangrove",
    desc: "Produsen utama ekosistem. Akarnya yang menjulang (akar napas) membantu menahan lumpur dan meredam gelombang, sekaligus jadi tempat berlindung banyak hewan kecil." },
  { id: "kepiting", x: 30, y: 66, kind: "biotik", label: "Kepiting",
    desc: "Konsumen tingkat I. Hidup di sela akar mangrove, memakan serasah daun yang gugur dan membantu mempercepat penguraian bahan organik di lumpur." },
  { id: "ikan", x: 58, y: 58, kind: "biotik", label: "Ikan",
    desc: "Konsumen tingkat II. Kawasan akar mangrove jadi 'ruang asuh' (nursery ground) bagi anakan ikan sebelum mereka pindah ke laut lepas." },
  { id: "burung", x: 70, y: 20, kind: "biotik", label: "Burung",
    desc: "Konsumen tingkat atas. Bertengger dan bersarang di kanopi mangrove, berburu ikan dan kepiting kecil di sekitar akar." },
  { id: "air-laut", x: 82, y: 72, kind: "abiotik", label: "Air Laut",
    desc: "Membawa nutrien dan mengatur kadar garam (salinitas) di sekitar akar. Pasang-surutnya menentukan kapan area mangrove terendam." },
  { id: "tanah", x: 12, y: 82, kind: "abiotik", label: "Tanah / Lumpur",
    desc: "Substrat berlumpur kaya bahan organik. Miskin oksigen, sehingga mangrove punya struktur akar khusus untuk tetap bisa bernapas." },
  { id: "cahaya", x: 88, y: 10, kind: "abiotik", label: "Cahaya Matahari",
    desc: "Sumber energi untuk fotosintesis mangrove, sekaligus mempengaruhi suhu air dan lumpur di sekitarnya." },
  { id: "salinitas", x: 46, y: 30, kind: "abiotik", label: "Salinitas",
    desc: "Kadar garam yang berubah-ubah karena percampuran air tawar dan air laut. Hanya tumbuhan khusus seperti mangrove yang mampu bertahan di kondisi ini." },
];

const FOOD_CHAIN = [
  { id: "produsen", label: "Mangrove", role: "Produsen", icon: Leaf,
    desc: "Mengubah cahaya matahari menjadi energi lewat fotosintesis. Semua energi dalam rantai makanan ini bermula dari sini." },
  { id: "k1", label: "Kepiting / Siput", role: "Konsumen I", icon: Shell,
    desc: "Memakan serasah daun mangrove dan produsen lain secara langsung." },
  { id: "k2", label: "Ikan", role: "Konsumen II", icon: Fish,
    desc: "Memakan kepiting kecil, siput, dan hewan konsumen tingkat I lainnya." },
  { id: "k3", label: "Burung Pemangsa", role: "Konsumen III", icon: Bird,
    desc: "Predator puncak yang memangsa ikan di sekitar perairan mangrove." },
  { id: "pengurai", label: "Bakteri & Jamur", role: "Pengurai", icon: Droplets,
    desc: "Menguraikan sisa organisme mati menjadi nutrien, yang kembali menyuburkan tanah tempat mangrove tumbuh." },
];

const CAUSE_EFFECT = [
  { id: "tebang", cause: "Penebangan Mangrove",
    effects: ["Garis pantai kehilangan penahan gelombang alami", "Habitat ikan & kepiting muda hilang", "Abrasi pantai makin cepat terjadi"] },
  { id: "cemar", cause: "Pencemaran (limbah & sampah)",
    effects: ["Kualitas air menurun, organisme sulit bertahan hidup", "Akar mangrove tertutup sedimen/sampah, sulit bernapas", "Rantai makanan terganggu dari produsen ke atas"] },
  { id: "bangun", cause: "Pembangunan Kawasan Pesisir",
    effects: ["Lahan mangrove beralih fungsi jadi tambak/pemukiman", "Aliran air tawar-asin alami terganggu", "Luas ekosistem mangrove terus menyusut"] },
];

const QUIZ = [
  { id: "q1", type: "mc", q: "Jika seluruh pohon mangrove di suatu kawasan ditebang, apa yang paling mungkin terjadi pada risiko abrasi pantai?",
    options: ["Risiko abrasi menurun karena air jadi lebih mudah mengalir", "Risiko abrasi meningkat karena penahan gelombang alami hilang", "Tidak ada pengaruh sama sekali terhadap abrasi", "Abrasi hanya dipengaruhi oleh angin, bukan vegetasi"], correct: 1 },
  { id: "q2", type: "mc", q: "Dalam rantai makanan mangrove, apa peran bakteri dan jamur?",
    options: ["Produsen yang berfotosintesis", "Konsumen puncak yang memangsa burung", "Pengurai yang mengembalikan nutrien ke tanah", "Predator utama bagi kepiting"], correct: 2 },
  { id: "q3", type: "mc", q: "Mengapa kerapatan mangrove yang tinggi cenderung menghasilkan kondisi pesisir yang lebih stabil?",
    options: ["Karena akar mangrove tidak berhubungan dengan gelombang", "Karena akar yang rapat meredam energi gelombang dan menahan sedimen", "Karena mangrove mengubah arah angin laut", "Karena mangrove menyerap seluruh air laut di sekitarnya"], correct: 1 },
  { id: "q4", type: "mc", q: "Sebuah kawasan pesisir kehilangan sebagian besar hutan mangrovenya akibat pembangunan tambak. Apa dampak jangka panjang yang paling mungkin?",
    options: ["Populasi ikan muda meningkat drastis", "Garis pantai makin stabil karena tambak menahan air", "Habitat asuh ikan berkurang dan abrasi meningkat", "Salinitas air menjadi konstan sepanjang tahun"], correct: 2 },
  { id: "q5", type: "mc", q: "Manakah pasangan sebab-akibat yang paling tepat menjelaskan hubungan dalam ekosistem mangrove?",
    options: ["Cahaya matahari berkurang → salinitas air laut naik drastis", "Pencemaran air → akar mangrove tertutup sedimen → penyerapan nutrien terganggu", "Populasi burung meningkat → jumlah pohon mangrove otomatis berkurang", "Air laut surut → seluruh kepiting mati seketika"], correct: 1 },
  { id: "q6", type: "essay",
    q: "Jelaskan dengan kata-katamu sendiri: jika kerapatan mangrove di suatu desa pesisir menurun drastis dalam 10 tahun terakhir, rangkaian sebab-akibat apa saja yang mungkin terjadi terhadap ekosistem dan masyarakat sekitar? (Hubungkan minimal 3 komponen)" },
];

/* ============================== HELPERS ============================== */

function classifyRisk(v) {
  if (v < 33) return "rendah";
  if (v < 66) return "sedang";
  return "tinggi";
}
function riskColor(level) {
  return level === "rendah" ? "var(--ok)" : level === "sedang" ? "var(--warn)" : "var(--danger)";
}
function runSimulation(density, wave) {
  const peredaman = Math.round(Math.min(100, density * 0.9 + 10));
  const abrasi = Math.round(Math.max(0, Math.min(100, 95 - density * 0.75 + wave * 22)));
  const stabilitas = Math.round(Math.max(0, Math.min(100, density * 0.8 - wave * 15 + 20)));
  return {
    peredaman: classifyRisk(peredaman === 100 ? 99 : 100 - peredaman) === "rendah" ? "tinggi" : (peredaman > 66 ? "tinggi" : peredaman > 33 ? "sedang" : "rendah"),
    abrasi: classifyRisk(abrasi),
    kondisi: stabilitas > 66 ? "stabil" : stabilitas > 33 ? "cukup stabil" : "tidak stabil",
    raw: { peredaman, abrasi, stabilitas },
  };
}
function curveData(wave) {
  const pts = [];
  for (let d = 0; d <= 100; d += 10) {
    const abrasi = Math.round(Math.max(0, Math.min(100, 95 - d * 0.75 + wave * 22)));
    pts.push({ density: d, abrasi });
  }
  return pts;
}

/* ============================== SMALL UI PIECES ============================== */

function RootDivider() {
  return (
    <svg className="root-divider" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 20 C 60 5, 100 35, 160 18 S 260 2, 320 22 S 440 36, 500 16 S 580 6, 600 20"
        fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M120 18 C 130 30, 140 34, 150 40 M320 22 C 330 10, 335 6, 345 2 M460 18 C 470 30, 478 34, 486 40"
        fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
    </svg>
  );
}

function Eyebrow({ children, className = "" }) {
  return <div className={`eyebrow ${className}`}>{children}</div>;
}

function SectionHeader({ eyebrow, title, blurb }) {
  return (
    <div className="section-header">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2>{title}</h2>
      {blurb && <p className="blurb">{blurb}</p>}
      <RootDivider />
    </div>
  );
}

function ProgressPip({ done }) {
  return done
    ? <CheckCircle2 size={16} className="pip pip-done" />
    : <Circle size={16} className="pip" />;
}

/* ============================== PAGES ============================== */

const TUJUAN_PEMBELAJARAN = [
  { icon: "🌱", text: "Memahami komponen biotik dan abiotik dalam ekosistem mangrove." },
  { icon: "🔗", text: "Menjelaskan interaksi antara komponen biotik dan abiotik." },
  { icon: "🌊", text: "Menganalisis dampak perubahan lingkungan terhadap ekosistem mangrove." },
  { icon: "🏖️", text: "Memahami hubungan kerapatan mangrove dengan tingkat abrasi pantai." },
];

const PETUNJUK_STEPS = [
  { n: 1, label: "Materi", desc: "Baca lima materi dasar" },
  { n: 2, label: "Lab Virtual", desc: "Coba simulasi interaktif" },
  { n: 3, label: "Simulasi", desc: "Lihat hasil & grafik" },
  { n: 4, label: "Kuis", desc: "Uji pemahamanmu" },
  { n: 5, label: "Dasbor", desc: "Pantau progres belajar" },
];

const FEATURE_CARDS = [
  { id: "materi", icon: BookOpen, title: "Materi", desc: "5 sub-materi: Ekosistem, Interaksi, Perubahan Lingkungan, Abrasi, Konservasi.", cta: "Buka Materi", view: "materi" },
  { id: "labv", icon: FlaskConical, title: "Lab Virtual", desc: "Atur slider kerapatan mangrove & tinggi gelombang.", cta: "Buka Lab", view: "lab" },
  { id: "simulasi", icon: BarChart3, title: "Simulasi", desc: "Lihat hasil simulasi lengkap dengan grafik.", cta: "Buka Simulasi", view: "lab" },
  { id: "kuisc", icon: HelpCircle, title: "Kuis", desc: "Kerjakan kuis berpikir kausal untuk cek pemahaman.", cta: "Mulai Kuis", view: "kuis" },
  { id: "dasborc", icon: LayoutDashboard, title: "Dasbor", desc: "Pantau progres dan hasil belajarmu.", cta: "Lihat Dasbor", view: "dasbor" },
];

function Reveal({ children, delay = 0, className = "", as = "div", ...rest }) {
  const ref = React.useRef(null);
  const [inView, setInView] = useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { setInView(true); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} className={`mgd-reveal ${inView ? "mgd-in-view" : ""} ${className}`} style={{ transitionDelay: `${delay}s` }} {...rest}>
      {children}
    </Tag>
  );
}

function Beranda({ go, progress }) {
  return (
    <div className="page beranda mgd">
      {/* 1. HERO */}
      <section className="mgd-hero">
        <img
          className="mgd-hero-img"
          alt="Ekosistem mangrove"
          src="https://images.pexels.com/photos/36405819/pexels-photo-36405819.jpeg?auto=compress&cs=tinysrgb&w=1920"
        />
        <div className="mgd-hero-overlay" />
        <div className="mgd-hero-inner">
          <Reveal className="mgd-hero-copy">
            <p className="mgd-eyebrow">Belajar sebab &amp; akibat lewat alam</p>
            <h1 className="mgd-hero-title">Mangrov<span className="mgd-hero-title-i">Edu</span></h1>
            <p className="mgd-hero-desc">
              Jelajahi ekosistem mangrove melalui materi, laboratorium virtual, simulasi,
              kuis berpikir kausal, dan dasbor perkembangan belajar.
            </p>
            <div className="mgd-cta-row">
              <button className="mgd-btn-primary" onClick={() => go("materi")}>Mulai Belajar</button>
              <button className="mgd-btn-outline" onClick={() => go("lab")}>Eksplorasi Lab</button>
            </div>
          </Reveal>
        </div>
        <svg className="mgd-tide-divider" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,48 C240,90 480,0 720,24 C960,48 1200,84 1440,32 L1440,90 L0,90 Z" fill="#F5EFDF" />
        </svg>
      </section>

      {/* 2. TENTANG WEBSITE */}
      <section className="mgd-about">
        <Reveal><p className="mgd-section-eyebrow mgd-center">Tentang Platform</p></Reveal>
        <Reveal><h2 className="mgd-section-title mgd-center">Ruang belajar untuk siswa <em>SMP kelas VII</em></h2></Reveal>
        <Reveal>
          <p className="mgd-about-text">
            MangrovEdu dirancang khusus untuk siswa SMP kelas VII agar dapat memahami ekosistem
            mangrove secara menyenangkan. Lewat materi, laboratorium virtual, dan simulasi interaktif,
            kamu diajak berpikir sebab-akibat tentang bagaimana mangrove menjaga keseimbangan lingkungan pesisir.
          </p>
        </Reveal>
      </section>

      {/* 3. TUJUAN PEMBELAJARAN */}
      <section className="mgd-goals">
        <div className="mgd-goals-inner">
          <Reveal><p className="mgd-section-eyebrow mgd-center mgd-eyebrow-light">Capaian Belajar</p></Reveal>
          <Reveal><h2 className="mgd-section-title mgd-center mgd-title-light">Tujuan Pembelajaran</h2></Reveal>
          <div className="mgd-goals-grid">
            {TUJUAN_PEMBELAJARAN.map((t, i) => (
              <Reveal key={i} delay={i * 0.08} className="mgd-goal-card">
                <span className="mgd-goal-icon">{t.icon}</span>
                <p>{t.text}</p>
              </Reveal>
            ))}
            <Reveal delay={0.32} className="mgd-goal-card mgd-goal-card-wide">
              <span className="mgd-goal-icon">🌳</span>
              <p>Menumbuhkan kesadaran dan sikap peduli terhadap upaya konservasi mangrove.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. PETUNJUK PENGGUNAAN */}
      <section className="mgd-steps">
        <Reveal><p className="mgd-section-eyebrow mgd-center">Alur Belajar</p></Reveal>
        <Reveal><h2 className="mgd-section-title mgd-center">Petunjuk Penggunaan</h2></Reveal>
        <div className="mgd-steps-wrap">
          <div className="mgd-steps-track" />
          <div className="mgd-steps-grid">
            {PETUNJUK_STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1} className="mgd-step">
                <div className="mgd-step-node">{s.n}</div>
                <h3>{s.label}</h3>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MENU / FITUR UTAMA */}
      <section className="mgd-menu">
        <Reveal><p className="mgd-section-eyebrow mgd-center">Fitur Utama</p></Reveal>
        <Reveal><h2 className="mgd-section-title mgd-center">Menu Utama</h2></Reveal>
        <div className="mgd-menu-grid">
          {FEATURE_CARDS.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.06} as="button" className="mgd-menu-card" onClick={() => go(m.view)}>
              <span className="mgd-menu-icon"><m.icon size={24} /></span>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
              <span className="mgd-menu-cta">{m.cta} <ArrowRight size={14} /></span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Daftar sub-materi */}
      <section className="mgd-materi-list">
        <Reveal><h2 className="mgd-section-title mgd-left">Daftar Materi Pembelajaran</h2></Reveal>
        <div className="mgd-materi-grid">
          {MATERI_LIST.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.05} as="button" className="mgd-materi-card" onClick={() => go("materi", m.id)}>
              <span className="mgd-materi-num">{m.num}</span>
              <h3>{m.title}</h3>
              {progress.visited.has(m.id) && (
                <span className="mgd-materi-done"><CheckCircle2 size={13} /> Sudah dibaca</span>
              )}
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function InfoModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Tutup"><X size={18} /></button>
        <span className={`tag tag-${item.kind || "info"}`}>{item.kind === "biotik" ? "Komponen Biotik" : item.kind === "abiotik" ? "Komponen Abiotik" : item.role}</span>
        <h3>{item.label}</h3>
        <p>{item.desc}</p>
      </div>
    </div>
  );
}

function Materi1() {
  const [active, setActive] = useState(null);
  return (
    <div className="page materi-page">
      <SectionHeader eyebrow="Materi 01" title="Ekosistem Mangrove"
        blurb="Ekosistem mangrove adalah kawasan pesisir tempat bertemunya darat dan laut. Klik penanda pada ilustrasi untuk mengenal komponen biotik dan abiotiknya." />
      <div className="hotspot-wrap">
        <svg className="hotspot-illustration" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <rect width="100" height="100" fill="#EAD9B0" />
          <rect y="55" width="100" height="45" fill="#5F9C8C" />
          <rect y="88" width="100" height="12" fill="#7A5B39" opacity="0.5" />
          <circle cx="88" cy="12" r="7" fill="#E9B44C" />
          {[20, 45, 68].map((x, i) => (
            <g key={i}>
              <rect x={x - 1.5} y={38} width="3" height="22" fill="#3E2E1F" />
              <circle cx={x} cy={34} r="12" fill="#245C4E" />
              <circle cx={x - 7} cy={40} r="8" fill="#2E6E5C" />
              <circle cx={x + 7} cy={40} r="8" fill="#1F5346" />
            </g>
          ))}
        </svg>
        {HOTSPOTS.map((h) => (
          <button key={h.id} className={`hotspot hotspot-${h.kind}`} style={{ left: `${h.x}%`, top: `${h.y}%` }}
            onClick={() => setActive(h)} aria-label={h.label} title={h.label}>
            <span className="hotspot-dot" />
          </button>
        ))}
      </div>
      <div className="legend">
        <span><i className="dot dot-biotik" /> Komponen Biotik</span>
        <span><i className="dot dot-abiotik" /> Komponen Abiotik</span>
      </div>
      <InfoModal item={active} onClose={() => setActive(null)} />
    </div>
  );
}

function Materi2() {
  const [active, setActive] = useState(null);
  const [removed, setRemoved] = useState(false);
  return (
    <div className="page materi-page">
      <SectionHeader eyebrow="Materi 02" title="Interaksi dalam Ekosistem"
        blurb="Setiap makhluk hidup di mangrove terhubung lewat rantai makanan. Klik tiap organisme untuk melihat perannya." />
      <div className="foodchain">
        {FOOD_CHAIN.map((n, i) => (
          <React.Fragment key={n.id}>
            <button
              className={`chain-node ${removed && n.id === "produsen" ? "chain-node-removed" : ""}`}
              onClick={() => setActive(n)}
            >
              <n.icon size={22} />
              <span className="chain-role">{n.role}</span>
              <span className="chain-label">{n.label}</span>
            </button>
            {i < FOOD_CHAIN.length - 1 && <ChevronRight className="chain-arrow" size={20} />}
          </React.Fragment>
        ))}
      </div>

      <div className="chain-toggle">
        <button className={`btn ${removed ? "btn-danger" : "btn-outline"}`} onClick={() => setRemoved((r) => !r)}>
          <Trash2 size={16} /> {removed ? "Kembalikan Mangrove" : "Hilangkan Salah Satu Komponen: Mangrove"}
        </button>
        {removed && (
          <div className="cascade-warning">
            <AlertTriangle size={18} />
            <p>
              Tanpa mangrove sebagai produsen, kepiting &amp; siput kehilangan sumber makanan utama →
              populasi ikan menurun karena mangsanya berkurang → burung pemangsa kesulitan mencari ikan →
              pengurai kehilangan sisa organisme dari seluruh rantai. Satu komponen hilang, seluruh rantai terguncang.
            </p>
          </div>
        )}
      </div>

      <InfoModal item={active} onClose={() => setActive(null)} />
    </div>
  );
}

function Materi3() {
  const [openId, setOpenId] = useState(CAUSE_EFFECT[0].id);
  return (
    <div className="page materi-page">
      <SectionHeader eyebrow="Materi 03" title="Perubahan Lingkungan"
        blurb="Perubahan lingkungan mangrove terjadi karena faktor alam maupun aktivitas manusia. Klik tiap sebab untuk melihat rangkaian akibatnya." />
      <div className="cause-effect">
        {CAUSE_EFFECT.map((c) => (
          <div key={c.id} className={`ce-item ${openId === c.id ? "ce-open" : ""}`}>
            <button className="ce-cause" onClick={() => setOpenId(openId === c.id ? null : c.id)}>
              <AlertTriangle size={18} />
              <span>{c.cause}</span>
              <ChevronDown size={16} className="ce-chev" />
            </button>
            {openId === c.id && (
              <ol className="ce-effects">
                {c.effects.map((e, i) => <li key={i}>{e}</li>)}
              </ol>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Materi4() {
  return (
    <div className="page materi-page">
      <SectionHeader eyebrow="Materi 04" title="Abrasi Pantai"
        blurb="Pengikisan daratan pesisir oleh tenaga gelombang laut." />
      <div className="content-grid">
        <div className="content-card">
          <h4>Penyebab</h4>
          <ul>
            <li>Hilangnya vegetasi pelindung pantai seperti mangrove</li>
            <li>Gelombang dan arus laut yang kuat</li>
            <li>Kenaikan permukaan air laut</li>
            <li>Aktivitas manusia: penambangan pasir, pembangunan di garis pantai</li>
          </ul>
        </div>
        <div className="content-card">
          <h4>Proses Terjadinya</h4>
          <p>Gelombang terus-menerus menghantam garis pantai. Tanpa akar mangrove yang menahan sedimen, partikel tanah terkikis dan terbawa arus, membuat garis pantai perlahan mundur ke daratan.</p>
        </div>
        <div className="content-card">
          <h4>Dampak</h4>
          <ul>
            <li>Hilangnya lahan dan bangunan di kawasan pesisir</li>
            <li>Rusaknya habitat biota laut dekat pantai</li>
            <li>Masyarakat pesisir kehilangan mata pencaharian (nelayan, tambak)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Materi5() {
  return (
    <div className="page materi-page">
      <SectionHeader eyebrow="Materi 05" title="Konservasi Mangrove"
        blurb="Menjaga mangrove berarti menjaga pelindung alami pesisir." />
      <div className="content-grid">
        <div className="content-card">
          <h4>Fungsi Mangrove</h4>
          <ul>
            <li>Pelindung pantai dari gelombang dan abrasi</li>
            <li>Habitat &amp; tempat asuh berbagai organisme laut</li>
            <li>Penyerap karbon (blue carbon) untuk mitigasi perubahan iklim</li>
          </ul>
        </div>
        <div className="content-card">
          <h4>Upaya Rehabilitasi</h4>
          <ul>
            <li>Penanaman bibit mangrove di kawasan yang terdegradasi</li>
            <li>Pemantauan kualitas air dan pertumbuhan bibit secara berkala</li>
            <li>Pelibatan masyarakat lokal sebagai penjaga kawasan</li>
          </ul>
        </div>
        <div className="content-card">
          <h4>Peran Kita</h4>
          <p>Konservasi bukan cuma soal menanam pohon — tapi juga menahan diri dari aktivitas yang merusak, dan menyebarkan pemahaman seperti yang sedang kamu pelajari sekarang.</p>
        </div>
      </div>
    </div>
  );
}

function MateriHub({ activeId, setActiveId }) {
  const pages = { materi1: Materi1, materi2: Materi2, materi3: Materi3, materi4: Materi4, materi5: Materi5 };
  const Active = pages[activeId];
  return (
    <div className="materi-hub">
      <aside className="materi-side">
        {MATERI_LIST.map((m) => (
          <button key={m.id} className={`side-link ${activeId === m.id ? "side-link-active" : ""}`} onClick={() => setActiveId(m.id)}>
            <span className="side-num">{m.num}</span>{m.title}
          </button>
        ))}
      </aside>
      <div className="materi-content"><Active /></div>
    </div>
  );
}

function LabVirtual({ onExperiment }) {
  const [density, setDensity] = useState(50);
  const [wave, setWave] = useState(1);
  const [result, setResult] = useState(null);

  const handleRun = () => {
    const r = runSimulation(density, wave);
    setResult(r);
    onExperiment();
  };
  const data = useMemo(() => curveData(wave), [wave]);

  return (
    <div className="page lab-page">
      <SectionHeader eyebrow="Lab Virtual" title="Simulasi Kerapatan Mangrove vs. Gelombang"
        blurb="Geser dua variabel ini, lalu jalankan simulasi untuk melihat dampaknya terhadap pantai." />

      <div className="lab-grid">
        <div className="lab-controls">
          <div className="control">
            <label>Kerapatan Mangrove <span className="mono">{density}%</span></label>
            <input type="range" min="0" max="100" value={density} onChange={(e) => { setDensity(+e.target.value); setResult(null); }} />
          </div>
          <div className="control">
            <label>Tinggi Gelombang <span className="mono">{wave.toFixed(1)} m</span></label>
            <input type="range" min="0" max="3" step="0.1" value={wave} onChange={(e) => { setWave(+e.target.value); setResult(null); }} />
          </div>
          <button className="btn btn-primary btn-block" onClick={handleRun}><Play size={16} /> Jalankan Simulasi</button>
        </div>

        <div className="lab-visual">
          <LabIllustration density={density} wave={wave} />
        </div>
      </div>

      {result && (
        <>
          <RootDivider />
          <section className="result-section">
            <Eyebrow>Hasil Simulasi</Eyebrow>
            <div className="result-cards">
              <div className="result-card">
                <span className="result-label">Peredaman Gelombang</span>
                <span className="result-value" style={{ color: riskColor(result.peredaman === "tinggi" ? "rendah" : result.peredaman === "sedang" ? "sedang" : "tinggi") }}>
                  {result.peredaman}
                </span>
              </div>
              <div className="result-card">
                <span className="result-label">Risiko Abrasi</span>
                <span className="result-value" style={{ color: riskColor(result.abrasi) }}>{result.abrasi}</span>
              </div>
              <div className="result-card">
                <span className="result-label">Kondisi Pesisir</span>
                <span className="result-value">{result.kondisi}</span>
              </div>
            </div>
            <p className="interpretation">
              Dengan kerapatan mangrove <b>{density}%</b> dan tinggi gelombang <b>{wave.toFixed(1)} m</b>: semakin rapat
              mangrove, semakin besar energi gelombang yang diredam, sehingga risiko abrasi menurun dan kondisi pesisir
              cenderung lebih {result.kondisi}. Sebaliknya, gelombang yang makin tinggi menambah beban yang harus diredam
              oleh akar mangrove.
            </p>
          </section>

          <RootDivider />
          <section className="graph-section">
            <Eyebrow>Grafik Simulasi</Eyebrow>
            <h3>Kerapatan Mangrove vs. Risiko Abrasi</h3>
            <p className="blurb">Pada tinggi gelombang {wave.toFixed(1)} m — titik oranye menandai posisi simulasimu saat ini.</p>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#D8C9A3" strokeDasharray="3 3" />
                  <XAxis dataKey="density" unit="%" stroke="#0F2E3D" tick={{ fontFamily: "var(--font-mono)", fontSize: 12 }} />
                  <YAxis unit="%" stroke="#0F2E3D" tick={{ fontFamily: "var(--font-mono)", fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${v}%`} labelFormatter={(v) => `Kerapatan: ${v}%`} />
                  <Line type="monotone" dataKey="abrasi" stroke="#1B4B43" strokeWidth={2.5} dot={false} />
                  <ReferenceDot x={Math.round(density / 10) * 10} y={result.raw.abrasi} r={6} fill="#E07A5F" stroke="none" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function LabIllustration({ density, wave }) {
  const nTrees = Math.max(1, Math.round((density / 100) * 6));
  const waveAmp = 4 + wave * 6;
  return (
    <svg viewBox="0 0 300 220" className="lab-illustration">
      <rect width="300" height="220" fill="#F2E8D5" />
      <rect y="150" width="300" height="70" fill="#8B6F47" opacity="0.3" />
      <path d={`M0 170 Q 25 ${170 - waveAmp} 50 170 T 100 170 T 150 170 T 200 170 T 250 170 T 300 170 V 220 H 0 Z`} fill="#3E7C6E" />
      <path d={`M0 178 Q 25 ${178 - waveAmp * 0.6} 50 178 T 100 178 T 150 178 T 200 178 T 250 178 T 300 178 V 220 H 0 Z`} fill="#7FB8A8" opacity="0.8" />
      {Array.from({ length: nTrees }).map((_, i) => {
        const x = 20 + i * (260 / Math.max(1, nTrees - 1 || 1));
        return (
          <g key={i} transform={`translate(${nTrees === 1 ? 150 : x} 0)`}>
            <rect x="-3" y="120" width="6" height="40" fill="#3E2E1F" />
            <circle cx="0" cy="112" r="20" fill="#245C4E" />
            <circle cx="-13" cy="122" r="15" fill="#2E6E5C" />
            <circle cx="13" cy="122" r="15" fill="#1F5346" />
          </g>
        );
      })}
    </svg>
  );
}

function Kuis({ onFinish }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const mcQuestions = QUIZ.filter((q) => q.type === "mc");
  const score = useMemo(() => {
    let s = 0;
    mcQuestions.forEach((q) => { if (answers[q.id] === q.correct) s++; });
    return s;
  }, [answers]);

  const handleSubmit = () => {
    setSubmitted(true);
    onFinish(score, mcQuestions.length);
  };

  return (
    <div className="page kuis-page">
      <SectionHeader eyebrow="Kuis" title="Berpikir Kausal"
        blurb="Soal-soal ini menguji kemampuanmu mengidentifikasi sebab, akibat, dan hubungan antar variabel — bukan cuma hafalan." />
      <div className="quiz-list">
        {QUIZ.map((q, qi) => (
          <div key={q.id} className="quiz-item">
            <p className="quiz-q"><span className="mono">{String(qi + 1).padStart(2, "0")}</span> {q.q}</p>
            {q.type === "mc" ? (
              <div className="quiz-options">
                {q.options.map((opt, i) => {
                  const chosen = answers[q.id] === i;
                  const isCorrect = submitted && i === q.correct;
                  const isWrongChosen = submitted && chosen && i !== q.correct;
                  return (
                    <button
                      key={i}
                      className={`quiz-option ${chosen ? "quiz-option-chosen" : ""} ${isCorrect ? "quiz-option-correct" : ""} ${isWrongChosen ? "quiz-option-wrong" : ""}`}
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea
                className="quiz-essay"
                rows={4}
                placeholder="Tulis alur sebab-akibatmu di sini..."
                value={answers[q.id] || ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                disabled={submitted}
              />
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button className="btn btn-primary" onClick={handleSubmit}>Kumpulkan Jawaban</button>
      ) : (
        <div className="quiz-result">
          <CheckCircle2 size={20} />
          <p>Skor pilihan gandamu: <b>{score} / {mcQuestions.length}</b>. Jawaban esaimu sudah tersimpan di Dasbor untuk refleksi.</p>
        </div>
      )}
    </div>
  );
}

function Dasbor({ progress }) {
  const doneCount = MATERI_LIST.filter((m) => progress.visited.has(m.id)).length;
  const pct = Math.round((doneCount / MATERI_LIST.length) * 100);
  return (
    <div className="page dasbor-page">
      <SectionHeader eyebrow="Dasbor" title="Progres Belajarmu" />
      <div className="dash-grid">
        <div className="dash-card dash-card-wide">
          <span className="result-label">Materi Diselesaikan</span>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          <span className="mono">{doneCount} / {MATERI_LIST.length} ({pct}%)</span>
          <ul className="dash-materi-list">
            {MATERI_LIST.map((m) => (
              <li key={m.id}><ProgressPip done={progress.visited.has(m.id)} /> {m.title}</li>
            ))}
          </ul>
        </div>
        <div className="dash-card">
          <FlaskConical size={22} />
          <span className="result-label">Eksperimen Dijalankan</span>
          <span className="result-value">{progress.experiments}</span>
        </div>
        <div className="dash-card">
          <HelpCircle size={22} />
          <span className="result-label">Skor Kuis Terakhir</span>
          <span className="result-value">{progress.quizScore !== null ? `${progress.quizScore.score} / ${progress.quizScore.total}` : "Belum dikerjakan"}</span>
        </div>
      </div>
    </div>
  );
}

/* ============================== APP SHELL ============================== */

export default function App() {
  const [view, setView] = useState("beranda");
  const [materiId, setMateriId] = useState("materi1");
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState({ visited: new Set(), experiments: 0, quizScore: null });

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparentTop = view === "beranda" && !scrolled && !navOpen;

  const go = useCallback((v, mId) => {
    setView(v);
    if (mId) setMateriId(mId);
    setNavOpen(false);
  }, []);

  const setActiveMateri = useCallback((id) => {
    setMateriId(id);
    setProgress((p) => ({ ...p, visited: new Set(p.visited).add(id) }));
  }, []);

  const onExperiment = useCallback(() => {
    setProgress((p) => ({ ...p, experiments: p.experiments + 1 }));
  }, []);

  const onQuizFinish = useCallback((score, total) => {
    setProgress((p) => ({ ...p, quizScore: { score, total } }));
  }, []);

  React.useEffect(() => {
    if (view === "materi") {
      setProgress((p) => (p.visited.has(materiId) ? p : { ...p, visited: new Set(p.visited).add(materiId) }));
    }
  }, [view, materiId]);

  return (
    <div className="app">
      <style>{CSS}</style>

      <header className={`topbar ${transparentTop ? "topbar-transparent" : "topbar-solid"}`}>
        <button className="brand" onClick={() => go("beranda")}>
          <Waves size={20} /> MangrovEdu
        </button>
        <nav className="nav-desktop">
          {NAV_ITEMS.map((n) => (
            <button key={n.id} className={`nav-link ${view === n.id ? "nav-link-active" : ""}`} onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
        <button className="nav-toggle" onClick={() => setNavOpen((o) => !o)} aria-label="Buka menu">
          {navOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {navOpen && (
        <nav className="nav-mobile">
          {NAV_ITEMS.map((n) => (
            <button key={n.id} className={`nav-link ${view === n.id ? "nav-link-active" : ""}`} onClick={() => go(n.id)}>
              <n.icon size={16} /> {n.label}
            </button>
          ))}
        </nav>
      )}

      <main className="main">
        {view === "beranda" && <Beranda go={go} progress={progress} />}
        {view === "materi" && <MateriHub activeId={materiId} setActiveId={setActiveMateri} />}
        {view === "lab" && <LabVirtual onExperiment={onExperiment} />}
        {view === "kuis" && <Kuis onFinish={onQuizFinish} />}
        {view === "dasbor" && <Dasbor progress={progress} />}
      </main>

      <footer className="mgd-footer">
        <svg className="mgd-footer-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,48 C240,90 480,0 720,24 C960,48 1200,84 1440,32 L1440,90 L0,90 Z" fill="#EFE8D6" />
        </svg>
        <div className="mgd-footer-inner">
          <div>
            <h3>MangrovEdu</h3>
            <p>Dikembangkan sebagai media pembelajaran IPA untuk siswa SMP kelas VII mengenai ekosistem mangrove dan konservasi pesisir.</p>
          </div>
          <div>
            <h3>Referensi</h3>
            <p>Materi disusun berdasarkan kurikulum IPA SMP dan berbagai sumber ilmiah mengenai ekosistem mangrove. Daftar pustaka lengkap tersedia di halaman Materi.</p>
          </div>
        </div>
        <div className="mgd-footer-copy">© {new Date().getFullYear()} MangrovEdu. Seluruh hak cipta dilindungi.</div>
      </footer>
    </div>
  );
}

/* ============================== CSS ============================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #F2E8D5;
  --bg-deep: #E7D9B8;
  --ink: #0F2E3D;
  --primary: #1B4B43;
  --primary-light: #2F6B5E;
  --accent: #7FB8A8;
  --mud: #8B6F47;
  --ok: #3E7C6E;
  --warn: #C98A2E;
  --danger: #C0503A;
  --font-display: 'Fraunces', serif;
  --font-body: 'Public Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-jakarta: 'Plus Jakarta Sans', sans-serif;
}
* { box-sizing: border-box; }
.app { background: var(--bg); color: var(--ink); font-family: var(--font-body); min-height: 100vh; }
.mono { font-family: var(--font-mono); }

.topbar { display:flex; align-items:center; justify-content:space-between; padding: 18px 32px; position: fixed; top:0; left:0; right:0; z-index: 40; transition: background 0.25s ease, box-shadow 0.25s ease; }
.topbar-transparent { background: linear-gradient(to bottom, rgba(15,30,25,0.55), transparent); }
.topbar-solid { background: var(--primary); box-shadow: 0 2px 12px rgba(15,46,61,0.15); }
.brand { display:flex; align-items:center; gap:8px; background:none; border:none; color:#F7F1E1; font-family: var(--font-display); font-size: 19px; font-weight:600; cursor:pointer; }
.nav-desktop { display:flex; gap: 4px; }
.nav-toggle { display:none; background:none; border:none; color:#F7F1E1; cursor:pointer; }
.nav-link { display:flex; align-items:center; gap:6px; background:none; border:none; color:#F0E9D6; padding:8px 14px; border-radius:8px; cursor:pointer; font-family: var(--font-body); font-size:14.5px; font-weight:500; transition: background 0.15s; }
.nav-link:hover { background: rgba(255,255,255,0.12); }
.nav-link-active { background: rgba(255,255,255,0.16); color: #fff; font-weight:700; }
.nav-mobile { display:flex; flex-direction:column; background: var(--primary-light); padding: 8px; gap:4px; position: fixed; top: 66px; left:0; right:0; z-index:39; }

.main { max-width: 1080px; margin: 0 auto; padding: 92px 24px 80px; }

.eyebrow { font-family: var(--font-mono); font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color: var(--mud); margin-bottom:6px; }
.section-header h2 { font-family: var(--font-display); font-size: 30px; margin: 0 0 8px; color: var(--primary); }
.blurb { color: #43584F; max-width: 640px; line-height:1.55; margin: 0 0 18px; }
.root-divider { width:100%; height:24px; color: var(--mud); opacity:0.5; margin: 28px 0; }

.mgd, .mgd .mgd-menu-card, .mgd .mgd-materi-card { font-family: var(--font-jakarta); }
.mgd-reveal { opacity:0; transform: translateY(28px); transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1); }
.mgd-in-view { opacity:1; transform:none; }
.mgd-center { text-align:center; }
.mgd-left { text-align:left; }
.mgd-section-eyebrow { font-family: var(--font-jakarta); text-transform:uppercase; letter-spacing:0.25em; font-size:12px; font-weight:700; color:#2F6F4E; margin:0 0 12px; }
.mgd-eyebrow-light { color:#8FBFA3; }
.mgd-section-title { font-family: var(--font-display); font-size:34px; font-weight:600; margin:0 0 24px; color:#122420; }
.mgd-title-light { color:#fff; margin-bottom:56px; }

/* Hero */
.mgd-hero { position:relative; height:100vh; min-height:580px; overflow:hidden; margin: -92px -24px 0; width: calc(100% + 48px); }
.mgd-hero-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position: center 55%; animation: mgdKenBurns 26s ease-out forwards; transform-origin:center; }
@keyframes mgdKenBurns { from { transform:scale(1); } to { transform:scale(1.1); } }
.mgd-hero-overlay { position:absolute; inset:0; background: linear-gradient(0deg, #0B3D3A 0%, rgba(9,30,26,0.45) 50%, rgba(9,30,26,0.12) 100%); }
.mgd-hero-inner { position:relative; z-index:2; height:100%; display:flex; align-items:flex-end; }
.mgd-hero-copy { max-width:680px; padding: 40px 48px 100px; color:#fff; }
.mgd-eyebrow { font-family: var(--font-jakarta); text-transform:uppercase; letter-spacing:0.3em; font-size:13px; color:#8FBFA3; font-weight:600; margin:0; }
.mgd-hero-title { font-family: var(--font-display); font-size:64px; font-weight:600; margin:16px 0 0; line-height:1.05; color:#fff; }
.mgd-hero-title-i { font-style:italic; color:#8FBFA3; }
.mgd-hero-desc { font-family: var(--font-jakarta); margin-top:24px; font-size:18px; line-height:1.7; color:rgba(255,255,255,0.9); max-width:520px; }
.mgd-cta-row { display:flex; flex-wrap:wrap; gap:16px; margin-top:32px; }
.mgd-btn-primary { font-family: var(--font-jakarta); background:#E8873A; color:#fff; border:none; padding:13px 32px; border-radius:999px; font-weight:600; font-size:15px; cursor:pointer; transition:transform .25s ease, box-shadow .25s ease, background .2s ease; }
.mgd-btn-primary:hover { background:#D67528; transform:translateY(-2px); box-shadow:0 12px 28px -8px rgba(232,135,58,.55); }
.mgd-btn-outline { font-family: var(--font-jakarta); background:transparent; color:#fff; border:1px solid rgba(255,255,255,0.7); padding:13px 32px; border-radius:999px; font-weight:600; font-size:15px; cursor:pointer; transition:transform .25s ease, background .2s ease; }
.mgd-btn-outline:hover { background:rgba(255,255,255,0.1); transform:translateY(-2px); }
.mgd-tide-divider { position:absolute; bottom:-1px; left:0; width:100%; height:70px; z-index:3; }

/* Tentang */
.mgd-about { max-width:820px; margin:0 auto; padding:96px 24px; text-align:center; }
.mgd-about-text { font-family: var(--font-jakarta); font-size:17px; line-height:1.75; color:rgba(18,36,32,0.72); margin:0; }

/* Tujuan Pembelajaran */
.mgd-goals { background:#0B3D3A; padding:96px 24px; margin: 0 -24px; }
.mgd-goals-inner { max-width:820px; margin:0 auto; }
.mgd-goals-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.mgd-goal-card { position:relative; display:flex; gap:16px; align-items:flex-start; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:20px; transition: background .2s ease; }
.mgd-goal-card:hover { background:rgba(255,255,255,0.09); }
.mgd-goal-card p { margin:0; color:rgba(255,255,255,0.9); line-height:1.5; font-size:14.5px; }
.mgd-goal-icon { font-size:24px; line-height:1; flex-shrink:0; }
.mgd-goal-card-wide { grid-column: span 2; }

/* Petunjuk Penggunaan */
.mgd-steps { max-width:1040px; margin:0 auto; padding:96px 24px; }
.mgd-steps-wrap { position:relative; margin-top:64px; }
.mgd-steps-track { position:absolute; top:28px; left:6%; right:6%; height:2px; background-image:linear-gradient(to right, #2F6F4E 60%, transparent 0%); background-size:16px 2px; background-repeat:repeat-x; }
.mgd-steps-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; text-align:center; position:relative; }
.mgd-step-node { width:56px; height:56px; margin:0 auto; border-radius:50%; background:#2F6F4E; color:#fff; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-weight:600; font-size:20px; position:relative; z-index:2; transition: transform .3s ease, box-shadow .3s ease; }
.mgd-step:hover .mgd-step-node { transform:scale(1.12); box-shadow:0 0 0 6px rgba(232,135,58,.18); }
.mgd-step h3 { font-family: var(--font-jakarta); margin:16px 0 4px; font-size:15px; font-weight:600; color:#122420; }
.mgd-step p { font-family: var(--font-jakarta); margin:0; font-size:13px; color:rgba(18,36,32,0.6); }

/* Menu Utama */
.mgd-menu { background:#EFE8D6; padding:96px 24px; margin: 0 -24px; }
.mgd-menu-grid { max-width:1180px; margin:56px auto 0; display:grid; grid-template-columns:repeat(5,1fr); gap:20px; }
.mgd-menu-card { background:#fff; border:none; border-radius:18px; padding:26px 22px; text-align:left; display:flex; flex-direction:column; cursor:pointer; box-shadow:0 1px 3px rgba(11,61,58,0.06); transition:transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease; }
.mgd-menu-card:hover { transform:translateY(-8px) rotate(-0.4deg); box-shadow:0 22px 44px -16px rgba(11,61,58,.28); }
.mgd-menu-icon { width:46px; height:46px; border-radius:12px; background:rgba(47,111,78,0.1); color:#2F6F4E; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
.mgd-menu-card h3 { font-family:var(--font-display); font-size:18px; font-weight:600; margin:0 0 8px; color:#122420; }
.mgd-menu-card p { font-size:13.5px; color:rgba(18,36,32,0.6); line-height:1.5; flex:1; margin:0 0 16px; }
.mgd-menu-cta { display:inline-flex; align-items:center; gap:6px; font-size:13.5px; font-weight:700; color:#2F6F4E; position:relative; width:fit-content; }
.mgd-menu-cta::after { content:''; position:absolute; left:0; bottom:-3px; height:2px; width:0; background:#E8873A; transition:width .3s ease; }
.mgd-menu-card:hover .mgd-menu-cta::after { width:100%; }

/* Daftar Materi */
.mgd-materi-list { max-width:1180px; margin:0 auto; padding:96px 24px 40px; }
.mgd-materi-grid { margin-top:48px; display:grid; grid-template-columns:repeat(5,1fr); gap:16px; }
.mgd-materi-card { background:#fff; border:1px solid #E4D7B5; border-radius:16px; padding:20px; text-align:left; cursor:pointer; box-shadow:0 1px 3px rgba(11,61,58,0.05); transition:transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease; }
.mgd-materi-card:hover { transform:translateY(-8px) rotate(-0.4deg); box-shadow:0 22px 44px -16px rgba(11,61,58,.28); }
.mgd-materi-num { font-family:var(--font-mono); font-size:12px; color:#2F6F4E; font-weight:700; }
.mgd-materi-card h3 { font-family:var(--font-display); font-size:16px; margin:8px 0 0; color:#122420; }
.mgd-materi-done { display:flex; align-items:center; gap:5px; font-size:11.5px; color:#2F6F4E; margin-top:10px; font-weight:600; }

/* Footer */
.mgd-footer { position:relative; background:#0B3D3A; color:#DCEAE3; padding-top:64px; padding-bottom:40px; }
.mgd-footer-wave { position:absolute; top:-1px; left:0; width:100%; height:50px; transform:rotate(180deg); }
.mgd-footer-inner { max-width:1180px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:1fr 1fr; gap:40px; }
.mgd-footer-inner h3 { font-family:var(--font-display); color:#fff; font-size:19px; margin:0 0 10px; }
.mgd-footer-inner p { font-family: var(--font-jakarta); font-size:13.5px; color:#8FBFA3; line-height:1.6; margin:0; }
.mgd-footer-copy { font-family: var(--font-jakarta); text-align:center; font-size:11.5px; color:rgba(255,255,255,0.4); margin-top:40px; }

.btn { font-family: var(--font-body); font-weight:600; font-size:14px; border-radius:10px; padding:11px 18px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; border: none; transition: transform 0.1s, opacity 0.15s; }
.btn:active { transform: scale(0.97); }
.btn-primary { background: var(--primary); color: #F2E8D5; }
.btn-primary:hover { background: var(--primary-light); }
.btn-ghost { background: transparent; color: var(--primary); border: 1.5px solid var(--primary); }
.btn-outline { background: transparent; color: var(--mud); border: 1.5px solid var(--mud); }
.btn-danger { background: var(--danger); color: #fff; }
.btn-block { width:100%; justify-content:center; margin-top: 6px; }

.materi-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(210px,1fr)); gap:14px; }
.materi-card { background:#fff; border: 1.5px solid #D8C9A3; border-radius:12px; padding:16px; text-align:left; display:flex; flex-direction:column; gap:6px; cursor:pointer; position:relative; }
.materi-card:hover { border-color: var(--accent); }
.materi-num { font-family: var(--font-mono); font-size:12px; color: var(--mud); }
.materi-title { font-family: var(--font-display); font-size:16px; color: var(--primary); font-weight:600; }
.pip { position:absolute; top:14px; right:14px; color:#C9BB98; }
.pip-done { color: var(--ok); }

.materi-hub { display:grid; grid-template-columns: 220px 1fr; gap: 28px; }
.materi-side { display:flex; flex-direction:column; gap:4px; align-self:start; position: sticky; top: 84px; }
.side-link { display:flex; gap:8px; align-items:baseline; text-align:left; background:none; border:none; padding:10px 12px; border-radius:8px; cursor:pointer; font-size:14px; color:#43584F; }
.side-link:hover { background: var(--bg-deep); }
.side-link-active { background: var(--primary); color: #F2E8D5; }
.side-num { font-family: var(--font-mono); font-size:11px; opacity:0.7; }

.hotspot-wrap { position:relative; border-radius:16px; overflow:hidden; aspect-ratio: 16/9; max-height: 420px; }
.hotspot-illustration { width:100%; height:100%; display:block; }
.hotspot { position:absolute; transform: translate(-50%,-50%); width:26px; height:26px; border-radius:50%; border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.hotspot-dot { width:14px; height:14px; border-radius:50%; background: var(--accent); border: 2px solid #fff; box-shadow: 0 0 0 4px rgba(127,184,168,0.35); animation: pulse 2.2s infinite; }
.hotspot-abiotik .hotspot-dot { background: #E9B44C; box-shadow: 0 0 0 4px rgba(233,180,76,0.35); }
@keyframes pulse { 0%,100% { box-shadow: 0 0 0 4px rgba(127,184,168,0.35);} 50% { box-shadow: 0 0 0 8px rgba(127,184,168,0.12);} }
.legend { display:flex; gap:20px; margin-top:14px; font-size:13px; color:#43584F; }
.legend .dot { width:10px; height:10px; border-radius:50%; display:inline-block; margin-right:6px; }
.dot-biotik { background: var(--accent); }
.dot-abiotik { background: #E9B44C; }

.modal-backdrop { position:fixed; inset:0; background: rgba(15,46,61,0.45); display:flex; align-items:center; justify-content:center; z-index:60; padding: 20px; }
.modal { background:#fff; border-radius:16px; padding:26px; max-width:420px; width:100%; position:relative; }
.modal-close { position:absolute; top:14px; right:14px; background:none; border:none; cursor:pointer; color: var(--mud); }
.modal h3 { font-family: var(--font-display); color: var(--primary); font-size:22px; margin: 8px 0 10px; }
.modal p { line-height:1.6; color:#3B4F47; margin:0; }
.tag { display:inline-block; font-family: var(--font-mono); font-size:11px; text-transform:uppercase; letter-spacing:0.05em; padding:4px 8px; border-radius:6px; }
.tag-biotik { background: rgba(127,184,168,0.25); color: var(--primary); }
.tag-abiotik { background: rgba(233,180,76,0.25); color: #8A5F0F; }
.tag-info { background: var(--bg-deep); color: var(--mud); }

.foodchain { display:flex; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom: 20px; }
.chain-node { display:flex; flex-direction:column; align-items:center; gap:4px; background:#fff; border:1.5px solid #D8C9A3; border-radius:12px; padding:14px 12px; min-width:110px; cursor:pointer; color: var(--primary); }
.chain-node:hover { border-color: var(--accent); }
.chain-node-removed { opacity:0.3; text-decoration: line-through; }
.chain-role { font-family: var(--font-mono); font-size:10.5px; color: var(--mud); }
.chain-label { font-weight:600; font-size:13.5px; }
.chain-arrow { color: var(--mud); flex-shrink:0; }
.chain-toggle { margin-top:6px; }
.cascade-warning { display:flex; gap:10px; background: #FBE9E2; border: 1px solid #E3B5A4; color: #7A3B27; padding:14px; border-radius:10px; margin-top:12px; align-items:flex-start; }
.cascade-warning p { margin:0; line-height:1.5; font-size:14px; }

.cause-effect { display:flex; flex-direction:column; gap:10px; }
.ce-item { border:1.5px solid #D8C9A3; border-radius:12px; overflow:hidden; background:#fff; }
.ce-cause { width:100%; display:flex; align-items:center; gap:10px; background:none; border:none; padding:14px 16px; cursor:pointer; font-weight:600; color: var(--primary); text-align:left; font-size:15px; }
.ce-chev { margin-left:auto; transition: transform 0.15s; }
.ce-open .ce-chev { transform: rotate(180deg); }
.ce-effects { margin:0; padding: 4px 20px 16px 42px; color:#3B4F47; line-height:1.7; }

.content-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap:16px; }
.content-card { background:#fff; border:1.5px solid #D8C9A3; border-radius:14px; padding:18px; }
.content-card h4 { font-family: var(--font-display); color: var(--primary); margin:0 0 10px; font-size:17px; }
.content-card ul { margin:0; padding-left:18px; color:#3B4F47; line-height:1.6; font-size:14px; }
.content-card p { margin:0; color:#3B4F47; line-height:1.6; font-size:14px; }

.lab-grid { display:grid; grid-template-columns: 1fr 1.3fr; gap:24px; align-items:start; }
.lab-controls { background:#fff; border:1.5px solid #D8C9A3; border-radius:14px; padding:20px; }
.control { margin-bottom: 20px; }
.control label { display:flex; justify-content:space-between; font-size:14px; font-weight:600; color: var(--primary); margin-bottom:8px; }
.control input[type=range] { width:100%; accent-color: var(--primary); }
.lab-visual, .lab-illustration { width:100%; border-radius:14px; overflow:hidden; }
.result-section h3, .graph-section h3 { font-family: var(--font-display); color: var(--primary); font-size:20px; margin:4px 0 6px; }
.result-cards { display:grid; grid-template-columns: repeat(3,1fr); gap:14px; margin: 10px 0 16px; }
.result-card, .dash-card { background:#fff; border:1.5px solid #D8C9A3; border-radius:14px; padding:18px; display:flex; flex-direction:column; gap:6px; }
.result-label { font-size:12.5px; color: var(--mud); font-family: var(--font-mono); text-transform:uppercase; }
.result-value { font-family: var(--font-display); font-size:24px; font-weight:600; text-transform:capitalize; color: var(--primary); }
.interpretation { color:#3B4F47; line-height:1.6; max-width:680px; }
.chart-wrap { background:#fff; border:1.5px solid #D8C9A3; border-radius:14px; padding: 16px; margin-top:8px; }

.quiz-list { display:flex; flex-direction:column; gap:22px; margin-bottom:24px; }
.quiz-q { font-weight:600; color: var(--primary); font-size:15.5px; line-height:1.5; display:flex; gap:10px; }
.quiz-options { display:flex; flex-direction:column; gap:8px; margin-top:10px; }
.quiz-option { text-align:left; background:#fff; border:1.5px solid #D8C9A3; border-radius:10px; padding:11px 14px; cursor:pointer; font-size:14px; color:#3B4F47; }
.quiz-option:hover:not(:disabled) { border-color: var(--accent); }
.quiz-option-chosen { border-color: var(--primary); background: var(--bg-deep); }
.quiz-option-correct { border-color: var(--ok); background: rgba(62,124,110,0.12); }
.quiz-option-wrong { border-color: var(--danger); background: rgba(192,80,58,0.1); }
.quiz-essay { width:100%; border:1.5px solid #D8C9A3; border-radius:10px; padding:12px; font-family: var(--font-body); font-size:14px; margin-top:10px; resize:vertical; }
.quiz-result { display:flex; gap:10px; align-items:center; background: var(--bg-deep); border-radius:12px; padding:16px; color: var(--primary); }
.quiz-result p { margin:0; }

.dash-grid { display:grid; grid-template-columns: 1.4fr 1fr 1fr; gap:16px; }
.dash-card-wide { grid-column: span 1; }
.progress-bar { background: var(--bg-deep); height:10px; border-radius:6px; overflow:hidden; margin: 6px 0; }
.progress-fill { background: var(--accent); height:100%; transition: width 0.3s; }
.dash-materi-list { list-style:none; margin:12px 0 0; padding:0; display:flex; flex-direction:column; gap:8px; font-size:14px; }
.dash-materi-list li { display:flex; align-items:center; gap:8px; color:#3B4F47; }

@media (max-width: 860px) {
  .nav-desktop { display:none; }
  .nav-toggle { display:block; }
  .mgd-hero { min-height: 84vh; }
  .mgd-hero-copy { padding: 32px 24px 64px; }
  .mgd-hero-title { font-size:36px; }
  .mgd-goals-grid, .mgd-steps-grid, .mgd-menu-grid, .mgd-materi-grid { grid-template-columns: repeat(2,1fr); }
  .mgd-goal-card-wide { grid-column: span 2; }
  .mgd-steps-track { display:none; }
  .mgd-footer-inner { grid-template-columns: 1fr; }
  .materi-hub { grid-template-columns: 1fr; }
  .materi-side { flex-direction:row; overflow-x:auto; position:static; }
  .lab-grid { grid-template-columns: 1fr; }
  .dash-grid { grid-template-columns: 1fr; }
  .result-cards { grid-template-columns: 1fr; }
}
@media (max-width: 540px) {
  .mgd-goals-grid, .mgd-steps-grid, .mgd-menu-grid, .mgd-materi-grid { grid-template-columns: 1fr; }
  .mgd-goal-card-wide { grid-column: span 1; }
  .mgd-hero-title { font-size:30px; }
}
`;