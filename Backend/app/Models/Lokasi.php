<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lokasi extends Model
{
    use HasFactory;

    protected $table = 'lokasi';

    protected $fillable = [
        'nama_ruangan',
        'lantai',
    ];

    // Relasi: lokasi bisa punya banyak aset
    public function aset()
    {
        return $this->hasMany(Aset::class);
    }
}

