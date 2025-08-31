<?php

namespace App\Imports;

use App\Models\Aset;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AsetImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Skip kalau kode_aset sudah ada
        if (Aset::where('kode_aset', $row['kode_aset'])->exists()) {
            return null;
        }

        return new Aset([
            'tipe_aset'         => $row['tipe_aset'],
            'nama'              => $row['nama'],
            'kode_aset'         => $row['kode_aset'],
            'merk'              => $row['merk'],
            'kondisi'           => $row['kondisi'],
            'tgl_pembukuan'     => $row['tgl_pembukuan'] ?? null,
            'tgl_perolehan'     => $row['tgl_perolehan'] ?? null,
            'status_penggunaan' => $row['status_penggunaan'],
            'lokasi_id'         => $row['lokasi_id'],
            'pegawai_id'        => Auth::id(), // otomatis pakai user login
        ]);
    }
}
