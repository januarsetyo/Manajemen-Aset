<h2>Laporan Aset</h2>
<p>Tanggal: {{ $cutOff }}</p>

<h3>Rekap Tipe Aset</h3>
<table border="1">
  <tr><th>Tipe</th><th>Total</th></tr>
  @foreach($rekap_tipe as $r)
    <tr><td>{{ $r->tipe_aset }}</td><td>{{ $r->total }}</td></tr>
  @endforeach
</table>

<h3>Rekap Kondisi Aset (Digunakan)</h3>
<table border="1">
  <tr><th>Kondisi</th><th>Total</th></tr>
  @foreach($rekap_kondisi as $r)
    <tr><td>{{ $r->kondisi }}</td><td>{{ $r->total }}</td></tr>
  @endforeach
</table>

<h3>Rekap Perolehan Aset per Tahun</h3>
<table border="1">
  <tr><th>Tahun</th><th>Total</th></tr>
  @foreach($rekap_tahun as $r)
    <tr><td>{{ $r->tahun }}</td><td>{{ $r->total }}</td></tr>
  @endforeach
</table>
