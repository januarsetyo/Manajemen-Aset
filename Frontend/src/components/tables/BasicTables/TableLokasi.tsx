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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";

interface LokasiType {
  id: number;
  nama_ruangan: string;
  lantai: number;
}

export default function LokasiTable() {
  const [lokasi, setLokasi] = useState<LokasiType[]>([]);
  const [selectedLokasi, setSelectedLokasi] = useState<LokasiType | null>(null);
  const [formData, setFormData] = useState<{ nama_ruangan: string; lantai: string }>({
    nama_ruangan: "",
    lantai: "1",
  });

  const { isOpen: isOpenAdd, openModal: openModalAdd, closeModal: closeModalAdd } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

  const [sorting, setSorting] = useState<SortingState>([]);
  
  // Fetch Lokasi
  const fetchLokasi = () => {
    fetch("http://127.0.0.1:8000/api/lokasi", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setLokasi(res.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchLokasi();
  }, []);

  // Tambah Data
  const handleAddOpen = () => {
    setFormData({ nama_ruangan: "", lantai: "1" });
    openModalAdd();
  };

  const handleAddSave = () => {
    fetch("http://127.0.0.1:8000/api/lokasi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        nama_ruangan: formData.nama_ruangan,
        lantai: Number(formData.lantai),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert(res.message);
          fetchLokasi();
          closeModalAdd();
        }
      })
      .catch(console.error);
  };

  // Edit Data
  const handleEditOpen = (item: LokasiType) => {
    setSelectedLokasi(item);
    setFormData({ nama_ruangan: item.nama_ruangan, lantai: item.lantai.toString() });
    openModalEdit();
  };

  const handleEditSave = () => {
    if (!selectedLokasi) return;
    fetch(`http://127.0.0.1:8000/api/lokasi/${selectedLokasi.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        nama_ruangan: formData.nama_ruangan,
        lantai: Number(formData.lantai),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert(res.message);
          fetchLokasi();
          closeModalEdit();
        }
      })
      .catch(console.error);
  };

  // Delete Data
  const handleDelete = (id: number) => {
    if (!confirm("Apakah yakin ingin menghapus lokasi ini?")) return;
    fetch(`http://127.0.0.1:8000/api/lokasi/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert(res.message);
          fetchLokasi();
        }
      })
      .catch(console.error);
  };

  // Buat array lantai 1-14
  const lantaiOptions = Array.from({ length: 14 }, (_, i) => (i + 1).toString());

  // Columns TanStack
  const columns: ColumnDef<LokasiType>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nama_ruangan", header: "Nama Ruangan" },
    { accessorKey: "lantai", header: "Lantai" },
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
    data: lokasi,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" onClick={handleAddOpen}>
          Tambah Data
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
      <Modal isOpen={isOpenAdd} onClose={closeModalAdd} className="max-w-[500px] m-4">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
          <h4 className="text-lg font-semibold mb-4">Tambah Lokasi</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Nama Ruangan</Label>
              <Input
                type="text"
                value={formData.nama_ruangan}
                onChange={(e) => setFormData({ ...formData, nama_ruangan: e.target.value })}
              />
            </div>
            <div>
              <Label>Lantai</Label>
              <select
                value={formData.lantai}
                onChange={(e) => setFormData({ ...formData, lantai: e.target.value })}
                className="w-full border rounded px-2 py-1"
              >
                {lantaiOptions.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={closeModalAdd}>Close</Button>
            <Button onClick={handleAddSave}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Edit */}
      <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="max-w-[500px] m-4">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
          <h4 className="text-lg font-semibold mb-4">Edit Lokasi</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Nama Ruangan</Label>
              <Input
                type="text"
                value={formData.nama_ruangan}
                onChange={(e) => setFormData({ ...formData, nama_ruangan: e.target.value })}
              />
            </div>
            <div>
              <Label>Lantai</Label>
              <select
                value={formData.lantai}
                onChange={(e) => setFormData({ ...formData, lantai: e.target.value })}
                className="w-full border rounded px-2 py-1"
              >
                {lantaiOptions.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={closeModalEdit}>Close</Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
