<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

echo '<pre>';
echo "environmentPath(): " . $app->environmentPath() . "\n";
echo "environmentFile(): " . $app->environmentFile() . "\n";
echo "Full path dipakai Laravel: " . $app->environmentFilePath() . "\n";
echo "File itu ada?: " . (file_exists($app->environmentFilePath()) ? 'YA' : 'TIDAK') . "\n\n";

echo "APP_ENV via env() SEKARANG: " . var_export(env('APP_ENV'), true) . "\n";
echo "getenv('APP_ENV') SEKARANG: " . var_export(getenv('APP_ENV'), true) . "\n";

// Coba bootstrap manual LoadEnvironmentVariables
try {
    $bootstrapper = new \Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables();
    $bootstrapper->bootstrap($app);
    echo "\nSetelah bootstrap manual LoadEnvironmentVariables:\n";
    echo "APP_ENV via env(): " . var_export(env('APP_ENV'), true) . "\n";
} catch (\Throwable $e) {
    echo "\nError saat bootstrap manual: " . $e->getMessage() . "\n";
}
echo '</pre>';