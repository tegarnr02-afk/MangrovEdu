import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import heroBg from "./konservasi-mangrove-sehat.webp";

/* =========================================================
   ICONS
   ========================================================= */
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
);
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 0 1 14-5.2M20 12a8 8 0 0 1-14 5.2" /><path d="M17.5 3v4h-4M6.5 21v-4h4" /></svg>
);
const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4" /><path d="M12 14v3M9 21h6M10 17h4v4h-4z" /></svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="4" rx="1" /><path d="M7 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" /><path d="M9 12h6M9 16h4" /></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
);

/* =========================================================
   INSTRUMEN — 15 Soal Berpikir Kausal Ekosistem Mangrove
   (9 PG dinilai otomatis, 6 Uraian untuk refleksi/guru)
   ========================================================= */
const questions = [
  // ===== Indikator 1: Cause Predicting (Memprediksi Penyebab) =====
  {
    id: 1, indikator: "Cause Predicting", type: "pg",
    q: "Seorang peneliti mengamati sebuah kawasan pesisir yang dulunya ditumbuhi mangrove lebat. Dalam lima tahun terakhir, garis pantai di kawasan tersebut mundur cukup jauh dan gelombang laut semakin mudah mencapai daratan saat air pasang. Kondisi yang paling mungkin menjadi penyebab perubahan tersebut adalah…",
    options: [
      "Curah hujan di kawasan itu meningkat drastis sepanjang tahun",
      "Jumlah pohon mangrove di kawasan tersebut berkurang akibat penebangan",
      "Suhu udara di kawasan pesisir menjadi lebih dingin dari biasanya",
      "Jumlah wisatawan yang berkunjung ke pantai semakin banyak",
    ],
    correct: 1,
    explanation: "Berkurangnya mangrove akibat penebangan menghilangkan fungsi akar sebagai penahan sedimen dan peredam gelombang. Tanpa perlindungan ini, gelombang lebih mudah mengikis garis pantai.",
  },
  {
    id: 2, indikator: "Cause Predicting", type: "pg",
    q: "Di sebuah tambak yang terletak tepat di belakang kawasan mangrove, petambak melaporkan bahwa air tambaknya tiba-tiba terasa jauh lebih asin dibandingkan biasanya, padahal tidak ada penambahan air laut secara sengaja. Setelah ditelusuri, ternyata kawasan mangrove di depan tambak tersebut baru saja dibuka untuk lahan pemukiman. Penyebab paling mungkin dari meningkatnya salinitas air tambak tersebut adalah…",
    options: [
      "Akar mangrove yang biasanya menyaring dan menahan rembesan air laut sudah tidak ada lagi",
      "Petambak lupa menutup saluran air tambak selama beberapa hari",
      "Curah hujan yang menurun membuat air tambak menguap lebih cepat",
      "Ikan-ikan di tambak mengeluarkan garam ke dalam air",
    ],
    correct: 0,
    explanation: "Akar mangrove berfungsi sebagai penghalang alami yang menahan dan menyaring rembesan air laut. Ketika mangrove hilang, air laut lebih bebas merembes masuk ke tambak sehingga salinitas meningkat.",
  },
  {
    id: 3, indikator: "Cause Predicting", type: "uraian",
    intro: "Perhatikan data hasil pengamatan berikut di dua titik berbeda pada kawasan mangrove yang sama:",
    table: {
      headers: ["Titik", "Kerapatan Mangrove", "Ketebalan Lumpur/Sedimen", "Jumlah Lubang Kepiting per 10 m²"],
      rows: [
        ["A", "Rapat", "Tebal dan lembap", "18"],
        ["B", "Jarang (banyak tunggul bekas tebangan)", "Tipis dan mulai mengeras", "4"],
      ],
    },
    q: "Berdasarkan data pada tabel tersebut, prediksikan penyebab utama rendahnya jumlah lubang kepiting di Titik B dibandingkan Titik A. Jelaskan alasanmu dengan menghubungkan kondisi mangrove, sedimen, dan habitat kepiting.",
    guidance: "Arahkan siswa menghubungkan: mangrove jarang → akar tidak lagi menahan/menyuburkan sedimen → lumpur menipis & mengeras → habitat lubang kepiting hilang → jumlah kepiting turun.",
    jawabanIdeal: "Titik B memiliki jumlah lubang kepiting lebih sedikit karena kerapatan mangrovenya lebih rendah sehingga akar mangrove yang menjadi bagian dari habitat kepiting juga lebih sedikit. Selain itu, sedimen di Titik B lebih tipis dan mengeras sehingga kurang sesuai sebagai tempat hidup dan membuat lubang bagi kepiting. Akibatnya, jumlah lubang kepiting di Titik B lebih rendah dibandingkan Titik A.",
    hubunganUtama: "Mangrove berkurang → kondisi sedimen/habitat berubah → habitat kepiting kurang sesuai → jumlah lubang kepiting menurun.",
    poinKunci: [
      { text: "Mangrove di B lebih jarang/kerapatan rendah", keywords: ["jarang", "kerapatan rendah", "tidak rapat", "sedikit mangrove", "berkurang"] },
      { text: "Akar mangrove lebih sedikit", keywords: ["akar sedikit", "akar berkurang", "akar kurang", "akar tidak", "akar mangrove"] },
      { text: "Sedimen di B tipis/mengeras", keywords: ["sedimen tipis", "lumpur tipis", "mengeras", "keras", "tipis"] },
      { text: "Habitat kepiting kurang sesuai", keywords: ["habitat kepiting", "kurang sesuai", "tidak sesuai", "tidak cocok", "habitat berkurang"] },
      { text: "Jumlah lubang kepiting menjadi lebih sedikit", keywords: ["lubang kepiting sedikit", "kepiting berkurang", "kepiting menurun", "lubang sedikit"] },
    ],
  },
  {
    id: 4, indikator: "Cause Predicting", type: "pg",
    q: "Di suatu area rehabilitasi mangrove, bibit-bibit mangrove yang baru ditanam banyak yang layu dan mati, padahal bibit yang sama tumbuh subur di area rehabilitasi lain yang jaraknya tidak jauh. Setelah diperiksa, area yang bibitnya mati ternyata langsung berhadapan dengan laut lepas tanpa penghalang apa pun, sedangkan area yang bibitnya tumbuh subur terlindung oleh gugusan mangrove tua di depannya. Penyebab paling mungkin kematian bibit mangrove tersebut adalah…",
    options: [
      "Bibit di area yang mati kekurangan sinar matahari",
      "Hempasan gelombang yang lebih kuat merusak bibit muda yang belum memiliki akar kuat",
      "Jenis tanah di kedua area tersebut berbeda sejak awal",
      "Bibit yang mati ditanam pada musim yang salah",
    ],
    correct: 1,
    explanation: "Mangrove tua di depannya berfungsi sebagai pemecah gelombang alami. Tanpa perlindungan itu, hempasan gelombang langsung merusak bibit muda yang belum memiliki sistem akar cukup kuat untuk bertahan.",
  },
  {
    id: 5, indikator: "Cause Predicting", type: "uraian",
    q: "Seorang siswa melakukan pengamatan burung di dua kawasan pesisir. Kawasan pertama memiliki hutan mangrove yang luas dan beragam jenis pohonnya. Kawasan kedua adalah bekas hutan mangrove yang sudah berubah menjadi tambak terbuka. Hasil pengamatan menunjukkan jumlah jenis burung yang hinggap di kawasan pertama jauh lebih banyak daripada kawasan kedua.\n\nPrediksikan dua kemungkinan penyebab perbedaan jumlah jenis burung tersebut, kaitkan jawabanmu dengan ketersediaan makanan dan tempat berlindung bagi burung.",
    guidance: "Dua arah jawaban: (1) keragaman pohon mangrove → lebih banyak sumber makanan (serangga, ikan kecil, buah) bagi berbagai jenis burung; (2) struktur vegetasi rapat → lebih banyak tempat berlindung/bersarang, sedangkan tambak terbuka minim vegetasi dan perlindungan.",
    jawabanIdeal: "Jumlah jenis burung di kawasan pertama lebih banyak karena hutan mangrove yang luas dan memiliki beragam jenis pohon menyediakan lebih banyak sumber makanan serta tempat berlindung atau bersarang bagi burung. Sebaliknya, kawasan yang berubah menjadi tambak terbuka memiliki ketersediaan makanan dan tempat berlindung yang lebih terbatas sehingga jenis burung yang dapat hidup atau singgah di kawasan tersebut lebih sedikit.",
    hubunganUtama: "Mangrove luas dan beragam → makanan + tempat berlindung tersedia → lebih banyak jenis burung.",
    poinKunci: [
      { text: "Mangrove luas/beragam", keywords: ["luas", "beragam", "banyak jenis pohon", "hutan mangrove"] },
      { text: "Sumber makanan lebih banyak/beragam", keywords: ["makanan", "sumber makanan", "pakan", "serangga", "buah"] },
      { text: "Tempat berlindung/bersarang tersedia", keywords: ["berlindung", "bersarang", "tempat tinggal", "naungan", "sarang"] },
      { text: "Tambak terbuka habitatnya lebih terbatas", keywords: ["tambak terbuka", "terbatas", "minim vegetasi", "tidak ada pohon", "gundul"] },
      { text: "Menyebabkan perbedaan jumlah jenis burung", keywords: ["jenis burung", "jumlah burung", "populasi burung", "burung lebih"] },
    ],
  },
  // ===== Indikator 2: Effect Determining (Menentukan Akibat) =====
  {
    id: 6, indikator: "Effect Determining", type: "pg",
    q: "Sebagian besar kawasan mangrove di suatu desa pesisir ditebang untuk dijadikan lahan tambak udang secara besar-besaran. Rentetan akibat yang paling mungkin terjadi secara berurutan adalah…",
    options: [
      "Air tambak menjadi lebih jernih → udang tumbuh lebih cepat → pendapatan warga meningkat",
      "Akar penahan sedimen berkurang → abrasi pantai meningkat → habitat ikan dan kepiting hilang → populasi organisme tersebut menurun",
      "Jumlah pohon berkurang → suhu udara desa menjadi lebih sejuk → warga lebih nyaman beraktivitas",
      "Lahan tambak bertambah luas → jumlah nelayan berkurang → harga ikan menjadi lebih murah",
    ],
    correct: 1,
    explanation: "Hilangnya akar mangrove sebagai penahan sedimen menyebabkan abrasi meningkat, yang pada gilirannya merusak habitat bentik tempat ikan dan kepiting hidup, sehingga populasinya menurun.",
  },
  {
    id: 7, indikator: "Effect Determining", type: "uraian",
    q: "Sebuah kawasan pantai kehilangan hampir seluruh mangrovenya akibat pembukaan lahan. Dua tahun kemudian, gelombang laut mulai mengikis daratan hingga beberapa rumah warga di dekat pantai retak akibat tanah di bawahnya tergerus.\n\nJelaskan rentetan akibat (secara berurutan) mulai dari hilangnya mangrove hingga terjadinya kerusakan rumah warga tersebut. Sertakan minimal tiga tahapan hubungan sebab-akibat dalam penjelasanmu.",
    guidance: "Rantai minimal 3 tahap: mangrove hilang → akar penahan sedimen & peredam gelombang hilang → gelombang menghantam garis pantai langsung → abrasi/pengikisan tanah pesisir → tanah di bawah rumah warga tergerus → rumah retak/rusak.",
    jawabanIdeal: "Hilangnya mangrove menyebabkan akar mangrove yang berfungsi menahan sedimen berkurang. Akibatnya, tanah di pantai lebih mudah terkikis oleh gelombang sehingga abrasi meningkat. Daratan kemudian semakin terkikis dan tanah di bawah rumah menjadi tidak stabil sehingga beberapa rumah warga mengalami keretakan atau kerusakan.",
    hubunganUtama: "Mangrove hilang → akar penahan sedimen berkurang → abrasi meningkat → daratan terkikis → rumah rusak.",
    poinKunci: [
      { text: "Mangrove hilang/berkurang", keywords: ["mangrove hilang", "mangrove habis", "tidak ada mangrove", "mangrove berkurang"] },
      { text: "Akar penahan sedimen berkurang/hilang", keywords: ["akar", "penahan sedimen", "menahan tanah", "menahan sedimen"] },
      { text: "Gelombang lebih mudah mencapai pantai", keywords: ["gelombang", "ombak", "hantaman", "menghantam"] },
      { text: "Abrasi/pengikisan tanah meningkat", keywords: ["abrasi", "pengikisan", "erosi", "terkikis", "tergerus"] },
      { text: "Rumah warga retak/rusak", keywords: ["rumah retak", "rumah rusak", "rumah warga", "retak"] },
    ],
  },
  {
    id: 8, indikator: "Effect Determining", type: "pg",
    q: "Sebuah desa pesisir melakukan program penanaman kembali (rehabilitasi) mangrove secara rutin selama beberapa tahun hingga kerapatan mangrove kembali seperti semula. Rentetan akibat positif yang paling mungkin terjadi pada ekosistem tersebut adalah…",
    options: [
      "Akar mangrove kembali menahan sedimen → tanah pesisir lebih stabil → habitat ikan dan kepiting pulih → populasi organisme tersebut meningkat kembali",
      "Jumlah mangrove bertambah → air laut menjadi tawar → ikan air tawar mulai hidup di laut",
      "Mangrove tumbuh lebat → gelombang laut menjadi lebih besar → abrasi meningkat",
      "Rehabilitasi berhasil → nelayan berhenti melaut → hasil tangkapan ikan menurun",
    ],
    correct: 0,
    explanation: "Pulihnya mangrove mengembalikan fungsi akar sebagai penahan sedimen, yang menstabilkan tanah pesisir dan memulihkan habitat bentik, sehingga populasi ikan dan kepiting pun kembali meningkat.",
  },
  {
    id: 9, indikator: "Effect Determining", type: "uraian",
    q: "Warga di sekitar kawasan mangrove terbiasa membuang sampah plastik ke aliran sungai yang bermuara di hutan mangrove. Lama-kelamaan, sampah plastik tersebut menumpuk dan menutupi akar-akar napas (pneumatofor) pohon mangrove.\n\nJelaskan rentetan akibat yang mungkin terjadi terhadap pohon mangrove, kondisi tanah, dan organisme yang hidup di sekitarnya jika kondisi ini dibiarkan terus-menerus.",
    jawabanIdeal: "Sampah plastik yang menutupi akar napas mangrove dapat mengganggu fungsi akar sehingga pertumbuhan dan kesehatan mangrove terganggu. Jika kondisi tersebut terus berlangsung, mangrove dapat mengalami kerusakan atau mati. Berkurangnya kondisi mangrove kemudian dapat mengubah kondisi tanah dan mengganggu habitat organisme di sekitarnya. Organisme yang bergantung pada mangrove sebagai tempat hidup, berlindung, atau mencari makanan juga dapat mengalami penurunan jumlah atau keanekaragaman.",
    hubunganUtama: "Sampah → akar napas terganggu → mangrove terganggu/rusak → habitat berubah → organisme terganggu.",
    poinKunci: [
      { text: "Sampah plastik menutupi akar napas/pneumatofor", keywords: ["sampah", "menutupi akar", "pneumatofor", "akar napas", "akar tertutup"] },
      { text: "Fungsi/pertumbuhan mangrove terganggu", keywords: ["fungsi terganggu", "pertumbuhan terganggu", "terhambat", "kesehatan terganggu"] },
      { text: "Mangrove rusak atau dapat mati", keywords: ["mangrove mati", "mangrove rusak", "mati", "kerusakan"] },
      { text: "Kondisi tanah/habitat berubah/terganggu", keywords: ["tanah berubah", "habitat terganggu", "kualitas tanah", "sedimen"] },
      { text: "Organisme di sekitar ikut terganggu/berkurang", keywords: ["organisme", "hewan berkurang", "keanekaragaman menurun", "berkurang"] },
    ],
  },
  {
    id: 10, indikator: "Effect Determining", type: "pg",
    q: "Suatu kawasan mangrove dialihfungsikan menjadi tambak dengan cara mengeringkan dan meratakan sebagian besar lahan berlumpur tempat mangrove tumbuh. Rentetan akibat yang paling logis dari perubahan tersebut adalah…",
    options: [
      "Lahan menjadi lebih kering → mangrove tumbuh lebih subur → hasil tambak meningkat pesat",
      "Habitat berlumpur hilang → organisme seperti kepiting dan kerang kehilangan tempat hidup → rantai makanan di kawasan tersebut terganggu → populasi ikan pemangsa ikut menurun",
      "Lahan menjadi rata → gelombang laut berhenti menghantam pantai → abrasi otomatis hilang",
      "Tambak terbentuk → salinitas air laut menurun drastis → ikan air tawar berpindah ke laut",
    ],
    correct: 1,
    explanation: "Hilangnya habitat berlumpur menghancurkan fondasi ekosistem pesisir: kepiting dan kerang kehilangan tempat hidup, rantai makanan terganggu, dan ikan pemangsa pun ikut berkurang.",
  },
  // ===== Indikator 3: Cause Identifying (Mengidentifikasi Penyebab) =====
  {
    id: 11, indikator: "Cause Identifying", type: "pg",
    q: "Jumlah ikan di sekitar kawasan mangrove mengalami penurunan yang cukup drastis setelah sebagian besar kawasan tersebut mengalami kerusakan akibat penebangan. Hubungan yang paling tepat untuk menjelaskan fenomena tersebut adalah…",
    options: [
      "Ikan pindah karena tidak menyukai suara alat penebangan pohon",
      "Mangrove yang rusak menyebabkan hilangnya tempat berlindung dan mencari makan (habitat) bagi anakan ikan, sehingga populasi ikan menurun",
      "Penebangan mangrove membuat air laut menjadi lebih dingin sehingga ikan berpindah tempat",
      "Ikan berkurang karena nelayan menangkap ikan lebih banyak setelah mangrove ditebang",
    ],
    correct: 1,
    explanation: "Mangrove berfungsi sebagai nursery ground (tempat asuhan) bagi anakan ikan. Saat mangrove rusak, habitat ini hilang sehingga anakan ikan tidak dapat tumbuh dan berkembang, menyebabkan populasi ikan dewasa ikut menurun.",
  },
  {
    id: 12, indikator: "Cause Identifying", type: "uraian",
    intro: "Perhatikan data berikut dari tiga kawasan mangrove dengan tingkat kerapatan berbeda:",
    table: {
      headers: ["Kawasan", "Kerapatan Mangrove", "Rata-rata Jumlah Kepiting per 10 m²", "Rata-rata Jumlah Jenis Ikan Kecil"],
      rows: [
        ["P", "Sangat rapat", "20", "12"],
        ["Q", "Sedang", "11", "7"],
        ["R", "Sangat jarang", "3", "2"],
      ],
    },
    q: "Identifikasi dan jelaskan hubungan antara kerapatan mangrove dengan jumlah kepiting dan jenis ikan kecil pada ketiga kawasan tersebut. Kaitkan jawabanmu dengan fungsi mangrove sebagai penyedia habitat.",
    jawabanIdeal: "Terdapat hubungan bahwa semakin tinggi kerapatan mangrove, semakin banyak jumlah kepiting dan jenis ikan kecil yang ditemukan. Kawasan P yang memiliki mangrove sangat rapat memiliki jumlah kepiting dan jenis ikan kecil paling tinggi, sedangkan kawasan R yang mangrovenya sangat jarang memiliki jumlah paling rendah. Hal ini menunjukkan bahwa kerapatan mangrove berkaitan dengan ketersediaan habitat. Mangrove yang lebih rapat menyediakan lebih banyak tempat berlindung dan ruang hidup bagi kepiting dan ikan kecil sehingga mendukung keberadaan organisme tersebut.",
    hubunganUtama: "Kerapatan mangrove meningkat → habitat lebih tersedia → kepiting dan ikan kecil lebih banyak/beragam.",
    poinKunci: [
      { text: "Ada hubungan kerapatan mangrove & jumlah organisme", keywords: ["hubungan", "berkaitan", "berpengaruh", "semakin"] },
      { text: "Semakin rapat mangrove → semakin banyak organisme", keywords: ["semakin rapat", "semakin banyak", "berbanding lurus", "meningkat"] },
      { text: "Mangrove menyediakan habitat/tempat hidup", keywords: ["habitat", "tempat hidup", "menyediakan"] },
      { text: "Mangrove menyediakan tempat berlindung/ruang hidup", keywords: ["berlindung", "ruang hidup", "tempat berlindung", "perlindungan"] },
      { text: "Data kawasan P/R mendukung hubungan tersebut", keywords: ["kawasan p", "kawasan r", "sangat rapat", "sangat jarang", "data"] },
    ],
  },
  {
    id: 13, indikator: "Cause Identifying", type: "pg",
    q: "Di suatu kawasan mangrove yang lebat dan sehat, ditemukan lebih banyak jenis burung, serangga, dan hewan kecil dibandingkan kawasan mangrove yang gundul. Keterkaitan antarkomponen yang paling tepat menjelaskan tingginya keanekaragaman organisme di kawasan mangrove yang lebat adalah…",
    options: [
      "Mangrove yang lebat menghasilkan lebih banyak oksigen sehingga hewan tidak perlu bernapas dengan cepat",
      "Struktur pohon mangrove yang beragam menyediakan lebih banyak sumber makanan dan tempat berlindung bagi berbagai jenis organisme",
      "Mangrove yang lebat membuat suhu kawasan menjadi sangat panas sehingga menarik banyak hewan",
      "Kawasan mangrove lebat memiliki lebih sedikit predator sehingga semua hewan berkumpul di sana",
    ],
    correct: 1,
    explanation: "Keragaman struktur vegetasi mangrove (tajuk, batang, akar) menciptakan berbagai relung ekologi (niche): tempat bersarang burung, ruang berlindung serangga, dan habitat ikan kecil di antara akar — semua mendukung tingginya keanekaragaman hayati.",
  },
  {
    id: 14, indikator: "Cause Identifying", type: "uraian",
    q: "Dua kawasan pantai bertetangga mengalami hantaman gelombang besar akibat cuaca ekstrem. Kawasan pertama yang memiliki sabuk mangrove lebar hanya mengalami sedikit pengikisan tanah, sedangkan kawasan kedua yang mangrovenya sudah gundul mengalami abrasi parah hingga sebagian lahan warga hilang.\n\nIdentifikasi penyebab perbedaan tingkat kerusakan di kedua kawasan tersebut. Jelaskan keterkaitan antara keberadaan mangrove, kekuatan gelombang yang sampai ke daratan, dan tingkat abrasi yang terjadi.",
    guidance: "Arahkan ke: sabuk mangrove lebar meredam/memecah energi gelombang sebelum mencapai daratan → dampak ke tanah kecil; tanpa mangrove, gelombang penuh menghantam garis pantai langsung → abrasi parah.",
    jawabanIdeal: "Kawasan pertama mengalami kerusakan yang lebih sedikit karena memiliki sabuk mangrove yang lebar. Struktur dan akar mangrove membantu mengurangi energi gelombang yang mencapai daratan serta membantu menahan tanah/sedimen. Sebaliknya, kawasan kedua yang mangrovenya gundul tidak memiliki perlindungan tersebut sehingga gelombang lebih mudah mencapai daratan dan menyebabkan pengikisan tanah serta abrasi yang lebih parah.",
    hubunganUtama: "Mangrove ada → energi gelombang berkurang → tanah terlindungi → abrasi rendah. Mangrove gundul → gelombang mudah mencapai daratan → abrasi meningkat.",
    poinKunci: [
      { text: "Kawasan pertama punya mangrove lebar/lebat", keywords: ["mangrove lebar", "mangrove lebat", "sabuk mangrove", "mangrove ada"] },
      { text: "Mangrove mengurangi energi gelombang", keywords: ["meredam gelombang", "mengurangi energi", "memecah gelombang", "meredam"] },
      { text: "Mangrove menahan tanah/sedimen", keywords: ["menahan tanah", "menahan sedimen", "melindungi", "penahan"] },
      { text: "Kawasan kedua mangrovenya gundul", keywords: ["gundul", "tidak ada mangrove", "mangrove hilang", "tanpa mangrove"] },
      { text: "Gelombang lebih mudah mencapai daratan", keywords: ["gelombang mencapai daratan", "langsung menghantam", "gelombang penuh"] },
      { text: "Abrasi di kawasan kedua lebih parah", keywords: ["abrasi parah", "kerusakan parah", "erosi parah", "pengikisan parah"] },
    ],
  },
  {
    id: 15, indikator: "Cause Identifying", type: "pg",
    q: "Air di sekitar kawasan mangrove yang sehat cenderung lebih jernih dan kadar lumpur yang terbawa arus ke laut lepas lebih sedikit, dibandingkan air di kawasan pesisir yang mangrovenya telah rusak. Penyebab paling tepat yang menjelaskan kondisi air yang lebih jernih di kawasan mangrove sehat adalah…",
    options: [
      "Air laut di kawasan mangrove sehat berasal dari sumber yang berbeda",
      "Akar-akar mangrove yang rapat menahan dan menyaring partikel sedimen sehingga tidak mudah terbawa arus",
      "Mangrove menyerap seluruh partikel lumpur melalui daunnya",
      "Air di kawasan mangrove sehat lebih sedikit terkena sinar matahari sehingga lebih jernih",
    ],
    correct: 1,
    explanation: "Sistem akar mangrove yang rapat dan kompleks bertindak sebagai filter alami: partikel sedimen tersangkut di antara akar dan mengendap, sehingga air yang mengalir keluar menjadi lebih jernih.",
  },
];

/* =========================================================
   HELPER: kategori hasil
   ========================================================= */
function getCategory(pct) {
  if (pct >= 90) return { label: "Sangat Baik", emoji: "🌟", color: "#2F6B57", bg: "#E4EFE7", msg: "Luar biasa! Kemampuan berpikir kausalmu sangat tinggi." };
  if (pct >= 75) return { label: "Baik", emoji: "👍", color: "#CE8324", bg: "#FBEEDA", msg: "Bagus! Kamu memahami sebagian besar hubungan sebab-akibat dengan baik." };
  if (pct >= 60) return { label: "Cukup", emoji: "📚", color: "#1E8A8C", bg: "#E1F1F1", msg: "Cukup baik. Ulangi beberapa materi untuk memperkuat pemahaman kausalmu." };
  return { label: "Perlu Belajar Lagi", emoji: "💪", color: "#C24A5F", bg: "#F8E4E7", msg: "Jangan menyerah! Pelajari kembali hubungan sebab-akibat dan coba lagi." };
}

/* =========================================================
   UTIL: penilaian otomatis uraian (pencocokan kata kunci +
   kata penghubung sebab-akibat, mengikuti bahasa kunci jawaban)
   ========================================================= */

// Kata penghubung sebab-akibat — dipakai sebagai penanda siswa
// benar-benar "menghubungkan" poin-poin, bukan cuma menyebutnya lepas
const CONNECTOR_WORDS = [
  "karena", "sehingga", "akibatnya", "menyebabkan",
  "sebab", "dampaknya", "maka", "mengakibatkan", "berakibat",
  "yang berujung", "yang membuat", "akibat dari", "oleh karena",
];

function normalizeText(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreUraian(answerText, poinKunci) {
  const normalized = normalizeText(answerText);

  const matched = poinKunci.map((poin) => {
    const found = poin.keywords.some((kw) => normalized.includes(normalizeText(kw)));
    return { ...poin, found };
  });
  const matchedCount = matched.filter((p) => p.found).length;
  const hasConnector = CONNECTOR_WORDS.some((w) => normalized.includes(normalizeText(w)));

  // Kriteria persis mengikuti bahasa dokumen kunci jawaban:
  // - Salah    : tidak ada poin kunci yang relevan sama sekali
  // - Benar    : minimal 2 poin kunci ketemu DAN ada kata penghubung
  //              (menunjukkan siswa merangkai poin jadi satu hubungan sebab-akibat,
  //               bukan cuma menyebut fakta lepas)
  // - Sebagian : sisanya — ada poin kunci yang disebut, tapi belum dirangkai
  //              jadi hubungan yang jelas (baru 1 poin, atau >1 poin tapi tanpa
  //              kata penghubung)
  let level, weight;
  if (matchedCount === 0) {
    level = "salah"; weight = 0;
  } else if (matchedCount >= 2 && hasConnector) {
    level = "benar"; weight = 1;
  } else {
    level = "sebagian"; weight = 0.5;
  }

  return { matched, matchedCount, total: poinKunci.length, hasConnector, level, weight };
}

/* =========================================================
   KOMPONEN UTAMA
   ========================================================= */
export default function Kuis() {
  const navigate = useNavigate();
  const [loggedIn] = useState(() => !!localStorage.getItem("token"));

  // phase: "start" | "quiz" | "result"
  const [phase, setPhase] = useState("start");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);

  // Skor terbaik dari API
  const [bestScore, setBestScore] = useState(null);
  const [loadingBest, setLoadingBest] = useState(false);

  // Animasi transisi soal
  const [slideDir, setSlideDir] = useState("right"); // "right" | "left"
  const [animating, setAnimating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Countdown timer — 60 menit (3600 detik) untuk soal uraian
  // Tidak auto-submit saat waktu habis agar jawaban uraian tidak terpotong
  const QUIZ_DURATION = 3600;
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [timeWarning, setTimeWarning] = useState(false);
  const timerRef = useRef(null);

  const boxRef = useRef(null);

  // Fetch skor terbaik dari API saat komponen mount
  useEffect(() => {
    if (!loggedIn) return;
    setLoadingBest(true);
    api
      .get("/kuis/hasil")
      .then((res) => setBestScore(res.data?.data?.nilai_terbaik ?? null))
      .catch(() => { })
      .finally(() => setLoadingBest(false));
  }, [loggedIn]);

  // Countdown timer — mulai saat phase === "quiz", berhenti saat selesai
  useEffect(() => {
    if (phase !== "quiz") {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // Soft warning saat waktu habis (TIDAK auto-submit, agar jawaban uraian tidak terpotong)
  useEffect(() => {
    if (phase === "quiz" && timeLeft === 0 && !timeWarning) {
      setTimeWarning(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  // Scroll reveal
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [phase, showReview]);

  const q = questions[current];
  const isFirst = current === 0;
  const isLast = current === questions.length - 1;
  // Soal dianggap "dijawab" jika PG sudah dipilih ATAU uraian sudah diketik
  const answered = q.type === "pg"
    ? answers[q.id] !== undefined
    : (answers[q.id] !== undefined && String(answers[q.id]).trim().length > 0);

  // Scoring: semua 15 soal (PG + uraian) → skor + poin kunci
  const results = questions.map((item) => {
    if (item.type === "pg") {
      const isCorrect = answers[item.id] === item.correct;
      return { id: item.id, type: "pg", weight: isCorrect ? 1 : 0, level: isCorrect ? "benar" : "salah" };
    } else {
      const r = scoreUraian(answers[item.id], item.poinKunci);
      return { id: item.id, type: "uraian", ...r };
    }
  });
  const total = questions.length; // 15
  const totalPoin = results.reduce((acc, r) => acc + r.weight, 0);
  const pct = Math.round((totalPoin / total) * 100);
  const category = getCategory(pct);
  const jumlahBenar = results.filter(r => r.level === "benar").length;
  const jumlahSebagian = results.filter(r => r.level === "sebagian").length;
  const jumlahSalah = results.filter(r => r.level === "salah").length;

  const navigate_question = useCallback((dir) => {
    if (animating) return;
    setSlideDir(dir === 1 ? "right" : "left");
    setAnimating(true);
    setTimeout(() => {
      setCurrent((c) => c + dir);
      setSlideDir(dir === 1 ? "right-in" : "left-in");
      setTimeout(() => setAnimating(false), 320);
    }, 220);
  }, [animating]);

  const goNext = () => {
    if (isLast) {
      handleSubmit();
    } else {
      navigate_question(1);
    }
  };
  const goPrev = () => navigate_question(-1);

  const handleSubmit = async () => {
    setSaving(true);
    setPhase("result");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (loggedIn) {
      try {
        const totalPg = questions.filter((item) => item.type === "pg").length;
        await api.post("/kuis/hasil", {
          skor: pct,
          benar: jumlahBenar,
          total,
          total_pg: totalPg,
          jawaban: questions.map((item) => {
            const r = results.find((x) => x.id === item.id);
            return {
              soal_id: item.id,
              tipe: item.type,
              jawaban: answers[item.id] ?? null,
              level: r.level,
              poin: r.weight,
              ...(item.type === "uraian" ? { poin_kunci_ketemu: r.matchedCount, poin_kunci_total: r.total } : {}),
            };
          }),
        });
        if (bestScore === null || pct > bestScore) setBestScore(pct);
      } catch (e) {
        console.error("Gagal menyimpan hasil kuis:", e);
      } finally {
        setSaving(false);
      }
    } else {
      setSaving(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrent(0);
    setPhase("start");
    setShowReview(false);
    setTimeLeft(QUIZ_DURATION);
    setTimeWarning(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progressPct = Math.round(((current + 1) / questions.length) * 100);

  /* =========================================================
     RENDER
     ========================================================= */
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
        body{font-family:'Plus Jakarta Sans',sans-serif; background:var(--sand); color:var(--ink); line-height:1.6; overflow-x:hidden;}
        h1,h2,h3,h4{font-family:'Fraunces',serif; font-weight:600; color:var(--canopy); line-height:1.16; letter-spacing:-0.01em;}
        a{text-decoration:none; color:inherit;}
        .container{max-width:1100px; margin:0 auto; padding:0 32px;}

        .eyebrow{
          font-family:'Space Mono',monospace; text-transform:uppercase; letter-spacing:0.14em;
          font-size:0.72rem; color:var(--estuary); font-weight:700; display:inline-flex; align-items:center; gap:10px;
        }
        .reveal{opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s ease;}
        .reveal.show{opacity:1; transform:translateY(0);}

        /* ===== Banner ===== */
        .wave-divider{position:absolute; left:0; right:0; bottom:-1px; line-height:0; pointer-events:none; z-index:5;}
        .wave-divider svg{display:block; width:100%; height:80px;}
        .page-banner{
          position:relative; min-height:56vh;
          display:flex; align-items:flex-end;
          background-image:linear-gradient(90deg,rgba(10,22,17,0.86) 0%,rgba(10,22,17,0.62) 40%,rgba(10,22,17,0.3) 75%),url(${heroBg});
          background-size:cover; background-position:center 32%;
          padding:90px 0 100px;
        }
        .page-banner .container{margin-left:0; max-width:100%; padding-left:60px;}
        .page-banner h1{color:var(--paper); font-size:clamp(1.9rem,3.6vw,2.8rem); max-width:640px; margin-bottom:16px;}
        .page-banner p{color:rgba(251,250,245,0.82); max-width:580px; font-size:1rem;}

        /* ===== Hero stats strip ===== */
        .hero-stats{display:flex; gap:28px; margin-top:26px; flex-wrap:wrap;}
        .hero-stat{
          display:flex; align-items:center; gap:10px; padding:10px 18px; border-radius:12px;
          background:rgba(251,250,245,0.1); backdrop-filter:blur(6px);
          border:1px solid rgba(251,250,245,0.18); color:var(--paper);
          font-size:0.88rem; font-weight:600;
        }
        .hero-stat svg{width:17px; height:17px; opacity:0.85;}
        .hero-stat strong{font-family:'Space Mono',monospace; margin-left:2px;}

        /* ===== Buttons ===== */
        .btn{
          display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:999px;
          font-weight:700; font-size:0.92rem; cursor:pointer; border:none;
          transition:transform .25s ease, box-shadow .25s ease; font-family:'Plus Jakarta Sans',sans-serif;
        }
        .btn svg{width:18px; height:18px; flex-shrink:0;}
        .btn-primary{background:var(--amber); color:var(--canopy); box-shadow:0 12px 24px -10px rgba(232,163,61,0.7);}
        .btn-primary:hover{transform:translateY(-3px);}
        .btn-primary:disabled{opacity:0.42; cursor:not-allowed; transform:none !important; box-shadow:none;}
        .btn-outline{background:transparent; color:var(--estuary); border:1.5px solid rgba(47,107,87,0.3);}
        .btn-outline:hover{background:var(--tide-pale);}
        .btn-outline:disabled{opacity:0.55; cursor:not-allowed;}
        .btn-ghost{background:transparent; color:#556961; border:1.5px solid rgba(15,36,29,0.12);}
        .btn-ghost:hover{background:var(--sand);}

        /* ===== Auth gate ===== */
        .gate-card{
          max-width:460px; margin:0 auto; text-align:center; background:var(--paper);
          border-radius:var(--radius-lg); padding:48px 36px; box-shadow:0 20px 40px -20px rgba(15,36,29,0.2);
        }
        .gate-icon{
          width:60px; height:60px; margin:0 auto 20px; border-radius:50%;
          background:var(--tide-pale); color:var(--estuary);
          display:flex; align-items:center; justify-content:center;
        }
        .gate-icon svg{width:28px; height:28px;}
        .gate-card h3{margin-bottom:12px;}
        .gate-card p{color:#556961; margin-bottom:26px;}

        .section{padding:64px 0 100px;}

        /* ===== Start card ===== */
        .start-card{
          max-width:680px; margin:0 auto; background:var(--paper);
          border-radius:var(--radius-lg); padding:48px 44px;
          border:1px solid rgba(15,36,29,0.06); box-shadow:0 24px 48px -24px rgba(15,36,29,0.2);
        }
        .start-icon{
          width:72px; height:72px; border-radius:20px;
          background:linear-gradient(135deg,var(--estuary),var(--estuary-light));
          color:white; display:flex; align-items:center; justify-content:center;
          margin-bottom:28px; box-shadow:0 12px 24px -10px rgba(47,107,87,0.45);
        }
        .start-icon svg{width:32px; height:32px;}
        .start-card h2{font-size:clamp(1.5rem,2.6vw,2rem); margin-bottom:14px;}
        .start-card p{color:#556961; margin-bottom:32px; line-height:1.7;}
        .start-rules{
          background:var(--sand); border-radius:16px; padding:20px 22px;
          margin-bottom:32px; border:1px solid rgba(15,36,29,0.06);
        }
        .start-rules p{color:#4d6059; font-size:0.88rem; margin-bottom:0; line-height:1.6;}
        .start-rules p + p{margin-top:8px;}
        .start-rules strong{color:var(--canopy);}
        .start-rule-row{display:flex; gap:22px; flex-wrap:wrap; margin-bottom:16px;}
        .start-rule-chip{
          display:flex; align-items:center; gap:8px; font-size:0.88rem; font-weight:600;
          color:#33473F; background:var(--tide-pale); padding:9px 16px; border-radius:999px;
        }
        .start-rule-chip svg{width:15px; height:15px;}

        /* ===== Quiz shell ===== */
        .quiz-shell{max-width:720px; margin:0 auto;}

        /* ===== Quiz header sticky ===== */
        .quiz-header{
          background:var(--paper); border-radius:18px; padding:18px 22px;
          border:1px solid rgba(15,36,29,0.07); box-shadow:0 4px 16px -10px rgba(15,36,29,0.1);
          margin-bottom:24px;
        }
        .quiz-header-top{display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;}
        .quiz-header-title{font-family:'Fraunces',serif; font-size:1rem; color:var(--canopy); font-weight:600;}
        .quiz-counter{font-family:'Space Mono',monospace; font-size:0.8rem; color:#556961; font-weight:700;}
        .quiz-progress-track{height:8px; border-radius:999px; background:var(--sand-deep); overflow:hidden;}
        .quiz-progress-fill{height:100%; border-radius:999px; background:linear-gradient(90deg,var(--estuary),var(--estuary-light)); transition:width .45s cubic-bezier(.4,0,.2,1);}

        /* ===== Countdown timer ===== */
        .quiz-timer{
          display:inline-flex; align-items:center; gap:7px;
          padding:6px 14px; border-radius:999px; font-family:'Space Mono',monospace;
          font-size:0.85rem; font-weight:700; transition:background .4s, color .4s;
        }
        .quiz-timer.normal { background:var(--tide-pale); color:var(--estuary); }
        .quiz-timer.warn   { background:#FFF3D0; color:#B87800; }
        .quiz-timer.danger { background:#F8E4E7; color:var(--danger); animation:timerPulse 1s ease infinite; }
        @keyframes timerPulse{ 0%,100%{opacity:1;} 50%{opacity:0.55;} }
        .quiz-timer svg{ width:14px; height:14px; flex-shrink:0; }

        /* ===== Quiz box (slide animation) ===== */
        @keyframes slideInRight { from{opacity:0; transform:translateX(36px);} to{opacity:1; transform:translateX(0);} }
        @keyframes slideInLeft  { from{opacity:0; transform:translateX(-36px);} to{opacity:1; transform:translateX(0);} }
        @keyframes slideOutRight{ from{opacity:1; transform:translateX(0);} to{opacity:0; transform:translateX(36px);} }
        @keyframes slideOutLeft { from{opacity:1; transform:translateX(0);} to{opacity:0; transform:translateX(-36px);} }

        .quiz-box{
          background:var(--paper); border-radius:var(--radius-lg); padding:38px 34px;
          border:1px solid rgba(15,36,29,0.06); box-shadow:0 20px 40px -24px rgba(15,36,29,0.18);
        }
        .quiz-box.slide-exit-right{ animation:slideOutLeft .22s ease forwards; }
        .quiz-box.slide-exit-left { animation:slideOutRight .22s ease forwards; }
        .quiz-box.slide-enter-right{ animation:slideInRight .32s cubic-bezier(.4,0,.2,1) forwards; }
        .quiz-box.slide-enter-left { animation:slideInLeft .32s cubic-bezier(.4,0,.2,1) forwards; }

        .quiz-materi-tag{
          display:inline-flex; align-items:center; gap:6px; font-size:0.72rem; font-weight:700;
          color:var(--estuary); background:var(--tide-pale); padding:5px 12px; border-radius:999px; margin-bottom:18px;
        }
        .quiz-q-num{font-family:'Space Mono',monospace; font-size:0.78rem; color:#8A9A93; margin-bottom:10px;}
        .quiz-box h3{font-size:1.15rem; margin-bottom:24px; line-height:1.5; color:var(--canopy);}

        /* ===== Answer options ===== */
        .quiz-option{
          display:flex; align-items:center; gap:14px; width:100%; text-align:left;
          padding:15px 18px; border-radius:14px; border:1.5px solid rgba(15,36,29,0.1);
          background:var(--sand); margin-bottom:10px; cursor:pointer; font-size:0.92rem;
          transition:border-color .2s ease, background .2s ease, transform .15s ease;
          font-family:'Plus Jakarta Sans',sans-serif; color:var(--ink);
        }
        .quiz-option:hover:not(.selected){border-color:var(--estuary); background:#edf4ef;}
        .quiz-option:hover:not(.selected) .quiz-option-dot{border-color:var(--estuary);}
        .quiz-option.selected{
          border-color:var(--estuary); background:var(--tide-pale); font-weight:600;
          transform:translateY(-1px); box-shadow:0 6px 16px -8px rgba(47,107,87,0.25);
        }
        .quiz-option-dot{
          width:26px; height:26px; border-radius:50%; border:1.5px solid rgba(15,36,29,0.2);
          flex-shrink:0; display:flex; align-items:center; justify-content:center;
          font-family:'Space Mono',monospace; font-size:0.72rem; color:#556961;
          transition:all .2s ease;
        }
        .quiz-option.selected .quiz-option-dot{
          border-color:var(--estuary); background:var(--estuary); color:var(--paper);
        }

        /* ===== Quiz nav ===== */
        .quiz-nav-row{display:flex; justify-content:space-between; align-items:center; margin-top:28px; gap:12px;}

        /* ===== No-answer warning ===== */
        .no-answer-hint{
          font-size:0.8rem; color:var(--danger); text-align:center;
          margin-top:10px; opacity:0; transition:opacity .3s ease;
        }
        .no-answer-hint.show-hint{opacity:1;}

        /* ===== Result ===== */
        .result-card{
          max-width:720px; margin:0 auto; background:var(--paper);
          border-radius:var(--radius-lg); padding:48px 44px;
          border:1px solid rgba(15,36,29,0.06); box-shadow:0 24px 48px -24px rgba(15,36,29,0.2);
          animation:popIn .4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes popIn{from{opacity:0; transform:translateY(18px) scale(.98);}to{opacity:1; transform:translateY(0) scale(1);}}
        .result-hero{text-align:center; margin-bottom:36px;}

        /* Ring skor */
        .result-ring-wrap{
          width:150px; height:150px; border-radius:50%; margin:0 auto 22px;
          display:flex; align-items:center; justify-content:center;
          padding:6px;
          background:var(--sand-deep);
          box-shadow:0 0 0 4px var(--tide-pale);
          position:relative;
        }
        .result-ring-svg{position:absolute; inset:0; width:100%; height:100%; transform:rotate(-90deg);}
        .result-ring-inner{
          width:118px; height:118px; border-radius:50%; background:var(--paper);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          position:relative; z-index:1;
        }
        .result-score-big{font-family:'Fraunces',serif; font-size:2.2rem; font-weight:700; color:var(--canopy); line-height:1;}
        .result-score-label{font-size:0.7rem; color:#8A9A93; font-family:'Space Mono',monospace; letter-spacing:0.06em; margin-top:3px;}

        .result-badge{
          display:inline-flex; align-items:center; gap:8px; padding:10px 22px; border-radius:999px;
          font-weight:700; font-size:1rem; margin-bottom:14px;
          white-space:nowrap; flex-wrap:nowrap;
        }
        .result-hero p{color:#556961; max-width:480px; margin:10px auto 0; font-size:0.95rem; line-height:1.65;}

        .result-stat-row{
          display:grid; grid-template-columns:1fr 1fr; gap:14px; margin:28px 0;
        }
        .result-stat{
          display:flex; align-items:center; gap:12px; padding:16px 20px;
          border-radius:14px; font-size:0.92rem; font-weight:600;
        }
        .result-stat.correct{background:#E4EFE7; color:#1a4a35;}
        .result-stat.wrong{background:#F8E4E7; color:#7A2E3C;}
        .result-stat svg{width:18px; height:18px; flex-shrink:0;}
        .result-stat-num{font-family:'Fraunces',serif; font-size:1.4rem; margin-left:auto;}

        .result-actions{display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-top:28px;}

        /* ===== Review section ===== */
        .review-toggle{
          display:flex; align-items:center; gap:10px; padding:14px 22px;
          border-radius:14px; border:1.5px solid rgba(47,107,87,0.25);
          background:var(--tide-pale); color:var(--estuary); cursor:pointer;
          font-weight:700; font-size:0.9rem; margin:0 auto; width:fit-content;
          transition:background .2s, transform .2s;
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .review-toggle:hover{background:#d0e4d8; transform:translateY(-1px);}
        .review-toggle svg{width:18px; height:18px;}

        .review-list{max-width:720px; margin:32px auto 0;}
        .review-item{
          background:var(--paper); border-radius:18px; padding:24px 26px; margin-bottom:16px;
          border:1px solid rgba(15,36,29,0.06);
          animation:slideDown .3s ease;
        }
        @keyframes slideDown{from{opacity:0; transform:translateY(-8px);}to{opacity:1; transform:translateY(0);}}
        .review-num{font-family:'Space Mono',monospace; font-size:0.72rem; color:#8A9A93; margin-bottom:8px;}
        .review-item h4{font-size:0.96rem; margin-bottom:16px; line-height:1.55; color:var(--canopy);}
        .review-option{
          display:flex; align-items:center; gap:10px; padding:11px 15px; border-radius:12px;
          font-size:0.88rem; margin-bottom:8px; background:var(--sand); color:#4d5f58;
        }
        .review-option.correct{background:#E4EFE7; color:var(--canopy); font-weight:600;}
        .review-option.wrong{background:#F8E4E7; color:#7A2E3C; font-weight:600;}
        .review-option svg{width:15px; height:15px; flex-shrink:0;}
        .review-explain{
          margin-top:14px; padding:14px 16px; border-radius:12px; background:var(--tide-pale);
          font-size:0.85rem; color:#33473F; line-height:1.65; border-left:3px solid var(--estuary);
        }

        /* ===== Tabel data stimulus ===== */
        .quiz-stimulus-intro{
          font-size:0.92rem; color:#4d6059; margin-bottom:14px; line-height:1.65;
        }
        .quiz-table-wrap{
          overflow-x:auto; margin-bottom:22px; border-radius:14px;
          border:1px solid rgba(15,36,29,0.1);
        }
        .quiz-data-table{
          width:100%; border-collapse:collapse; font-size:0.85rem;
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .quiz-data-table th{
          background:var(--tide-pale); color:var(--canopy); font-weight:700;
          text-align:left; padding:12px 16px;
          font-family:'Space Mono',monospace; font-size:0.72rem;
          text-transform:uppercase; letter-spacing:0.04em;
          white-space:nowrap;
        }
        .quiz-data-table td{
          padding:12px 16px; border-top:1px solid rgba(15,36,29,0.07);
          color:var(--ink); vertical-align:top;
        }
        .quiz-data-table tbody tr:nth-child(even){ background:var(--sand); }

        /* ===== Textarea uraian ===== */
        .quiz-textarea{
          width:100%; min-height:160px; resize:vertical;
          padding:14px 16px; border-radius:14px; border:1.5px solid rgba(15,36,29,0.15);
          background:var(--sand); font-family:'Plus Jakarta Sans',sans-serif;
          font-size:0.92rem; color:var(--ink); line-height:1.65;
          transition:border-color .2s ease; outline:none;
          margin-top:4px;
        }
        .quiz-textarea:focus{border-color:var(--estuary); background:#edf4ef;}
        .quiz-textarea-label{
          font-size:0.82rem; color:#556961; margin-bottom:8px; display:block;
        }
        .quiz-uraian-note{
          display:flex; align-items:flex-start; gap:8px; padding:11px 14px; border-radius:10px;
          background:#E8F5EC; border:1px solid #b8dfbf; margin-top:10px;
          font-size:0.80rem; color:#1a4a35; line-height:1.55;
        }

        /* ===== Time warning banner ===== */
        .time-warning-bar{
          background:#F8E4E7; border:1.5px solid rgba(194,74,95,0.3);
          border-radius:14px; padding:13px 18px; margin-bottom:18px;
          display:flex; align-items:center; gap:10px;
          font-size:0.88rem; font-weight:600; color:#8A1A30;
          animation:slideDown .3s ease;
        }

        /* ===== Result uraian block ===== */
        .result-uraian-info{
          background:var(--tide-pale); border-radius:14px; padding:16px 20px;
          margin:18px 0 0; font-size:0.88rem; color:#33473F; line-height:1.65;
          border-left:3px solid var(--estuary);
        }
        .result-uraian-info strong{color:var(--canopy);}

        /* ===== 3-stat row + partial ===== */
        .result-stat-row-3{ grid-template-columns:1fr 1fr 1fr; }
        .result-stat.partial{ background:#FFF3D0; color:#7a5800; }

        /* ===== Uraian badge & checklist ===== */
        .uraian-badge{
          display:inline-block; padding:6px 14px; border-radius:999px;
          font-size:0.8rem; font-weight:700; margin-top:10px;
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .poin-kunci-checklist{ list-style:none; margin:10px 0 0; padding:0; font-size:0.85rem; }
        .poin-kunci-checklist li{ padding:4px 0; }
        .poin-kunci-checklist .poin-found{ color:#1a4a35; font-weight:600; }
        .poin-kunci-checklist .poin-missing{ color:#8A9A93; }

        @media(max-width:768px){
          .page-banner .container{padding-left:24px; padding-right:24px;}
          .hero-stats{gap:12px;}
          .start-card, .result-card{padding:32px 24px;}
          .quiz-box{padding:28px 22px;}
          .result-stat-row{grid-template-columns:1fr;}
          .result-stat-row-3{grid-template-columns:1fr;}
          .result-actions{flex-direction:column; align-items:stretch;}
          .result-actions .btn{justify-content:center;}
        }
        @media(max-width:480px){
          .container{padding:0 18px;}
          .page-banner{min-height:auto; padding:72px 0 80px;}
          .hero-stat{padding:8px 14px; font-size:0.82rem;}
          .quiz-option{padding:13px 15px; font-size:0.88rem;}
          .quiz-nav-row{flex-direction:row; gap:10px; margin-top:22px;}
          .quiz-nav-row .btn{flex:1; justify-content:center; padding:13px 14px; font-size:0.84rem; white-space:nowrap;}
        }
      `}</style>

      <Navbar />

      {/* ======================== HERO BANNER ======================== */}
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow reveal" style={{ color: "var(--amber)" }}>
            ✦ Evaluasi Pembelajaran
          </span>
          <h1 className="reveal">Instrumen Berpikir Kausal Ekosistem Mangrove</h1>
          <p className="reveal">
            Evaluasi akhir kemampuan berpikir kausal — mengidentifikasi, memprediksi, dan
            menentukan hubungan sebab-akibat dalam ekosistem mangrove.
          </p>

          <div className="hero-stats reveal">
            <div className="hero-stat">
              <ClipboardIcon />
              <span><strong>15</strong> Soal dinilai otomatis</span>
            </div>
            <div className="hero-stat">
              <ClockIcon />
              <span>±<strong>60</strong>–<strong>90</strong> Menit</span>
            </div>
            <div className="hero-stat">
              <StarIcon />
              <span>
                Skor Terbaik:{" "}
                <strong>
                  {!loggedIn
                    ? "Login dulu"
                    : loadingBest
                      ? "..."
                      : bestScore !== null
                        ? `${bestScore}`
                        : "—"}
                </strong>
              </span>
            </div>
          </div>
        </div>
        <WaveDividerLocal fill="var(--sand)" />
      </section>

      {/* ======================== KONTEN UTAMA ======================== */}
      {!loggedIn ? (
        /* ------- AUTH GATE ------- */
        <section className="section">
          <div className="container">
            <div className="gate-card reveal">
              <div className="gate-icon"><LockIcon /></div>
              <h3>Masuk Terlebih Dahulu</h3>
              <p>Kamu perlu login untuk mengerjakan kuis dan menyimpan hasilnya.</p>
              <button
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => navigate("/login")}
              >
                Login Sekarang
              </button>
            </div>
          </div>
        </section>
      ) : phase === "start" ? (
        /* ------- START SCREEN ------- */
        <section className="section">
          <div className="container">
            <StartScreen onStart={() => setPhase("quiz")} bestScore={bestScore} />
          </div>
        </section>
      ) : phase === "quiz" ? (
        /* ------- QUIZ ------- */
        <section className="section">
          <div className="container quiz-shell">
            {/* Header */}
            <div className="quiz-header reveal show">
              <div className="quiz-header-top">
                <span className="quiz-header-title">Kuis MangrovEdu</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="quiz-counter">
                    Pertanyaan {current + 1} / {questions.length}
                  </span>
                  <QuizTimer timeLeft={timeLeft} />
                </div>
              </div>
              <div className="quiz-progress-track">
                <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>

              {/* Time warning banner */}
              {timeWarning && (
                <div className="time-warning-bar">
                  ⏰ Waktu telah habis! Kamu masih bisa menyelesaikan jawaban dan menyerahkan kuis.
                  <button className="btn btn-primary" style={{ marginLeft: "auto", padding: "8px 18px", fontSize: "0.85rem" }} onClick={handleSubmit}>
                    Kumpulkan Sekarang <ArrowIcon />
                  </button>
                </div>
              )}
            </div>

            {/* Question card */}
            <QuestionCard
              key={q.id}
              q={q}
              current={current}
              total={questions.length}
              selectedAnswer={answers[q.id]}
              onSelect={(val) => {
                if (phase !== "quiz") return;
                setAnswers((a) => ({ ...a, [q.id]: val }));
              }}
              onPrev={goPrev}
              onNext={goNext}
              isFirst={isFirst}
              isLast={isLast}
              answered={answered}
              slideDir={slideDir}
              animating={animating}
            />
          </div>
        </section>
      ) : (
        /* ------- RESULT ------- */
        <section className="section">
          <div className="container">
            <ResultScreen
              jumlahBenar={jumlahBenar}
              jumlahSebagian={jumlahSebagian}
              jumlahSalah={jumlahSalah}
              total={total}
              pct={pct}
              category={category}
              saving={saving}
              onReset={resetQuiz}
              showReview={showReview}
              onToggleReview={() => setShowReview((v) => !v)}
              answers={answers}
              questions={questions}
              results={results}
            />
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

/* =========================================================
   START SCREEN COMPONENT
   ========================================================= */
function StartScreen({ onStart, bestScore }) {
  return (
    <div className="start-card reveal show">
      <div className="start-icon">
        <ClipboardIcon />
      </div>
      <h2>Siap Mengerjakan Instrumen Berpikir Kausal?</h2>
      <p>
        Instrumen ini terdiri dari <strong>15 soal</strong> yang <strong>dinilai otomatis</strong> —
        9 Pilihan Ganda (PG) dan 6 Uraian berbasis kata kunci. Soal mencakup tiga indikator:
        memprediksi penyebab, menentukan akibat, dan mengidentifikasi penyebab dalam konteks ekosistem mangrove.
      </p>

      <div className="start-rule-row">
        <div className="start-rule-chip">
          <ClipboardIcon /> 15 Soal (PG + Uraian)
        </div>
        <div className="start-rule-chip">
          <ClockIcon /> Estimasi 60–90 Menit
        </div>
        {bestScore !== null && (
          <div className="start-rule-chip">
            <StarIcon /> Skor Terbaik: {bestScore}
          </div>
        )}
      </div>

      <div className="start-rules">
        <p>📌 <strong>Panduan mengerjakan:</strong></p>
        <p>• <strong>Soal PG (9 soal):</strong> pilih satu jawaban, otomatis benar/salah.</p>
        <p>• <strong>Soal Uraian (6 soal):</strong> ketikkan penjelasanmu — dinilai otomatis berdasarkan kelengkapan penjelasan sebab-akibat yang kamu tulis.</p>
        <p>• Kamu dapat berpindah antar soal — jawaban tersimpan otomatis di sesi ini.</p>
        <p>• Timer berjalan selama <strong>60 menit</strong>. Jika waktu habis, kamu <strong>tetap bisa menyelesaikan</strong> jawaban uraian sebelum mengumpulkan.</p>
        <p>• Skor akhir = total poin dari 15 soal, disimpan otomatis ke Dasbor-mu.</p>
      </div>

      <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "16px" }} onClick={onStart}>
        Mulai Instrumen <ArrowIcon />
      </button>
    </div>
  );
}

/* =========================================================
   QUESTION CARD COMPONENT
   ========================================================= */
function QuestionCard({ q, current, total, selectedAnswer, onSelect, onPrev, onNext, isFirst, isLast, answered, slideDir, animating }) {
  const [showHint, setShowHint] = useState(false);

  const handleNext = () => {
    // Soal uraian: boleh lanjut meski kosong (tidak ada kunci wajib)
    if (q.type === "pg" && !answered) { setShowHint(true); return; }
    setShowHint(false);
    onNext();
  };

  useEffect(() => { setShowHint(false); }, [q.id]);

  const animClass = animating
    ? (slideDir === "right" ? "slide-exit-right" : "slide-exit-left")
    : (slideDir === "right-in" ? "slide-enter-right" : slideDir === "left-in" ? "slide-enter-left" : "");

  const labels = ["A", "B", "C", "D"];

  // Label warna indikator
  const indikatorColor = {
    "Cause Predicting": { bg: "#E1F1F1", color: "#1E8A8C", icon: "🔍" },
    "Effect Determining": { bg: "#FBEEDA", color: "#CE8324", icon: "⚡" },
    "Cause Identifying": { bg: "var(--tide-pale)", color: "var(--estuary)", icon: "🧠" },
  }[q.indikator] || { bg: "var(--tide-pale)", color: "var(--estuary)", icon: "📚" };

  return (
    <div className={`quiz-box ${animClass}`}>
      <div className="quiz-materi-tag" style={{ background: indikatorColor.bg, color: indikatorColor.color }}>
        {indikatorColor.icon} {q.indikator}
        {q.type === "uraian" && (
          <span style={{ marginLeft: 8, fontSize: "0.68rem", background: "rgba(0,0,0,0.08)", padding: "2px 8px", borderRadius: 999 }}>Uraian</span>
        )}
      </div>
      <div className="quiz-q-num">Soal {current + 1} dari {total}</div>

      {q.type === "uraian" ? (
        <>
          {q.intro && <p className="quiz-stimulus-intro">{q.intro}</p>}
          {q.table && (
            <div className="quiz-table-wrap">
              <table className="quiz-data-table">
                <thead>
                  <tr>{q.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {q.table.rows.map((row, ri) => (
                    <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <h3>{q.q}</h3>
          <label className="quiz-textarea-label" htmlFor={`uraian-${q.id}`}>
            ✍️ Tulis jawabanmu di bawah ini:
          </label>
          <textarea
            id={`uraian-${q.id}`}
            className="quiz-textarea"
            placeholder="Ketikkan jawabanmu di sini…"
            value={selectedAnswer ?? ""}
            onChange={(e) => onSelect(e.target.value)}
          />
          <div className="quiz-uraian-note">
            ✅ Jawabanmu akan dinilai otomatis berdasarkan kelengkapan penjelasan sebab-akibat yang kamu tulis.
          </div>
        </>
      ) : (
        <>
          <h3>{q.q}</h3>
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className={`quiz-option${selectedAnswer === i ? " selected" : ""}`}
              onClick={() => onSelect(i)}
            >
              <span className="quiz-option-dot">{labels[i]}</span>
              {opt}
            </button>
          ))}
          <div className={`no-answer-hint${showHint ? " show-hint" : ""}`}>
            ⚠️ Pilih salah satu jawaban sebelum melanjutkan.
          </div>
        </>
      )}

      <div className="quiz-nav-row">
        <button
          className="btn btn-outline"
          onClick={onPrev}
          disabled={isFirst}
        >
          <ArrowLeftIcon /> Sebelumnya
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          {isLast ? "Selesaikan & Kumpulkan" : "Selanjutnya"} <ArrowIcon />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   RESULT SCREEN COMPONENT
   ========================================================= */
function ResultScreen({ jumlahBenar, jumlahSebagian, jumlahSalah, total, pct, category, saving, onReset, showReview, onToggleReview, answers, questions, results }) {
  const radius = 58;
  const circ = 2 * Math.PI * radius;
  const strokeDash = circ - (pct / 100) * circ;

  return (
    <>
      <div className="result-card">
        {/* Ring score */}
        <div className="result-hero">
          <div className="result-ring-wrap">
            <svg className="result-ring-svg" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r={radius} fill="none" stroke="var(--sand-deep)" strokeWidth="9" />
              <circle
                cx="75" cy="75" r={radius} fill="none"
                stroke={category.color} strokeWidth="9" strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={strokeDash}
                style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
              />
            </svg>
            <div className="result-ring-inner">
              <span className="result-score-big">{pct}</span>
              <span className="result-score-label">SKOR</span>
            </div>
          </div>

          <div className="result-badge" style={{ color: category.color, background: category.bg }}>
            {category.emoji} {category.label}
          </div>
          <p>{category.msg}</p>
        </div>

        <div className="result-stat-row result-stat-row-3">
          <div className="result-stat correct">
            <CheckIcon /> Benar
            <span className="result-stat-num">{jumlahBenar}</span>
          </div>
          <div className="result-stat partial">
            <span style={{ fontWeight: 700 }}>½</span> Sebagian
            <span className="result-stat-num">{jumlahSebagian}</span>
          </div>
          <div className="result-stat wrong">
            <XIcon /> Salah
            <span className="result-stat-num">{jumlahSalah}</span>
          </div>
        </div>

        {saving && (
          <p style={{ textAlign: "center", fontSize: "0.82rem", color: "#8A9A93", marginBottom: "8px" }}>
            ⏳ Menyimpan hasilmu…
          </p>
        )}

        <div className="result-actions">
          <button className="btn btn-ghost" onClick={onReset}>
            <RefreshIcon /> Ulangi Kuis
          </button>
          <Link to="/dashboard" className="btn btn-primary">
            Lihat Dasbor <ArrowIcon />
          </Link>
        </div>
      </div>

      {/* Review Toggle */}
      <div style={{ textAlign: "center", marginTop: "32px" }}>
        <button className="review-toggle" onClick={onToggleReview}>
          <ClipboardIcon />
          {showReview ? "Sembunyikan Pembahasan" : "📋 Lihat Pembahasan Jawaban"}
        </button>
      </div>

      {/* Review Items */}
      {showReview && (
        <div className="review-list">
          {questions.map((item, index) => {
            const userAns = answers[item.id];
            const labels = ["A", "B", "C", "D"];
            return (
              <div className="review-item" key={item.id}>
                <div className="review-num">Soal {index + 1} · {item.indikator} {item.type === "uraian" ? "— Uraian" : "— PG"}</div>
                <h4 style={{ whiteSpace: "pre-wrap" }}>{item.q}</h4>

                {item.type === "pg" ? (
                  <>
                    {item.options.map((opt, i) => {
                      let cls = "";
                      if (i === item.correct) cls = "correct";
                      else if (i === userAns) cls = "wrong";
                      return (
                        <div className={`review-option ${cls}`} key={i}>
                          {i === item.correct ? <CheckIcon /> : i === userAns ? <XIcon /> : <span style={{ width: 15 }} />}
                          <span style={{ fontFamily: "'Space Mono',monospace", marginRight: 6 }}>{labels[i]}.</span>
                          {opt}
                        </div>
                      );
                    })}
                    {userAns === undefined && (
                      <div className="review-option wrong" style={{ marginTop: 4 }}>
                        <XIcon /> Soal ini tidak dijawab
                      </div>
                    )}
                    <div className="review-explain">
                      💡 <strong>Penjelasan:</strong> {item.explanation}
                    </div>
                  </>
                ) : (() => {
                  const r = results.find((x) => x.id === item.id);
                  const badgeStyle = {
                    benar: { bg: "#E4EFE7", color: "#1a4a35", label: "✓ Benar" },
                    sebagian: { bg: "#FFF3D0", color: "#7a5800", label: "◐ Sebagian Benar" },
                    salah: { bg: "#F8E4E7", color: "#7A2E3C", label: "✗ Salah" },
                  }[r?.level] || { bg: "#F8E4E7", color: "#7A2E3C", label: "✗ Salah" };
                  return (
                    <>
                      {item.intro && <p className="quiz-stimulus-intro" style={{ marginBottom: 10 }}>{item.intro}</p>}
                      {item.table && (
                        <div className="quiz-table-wrap" style={{ marginBottom: 14 }}>
                          <table className="quiz-data-table">
                            <thead><tr>{item.table.headers.map((h, hi) => <th key={hi}>{h}</th>)}</tr></thead>
                            <tbody>{item.table.rows.map((row, ri) => (
                              <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                            ))}</tbody>
                          </table>
                        </div>
                      )}
                      <div className="review-explain" style={{ marginTop: 8 }}>
                        <strong>📝 Jawabanmu:</strong>
                        <p style={{ marginTop: 8, whiteSpace: "pre-wrap", fontStyle: userAns ? "normal" : "italic", opacity: userAns ? 1 : 0.6 }}>
                          {userAns ? String(userAns) : "(tidak diisi)"}
                        </p>
                      </div>
                      <span className="uraian-badge" style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
                        {badgeStyle.label} · {r?.matchedCount ?? 0}/{r?.total ?? item.poinKunci?.length ?? 0} poin kunci ketemu
                      </span>
                      <div className="review-explain" style={{ marginTop: 10 }}>
                        <strong>💡 Contoh jawaban yang baik:</strong>
                        <p style={{ marginTop: 6 }}>{item.jawabanIdeal}</p>
                        <ul className="poin-kunci-checklist">
                          {(r?.matched ?? item.poinKunci?.map(p => ({ ...p, found: false })) ?? []).map((p, pi) => (
                            <li key={pi} className={p.found ? "poin-found" : "poin-missing"}>
                              {p.found ? "✓" : "○"} {p.text}
                            </li>
                          ))}
                        </ul>
                        <p style={{ marginTop: 8, fontStyle: "italic", fontSize: "0.85rem", color: "#556961" }}>
                          Alur sebab-akibat: {item.hubunganUtama}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* =========================================================
   QUIZ TIMER COMPONENT
   ========================================================= */
function QuizTimer({ timeLeft }) {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const cls =
    timeLeft <= 60 ? "danger" :
      timeLeft <= 120 ? "warn" :
        "normal";

  return (
    <span className={`quiz-timer ${cls}`} title="Sisa waktu pengerjaan">
      {/* Clock icon inline */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
      {mins}:{secs}
    </span>
  );
}

/* =========================================================
   WAVE DIVIDER (identik dengan Simulasi & Materi)
   ========================================================= */
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