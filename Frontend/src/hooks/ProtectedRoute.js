import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  let location = useLocation();

  // useEffect(() => {
  //     if (!isLoggedIn) {
  //         navigate('/auth')
  //     }
  // }, [isLoggedIn])
  //   if(!localStorage.getItem("loginEmail")){
  //     return <Navigate  to="/login" state={{ from: location }}  replace />;
  //   }
  return children;
};
export default ProtectedRoute;
