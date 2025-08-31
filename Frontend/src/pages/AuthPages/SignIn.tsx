import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="SignIn - Sistem Informasi Manajemen Aset"
        description="SignIn page for Sistem Informasi Manajemen Aset"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
