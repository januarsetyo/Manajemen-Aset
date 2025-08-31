<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 🔑 Admin membuatkan akun pegawai
    public function registerPegawai(Request $request)
    {
        $request->validate([
            'nama'           => 'required|string',
            'nip'            => 'required|string|unique:pegawai,nip',
            'jenis_pegawai'  => 'required|in:ASN,NON-ASN',
            'password'       => 'required|string|min:6',
        ]);

        // 1. buat akun User untuk login
        $user = User::create([
            'name'  => $request->nama,
            'password' => Hash::make($request->password),
            'role' => 'pegawai',
        ]);

        // 2. buat data Pegawai
        $pegawai = Pegawai::create([
            'nama' => $request->nama,
            'nip' => $request->nip,
            'jenis_pegawai' => $request->jenis_pegawai,
        ]);

        return response()->json([
            'message' => 'Pegawai berhasil dibuat',
            'user' => $user,
            'pegawai' => $pegawai,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('name', 'password');

        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['error' => 'Nama atau password salah'], 401);
        }

        return $this->respondWithToken($token);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => config('jwt.ttl') * 60,
            'user'         => Auth::guard('api')->user(),
        ]);
    }

    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json(['message' => 'Berhasil logout']);
    }

    public function me()
    {
        return response()->json(Auth::guard('api')->user());
    }
}


