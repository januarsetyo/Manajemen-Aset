<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Aset;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\PDF;

class LaporanController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api'); // hanya user login
        $this->middleware('role:pegawai'); // asumsi hanya admin/pimpinan bisa akses laporan
    }

    public function generate(Request $request)
    {
        $cutOff = $request->input('tanggal', now());

        // 1. Rekap aset berdasarkan tipe (yang masih aktif)
        $rekapTipe = Aset::select('tipe_aset', DB::raw('count(*) as total'))
            ->whereNull('tgl_penghapusan')
            ->whereDate('created_at', '<=', $cutOff)
            ->groupBy('tipe_aset')
            ->get();

        // 2. Rekap kondisi yg masih digunakan (dan aktif)
        $rekapKondisi = Aset::select('kondisi', DB::raw('count(*) as total'))
            ->where('status_penggunaan', 'Digunakan')
            ->whereNull('tgl_penghapusan')
            ->whereDate('created_at', '<=', $cutOff)
            ->groupBy('kondisi')
            ->get();

        // 3. Rekap perolehan aset per tahun (yang aktif)
        $rekapTahun = Aset::select(DB::raw('YEAR(tgl_perolehan) as tahun'), DB::raw('count(*) as total'))
            ->whereNotNull('tgl_perolehan')
            ->whereNull('tgl_penghapusan')
            ->whereDate('tgl_perolehan', '<=', $cutOff)
            ->groupBy('tahun')
            ->orderBy('tahun')
            ->get();

        // Hasil JSON (untuk frontend chart)
        if ($request->input('format') === 'json') {
            return response()->json([
                'cutOff' => $cutOff,
                'rekap_tipe' => $rekapTipe,
                'rekap_kondisi' => $rekapKondisi,
                'rekap_tahun' => $rekapTahun,
            ]);
        }

        // Hasil PDF (untuk laporan resmi)
        $pdf = PDF::loadView('laporan.aset', [
            'cutOff' => $cutOff,
            'rekap_tipe' => $rekapTipe,
            'rekap_kondisi' => $rekapKondisi,
            'rekap_tahun' => $rekapTahun,
        ]);

        return $pdf->stream('laporan_aset_'.$cutOff.'.pdf');
    }
}

