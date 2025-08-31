import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

export default function LokasiTable() {
  const [lokasi, setLokasi] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/lokasi", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    })
      .then((res) => res.json())
      .then((data) => setLokasi(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100">
            <TableRow>
              <TableCell isHeader>ID</TableCell>
              <TableCell isHeader>Nama Ruangan</TableCell>
              <TableCell isHeader>Lantai</TableCell>
              <TableCell isHeader>Action</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {lokasi.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nama_ruangan}</TableCell>
                <TableCell>
                  <button
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded"
                    onClick={() => alert(`Edit lokasi ${item.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="ml-2 px-3 py-1 text-sm text-white bg-red-500 rounded"
                    onClick={() => alert(`Delete lokasi ${item.id}`)}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
