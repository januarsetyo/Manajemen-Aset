<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lokasi;

class LokasiController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Lokasi::all()
        ]);
    }

        public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_ruangan' => 'required|string',
            'lantai'       => 'required|integer|min:1|max:14'
        ]);

        $lokasi = Lokasi::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil ditambahkan',
            'data' => $lokasi
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $lokasi = Lokasi::findOrFail($id);

        $validated = $request->validate([
            'nama_ruangan' => 'sometimes|string',
            'lantai'       => 'sometimes|integer|min:1|max:14'
        ]);

        $lokasi->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil diupdate',
            'data' => $lokasi
        ]);
    }

    public function destroy($id)
    {
        $lokasi = Lokasi::findOrFail($id);
        $lokasi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil dihapus'
        ]);
    }
}