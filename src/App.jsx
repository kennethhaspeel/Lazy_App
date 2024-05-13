import { Route, Routes } from "react-router-dom";
import { QueryClient,QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


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
import PaswoordVergeten from "./paginas/identity/PaswoordVergeten";

// financieel
import Uitleg from "./paginas/financieel/Uitleg";
import OverzichtSpaarboek from "./paginas/financieel/OverzichtSpaarboek";
import TransactieOverzicht from "./paginas/financieel/TransactieOverzicht"
import TransactieToevoegen from "./paginas/financieel/TransactieToevoegen";

// missie
import MissieOverzicht from "./paginas/Missies/MissieLijst/MissieOverzicht";
import MissieDetail from "./paginas/Missies/MissieDetail/MissieDetail";
import KostToevoegen from "./paginas/Missies/MissieEtappeKost/KostToevoegen";
import EtappeToevoegen from "./paginas/Missies/Etappe/EtappeToevoegen";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route element={<PersistLogin />}>
          <Route index element={<Home />} />
          <Route path="Missies">
            <Route path="MissieOverzicht" element={<MissieOverzicht />}></Route>
          </Route>

          <Route path="financieel">
            <Route element={<AuthRequired allowedRoles={["gebruiker"]} />}>
              <Route path="uitleg" element={<Uitleg />}></Route>
              <Route path="OverzichtSpaarboek" element={<OverzichtSpaarboek />}></Route>
            </Route>
            <Route element={<AuthRequired allowedRoles={["financieel"]} />}>
              <Route path="TransactieOverzicht" element={<TransactieOverzicht />}></Route>
              <Route path="TransactieToevoegen" element={<TransactieToevoegen />}></Route>
            </Route>
          </Route>
          <Route path="missie">
            <Route element={<AuthRequired allowedRoles={["gebruiker"]} />}>
              <Route path="MissieOverzicht" element={<MissieOverzicht />}></Route>
              <Route path="MissieDetail" element={<MissieDetail />}></Route>
              <Route path="MissieEtappeKost" element={<KostToevoegen />}></Route>
              <Route path="EtappeToevoegen" element={<EtappeToevoegen />}></Route>
            </Route>
          </Route>
        </Route>
        <Route path="identity">
          <Route path="login" element={<Login />}></Route>
          <Route path="geentoegang" element={<GeenToegang />}></Route>
          <Route path="registreeringediend" element={<RegistreerIngediend />}></Route>
          <Route path="bevestigregistratie" element={<BevestigRegistratie />}></Route>
          <Route path="registreer" element={<Registreer />}></Route>
          <Route path="loguit" element={<Loguit />}></Route>
          <Route path="paswoordvergeten" element={<PaswoordVergeten />}></Route>
        </Route>
        <Route path="*" element={<NietGevonden />}></Route>
      </Route>
    </Routes>
    <ReactQueryDevtools/>
    </QueryClientProvider>
  );
}

export default App;