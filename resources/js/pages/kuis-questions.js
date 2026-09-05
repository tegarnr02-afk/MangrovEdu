// Instrumen Soal Berpikir Kausal Ekosistem Mangrove
// 15 soal: 9 PG (correct: index 0-based) + 6 uraian (guidance: panduan refleksi)
// Indikator: Cause Predicting | Effect Determining | Cause Identifying

export const questions = [
  /* ===== Indikator 1: Cause Predicting ===== */
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
  },
  {
    id: 3, indikator: "Cause Predicting", type: "uraian",
    q: "Perhatikan data hasil pengamatan berikut di dua titik berbeda pada kawasan mangrove yang sama:\n\nTitik A — Kerapatan Mangrove: Rapat | Ketebalan Lumpur: Tebal dan lembap | Lubang Kepiting per 10 m²: 18\nTitik B — Kerapatan Mangrove: Jarang (banyak tunggul bekas tebangan) | Ketebalan Lumpur: Tipis dan mulai mengeras | Lubang Kepiting per 10 m²: 4\n\nBerdasarkan data tersebut, prediksikan penyebab utama rendahnya jumlah lubang kepiting di Titik B dibandingkan Titik A. Jelaskan alasanmu dengan menghubungkan kondisi mangrove, sedimen, dan habitat kepiting.",
    guidance: "Arahkan ke: mangrove jarang → akar tidak lagi menahan/menyuburkan sedimen → lumpur menipis & mengeras → habitat lubang kepiting hilang → jumlah kepiting turun.",
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
  },
  {
    id: 5, indikator: "Cause Predicting", type: "uraian",
    q: "Seorang siswa melakukan pengamatan burung di dua kawasan pesisir. Kawasan pertama memiliki hutan mangrove yang luas dan beragam jenis pohonnya. Kawasan kedua adalah bekas hutan mangrove yang sudah berubah menjadi tambak terbuka. Hasil pengamatan menunjukkan jumlah jenis burung yang hinggap di kawasan pertama jauh lebih banyak daripada kawasan kedua.\n\nPrediksikan dua kemungkinan penyebab perbedaan jumlah jenis burung tersebut, kaitkan jawabanmu dengan ketersediaan makanan dan tempat berlindung bagi burung.",
    guidance: "Dua arah jawaban: (1) keragaman pohon → lebih banyak sumber makanan (serangga, ikan kecil, buah); (2) struktur vegetasi rapat → lebih banyak tempat berlindung/bersarang, sedangkan tambak terbuka minim vegetasi.",
  },

  /* ===== Indikator 2: Effect Determining ===== */
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
  },
  {
    id: 7, indikator: "Effect Determining", type: "uraian",
    q: "Sebuah kawasan pantai kehilangan hampir seluruh mangrovenya akibat pembukaan lahan. Dua tahun kemudian, gelombang laut mulai mengikis daratan hingga beberapa rumah warga di dekat pantai retak akibat tanah di bawahnya tergerus.\n\nJelaskan rentetan akibat (secara berurutan) mulai dari hilangnya mangrove hingga terjadinya kerusakan rumah warga tersebut. Sertakan minimal tiga tahapan hubungan sebab-akibat dalam penjelasanmu.",
    guidance: "Rantai minimal 3 tahap: mangrove hilang → akar penahan sedimen & peredam gelombang hilang → gelombang menghantam garis pantai langsung → abrasi/pengikisan tanah pesisir → tanah di bawah rumah warga tergerus → rumah retak/rusak.",
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
  },
  {
    id: 9, indikator: "Effect Determining", type: "uraian",
    q: "Warga di sekitar kawasan mangrove terbiasa membuang sampah plastik ke aliran sungai yang bermuara di hutan mangrove. Lama-kelamaan, sampah plastik tersebut menumpuk dan menutupi akar-akar napas (pneumatofor) pohon mangrove.\n\nJelaskan rentetan akibat yang mungkin terjadi terhadap pohon mangrove, kondisi tanah, dan organisme yang hidup di sekitarnya jika kondisi ini dibiarkan terus-menerus.",
    guidance: "Arahkan ke: akar napas tertutup → pertukaran oksigen terganggu → pohon stres/mati → tutupan vegetasi berkurang → sedimen tidak tertahan & kualitas tanah menurun → habitat organisme bentik rusak → keanekaragaman hayati menurun.",
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
  },

  /* ===== Indikator 3: Cause Identifying ===== */
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
  },
  {
    id: 12, indikator: "Cause Identifying", type: "uraian",
    q: "Perhatikan data dari tiga kawasan mangrove dengan tingkat kerapatan berbeda:\n\nKawasan P — Kerapatan: Sangat rapat | Kepiting per 10 m²: 20 | Jenis Ikan Kecil: 12\nKawasan Q — Kerapatan: Sedang | Kepiting per 10 m²: 11 | Jenis Ikan Kecil: 7\nKawasan R — Kerapatan: Sangat jarang | Kepiting per 10 m²: 3 | Jenis Ikan Kecil: 2\n\nIdentifikasi dan jelaskan hubungan antara kerapatan mangrove dengan jumlah kepiting dan jenis ikan kecil. Kaitkan jawabanmu dengan fungsi mangrove sebagai penyedia habitat.",
    guidance: "Pola yang diharapkan: semakin rapat mangrove → semakin tinggi jumlah kepiting & jenis ikan (berbanding lurus), karena kerapatan akar & vegetasi menyediakan lebih banyak ruang berlindung, sumber makanan, dan tempat berkembang biak.",
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
  },
  {
    id: 14, indikator: "Cause Identifying", type: "uraian",
    q: "Dua kawasan pantai bertetangga mengalami hantaman gelombang besar akibat cuaca ekstrem. Kawasan pertama yang memiliki sabuk mangrove lebar hanya mengalami sedikit pengikisan tanah, sedangkan kawasan kedua yang mangrovenya sudah gundul mengalami abrasi parah hingga sebagian lahan warga hilang.\n\nIdentifikasi penyebab perbedaan tingkat kerusakan di kedua kawasan tersebut. Jelaskan keterkaitan antara keberadaan mangrove, kekuatan gelombang yang sampai ke daratan, dan tingkat abrasi yang terjadi.",
    guidance: "Arahkan ke: sabuk mangrove lebar meredam/memecah energi gelombang sebelum mencapai daratan → dampak ke tanah kecil; tanpa mangrove, gelombang penuh menghantam garis pantai langsung → abrasi parah.",
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
  },
];

export const pgQuestions = questions.filter(q => q.type === "pg");
export const TOTAL_PG = pgQuestions.length; // 9
export const TOTAL_SOAL = questions.length;  // 15
export const QUIZ_DURATION = 3600;           // 60 menit

export function getCategory(pct) {
  if (pct >= 90) return { label: "Sangat Baik", emoji: "🌟", color: "#2F6B57", bg: "#E4EFE7", msg: "Luar biasa! Kemampuan berpikir kausalmu tentang mangrove sangat baik." };
  if (pct >= 75) return { label: "Baik", emoji: "👍", color: "#CE8324", bg: "#FBEEDA", msg: "Bagus! Kamu memahami sebagian besar hubungan sebab-akibat ekosistem mangrove." };
  if (pct >= 60) return { label: "Cukup", emoji: "📚", color: "#1E8A8C", bg: "#E1F1F1", msg: "Cukup baik. Pelajari kembali hubungan sebab-akibat di setiap materi." };
  return { label: "Perlu Belajar Lagi", emoji: "💪", color: "#C24A5F", bg: "#F8E4E7", msg: "Jangan menyerah! Ulangi materi dan eksplorasi Lab Virtual, lalu coba lagi." };
}

export const INDIKATOR_LABEL = {
  "Cause Predicting": "Memprediksi Penyebab",
  "Effect Determining": "Menentukan Akibat",
  "Cause Identifying": "Mengidentifikasi Penyebab",
};
