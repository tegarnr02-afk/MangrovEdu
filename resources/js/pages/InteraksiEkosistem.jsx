import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import sceneImg from "./ekosistem-mangrove-scene.png";
// Sesuaikan path ini kalau lokasi file axios instance-mu berbeda.
import api from "../lib/api";

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
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 15 15 9M8 13.5 5.6 15.9a3.5 3.5 0 0 0 5 5L13 18.4M16 10.5l2.4-2.4a3.5 3.5 0 0 0-5-5L11 5.6" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="3" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* ================= BAGIAN 1: 7 KOMPONEN EKOSISTEM =================
   Posisi (top/left) sama dengan Materi 1 supaya ilustrasi terasa konsisten. */
const hotspots = [
  {
    id: "mangrove",
    label: "Mangrove",
    emoji: "🌱",
    top: "34%",
    left: "52%",
    jenis: "Biotik",
    paragraphs: [
      "Mangrove adalah tumbuhan khas pantai yang tahan terhadap air asin dan memiliki akar unik yang dapat muncul ke atas tanah untuk bernapas.",
      "Sebagai produsen, mangrove melakukan fotosintesis dan menyerap karbon dioksida. Akarnya yang rapat membantu menjebak sedimen dan lumpur, mengurangi abrasi, serta menjadi tempat hidup bagi kepiting, ikan, dan burung.",
    ],
    peran: [
      "Produsen",
      "Membantu mengurangi abrasi",
      "Menjebak sedimen dan lumpur",
      "Menjadi habitat berbagai organisme",
      "Menyerap karbon dioksida",
    ],
  },
  {
    id: "air",
    label: "Air",
    emoji: "🌊",
    top: "50%",
    left: "85%",
    jenis: "Abiotik",
    paragraphs: [
      "Air laut yang mengalami pasang surut membawa garam, oksigen, dan nutrisi ke ekosistem mangrove.",
      "Kadar garam atau salinitas air dapat menentukan jenis mangrove yang mampu tumbuh di suatu area.",
    ],
    note: "Perubahan kondisi air dapat memengaruhi kehidupan mangrove.",
  },
  {
    id: "tanah",
    label: "Tanah / Sedimen",
    emoji: "🟤",
    top: "94%",
    left: "12%",
    jenis: "Abiotik",
    paragraphs: [
      "Tanah di hutan mangrove biasanya berlumpur atau berpasir. Tanah menjadi tempat akar mangrove mencengkeram dan tumbuh.",
      "Semakin banyak lumpur dan bahan organik, tanah dapat menjadi lebih subur sehingga mangrove dapat tumbuh lebih rapat.",
      "Kepiting yang membuat lubang di tanah juga membantu menyuburkan dan memberikan udara pada tanah.",
    ],
  },
  {
    id: "cahaya",
    label: "Cahaya Matahari",
    emoji: "☀️",
    top: "9%",
    left: "16%",
    jenis: "Abiotik",
    paragraphs: [
      "Cahaya matahari merupakan sumber energi utama bagi mangrove untuk melakukan fotosintesis.",
      "Cahaya membantu mangrove mengubah karbon dioksida dan air menjadi makanan serta oksigen.",
      "Cahaya matahari juga memengaruhi suhu air dan tanah di sekitarnya.",
    ],
    note: "Fakta menarik: jika suhu akibat panas matahari terlalu tinggi (di atas sekitar 38°C), proses fotosintesis pada daun mangrove dapat berhenti.",
  },
  {
    id: "kepiting",
    label: "Kepiting",
    emoji: "🦀",
    top: "66%",
    left: "24%",
    jenis: "Biotik",
    paragraphs: [
      "Kepiting bakau hidup di lubang-lubang tanah hutan mangrove. Kepiting membantu menguraikan bahan organik dan membuat tanah menjadi lebih subur serta memiliki udara.",
      "Kepiting juga menjadi sumber pangan penting bagi nelayan.",
    ],
    note: "Jika hutan mangrove rusak, populasi kepiting dapat menurun dan hasil tangkapan nelayan dapat ikut berkurang.",
  },
  {
    id: "ikan",
    label: "Ikan",
    emoji: "🐟",
    top: "78%",
    left: "80%",
    jenis: "Biotik",
    paragraphs: [
      "Banyak jenis ikan menggunakan hutan mangrove sebagai tempat hidup ketika masih muda.",
      "Mangrove menjadi tempat asuhan anakan ikan atau nursery ground, tempat mencari makan, dan tempat memijah.",
    ],
    note: "Semakin rapat dan luas hutan mangrove, semakin banyak tempat berlindung dan makanan bagi ikan.",
  },
  {
    id: "burung",
    label: "Burung",
    emoji: "🐦",
    top: "24%",
    left: "75%",
    jenis: "Biotik",
    paragraphs: [
      "Hutan mangrove menjadi tempat tinggal, persinggahan, dan sumber makanan bagi berbagai jenis burung, termasuk burung migran.",
      "Burung berperan sebagai predator dalam rantai makanan dan dapat menjadi salah satu indikator kesehatan ekosistem mangrove.",
    ],
  },
];

/* ================= BAGIAN 2: EKSPLORASI HUBUNGAN ================= */
const relations = [
  {
    id: "air-mangrove",
    fromEmoji: "🌊",
    fromLabel: "Air",
    toEmoji: "🌱",
    toLabel: "Mangrove",
    question:
      "Mangrove hidup di daerah pesisir yang dipengaruhi oleh kondisi air. Menurutmu, apa yang mungkin terjadi jika kondisi air di sekitar mangrove berubah?",
    options: [
      "Pertumbuhan mangrove dapat terganggu.",
      "Mangrove tetap tumbuh tanpa dipengaruhi kondisi air.",
      "Mangrove tidak membutuhkan air untuk hidup.",
    ],
    correct: 0,
    feedbackCorrect:
      "Benar! Kondisi air merupakan salah satu faktor lingkungan yang dapat memengaruhi kehidupan mangrove. Jika kondisi air berubah, pertumbuhan mangrove dapat ikut terdampak.",
    feedbackWrong:
      "Mangrove merupakan tumbuhan yang hidup di lingkungan pesisir. Apakah perubahan kondisi air mungkin memengaruhi kehidupannya?",
  },
  {
    id: "cahaya-mangrove",
    fromEmoji: "☀️",
    fromLabel: "Cahaya",
    toEmoji: "🌱",
    toLabel: "Mangrove",
    question: "Cahaya matahari merupakan sumber energi bagi mangrove. Menurutmu, apa fungsi cahaya matahari bagi mangrove?",
    options: [
      "Membantu mangrove melakukan fotosintesis.",
      "Membuat mangrove tidak membutuhkan air.",
      "Menghentikan pertumbuhan mangrove.",
    ],
    correct: 0,
    feedbackCorrect: "Benar! Cahaya matahari merupakan sumber energi utama bagi mangrove untuk melakukan fotosintesis.",
    feedbackWrong: "Coba ingat kembali bahwa mangrove merupakan tumbuhan. Tumbuhan membutuhkan cahaya untuk proses fotosintesis.",
  },
  {
    id: "mangrove-kepiting",
    fromEmoji: "🌱",
    fromLabel: "Mangrove",
    toEmoji: "🦀",
    toLabel: "Kepiting",
    question:
      "Kepiting dapat ditemukan di sekitar ekosistem mangrove. Menurutmu, apa yang mungkin terjadi pada kepiting jika mangrove di sekitarnya berkurang?",
    options: [
      "Kepiting dapat kehilangan tempat hidup atau berlindung.",
      "Kepiting mendapatkan lebih banyak tempat berlindung.",
      "Tidak terjadi perubahan apa pun pada kepiting.",
    ],
    correct: 0,
    feedbackCorrect: "Benar! Berkurangnya mangrove dapat mengurangi tempat hidup dan berlindung bagi organisme seperti kepiting.",
    feedbackWrong: "Kepiting hidup di sekitar mangrove. Coba bayangkan apa yang terjadi jika tempat hidup dan berlindungnya semakin sedikit.",
  },
  {
    id: "mangrove-ikan",
    fromEmoji: "🌱",
    fromLabel: "Mangrove",
    toEmoji: "🐟",
    toLabel: "Ikan",
    question:
      "Mangrove menjadi bagian dari lingkungan hidup berbagai organisme. Jika jumlah mangrove berkurang, apa yang mungkin terjadi pada ikan yang hidup di sekitarnya?",
    options: [
      "Habitat ikan dapat ikut berkurang.",
      "Habitat ikan pasti bertambah.",
      "Ikan tidak akan terpengaruh sama sekali.",
    ],
    correct: 0,
    feedbackCorrect:
      "Benar! Berkurangnya mangrove dapat menyebabkan perubahan pada habitat ikan dan organisme lain yang bergantung pada ekosistem tersebut.",
    feedbackWrong: "Ikan membutuhkan lingkungan untuk hidup. Jika jumlah mangrove berkurang, apakah kondisi habitat di sekitarnya masih sama?",
  },
];

/* ================= BAGIAN 3: RANTAI MAKANAN ================= */
const chainCards = [
  { id: "mangrove", emoji: "🌱", label: "Mangrove", role: "Produsen" },
  { id: "serasah", emoji: "🍂", label: "Serasah / Detritus Mangrove", role: "Sumber Energi" },
  { id: "kepiting-detritus", emoji: "🦀", label: "Kepiting Pemakan Detritus", role: "Konsumen I" },
  { id: "ikan-kerapu", emoji: "🐟", label: "Ikan Kerapu", role: "Konsumen II" },
  { id: "pengurai", emoji: "🦠", label: "Bakteri & Jamur", role: "Pengurai" },
];
const correctOrder = ["mangrove", "serasah", "kepiting-detritus", "ikan-kerapu", "pengurai"];
const initialPoolOrder = ["kepiting-detritus", "pengurai", "mangrove", "ikan-kerapu", "serasah"];
const chainExplanations = {
  mangrove:
    "Pohon mangrove menghasilkan daun yang gugur menjadi serasah. Serasah tersebut menjadi sumber energi utama dalam ekosistem mangrove setelah mengalami proses pembusukan.",
  serasah:
    "Serasah yang jatuh ke perairan atau lumpur terurai menjadi detritus, yaitu partikel bahan organik halus yang menjadi sumber makanan penting bagi biota mangrove.",
  "kepiting-detritus":
    "Kepiting seperti Uca sp. atau Sesarma sp. memakan detritus dari sedimen dan membantu menghancurkan serasah menjadi bagian yang lebih kecil.",
  "ikan-kerapu": "Ikan seperti kerapu memangsa kepiting dan ikan kecil lainnya sehingga menempati tingkat konsumen yang lebih tinggi.",
  pengurai:
    "Bakteri dan jamur menguraikan sisa organisme mati, bangkai, feses, dan serasah yang tidak termakan menjadi bahan yang lebih sederhana. Hasil penguraian tersebut membantu menyuburkan lingkungan mangrove sehingga siklus dapat berlangsung kembali.",
};

/* ================= BAGIAN 4: RINGKASAN ================= */
const ringkasanPoints = [
  "🌱 Mangrove merupakan produsen dan habitat berbagai organisme.",
  "🌊 Air merupakan faktor abiotik yang memengaruhi kehidupan mangrove.",
  "☀️ Cahaya matahari merupakan sumber energi untuk fotosintesis.",
  "🟤 Tanah/sedimen menjadi tempat tumbuh dan berkembangnya mangrove.",
  "🦀 Kepiting, 🐟 ikan, dan 🐦 burung merupakan komponen biotik yang bergantung pada ekosistem mangrove.",
  "🔗 Setiap komponen saling berhubungan.",
  "🍂 Rantai makanan menunjukkan perpindahan energi dan peran organisme dalam ekosistem.",
];

export default function InteraksiEkosistem() {
  const navigate = useNavigate();

  /* ---- Bagian 1: eksplorasi komponen ---- */
  const [activeHotspotId, setActiveHotspotId] = useState(null);
  const [visitedHotspots, setVisitedHotspots] = useState(new Set());

  /* ---- Bagian 2: eksplorasi hubungan ---- */
  const [activeRelationId, setActiveRelationId] = useState(relations[0].id);
  const [relationAnswers, setRelationAnswers] = useState({});
  const [visitedRelations, setVisitedRelations] = useState(new Set());
  const [showChainSection, setShowChainSection] = useState(false);
  const chainSectionRef = useRef(null);

  /* ---- Bagian 3: rantai makanan (tap-to-place) ---- */
  const [pool, setPool] = useState(initialPoolOrder);
  const [slots, setSlots] = useState([null, null, null, null, null]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [chainSubmitted, setChainSubmitted] = useState(false);
  const [chainCorrect, setChainCorrect] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  /* ---- Bagian 4: ringkasan ---- */
  const [summaryReached, setSummaryReached] = useState(false);
  const summaryRef = useRef(null);

  /* ---- Restore progres dari database (biar tidak reset) ---- */
  const [loadingProgress, setLoadingProgress] = useState(true);

  /* ---- Status tombol "Selesai Materi 2" — dideklarasikan di sini (bukan
     dekat handleFinishMateri di bawah) karena effect rehydrate berikutnya
     sudah perlu memanggil setMateriFinished; harus terdefinisi duluan
     supaya tidak kena ReferenceError (temporal dead zone), sama seperti
     pola yang dipakai di Materi 1. ---- */
  const [finishingMateri, setFinishingMateri] = useState(false);
  const [materiFinished, setMateriFinished] = useState(false);

  /* ---- Peringatan Materi 2 belum selesai (saat mau lanjut ke Materi 3) ---- */
  const [showLockWarning, setShowLockWarning] = useState(false);

  /* Derived values needed by useEffect deps — must be declared BEFORE the effect */
  const stage1Done = visitedHotspots.size === hotspots.length;
  const stage2Done = visitedRelations.size === relations.length;
  // Lanjut ke ringkasan begitu rantai makanan sudah diperiksa, tidak wajib benar.
  const stage3Done = chainSubmitted;

  /* Ambil progres materi 2 milik user dari database saat halaman dibuka,
     supaya hotspot, jawaban relasi, dan rantai makanan yang pernah diisi
     tidak perlu diulang lagi. */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api.get("/materi2/jawaban");
        if (cancelled) return;

        if (Array.isArray(data.hotspot) && data.hotspot.length > 0) {
          setVisitedHotspots(new Set(data.hotspot));
        }

        if (data.relasi && Object.keys(data.relasi).length > 0) {
          const restoredAnswers = {};
          const restoredVisited = new Set();
          Object.entries(data.relasi).forEach(([relId, val]) => {
            restoredAnswers[relId] = {
              selected: val.selected,
              submitted: true,
              correct: !!val.is_correct,
            };
            restoredVisited.add(relId);
          });
          setRelationAnswers(restoredAnswers);
          setVisitedRelations(restoredVisited);
        }

        if (data.rantai && Array.isArray(data.rantai.urutan) && data.rantai.urutan.length === 5) {
          setSlots(data.rantai.urutan);
          setPool(initialPoolOrder.filter((id) => !data.rantai.urutan.includes(id)));
          setChainSubmitted(true);
          setChainCorrect(!!data.rantai.is_correct);
          setShowChainSection(true);
          // Materi sudah pernah dituntaskan sampai rantai makanan pada sesi sebelumnya,
          // jadi checkpoint "mencapai Ringkasan" tidak perlu menunggu scroll ulang.
          setSummaryReached(true);
        }
      } catch (err) {
        console.error("Gagal memuat progres materi 2:", err);
      } finally {
        if (!cancelled) setLoadingProgress(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- Rehydrate status "Materi 2 selesai" dari database ----
     Dicek terpisah dari jawaban di atas, lewat endpoint yang sama dipakai
     Materi.jsx dan Materi 1 (GET /materi/progress → { completed: [slug,...] }).
     Kalau slug "interaksi-ekosistem" sudah ada di daftar itu, tombol
     "Selesai Materi 2" langsung tampil sebagai "selesai" meski halaman
     baru saja di-refresh. */
  useEffect(() => {
    let cancelled = false;
    api
      .get("/materi/progress")
      .then((res) => {
        if (cancelled) return;
        const completed = res.data?.completed || [];
        if (completed.includes("interaksi-ekosistem")) {
          setMateriFinished(true);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat status penyelesaian Materi 2:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let io = null;
    const raf = requestAnimationFrame(() => {
      const revealEls = document.querySelectorAll(".reveal:not(.show)");
      io = new IntersectionObserver(
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
    });
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [stage1Done, stage2Done, showChainSection, stage3Done]);

  useEffect(() => {
    if (!summaryRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSummaryReached(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(summaryRef.current);
    return () => io.disconnect();
  }, [chainCorrect]);

  /* ---- handlers: hotspot ---- */
  const activeHotspot = hotspots.find((h) => h.id === activeHotspotId) || null;
  const handleHotspotClick = (h) => {
    const alreadyVisited = visitedHotspots.has(h.id);
    setActiveHotspotId(h.id);
    setVisitedHotspots((prev) => new Set(prev).add(h.id));

    if (!alreadyVisited) {
      api
        .post("/materi2/jawaban", {
          item_type: "hotspot",
          item_id: h.id,
          is_correct: true,
          nilai: 100,
        })
        .catch((err) => console.error("Gagal menyimpan progres hotspot:", err));
    }
  };

  /* ---- handlers: relasi ---- */
  const activeRelation = relations.find((r) => r.id === activeRelationId);
  const activeRelationState = relationAnswers[activeRelationId] || { selected: null, submitted: false };

  const selectRelationOption = (relId, idx) => {
    setRelationAnswers((prev) => {
      const cur = prev[relId];
      // Sekali sudah diperiksa (benar ataupun salah), pilihan dikunci — tidak ada ubah jawaban lagi.
      if (cur && cur.submitted) return prev;
      return { ...prev, [relId]: { selected: idx, submitted: false } };
    });
  };
  const submitRelationAnswer = (r) => {
    const cur = relationAnswers[r.id];
    if (!cur || cur.selected === null || cur.selected === undefined) return;
    const isCorrect = cur.selected === r.correct;
    setRelationAnswers((prev) => ({ ...prev, [r.id]: { selected: cur.selected, submitted: true, correct: isCorrect } }));
    // Dianggap "sudah dijelajahi" begitu diperiksa, terlepas dari benar/salah,
    // supaya user tetap bisa lanjut ke bagian berikutnya.
    setVisitedRelations((prev) => new Set(prev).add(r.id));

    api
      .post("/materi2/jawaban", {
        item_type: "relasi",
        item_id: r.id,
        is_correct: isCorrect,
        nilai: isCorrect ? 100 : 0,
        detail: { selected: cur.selected },
      })
      .catch((err) => console.error("Gagal menyimpan jawaban relasi:", err));
  };


  const goToChainSection = () => {
    setShowChainSection(true);
    setTimeout(() => chainSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  /* ---- handlers: rantai makanan ---- */
  const cardById = (id) => chainCards.find((c) => c.id === id);
  // Dikunci begitu diperiksa, terlepas dari benar/salah — tidak ada "coba lagi".
  const locked = chainSubmitted;

  const onPoolCardClick = (id) => {
    if (locked) return;
    setSelectedCard((prev) => (prev === id ? null : id));
  };

  const onSlotClick = (index) => {
    if (locked) return;
    const current = slots[index];

    if (selectedCard) {
      const newSlots = [...slots];
      newSlots[index] = selectedCard;
      let newPool = pool.filter((id) => id !== selectedCard);
      if (current) newPool = [...newPool, current];
      setSlots(newSlots);
      setPool(newPool);
      setSelectedCard(null);
      setChainSubmitted(false);
    } else if (current) {
      const newSlots = [...slots];
      newSlots[index] = null;
      setSlots(newSlots);
      setPool((prev) => [...prev, current]);
      setSelectedCard(current);
      setChainSubmitted(false);
    }
  };

  const allSlotsFilled = slots.every((s) => s !== null);
  const submitChain = () => {
    if (!allSlotsFilled) return;
    const isCorrect = slots.every((id, i) => id === correctOrder[i]);
    setChainSubmitted(true);
    setChainCorrect(isCorrect);

    api
      .post("/materi2/jawaban", {
        item_type: "rantai",
        item_id: "rantai-makanan",
        is_correct: isCorrect,
        nilai: isCorrect ? 100 : 0,
        detail: { urutan: slots },
      })
      .catch((err) => console.error("Gagal menyimpan jawaban rantai makanan:", err));
  };
  /* ---- drag & drop ---- */
  const handleDragStart = (id, e) => {
    if (locked) return;
    setDraggingId(id);
    setSelectedCard(null);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };
  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverSlot(null);
  };
  const moveCardToSlot = (id, destIndex) => {
    if (locked || !id) return;
    const fromSlotIndex = slots.indexOf(id);
    const destCurrent = slots[destIndex];
    if (fromSlotIndex === destIndex) return;
    const newSlots = [...slots];
    let newPool = pool.filter((p) => p !== id);
    if (fromSlotIndex !== -1) {
      newSlots[fromSlotIndex] = destCurrent && fromSlotIndex !== destIndex ? destCurrent : null;
    } else if (destCurrent) {
      newPool = [...newPool, destCurrent];
    }
    newSlots[destIndex] = id;
    setSlots(newSlots);
    setPool(newPool);
    setSelectedCard(null);
    setChainSubmitted(false);
  };
  const moveCardToPool = (id) => {
    if (locked || !id) return;
    const fromSlotIndex = slots.indexOf(id);
    if (fromSlotIndex === -1) return;
    const newSlots = [...slots];
    newSlots[fromSlotIndex] = null;
    setSlots(newSlots);
    setPool((prev) => [...prev, id]);
    setSelectedCard(null);
    setChainSubmitted(false);
  };
  const handleSlotDragOver = (index, e) => {
    e.preventDefault();
    setDragOverSlot(index);
  };
  const handleSlotDrop = (index, e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    moveCardToSlot(id, index);
    setDraggingId(null);
    setDragOverSlot(null);
  };
  const handlePoolDragOver = (e) => {
    e.preventDefault();
  };
  const handlePoolDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    moveCardToPool(id);
    setDraggingId(null);
  };

  const progressPercent = (stage1Done ? 25 : 0) + (stage2Done ? 25 : 0) + (stage3Done ? 25 : 0) + (summaryReached ? 25 : 0);

  /* ── tandai Materi 2 selesai ──
     Sama seperti Materi 1: manggil POST /materi/{slug}/complete (MateriProgressController)
     yang mencatat completed_at di tabel user_materi_progress, supaya Materi 3
     otomatis ter-unlock di daftar materi. Tombol dinonaktifkan sementara request
     berjalan supaya tidak diklik dobel.

     Berbeda dari sebelumnya: tombol ini TIDAK langsung memindahkan siswa
     ke daftar materi. Setelah diklik, tombol berubah menjadi status
     "selesai" (materiFinished) dan siswa tetap di halaman ini. Klik
     tombol inilah — bukan sekadar menyelesaikan ketiga bagian di atas —
     yang menjadi syarat untuk membuka navigasi ke Materi 3 di bawah.
     (State finishingMateri/materiFinished dideklarasikan di atas, dekat
     effect rehydrate progres, karena effect itu butuh setMateriFinished.) */

  const handleFinishMateri = () => {
    if (finishingMateri || materiFinished) return;
    setFinishingMateri(true);
    api
      .post("/materi/interaksi-ekosistem/complete")
      .then(() => {
        setMateriFinished(true);
      })
      .catch((err) => {
        console.error("Gagal menandai Materi 2 selesai:", err);
        // Tetap tandai selesai di sisi tampilan supaya siswa tidak terjebak,
        // meskipun status di server mungkin belum tersimpan — akan tersimpan
        // ulang saat mereka membuka halaman ini lagi nanti.
        setMateriFinished(true);
      })
      .finally(() => setFinishingMateri(false));
  };


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@600;700&family=Space+Mono:wght@400;700&display=swap');
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
        .btn-sm{ padding:8px 16px; font-size:0.8rem; }
        .btn:disabled{ opacity:0.45; cursor:not-allowed; transform:none !important; }
        .btn-finished:disabled{ opacity:1; background:var(--estuary); color:var(--paper); box-shadow:none; }
        .btn-block{ width:100%; justify-content:center; }

        /* ===== Banner & progress ===== */
        .page-banner{ background:var(--canopy); padding:130px 0 44px; }
        .breadcrumb{ display:flex; align-items:center; gap:8px; font-size:0.85rem; color:rgba(251,250,245,0.65); margin-bottom:18px; flex-wrap:wrap; }
        .breadcrumb a:hover{ color:var(--amber); }
        .breadcrumb span.current{ color:rgba(251,250,245,0.9); }
        .page-banner h1{ color:var(--paper); font-size:clamp(1.9rem,3.6vw,2.7rem); max-width:640px; margin-bottom:14px; }
        .page-banner p{ color:rgba(251,250,245,0.78); max-width:600px; }

        .materi-progress-wrap{ background:var(--canopy); padding:0 0 26px; }
        .materi-progress{ display:flex; align-items:center; gap:14px; }
        .materi-progress-label{
          font-family:'Space Mono', monospace; font-size:0.72rem; font-weight:700; color:var(--amber);
          white-space:nowrap;
        }
        .materi-progress-track{ flex:1; height:6px; border-radius:999px; background:rgba(251,250,245,0.14); overflow:hidden; }
        .materi-progress-fill{ height:100%; border-radius:999px; background:linear-gradient(90deg,var(--estuary-light),var(--amber)); transition:width .5s ease; }

        /* ===== Section shell ===== */
        .section{ padding:64px 0; }
        .section-head{ max-width:660px; margin-bottom:34px; }
        .section-head h2{ font-size:clamp(1.5rem,2.4vw,2rem); margin-top:10px; }
        .section-head p{ color:#4C5F58; margin-top:12px; }

        /* ===== Bagian 1: scene + hotspot ===== */
        .scene-wrap{ display:grid; grid-template-columns:1.3fr 1fr; gap:26px; align-items:start; }
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
          animation:pulseHotspot 2.2s ease-in-out infinite; font-size:1rem;
        }
        .hotspot.visited{ background:var(--estuary); border-color:var(--estuary); animation:none; }
        .hotspot.active{ box-shadow:0 0 0 8px rgba(232,163,61,0.25); }
        @keyframes pulseHotspot{
          0%,100%{ box-shadow:0 0 0 0 rgba(232,163,61,0.5); }
          50%{ box-shadow:0 0 0 10px rgba(232,163,61,0); }
        }
        .scene-progress{
          position:absolute; top:16px; right:16px; z-index:3;
          background:rgba(15,36,29,0.85); color:var(--paper); font-size:0.78rem; font-weight:700;
          padding:9px 16px; border-radius:16px; font-family:'Space Mono', monospace;
        }
        .scene-hint{
          position:absolute; bottom:14px; left:14px; right:14px; z-index:3;
          background:rgba(15,36,29,0.78); color:rgba(251,250,245,0.92); font-size:0.8rem;
          padding:10px 14px; border-radius:12px; text-align:center;
        }

        .info-panel{
          background:var(--paper); border-radius:var(--radius-lg); padding:26px;
          display:flex; flex-direction:column; box-shadow:0 20px 40px -24px rgba(15,36,29,0.3);
          min-height:320px;
        }
        .info-panel-empty{ color:#7A8A83; font-size:0.94rem; margin:auto; text-align:center; }
        .info-badge{
          display:inline-flex; align-items:center; gap:6px; font-size:0.7rem; font-weight:700;
          text-transform:uppercase; letter-spacing:0.06em; padding:5px 12px; border-radius:999px;
          width:fit-content; margin-bottom:14px;
        }
        .info-badge.biotik{ background:#E4EFE7; color:var(--estuary); }
        .info-badge.abiotik{ background:#FBEEDA; color:var(--amber-deep); }
        .info-panel h3{ font-size:1.25rem; margin-bottom:12px; }
        .info-panel p{ color:#4C5F58; font-size:0.92rem; margin-bottom:10px; line-height:1.6; }
        .info-peran{ display:flex; flex-direction:column; gap:8px; list-style:none; margin-top:6px; }
        .info-peran li{ display:flex; align-items:flex-start; gap:9px; font-size:0.88rem; color:#33473F; }
        .info-peran li svg{ width:14px; height:14px; color:var(--estuary); flex-shrink:0; margin-top:3px; }
        .info-note{
          margin-top:10px; background:var(--tide-pale); border-radius:12px; padding:13px 15px;
          font-size:0.86rem; color:#215045; display:flex; gap:9px; align-items:flex-start;
        }
        .info-note span:first-child{ flex-shrink:0; }

        /* ===== Bagian 2: relasi ===== */
        .relation-tabs{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:26px; }
        .relation-tab{
          display:flex; align-items:center; gap:8px; padding:11px 18px; border-radius:999px;
          border:1.5px solid rgba(15,36,29,0.12); background:var(--paper); cursor:pointer;
          font-size:0.85rem; font-weight:600; color:var(--canopy);
          transition:border-color .2s ease, background .2s ease;
        }
        .relation-tab:hover{ border-color:var(--estuary); }
        .relation-tab.active{ border-color:var(--estuary); background:var(--tide-pale); }
        .relation-tab.done{ border-color:var(--estuary); background:#E4EFE7; }
        .relation-tab svg{ width:16px; height:16px; color:var(--estuary); flex-shrink:0; }

        .relation-visual{
          display:flex; align-items:center; justify-content:center; gap:18px;
          background:var(--paper); border-radius:var(--radius-lg); padding:28px;
          box-shadow:0 20px 40px -26px rgba(15,36,29,0.3); margin-bottom:20px;
        }
        .relation-visual .node{ display:flex; flex-direction:column; align-items:center; gap:8px; }
        .relation-visual .node .circle{
          width:64px; height:64px; border-radius:50%; background:var(--sand-deep);
          display:flex; align-items:center; justify-content:center; font-size:1.8rem;
        }
        .relation-visual .node span.label{ font-size:0.78rem; font-weight:700; color:var(--canopy); }
        .relation-flow{ display:flex; align-items:center; gap:4px; color:var(--amber-deep); }
        .relation-flow svg{ width:22px; height:22px; animation:flowPulse 1.4s ease-in-out infinite; }
        @keyframes flowPulse{
          0%,100%{ transform:translateX(0); opacity:0.5; }
          50%{ transform:translateX(8px); opacity:1; }
        }

        /* ===== Kuis umum ===== */
        .quiz-box{ background:var(--paper); border-radius:var(--radius-lg); padding:32px; box-shadow:0 20px 40px -24px rgba(15,36,29,0.28); }
        .quiz-locked{ background:var(--sand-deep); border-radius:var(--radius-lg); padding:26px 32px; margin-top:8px; color:#5F726A; font-size:0.92rem; display:flex; align-items:center; gap:14px; }
        .quiz-box .eyebrow{ margin-bottom:10px; }
        .quiz-box h3{ font-size:1.08rem; margin-bottom:20px; }
        .quiz-option{
          display:flex; align-items:center; gap:12px; width:100%; text-align:left;
          padding:15px 18px; border-radius:14px; border:1.5px solid rgba(15,36,29,0.12);
          background:var(--sand); margin-bottom:10px; cursor:pointer; font-size:0.9rem;
          transition:border-color .2s ease, background .2s ease;
        }
        .quiz-option:hover{ border-color:var(--estuary); }
        .quiz-option.selected{ border-color:var(--estuary); background:var(--tide-pale); font-weight:600; }
        .quiz-option.correct{ border-color:var(--estuary); background:#E4EFE7; }
        .quiz-option.wrong{ border-color:var(--danger); background:#F8E4E7; }
        .quiz-option-dot{ width:22px; height:22px; border-radius:50%; border:1.5px solid rgba(15,36,29,0.2); flex-shrink:0; display:flex; align-items:center; justify-content:center; }
        .quiz-feedback{ margin-top:16px; padding:16px 18px; border-radius:14px; font-size:0.88rem; display:flex; gap:10px; align-items:flex-start; }
        .quiz-feedback.correct{ background:#E4EFE7; color:var(--canopy); }
        .quiz-feedback.wrong{ background:#F8E4E7; color:#7A2E3C; }
        .quiz-feedback svg{ width:18px; height:18px; flex-shrink:0; margin-top:2px; }

        .chain-cta-wrap{ text-align:center; margin-top:34px; }
        .chain-cta-wrap p{ color:#556961; font-size:0.9rem; margin-bottom:16px; }

        /* ===== Bagian 3: rantai makanan (tap-to-place) ===== */
        .chain-pool{ display:flex; flex-wrap:wrap; gap:14px; margin-bottom:30px; min-height:110px; }
        .chain-card{
          flex:0 0 auto; width:150px; background:var(--paper); border-radius:16px; padding:16px 12px;
          text-align:center; border:2px solid rgba(15,36,29,0.1); cursor:pointer;
          box-shadow:0 4px 14px -10px rgba(15,36,29,0.15);
          transition:border-color .2s ease, transform .2s ease, box-shadow .2s ease;
        }
        .chain-card:hover{ transform:translateY(-3px); }
        .chain-card.selected{ border-color:var(--amber); box-shadow:0 0 0 5px rgba(232,163,61,0.2); transform:translateY(-3px); }
        .chain-card .emoji{ font-size:1.7rem; display:block; margin-bottom:6px; }
       .chain-card .role{ display:block; font-family:'Space Mono', monospace; font-size:0.6rem; font-weight:700; text-transform:uppercase; color:var(--estuary); letter-spacing:0.04em; margin-bottom:4px; }
        .chain-card .label{ display:block; font-size:0.78rem; font-weight:700; color:var(--canopy); line-height:1.3; }
        .chain-card[draggable]{ cursor:grab; }
        .chain-card.dragging{ opacity:0.4; }
        .chain-slot.drag-over{ border-color:var(--amber); background:var(--tide-pale); }
        .chain-pool-empty{ color:#8A9A93; font-size:0.86rem; display:flex; align-items:center; }

        .chain-slots{ display:flex; align-items:stretch; gap:6px; flex-wrap:wrap; }
        .chain-slot-wrap{ display:flex; flex-direction:column; align-items:center; gap:8px; flex:1 1 140px; min-width:130px; }
        .chain-slot-role{ font-family:'Space Mono', monospace; font-size:0.62rem; font-weight:700; text-transform:uppercase; color:var(--silt); letter-spacing:0.05em; text-align:center; }
        .chain-slot{
          width:100%; min-height:110px; border-radius:16px; border:2px dashed rgba(15,36,29,0.22);
          background:var(--sand-deep); display:flex; align-items:center; justify-content:center;
          cursor:pointer; padding:10px; text-align:center; transition:border-color .2s ease, background .2s ease;
        }
        .chain-slot:hover{ border-color:var(--estuary); }
        .chain-slot.filled{ border-style:solid; background:var(--paper); border-color:rgba(15,36,29,0.12); }
        .chain-slot .placeholder{ color:#94A39B; font-size:1.4rem; }
        .chain-slot .filled-emoji{ font-size:1.6rem; display:block; margin-bottom:4px; }
        .chain-slot .filled-label{ font-size:0.74rem; font-weight:700; color:var(--canopy); }
        .chain-slot.correct-slot{ border-color:var(--estuary); background:#E4EFE7; animation:chainPop .4s ease; }
        .chain-slot.wrong-slot{ border-color:var(--danger); background:#F8E4E7; }
        @keyframes chainPop{
          0%{ transform:scale(0.9); }
          50%{ transform:scale(1.05); }
          100%{ transform:scale(1); }
        }
        .chain-slot-arrow{ display:none; }
        @media (min-width:860px){
          .chain-slot-arrow{ display:flex; align-items:center; color:var(--silt); flex:0 0 auto; padding-top:24px; }
          .chain-slot-arrow svg{ width:18px; height:18px; }
        }

        .chain-actions{ display:flex; gap:12px; margin-top:24px; flex-wrap:wrap; }
        .chain-explain{ margin-top:30px; display:flex; flex-direction:column; gap:14px; }
        .chain-explain-item{
          display:flex; gap:14px; background:var(--paper); border-radius:16px; padding:18px 20px;
          box-shadow:0 4px 16px -10px rgba(15,36,29,0.14); align-items:flex-start;
        }
        .chain-explain-item .emoji{ font-size:1.5rem; flex-shrink:0; }
        .chain-explain-item .role{ font-family:'Space Mono', monospace; font-size:0.62rem; font-weight:700; text-transform:uppercase; color:var(--estuary); letter-spacing:0.05em; display:block; margin-bottom:3px; }
        .chain-explain-item h5{ font-family:'Fraunces', serif; font-size:0.98rem; color:var(--canopy); margin-bottom:5px; }
        .chain-explain-item p{ font-size:0.86rem; color:#4C5F58; line-height:1.55; }

        /* ===== Bagian 4: ringkasan ===== */
        .summary-card{
          background:var(--canopy); border-radius:var(--radius-lg); padding:40px;
          box-shadow:0 24px 48px -26px rgba(15,36,29,0.4);
        }
        .summary-card .eyebrow{ color:var(--amber); }
        .summary-card h2{ color:var(--paper); margin-top:10px; margin-bottom:24px; }
        .summary-list{ display:flex; flex-direction:column; gap:12px; margin-bottom:26px; }
        .summary-list li{
          list-style:none; display:flex; gap:12px; align-items:flex-start; color:rgba(251,250,245,0.88);
          font-size:0.92rem; background:rgba(251,250,245,0.06); border-radius:12px; padding:13px 16px;
        }
        .summary-closing{
          border-top:1px solid rgba(251,250,245,0.14); padding-top:20px; margin-top:6px;
          color:rgba(251,250,245,0.75); font-size:0.9rem; font-style:italic; font-family:'Fraunces', serif;
        }

        .materi-nav{ display:flex; justify-content:space-between; align-items:center; margin-top:50px; padding-top:28px; border-top:1px solid rgba(15,36,29,0.1); flex-wrap:wrap; gap:16px; }

        /* ===== Modal peringatan: materi belum selesai ===== */
        .lock-warn-overlay{ position:fixed; inset:0; background:rgba(10,20,16,0.6); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); }
        .lock-warn-modal{ position:relative; background:var(--paper); border-radius:22px; padding:38px 32px 32px; max-width:380px; width:100%; text-align:center; box-shadow:0 20px 44px -18px rgba(15,36,29,0.4); }
        .lock-warn-close{ position:absolute; top:16px; right:16px; width:32px; height:32px; border:none; border-radius:50%; background:var(--sand-deep); color:var(--canopy); display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .lock-warn-close svg{ width:16px; height:16px; }
        .lock-warn-icon{ width:56px; height:56px; margin:0 auto 18px; border-radius:50%; background:#FBEEDA; color:var(--amber-deep); display:flex; align-items:center; justify-content:center; }
        .lock-warn-icon svg{ width:26px; height:26px; }
        .lock-warn-modal h3{ font-size:1.3rem; margin-bottom:10px; }
        .lock-warn-modal p{ color:#556961; font-size:0.92rem; line-height:1.6; margin-bottom:26px; }
        .lock-warn-modal .btn{ width:100%; justify-content:center; }

        @media (max-width:980px){
          .scene-wrap{ grid-template-columns:1fr; }
        }
        @media (max-width:768px){
          .page-banner{ padding:110px 0 30px; }
          .section{ padding:46px 0; }
          .quiz-box{ padding:22px 18px; }
          .info-panel{ padding:20px; }
          .summary-card{ padding:28px 22px; }
        }
        @media (max-width:600px){
          .container{ padding:0 20px; }
          .materi-nav{ flex-direction:column; align-items:stretch; }
          .page-banner h1{ font-size:1.55rem; }
          .section-head h2{ font-size:1.32rem; }
          .relation-visual{ flex-direction:column; gap:10px; }
          .relation-flow{ transform:rotate(90deg); }
          .chain-card{ width:128px; }
        }
      `}</style>

      <Navbar />

      {/* ================= BANNER ================= */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb reveal">
            <Link to="/">Beranda</Link><span>/</span>
            <Link to="/materi">Materi</Link><span>/</span>
            <span className="current">Hubungan dalam Ekosistem</span>
          </div>
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>Materi 2 dari 5</span>
          <h1 className="reveal">Hubungan dalam Ekosistem Mangrove</h1>
          <p className="reveal">
            Jelajahi komponen biotik dan abiotik di ekosistem mangrove, pahami bagaimana mereka saling
            memengaruhi, lalu susun rantai makanannya sendiri.
          </p>
        </div>
      </section>

      <div className="materi-progress-wrap">
        <div className="container">
          <div className="materi-progress reveal">
            <span className="materi-progress-label">
              {loadingProgress ? "Memuat progres tersimpan…" : `Materi 2 — ${progressPercent}%`}
            </span>
            <div className="materi-progress-track">
              <div className="materi-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ================= BAGIAN 1: EKSPLORASI KOMPONEN ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Bagian 1</span>
            <h2>Eksplorasi Ekosistem Mangrove</h2>
            <p>Klik setiap komponen untuk mengetahui perannya dalam ekosistem mangrove.</p>
          </div>

          <div className="scene-wrap reveal">
            <div className="scene">
              <span className="scene-progress">{visitedHotspots.size}/{hotspots.length} dijelajahi</span>
              <img src={sceneImg} alt="Ilustrasi ekosistem mangrove dengan berbagai komponen biotik dan abiotik" className="scene-img" />
              {hotspots.map((h) => (
                <button
                  key={h.id}
                  className={`hotspot${visitedHotspots.has(h.id) ? " visited" : ""}${activeHotspotId === h.id ? " active" : ""}`}
                  style={{ top: h.top, left: h.left }}
                  onClick={() => handleHotspotClick(h)}
                  aria-label={h.label}
                >
                  {h.emoji}
                </button>
              ))}
              {!activeHotspotId && <span className="scene-hint">Klik setiap komponen untuk mengetahui perannya dalam ekosistem mangrove.</span>}
            </div>

            <div className="info-panel">
              {!activeHotspot && <p className="info-panel-empty">Klik salah satu titik pada ilustrasi untuk melihat penjelasannya di sini.</p>}
              {activeHotspot && (
                <>
                  <span className={`info-badge ${activeHotspot.jenis === "Biotik" ? "biotik" : "abiotik"}`}>
                    Komponen {activeHotspot.jenis}
                  </span>
                  <h3>{activeHotspot.emoji} {activeHotspot.label}</h3>
                  {activeHotspot.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {activeHotspot.peran && (
                    <ul className="info-peran">
                      {activeHotspot.peran.map((p, i) => (
                        <li key={i}><CheckIcon />{p}</li>
                      ))}
                    </ul>
                  )}
                  {activeHotspot.note && (
                    <div className="info-note">
                      <span>💡</span>
                      <span>{activeHotspot.note}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= BAGIAN 2: EKSPLORASI HUBUNGAN ================= */}
      <section className="section" style={{ background: "var(--sand-deep)" }}>
        <div className="container">
          {!stage1Done ? (
            <div className="quiz-locked reveal">
              <span style={{ fontSize: "1.3rem" }}>🔒</span>
              <span>Jelajahi ketujuh komponen pada Bagian 1 untuk membuka Eksplorasi Hubungan.</span>
            </div>
          ) : (
            <>
              <div className="section-head reveal">
                <span className="eyebrow">🔎 Bagian 2 — Eksplorasi Hubungan</span>
                <h2>Pilih hubungan yang ingin kamu amati</h2>
                <p>Pilih salah satu hubungan berikut untuk mengetahui bagaimana satu komponen dapat memengaruhi komponen lainnya.</p>
              </div>

              <div className="relation-tabs reveal">
                {relations.map((r) => {
                  const done = visitedRelations.has(r.id);
                  return (
                    <button
                      key={r.id}
                      className={`relation-tab${activeRelationId === r.id ? " active" : ""}${done ? " done" : ""}`}
                      onClick={() => setActiveRelationId(r.id)}
                    >
                      {done && <CheckIcon className="tick" />}
                      {r.fromEmoji} {r.fromLabel} → {r.toEmoji} {r.toLabel}
                    </button>
                  );
                })}
              </div>

              <div className="relation-visual reveal">
                <div className="node">
                  <span className="circle">{activeRelation.fromEmoji}</span>
                  <span className="label">{activeRelation.fromLabel}</span>
                </div>
                <span className="relation-flow"><ArrowIcon /></span>
                <div className="node">
                  <span className="circle">{activeRelation.toEmoji}</span>
                  <span className="label">{activeRelation.toLabel}</span>
                </div>
              </div>

              <div className="quiz-box reveal">
                <span className="eyebrow">Pertanyaan</span>
                <h3>{activeRelation.question}</h3>
                {activeRelation.options.map((opt, i) => {
                  const state = !activeRelationState.submitted
                    ? activeRelationState.selected === i ? "selected" : ""
                    : i === activeRelation.correct ? "correct" : activeRelationState.selected === i ? "wrong" : "";
                  return (
                    <button
                      key={i}
                      className={`quiz-option ${state}`}
                      onClick={() => selectRelationOption(activeRelation.id, i)}
                      disabled={activeRelationState.submitted}
                    >
                      <span className="quiz-option-dot">
                        {activeRelationState.submitted && i === activeRelation.correct && <CheckIcon />}
                        {activeRelationState.submitted && activeRelationState.selected === i && i !== activeRelation.correct && <XIcon />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
                {!activeRelationState.submitted ? (
                  <button
                    className="btn btn-primary"
                    disabled={activeRelationState.selected === null || activeRelationState.selected === undefined}
                    onClick={() => submitRelationAnswer(activeRelation)}
                    style={{ marginTop: 8 }}
                  >
                    Periksa Jawaban <ArrowIcon />
                  </button>
                ) : (
                  <div className={`quiz-feedback ${activeRelationState.correct ? "correct" : "wrong"}`}>
                    {activeRelationState.correct ? <CheckIcon /> : <XIcon />}
                    <span>{activeRelationState.correct ? activeRelation.feedbackCorrect : activeRelation.feedbackWrong}</span>
                  </div>
                )}
              </div>

              {stage2Done && !showChainSection && (
                <div className="chain-cta-wrap reveal">
                  <p>Kamu sudah memahami keempat hubungan di atas. Saatnya melihat aliran energinya secara utuh!</p>
                  <button className="btn btn-primary" onClick={goToChainSection}>
                    Jelajahi Rantai Makanan <ArrowIcon />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ================= BAGIAN 3: RANTAI MAKANAN ================= */}
      {showChainSection && (
        <section className="section" ref={chainSectionRef}>
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Bagian 3</span>
              <h2>🐟 Jelajahi Rantai Makanan Mangrove</h2>
              <p>Setiap organisme memiliki peran dalam aliran energi ekosistem. Susun organisme berikut menjadi rantai makanan yang benar — ketuk kartu, lalu ketuk kotak tujuan.</p>
            </div>

            <div className="reveal">
              <div className="chain-pool" onDragOver={handlePoolDragOver} onDrop={handlePoolDrop}>
                {pool.length === 0 && <span className="chain-pool-empty">Semua kartu sudah ditempatkan.</span>}
                {pool.map((id) => {
                  const c = cardById(id);
                  return (
                    <div
                      key={id}
                      className={`chain-card${selectedCard === id ? " selected" : ""}${draggingId === id ? " dragging" : ""}`}
                      onClick={() => onPoolCardClick(id)}
                      draggable={!locked}
                      onDragStart={(e) => handleDragStart(id, e)}
                      onDragEnd={handleDragEnd}
                    >
                      <span className="emoji">{c.emoji}</span>
                      <span className="role">{c.role}</span>
                      <span className="label">{c.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="chain-slots">
                {slots.map((filledId, i) => {
                  const roleLabel = chainCards.find((c) => c.id === correctOrder[i])?.role;
                  const filled = filledId ? cardById(filledId) : null;
                  let slotClass = "";
                  if (chainSubmitted) slotClass = filledId === correctOrder[i] ? " correct-slot" : " wrong-slot";
                  return (
                    <React.Fragment key={i}>
                      <div className="chain-slot-wrap">
                        <span className="chain-slot-role">{roleLabel}</span>
                        <div
                          className={`chain-slot${filled ? " filled" : ""}${slotClass}${dragOverSlot === i ? " drag-over" : ""}`}
                          onClick={() => onSlotClick(i)}
                          onDragOver={(e) => handleSlotDragOver(i, e)}
                          onDragLeave={() => setDragOverSlot((cur) => (cur === i ? null : cur))}
                          onDrop={(e) => handleSlotDrop(i, e)}
                        >
                          {filled ? (
                            <div draggable={!locked} onDragStart={(e) => handleDragStart(filledId, e)} onDragEnd={handleDragEnd}>
                              <span className="filled-emoji">{filled.emoji}</span>
                              <span className="filled-label">{filled.label}</span>
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
                {!locked ? (
                  <button className="btn btn-primary" disabled={!allSlotsFilled} onClick={submitChain}>
                    Periksa Jawaban <ArrowIcon />
                  </button>
                ) : chainCorrect ? (
                  <span className="quiz-feedback correct" style={{ margin: 0 }}>
                    <CheckIcon /> 🎉 Benar! Kamu berhasil menyusun hubungan organisme berdasarkan perannya dalam ekosistem mangrove.
                  </span>
                ) : (
                  <span className="quiz-feedback wrong" style={{ margin: 0 }}>
                    <XIcon /> Belum tepat, tapi tidak apa-apa — perhatikan urutan yang benar pada penjelasan di bawah ini.
                  </span>
                )}
              </div>

              {locked && (
                <div className="chain-explain reveal">
                  <p style={{ color: "#4C5F58", fontSize: "0.92rem", marginBottom: 4 }}>
                    {chainCorrect
                      ? "Hebat! Kamu berhasil memahami hubungan antarorganisme dalam rantai makanan mangrove. Dalam ekosistem mangrove, energi dan materi terus berpindah dari satu komponen ke komponen lainnya — setiap organisme memiliki peran yang saling berkaitan."
                      : "Berikut urutan rantai makanan yang tepat. Dalam ekosistem mangrove, energi dan materi terus berpindah dari satu komponen ke komponen lainnya — setiap organisme memiliki peran yang saling berkaitan."}
                  </p>
                  {correctOrder.map((id) => {
                    const c = cardById(id);
                    return (
                      <div className="chain-explain-item" key={id}>
                        <span className="emoji">{c.emoji}</span>
                        <div>
                          <span className="role">{c.role} — {c.label}</span>
                          <p>{chainExplanations[id]}</p>
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

      {/* ================= BAGIAN 4: RINGKASAN ================= */}
      {stage3Done && (
        <section className="section" style={{ background: "var(--sand-deep)" }} ref={summaryRef}>
          <div className="container">
            <div className="summary-card reveal">
              <span className="eyebrow">Bagian 4</span>
              <h2>Yang Sudah Kamu Pelajari</h2>
              <ul className="summary-list">
                {ringkasanPoints.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              <p className="summary-closing">
                “Ekosistem mangrove merupakan satu kesatuan yang saling terhubung. Perubahan pada satu komponen dapat memengaruhi komponen lainnya.”
              </p>
              <button
                className={`btn btn-primary${materiFinished ? " btn-finished" : ""}`}
                style={{ fontSize: "1rem", padding: "14px 32px", marginTop: 24 }}
                onClick={handleFinishMateri}
                disabled={finishingMateri || materiFinished}
              >
                {materiFinished
                  ? <>✅ Materi Telah Diselesaikan</>
                  : finishingMateri
                    ? "Menyimpan..."
                    : <>🎉 Selesai Materi 2 <ArrowIcon /></>}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ================= NAV BAWAH (selalu tampil) ================= */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="materi-nav reveal">
            <Link to="/materi" className="btn btn-outline"><ArrowLeftIcon /> Daftar Materi</Link>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (materiFinished) {
                  navigate("/materi/perubahan-lingkungan");
                } else {
                  setShowLockWarning(true);
                }
              }}
            >
              Materi 3: Perubahan Lingkungan <ArrowIcon />
            </button>
          </div>
        </div>
      </section>

      {/* ================= PERINGATAN: MATERI 2 BELUM SELESAI ================= */}
      {showLockWarning && (
        <div className="lock-warn-overlay" onClick={() => setShowLockWarning(false)}>
          <div className="lock-warn-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lock-warn-close" onClick={() => setShowLockWarning(false)} aria-label="Tutup">
              <XIcon />
            </button>
            <div className="lock-warn-icon"><LockIcon /></div>
            <h3>Selesaikan Materi 2 Dulu</h3>
            <p>
              Jelajahi ketujuh komponen ekosistem, jawab semua pertanyaan pada Eksplorasi Hubungan,
              dan susun Rantai Makanan terlebih dahulu — lalu klik tombol "Selesai Materi 2" di
              bagian ringkasan sebelum melanjutkan ke Materi 3: Perubahan Lingkungan.
            </p>
            <button className="btn btn-primary" onClick={() => setShowLockWarning(false)}>
              Mengerti
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}