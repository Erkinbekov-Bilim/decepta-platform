import Header from "../../components/header/Header";
import { Outlet } from "react-router-dom";


const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout;