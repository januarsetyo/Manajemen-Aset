import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TableLokasi from "../../components/tables/BasicTables/TableLokasi";

export default function Lokasi() {
  return (
    <>
      <PageMeta
        title="Sistem Informasi Manajemen Aset"
        description="This is Home page for Sistem Informasi Manajemen Aset"
      />
      <PageBreadcrumb pageTitle="Tabel Lokasi" />
      <div className="space-y-6">
        <ComponentCard title="Tabel Lokasi">
          <TableLokasi />
        </ComponentCard>
      </div>
    </>
  );
}
