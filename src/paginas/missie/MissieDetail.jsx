import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { axiosUrls } from '../../api/axios'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { format, parse, isValid } from 'date-fns'
import useAuth from "../../hooks/useAuth"
import { loader } from "react-global-loader"
import Form from 'react-bootstrap/Form'
import { Button, Col, InputGroup, Row } from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faTrashCan, faPlus, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { GetMissieDagen } from '../../components/DatumFuncties'

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
  const [showModalSelectDeelnemer, setShowModalSelectDeelnemer] = useState(false)
  const [showModalSelectOrganisator, setShowModalSelectOrganisator] = useState(false)

  const [missie, setMissie] = useState()
  const [isOrganisator, setIsOrganisator] = useState(false)
  const [isDeelnemer, setIsDeelnemer] = useState(false)

  const [titel, setTitel] = useState('')
  const [omschrijving, setOmschrijving] = useState('')
  const [locatie, setLocatie] = useState('')
  const [users, setUsers] = useState([])
  const [startdatum, setStartdatum] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [einddatum, setEinddatum] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [missiedagen, setMissiedagen] = useState([])
  const [saveEdits, setSaveEdits] = useState(false)

  useEffect(() => {

    //showLoader();
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        // const response = await axiosPrivate.get(`${axiosUrls('MissieDetail')}?missieid=${missieid}`, {
        //   signal: controller.signal
        // });
        // console.log(response.data)
        // setData(response.data);
        let response = {
          data:
          {
            "id": 2,
            "titel": "titel",
            "omschrijving": "omschrijving",
            "startDatum": "2024-05-01T02:00:00+02:00",
            "eindDatum": "2024-05-03T02:00:00+02:00",
            "locatie": "locatie",
            "publiekZichtbaar": false,
            "gebruikers": [
              {
                "id": "78d06532-bc64-48be-974b-d4f4642d195a",
                "volledigeNaam": "Bjorn Leleu",
                "isDeelnemer": false,
                "isOrganisator": false
              },
              {
                "id": "2bc823e6-ebec-452e-b9a1-df59b9b2f481",
                "volledigeNaam": "Fabrice Hoornaert",
                "isDeelnemer": false,
                "isOrganisator": false
              },
              {
                "id": "5c117577-ed57-412c-bc8d-a0c19be059d0",
                "volledigeNaam": "Kenneth Carrein",
                "isDeelnemer": false,
                "isOrganisator": false
              },
              {
                "id": "f25cd2b4-0a22-4b09-a172-1d6a810bedd5",
                "volledigeNaam": "Kenneth Haspeel",
                "isDeelnemer": true,
                "isOrganisator": true
              },
              {
                "id": "d60bbf2b-1e64-4e63-a602-afbe9a9b9778",
                "volledigeNaam": "Kim Leleu",
                "isDeelnemer": false,
                "isOrganisator": false
              },
              {
                "id": "99defbaa-3721-47bd-9261-90ec3af6285c",
                "volledigeNaam": "Kobe Cannière ",
                "isDeelnemer": false,
                "isOrganisator": false
              },
              {
                "id": "90ee2e65-27cb-4c50-a298-8b1f05c77fc2",
                "volledigeNaam": "Maxime Verpoort",
                "isDeelnemer": false,
                "isOrganisator": false
              },
              {
                "id": "b18e9086-1e50-4bff-ab46-b8851c125eba",
                "volledigeNaam": "Sam Six",
                "isDeelnemer": false,
                "isOrganisator": false
              },
              {
                "id": "e385b1ad-9fa0-4ccd-a27b-38c64b2d5a8e",
                "volledigeNaam": "Sven Masschelein",
                "isDeelnemer": false,
                "isOrganisator": false
              },
              {
                "id": "a4bb6cd3-f8ad-468f-bc18-37ca7b93c4f1",
                "volledigeNaam": "Test Account",
                "isDeelnemer": true,
                "isOrganisator": true
              },
              {
                "id": "db204a5b-d190-47f8-8a28-59a3238a27f3",
                "volledigeNaam": "Timothy Volcke",
                "isDeelnemer": false,
                "isOrganisator": false
              },
              {
                "id": "36b58803-dd18-4a15-947d-6c90320aeee1",
                "volledigeNaam": "jurgen Vandamme",
                "isDeelnemer": true,
                "isOrganisator": true
              }
            ]
          }

        }
        setMissiedagen(GetMissieDagen(response.data.startDatum,response.data.eindDatum))
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

  const ToggleOrganisator = (userid) => {
    const list = users.map(obj => {
      if (obj.id === userid) {
        return { ...obj, isOrganisator: !obj.isOrganisator }
      }
      return obj
    })
    setUsers(list)
    setSaveEdits(true)
  }

  const ToggleDeelnemer = (userid) => {
    const list = users.map(obj => {
      if (obj.id === userid) {
        return { ...obj, isDeelnemer: !obj.isDeelnemer }
      }
      return obj
    })
    setUsers(list)
    setSaveEdits(true)
  }

  const handleCloseSelectDeelnemer = () => {
    setShowModalSelectDeelnemer(false)
  }
  const handleCloseSelectOrganisator = () => {
    setShowModalSelectOrganisator(false)
  }
  return (
    <>
      <h2>Details Missie: {titel} <Button variant="success" disabled={!saveEdits}><FontAwesomeIcon icon={faFloppyDisk} /> Bewaar</Button></h2>
      {
        isOrganisator ? (
          <>
          <form onSubmit={handleSubmit} className='mb-4'>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={2} sm={12}>Titel</Form.Label>
              <Col md={6} sm={12}>
                <Form.Control
                  id="formTitel"
                  type="text"
                  onChange={(e) => { setTitel(e.target.value); setSaveEdits(true) }}
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
                  onChange={(e) => { setLocatie(e.target.value); setSaveEdits(true) }}
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
                  onChange={(e) => { setOmschrijving(e.target.value); setSaveEdits(true) }}
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
                  onChange={(e) => { setStartdatum(e.target.value); setSaveEdits(true) }}
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
                  onChange={(e) => { setEinddatum(e.target.value); setSaveEdits(true) }}
                  readOnly={isOrganisator ? false : true}
                  value={einddatum}
                />
              </Col>
            </Form.Group>
            <hr />
            <Row className="mb-3">
              <Col md={2} sm={12} >Organisatoren <Button variant="info"><FontAwesomeIcon icon={faPlus} onClick={() => { setShowModalSelectOrganisator(true) }} /></Button></Col>
              <Col md={8} sm={12}>
                {
                  users.filter((u)=>{if(u.isOrganisator){ return true} else { return false}}).map((u) => (

                      <>
                        <Button key={u.id} variant="danger" className='me-2 mb-2' onClick={() => { ToggleOrganisator(u.id) }}>
                          <FontAwesomeIcon icon={faTrashCan} /> {u.volledigeNaam}
                        </Button>
                      </>

                  ))
                }
              </Col>
            </Row>
            <hr />
            <Row className="mb-3">
              <Col md={2} sm={12} >
                Deelnemers <Button variant="info"><FontAwesomeIcon icon={faPlus} onClick={() => setShowModalSelectDeelnemer(true)} /></Button>
              </Col>
              <Col md={8} sm={12}>
                {
                  users.filter((u)=>{if(!u.isOrganisator && u.isDeelnemer){ return true} else { return false}})
                  .map((u) => (
                      <>
                        <Button
                          key={u.id}
                          variant="info"
                          className='me-2 mb-2'
                          onClick={() => { ToggleDeelnemer(u.id) }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} /> {u.volledigeNaam}
                        </Button>
                      </>
                  ))
                }
              </Col>
            </Row>
            <hr />
          </form>
<h3>Etappes</h3>
</>
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

      <Modal show={showModalSelectDeelnemer} onHide={handleCloseSelectDeelnemer}>
        <Modal.Header closeButton>
          <Modal.Title>Deelnemer toevoegen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            users.map(user => (
              !user.isDeelnemer ?
                (
                  <Row key={user.id}>
                    <Col className="d-grid gap-2 pb-2">
                      <Button variant="success" onClick={() => { ToggleDeelnemer(user.id) }}>
                        <FontAwesomeIcon icon={faSquarePlus} /> {user.volledigeNaam}
                      </Button>
                    </Col>
                  </Row>
                )
                : ('')
            ))
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSelectDeelnemer}>
            Sluit
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModalSelectOrganisator} onHide={handleCloseSelectOrganisator}>
        <Modal.Header closeButton>
          <Modal.Title>Deelnemer toevoegen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            users.map(user => (
              (!user.isOrganisator && user.isDeelnemer) ?
                (
                  <Row key={user.id}>
                    <Col className="d-grid gap-2 pb-2">
                      <Button variant="success" onClick={() => { ToggleOrganisator(user.id) }}>
                        <FontAwesomeIcon icon={faSquarePlus} /> {user.volledigeNaam}
                      </Button>
                    </Col>
                  </Row>
                )
                : ('')
            ))
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSelectOrganisator}>
            Sluit
          </Button>
        </Modal.Footer>
      </Modal>
    </>

  )
}

export default MissieDetail