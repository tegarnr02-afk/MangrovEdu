<?php

// app/Http/Controllers/Api/AuthController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed', // butuh field password_confirmation
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('mangrovedu')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau kata sandi salah.'],
            ]);
        }

        $token = $user->createToken('mangrovedu')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function loginWithGoogle(Request $request)
    {
        $data = $request->validate([
            'id_token' => 'required|string',
        ]);

        // Verifikasi id_token langsung ke Google (endpoint tokeninfo) tanpa package tambahan.
        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $data['id_token'],
        ]);

        if (! $response->ok()) {
            throw ValidationException::withMessages([
                'email' => ['Token Google tidak valid.'],
            ]);
        }

        $payload = $response->json();

        // Pastikan token diterbitkan untuk client_id aplikasi kita (cek claim 'aud').
        if (($payload['aud'] ?? null) !== config('services.google.client_id')) {
            throw ValidationException::withMessages([
                'email' => ['Token Google tidak valid.'],
            ]);
        }

        // Email harus ada dan sudah terverifikasi.
        $emailVerified = filter_var($payload['email_verified'] ?? false, FILTER_VALIDATE_BOOLEAN);
        if (empty($payload['email']) || ! $emailVerified) {
            throw ValidationException::withMessages([
                'email' => ['Email Google belum terverifikasi.'],
            ]);
        }

        $user = User::where('email', $payload['email'])->first();

        if (! $user) {
            $user = User::create([
                'name'      => $payload['name'] ?? $payload['email'],
                'email'     => $payload['email'],
                'password'  => Hash::make(Str::random(32)), // akun Google tidak pakai password manual
                'google_id' => $payload['sub'] ?? null,
            ]);
        } elseif (empty($user->google_id)) {
            $user->update(['google_id' => $payload['sub'] ?? null]);
        }

        $token = $user->createToken('mangrovedu')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Berhasil keluar.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}