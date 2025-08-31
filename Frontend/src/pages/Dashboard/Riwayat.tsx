import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TableRiwayat from "../../components/tables/BasicTables/TableRiwayat";

export default function Aset() {
  return (
    <>
      <PageMeta
        title="Sistem Informasi Manajemen Aset"
        description="This is Home page for Sistem Informasi Manajemen Aset"
      />
      <PageBreadcrumb pageTitle="Riwayat Aset" />
      <div className="space-y-6">
        <ComponentCard title="Riwayat Aset">
          <TableRiwayat />
        </ComponentCard>
      </div>
    </>
  );
}
