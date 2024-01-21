import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth"
import { ThreeCircles } from "react-loader-spinner";
import { LoaderContainer, loader } from "react-global-loader";

const Layout = () => {
  const { auth } = useAuth();
  return (
    <div className="container">
      <LoaderContainer>
        <ThreeCircles
          visible={true}
          height="200"
          width="200"
          color="#4fa94d"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </LoaderContainer>
      <div className="App">
        <Header huidige_gebruiker={auth} />
        <div className="pt-3">
          <Outlet />
        </div>
        <Footer huidige_gebruiker={auth} />
      </div>
    </div>
  );
};

export default Layout;
