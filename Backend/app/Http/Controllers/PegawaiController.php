<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Illuminate\Http\Request;

class PegawaiController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'role:admin']);
    }

    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Pegawai::all()
        ]);
    }

    public function show($id)
    {
        $pegawai = Pegawai::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $pegawai
        ]);
    }

    public function update(Request $request, $id)
    {
        $pegawai = Pegawai::findOrFail($id);

        $validated = $request->validate([
            'nama'          => 'sometimes|string',
            'nip'           => 'sometimes|string|unique:pegawai,nip,' . $pegawai->id,
            'jenis_pegawai' => 'sometimes|in:ASN,NON-ASN',
        ]);

        $pegawai->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pegawai berhasil diperbarui',
            'data' => $pegawai
        ]);
    }

    public function destroy($id)
    {
        $pegawai = Pegawai::findOrFail($id);
        $pegawai->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pegawai berhasil dihapus'
        ]);
    }
}

