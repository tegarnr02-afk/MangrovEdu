<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MangrovEdu</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite('resources/js/app.jsx')
</head>
<body>
    <div id="app"></div>

    <!-- ================= Google Identity Services (Login dengan Google) =================
         Script vanilla ini bisa diedit langsung di server (file Blade, bukan bagian bundle JS). -->

    <script src="https://accounts.google.com/gsi/client" async defer></script>

    <div id="hidden-google-btn" style="position:fixed; top:-9999px; left:-9999px;"></div>

    <script>
      // ===== KONFIGURASI (ganti sesuai environment) =====
      var GOOGLE_CLIENT_ID = "956983433485-phf4d9tcnpf800fcf4lu9q5ubir2k2ue.apps.googleusercontent.com";
var API_BASE_URL = "http://127.0.0.1:8000/api";

      function handleGoogleResponse(response) {
        var idToken = response && response.credential;
        if (!idToken) {
          alert("Login Google gagal. Silakan coba lagi.");
          return;
        }

        fetch(API_BASE_URL + "/login/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        })
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
          })
          .then(function (data) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.dispatchEvent(new Event("auth-changed"));
            window.location.href = "/";
          })
          .catch(function () {
            alert("Login Google gagal. Silakan coba lagi.");
          });
      }

      function initGoogle() {
        // Polling kecil: tunggu sampai variabel global `google` tersedia,
        // karena script GSI dari CDN kadang belum selesai load saat DOMContentLoaded.
        if (!(window.google && window.google.accounts && window.google.accounts.id)) {
          setTimeout(initGoogle, 200);
          return;
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("hidden-google-btn"),
          {
            type: "standard",
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "signin_with",
          }
        );
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initGoogle);
      } else {
        initGoogle();
      }

      // Deteksi klik pada <button> yang teksnya mengandung "Google",
      // lalu trigger klik ke tombol Google asli yang tersembunyi.
      document.addEventListener("click", function (e) {
        var btn = null;
        var el = e.target;
        while (el && el !== document) {
          if (el.tagName === "BUTTON" && (el.textContent || "").indexOf("Google") !== -1) {
            btn = el;
            break;
          }
          el = el.parentNode;
        }
        if (!btn) return;

        if (window.google && window.google.accounts && window.google.accounts.id) {
          var hiddenBtn = document.querySelector('#hidden-google-btn div[role="button"]');
          if (hiddenBtn) {
            hiddenBtn.click();
          } else {
            // Tombol asli GIS dirender di dalam <iframe> lintas-origin, jadi
            // .click() programatik tidak bisa menembusnya. prompt() membuka
            // alur sign-in Google yang sama dan lebih andal.
            window.google.accounts.id.prompt();
          }
        }
      });
    </script>
</body>
</html>