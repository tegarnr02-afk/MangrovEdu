import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import heroBg from "./hero-mangrove.png";
import logo from "./logo.png";
import Navbar from "./Navbar";
import api from "../lib/api";

/* ================= ICONS ================= */
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 6.5 12 13l8.5-6.5" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l18 18" />
    <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c7 0 10.5 7 10.5 7a13.3 13.3 0 0 1-3.1 3.9M6.6 6.6C3.4 8.6 1.5 12 1.5 12S5 19 12 19a10.6 10.6 0 0 0 4-.77" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 21c11 0 18-7 18-18-11 0-18 7-18 18Z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="18" height="18">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5Z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
    <path fill="#4CAF50" d="M24 44c5.4 0 10.3-1.8 14.1-5l-6.5-5.5c-2 1.5-4.6 2.5-7.6 2.5-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44Z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.2 5.5l6.5 5.5C41.5 35.9 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5Z" />
  </svg>
);

/* ================= PAGE ================= */
export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [shake, setShake] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Format email tidak valid.";
    if (!form.password) next.password = "Kata sandi wajib diisi.";
    else if (form.password.length < 6) next.password = "Minimal 6 karakter.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 420);
      return;
    }
    setStatus("loading");
    try {
      const { data } = await api.post("/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-changed"));
      setStatus("success");
      setTimeout(() => navigate("/"), 700);
    } catch (err) {
      setStatus("idle");
      setShake(true);
      setTimeout(() => setShake(false), 420);

      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const flat = {};
        Object.keys(serverErrors).forEach((key) => {
          flat[key] = Array.isArray(serverErrors[key]) ? serverErrors[key][0] : serverErrors[key];
        });
        setErrors(flat);
      } else {
        setErrors({ password: "Tidak bisa terhubung ke server. Coba lagi." });
      }
    }
  };

  return (
    <>
      <style>{`
        :root{
          --canopy:#0F241D;
          --estuary:#2F6B57;
          --estuary-light:#3D8267;
          --tide:#89AE9E;
          --tide-pale:#E1EAE2;
          --sand:#F1F4EC;
          --sand-deep:#E7EDDF;
          --silt:#A9784F;
          --silt-light:#C79A6C;
          --amber:#E8A33D;
          --amber-deep:#CE8324;
          --ink:#12261F;
          --paper:#FBFAF5;
          --danger:#C24A5F;
          --shadow: 0 20px 40px -20px rgba(15,36,29,0.35);
          --radius-lg: 28px;
          --radius-md: 18px;
        }
        *{box-sizing:border-box; margin:0; padding:0;}
        html{scroll-behavior:smooth;}
        body{
          font-family:'Plus Jakarta Sans', sans-serif;
          background:var(--sand);
          color:var(--ink);
          line-height:1.6;
          overflow-x:hidden;
        }
        h1,h2,h3,h4{
          font-family:'Fraunces', serif;
          font-weight:600;
          color:var(--canopy);
          line-height:1.12;
          letter-spacing:-0.01em;
        }
        a{ text-decoration:none; color:inherit; }
        ul{ list-style:none; }
        img{ max-width:100%; display:block; }
        .login-page{
          font-family:'Plus Jakarta Sans', sans-serif;
          color:var(--ink);
          height:100vh;
          overflow:hidden;
          display:grid;
          grid-template-columns:1.05fr 1fr;
          padding-top:82px;
        }
        .login-page h1,.login-page h2,.login-page h3{
          font-family:'Fraunces', serif;
          font-weight:600;
          color:var(--canopy);
          line-height:1.14;
          letter-spacing:-0.01em;
        }
        .login-page a{ text-decoration:none; color:inherit; }
        .eyebrow{
          font-family:'Space Mono', monospace;
          text-transform:uppercase;
          letter-spacing:0.14em;
          font-size:0.72rem;
          font-weight:700;
          display:inline-flex; align-items:center; gap:10px;
        }

        /* ===== Left panel ===== */
        .login-visual{
          position:relative;
          overflow:hidden;
          display:flex; flex-direction:column; justify-content:center;
          gap:28px;
          padding:40px 48px;
          height:100%;
          background-image:linear-gradient(180deg, rgba(10,22,17,0.35) 0%, rgba(10,22,17,0.55) 55%, rgba(8,18,14,0.88) 100%), url(${heroBg});
          background-size:cover; background-position:center 30%;
          color:var(--paper);
        }
        .login-visual::before{
          content:""; position:absolute; inset:0;
          background:radial-gradient(120% 90% at 15% 0%, rgba(232,163,61,0.16), transparent 55%);
          pointer-events:none;
        }
        .login-visual-copy{ position:relative; z-index:2; max-width:440px; }
        .login-visual-copy .eyebrow{ color:var(--amber); margin-bottom:18px; }
        .login-visual-copy h2{ font-size:clamp(1.9rem,2.6vw,2.5rem); color:var(--paper); margin-bottom:16px; }
        .login-visual-copy p{ color:rgba(251,250,245,0.78); font-size:1rem; line-height:1.7; margin-bottom:30px; }

        .login-stats{ display:flex; gap:28px; position:relative; z-index:2; }
        .login-stats div{ display:flex; flex-direction:column; gap:4px; }
        .login-stats strong{ font-family:'Fraunces', serif; font-size:1.5rem; color:var(--paper); }
        .login-stats span{ font-size:0.78rem; color:rgba(251,250,245,0.68); }

        /* signature: growing root vine */
        .root-svg{ position:absolute; left:0; bottom:0; width:100%; height:60%; z-index:1; opacity:0.9; }
        .root-path{
          fill:none; stroke:rgba(232,163,61,0.55); stroke-width:1.4;
          stroke-linecap:round;
          stroke-dasharray:900; stroke-dashoffset:900;
          animation:growRoot 2.6s ease forwards 0.3s;
        }
        .root-path.secondary{ stroke:rgba(137,174,158,0.5); stroke-width:1.1; animation-delay:0.7s; }
        @keyframes growRoot{ to{ stroke-dashoffset:0; } }

        .leaf-particle{
          position:absolute; z-index:1; color:var(--tide);
          opacity:0; animation:driftUp 9s linear infinite;
        }
        .leaf-particle svg{ width:100%; height:100%; }
        @keyframes driftUp{
          0%{ opacity:0; transform:translateY(0) rotate(0deg); }
          10%{ opacity:0.55; }
          85%{ opacity:0.35; }
          100%{ opacity:0; transform:translateY(-340px) rotate(50deg); }
        }

        /* ===== Right panel ===== */
        .login-form-side{
          background:var(--sand);
          display:flex; align-items:center; justify-content:center;
          padding:28px 40px;
          height:100%;
          overflow-y:auto;
        }
        .login-card{
          width:100%; max-width:400px;
        }
        .login-card.shake{ animation:shakeCard 0.42s ease; }
        @keyframes shakeCard{
          0%,100%{ transform:translateX(0); }
          20%{ transform:translateX(-8px); }
          40%{ transform:translateX(7px); }
          60%{ transform:translateX(-5px); }
          80%{ transform:translateX(4px); }
        }

        .login-card .eyebrow{ color:var(--estuary); margin-bottom:8px; }
        .login-card h1{ font-size:clamp(1.5rem,2.2vw,1.9rem); margin-bottom:8px; }
        .login-card > p.lead{ color:#556961; font-size:0.92rem; margin-bottom:22px; }

        .field{ position:relative; margin-bottom:14px; }
        .field-input-wrap{ position:relative; }
        .field input{
          width:100%;
          background:var(--paper);
          border:1.5px solid rgba(15,36,29,0.14);
          border-radius:14px;
          padding:18px 16px 8px 46px;
          font-size:0.94rem;
          font-family:'Plus Jakarta Sans', sans-serif;
          color:var(--ink);
          outline:none;
          transition:border-color .2s ease, box-shadow .2s ease;
        }
        .field input:focus{
          border-color:var(--estuary);
          box-shadow:0 0 0 4px rgba(47,107,87,0.12);
        }
        .field.has-error input{ border-color:var(--danger); }
        .field.has-error input:focus{ box-shadow:0 0 0 4px rgba(194,74,95,0.12); }
        .field label{
          position:absolute; left:46px; top:16px;
          font-size:0.96rem; color:#7A8A83;
          pointer-events:none;
          transition:all .18s ease;
        }
        .field input:focus + label,
        .field input:not(:placeholder-shown) + label{
          top:8px; left:46px; font-size:0.68rem; font-weight:700;
          letter-spacing:0.03em; color:var(--estuary);
          text-transform:uppercase;
        }
        .field.has-error input:focus + label,
        .field.has-error input:not(:placeholder-shown) + label{ color:var(--danger); }
        .field-icon{
          position:absolute; left:16px; top:50%; transform:translateY(-50%);
          width:18px; height:18px; color:#7A8A83; pointer-events:none;
        }
        .field input:focus ~ .field-icon{ color:var(--estuary); }
        .field-icon svg{ width:100%; height:100%; }
        .field-toggle{
          position:absolute; right:14px; top:50%; transform:translateY(-50%);
          width:20px; height:20px; color:#7A8A83; background:none; border:none; cursor:pointer;
          padding:0; display:flex; align-items:center; justify-content:center;
        }
        .field-toggle:hover{ color:var(--canopy); }
        .field-toggle svg{ width:18px; height:18px; }
        .field-error{
          font-size:0.76rem; color:var(--danger); margin-top:6px; margin-left:4px;
          font-weight:600;
        }

        .login-row{
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:18px; font-size:0.86rem;
        }
        .remember-check{ display:flex; align-items:center; gap:8px; cursor:pointer; color:#556961; }
        .remember-check input{ accent-color:var(--estuary); width:15px; height:15px; cursor:pointer; }
        .forgot-link{ font-weight:700; color:var(--estuary); }
        .forgot-link:hover{ color:var(--canopy); }

        .login-submit{
          width:100%;
          display:flex; align-items:center; justify-content:center; gap:10px;
          padding:14px; border:none; border-radius:999px;
          background:var(--amber); color:var(--canopy);
          font-weight:700; font-size:0.96rem; font-family:'Plus Jakarta Sans', sans-serif;
          cursor:pointer;
          box-shadow:0 12px 24px -10px rgba(232,163,61,0.7);
          transition:transform .22s ease, box-shadow .22s ease, background .22s ease;
        }
        .login-submit:hover:not(:disabled){ transform:translateY(-2px); box-shadow:0 16px 30px -10px rgba(232,163,61,0.85); }
        .login-submit:disabled{ cursor:default; opacity:0.9; }
        .login-submit.success{ background:var(--estuary); color:var(--paper); box-shadow:0 12px 24px -10px rgba(47,107,87,0.5); }

        .btn-google{
          width:100%;
          display:flex; align-items:center; justify-content:center; gap:10px;
          padding:12px; border-radius:999px;
          background:var(--paper); color:var(--ink);
          border:1.5px solid rgba(15,36,29,0.14);
          font-weight:700; font-size:0.92rem; font-family:'Plus Jakarta Sans', sans-serif;
          cursor:pointer;
          transition:border-color .2s ease, background .2s ease, transform .2s ease;
        }
        .btn-google:hover{ background:#fff; border-color:rgba(15,36,29,0.28); transform:translateY(-1px); }

        .spinner{
          width:16px; height:16px; border-radius:50%;
          border:2.4px solid rgba(15,36,29,0.25); border-top-color:var(--canopy);
          animation:spin .7s linear infinite;
        }
        @keyframes spin{ to{ transform:rotate(360deg); } }
        .check-pop{ animation:popCheck .3s ease; }
        @keyframes popCheck{ from{ transform:scale(0.5); opacity:0; } to{ transform:scale(1); opacity:1; } }

        .login-divider{
          text-align:center; margin:18px 0 14px; position:relative;
          font-size:0.78rem; color:#8A9A93; font-weight:600;
        }
        .login-divider::before, .login-divider::after{
          content:""; position:absolute; top:50%; width:38%; height:1px;
          background:rgba(15,36,29,0.12);
        }
        .login-divider::before{ left:0; }
        .login-divider::after{ right:0; }

        .signup-cta{ text-align:center; font-size:0.9rem; color:#556961; }
        .signup-cta a{ font-weight:700; color:var(--estuary); }
        .signup-cta a:hover{ color:var(--canopy); }

        @media (max-width:960px){
          .login-page{ grid-template-columns:1fr; }
          .login-visual{ display:none; }
          .login-stats{ display:none; }
          .login-form-side{ padding:24px 20px; height:100%; }
          .login-card{ max-width:100%; }
        }
        @media (max-width:480px){
          .login-visual{ min-height:240px; padding:24px 20px 32px; }
          .login-visual-copy .eyebrow{ margin-bottom:10px; font-size:0.66rem; }
          .login-visual-copy h2{ font-size:1.35rem; }
          .login-visual-copy p{ font-size:0.86rem; }
          .login-form-side{ padding:32px 18px 48px; }
          .login-card h1{ font-size:1.5rem; }
          .login-card > p.lead{ font-size:0.9rem; margin-bottom:26px; }
          .field input{ padding:20px 14px 8px 42px; font-size:0.92rem; }
          .field label{ left:42px; }
          .field input:focus + label,
          .field input:not(:placeholder-shown) + label{ left:42px; }
          .field-icon{ left:14px; width:16px; height:16px; }
          .login-row{ flex-direction:column; align-items:flex-start; gap:14px; margin-bottom:24px; }
          .login-submit{ padding:14px; font-size:0.92rem; }
        }
        @media (prefers-reduced-motion: reduce){
          .root-path, .leaf-particle{ animation:none !important; }
        }
      `}</style>

      <Navbar forceSolid />

      <div className="login-page">
        {/* ================= LEFT: VISUAL PANEL ================= */}
        <div className="login-visual">
          <svg className="root-svg" viewBox="0 0 500 400" preserveAspectRatio="none" aria-hidden="true">
            <path className="root-path" d="M40 400 C 60 320, 20 260, 80 200 C 130 150, 90 90, 160 40" />
            <path className="root-path secondary" d="M120 400 C 140 340, 190 300, 170 240 C 150 180, 220 140, 210 70" />
          </svg>

          {[
            { left: "12%", size: 16, delay: "0s" },
            { left: "28%", size: 12, delay: "2s" },
            { left: "45%", size: 18, delay: "4.5s" },
            { left: "62%", size: 13, delay: "1.2s" },
            { left: "78%", size: 15, delay: "3.4s" },
          ].map((p, i) => (
            <span
              key={i}
              className="leaf-particle"
              style={{ left: p.left, bottom: "-10px", width: p.size, height: p.size, animationDelay: p.delay }}
            >
              <LeafIcon />
            </span>
          ))}

          <div className="login-visual-copy">
            <span className="eyebrow">Perjalanan Belajar</span>
            <h2>Setiap akar dimulai dari satu titik.</h2>
            <p>
              Masuk untuk melanjutkan modulmu — dari mengenal ekosistem
              mangrove hingga menguji pemahamanmu lewat laboratorium virtual
              dan kuis interaktif.
            </p>
          </div>

          <div className="login-stats">
            <div><strong>5</strong><span>Modul Interaktif</span></div>
            <div><strong>1</strong><span>Lab Virtual</span></div>
            <div><strong>∞</strong><span>Kesempatan Kuis</span></div>
          </div>
        </div>

        {/* ================= RIGHT: FORM PANEL ================= */}
        <div className="login-form-side">
          <div className={`login-card${shake ? " shake" : ""}`} ref={cardRef}>
            <span className="eyebrow">Masuk ke Akun</span>
            <h1>Selamat Datang Kembali</h1>
            <p className="lead">Masuk untuk melanjutkan perjalanan belajarmu di ekosistem mangrove.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className={`field${errors.email ? " has-error" : ""}`}>
                <div className="field-input-wrap">
                  <input
                    type="email"
                    placeholder=" "
                    value={form.email}
                    onChange={handleChange("email")}
                    autoComplete="email"
                  />
                  <label>Alamat Email</label>
                  <span className="field-icon"><MailIcon /></span>
                </div>
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              <div className={`field${errors.password ? " has-error" : ""}`}>
                <div className="field-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    value={form.password}
                    onChange={handleChange("password")}
                    autoComplete="current-password"
                  />
                  <label>Kata Sandi</label>
                  <span className="field-icon"><LockIcon /></span>
                  <button
                    type="button"
                    className="field-toggle"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>

              <div className="login-row">
                <label className="remember-check">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Ingat saya
                </label>
                <Link to="/lupa-password" className="forgot-link">Lupa kata sandi?</Link>
              </div>

              <button
                type="submit"
                className={`login-submit${status === "success" ? " success" : ""}`}
                disabled={status !== "idle"}
              >
                {status === "idle" && "Masuk"}
                {status === "loading" && (<><span className="spinner" /> Memproses...</>)}
                {status === "success" && (
                  <span className="check-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    ✓ Berhasil masuk
                  </span>
                )}
              </button>
            </form>

            <div className="login-divider">ATAU</div>

            <button type="button" className="btn-google" onClick={() => { /* TODO: sambungkan ke Google OAuth */ }}>
              <GoogleIcon /> Masuk dengan Google
            </button>

            <p className="signup-cta" style={{ marginTop: 14 }}>
              Belum punya akun? <Link to="/register">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}