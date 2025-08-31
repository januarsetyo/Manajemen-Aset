import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" />;
  }

  try {
    const decoded: any = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/signin" />;
    }
  } catch (err) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
