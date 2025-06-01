import Header from "../../components/header/Header";
import { Outlet, useLocation } from "react-router-dom";



const Layout = () => {

  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/signup", "/verify-email"];

return (
    <div>
      {/* Conditionally render Header if the current path is not in hideHeaderRoutes */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;