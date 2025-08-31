import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
  useReactTable,
} from "@tanstack/react-table";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AsetType {
  id: number;
  nama: string;
  kode_aset: string;
  merk: string;
  kondisi: string;
  status_penggunaan: string;
  tgl_pembukuan?: string;
  tgl_perolehan?: string;
  lokasi?: { id: number; nama_ruangan: string; lantai: string };
  pegawai?: { id: number; nama: string };
}

export default function AsetTable() {
  const [aset, setAset] = useState<any[]>([]);
  const [lokasiList, setLokasiList] = useState<any[]>([]);
  const [pegawaiList] = useState<any[]>([]);
  const [selectedAset, setSelectedAset] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  const { isOpen: isOpenAdd, openModal: openModalAdd, closeModal: closeModalAdd } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
  const { isOpen: isOpenReport, openModal: openModalReport, closeModal: closeModalReport } = useModal();
  
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [reportData, setReportData] = useState<any>(null);

  const token = localStorage.getItem("token");
  const [sorting, setSorting] = useState<SortingState>([]);

  // === Fetch Aset ===
  const fetchAset = () => {
    fetch("http://127.0.0.1:8000/api/aset", 
      { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(res => { if (res.success) setAset(res.data); })
      .catch(console.error);
  };

  // === Fetch Lokasi & Pegawai ===
  const fetchLokasiPegawai = () => {
    fetch("http://127.0.0.1:8000/api/lokasi", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(res => { if (res.success) setLokasiList(res.data); })
      .catch(console.error);

  };

  useEffect(() => { 
    fetchAset(); 
    fetchLokasiPegawai(); 
  }, []);

  // === Delete Aset ===
  const handleDelete = (id: number) => {
    if (!confirm("Apakah yakin ingin menghapus aset ini?")) return;
    fetch(`http://127.0.0.1:8000/api/aset/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => { if (res.success) { alert(res.message); fetchAset(); } })
      .catch(console.error);
  };

  // === Edit Aset ===
  const handleEditOpen = (item: any) => {
    setSelectedAset(item);
    setFormData({...item});
    openModalEdit();
  };

  const handleEditSave = () => {
    if (!selectedAset) return;
    fetch(`http://127.0.0.1:8000/api/aset/${selectedAset.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(res => { if (res.success) { alert(res.message); fetchAset(); closeModalEdit(); } })
      .catch(console.error);
  };

  // === Tambah Aset ===
  const handleAddOpen = () => {
    setFormData({
      nama: "",
      kode_aset: "",
      merk: "",
      tipe_aset: "BMN",
      kondisi: "Baik",
      status_penggunaan: "Digunakan",
      lokasi_id: lokasiList[0]?.id || 1,
      pegawai_id: pegawaiList[0]?.id || 1
    });
    openModalAdd();
  };

const formatDate = (date: Date | null) => {
  if (!date) return null;
  return date.toISOString().split("T")[0]; // yyyy-MM-dd
};

const handleAddSave = () => {
  const payload = {
    ...formData,
    tgl_pembukuan: formatDate(formData.tgl_pembukuan),
    tgl_perolehan: formatDate(formData.tgl_perolehan),
  };

  fetch("http://127.0.0.1:8000/api/aset", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw data;
      if (data.success) {
        alert(data.message);
        fetchAset();
        closeModalAdd();
      }
    })
    .catch(err => {
      console.error("Validation error:", err);
      alert("Gagal simpan aset: " + JSON.stringify(err.errors || err));
    });
};

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  fetch("http://127.0.0.1:8000/api/aset/bulk-upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        alert(res.message);
        fetchAset();
      } else {
        alert("Gagal upload: " + JSON.stringify(res.errors || res.message));
      }
    })
    .catch(console.error);
};



  // === Laporan ===
  const fetchReport = (tanggal: string) => {
    fetch(`http://127.0.0.1:8000/api/laporan?format=json&tanggal=${tanggal}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => setReportData(res))
      .catch(console.error);
  };

  const handleOpenReport = () => {
    fetchReport(reportDate);
    openModalReport();
  };

  const handlePrintPDF = () => {
    const url = `http://127.0.0.1:8000/api/laporan?tanggal=${reportDate}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const fileURL = URL.createObjectURL(blob);
        const newWindow = window.open(fileURL); 
        if (!newWindow) {
          const link = document.createElement("a");
          link.href = fileURL;
          link.download = `laporan_aset_${reportDate}.pdf`;
          link.click();
        }
      })
      .catch(console.error);
  };

    // Columns TanStack
  const columns: ColumnDef<AsetType>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nama", header: "Nama Aset" },
    { accessorKey: "kode_aset", header: "Kode Aset" },
    { accessorKey: "merk", header: "Merk" },
    { accessorKey: "kondisi", header: "Kondisi" },
    { accessorKey: "status_penggunaan", header: "Status" },
    { accessorKey: "tgl_pembukuan", header: "Tanggal Pembukuan" },
    { accessorKey: "tgl_perolehan", header: "Tanggal Perolehan" },
    { accessorKey: "lokasi.nama_ruangan", header: "Nama Ruangan" },
    { accessorKey: "lokasi.lantai", header: "Lantai" },
    { accessorKey: "pegawai.nama", header: "Pemegang Aset" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Button size="sm" variant="primary" onClick={() => handleEditOpen(row.original)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

    // React Table Instance
  const table = useReactTable({
    data: aset,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
  <div>
      {/* Button Tambah + Generate Laporan */}
  <div className="flex items-center gap-2 mb-2">
  <Button variant="primary" onClick={handleAddOpen}>
    Tambah Data
  </Button>

  <Button variant="primary" onClick={handleOpenReport}>
    Generate Laporan
  </Button>

  {/* Tombol untuk Input Laporan */}
  <input
    type="file"
    accept=".csv,.xlsx"
    onChange={handleFileUpload}
    className="hidden"
    id="fileInput"
  />
  <Button
    variant="primary"
    onClick={() => document.getElementById('fileInput').click()}
  >
    Input Laporan
  </Button>
</div>


      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      isHeader
                      className="text-center align-middle cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[10, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modal Tambah */}
      <Modal isOpen={isOpenAdd} onClose={closeModalAdd} className="max-w-[700px] m-4">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
          <h4 className="text-lg font-semibold mb-4">Tambah Aset</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nama Aset</Label>
              <Input type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
            </div>
            <div>
              <Label>Kode Aset</Label>
              <Input type="text" value={formData.kode_aset} onChange={e => setFormData({...formData, kode_aset: e.target.value})} />
            </div>
            <div>
              <Label>Merk</Label>
              <Input type="text" value={formData.merk} onChange={e => setFormData({...formData, merk: e.target.value})} />
            </div>
            <div>
              <Label>Tipe Aset</Label>
              <select className="w-full border rounded px-2 py-1" value={formData.tipe_aset} onChange={e => setFormData({...formData, tipe_aset: e.target.value})}>
                <option>BMN</option>
                <option>Non-BMN</option>
              </select>
            </div>
            <div>
              <Label>Kondisi</Label>
              <select className="w-full border rounded px-2 py-1" value={formData.kondisi} onChange={e => setFormData({...formData, kondisi: e.target.value})}>
                <option>Baik</option>
                <option>Rusak Ringan</option>
                <option>Rusak Berat</option>
              </select>
            </div>
            <div>
              <Label>Status Penggunaan</Label>
              <select className="w-full border rounded px-2 py-1" value={formData.status_penggunaan} onChange={e => setFormData({...formData, status_penggunaan: e.target.value})}>
                <option>Digunakan</option>
                <option>Tidak</option>
              </select>
            </div>
            <div>
              <Label>Tanggal Pembukuan</Label>
              <DatePicker
                selected={formData.tgl_pembukuan}
                onChange={(date: Date | null) =>
                  setFormData({ ...formData, tgl_pembukuan: date })
                }
                dateFormat="yyyy-MM-dd"
                className="w-full h-10 border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                placeholderText="Pilih tanggal"
              />
              <Label>Tanggal Perolehan</Label>
              <DatePicker
                selected={formData.tgl_perolehan}
                onChange={(date: Date | null) =>
                  setFormData({ ...formData, tgl_perolehan: date })
                }
                dateFormat="yyyy-MM-dd"
                className="w-full h-10 border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                placeholderText="Pilih tanggal"
              />
            </div>
            <div>
              <Label>Lokasi</Label>
              <select className="w-full border rounded px-2 py-1" value={formData.lokasi_id} onChange={e => setFormData({...formData, lokasi_id: Number(e.target.value)})}>
                {lokasiList.map(l => <option key={l.id} value={l.id}>{l.nama_ruangan}</option>)}
              </select>
            </div>
            <div>
          <input type="hidden" value={formData.pegawai_id} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="primary" onClick={closeModalAdd}>Batal</Button>
            <Button variant="primary" onClick={handleAddSave}>Simpan</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Edit */}
      <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="max-w-[700px] m-4">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
          <h4 className="text-lg font-semibold mb-4">Edit Aset</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nama Aset</Label>
              <Input type="text" value={formData.nama} disabled />
            </div>
            <div>
              <Label>Kode Aset</Label>
              <Input type="text" value={formData.kode_aset} disabled />
            </div>
            <div>
              <Label>Merk</Label>
              <Input type="text" value={formData.merk} disabled />
            </div>
            <div>
              <Label>Tipe Aset</Label>
            <select className="w-full border rounded px-2 py-1" value={formData.tipe_aset} disabled>
                    <option>BMN</option>
                    <option>Non-BMN</option>
                    </select>
            </div>
            <div>
              <Label>Kondisi</Label>
            <select
            className="w-full border rounded px-2 py-1"
            value={formData.kondisi}
            onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
            >
            <option>Baik</option>
            <option>Rusak Ringan</option>
            <option>Rusak Berat</option>
            </select>
            </div>
            <div>
              <Label>Status Penggunaan</Label>
        <select
          className="w-full border rounded px-2 py-1"
          value={formData.status_penggunaan}
          onChange={(e) => setFormData({ ...formData, status_penggunaan: e.target.value })}
        >
          <option>Digunakan</option>
          <option>Tidak</option>
        </select>
            </div>
            <div>
              <Label>Lokasi</Label>
        <select
          className="w-full border rounded px-2 py-1"
          value={formData.lokasi_id}
          onChange={(e) => setFormData({ ...formData, lokasi_id: Number(e.target.value) })}
        >
          {lokasiList.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nama_ruangan}
            </option>
          ))}
        </select>
            </div>
            <div>
      <input type="hidden" value={formData.pegawai_id} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="primary" onClick={closeModalEdit}>Batal</Button>
            <Button variant="primary" onClick={handleEditSave}>Simpan</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Generate Laporan */}
      <Modal isOpen={isOpenReport} onClose={closeModalReport} className="max-w-3xl m-4">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
        <h4 className="text-lg font-semibold mb-4">Laporan Aset</h4>
        <div className="flex gap-2 mb-4 items-center">
          <Label>Tanggal Cut-Off:</Label>
          <DatePicker
            selected={reportDate}
            onChange={(date: Date | null) => setReportDate(date)}
            dateFormat="dd-MM-yyyy"
            className="border rounded-lg px-2 py-1 dark:bg-gray-800 dark:text-white"
            placeholderText="Pilih tanggal"
          />
          <Button variant="primary" onClick={handlePrintPDF}>
            Cetak PDF
          </Button>
        </div>
      </div>
      </Modal>
    </div>
  );
}
