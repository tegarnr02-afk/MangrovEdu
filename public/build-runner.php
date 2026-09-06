<?php
/**
 * build-runner.php
 * Script untuk menjalankan "npm run build" di hosting yang tidak punya akses terminal/SSH.
 *
 * CARA PAKAI:
 * 1. Upload file ini ke folder project Anda (folder yang ada file package.json-nya).
 * 2. Akses lewat browser: https://domainanda.com/build-runner.php
 * 3. Setelah build selesai dan berhasil, SEGERA HAPUS file ini dari server.
 *
 * !! PERINGATAN !!
 * File ini TIDAK punya proteksi token/password. Siapa pun yang tahu/menebak
 * URL-nya bisa menjalankan perintah shell di server Anda selama file ini masih ada.
 * Jangan biarkan file ini nangkring di server lebih lama dari yang perlu —
 * hapus lewat File Manager cPanel begitu build selesai.
 */

// ==================== KONFIGURASI ====================
$projectPath = __DIR__; // path ke folder project (yang ada package.json-nya)
$buildCommand = 'npm run build';

// Beberapa hosting butuh path lengkap ke npm/node. Kalau "npm not found",
// coba isi path lengkap, contoh:
// $npmPath = '/opt/cpanel/ea-nodejs18/bin/npm';
$npmPath = null; // null = pakai "npm" biasa dari $PATH
// =======================================================

header('Content-Type: text/html; charset=utf-8');

function h($str) {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

if (!is_dir($projectPath)) {
    die('Folder project tidak ditemukan: ' . h($projectPath));
}

// Cek fungsi shell tersedia atau tidak (banyak shared hosting mematikannya)
$shellFunctions = ['proc_open', 'shell_exec', 'exec', 'system'];
$available = array_filter($shellFunctions, 'function_exists');
if (empty($available)) {
    die('Server ini mematikan semua fungsi eksekusi shell (proc_open/shell_exec/exec/system). '
        . 'Hubungi provider hosting untuk mengaktifkannya, atau build project di lokal lalu upload hasil "dist/build" via FTP.');
}

$cmd = $npmPath ? escapeshellcmd($npmPath) . ' run build' : $buildCommand;
$fullCommand = 'cd ' . escapeshellarg($projectPath) . ' && ' . $cmd . ' 2>&1';

echo '<pre style="background:#111;color:#0f0;padding:16px;white-space:pre-wrap;font-family:monospace;">';
echo "Menjalankan: " . h($fullCommand) . "\n";
echo str_repeat('-', 60) . "\n";
flush();

$output = [];
$returnCode = 0;

if (function_exists('proc_open')) {
    $descriptorSpec = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ];
    $process = proc_open($fullCommand, $descriptorSpec, $pipes, $projectPath);
    if (is_resource($process)) {
        fclose($pipes[0]);
        while (!feof($pipes[1])) {
            $line = fgets($pipes[1]);
            if ($line !== false) {
                echo h($line);
                flush();
            }
        }
        fclose($pipes[1]);
        $errOutput = stream_get_contents($pipes[2]);
        fclose($pipes[2]);
        if ($errOutput) {
            echo h($errOutput);
        }
        $returnCode = proc_close($process);
    }
} elseif (function_exists('shell_exec')) {
    $result = shell_exec($fullCommand);
    echo h($result);
} elseif (function_exists('exec')) {
    exec($fullCommand, $output, $returnCode);
    echo h(implode("\n", $output));
} elseif (function_exists('system')) {
    system($fullCommand, $returnCode);
}

echo "\n" . str_repeat('-', 60) . "\n";
echo "Selesai dengan kode keluar: " . h((string) $returnCode) . "\n";
echo '</pre>';

if ($returnCode === 0) {
    echo '<p style="color:green;font-family:sans-serif;">✅ Build berhasil. Jangan lupa hapus file ini dari server sekarang.</p>';
} else {
    echo '<p style="color:red;font-family:sans-serif;">❌ Build gagal (exit code ' . h((string) $returnCode) . '). Lihat log di atas.</p>';
}
