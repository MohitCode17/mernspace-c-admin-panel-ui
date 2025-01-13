import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

const Dashboard = () => {
  // Redirect to login if user is null
  const { user } = useAuthStore();

  if (user === null) return <Navigate to={"/auth/login"} replace={true} />;

  return (
    <div>
      Dashboard
      <Outlet />
    </div>
  );
};

export default Dashboard;
