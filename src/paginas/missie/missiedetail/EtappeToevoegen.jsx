import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { axiosUrls } from '../../../api/axios'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import Form from 'react-bootstrap/Form'
import { Button, Col, InputGroup, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faTrashCan, faPlus, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { GetMissieDagen, DateToDDMMYYYY,HHMM_To_date } from '../../../components/DatumFuncties'

const EtappeToevoegen = () => {
    const [queryParam] = useSearchParams()
    const axiosPrivate = useAxiosPrivate();
    const missieid = queryParam.get("missie")
    const etappedatum = queryParam.get("etappedatum")
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [titel,setTitel] = useState('')
    const [locatie, setLocatie] = useState('')
    const [starttijd,setStarttijd]=useState('02:00')
    const [eindetijd,setEindetijd] = useState('04:00')
    const [allesInOrde, setAllesInOrde] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const controller = new AbortController();
        let datumStart = HHMM_To_date(etappedatum, starttijd)
        let datumEinde = HHMM_To_date(etappedatum, eindetijd)
        let data = {
            titel: titel,
            locatie: locatie,
            start: datumStart,
            einde: datumEinde,
            missied: missieid
        }
        const response = await axiosPrivate.post(`${axiosUrls('PostMissieEtappe')}`, data, {
            signal: controller.signal
        });
        console.log(response.data)
        return () => {
            controller.abort();
        }
    }

  return (
    <>
     <form onSubmit={handleSubmit} className='mb-4'>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={2} sm={12}>Titel</Form.Label>
            <Col md={6} sm={12}>
              <Form.Control
                id="formTitel"
                type="text"
                onChange={(e) => { setTitel(e.target.value) }}
                value={titel}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={2} sm={12}>Locatie</Form.Label>
            <Col md={6} sm={12}>
              <Form.Control
                id="formLocatie"
                type="text"
                onChange={(e) => { setLocatie(e.target.value) }}
                value={locatie}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={2} sm={12}>Tijd Start</Form.Label>
            <Col md={6} sm={12}>

              <Form.Control
                id="formDatumStart"
                type="time"
                onChange={(e) => { setStarttijd(e.target.value)}}
                value={starttijd}
              />

            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={2} sm={12}>Tijd einde</Form.Label>
            <Col md={6} sm={12}>
              <Form.Control
                id="formDatumEinde"
                type="time"
                onChange={(e) => { setEindetijd(e.target.value)}}
                value={eindetijd}
              />
            </Col>
          </Form.Group>
          <hr />
          <Button variant="success" type="submit"><FontAwesomeIcon icon={faFloppyDisk} /> Bewaar</Button>
          <hr />
        </form>
    </>
  )
}

export default EtappeToevoegen