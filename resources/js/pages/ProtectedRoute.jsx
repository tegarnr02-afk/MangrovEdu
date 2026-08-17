import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Bungkus route yang wajib login dengan komponen ini.
// Cek "token" di localStorage — sumber yang sama persis dipakai
// api.js untuk header Authorization dan untuk redirect otomatis saat 401.
// Kalau belum ada token, user langsung dilempar ke /login SEBELUM
// halaman materi sempat dirender sama sekali (jadi tidak bisa di-bypass
// dengan mengetik URL materi langsung).
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // state={{ from: location }} disimpan supaya nanti (opsional) Login.jsx
    // bisa redirect balik ke halaman materi yang tadi ingin dibuka.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
