import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../lib/api";

/**
 * Route guard terpusat — dipasang di app.jsx untuk membungkus setiap
 * halaman yang wajib login (Materi, Lab Virtual, Simulasi, Kuis, Dasbor).
 *
 * Kenapa tidak cukup hanya cek `localStorage.getItem("token")`?
 * Karena user bisa membuka console browser dan mengetik
 * `localStorage.setItem("token","apa saja")` untuk mengelabui cek itu.
 * Supaya tidak bisa dibypass, komponen ini memverifikasi token ke server
 * lewat GET /me (endpoint auth:sanctum untuk ambil user yang sedang
 * login — lihat AuthController::me di routes/api.php). Kalau tokennya
 * tidak valid/expired, server akan balas 401, token dihapus, dan user
 * diarahkan ke halaman login — sebelum konten halaman manapun sempat
 * dirender.
 */
export default function RequireAuth({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState(() =>
    localStorage.getItem("token") ? "checking" : "unauthenticated"
  );

  useEffect(() => {
    if (status !== "checking") return;
    let cancelled = false;

    api
      .get("/me")
      .then(() => {
        if (!cancelled) setStatus("authenticated");
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem("token");
          setStatus("unauthenticated");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status === "checking") {
    return (
      <main style={{ padding: "100px 32px 40px", textAlign: "center", color: "#2F6B57" }}>
        Memeriksa sesi login...
      </main>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
