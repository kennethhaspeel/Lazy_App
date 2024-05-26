import { Route, Routes } from "react-router-dom";
import { QueryClient,QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {lazy} from "react"

import AuthRequired from "./components/AuthRequired";
import PersistLogin from "./components/PersistLogin";
import Layout from "./paginas/basis/Layout";
import Home from "./paginas/Home";
import Login from "./paginas/identity/Login";

const GeenToegang = lazy(()=> import("./paginas/basis/GeenToegang"))
const NietGevonden = lazy(()=> import("./paginas/basis/NietGevonden"))
const BevestigRegistratie = lazy(()=> import("./paginas/identity/BevestigRegistratie"))
const Registreer = lazy(()=> import("./paginas/identity/Registreer"))
const RegistreerIngediend = lazy(()=> import("./paginas/identity/RegistreerIngediend"))
const Loguit = lazy(()=> import("./paginas/identity/Loguit"))
const PaswoordVergeten = lazy(()=> import("./paginas/identity/PaswoordVergeten"))
const PaswoordInstellen = lazy(()=> import("./paginas/identity/PaswoordInstellen"))

// import GeenToegang from "./paginas/basis/GeenToegang";
// import NietGevonden from "./paginas/basis/NietGevonden";
// import BevestigRegistratie from "./paginas/identity/BevestigRegistratie";
// import Registreer from "./paginas/identity/Registreer";
// import RegistreerIngediend from "./paginas/identity/RegistreerIngediend";
// import Loguit from "./paginas/identity/Loguit";
// import PaswoordVergeten from "./paginas/identity/PaswoordVergeten";
// import PaswoordInstellen from "./paginas/identity/PaswoordInstellen";

// financieel
import Uitleg from "./paginas/financieel/Uitleg";
const OverzichtSpaarboek = lazy(()=> import("./paginas/financieel/OverzichtSpaarboek"))
const TransactieOverzicht = lazy(()=> import("./paginas/financieel/TransactieOverzicht"))
const TransactieToevoegen = lazy(()=> import("./paginas/financieel/TransactieToevoegen"))
// import OverzichtSpaarboek from "./paginas/financieel/OverzichtSpaarboek";
// import TransactieOverzicht from "./paginas/financieel/TransactieOverzicht"
// import TransactieToevoegen from "./paginas/financieel/TransactieToevoegen";

// missie
const MissieOverzicht = lazy(()=> import("./paginas/Missies/MissieLijst/MissieOverzicht"))
const MissieDetail = lazy(()=> import("./paginas/Missies/MissieDetail/MissieDetail"))
const KostToevoegen = lazy(()=> import("./paginas/Missies/MissieEtappeKost/KostToevoegen"))
const EtappeToevoegen = lazy(()=> import("./paginas/Missies/Etappe/EtappeToevoegen"))

// import MissieOverzicht from "./paginas/Missies/MissieLijst/MissieOverzicht";
// import MissieDetail from "./paginas/Missies/MissieDetail/MissieDetail";
// import KostToevoegen from "./paginas/Missies/MissieEtappeKost/KostToevoegen";
// import EtappeToevoegen from "./paginas/Missies/Etappe/EtappeToevoegen";

// bestanden
import BestandOpladen from "./paginas/bestanden/BestandOpladen";
import ToonEtappeBestanden from "./paginas/bestanden/ToonEtappeBestanden";

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
        <Route path="bestanden">
          <Route element={<AuthRequired allowedRoles={["gebruiker"]} />}>
            <Route path="bestandopladen" element={<BestandOpladen/>}></Route>
            <Route path="ToonEtappeBestanden" element={<ToonEtappeBestanden/>}></Route>
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
          <Route path="PaswoordInstellen" element={<PaswoordInstellen />}></Route>
        </Route>
        <Route path="*" element={<NietGevonden />}></Route>
      </Route>
    </Routes>
    <ReactQueryDevtools/>
    </QueryClientProvider>
  );
}

export default App;