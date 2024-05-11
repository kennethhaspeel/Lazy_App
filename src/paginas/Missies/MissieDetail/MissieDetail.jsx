import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";
import { useState } from "react";
import SuspenseParagraaf from "../../../components/SuspenseParagraaf";
import { useSearchParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

import { Alert, Button, Spinner } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Details from "./Details";
import Deelnemers from "./Deelnemers";
import EtappeOverzicht from "./EtappeOverzicht";
import { DatumVoorbij } from "../../../components/DatumFuncties";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";

const MissieDetail = () => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const [queryParam] = useSearchParams();
  const missieid = queryParam.get("missieid");
  const { auth } = useAuth();
  const currentUser = auth?.user;
  const [isOrganisator, setIsOrganisator] = useState(false);
  const [isDeelnemer, setIsDeelnemer] = useState(false);
  const [startdatum, setStartdatum] = useState();
  const [einddatum, setEinddatum] = useState();
  const [totaalKost, setTotaalKost] = useState(0);
  const [missieAfgesloten, setMissieAfgesloten] = useState(false);
  const [toonModaalAfsluiten, setToonModaalAfsluiten] = useState(false);
  const [toonModaalMissieAfsluiten, setToonModaalMissieAfsluiten] =  useState(false);
  const [toonMededelingBewaard, setToonMededelingBewaard] = useState(false);

  const { mutate: afsluitenMissie, isLoading: LoadUpdate }= useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.get(`${axiosUrls("PostMissieAfsluiten")}?missieid=${missieid}`);
      return response;
    },
    onSuccess: () => {
        setToonModaalMissieAfsluiten(false)
      setToonMededelingBewaard(true);
      queryClient.invalidateQueries(["missiedetail", missieid]);
    },
  });

  return (
    <>
      <div className="pb-4">
        {!missieAfgesloten && DatumVoorbij(einddatum) ? (
          <Button
            variant="success"
            size="lg"
            onClick={() => {
              setToonModaalAfsluiten(true);
            }}
          >
            Missie Afsluiten
          </Button>
        ) : (
          ""
        )}
      </div>
      <div className="pg-4" hidden={!toonMededelingBewaard}>
        <Alert variant="success">
          <FontAwesomeIcon icon={faThumbsUp} size="2xl" className="me-3" />
          &nbsp;Alles werd bewaard
        </Alert>
      </div>

      <Alert variant="primary">Details</Alert>
      <Details
        missieid={missieid}
        setStartdatum={setStartdatum}
        setEinddatum={setEinddatum}
        isOrganisator={isOrganisator}
        missieAfgesloten={missieAfgesloten}
        setMissieAfgesloten={setMissieAfgesloten}
      />
      <Alert variant="primary">Deelnemers</Alert>
      <Deelnemers
        missieid={missieid}
        currentUser={currentUser}
        isOrganisator={isOrganisator}
        setIsOrganisator={setIsOrganisator}
        isDeelnemer={isDeelnemer}
        setIsDeelnemer={setIsDeelnemer}
        missieAfgesloten={missieAfgesloten}
        setMissieAfgesloten={setMissieAfgesloten}
      />
      <Alert variant="primary">Etappes (Totaalkost: &euro; {totaalKost})</Alert>
      {startdatum != null && einddatum != null ? (
        <EtappeOverzicht
          missieId={missieid}
          startDatum={startdatum}
          eindDatum={einddatum}
          totaalKost={totaalKost}
          setTotaalKost={setTotaalKost}
          missieAfgesloten={missieAfgesloten}
          setMissieAfgesloten={setMissieAfgesloten}
        />
      ) : (
        <SuspenseParagraaf />
      )}
      <Modal
        show={toonModaalAfsluiten}
        onHide={() => {
          setToonModaalAfsluiten(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Missie Afsluiten</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Ben je zeker dat je deze missie afsluiten??</p>

            <Alert variant="danger">
              <FontAwesomeIcon icon={faTriangleExclamation} /> dit kan niet
              ongedaan gemaakt worden{" "}
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </Alert>
          <p className="small text-secondary text-opacity-50">
            Allé, eigenlijk kan het wel maar tis teveel werk
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setToonModaalAfsluiten(false);
            }}
          >
            Annuleer
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setToonModaalAfsluiten(false);
              setToonModaalMissieAfsluiten(true);
              afsluitenMissie();
            }}
          >
            Afsluiten
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={toonModaalMissieAfsluiten}>
        <Modal.Body>
          <p className="text-center">Even geduld...</p>
          <p className="text-center">Alles wordt verwerkt</p>
          <Alert className="text-center" variant="light">
            <Spinner animation="grow" variant="success" className="pe-1" />
            <Spinner animation="grow" variant="danger" className="pe-1" />
            <Spinner animation="grow" variant="warning" className="pe-1" />
            <Spinner animation="grow" variant="info" className="pe-1" />
          </Alert>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MissieDetail;
