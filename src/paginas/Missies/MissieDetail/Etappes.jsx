import { GetMissieDagen, DateToDDMMYYYY, CompareDates } from "../../../components/DatumFuncties"
import { useState, useEffect } from "react"
import { axiosUrls } from '../../../api/axios'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Alert, Col, ListGroup, Row } from "react-bootstrap"

const EtappeComponent = ({ etappes, setEtappes, isOrganisator, missiedetail, missieid }) => {
  const axiosPrivate = useAxiosPrivate();
  const [missiedagen, setMissiedagen] = useState([])
  const [nieuweEtappe, setNieuweEtappe] = useState({})
  const [isLoading, setIsLoading] = useState(true)


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
    console.log(missiedagen)
  }, [missiedetail])





  return (
    <>
      {
        missiedagen.length ? (
          missiedagen.map((dag, index) => (
            <div key={index} className="ps-5">
              <Alert key={index} variant='light'>
                {index === 0 ? ('Algemeen') : DateToDDMMYYYY(dag)}
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
                              {Math.floor(etappe.bedrag).toFixed(2)}
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
    </>
  )
}

export default EtappeComponent