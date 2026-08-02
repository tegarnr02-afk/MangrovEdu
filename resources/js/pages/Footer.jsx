import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";

export default function Footer() {
  return (
    <>
      <style>{`
        footer{ background:var(--canopy); color:rgba(251,250,245,0.75); padding:70px 0 30px; }
        .footer-grid{ display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:40px; margin-bottom:50px; }
        .footer-logo{ display:flex; align-items:center; gap:10px; font-family:'Fraunces', serif; font-weight:700; font-size:1.25rem; color:var(--paper); margin-bottom:16px; }
        .footer-logo-icon{ width:30px; height:30px; object-fit:contain; flex-shrink:0; }
        .footer-grid p{ font-size:0.9rem; max-width:280px; }
        .footer-col h5{ color:var(--paper); font-family:'Space Mono', monospace; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:18px; }
        .footer-col li{ margin-bottom:11px; font-size:0.92rem; }
        .footer-col a:hover{ color:var(--amber); }
        .footer-social{ display:flex; gap:12px; margin-top:16px; }
        .footer-social a{
          width:36px; height:36px; border-radius:50%; border:1px solid rgba(251,250,245,0.25);
          display:flex; align-items:center; justify-content:center; transition:background .25s ease, border-color .25s ease;
        }
        .footer-social a:hover{ background:var(--amber); border-color:var(--amber); }
        .footer-bottom{
          border-top:1px solid rgba(251,250,245,0.12); padding-top:26px;
          display:flex; justify-content:space-between; font-size:0.82rem; color:rgba(251,250,245,0.5);
          flex-wrap:wrap; gap:10px;
        }

        /* Fallback .container — memastikan footer tetap rapi walau halaman
           induknya (mis. Login/Register) belum mendefinisikan .container sendiri */
        footer .container{ max-width:1180px; margin:0 auto; padding:0 32px; }

        @media (max-width:980px){
          .footer-grid{ grid-template-columns:1fr 1fr; }
        }
        @media (max-width:600px){
          .footer-grid{ grid-template-columns:1fr; }
        }
      `}</style>

      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <img src={logo} alt="MangrovEdu" className="footer-logo-icon" />
                MangrovEdu
              </div>
              <p>Platform belajar ekosistem mangrove secara interaktif untuk siswa SMP — materi, simulasi, dan kuis dalam satu tempat.</p>
              <div className="footer-social">
                <a href="#" aria-label="Instagram">IG</a>
                <a href="#" aria-label="YouTube">YT</a>
                <a href="#" aria-label="TikTok">TT</a>
              </div>
            </div>
            <div className="footer-col">
              <h5>Menu</h5>
              <ul>
                <li><Link to="/">Beranda</Link></li>
                <li><Link to="/materi">Materi</Link></li>
                <li><Link to="/lab">Lab Virtual</Link></li>
                <li><Link to="/simulasi">Simulasi</Link></li>
                <li><Link to="/kuis">Kuis</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Kontak</h5>
              <ul>
                <li>halo@mangrovedu.id</li>
                <li>+62 812-3456-7890</li>
                <li>Surabaya, Indonesia</li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Lainnya</h5>
              <ul>
                <li><Link to="/#tentang">Tentang Kami</Link></li>
                <li><Link to="/#faq">FAQ</Link></li>
                <li><Link to="/kebijakan-privasi">Kebijakan Privasi</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 MangrovEdu. Seluruh hak cipta dilindungi.</span>
            <span>Dibuat untuk mendukung pembelajaran IPA siswa SMP.</span>
          </div>
        </div>
      </footer>
    </>
  );
}