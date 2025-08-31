<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Aset;
use App\Models\Lokasi;
use App\Models\Pegawai;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel; 
use App\Imports\AsetImport;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


class AsetController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

        public function index()
    {
        $aset = Aset::whereNull('tgl_penghapusan')
            ->with(['pegawai', 'lokasi'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $aset
        ]);
    }

        public function show($id)
    {
        $aset = Aset::whereNull('tgl_penghapusan')
            ->with(['pegawai', 'lokasi'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $aset
        ]);
    }

public function store(Request $request)
{
    $validated = $request->validate([
        'tipe_aset'         => 'required|in:BMN,Non-BMN',
        'nama'              => 'required|string',
        'kode_aset'         => 'required|string|unique:aset',
        'merk'              => 'nullable|string',
        'kondisi'           => 'required|in:Baik,Rusak Ringan,Rusak Berat',
        'tgl_pembukuan'     => 'nullable|date',
        'tgl_perolehan'     => 'nullable|date',
        'status_penggunaan' => 'required|in:Digunakan,Tidak',
        'lokasi_id'         => 'required|exists:lokasi,id',
    ]);

    // Ambil pegawai dari nama user yang login
    $namaUser = auth('api')->user()->name;
    $pegawai = Pegawai::where('nama', $namaUser)->first();

    if (!$pegawai) {
        return response()->json([
            'success' => false,
            'message' => "Pegawai dengan nama '$namaUser' tidak ditemukan di database!"
        ], 404);
    }

    // Tambahkan pegawai_id ke data validasi
    $validated['pegawai_id'] = $pegawai->id;

    $aset = Aset::create($validated);

    return response()->json([
        'success' => true,
        'message' => 'Aset berhasil ditambahkan',
        'data'    => $aset
    ], 201);
}

    public function bulkUpload(Request $request)
{
    $request->validate([
        'file' => 'required|mimes:xlsx,xls'
    ]);

    $file = $request->file('file');
    $spreadsheet = IOFactory::load($file->getPathname());
    $worksheet = $spreadsheet->getActiveSheet();
    $rows = $worksheet->toArray(null, true, true, true);

    DB::beginTransaction();

    try {

        // Ambil nama user yang login
        $namaUser = auth('api')->user()->name;

        // Cari pegawai berdasarkan nama user
        $pegawai = Pegawai::where('nama', $namaUser)->first();
        if (!$pegawai) {
            throw new \Exception("Pegawai dengan nama '$namaUser' tidak ditemukan di database!");
        }
        foreach ($rows as $index => $row) {
            // Lewati header (baris pertama)
            if ($index === 1) continue;

            $tipeAset   = $row['A'];
            $nama       = $row['B'];
            $kodeAset   = $row['C'];
            $merk       = $row['D'];
            $kondisi    = $row['E'];
            $tglPembukuan = $row['F'];
            $tglPerolehan = $row['G'];
            $statusPenggunaan = $row['H'];
            $lokasiNama = $row['I']; // isi dari excel = nama lokasi
            $lokasi = Lokasi::where('nama_ruangan', $lokasiNama)->first();

            if (!$lokasi) {
                throw new \Exception("Lokasi '$lokasiNama' tidak ditemukan di database!");
            }


            // ✅ Konversi tanggal Excel ke Y-m-d
            if (is_numeric($tglPembukuan)) {
                $tglPembukuan = Carbon::instance(
                    ExcelDate::excelToDateTimeObject($tglPembukuan)
                )->format('Y-m-d');
            } elseif (!empty($tglPembukuan)) {
                $tglPembukuan = Carbon::parse($tglPembukuan)->format('Y-m-d');
            } else {
                $tglPembukuan = null;
            }

            if (is_numeric($tglPerolehan)) {
                $tglPerolehan = Carbon::instance(
                    ExcelDate::excelToDateTimeObject($tglPerolehan)
                )->format('Y-m-d');
            } elseif (!empty($tglPerolehan)) {
                $tglPerolehan = Carbon::parse($tglPerolehan)->format('Y-m-d');
            } else {
                $tglPerolehan = null;
            }

            Aset::create([
                'tipe_aset'        => $tipeAset,
                'nama'             => $nama,
                'kode_aset'        => $kodeAset,
                'merk'             => $merk,
                'kondisi'          => $kondisi,
                'tgl_pembukuan'    => $tglPembukuan,
                'tgl_perolehan'    => $tglPerolehan,
                'status_penggunaan'=> $statusPenggunaan,
                'lokasi_id'        => $lokasi->id,
                'pegawai_id'       => $pegawai->id,

            ]);
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Upload aset berhasil!'
        ]);
    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'success' => false,
            'message' => 'Error pada baris ke-' . ($index ?? '?') . ': ' . $e->getMessage()
        ], 500);
    }
}



    public function update(Request $request, $id)
    {
        $aset = Aset::findOrFail($id);

        $validated = $request->validate([
            'kondisi'           => 'sometimes|in:Baik,Rusak Ringan,Rusak Berat',
            'status_penggunaan' => 'sometimes|in:Digunakan,Tidak',
            'lokasi_id'         => 'sometimes|exists:lokasi,id',
            'pegawai_id'        => 'sometimes|exists:pegawai,id',
        ]);

        $aset->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Aset berhasil diperbarui',
            'data'    => $aset
        ]);
    }

    public function destroy($id)
    {
        $aset = Aset::findOrFail($id);
        $aset->tgl_penghapusan = now()->toDateString();
        $aset->save();

        return response()->json([
            'success' => true,
            'message' => 'Aset berhasil dihapus'
        ]);
    }

    public function riwayat()
    {
        $aset = Aset::whereNotNull('tgl_penghapusan')
            ->with(['pegawai', 'lokasi'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $aset
        ]);
    }
}

