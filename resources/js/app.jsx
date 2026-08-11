import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Materi = lazy(() => import("./pages/Materi"));
const LabVirtual = lazy(() => import("./pages/LabVirtual"));
const Simulasi = lazy(() => import("./pages/Simulasi"));
const Kuis = lazy(() => import("./pages/Kuis"));
const Dasbor = lazy(() => import("./pages/Dasbor"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const EkosistemMangrove = lazy(() => import("./pages/EkosistemMangrove"));
const InteraksiEkosistem = lazy(() => import("./pages/InteraksiEkosistem"));
const PerubahanLingkungan = lazy(() => import("./pages/PerubahanLingkungan"));
const AbrasiPantai = lazy(() => import("./pages/AbrasiPantai"));
const KonservasiMangrove = lazy(() => import("./pages/KonservasiMangrove"));

function ComingSoon() {
  return (
    <main style={{ padding: "100px 32px 40px", textAlign: "center" }}>
      <h1>Segera Hadir</h1>
      <p>Halaman ini masih dalam pengembangan.</p>
    </main>
  );
}

function PageLoader() {
  return (
    <main style={{ padding: "100px 32px 40px", textAlign: "center", color: "#2F6B57" }}>
      Memuat halaman...
    </main>
  );
}

/* Guard untuk Vite HMR: kalau app.jsx di-reload ulang oleh dev server
   tanpa unmount root lama dulu, createRoot() kedua di container yang
   sama bikin error "createRoot() called on a container that has
   already been passed" + "removeChild" NotFoundError. Simpan root di
   elemen DOM-nya sendiri supaya reload berikutnya reuse root yang sama
   (root.render() lagi), bukan bikin root baru. */
const container = document.getElementById("app");
const root = container._reactRoot ?? (container._reactRoot = ReactDOM.createRoot(container));

root.render(
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materi" element={<Materi />} />
        <Route path="/lab" element={<LabVirtual />} />
        <Route path="/simulasi" element={<Simulasi />} />
        <Route path="/kuis" element={<Kuis />} />
        <Route path="/dashboard" element={<Dasbor />} />
        <Route path="/login" element={<Login />} />
        {/* Sebelumnya "/register" — diganti "/daftar" supaya cocok dengan
            semua link "Daftar" di Navbar.jsx, AuthHeader.jsx, dan Login.jsx */}
        <Route path="/register" element={<Register />} />
        <Route path="/materi/ekosistem-mangrove" element={<EkosistemMangrove />} />
        <Route path="/materi/interaksi-ekosistem" element={<InteraksiEkosistem />} />
        <Route path="/materi/perubahan-lingkungan" element={<PerubahanLingkungan />} />
        <Route path="/materi/abrasi-pantai" element={<AbrasiPantai />} />
        <Route path="/materi/konservasi-mangrove" element={<KonservasiMangrove />} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);