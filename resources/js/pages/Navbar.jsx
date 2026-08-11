import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";
import api from "../lib/api";

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Navbar({ forceSolid = false }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(forceSolid);
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    if (forceSolid) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceSolid]);

  // Sinkron status login kalau berubah dari tempat lain (tab lain, atau setelah login/logout)
  useEffect(() => {
    const onAuthChange = () => setUser(getStoredUser());
    window.addEventListener("storage", onAuthChange);
    window.addEventListener("auth-changed", onAuthChange);
    return () => {
      window.removeEventListener("storage", onAuthChange);
      window.removeEventListener("auth-changed", onAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // Token mungkin sudah kedaluwarsa di server — tetap lanjut bersihkan sesi lokal
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
  };

  const initials = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  return (
    <>
      <style>{`
        header.navbar{
          position:fixed; top:0; left:0; right:0; z-index:200;
          background:transparent;
          backdrop-filter:none;
          border-bottom:1px solid transparent;
          transition:background .35s ease, backdrop-filter .35s ease, border-color .35s ease, box-shadow .35s ease;
        }
        header.navbar.scrolled{
          background:rgba(241,244,236,0.86);
          backdrop-filter:blur(14px);
          border-bottom:1px solid rgba(15,36,29,0.08);
          box-shadow:0 6px 20px -14px rgba(15,36,29,0.3);
        }
        .nav-inner{
          max-width:1180px; margin:0 auto; padding:18px 32px;
          display:flex; align-items:center; justify-content:space-between;
          transition:padding .35s ease;
        }
        header.navbar.scrolled .nav-inner{ padding:14px 32px; }
        .logo,
        .logo:link,
        .logo:visited{
          display:flex; align-items:center; gap:10px;
          font-family:'Fraunces', serif; font-weight:700; font-size:1.3rem;
          color:var(--paper) !important;
          transition:color .35s ease;
        }
        header.navbar.scrolled .logo,
        header.navbar.scrolled .logo:link,
        header.navbar.scrolled .logo:visited{ color:var(--canopy) !important; }
        .logo-icon{ width:52px; height:52px; object-fit:contain; flex-shrink:0; }
        .nav-links{
          display:flex; align-items:center; gap:34px;
          font-weight:600; font-size:0.95rem; color:var(--paper);
          transition:color .35s ease;
        }
        header.navbar.scrolled .nav-links{ color:var(--canopy); }
        .nav-links a{ position:relative; padding:4px 0; opacity:0.92; }
        .nav-links a:hover{opacity:1;}
        .nav-links a::after{
          content:""; position:absolute; left:0; bottom:-3px; width:0; height:2px;
          background:var(--amber); transition:width .25s ease;
        }
        .nav-links a:hover::after{width:100%;}
        .nav-actions{display:flex; align-items:center; gap:10px;}
        .nav-user{
          display:flex; align-items:center; gap:10px;
          color:var(--paper); transition:color .35s ease;
        }
        header.navbar.scrolled .nav-user{ color:var(--canopy); }
        .nav-user-avatar{
          width:34px; height:34px; border-radius:50%; flex-shrink:0;
          background:var(--amber); color:var(--canopy);
          display:flex; align-items:center; justify-content:center;
          font-weight:700; font-size:0.85rem;
        }
        .nav-user-name{
          font-weight:600; font-size:0.9rem; max-width:130px;
          overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
        }
        .nav-logout{
          color:var(--paper); padding:9px 16px; border-radius:999px;
          font-weight:600; font-size:0.88rem; opacity:0.9;
          border:1.5px solid rgba(251,250,245,0.35); background:none;
          cursor:pointer; font-family:inherit;
          transition:opacity .25s ease, background .25s ease, border-color .25s ease;
        }
        .nav-logout:hover{ opacity:1; background:rgba(251,250,245,0.12); }
        header.navbar.scrolled .nav-logout{ color:var(--canopy); border-color:rgba(15,36,29,0.2); }
        header.navbar.scrolled .nav-logout:hover{ background:rgba(15,36,29,0.08); }
        .nav-login{
          color:var(--paper); padding:10px 16px; border-radius:999px;
          font-weight:600; font-size:0.9rem; opacity:0.9;
          transition:opacity .25s ease, background .25s ease;
        }
        .nav-login:hover{ opacity:1; background:rgba(251,250,245,0.12); }
        header.navbar.scrolled .nav-login{ color:var(--canopy); }
        header.navbar.scrolled .nav-login:hover{ background:rgba(15,36,29,0.08); }
        .nav-cta{
          color:var(--paper); padding:10px 16px; border-radius:999px;
          font-weight:600; font-size:0.9rem; opacity:0.9;
          transition:opacity .25s ease, background .25s ease;
        }
        .nav-cta:hover{ opacity:1; background:rgba(251,250,245,0.12); }
        header.navbar.scrolled .nav-cta{ color:var(--canopy); }
        header.navbar.scrolled .nav-cta:hover{ background:rgba(15,36,29,0.08); }
        .nav-mobile-auth{ display:none; }
        .burger{display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none;}
        .burger span{width:24px; height:2px; background:var(--paper); transition:background .35s ease;}
        header.navbar.scrolled .burger span{ background:var(--canopy); }

        @media (max-width:980px){
          .nav-links{ display:none; }
          .nav-links.nav-links-open{
            display:flex; position:absolute; top:100%; left:0; right:0; background:#F1F4EC;
            flex-direction:column; padding:24px 32px; gap:20px; border-bottom:1px solid rgba(15,36,29,0.08);
            color:var(--canopy);
          }
          .burger{ display:flex; }
          .nav-inner{ padding:14px 20px; }
          header.navbar.scrolled .nav-inner{ padding:12px 20px; }
          .logo{ font-size:1.1rem; }
          .logo-icon{ width:40px; height:40px; }
          .nav-actions{ gap:6px; }
          .nav-actions > .nav-login,
          .nav-actions > .nav-cta,
          .nav-actions > .nav-user{ display:none; }
          .nav-mobile-auth{
            display:flex; flex-direction:column; gap:10px; width:100%;
            margin-top:6px; padding-top:20px; border-top:1px solid rgba(15,36,29,0.1);
          }
          .nav-mobile-auth a,
          .nav-mobile-auth button{
            text-align:center; padding:12px 16px; border-radius:999px;
            font-weight:600; font-size:0.92rem; border:none; cursor:pointer;
            font-family:inherit; width:100%;
          }
          .nav-mobile-login{ border:1.5px solid rgba(15,36,29,0.15) !important; color:var(--canopy); background:none; }
          .nav-mobile-register{ background:var(--canopy); color:var(--paper); }
          .nav-mobile-user{
            display:flex; align-items:center; gap:10px;
            padding:4px 4px 8px; font-weight:600; color:var(--canopy);
          }
        }
      `}</style>

      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <Link to="/" className="logo">
            <img src={logo} alt="MangrovEdu" className="logo-icon" />
            MangrovEdu
          </Link>
          <nav className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Beranda</Link>
            <Link to="/materi" onClick={() => setMenuOpen(false)}>Materi</Link>
            <Link to="/lab" onClick={() => setMenuOpen(false)}>Lab Virtual</Link>
            <Link to="/simulasi" onClick={() => setMenuOpen(false)}>Simulasi</Link>
            <Link to="/kuis" onClick={() => setMenuOpen(false)}>Kuis</Link>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dasbor</Link>
            <div className="nav-mobile-auth">
              {user ? (
                <>
                  <div className="nav-mobile-user">
                    <span className="nav-user-avatar">{initials}</span>
                    {user.name}
                  </div>
                  <button className="nav-mobile-register" onClick={handleLogout}>Keluar</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-mobile-login" onClick={() => setMenuOpen(false)}>Masuk</Link>
                  <Link to="/register" className="nav-mobile-register" onClick={() => setMenuOpen(false)}>Daftar</Link>
                </>
              )}
            </div>
          </nav>
          <div className="nav-actions">
            {user ? (
              <div className="nav-user">
                <span className="nav-user-avatar">{initials}</span>
                <span className="nav-user-name">{user.name}</span>
                <button className="nav-logout" onClick={handleLogout}>Keluar</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-login">Masuk</Link>
                <Link to="/register" className="nav-cta">Daftar</Link>
              </>
            )}
            <button
              className="burger"
              aria-label="Menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}