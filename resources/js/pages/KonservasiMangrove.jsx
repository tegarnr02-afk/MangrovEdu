import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import api from "../lib/api";
import imgMangroveSehat from "./konservasi-mangrove-sehat.png";
import imgMangroveRusak from "./konservasi-mangrove-rusak.png";

/* ===== ICONS ===== */
const ArrowIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
const ArrowLeftIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
const CheckIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>);
const XIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>);
const RefreshIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v5h5" /><path d="M20 20v-5h-5" /><path d="M5.5 9a7 7 0 0 1 12.3-2.5M18.5 15a7 7 0 0 1-12.3 2.5" /></svg>);
const ChevronRightIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>);
const CloseIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>);

/* ===== DATA: EMPAT PERBEDAAN KONDISI MANGROVE ===== */
const DIFFS = [
  { id: "kerapatan", icon: "🌱", label: "Kerapatan Mangrove", kiri: "Mangrove lebih rapat dan lebat.", kanan: "Mangrove lebih jarang dan banyak bagian yang terbuka." },
  { id: "organisme", icon: "🐟", label: "Organisme", kiri: "Terlihat lebih banyak organisme seperti ikan dan burung.", kanan: "Organisme yang terlihat lebih sedikit." },
  { id: "perairan", icon: "🌊", label: "Kondisi Lingkungan/Perairan", kiri: "Perairan terlihat lebih bersih.", kanan: "Terdapat sampah di sekitar perairan dan pesisir." },
  { id: "vegetasi", icon: "🪵", label: "Kondisi Vegetasi", kiri: "Vegetasi terlihat sehat.", kanan: "Terlihat pohon yang rusak/berkurang dan beberapa bagian mangrove terbuka." },
];

/* Titik interaktif pada kedua gambar. `real` = perbedaan yang benar,
   sisanya adalah "pengalih" (bukan perbedaan) untuk melatih ketelitian. */
const SPOTS = [
  { id: "kerapatan", img: "a", x: 30, y: 42, real: true },
  { id: "organisme", img: "a", x: 72, y: 30, real: true },
  { id: "d1", img: "a", x: 42, y: 12, real: false },
  { id: "perairan", img: "b", x: 55, y: 78, real: true },
  { id: "vegetasi", img: "b", x: 78, y: 40, real: true },
  { id: "d2", img: "b", x: 14, y: 58, real: false },
];

/* ===== DATA: TINDAKAN YANG TEPAT (MCQ) ===== */
const TINDAKAN = {
  prompt:
    "Perhatikan kondisi mangrove pada gambar B. Jika kamu menjadi bagian dari masyarakat yang tinggal di sekitar kawasan tersebut, tindakan manakah yang paling tepat untuk membantu menjaga kelestarian mangrove?",
  options: [
    {
      label: "Membersihkan sampah di sekitar mangrove agar lingkungan terlihat lebih bersih, tanpa melakukan penanaman kembali.",
      feedback:
        "Membersihkan sampah memang dapat membantu mengurangi gangguan terhadap lingkungan mangrove, tetapi tindakan tersebut belum mengatasi berkurangnya vegetasi mangrove. Menurutmu, apa yang dapat dilakukan untuk memulihkan mangrove yang sudah mengalami kerusakan?",
    },
    {
      label: "Menanam kembali mangrove yang rusak dan menjaga kawasan dari kegiatan yang dapat merusaknya.",
      correct: true,
      feedback:
        "Menanam kembali mangrove yang mengalami kerusakan disertai upaya menjaga kawasan dari kegiatan yang merusak dapat membantu memulihkan dan mempertahankan kondisi ekosistem mangrove. Upaya menjaga mangrove juga penting karena mangrove memiliki berbagai fungsi bagi lingkungan dan organisme yang hidup di sekitarnya.",
    },
    {
      label: "Memanfaatkan sebagian kawasan mangrove untuk kegiatan masyarakat dengan tetap menyisakan beberapa pohon mangrove.",
      feedback:
        "Pemanfaatan kawasan mangrove untuk kegiatan masyarakat perlu mempertimbangkan kelestarian ekosistem. Jika kegiatan tersebut menyebabkan mangrove terus berkurang atau rusak, bagaimana pengaruhnya terhadap fungsi mangrove bagi lingkungan?",
    },
    {
      label: "Membiarkan mangrove pulih secara alami tanpa melakukan kegiatan apa pun agar ekosistem tidak terganggu.",
      feedback:
        "Mangrove memang dapat mengalami pemulihan secara alami pada kondisi tertentu, tetapi kawasan yang sudah mengalami kerusakan dapat memerlukan upaya pemulihan dan perlindungan. Menurutmu, tindakan apa yang dapat membantu mengembalikan kondisi mangrove tersebut?",
    },
  ],
};
const TINDAKAN_ANIM = ["🌱 Mangrove rusak", "🌱 Penanaman kembali", "🛡️ Perlindungan kawasan", "🌿 Kondisi mangrove dipertahankan/dipulihkan"];

/* ===== DATA: FUNGSI EKOLOGIS MANGROVE ===== */
const FUNGSI = [
  {
    id: "habitat", emoji: "🐟", label: "Habitat Organisme", color: "#3D8267", bg: "#E1EAE2",
    desc: "Hutan mangrove menjadi rumah bagi kepiting bakau (Scylla serrata). Akar mangrove yang rapat menyediakan tempat berlindung dan sumber makanan bagi kepiting ini.",
    detail: "Penelitian di Sumatera Utara menunjukkan bahwa semakin lebat vegetasi mangrove, semakin banyak pula kepiting bakau yang hidup di dalamnya.",
    anim: ["🌱 Akar mangrove", "🦀 Tempat berlindung + 🍽️ Sumber makanan", "🦀 Kepiting bakau"],
  },
  {
    id: "perlindungan", emoji: "🌊", label: "Perlindungan Pesisir", color: "#2F6B57", bg: "#D6EAE1",
    desc: "Akar dan batang mangrove yang rapat berfungsi seperti benteng alami di tepi pantai. Ketika gelombang laut datang, kerapatan hutan mangrove membantu memecah dan meredam energi gelombang sebelum mencapai daratan.",
    detail: "Semakin lebar dan lebat hutan mangrove, semakin besar pula kemampuannya melindungi wilayah pesisir dari abrasi dan gelombang besar.",
    anim: ["🌊 Gelombang", "🌱🌱🌱 Mangrove", "🛡️ Energi gelombang berkurang", "🏝️ Daratan terlindungi"],
  },
  {
    id: "penyimpanan", emoji: "🌍", label: "Penyimpanan Karbon", color: "#C24A5F", bg: "#F8E4E7",
    desc: "Informasi mengenai penyimpanan karbon pada materi ini belum dijelaskan secara rinci.",
    detail: null,
    anim: null,
    /* Keong Potamididae — organisme pesisir yang erat kaitannya dengan mangrove */
    keong: {
      title: "Keong Potamididae",
      desc: "Penelitian di kawasan mangrove Probolinggo, Jawa Timur, menemukan bahwa keong Potamididae hanya bisa hidup jika ada vegetasi mangrove di sekitarnya.",
      konklusi: "Hal ini menunjukkan eratnya hubungan antara mangrove dan kelangsungan hidup hewan-hewan kecil di pesisir.",
    },
  },
];

/* ===== DATA: MANFAAT BAGI MASYARAKAT ===== */
const MANFAAT = [
  {
    id: "obat", emoji: "💊", nama: "Pemanfaatan sebagai obat",
    img: "/images/materi5/obat-mangrove.webp",
    desc: "Berbagai bagian tumbuhan mangrove telah dimanfaatkan oleh masyarakat sebagai bahan obat-obatan tradisional.",
    bg: "#FBEEDA", accent: "#C97C1E",
  },
  {
    id: "madu", emoji: "🍯", nama: "Lebah madu hutan mangrove",
    img: "/images/materi5/madu-mangrove.webp",
    desc: "Kawasan hutan mangrove menjadi habitat bagi lebah madu sehingga menghasilkan madu hutan mangrove yang dapat dimanfaatkan oleh masyarakat.",
    bg: "#FDF0D5", accent: "#CE8324",
  },
  {
    id: "selai", emoji: "🍓", nama: "Selai buah mangrove",
    img: "/images/materi5/selai-mangrove.webp",
    desc: "Buah mangrove dapat diolah menjadi selai sebagai salah satu produk pangan hasil pemanfaatan mangrove oleh masyarakat.",
    bg: "#F8E4E7", accent: "#C24A5F",
  },
  {
    id: "tepung", emoji: "🌾", nama: "Tepung buah mangrove",
    img: "/images/materi5/tepung-mangrove.webp",
    desc: "Buah mangrove dapat diolah menjadi tepung sebagai bahan pangan alternatif hasil pemanfaatan mangrove oleh masyarakat.",
    bg: "#F1EFE3", accent: "#A9784F",
  },
  {
    id: "kopi", emoji: "☕", nama: "Produk kopi mangrove",
    img: "/images/materi5/kopi-mangrove.webp",
    desc: "Biji atau bagian tertentu dari tanaman mangrove dapat diolah menjadi produk kopi sebagai salah satu bentuk pemanfaatan mangrove oleh masyarakat.",
    bg: "#E4E2EA", accent: "#6C63B5",
  },
];

/* ===== DATA: PREDIKSI RISIKO ABRASI ===== */
const PREDIKSI = {
  question: "Jika kondisi mangrove semakin berkurang, bagaimana menurutmu risiko abrasi pada kawasan pesisir?",
  placeholder: "Tulis prediksimu di sini...",
  full: [
    "abrasi meningkat", "abrasi semakin meningkat", "abrasi semakin besar", "abrasi makin besar",
    "abrasi semakin tinggi", "abrasi makin tinggi", "risiko abrasi meningkat", "risiko abrasi semakin besar",
    "risiko abrasi semakin meningkat", "abrasi akan meningkat", "abrasi akan semakin besar", "abrasi bertambah",
    "abrasi semakin parah", "abrasi semakin cepat", "abrasi makin meningkat", "abrasi lebih besar",
    "abrasi lebih cepat", "pantai semakin terkikis", "semakin mudah abrasi", "abrasi semakin mudah",
    "abrasi makin parah", "risiko abrasi makin besar", "abrasi jadi meningkat",
  ],
  partial: [
    "abrasi", "pengikisan", "erosi", "gelombang", "pantai", "pesisir", "terkikis",
    "mangrove berkurang", "mangrove hilang", "perlindungan berkurang", "pelindung", "garis pantai",
  ],
  feedbackCorrect:
    "Prediksimu tepat! Semakin berkurang dan tidak lebat kondisi mangrove, kemampuan mangrove dalam membantu melindungi wilayah pesisir dari abrasi dapat berkurang.",
  feedbackPartial:
    "Prediksimu sudah mengarah ke konsep yang tepat. Coba pikirkan kembali hubungan antara kerapatan mangrove dan perlindungan wilayah pesisir dari gelombang.",
  feedbackWrong:
    "Coba pikirkan kembali fungsi mangrove sebagai pelindung alami di wilayah pesisir. Jika jumlah atau kerapatan mangrove semakin berkurang, apakah kemampuan melindungi pantai tetap sama?",
};
const PREDIKSI_ANIM = ["🌱 Mangrove berkurang", "🛡️ Perlindungan pesisir berkurang", "🌊 Energi gelombang lebih mudah mencapai daratan", "🏖️ Risiko abrasi meningkat"];

/* ===== DATA: HUBUNGAN FUNGSI MANGROVE ===== */
const HUB = [
  { id: "habitat", icon: "🐟", label: "Habitat Organisme", color: "#3D8267", bg: "#E1EAE2" },
  { id: "perlindungan", icon: "🌊", label: "Perlindungan Pesisir", color: "#2F6B57", bg: "#D6EAE1" },
  { id: "penyimpanan", icon: "🌍", label: "Penyimpanan Karbon", color: "#C24A5F", bg: "#F8E4E7" },
  { id: "manfaat", icon: "👥", label: "Manfaat bagi Masyarakat", color: "#E8A33D", bg: "#FDF0D5" },
];

/* ===== DATA: REFLEKSI ===== */
const REFLEKSI = {
  question: "Setelah mempelajari fungsi dan manfaat mangrove, mengapa kelestarian mangrove perlu dijaga?",
  options: [
    "Karena mangrove hanya berguna sebagai tanaman hias.",
    "Karena mangrove memiliki fungsi bagi habitat organisme, perlindungan pesisir, dan dapat memberikan manfaat bagi masyarakat.",
    "Karena mangrove tidak memiliki hubungan dengan lingkungan sekitar.",
  ],
  correct: 1,
  feedbackCorrect: " Benar! Mangrove memiliki berbagai fungsi bagi ekosistem dan juga dapat memberikan manfaat bagi masyarakat.",
  feedbackWrong: " Coba ingat kembali fungsi ekologis dan manfaat mangrove yang sudah kamu pelajari.",
};

/* ===== DATA: RINGKASAN ===== */
const SUMMARY_CARDS = [
  { emoji: "🔎", title: "Mengamati Kondisi", body: "Kondisi ekosistem mangrove dapat diamati melalui kerapatan mangrove, organisme, kondisi perairan, dan kondisi vegetasi." },
  { emoji: "🌱", title: "Menjaga Kelestarian", body: "Menanam kembali mangrove yang rusak dan menjaga kawasan dari kegiatan yang dapat merusaknya merupakan tindakan yang tepat untuk membantu menjaga kelestarian mangrove." },
  { emoji: "🌊", title: "Fungsi Ekologis", body: "Mangrove menyediakan habitat organisme dan membantu melindungi wilayah pesisir dari abrasi dan gelombang besar." },
  { emoji: "👥", title: "Manfaat Masyarakat", body: "Mangrove dapat dimanfaatkan oleh masyarakat, antara lain sebagai obat, lebah madu hutan mangrove, selai buah mangrove, tepung buah mangrove, dan produk kopi mangrove." },
];

/* ===== KLASIFIKASI PREDIKSI (semantic, bukan exact-match) ===== */
function classifyPrediksi(text) {
  const t = (text || "").toLowerCase().trim();
  if (!t) return null;
  if (PREDIKSI.full.some((k) => t.includes(k))) return "correct";
  if (PREDIKSI.partial.some((k) => t.includes(k))) return "partial";
  return "wrong";
}

/* ===== KOMPONEN RANTAI SEBAB-AKIBAT (pakai .chain-visual milik Materi 4) ===== */
function AnimChain({ steps, style }) {
  return (
    <div className="chain-visual" style={style || {}}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className="chain-box">{s}</div>
          {i < steps.length - 1 && <div className="chain-arrow"><ArrowIcon /></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ===== MAIN COMPONENT ===== */
export default function KonservasiMangrove() {
  const navigate = useNavigate();

  // Aktivitas 1 — temukan perbedaan
  const [foundDiffs, setFoundDiffs] = useState(new Set());
  const [diffChecked, setDiffChecked] = useState(false);
  const [diffResult, setDiffResult] = useState(null); // 'complete' | 'incomplete' | 'none'
  const [spotMsg, setSpotMsg] = useState(null);

  // Aktivitas 2 — tindakan (MCQ + coba lagi)
  const [tindakanSelected, setTindakanSelected] = useState(null);
  const [tindakanSubmitted, setTindakanSubmitted] = useState(false);
  const [tindakanWrongIdx, setTindakanWrongIdx] = useState(null);

  // Eksplorasi — fungsi ekologis
  const [openFungsi, setOpenFungsi] = useState(null);
  const [visitedFungsi, setVisitedFungsi] = useState(new Set());

  // Eksplorasi — manfaat
  const [openProduk, setOpenProduk] = useState(null);
  const [visitedProduk, setVisitedProduk] = useState(new Set());

  // Prediksi
  const [prediksiText, setPrediksiText] = useState("");
  const [prediksiResult, setPrediksiResult] = useState(null);

  // Refleksi
  const [reflSelected, setReflSelected] = useState(null);
  const [reflSubmitted, setReflSubmitted] = useState(false);

  // Selesai
  const [finishing, setFinishing] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finishError, setFinishError] = useState(null);
  const [showLock, setShowLock] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // refs untuk auto-scroll antar aktivitas
  const tindakanRef = useRef(null);
  const fungsiRef = useRef(null);
  const ringkasanRef = useRef(null);
  const scrollTo = (ref) => setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);

  /* ── progress milestones ── */
  const allDiffsFound = foundDiffs.size === DIFFS.length;
  const findDone = diffChecked && allDiffsFound;
  const tindakanDone = tindakanSubmitted;
  const allFungsiVisited = visitedFungsi.size === FUNGSI.length;
  const allProdukVisited = visitedProduk.size === MANFAAT.length;
  const prediksiDone = prediksiResult !== null;
  const reflDone = reflSubmitted;

  const pct = Math.round((findDone + tindakanDone + allFungsiVisited + allProdukVisited + prediksiDone + reflDone + finished) / 7 * 100);

  /* ── simpan jawaban ke backend (fire-and-forget) ── */
  const saveJawaban = (itemType, itemId, detail, isCorrect, nilai) => {
    api
      .post("/materi5/jawaban", {
        item_type: itemType,
        item_id: itemId,
        detail,
        is_correct: !!isCorrect,
        nilai,
      })
      .catch(() => { /* diabaikan: jawaban tetap tersimpan di state lokal */ });
  };

  /* ── rehydrate jawaban tersimpan dari database saat halaman dibuka ── */
  useEffect(() => {
    let cancelled = false;
    api
      .get("/materi5/jawaban")
      .then(({ data }) => {
        if (cancelled) return;
        const rows = data?.data || [];

        const diffs = new Set();
        const fungsi = new Set();
        const produk = new Set();

        rows.forEach((row) => {
          const detail = row.detail || {};
          if (row.item_type === "koneksi") {
            if (row.item_id.startsWith("temu-")) diffs.add(row.item_id.replace("temu-", ""));
            else if (row.item_id.startsWith("fungsi-")) fungsi.add(row.item_id.replace("fungsi-", ""));
            else if (row.item_id.startsWith("manfaat-")) produk.add(row.item_id.replace("manfaat-", ""));
          } else if (row.item_type === "mcq" && row.item_id === "tindakan") {
            setTindakanSelected(detail.selected ?? null);
            setTindakanSubmitted(true);
          } else if (row.item_type === "predict" && row.item_id === "prediksi-abrasi") {
            setPrediksiText(detail.text ?? "");
            setPrediksiResult(detail.result ?? (row.is_correct ? "correct" : "wrong"));
          } else if (row.item_type === "refleksi" && row.item_id === "kesimpulan") {
            setReflSelected(detail.selected ?? null);
            setReflSubmitted(true);
          }
        });

        setFoundDiffs(diffs);
        setVisitedFungsi(fungsi);
        setVisitedProduk(produk);
        if (diffs.size === DIFFS.length) {
          setDiffChecked(true);
          setDiffResult("complete");
        }
      })
      .catch((err) => console.error("Gagal memuat progres Materi 5:", err))
      .finally(() => {
        if (!cancelled) setLoadingProgress(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── rehydrate status "Materi 5 selesai" ── */
  useEffect(() => {
    let cancelled = false;
    api
      .get("/materi/progress")
      .then((res) => {
        if (cancelled) return;
        const completed = res.data?.completed || [];
        if (completed.includes("konservasi-mangrove")) setFinished(true);
      })
      .catch((err) => console.error("Gagal memuat status penyelesaian Materi 5:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── scroll reveal antar section ── */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  /* ── handler: klik area perbedaan ── */
  const handleSpotClick = (spot) => {
    if (diffResult === "complete") return;
    if (!spot.real) {
      setSpotMsg(spot.id);
      window.clearTimeout(window.__spotTimer);
      window.__spotTimer = setTimeout(() => setSpotMsg(null), 2600);
      return;
    }
    setFoundDiffs((prev) => {
      if (prev.has(spot.id)) return prev;
      saveJawaban("koneksi", `temu-${spot.id}`, { label: DIFFS.find((d) => d.id === spot.id)?.label }, true);
      return new Set(prev).add(spot.id);
    });
    setDiffResult(null);
    setDiffChecked(false);
  };

  const handlePeriksa = () => {
    setDiffChecked(true);
    if (foundDiffs.size === DIFFS.length) setDiffResult("complete");
    else if (foundDiffs.size > 0) setDiffResult("incomplete");
    else setDiffResult("none");
  };

  /* ── handler: tindakan ── */
  const handleTindakanSubmit = () => {
    if (tindakanSelected === null) return;
    if (TINDAKAN.options[tindakanSelected].correct) {
      setTindakanSubmitted(true);
      setTindakanWrongIdx(null);
      saveJawaban("mcq", "tindakan", { selected: tindakanSelected }, true);
      scrollTo(fungsiRef);
    } else {
      setTindakanWrongIdx(tindakanSelected);
    }
  };
  const handleCobaLagi = () => {
    setTindakanSelected(null);
    setTindakanWrongIdx(null);
  };

  /* ── handler: fungsi ── */
  const handleFungsi = (f) => {
    setOpenFungsi((prev) => (prev === f.id ? null : f.id));
    setVisitedFungsi((prev) => {
      if (prev.has(f.id)) return prev;
      saveJawaban("koneksi", `fungsi-${f.id}`, { label: f.label }, true);
      return new Set(prev).add(f.id);
    });
  };

  /* ── handler: manfaat ── */
  const handleProduk = (p) => {
    setOpenProduk(p);
    setVisitedProduk((prev) => {
      if (prev.has(p.id)) return prev;
      saveJawaban("koneksi", `manfaat-${p.id}`, { label: p.nama }, true);
      return new Set(prev).add(p.id);
    });
  };

  /* ── handler: prediksi ── */
  const handlePrediksiSubmit = () => {
    if (!prediksiText.trim()) return;
    const result = classifyPrediksi(prediksiText);
    setPrediksiResult(result);
    const nilai = result === "correct" ? 100 : result === "partial" ? 50 : 0;
    saveJawaban("predict", "prediksi-abrasi", { text: prediksiText, result }, result === "correct", nilai);
  };

  /* ── handler: refleksi ── */
  const handleRefleksiSubmit = () => {
    if (reflSelected === null) return;
    setReflSubmitted(true);
    const isCorrect = reflSelected === REFLEKSI.correct;
    saveJawaban("refleksi", "kesimpulan", { selected: reflSelected }, isCorrect);
    scrollTo(ringkasanRef);
  };

  /* ── handler: selesaikan materi ── */
  const finishRequirements = [
    { done: findDone, label: "Aktivitas 1 — Temukan Perbedaan Kondisi Mangrove" },
    { done: tindakanDone, label: "Aktivitas 2 — Menentukan Tindakan yang Tepat" },
    { done: allFungsiVisited, label: "Eksplorasi — Fungsi Ekologis Mangrove" },
    { done: allProdukVisited, label: "Eksplorasi — Manfaat Mangrove bagi Masyarakat" },
    { done: prediksiDone, label: "Prediksi — Risiko Abrasi" },
    { done: reflDone, label: "Pertanyaan Refleksi" },
  ];
  const allActivitiesDone = finishRequirements.every((r) => r.done);
  const missingActivities = finishRequirements.filter((r) => !r.done);

  const handleFinish = () => {
    if (finishing || finished || !allActivitiesDone) return;
    setFinishing(true);
    setFinishError(null);
    api
      .post("/materi/konservasi-mangrove/complete")
      .then(() => setFinished(true))
      .catch((err) => setFinishError(err?.response?.data?.message || "Gagal menyimpan ke server."))
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
            <span className="current">Konservasi Mangrove</span>
          </div>
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Materi 5 dari 5</span>
          <h1 className="reveal">Menjaga Kelestarian Ekosistem Mangrove</h1>
          <p className="reveal">Amati kondisi mangrove, temukan perbedaannya, dan pelajari cara menjaganya.</p>
        </div>
      </section>

      {/* PROGRESS BAR */}
      <div className="progress-wrap">
        <div className="container">
          <div className="progress-bar-row reveal">
            <span className="progress-label">{loadingProgress ? "Memuat progres tersimpan…" : `Materi 5  ${pct}%`}</span>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          </div>
        </div>
      </div>

      {/* AKTIVITAS 1 — AYO TEMUKAN PERBEDAANNYA */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Aktivitas 1</span>
            <h2>Ayo Temukan Perbedaannya!</h2>
            <p>Amati kedua gambar. Klik area yang menunjukkan perbedaan kondisi ekosistem mangrove.</p>
          </div>

          <div className="spot-grid reveal">
            {/* Gambar A */}
            <div className="spot-card">
              <span className="spot-badge">Gambar A · Kondisi Kiri</span>
              <div className="spot-img-wrap">
                <img src={imgMangroveSehat} alt="Kondisi mangrove yang sehat dan rapat" />
                {SPOTS.filter((s) => s.img === "a").map((spot) => {
                  const isFound = spot.real && foundDiffs.has(spot.id);
                  const isWrong = spotMsg === spot.id;
                  return (
                    <button
                      key={spot.id}
                      className={`spot-dot${isFound ? " found" : ""}${isWrong ? " wrong" : ""}`}
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      onClick={() => handleSpotClick(spot)}
                      aria-label={spot.real ? "Tandai perbedaan" : "Periksa area ini"}
                    >
                      {isFound ? <CheckIcon /> : "🔍"}
                    </button>
                  );
                })}
              </div>
              <div className="spot-caption">
                <strong>Kondisi Kiri</strong>
                <span>Mangrove rapat, organisme banyak, perairan bersih, vegetasi sehat.</span>
              </div>
            </div>

            {/* Gambar B */}
            <div className="spot-card">
              <span className="spot-badge alt">Gambar B · Kondisi Kanan</span>
              <div className="spot-img-wrap">
                <img src={imgMangroveRusak} alt="Kondisi mangrove yang rusak dan jarang" />
                {SPOTS.filter((s) => s.img === "b").map((spot) => {
                  const isFound = spot.real && foundDiffs.has(spot.id);
                  const isWrong = spotMsg === spot.id;
                  return (
                    <button
                      key={spot.id}
                      className={`spot-dot${isFound ? " found" : ""}${isWrong ? " wrong" : ""}`}
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      onClick={() => handleSpotClick(spot)}
                      aria-label={spot.real ? "Tandai perbedaan" : "Periksa area ini"}
                    >
                      {isFound ? <CheckIcon /> : "🔍"}
                    </button>
                  );
                })}
              </div>
              <div className="spot-caption">
                <strong>Kondisi Kanan</strong>
                <span>Mangrove jarang, organisme sedikit, ada sampah, pohon rusak.</span>
              </div>
            </div>
          </div>

          {/* Indikator jumlah perbedaan */}
          <div className="diff-indicator reveal">
            <div className="diff-counter">Perbedaan ditemukan: <strong>{foundDiffs.size}/4</strong></div>
            <div className="diff-chips">
              {DIFFS.map((d) => {
                const found = foundDiffs.has(d.id);
                return (
                  <span key={d.id} className={`diff-chip${found ? " found" : ""}`}>
                    {found ? "✓" : d.icon} {d.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Pesan saat klik area yang salah */}
          {spotMsg && (
            <div className="feedback wrong" key={spotMsg}>
              <XIcon />
              <span>Coba amati kembali kedua gambar. Perhatikan perubahan pada kondisi mangrove dan lingkungan di sekitarnya.</span>
            </div>
          )}

          {/* Tombol periksa / feedback */}
          <div className="diff-actions reveal">
            {diffResult !== "complete" ? (
              <>
                <button className="btn btn-primary" onClick={handlePeriksa}>
                  Periksa <ArrowIcon />
                </button>
                {diffResult === "incomplete" && (
                  <div className="feedback wrong">
                    <XIcon />
                    <span>Masih ada bagian yang belum ditemukan. Coba amati kembali kondisi vegetasi, lingkungan, dan organisme pada kedua gambar.</span>
                  </div>
                )}
                {diffResult === "none" && (
                  <div className="feedback wrong">
                    <XIcon />
                    <span>Coba amati kembali kedua gambar. Perhatikan perubahan pada kondisi mangrove dan lingkungan di sekitarnya.</span>
                  </div>
                )}
              </>
            ) : (
              <div className="feedback correct">
                <CheckIcon />
                <div>
                  <span> Bagus! Kamu menemukan beberapa perbedaan kondisi ekosistem mangrove. Menurutmu, apa yang menyebabkan kondisi tersebut berbeda?</span>
                  <div style={{ marginTop: 12 }}>
                    <button className="btn btn-primary" onClick={() => scrollTo(tindakanRef)}>Lanjut ke Tindakan <ArrowIcon /></button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Penjelasan empat perbedaan setelah selesai */}
          {diffResult === "complete" && (
            <div className="chain-explain reveal">
              <p style={{ color: "#4C5F58", fontSize: "0.92rem", marginBottom: 4 }}>
                Berikut empat perbedaan kondisi ekosistem mangrove yang kamu temukan:
              </p>
              {DIFFS.map((d) => (
                <div className="chain-explain-item" key={d.id}>
                  <span className="emoji">{d.icon}</span>
                  <div>
                    <span className="role">{d.label}</span>
                    <p><strong>Kiri:</strong> {d.kiri}<br /><strong>Kanan:</strong> {d.kanan}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AKTIVITAS 2 — MENENTUKAN TINDAKAN */}
      {findDone && (
        <section className="section section-alt" ref={tindakanRef}>
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Aktivitas 2</span>
              <h2>Menentukan Tindakan yang Tepat</h2>
            </div>
            <div className="quiz-box reveal">
              <span className="eyebrow" style={{ marginBottom: 8 }}>Pertanyaan Pemantik</span>
              <h3>{TINDAKAN.prompt}</h3>
              {TINDAKAN.options.map((opt, i) => {
                const isCorrect = !!opt.correct;
                const state = tindakanSubmitted
                  ? isCorrect ? "correct" : tindakanSelected === i ? "wrong" : ""
                  : tindakanWrongIdx === i ? "wrong" : tindakanSelected === i ? "selected" : "";
                return (
                  <button
                    key={i}
                    className={`quiz-option ${state}`}
                    onClick={() => { if (!tindakanSubmitted) { setTindakanSelected(i); setTindakanWrongIdx(null); } }}
                    disabled={tindakanSubmitted}
                  >
                    <span className="quiz-option-dot">
                      {tindakanSubmitted && isCorrect && <CheckIcon />}
                      {!tindakanSubmitted && tindakanWrongIdx === i && <XIcon />}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
              {tindakanSubmitted ? (
                <div className="feedback correct">
                  <CheckIcon />
                  <div>
                    <span>{TINDAKAN.options.find((o) => o.correct).feedback}</span>
                    <AnimChain steps={TINDAKAN_ANIM} style={{ maxWidth: "100%", margin: "20px 0 0" }} />
                  </div>
                </div>
              ) : tindakanWrongIdx !== null ? (
                <div className="feedback wrong">
                  <XIcon />
                  <div>
                    <span>{TINDAKAN.options[tindakanWrongIdx].feedback}</span>
                    <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={handleCobaLagi}><RefreshIcon /> Coba Lagi</button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-primary" disabled={tindakanSelected === null} onClick={handleTindakanSubmit} style={{ marginTop: 8 }}>
                  Periksa Jawaban <ArrowIcon />
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* EKSPLORASI — FUNGSI EKOLOGIS */}
      {tindakanDone && (
        <section className="section" ref={fungsiRef}>
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Eksplorasi</span>
              <h2>Fungsi Ekologis Mangrove</h2>
              <p>Klik setiap fungsi untuk mengetahui peran mangrove bagi ekosistem.</p>
            </div>
            <div className="impact-grid reveal">
              {FUNGSI.map((f) => {
                const isActive = openFungsi === f.id;
                return (
                  <div key={f.id} className={`impact-btn${visitedFungsi.has(f.id) ? " visited" : ""}${isActive ? " active" : ""}`}>
                    <button className="impact-btn-head" onClick={() => handleFungsi(f)} aria-expanded={isActive}>
                      <div className="impact-icon" style={{ background: f.bg, color: f.color }}><span>{f.emoji}</span></div>
                      <div className="impact-btn-title">
                        <strong>{f.label}</strong>
                        {visitedFungsi.has(f.id) && <span className="visited-tag"> Sudah dilihat</span>}
                      </div>
                      <span className="impact-chevron"><ChevronRightIcon /></span>
                    </button>
                    <div className="impact-detail">
                      <div className="impact-detail-inner">
                        <p>{f.desc}</p>
                        {f.detail && <p className="impact-sub">{f.detail}</p>}
                        {f.anim && <AnimChain steps={f.anim} style={{ maxWidth: "100%", margin: "18px 0 0" }} />}
                        {f.keong && (
                          <div className="keong-subcard">
                            <div className="keong-subcard-head">
                              <span className="keong-subcard-icon">🐚</span>
                              <strong>{f.keong.title}</strong>
                            </div>
                            <p>{f.keong.desc}</p>
                            <p className="keong-subcard-konklusi">{f.keong.konklusi}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {allFungsiVisited && (
              <div className="feedback correct reveal" style={{ marginTop: 22 }}>
                <CheckIcon />
                <span> Kamu sudah mengeksplorasi ketiga fungsi ekologis mangrove! Lanjutkan untuk melihat manfaatnya bagi masyarakat.</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* EKSPLORASI — MANFAAT BAGI MASYARAKAT */}
      {allFungsiVisited && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Eksplorasi</span>
              <h2>Manfaat Mangrove bagi Masyarakat</h2>
              <p>Mangrove tidak hanya memiliki fungsi ekologis, tetapi juga dapat dimanfaatkan oleh masyarakat. Klik setiap produk untuk memperbesarnya.</p>
            </div>
            <div className="produk-grid reveal">
              {MANFAAT.map((p) => (
                <button
                  key={p.id}
                  className={`produk-card${visitedProduk.has(p.id) ? " visited" : ""}`}
                  style={{ "--produk-bg": p.bg, "--produk-accent": p.accent }}
                  onClick={() => handleProduk(p)}
                >
                  <span className="produk-emoji">{p.emoji}</span>
                  <span className="produk-nama">{p.nama}</span>
                  <span className="produk-zoom">🔍 Perbesar</span>
                </button>
              ))}
            </div>
            {allProdukVisited && (
              <div className="feedback correct reveal" style={{ marginTop: 22 }}>
                <CheckIcon />
                <span> Kamu sudah melihat berbagai produk hasil pemanfaatan mangrove. Sekarang, yuk buat prediksi tentang risiko abrasi!</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* PREDIKSI — RISIKO ABRASI */}
      {allProdukVisited && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Prediksi</span>
              <h2>Yuk, Buat Prediksi!</h2>
            </div>
            <div className="quiz-box reveal">
              <span className="eyebrow" style={{ marginBottom: 8 }}>Pertanyaan Prediksi</span>
              <h3>{PREDIKSI.question}</h3>
              <textarea
                className="predict-input"
                placeholder={PREDIKSI.placeholder}
                value={prediksiText}
                onChange={(e) => {
                  setPrediksiText(e.target.value);
                  if (prediksiResult) setPrediksiResult(null);
                }}
                rows={3}
              />
              {!prediksiResult ? (
                <button className="btn btn-primary" disabled={!prediksiText.trim()} onClick={handlePrediksiSubmit} style={{ marginTop: 12 }}>
                  Periksa Prediksi <ArrowIcon />
                </button>
              ) : (
                <div className={`feedback ${prediksiResult === "correct" ? "correct" : prediksiResult === "partial" ? "partial" : "wrong"}`}>
                  {prediksiResult === "correct" ? <CheckIcon /> : prediksiResult === "partial" ? <span style={{ fontSize: "1.1rem" }}>💡</span> : <XIcon />}
                  <div>
                    <span>
                      {prediksiResult === "correct"
                        ? PREDIKSI.feedbackCorrect
                        : prediksiResult === "partial"
                          ? PREDIKSI.feedbackPartial
                          : PREDIKSI.feedbackWrong}
                    </span>
                    {prediksiResult === "correct" && <AnimChain steps={PREDIKSI_ANIM} style={{ maxWidth: "100%", margin: "20px 0 0" }} />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PETA KONSEP — HUBUNGAN FUNGSI MANGROVE */}
      {prediksiDone && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Peta Konsep</span>
              <h2>Hubungan Fungsi Mangrove</h2>
              <p>Setiap fungsi mangrove saling berkaitan dengan keberlangsungan ekosistem dan kehidupan di wilayah pesisir.</p>
            </div>
            {/* Tree / branch concept map */}
            <div className="konsep-tree reveal">
              {/* Root node */}
              <div className="konsep-root">
                <div className="konsep-root-box">🌱 Ekosistem Mangrove</div>
              </div>
              {/* Connector line root → branches */}
              <div className="konsep-vline" />
              {/* Branch nodes */}
              <div className="konsep-branches">
                {/* Branch 1 — Habitat Organisme */}
                <div className="konsep-branch">
                  <div className="konsep-branch-box" style={{ borderColor: "#3D8267", background: "#E1EAE2", color: "#3D8267" }}>
                    <span>🐟</span>
                    <strong>Habitat Organisme</strong>
                  </div>
                  <div className="konsep-branch-leaf">Kepiting &amp; organisme pesisir</div>
                </div>
                {/* Branch 2 — Perlindungan Pesisir */}
                <div className="konsep-branch">
                  <div className="konsep-branch-box" style={{ borderColor: "#2F6B57", background: "#D6EAE1", color: "#2F6B57" }}>
                    <span>🌊</span>
                    <strong>Perlindungan Pesisir</strong>
                  </div>
                  <div className="konsep-branch-leaf">Mengurangi dampak gelombang dan abrasi</div>
                </div>
                {/* Branch 3 — Manfaat Masyarakat */}
                <div className="konsep-branch">
                  <div className="konsep-branch-box" style={{ borderColor: "#E8A33D", background: "#FDF0D5", color: "#CE8324" }}>
                    <span>👥</span>
                    <strong>Manfaat Masyarakat</strong>
                  </div>
                  <div className="konsep-branch-leaf">Produk &amp; pemanfaatan masyarakat</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* REFLEKSI */}
      {prediksiDone && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Refleksi</span>
              <h2>Apa yang Kamu Pikirkan?</h2>
            </div>
            <div className="quiz-box reveal">
              <span className="eyebrow" style={{ marginBottom: 8 }}>Pertanyaan Refleksi</span>
              <h3>{REFLEKSI.question}</h3>
              {REFLEKSI.options.map((opt, i) => {
                const state = !reflSubmitted ? (reflSelected === i ? "selected" : "") : i === REFLEKSI.correct ? "correct" : reflSelected === i ? "wrong" : "";
                return (
                  <button key={i} className={`quiz-option ${state}`} onClick={() => !reflSubmitted && setReflSelected(i)} disabled={reflSubmitted}>
                    <span className="quiz-option-dot">
                      {reflSubmitted && i === REFLEKSI.correct && <CheckIcon />}
                      {reflSubmitted && reflSelected === i && i !== REFLEKSI.correct && <XIcon />}
                    </span>
                    {opt}
                  </button>
                );
              })}
              {!reflSubmitted ? (
                <button className="btn btn-primary" disabled={reflSelected === null} onClick={handleRefleksiSubmit} style={{ marginTop: 8 }}>
                  Periksa Jawaban <ArrowIcon />
                </button>
              ) : (
                <div className={`feedback ${reflSelected === REFLEKSI.correct ? "correct" : "wrong"}`}>
                  {reflSelected === REFLEKSI.correct ? <CheckIcon /> : <XIcon />}
                  <span>{reflSelected === REFLEKSI.correct ? REFLEKSI.feedbackCorrect : REFLEKSI.feedbackWrong}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* RINGKASAN */}
      {reflDone && (
        <section className="section section-alt" ref={ringkasanRef}>
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Ringkasan</span>
              <h2> Yang Sudah Kamu Pelajari</h2>
              <p>Selamat! Kamu telah menyelesaikan seluruh aktivitas Materi 5 tentang Menjaga Kelestarian Ekosistem Mangrove.</p>
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
                <strong style={{ color: "var(--amber)" }}>Menjaga mangrove berarti menjaga ekosistem pesisir dan berbagai kehidupan yang bergantung padanya.</strong>
              </p>
              <button
                className={`btn btn-primary${finished ? " btn-finished" : ""}`}
                onClick={handleFinish}
                disabled={finishing || finished || !allActivitiesDone}
                title={!allActivitiesDone && !finished ? "Selesaikan semua aktivitas Materi 5 terlebih dahulu" : undefined}
              >
                {finished
                  ? <>✅ Materi Telah Diselesaikan</>
                  : finishing
                    ? "Menyimpan..."
                    : <>🎉 Selesaikan Materi 5 <ArrowIcon /></>}
              </button>
              {finishError && <p style={{ color: "#ffbbbb", marginTop: 12, fontSize: "0.85rem" }}>{finishError}</p>}
              {!finished && !allActivitiesDone && (
                <div style={{ marginTop: 16, textAlign: "left", background: "rgba(251,250,245,0.1)", borderRadius: 12, padding: "14px 18px" }}>
                  <p style={{ color: "var(--amber)", fontSize: "0.85rem", fontWeight: 700, margin: "0 0 8px" }}>
                    ⚠️ Lengkapi aktivitas berikut sebelum menyelesaikan Materi 5:
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
                onClick={() => { if (!finished) { setShowLock(true); } else { navigate("/lab"); } }}
              >
                Laboratorium Virtual <ArrowIcon />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* MODAL PRODUK (MANFAAT) */}
      {openProduk && (
        <div className="impact-modal-overlay" onClick={() => setOpenProduk(null)}>
          <div className="impact-modal" onClick={(e) => e.stopPropagation()} style={{ "--produk-bg": openProduk.bg, "--produk-accent": openProduk.accent }}>
            <button className="impact-modal-close" onClick={() => setOpenProduk(null)} aria-label="Tutup"><CloseIcon /></button>
            {/* Gambar produk dengan fallback emoji */}
            <div className="produk-modal-img-wrap">
              <img
                src={openProduk.img}
                alt={openProduk.nama}
                className="produk-modal-img"
                onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
              />
              <div className="produk-modal-emoji" style={{ display: "none" }}>{openProduk.emoji}</div>
            </div>
            <h3>{openProduk.nama}</h3>
            {openProduk.desc && <p className="produk-modal-desc">{openProduk.desc}</p>}
            <button className="btn btn-outline btn-sm" style={{ marginTop: 18 }} onClick={() => setOpenProduk(null)}>Tutup</button>
          </div>
        </div>
      )}

      {/* LOCK MODAL */}
      {showLock && (
        <div className="lock-overlay" onClick={() => setShowLock(false)}>
          <div className="lock-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lock-close" onClick={() => setShowLock(false)}><XIcon /></button>
            <div className="lock-icon">🔒</div>
            <h3>Materi Belum Selesai</h3>
            <p>Selesaikan seluruh aktivitas Materi 5 dan klik tombol <strong>"Selesaikan Materi 5"</strong> terlebih dahulu sebelum melanjutkan ke Laboratorium Virtual.</p>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setShowLock(false)}>
              Kembali ke Materi 5
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
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
  .feedback.partial{background:#FBF0DA;color:#7A4E10;}
  .feedback svg{width:18px;height:18px;flex-shrink:0;margin-top:2px;}
  .compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
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
  .chain-explain{margin-top:30px;display:flex;flex-direction:column;gap:14px;}
  .chain-explain-item{display:flex;gap:14px;background:var(--paper);border-radius:16px;padding:18px 20px;box-shadow:0 4px 16px -10px rgba(15,36,29,0.14);align-items:flex-start;}
  .chain-explain-item .emoji{font-size:1.5rem;flex-shrink:0;}
  .chain-explain-item .role{font-family:'Space Mono',monospace;font-size:0.62rem;font-weight:700;text-transform:uppercase;color:var(--estuary);letter-spacing:0.05em;display:block;margin-bottom:3px;}
  .chain-explain-item p{font-size:0.86rem;color:#4C5F58;line-height:1.55;}
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
  .impact-btn.active .impact-detail{max-height:600px;}
  .impact-detail-inner{padding:0 20px 20px 84px;display:flex;flex-direction:column;gap:8px;}
  .impact-detail-inner p{font-size:0.92rem;color:#33473F;line-height:1.65;}
  .impact-detail-inner p.impact-sub{color:#556961;font-size:0.85rem;border-top:1px solid rgba(15,36,29,0.08);padding-top:10px;margin-top:2px;}
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
  .produk-modal-img-wrap{width:100%;aspect-ratio:4/3;border-radius:16px;overflow:hidden;background:var(--produk-bg);margin-bottom:4px;}
  .produk-modal-img{width:100%;height:100%;object-fit:cover;display:block;}
  .produk-modal-desc{margin-top:6px;font-size:0.9rem;color:#33473F;line-height:1.65;}

  /* ===== Peta Konsep Tree ===== */
  .konsep-tree{display:flex;flex-direction:column;align-items:center;margin:28px auto;max-width:780px;}
  .konsep-root{display:flex;justify-content:center;}
  .konsep-root-box{background:linear-gradient(135deg,var(--tide-pale),var(--sand));border:2px solid var(--estuary);border-radius:16px;padding:16px 36px;font-size:1rem;font-weight:700;color:var(--canopy);box-shadow:0 8px 20px -10px rgba(47,107,87,0.35);text-align:center;}
  .konsep-vline{width:2px;height:32px;background:rgba(47,107,87,0.3);margin:0 auto;}
  .konsep-branches{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;width:100%;position:relative;}
  .konsep-branches::before{content:"";position:absolute;top:0;left:calc(50% - 1px);width:2px;height:0;}
  .konsep-branch{display:flex;flex-direction:column;align-items:center;gap:10px;flex:1;min-width:180px;max-width:240px;}
  .konsep-branch-box{border:2px solid;border-radius:14px;padding:14px 16px;font-size:0.88rem;font-weight:700;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;width:100%;box-shadow:0 4px 14px -8px rgba(15,36,29,0.18);transition:transform .2s ease,box-shadow .2s ease;}
  .konsep-branch-box:hover{transform:translateY(-3px);box-shadow:0 10px 22px -10px rgba(15,36,29,0.28);}
  .konsep-branch-box span{font-size:1.5rem;}
  .konsep-branch-leaf{background:var(--paper);border-radius:10px;padding:10px 14px;font-size:0.8rem;color:#4C5F58;text-align:center;line-height:1.5;width:100%;border:1px solid rgba(15,36,29,0.08);box-shadow:0 2px 8px -6px rgba(15,36,29,0.12);}
  @media(max-width:600px){.konsep-branches{flex-direction:column;align-items:center;}.konsep-branch{min-width:240px;max-width:100%;}}

  /* ===== Temukan perbedaan (Materi 5) ===== */
  .spot-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
  .spot-card{background:var(--paper);border-radius:var(--radius-lg);overflow:hidden;box-shadow:0 20px 40px -22px rgba(15,36,29,0.3);}
  .spot-badge{font-family:'Space Mono',monospace;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--estuary);padding:14px 20px 0;display:block;}
  .spot-badge.alt{color:var(--danger);}
  .spot-img-wrap{position:relative;line-height:0;background:var(--tide-pale);}
  .spot-img-wrap img{width:100%;height:auto;display:block;}
  .spot-dot{position:absolute;width:38px;height:38px;border-radius:50%;background:rgba(251,250,245,0.85);border:2px dashed var(--amber);color:var(--amber-deep);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.9rem;transform:translate(-50%,-50%);transition:background .2s ease,transform .2s ease,border-color .2s ease;animation:spotPulse 1.8s ease-in-out infinite;box-shadow:0 4px 14px -6px rgba(15,36,29,0.4);}
  .spot-dot svg{width:18px;height:18px;}
  .spot-dot:hover{transform:translate(-50%,-50%) scale(1.12);}
  .spot-dot.found{background:var(--estuary);border-style:solid;border-color:var(--estuary);color:#fff;animation:none;}
  .spot-dot.wrong{background:var(--danger);border-color:var(--danger);color:#fff;animation:none;}
  @keyframes spotPulse{0%,100%{box-shadow:0 0 0 0 rgba(232,163,61,0.5);}50%{box-shadow:0 0 0 9px rgba(232,163,61,0);}}
  .spot-caption{padding:14px 20px;display:flex;flex-direction:column;gap:2px;}
  .spot-caption strong{font-size:0.9rem;color:var(--canopy);}
  .spot-caption span{font-size:0.8rem;color:#556961;}
  .diff-indicator{margin-top:26px;background:var(--paper);border-radius:var(--radius-md);padding:20px 24px;box-shadow:0 10px 26px -18px rgba(15,36,29,0.2);}
  .diff-counter{font-size:0.95rem;font-weight:700;color:var(--canopy);margin-bottom:14px;}
  .diff-counter strong{color:var(--estuary);font-family:'Space Mono',monospace;}
  .diff-chips{display:flex;flex-wrap:wrap;gap:10px;}
  .diff-chip{display:inline-flex;align-items:center;gap:6px;font-size:0.82rem;font-weight:600;color:#7A8B83;background:var(--sand-deep);padding:8px 14px;border-radius:999px;border:1.5px solid transparent;transition:all .25s ease;}
  .diff-chip.found{color:var(--estuary);background:#E4EFE7;border-color:var(--estuary);}
  .diff-actions{margin-top:24px;}

  /* ===== Prediksi ===== */
  .predict-input{width:100%;border-radius:14px;border:1.5px solid rgba(15,36,29,0.14);background:var(--sand);padding:16px 18px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.92rem;resize:vertical;color:var(--ink);}
  .predict-input:focus{outline:none;border-color:var(--estuary);}

  /* ===== Manfaat (produk) ===== */
  .produk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
  .produk-card{background:var(--paper);border-radius:18px;padding:26px 18px;display:flex;flex-direction:column;align-items:center;gap:12px;cursor:pointer;border:2px solid rgba(15,36,29,0.06);box-shadow:0 4px 16px -10px rgba(15,36,29,0.12);transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;font-family:'Plus Jakarta Sans',sans-serif;}
  .produk-card:hover{transform:translateY(-5px);box-shadow:0 16px 30px -16px rgba(15,36,29,0.28);border-color:var(--produk-accent);}
  .produk-card.visited{border-color:var(--tide);}
  .produk-emoji{width:72px;height:72px;border-radius:20px;background:var(--produk-bg);display:flex;align-items:center;justify-content:center;font-size:2.2rem;transition:transform .25s ease;}
  .produk-card:hover .produk-emoji{transform:scale(1.1) rotate(-4deg);}
  .produk-nama{font-size:0.9rem;font-weight:700;color:var(--canopy);text-align:center;line-height:1.35;}
  .produk-zoom{font-size:0.72rem;font-weight:600;color:var(--silt);}
  .produk-modal-emoji{width:100%;aspect-ratio:4/3;border-radius:16px;background:var(--produk-bg);display:flex;align-items:center;justify-content:center;font-size:3rem;margin-bottom:4px;}
  /* ===== sub-card Keong Potamididae ===== */
  .keong-subcard{margin-top:14px;background:var(--sand);border-radius:14px;padding:16px 18px;border:1.5px solid rgba(47,107,87,0.15);display:flex;flex-direction:column;gap:8px;}
  .keong-subcard-head{display:flex;align-items:center;gap:10px;margin-bottom:4px;}
  .keong-subcard-icon{font-size:1.4rem;}
  .keong-subcard-head strong{font-size:0.9rem;color:var(--canopy);}
  .keong-subcard p{font-size:0.85rem;color:#33473F;line-height:1.6;margin:0;}
  .keong-subcard-konklusi{font-style:italic;color:var(--estuary)!important;}

  @media(max-width:980px){.spot-grid{grid-template-columns:1fr;}.summary-cards{grid-template-columns:1fr;}.produk-grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:768px){.page-banner{padding:110px 0 44px;}.section{padding:50px 0;}.quiz-box{padding:24px 20px;}.impact-detail-inner{padding-left:20px;}}
  @media(max-width:600px){.container{padding:0 20px;}.page-banner h1{font-size:1.6rem;}.section-head h2{font-size:1.4rem;}.materi-nav{flex-direction:column;align-items:stretch;}.produk-grid{grid-template-columns:1fr;}}
`;
