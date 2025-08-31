import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TablePegawai from "../../components/tables/BasicTables/TablePegawai";

export default function Pegawai() {
  return (
    <>
      <PageMeta
        title="Sistem Informasi Manajemen Aset"
        description="This is Home page for Sistem Informasi Manajemen Aset"
      />
      <PageBreadcrumb pageTitle="Tabel Pegawai" />
      <div className="space-y-6">
        <ComponentCard title="Tabel Pegawai">
          <TablePegawai />
        </ComponentCard>
      </div>
    </>
  );
}
