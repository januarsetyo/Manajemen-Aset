import { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";

interface PegawaiType {
  id: number;
  nama: string;
  nip: string;
  jenis_pegawai: "ASN" | "NON-ASN";
}

export default function PegawaiTable() {
  const [pegawai, setPegawai] = useState<PegawaiType[]>([]);
  const [selectedPegawai, setSelectedPegawai] = useState<PegawaiType | null>(null);
  const [formData, setFormData] = useState<{
    nama: string;
    nip: string;
    jenis_pegawai: "ASN" | "NON-ASN";
    password: string;
  }>({
    nama: "",
    nip: "",
    jenis_pegawai: "ASN",
    password: "",
  });

  const { isOpen: isOpenAdd, openModal: openModalAdd, closeModal: closeModalAdd } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

  const [sorting, setSorting] = useState<SortingState>([]);

  // Fetch Pegawai dari backend
  const fetchPegawai = () => {
    fetch("http://127.0.0.1:8000/api/pegawai", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setPegawai(res.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // Handle Tambah Data
  const handleAddOpen = () => {
    setFormData({ nama: "", nip: "", jenis_pegawai: "ASN", password: "" });
    openModalAdd();
  };

  const handleAddSave = () => {
    fetch("http://127.0.0.1:8000/api/register-pegawai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || "Gagal tambah pegawai");
        return data;
      })
      .then((res) => {
        alert(res.message);
        fetchPegawai();
        closeModalAdd();
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  };

  // Handle Edit Data
  const handleEditOpen = (item: PegawaiType) => {
    setSelectedPegawai(item);
    setFormData({ nama: item.nama, nip: item.nip, jenis_pegawai: item.jenis_pegawai, password: "" });
    openModalEdit();
  };

  const handleEditSave = () => {
    if (!selectedPegawai) return;

    // password opsional → kalau kosong jangan kirim
    const payload: any = {
      nama: formData.nama,
      nip: formData.nip,
      jenis_pegawai: formData.jenis_pegawai,
    };
    if (formData.password.trim() !== "") {
      payload.password = formData.password;
    }

    fetch(`http://127.0.0.1:8000/api/pegawai/${selectedPegawai.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || "Gagal update pegawai");
        return data;
      })
      .then((res) => {
        alert(res.message);
        fetchPegawai();
        closeModalEdit();
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  };

  // Handle Delete Data
  const handleDelete = (id: number) => {
    if (!confirm("Apakah yakin ingin menghapus pegawai ini?")) return;
    fetch(`http://127.0.0.1:8000/api/pegawai/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert(res.message);
          fetchPegawai();
        }
      })
      .catch(console.error);
  };


  // Columns TanStack
  const columns: ColumnDef<PegawaiType>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nama", header: "Nama Pegawai" },
    { accessorKey: "nip", header: "NIP" },
    { accessorKey: "jenis_pegawai", header: "Jenis Pegawai" },
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
    data: pegawai,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div>
      {/* Button Tambah Data */}
      <div className="flex justify-end mb-4">
        <Button variant="primary" onClick={handleAddOpen}>
          Tambah Pegawai
        </Button>
      </div>

      {/* Tabel Pegawai */}
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
      <Modal isOpen={isOpenAdd} onClose={closeModalAdd} className="max-w-[500px] m-4">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
          <h4 className="text-lg font-semibold mb-4">Tambah Pegawai</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Nama Pegawai</Label>
              <Input type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} />
            </div>
            <div>
              <Label>NIP</Label>
              <Input type="text" value={formData.nip} onChange={(e) => setFormData({ ...formData, nip: e.target.value })} />
            </div>
            <div>
              <Label>Jenis Pegawai</Label>
              <select
                value={formData.jenis_pegawai}
                onChange={(e) => setFormData({ ...formData, jenis_pegawai: e.target.value as "ASN" | "NON-ASN" })}
                className="w-full border rounded px-2 py-1"
              >
                <option value="ASN">ASN</option>
                <option value="NON-ASN">NON-ASN</option>
              </select>
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={closeModalAdd}>
              Close
            </Button>
            <Button onClick={handleAddSave}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Edit */}
      <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="max-w-[500px] m-4">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
          <h4 className="text-lg font-semibold mb-4">Edit Pegawai</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Nama Pegawai</Label>
              <Input type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} />
            </div>
            <div>
              <Label>NIP</Label>
              <Input type="text" value={formData.nip} onChange={(e) => setFormData({ ...formData, nip: e.target.value })} />
            </div>
            <div>
              <Label>Jenis Pegawai</Label>
              <select
                value={formData.jenis_pegawai}
                onChange={(e) => setFormData({ ...formData, jenis_pegawai: e.target.value as "ASN" | "NON-ASN" })}
                className="w-full border rounded px-2 py-1"
              >
                <option value="ASN">ASN</option>
                <option value="NON-ASN">NON-ASN</option>
              </select>
            </div>
            <div>
              <Label>Password (opsional)</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Kosongkan jika tidak diubah"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={closeModalEdit}>
              Close
            </Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
