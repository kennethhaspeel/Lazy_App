import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth"

const Layout = () => {
  const { auth } = useAuth();
  return (
    <div className="container">
      <div className="App">
        <Header huidige_gebruiker={auth}/>
        <div className="pt-3">
          <Outlet />
        </div>
        <Footer  huidige_gebruiker={auth}/>
      </div>
    </div>
  );
};

export default Layout;
