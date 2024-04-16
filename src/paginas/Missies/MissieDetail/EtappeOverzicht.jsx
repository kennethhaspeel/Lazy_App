import { CompareDates, DateToDDMMYYYY, GetMissieDagen, GetTijdFromDate, HHMM_To_date } from "../../../components/DatumFuncties";
import {  QueryClient,  useMutation,  useQuery,  useQueryClient,} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../../components/ErrorFallback";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";
import { Badge, Alert, ListGroup, ListGroupItem, Button, Modal, Form, Row, Col, Accordion } from "react-bootstrap";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Link, useNavigate, useLocation, createSearchParams } from 'react-router-dom';

const EtappeOverzicht = ({ missieId, startDatum, eindDatum }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [nieuweEtappe, setNieuweEtappe] = useState({
    missieid: missieId,
    bedrag: 0,
    titel: "",
    locatie: "",
    datum: null,
    startUur: null,
    eindUur: null,
  });
  const [showModalNieuweEtappe, setShowModalNieuweEtappe] = useState(false);
  const [showModalEtappeKosten, setShowModalEtappeKosten] = useState(false);
  const [showModalEtappeKostToevoegen, setShowModalEtappeKostToevoegen] = useState(false);
  const [etappeKostenFiltered, setEtappeKostenFiltered] = useState([])
  const [etappeKostenFilteredTitel, setEtappeKostenFilteredTitel] = useState('')
  const [etappeKostenFilteredId, setEtappeKostenFilteredId] = useState(0)
  const [etappeKostNieuw, setEtappeKostNieuw] = useState({ etappeid: 0, titel: '', bedrag: 0 })
  const [queryUitvoeren, setQueryUitvoeren] = useState(false)
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const missiedagen = GetMissieDagen(startDatum, eindDatum);

  const {
    data: etappekosten,
    isLoadingKosten,
    isErrorKosten,
  } = useQuery({
    queryKey: ["missieetappekosten", missieId],

    queryFn: async () => {
      const response = await axiosPrivate.get(
        `${axiosUrls("GetMissieEtappeKosten")}?missieid=${missieId}`
      );
      console.log(response.data);
      return response.data;
    },
    enabled: queryUitvoeren
  });

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
      //console.log(response.data);
      setQueryUitvoeren(true)
      return response.data;
    },
  });

  const { mutate: addEtappe, isLoading: LoadUpdate } = useMutation({
    mutationFn: async (nieuweEtappe) => {
      return axiosPrivate.post(axiosUrls("PostMissieEtappe"), nieuweEtappe);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["missieetappes", missieId]);
    },
    onSuccess: (nieuw) => {
      queryClient.invalidateQueries(["missieetappes", missieId]);
      setShowModalNieuweEtappe(false);
      //queryClient.invalidateQueries(["MissieLijst"], { exact: true })
    },
  });

  const EtappeToevoegen = (datum) => {
    setShowModalNieuweEtappe(true);
    setNieuweEtappe({
      ...nieuweEtappe,
      datum: datum,
      startUur: "08:00",
      eindUur: "08:00",
    });
  };

  const handleCloseModalNieuweEtappe = () => {
    setShowModalNieuweEtappe(false);
    setNieuweEtappe({
      missieid: missieId,
      bedrag: 0,
      titel: "",
      locatie: "",
      datum: new Date(),
      startUur: null,
      eindUur: null,
    });
  };

  const bewaarNieuweEtappe = (e) => {
    e.preventDefault();
    console.log(nieuweEtappe);
    const form = document.getElementById("formNieuweEtappe");
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    console.log(
      HHMM_To_date(DateToDDMMYYYY(nieuweEtappe.datum), nieuweEtappe.startUur)
    );
    console.log(
      HHMM_To_date(DateToDDMMYYYY(nieuweEtappe.datum), nieuweEtappe.eindUur)
    );
    const postData = {
      missieId: missieId,
      titel: nieuweEtappe.titel,
      locatie: nieuweEtappe.locatie,
      startDatum: HHMM_To_date(
        DateToDDMMYYYY(nieuweEtappe.datum),
        nieuweEtappe.startUur
      ),
      eindDatum: HHMM_To_date(
        DateToDDMMYYYY(nieuweEtappe.datum),
        nieuweEtappe.eindUur
      ),
      bedrag: 0,
    };
    addEtappe(postData);
  };
  const BerekenKostPerEtappe = (etappeId) => {
    let bedrag = 0
    etappekosten.map((e) => {
      if (e.etappeId == etappeId) {
        bedrag += e.bedrag
      }
    })
    return bedrag.toFixed(2)
  }

  const ToonKostPerEtappe = (etappeid, titel) => {
    setEtappeKostenFilteredTitel(titel)
    setEtappeKostenFilteredId(etappeid)
    let kostenlijst = []
    etappekosten.map((e) => {
      if (e.etappeId == etappeid) {
        kostenlijst.push(e)
      }
    })
    console.log(kostenlijst)
    setEtappeKostenFiltered(kostenlijst)
    setShowModalEtappeKosten(true)
  }

  const BewaarEtappeKostNieuw = (e) => {
    console.log(etappeKostNieuw)
    e.preventDefault()
    const form = document.getElementById('formNieuweEtappeKost');
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

  }


  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {etappes?.length ? (
        missiedagen.length ? (
          missiedagen.map((dag) => {
            return (
              <div className="ms-3 pb-3" key={crypto.randomUUID()}>
                <Alert variant="success"  key={crypto.randomUUID()}>
                  {DateToDDMMYYYY(dag)}{" "}
                  <Button
                    className="ms-2"
                    onClick={() => {
                      EtappeToevoegen(dag);
                    }}
                  >
                    Toevoegen
                  </Button>
                </Alert>
                <div className="ms-3" key={DateToDDMMYYYY(dag)}>
                  {etappes
                    .filter((etappe) => {
                      return CompareDates(dag, etappe.startDatum);
                    })
                    .map((et) => {
                      return (
                        <>
                          <Row key={et.id} className="pt-2">
                            <Col sm={6} lg={4} key={crypto.randomUUID()}>
                              {et.titel}
                            </Col>
                            <Col sm={2} lg={2} key={crypto.randomUUID()}>

                              {GetTijdFromDate(et.startDatum)}
                            </Col>
                            <Col sm={2} lg={2} key={crypto.randomUUID()}>

                              {GetTijdFromDate(et.eindDatum)}
                            </Col>
                            <Col sm={2} lg={2} className="text-end d-grid" key={crypto.randomUUID()}>
                              {etappekosten?.length ? (
                                <div className="text-right pe-4" key={crypto.randomUUID()}>
                                  {BerekenKostPerEtappe(et.id)}
                                </div>
                              ) : <p>geen kosten</p>}
                            </Col>
                            <Col sm={1} lg={2} key={crypto.randomUUID()}>
                              <Button variant="outline-secondary" onClick={() => { ToonKostPerEtappe(et.id, et.titel) }} key={crypto.randomUUID()}>
                                <FaMagnifyingGlass />
                              </Button>
                            </Col>
                          </Row>
                        </>
                      );
                    })}
                </div>
              </div>
            );
          })
        ) : (
          "Geen missiedagen"
        )
      ) : (
        <p>geen data</p>
      )}
      <Modal show={showModalNieuweEtappe} onHide={handleCloseModalNieuweEtappe}>
        <Modal.Header closeButton>
          <Modal.Title>Etappe Toevoegen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            className="pt-1"
            id="formNieuweEtappe"
            onSubmit={bewaarNieuweEtappe}
          >
            <Form.Group className="mb-3">
              <Form.Label>Titel</Form.Label>
              <Form.Control
                type="text"
                id="titel"
                autoComplete="off"
                value={nieuweEtappe.titel}
                placeholder="Geef een titel"
                onChange={(e) =>
                  setNieuweEtappe({ ...nieuweEtappe, titel: e.target.value })
                }
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Locatie</Form.Label>
              <Form.Control
                type="text"
                id="locatie"
                autoComplete="off"
                value={nieuweEtappe.locatie}
                placeholder="Wat is de algemene locatie"
                onChange={(e) =>
                  setNieuweEtappe({ ...nieuweEtappe, locatie: e.target.value })
                }
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Startdatum</Form.Label>
              <Form.Control
                type="time"
                id="startdatum"
                autoComplete="off"
                value={nieuweEtappe.startUur}
                onChange={(e) =>
                  setNieuweEtappe({
                    ...nieuweEtappe,
                    startUur: e.target.value,
                    eindUur: e.target.value,
                  })
                }
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Einddatum</Form.Label>
              <Form.Control
                type="time"
                id="einddatum"
                autoComplete="off"
                value={nieuweEtappe.eindUur}
                onChange={(e) =>
                  setNieuweEtappe({ ...nieuweEtappe, eindUur: e.target.value })
                }
                required
              ></Form.Control>
            </Form.Group>
            <hr />
            <Button variant="primary" type="submit">
              Bewaar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>


      <Modal show={showModalEtappeKosten} onHide={() => { setShowModalEtappeKosten(false) }}>
        <Modal.Header closeButton>
          <Modal.Title>{etappeKostenFilteredTitel}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {etappeKostenFiltered.length > 0 ? (

            etappeKostenFiltered.map((kost) => {
              return <ListGroup>
                <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" >
                  <div className="ms-2 me-auto">
                    {kost.titel}
                  </div>
                  <div className="text-end">
                    {kost.bedrag.toFixed(2)}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            })

          ) : (
            <p>Geen kosten gevonden</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={() => {
            const path = {
              pathname: '/missie/MissieEtappeKost',
              search: createSearchParams({
                missieid: missieId,
                etappeid: etappeKostenFilteredId
              }).toString()
            }
            navigate(path)
          }}>
            Kost Toevoegen
          </Button>
          <Button variant="secondary" onClick={() => { setShowModalEtappeKosten(false) }}>Sluit</Button>
        </Modal.Footer>
      </Modal>


    </ErrorBoundary>
  );
};

export default EtappeOverzicht;
