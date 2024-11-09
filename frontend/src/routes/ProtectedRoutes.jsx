import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
