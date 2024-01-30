import { Button, Col, InputGroup, Row } from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faTrashCan, faPlus, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import SuspenseParagraaf from '../../../components/SuspenseParagraaf'
import { axiosUrls } from '../../../api/axios'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { CheckCurrentUser } from './functies'


const Deelnemers = ({ users, setUsers, isOrganisator, setIsOrganisator,setIsDeelnemer, missieid,currentUser }) => {
  const axiosPrivate = useAxiosPrivate();
  const [saveEdits, setSaveEdits] = useState(false)
  const [showModalSelectDeelnemer, setShowModalSelectDeelnemer] = useState(false)
  const [showModalSelectOrganisator, setShowModalSelectOrganisator] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getMissieDeelnemers = async () => {

      try {
        const response = await axiosPrivate.get(`${axiosUrls('MissieDeelnemers')}?missieid=${missieid}`);
        console.log(response.data)
        setUsers(response.data)
        setIsLoading(false)
        
      } catch (err) {
        console.error(err);
      }
    }

    getMissieDeelnemers()
  }, [])

  useEffect(()=>{
    users.length && CheckCurrentUser(users, currentUser, setIsOrganisator, setIsDeelnemer)
  },[users])

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

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <>
      {
        isLoading ? (
          <SuspenseParagraaf />
        ) : (
          users?.length ? (
            <>
              <Row className="mb-3">
                <Col md={2} sm={12} >Organisatoren <Button variant="info"><FontAwesomeIcon icon={faPlus} onClick={() => { setShowModalSelectOrganisator(true) }} /></Button></Col>
                <Col md={8} sm={12}>
                  {
                    users.filter((u) => { if (u.isOrganisator) { return true } else { return false } }).map((u) => (
                      <Button key={u.id} variant="danger" className='me-2 mb-2' onClick={() => { ToggleOrganisator(u.id); setSaveEdits(true) }}>
                        <FontAwesomeIcon icon={faTrashCan} /> {u.volledigeNaam}
                      </Button>
                    ))
                  }
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={2} sm={12} >
                  Deelnemers
                  <Button variant="info"><FontAwesomeIcon icon={faPlus} onClick={() => setShowModalSelectDeelnemer(true)} /></Button>
                </Col>
                <Col md={8} sm={12}>
                  {

                    users.filter((u) => { if (!u.isOrganisator && u.isDeelnemer) { return true } else { return false } })
                      .map((u) => (

                        <Button
                          key={u.id}
                          variant="info"
                          className='me-2 mb-2'
                          onClick={() => { ToggleDeelnemer(u.id); setSaveEdits(true) }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} /> {u.volledigeNaam}
                        </Button>

                      ))
                  }
                </Col>
              </Row>

              {
                isOrganisator ? (
                  <Row>
                    <Col md={{ span: 3, offset: 2 }} xs={{ span: 6, offset: 3 }} className='d-grid'>
                      <Button variant="success" disabled={!saveEdits} onClick={handleSubmit}><FontAwesomeIcon icon={faFloppyDisk} /> Bewaar</Button>
                    </Col>
                  </Row>
                )
                  : ('')

              }
              <hr />
            </>
          )
            : (
              <p>'Geen deelnemers'</p>
            )
        )
      }

      <Modal show={showModalSelectDeelnemer} onHide={handleCloseSelectDeelnemer}>
        <Modal.Header closeButton>
          <Modal.Title>Deelnemer toevoegen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            users.length && users.map(user => (
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
            users.length && users.map(user => (
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

export default Deelnemers