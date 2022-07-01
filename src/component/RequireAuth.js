import { useLocation, Outlet, Navigate } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  console.log(allowedRoles);
  const location = useLocation();
  return localStorage.getItem("userType") === allowedRoles[0] ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorised" state={{ from: location }} replace />
  );
};
export default RequireAuth;
