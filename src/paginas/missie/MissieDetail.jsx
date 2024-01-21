import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { axiosUrls } from '../../api/axios'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { format, parse, isValid } from 'date-fns'
import useAuth from "../../hooks/useAuth"
import { loader } from "react-global-loader"
import Form from 'react-bootstrap/Form'
import { Button, Col, InputGroup, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk,faTrashCan,faPlus } from '@fortawesome/free-solid-svg-icons'

const MissieDetail = () => {
  const showLoader = () => {
    loader.show();
  };

  const hideLoader = () => {
    loader.hide();
  };
  const [queryParam] = useSearchParams()
  const missieid = queryParam.get("missieid")
  const { auth } = useAuth()
  const currentUser = auth?.user
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(true)
  const [allesInOrde, setAllesInOrde] = useState(true)
  const [foutmelding, setFoutmelding] = useState([])
  const [allesBewaard, setAllesBewaard] = useState(false)

  const [missie, setMissie] = useState()
  const [isOrganisator, setIsOrganisator] = useState(false)
  const [isDeelnemer, setIsDeelnemer] = useState(false)

  const [titel, setTitel] = useState('')
  const [omschrijving, setOmschrijving] = useState('')
  const [locatie, setLocatie] = useState('')
  const [users, setUsers] = useState([])
  const [startdatum, setStartdatum] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [einddatum, setEinddatum] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [saveEdits,setSaveEdits] = useState(false)

  useEffect(() => {

    //showLoader();
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(`${axiosUrls('MissieDetail')}?missieid=${missieid}`, {
          signal: controller.signal
        });
        console.log(response.data)
        //setData(response.data);
        setTitel(response.data.titel)
        setOmschrijving(response.data.omschrijving)
        setStartdatum(format(response.data.startDatum, 'yyyy-MM-dd'))
        setEinddatum(format(response.data.eindDatum, 'yyyy-MM-dd'))
        setLocatie(response.data.locatie)
        setUsers(response.data.gebruikers)
        response.data.gebruikers.forEach(u => {
          if (currentUser.id === u.id) {       
            setIsOrganisator(u.isOrganisator)
            setIsDeelnemer(u.isDeelnemer)
            return
          }
          return
        })
        hideLoader()
      } catch (err) {
        console.error(err);
        hideLoader()
      }
    }
    getUsers();
    return () => {
      hideLoader()
      controller.abort();
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const ToggleOrganisator = (userid)=>{
    const list = users.map(obj => {
      if (obj.id === userid) {
          return { ...obj, isOrganisator: !obj.isOrganisator }
      }
      return obj
  })
  setUsers(list)
  }

  const ToggleDeelnemer = (userid)=>{
    const list = users.map(obj => {
      if (obj.id === userid) {
          return { ...obj, isDeelnemer: !obj.isDeelnemer }
      }
      return obj
  })
  setUsers(list)
  }
  return (
    <>
      <h2>Details Missie: {titel}</h2>
      {
        isOrganisator ? (
          <form onSubmit={handleSubmit} className='mb-4'>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={2} sm={12}>Titel</Form.Label>
              <Col md={6} sm={12}>
                <Form.Control
                  id="formTitel"
                  type="text"
                  onChange={(e) => {setTitel(e.target.value);setSaveEdits(true)}}
                  readOnly={isOrganisator ? false : true}
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
                  onChange={(e) => {setLocatie(e.target.value);setSaveEdits(true)}}
                  readOnly={isOrganisator ? false : true}
                  value={locatie}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={2} sm={12}>Omschrijving</Form.Label>
              <Col md={6} sm={12}>
                <Form.Control as="textarea"
                  id="formOmschrijving"
                  rows={3}
                  onChange={(e) => {setOmschrijving(e.target.value);setSaveEdits(true)}}
                  readOnly={isOrganisator ? false : true}
                  value={omschrijving}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={2} sm={12}>Startdatum</Form.Label>
              <Col md={6} sm={12}>

                <Form.Control
                  id="formDatumStart"
                  type="date"
                  onChange={(e) => {setStartdatum(e.target.value);setSaveEdits(true)}}
                  readOnly={isOrganisator ? false : true}
                  value={startdatum}
                />

              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={2} sm={12}>Einddatum</Form.Label>
              <Col md={6} sm={12}>

                <Form.Control
                  id="formDatumEinde"
                  type="date"
                  onChange={(e) => {setEinddatum(e.target.value);setSaveEdits(true)}}
                  readOnly={isOrganisator ? false : true}
                  value={einddatum}
                />

              </Col>
            </Form.Group>
            <hr/>
            <Row className="mb-3">
              <Col md={2} sm={12} >Organisatoren <Button variant="info"><FontAwesomeIcon icon={faPlus} /></Button></Col>
              <Col md={8} sm={12}>
                {
                  users.map((u) => (
                    u.isOrganisator ? (
                      <>
                        <Button 
                        key={u.id}
                        variant="danger" 
                        className='me-2 mb-2'
                        onClick={()=>{ToggleOrganisator(u.id)}}
                        >
                        <FontAwesomeIcon icon={faTrashCan} /> {u.volledigeNaam}
                        </Button>
                      </>
                    ) : ('')
                  ))
                }
              </Col>
            </Row>
            <hr/>
            <Row className="mb-3">
              <Col md={2} sm={12} >
                  Deelnemers <Button variant="info"><FontAwesomeIcon icon={faPlus} /></Button>
                </Col>
              <Col md={8} sm={12}>
                {
                  users.map((u) => (

                    (u.isDeelnemer && !u.isOrganisator) ? (
                      <>
                        <Button 
                        key={u.id}
                        variant="info" 
                        className='me-2 mb-2'
                        onClick={()=>{ToggleDeelnemer(u.id)}}
                        >
                        <FontAwesomeIcon icon={faTrashCan} /> {u.volledigeNaam}
                        </Button>
                      </>
                    ) : ('')
                  ))
                }
              </Col>
            </Row>
            <hr/>
            <Row className='pt-1'>
              <Col md={{ span: 2, offset: 2 }} sm={{ span: 6, offset: 3 }}>
                <div className="d-grid gap-2">
                  <Button 
                  variant="success" 
                  disabled={!saveEdits}><FontAwesomeIcon icon={faFloppyDisk} /> Bewaar</Button>
                </div>
              </Col>

            </Row>
            <hr />

          </form>

        ) : (
          <form onSubmit={handleSubmit} className='mb-4'>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={2} sm={12}>Titel</Form.Label>
              <Col md={6} sm={12}>
                <Form.Control
                  id="formTitel"
                  type="text"
                  onChange={(e) => setTitel(e.target.value)}
                  readOnly={isOrganisator ? false : true}
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
                  onChange={(e) => setLocatie(e.target.value)}
                  readOnly={isOrganisator ? false : true}
                  value={locatie}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={2} sm={12}>Omschrijving</Form.Label>
              <Col md={6} sm={12}>
                <Form.Control as="textarea"
                  id="formOmschrijving"
                  rows={3}
                  onChange={(e) => setOmschrijving(e.target.value)}
                  readOnly={isOrganisator ? false : true}
                  value={omschrijving}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={2} sm={12}>Startdatum</Form.Label>
              <Col md={6} sm={12}>
                <Form.Control
                  id="formDatumStart"
                  type="date"
                  onChange={(e) => setStartdatum(e.target.value)}
                  readOnly={isOrganisator ? false : true}
                  value={startdatum}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={2} sm={12}>Einddatum</Form.Label>
              <Col md={6} sm={12}>
                <Form.Control
                  id="formDatumEinde"
                  type="date"
                  onChange={(e) => setEinddatum(e.target.value)}
                  readOnly={isOrganisator ? false : true}
                  value={einddatum}
                />
              </Col>
            </Form.Group>

            <hr />

          </form>
        )
      }

    </>

  )
}

export default MissieDetail