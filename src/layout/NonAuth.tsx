import { Outlet } from "react-router-dom";

const NonAuth = () => {
  return (
    <div>
      NonAuth
      <Outlet />
    </div>
  );
};

export default NonAuth;
