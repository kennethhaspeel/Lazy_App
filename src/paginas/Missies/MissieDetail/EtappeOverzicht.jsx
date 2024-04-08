import { CompareDates, DateToDDMMYYYY, GetMissieDagen, GetTijdFromDate, HHMM_To_date } from "../../../components/DatumFuncties"
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../../components/ErrorFallback";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";
import { Alert, ListGroup, ListGroupItem, Button, Modal, Form, Row, Col,Accordion } from "react-bootstrap"
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";

const EtappeOverzicht = ({ missieId, startDatum, eindDatum }) => {
  const [nieuweEtappe, setNieuweEtappe] = useState({
    missieid: missieId,
    bedrag: 0,
    titel: '',
    locatie: '',
    datum: null,
    startUur: null,
    eindUur: null
  })
  const [showModalNieuweEtappe, setShowModalNieuweEtappe] = useState(false)
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const missiedagen = GetMissieDagen(startDatum, eindDatum)

  const { data: etappes, isLoading, isError } = useQuery({
    queryKey: ['missieetappes', missieId],
    queryFn: async () => {
      //console.log(`${axiosUrls('GetMissieEtappes')}?missieid=${missieId}`)
      const response = await axiosPrivate.get(`${axiosUrls('GetMissieEtappes')}?missieid=${missieId}`);
console.log(response.data)
      return response.data
    }
  })

  const { mutate: addEtappe, isLoading: LoadUpdate } = useMutation({
    mutationFn: async (nieuweEtappe) => {
        return axiosPrivate.post(axiosUrls('PostMissieEtappe'), nieuweEtappe);
    },
    onSettled: ()=>{
        queryClient.invalidateQueries(['missieetappes', missieId])
        
    },
    onSuccess: nieuw => {
        queryClient.invalidateQueries(['missieetappes', missieId])
        setShowModalNieuweEtappe(false)
        //queryClient.invalidateQueries(["MissieLijst"], { exact: true })
    }
})

  const EtappeToevoegen = (datum) => {
    setShowModalNieuweEtappe(true)
    setNieuweEtappe({ ...nieuweEtappe, datum: datum, startUur: '08:00', eindUur: '08:00' })
  }

  const handleCloseModalNieuweEtappe = () => {
    setShowModalNieuweEtappe(false)
    setNieuweEtappe({
      missieid: missieId,
      bedrag: 0,
      titel: '',
      locatie: '',
      datum: new Date(),
      startUur: null,
      eindUur: null
    })
  }

  const bewaarNieuweEtappe = (e) => {
    e.preventDefault()
    console.log(nieuweEtappe)
    const form = document.getElementById('formNieuweEtappe');
    if (form.checkValidity() === false) {
        e.stopPropagation();
    }
    console.log(HHMM_To_date(DateToDDMMYYYY(nieuweEtappe.datum),nieuweEtappe.startUur))
    console.log(HHMM_To_date(DateToDDMMYYYY(nieuweEtappe.datum),nieuweEtappe.eindUur))
    const postData = {
      missieId: missieId,
      titel: nieuweEtappe.titel,
      locatie: nieuweEtappe.locatie,
      startDatum: HHMM_To_date(DateToDDMMYYYY(nieuweEtappe.datum),nieuweEtappe.startUur),
      eindDatum: HHMM_To_date(DateToDDMMYYYY(nieuweEtappe.datum),nieuweEtappe.eindUur),
    bedrag: 0,  
    }
    addEtappe(postData)
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {
        etappes?.length ? (

          missiedagen.length ?
            (
              missiedagen.map(dag => {
                return (
                  <div className="ms-3 pb-3" key={dag.toString()}>
                    <Alert variant='success'>
                      {DateToDDMMYYYY(dag)} <Button className="ms-2" onClick={() => { EtappeToevoegen(dag) }}>Toevoegen</Button>
                    </Alert>
                    <div className="ms-3">

                        {
                          etappes.filter((etappe) => { return CompareDates(dag, etappe.startDatum) }).map((et) => {
                            return <>
                                      <Row key={et.id} className="pt-2">
                                        <Col sm={6} lg={4}>{et.titel}  </Col>
                                        <Col sm={2} lg={2}> {GetTijdFromDate(et.startDatum)}</Col>
                                        <Col sm={2} lg={2}> {GetTijdFromDate(et.eindDatum)}</Col>
                                        <Col sm={2} lg={2}> Bedrag</Col>
                                        <Col sm={1} lg={2}>
                                          <Button variant="outline-secondary">
                                          <FaMagnifyingGlass />
                                            </Button>
                                        </Col>
                                      </Row>
                            </>
                          })
                        }

                    </div>

                  </div>

                )
              })
            ) : ('Geen missiedagen')

        ) : (<p>geen data</p>)
      }
      <Modal show={showModalNieuweEtappe} onHide={handleCloseModalNieuweEtappe}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="pt-1" id="formNieuweEtappe" onSubmit={bewaarNieuweEtappe}>
            <Form.Group className="mb-3">
              <Form.Label>Titel</Form.Label>
              <Form.Control
                type="text"
                id="titel"
                autoComplete="off"
                value={nieuweEtappe.titel}
                placeholder="Geef een titel"
                onChange={(e) => setNieuweEtappe({ ...nieuweEtappe, titel: e.target.value })}
                required
              >
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Locatie</Form.Label>
              <Form.Control
                type="text"
                id="locatie"
                autoComplete="off"
                value={nieuweEtappe.locatie}
                placeholder="Wat is de algemene locatie"
                onChange={(e) => setNieuweEtappe({ ...nieuweEtappe, locatie: e.target.value })}
              >

              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Startdatum</Form.Label>
              <Form.Control
                type="time"
                id="startdatum"
                autoComplete="off"
                value={nieuweEtappe.startUur}
                onChange={(e) => setNieuweEtappe({ ...nieuweEtappe, startUur: e.target.value, eindUur: e.target.value })}
                required
              >

              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Einddatum</Form.Label>
              <Form.Control
                type="time"
                id="einddatum"
                autoComplete="off"
                value={nieuweEtappe.eindUur}
                onChange={(e) => setNieuweEtappe({ ...nieuweEtappe, eindUur: e.target.value })}
                required
              >
              </Form.Control>
            </Form.Group>
            <hr />
            <Button variant="primary" type="submit">
              Bewaar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </ErrorBoundary>

  )
}

export default EtappeOverzicht