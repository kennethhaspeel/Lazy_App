import { axiosUrls } from '../../../api/axios'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Modal } from 'react-bootstrap'
import useSWR from "swr"
import { Row, Col, Button } from 'react-bootstrap'
import { FaTrash, FaPlus, FaFloppyDisk,FaRegSquarePlus  } from 'react-icons/fa6'
import SuspenseParagraaf from '../../../components/SuspenseParagraaf'
import { CheckCurrentUser } from '../__MissieDetail/functies'
import { useEffect, useState } from 'react'

const Deelnemers = ({ setUsers, isOrganisator, setIsOrganisator, setIsDeelnemer, missieid, currentUser }) => {

    const axiosPrivate = useAxiosPrivate();
    const [saveEdits, setSaveEdits] = useState(false)
    const [showModalSelectDeelnemer, setShowModalSelectDeelnemer] = useState(false)
    const [showModalSelectOrganisator, setShowModalSelectOrganisator] = useState(false)

    const { data: users, isLoading, isValidating,mutate } =
        useSWR(`MissieDeelnemers_${missieid}`, async () => { const response = await axiosPrivate.get(`${axiosUrls('MissieDeelnemers')}/${missieid}`); return response.data }, {
            revalidateOnFocus: false,
            onSuccess(data, key, config) {
                console.log(data)
            },
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                if (error.status === 404) return
                if (retryCount >= 3) return
                revalidate({ retryCount })
            }
        })

    useEffect(() => {
        users?.length && CheckCurrentUser(users, currentUser, setIsOrganisator, setIsDeelnemer)
    }, [users])

    const ToggleOrganisator = async (userid) => {
      
        const list = users.map(obj => {
            if (obj.id === userid) {
                return { ...obj, isOrganisator: !obj.isOrganisator }
            }
            return obj
        })
        setSaveEdits(true)
    }

    const ToggleDeelnemer = (userid) => {
        const list = users.map(obj => {
            if (obj.id === userid) {
                return { ...obj, isDeelnemer: !obj.isDeelnemer }
            }
            return obj
        })
        mutate(list)
        console.log(list)
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
                isLoading || isValidating ? (<SuspenseParagraaf />) :
                    (
                        users?.length ? (
                            <>
                                <Row className="mb-3">
                                    <Col md={2} sm={12} >Organisatoren <Button variant="info" onClick={() => { setShowModalSelectOrganisator(true) }} ><FaPlus /></Button></Col>
                                    <Col md={8} sm={12}>
                                        {
                                            users.filter((u) => { if (u.isOrganisator) { return true } else { return false } }).map((u) => (
                                                <Button key={u.id} variant="danger" className='me-2 mb-2' onClick={() => { ToggleOrganisator(u.id); setSaveEdits(true) }}>
                                                    <FaTrash /> {u.volledigeNaam}
                                                </Button>
                                            ))
                                        }
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={2} sm={12} >
                                        Deelnemers
                                        <Button variant="info" onClick={() => setShowModalSelectDeelnemer(true)} ><FaPlus /></Button>
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
                                                        <FaTrash /> {u.volledigeNaam}
                                                    </Button>

                                                ))
                                        }
                                    </Col>
                                </Row>

  
                                <hr />
                            </>
                        ) : ('')
                    )
            }

<Modal show={showModalSelectDeelnemer} onHide={handleCloseSelectDeelnemer}>
        <Modal.Header closeButton>
          <Modal.Title>Deelnemer toevoegen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            users?.length && users.map(user => (
              !user.isDeelnemer ?
                (
                  <Row key={user.id}>
                    <Col className="d-grid gap-2 pb-2">
                      <Button variant="success" onClick={() => { ToggleDeelnemer(user.id) }}>
                      <FaRegSquarePlus/>  {user.volledigeNaam}
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
            users?.length && users.map(user => (
              (!user.isOrganisator && user.isDeelnemer) ?
                (
                  <Row key={user.id}>
                    <Col className="d-grid gap-2 pb-2">
                      <Button variant="success" onClick={() => { ToggleOrganisator(user.id) }}>
                        <FaRegSquarePlus/> {user.volledigeNaam}
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