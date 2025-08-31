import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TableAset from "../../components/tables/BasicTables/TableAset";

export default function Aset() {
  return (
    <>
      <PageMeta
        title="Sistem Informasi Manajemen Aset"
        description="This is Home page for Sistem Informasi Manajemen Aset"
      />
      <PageBreadcrumb pageTitle="Tabel aset" />
      <div className="space-y-6">
        <ComponentCard title="Tabel Aset">
          <TableAset />
        </ComponentCard>
      </div>
    </>
  );
}
