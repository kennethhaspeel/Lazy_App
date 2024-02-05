import { GetMissieDagen, DateToDDMMYYYY, CompareDates } from "../../../components/DatumFuncties"
import { useState, useEffect } from "react"
import { axiosUrls } from '../../../api/axios'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Alert, Col, ListGroup, Row, Button, Modal, Form } from "react-bootstrap"
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DateToYYYYMMDD } from "../../../components/DatumFuncties"



const EtappeComponent = ({ etappes, setEtappes, isOrganisator, missiedetail, missieid }) => {
  let EtappeTemplate = {
    missieid: missieid,
    startDatum: '',
    eindDatum: '',
locatie:'',
    titel: '',
    bedrag: 0

  }

  const axiosPrivate = useAxiosPrivate();
  const [missiedagen, setMissiedagen] = useState([])
  const [nieuweEtappe, setNieuweEtappe] = useState(EtappeTemplate)
  const [isLoading, setIsLoading] = useState(true)
  const [showModalNieuweEtappe, setShowModalNieuweEtappe] = useState(false)



  useEffect(() => {
    const getMissieEtappes = async () => {

      try {
        const response = await axiosPrivate.get(`${axiosUrls('GetMissieEtappes')}?missieid=${missieid}`);
        setEtappes(response.data)
        console.log(response.data)
        setIsLoading(false)
      } catch (err) {
        console.error(err);
      }
    }

    getMissieEtappes()
  }, [])


  useEffect(() => {
    setMissiedagen(GetMissieDagen(missiedetail.startDatum, missiedetail.eindDatum))
    //console.log(missiedagen)
  }, [missiedetail])

  // useEffect(()=>{
  // console.log(nieuweEtappe)
  // },[nieuweEtappe])

  const handleCloseModalEtappe = () => {
    setShowModalNieuweEtappe(false)
  }
  const maakNieuweEtappe = (datum) => {
    datum.setHours(datum.getHours() + 12)

    setNieuweEtappe({ ...nieuweEtappe, startDatum: datum.toISOString().split('.')[0], eindDatum: datum.toISOString().split('.')[0] })
    setShowModalNieuweEtappe(true)
  }


  const bewaarNieuweEtappe = async () => {
    try {
      const response = await axiosPrivate.post(`${axiosUrls('PostMissieEtappe')}`, JSON.stringify(nieuweEtappe));

      setEtappes(etappes => [...etappes, response.data])
      setShowModalNieuweEtappe(false)
      console.log(etappes)
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <>
      {
        missiedagen.length ? (
          missiedagen.map((dag, index) => (
            <div key={index} className="ps-5">
              <Alert key={index} variant='light'>
                <Row>
                  <Col>
                    {index === 0 ? ('Algemeen') : DateToDDMMYYYY(dag)}
                    <span className="ms-3">
                      <Button variant="secondary" size="sm" onClick={() => { maakNieuweEtappe(dag) }}>
                        <FontAwesomeIcon icon={faCirclePlus} />
                      </Button>
                    </span>
                  </Col>
                  <Col className="text-end pe-3"> Totaal:&nbsp;
                    {
                      etappes
                        .filter(etappe => { return CompareDates(dag, etappe.startDatum) })
                        .reduce((n, { bedrag }) => n + bedrag, 0)
                        .toFixed(2)
                    }
                  </Col>
                </Row>
              </Alert>
              <ListGroup variant="flush" className="pb-4 ps-4">
                {
                  etappes.length ? (

                    etappes
                      .filter(etappe => { return CompareDates(dag, etappe.startDatum) })
                      .map(etappe => (

                        <ListGroup.Item key={etappe.id}>
                          <Row>
                            <Col>
                              {etappe.titel}
                            </Col>
                            <Col>
                              {etappe.locatie}
                            </Col>
                            <Col className="text-end pe-3">
                              {etappe.bedrag.toFixed(2)}
                            </Col>
                          </Row>
                        </ListGroup.Item>


                      ))
                  ) : ('Nog geen etappes')
                }
              </ListGroup>
              <hr />
            </div>
          ))
        ) : (
          <p>Nog geen etappes</p>
        )
      }

      <Modal show={showModalNieuweEtappe} onHide={handleCloseModalEtappe}>
        <Modal.Header closeButton>
          <Modal.Title>Deelnemer toevoegen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <Form.Group as={Row}>
              <Form.Label column md={3} sm={12}>Start</Form.Label>
              <Form.Control
                id="formstartDatum"
                type="datetime-local"
                onChange={(e) => { setNieuweEtappe({ ...nieuweEtappe, startDatum: e.target.value, eindDatum: e.target.value }) }}
                value={nieuweEtappe.startDatum}
              />
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column md={3} sm={12}>Einde</Form.Label>
              <Form.Control
                id="formEinddatum"
                type="datetime-local"
                onChange={(e) => { setNieuweEtappe({ ...nieuweEtappe, eindDatum: e.target.value }) }}
                value={nieuweEtappe.eindDatum}
              />
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column md={3} sm={12}>Omschrijving</Form.Label>
              <Form.Control
                id="formOmschrijving"
                type="text"
                onChange={(e) => { setNieuweEtappe({ ...nieuweEtappe, titel: e.target.value }) }}
                value={nieuweEtappe.titel}
              />
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column md={3} sm={12}>Kost</Form.Label>
              <Form.Control
                id="formBedrag"
                type="number"
                onChange={(e) => { setNieuweEtappe({ ...nieuweEtappe, bedrag: e.target.value }) }}
                value={nieuweEtappe.bedrag}
              />
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column md={3} sm={12}>Locatie</Form.Label>
              <Form.Control
                id="formLocatie"
                type="text"
                onChange={(e) => { setNieuweEtappe({ ...nieuweEtappe, locatie: e.target.value }) }}
                value={nieuweEtappe.locatie}
              />
            </Form.Group>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalEtappe}>
            Sluit
          </Button>
          <Button variant="success" onClick={bewaarNieuweEtappe}>
            Bewaar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default EtappeComponent