import { Route, Routes } from "react-router-dom";
import AuthRequired from "./components/AuthRequired";
import PersistLogin from "./components/PersistLogin";

import Layout from "./paginas/basis/Layout";
import Home from "./paginas/Home";
import Login from "./paginas/identity/Login";
import GeenToegang from "./paginas/basis/GeenToegang";
import NietGevonden from "./paginas/basis/NietGevonden";
import BevestigRegistratie from "./paginas/identity/BevestigRegistratie";
import Registreer from "./paginas/identity/Registreer";
import RegistreerIngediend from "./paginas/identity/RegistreerIngediend";
import Loguit from "./paginas/identity/Loguit";

// financieel
import Uitleg from "./paginas/financieel/Uitleg";
import OverzichtSpaarboek from "./paginas/financieel/OverzichtSpaarboek";
import TransactieToevoegen from "./paginas/financieel/TransactieToevoegen";





function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<PersistLogin />}>
        <Route index element={<Home />} />
          <Route element={<AuthRequired allowedRoles={["gebruiker"]} />}>
            <Route path="financieel">
              <Route path="uitleg" element={<Uitleg />}></Route>
              <Route path="OverzichtSpaarboek" element={<OverzichtSpaarboek />}></Route>
            </Route>
          </Route>
          <Route element={<AuthRequired allowedRoles={["financieel"]} />}>
            <Route path="financieel">
              <Route path="transactietoevoegen" element={<TransactieToevoegen />}></Route>
            </Route>
          </Route>
          <Route path="identity">
            <Route path="loguit" element={<Loguit />}></Route>
          </Route>
        </Route>
          <Route path="identity">
            <Route path="login" element={<Login />}></Route>
            <Route path="geentoegang" element={<GeenToegang />}></Route>
            <Route path="registreeringediend" element={<RegistreerIngediend />}></Route>
            <Route path="bevestigregistratie" element={<BevestigRegistratie/>}></Route>
            <Route path="registreer" element={<Registreer/>}></Route>
          </Route>        
        <Route path="*" element={<NietGevonden />}></Route>
      </Route>
    </Routes>
  );
}

export default App;