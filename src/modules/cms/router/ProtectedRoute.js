import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

const ProtectedRoute = ({ element: Component }) => {
  return isAuthenticated() ? <Component /> : <Navigate to='/cms' />;
};

export default ProtectedRoute;
