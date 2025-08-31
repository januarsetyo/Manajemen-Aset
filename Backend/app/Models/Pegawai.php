<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
    use HasFactory;

    protected $table = 'pegawai';

    protected $fillable = [
        'nama',
        'nip',
        'jenis_pegawai',
    ];

    // Relasi: pegawai bisa punya banyak aset
    public function aset()
    {
        return $this->hasMany(Aset::class);
    }
}

