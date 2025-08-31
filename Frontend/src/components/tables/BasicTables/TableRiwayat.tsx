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
import Button from "../../ui/button/Button";

interface AsetType {
  id: number;
  nama: string;
  kode_aset: string;
  merk: string;
  kondisi: string;
  status_penggunaan: string;
  tgl_pembukuan?: string;
  tgl_perolehan?: string;
  lokasi?: { id: number; nama_ruangan: string };
  pegawai?: { id: number; nama: string };
}

export default function RiwayatAsetTable() {
  const [aset, setAset] = useState<AsetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const token = localStorage.getItem("token");

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://127.0.0.1:8000/api/aset/riwayat", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      if (result.success) {
        setAset(result.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRiwayat();
    else {
      setError("No authentication token found");
      setLoading(false);
    }
  }, [token]);

  // Format tanggal jadi dd-MM-yyyy
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const columns: ColumnDef<AsetType>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nama", header: "Nama Aset" },
    { accessorKey: "kode_aset", header: "Kode Aset" },
    { accessorKey: "merk", header: "Merk" },
    {
      header: "Kondisi",
      accessorFn: (row) => row.kondisi,
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.original.kondisi === "Baik"
              ? "bg-green-100 text-green-700"
              : row.original.kondisi === "Rusak"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.original.kondisi}
        </span>
      ),
    },
    {
      header: "Status",
      accessorFn: (row) => row.status_penggunaan,
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.original.status_penggunaan === "Digunakan"
              ? "bg-blue-100 text-blue-700"
              : row.original.status_penggunaan === "Tidak Digunakan"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.original.status_penggunaan}
        </span>
      ),
    },
    {
      header: "Tanggal Pembukuan",
      accessorFn: (row) => formatDate(row.tgl_pembukuan),
    },
    {
      header: "Tanggal Perolehan",
      accessorFn: (row) => formatDate(row.tgl_perolehan),
    },
    {
      header: "Lokasi",
      accessorFn: (row) => row.lokasi?.nama_ruangan ?? "-",
    },
    {
      header: "Pemegang Aset",
      accessorFn: (row) => row.pegawai?.nama ?? "-",
    },
  ];

  const table = useReactTable({
    data: aset,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700 font-medium">Error:</div>
        <div className="text-red-600">{error}</div>
        <button
          onClick={fetchRiwayat}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return ( 
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="mb-4 p-2 bg-gray-100 rounded text-sm"> <div>Total riwayat aset: {aset.length}</div> </div>
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between p-4">
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
    </div>
  );
}
