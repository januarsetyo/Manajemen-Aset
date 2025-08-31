<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('aset', function (Blueprint $table) {
    $table->id();
    $table->enum('tipe_aset', ['BMN', 'Non-BMN']);
    $table->string('nama');
    $table->string('kode_aset')->unique();
    $table->string('merk')->nullable();
    $table->enum('kondisi', ['Baik', 'Rusak Ringan', 'Rusak Berat']);
    $table->date('tgl_pembukuan')->nullable();
    $table->date('tgl_perolehan')->nullable();
    $table->date('tgl_penghapusan')->nullable();
    $table->enum('status_penggunaan', ['Digunakan', 'Tidak']);
    $table->foreignId('lokasi_id')->constrained('lokasi')->onDelete('cascade');
    $table->foreignId('pegawai_id')->constrained('pegawai')->onDelete('cascade');
    $table->softDeletes(); // supaya bisa dihapus tapi tetap dipantau
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aset');
    }
};
