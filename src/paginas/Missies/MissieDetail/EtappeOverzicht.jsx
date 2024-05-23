import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../../components/ErrorFallback";
import { useState, useEffect } from "react";
import {  CompareDates,  DateToDDMMYYYY, GetMissieDagen,  DateToYYYYMMDDstring,} from "../../../components/DatumFuncties";
import {  Accordion,  Button,  ButtonGroup,  Col,  ListGroup,  Row,  Modal} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faImages, faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import SuspenseParagraaf from "../../../components/SuspenseParagraaf";

const EtappeOverzicht = ({  missieId,  startDatum,  eindDatum,  totaalKost,  setTotaalKost,  missieAfgesloten,}) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient()
  const [missiedata, setMissiedata] = useState([]);
  const [toonDeleteModal, setToonDeleteModal] = useState(false)
  const [etappeToDelete, setEtappeToDelete] = useState(0)
  const [deletingEtappe, setDeletingEtappe] = useState(false)

  let totaleKost = 0;
  const {
    data: etappes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["missieetappes", missieId],
    queryFn: async () => {
      const response = await axiosPrivate.get(
        `${axiosUrls("GetMissieEtappes")}?missieid=${missieId}`
      );
      console.log(response.data);
      setMissiedata(GetMissieDagen(startDatum, eindDatum));
      return response.data;
    },
  });

  useEffect(() => {
    etappes?.map((e) => (totaleKost += e.kost));
    setTotaalKost(totaleKost.toFixed(2));
  }, [etappes]);

  const { mutate } = useMutation({
    mutationFn: async (etappeid) => {
      return axiosPrivate.delete(`${axiosUrls("DeleteEtappe")}/${etappeid}`);
    },
    onSuccess: () => {
        queryClient.invalidateQueries(["missieetappes", missieId]);
        setToonDeleteModal(false)
        setDeletingEtappe(false)
    },
  });
  const handleVerwijder = (etappeid)=>{
    setDeletingEtappe(true)
    mutate(etappeToDelete)
console.log(etappeToDelete)
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {isLoading ? (
        <SuspenseParagraaf />
      ) : missiedata?.length ? (
        missiedata?.map((dag, index) => (
          <div key={DateToDDMMYYYY(dag).toString()}>
            <ListGroup
              as="ul"
              className="pb-2"
              key={`listgroup_${DateToDDMMYYYY(dag).toString()}`}
            >
              <ListGroup.Item as="li" variant="dark" key={"listgroupitem_0"}>
                {index == 0 ? "Algemeen" : DateToDDMMYYYY(dag)}
                {!missieAfgesloten ? (
                  <Button
                    variant="info"
                    className="ms-3"
                    disabled={missieAfgesloten}
                    onClick={() => {
                      navigate({
                        pathname: "/Missie/EtappeToevoegen",
                        search: `missieid=${missieId}&etappedatum=${DateToYYYYMMDDstring(
                          dag
                        )}`,
                      });
                    }}
                  >
                    Toevoegen
                  </Button>
                ) : (
                  ""
                )}
              </ListGroup.Item>
            </ListGroup>
            <Accordion
              className="pb-2"
              defaultActiveKey="0"
              border="primary"
              key={`accordion_${index}`}
            >
              {etappes.filter((etappe) => CompareDates(dag, etappe.datumTijd))
                .length > 0 ? (
                etappes
                  .filter((etappe) => CompareDates(dag, etappe.datumTijd))
                  .map((et, indexEt) => (
                    <>
                      <Accordion.Item
                        eventKey={indexEt}
                        className="pb-1 pt-1 border-1 border-dark"
                        key={`accordionetappe_${index}`}
                      >
                        <Accordion.Header>
                          <span style={{ width: "65%" }}>{et.titel}</span>

                          <span
                            className="text-end pe-1"
                            style={{ width: "35%" }}
                          >
                            &euro; {et.kost.toFixed(2)}{" "}
                            {() => setTotaalKost(totaalKost + et.kost)}
                          </span>
                        </Accordion.Header>
                        <Accordion.Body className="bg-secondary  bg-opacity-25">
                          <Row>
                            <Col xs={6} key={"col-fotostitel"}>
                              Foto's
                            </Col>
                            <Col xs={6} key={"col-fotos"}>
                              <ButtonGroup style={{ width: "100%" }}>
                                <Button
                                  key={`btn_aantalfotos_${et.id.toString()}`}
                                  variant={
                                    et.aantalEtappeFotos > 0
                                      ? "success"
                                      : "outline-secondary"
                                  }
                                  disabled={
                                    et.aantalEtappeFotos > 0 ? false : true
                                  }
                                  onClick={() => {
                                    navigate({
                                      pathname:
                                        "/bestanden/ToonEtappeBestanden",
                                      search: `etappeid=${et.id}&missieid=${missieId}&etappetitel=${et.titel}`,
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon icon={faImages} />
                                  &nbsp;{et.aantalEtappeFotos}
                                </Button>
                                <Button
                                  key={`btn_bekijkfotos_${et.id.toString()}`}
                                  variant="outline-success"
                                  onClick={() => {
                                    navigate({
                                      pathname: "/bestanden/BestandOpladen",
                                      search: `etappeid=${et.id}&onderwerp=1&missieid=${missieId}`,
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon icon={faPlus} />
                                </Button>
                              </ButtonGroup>
                            </Col>
                          </Row>
                          <hr />
                          <Row>
                            <Col>
                              Betaald door&nbsp;{" "}
                              <strong>{et.betaaldDoor}</strong>
                            </Col>
                          </Row>
                          <Row className="pt-1 pb-1">
                            <Col xs={6} key={"col-bewijsstukkentitel"}>
                              Bewijsstukken
                            </Col>
                            <Col xs={6} key={"col-bewijsstukkeninhoud"}>
                              <ButtonGroup style={{ width: "100%" }}>
                                <Button
                                  key={`btn_aantalbewijsstukken_${et.id.toString()}`}
                                  variant={
                                    et.aantalKostBewijsstukken > 0
                                      ? "success"
                                      : "outline-secondary"
                                  }
                                  disabled={
                                    et.aantalEtappeFotos > 0 ? false : true
                                  }
                                  onClick={() => {
                                    navigate({
                                      pathname: "/bestanden/bekijkbestand",
                                      search: `etappeid=${et.id}&onderwerp=2&missieid=${missieId}`,
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon icon={faFile} />
                                  &nbsp;{et.aantalKostBewijsstukken}
                                </Button>
                                <Button
                                  key={`btn_toonbewijsstukken_${et.id.toString()}`}
                                  variant="outline-success"
                                  onClick={() => {
                                    navigate({
                                      pathname: "/bestanden/BestandOpladen",
                                      search: `etappeid=${et.id}&onderwerp=2&missieid=${missieId}`,
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon icon={faPlus} />
                                </Button>
                              </ButtonGroup>
                            </Col>
                          </Row>
                          {missieAfgesloten ? (
                            ""
                          ) : (
                            <Row className="pt-2">
                              <Col>
                                <Button 
                                variant="danger"
                                onClick={()=>{
                                  setEtappeToDelete(et.id)
                                  setToonDeleteModal(true)
                                }}
                                >
                                  Verwijder
                                  </Button>
                              </Col>
                            </Row>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    </>
                  ))
              ) : (
                <Row>
                  <Col>Nog geen etappes</Col>
                </Row>
              )}
            </Accordion>

            <Modal show={toonDeleteModal} onHide={()=>{setToonDeleteModal(false)}}>
              <Modal.Header closeButton>
                <Modal.Title>Bent u zeker</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Bent u zeker dat u deze etappe wilt verwijderen ?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={()=>{setToonDeleteModal(false)}}>
                  Annuleer
                </Button>
                <Button variant="primary" onClick={()=>{
                  handleVerwijder()
                }}>
                  {
                    deletingEtappe ?(<FontAwesomeIcon icon={faSpinner} spin size="lg" />) :('Verwijderen')
                  }
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ))
      ) : (
        <p>Geen missies gevonden</p>
      )}
    </ErrorBoundary>
  );
};

export default EtappeOverzicht;
