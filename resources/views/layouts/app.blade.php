<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>MangrovEdu</title>

    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

    @vite(['resources/css/app.css','resources/js/app.js'])
</head>

<body class="bg-[#F2E8D5] text-slate-800">

<nav class="fixed top-0 left-0 right-0 z-50 bg-[#1B4B43] shadow">

    <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <a href="/" class="text-2xl font-bold text-white">
            🌿 MangrovEdu
        </a>

        <div class="space-x-6 text-white">

            <a href="/">Beranda</a>

            <a href="/materi">Materi</a>

            <a href="/lab">Lab Virtual</a>

            <a href="/kuis">Kuis</a>

            <a href="/dashboard">Dashboard</a>

        </div>

    </div>

</nav>

<div class="pt-20">

    @yield('content')

</div>

<footer class="bg-[#1B4B43] text-white py-6 mt-20">

    <div class="text-center">

        MangrovEdu © {{ date('Y') }}

    </div>

</footer>

</body>
</html>