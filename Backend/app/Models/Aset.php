<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aset extends Model
{
    use HasFactory;

    protected $table = 'aset';

    protected $fillable = [
        'tipe_aset',
        'nama',
        'kode_aset',
        'merk',
        'kondisi',
        'tgl_pembukuan',
        'tgl_perolehan',
        'tgl_penghapusan',
        'status_penggunaan',
        'lokasi_id',
        'pegawai_id',
    ];

    // Relasi ke Pegawai
    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class);
    }

    // Relasi ke Lokasi
    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class);
    }
}

