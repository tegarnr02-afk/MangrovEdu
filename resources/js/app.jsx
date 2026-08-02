import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Materi from "./pages/Materi";
import LabVirtual from "./pages/LabVirtual";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EkosistemMangrove from "./pages/EkosistemMangrove";
import InteraksiEkosistem from "./pages/InteraksiEkosistem";
import PerubahanLingkungan from "./pages/PerubahanLingkungan";
import AbrasiPantai from "./pages/AbrasiPantai";
import KonservasiMangrove from "./pages/KonservasiMangrove";

function ComingSoon() {
  return (
    <main style={{ padding: "100px 32px 40px", textAlign: "center" }}>
      <h1>Segera Hadir</h1>
      <p>Halaman ini masih dalam pengembangan.</p>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/materi" element={<Materi />} />
      <Route path="/lab" element={<LabVirtual />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/materi/ekosistem-mangrove" element={<EkosistemMangrove />} />
      <Route path="/materi/interaksi-ekosistem" element={<InteraksiEkosistem />} />
<Route path="/materi/perubahan-lingkungan" element={<PerubahanLingkungan />} />
<Route path="/materi/abrasi-pantai" element={<AbrasiPantai />} />
<Route path="/materi/konservasi-mangrove" element={<KonservasiMangrove />} />
      <Route path="*" element={<ComingSoon />} />
    </Routes>
  </BrowserRouter>
);