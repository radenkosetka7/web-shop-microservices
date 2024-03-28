import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutesAdmin = () => {
  const { loggedUser } = useSelector((state) => state.users);
  const token = sessionStorage.getItem("access");
  return (
    token && loggedUser.role === 0 ? <Outlet /> : <Navigate to="/login" />
  );
};

export default PrivateRoutesAdmin;