import { useState, useEffect } from 'react'
import { axiosUrls } from '../../api/axios'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Alert, Col, Row, Spinner } from 'react-bootstrap'
import { format } from 'date-fns'

const TransactieToevoegen = () => {
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState('')
    const [bedrag, setBedrag] = useState(0)
    const [datum, setDatum] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [mededeling, setMededeling] = useState('')
    const [werkingkost, setWerkingkost] = useState(false)
    const [allesInOrde, setAllesInOrde] = useState(true)
    const [foutmelding, setFoutmelding] = useState([])
    const [allesBewaard, setAllesBewaard] = useState(false)
    useEffect(() => {
        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(`${axiosUrls('GetAllUsers')}`, {
                    signal: controller.signal
                });
                console.log(response.data)
                setUsers(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setIsLoading(false);
            }
        }
        getUsers();
        return () => {
            controller.abort();
        }
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault()
        setAllesInOrde(true);
        setFoutmelding([])
        console.log(werkingkost, selectedUser)
        if ((!werkingkost && selectedUser.length == 0) || (werkingkost && selectedUser.length > 0)) {
            setFoutmelding(foutmelding => [...foutmelding, "Selecteer ofwel een persoon ofwel werkingskost"])
            setAllesInOrde(false)
        }
        if (bedrag == 0) {
            setFoutmelding(foutmelding => [...foutmelding, "Een bedrag van 0 euro zou beetje belachelijk zijn"])
            setAllesInOrde(false)
        }

        if (allesInOrde) {
            setIsLoading(true)
            let data = JSON.stringify({ AppUserId: selectedUser, bedrag, datum, werkingkost, mededeling, voldaan: true })
            const controller = new AbortController();
            const bewaarTransactie = async () => {
                try {
                    const response = await axiosPrivate.post(`${axiosUrls('NieuweTransactie')}`, data, {
                        signal: controller.signal
                    });
                    console.log(response.data)
                    setAllesBewaard(true)
                    setIsLoading(false);
                } catch (err) {
                    console.error(err);
                    setIsLoading(false);
                }

            }
            bewaarTransactie();
            return () => {
      
                controller.abort();
              }
        }
    }
    useEffect(() => {
        setSelectedUser('');
        setBedrag(0)
        setDatum(format(new Date(), 'yyyy-MM-dd'))
        setWerkingkost(false)
        setMededeling('')
    }, [allesBewaard])

    const toggleWerkingkost = () => {
        setWerkingkost(prev => !prev);
    }
    return (
        <>
            <span>
                {
                    isLoading ?
                        (
                            <Alert variant='light'>
                                Even geduld ... <Spinner animation="border" variant="primary" />
                            </Alert>
                        )
                        :
                        ('')
                }
            </span>
            <span>
                {allesBewaard ?
                    (
                        <Alert variant='success'>
                            <p>Deze tranactie werd bewaard...</p>
                        </Alert>
                    )
                    :
                    ('')
                }
            </span>
            <span>
                {
                    !allesInOrde ? (
                        <Alert variant='danger'>
                            <ul>
                                {
                                    foutmelding.map((m, i) => (
                                        <li key={i}>{m}</li>
                                    ))
                                }
                            </ul>
                        </Alert>
                    )
                        : ('')
                }
            </span>
            <Row>
                <Col xs={12} md={6}>
                    <h2>Transactie Toevoegen</h2>
                    <form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>Selecteer</Form.Label>
                            <Form.Select aria-label="Selecteer persoon"
                                onChange={(e) => setSelectedUser(e.target.value)}
                                value={selectedUser}
                            >
                                <option>Selecteer</option>
                                {
                                    users.map((user) => (
                                        <option key={user.id} value={user.id}>{user.volledigeNaam}</option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bedrag</Form.Label>
                            <Form.Control
                                id="formBedrag"
                                type="number"
                                onChange={(e) => setBedrag(e.target.value)}
                                value={bedrag}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Datum</Form.Label>
                            <Form.Control
                                id="formDatum"
                                type="date"
                                onChange={(e) => setDatum(e.target.value)}
                                value={datum}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                id="formWerking"
                                type="checkbox"
                                label="Werkingskost"
                                onChange={toggleWerkingkost}
                                checked={werkingkost}

                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mededeling</Form.Label>
                            <Form.Control as="textarea"
                                id="formMededeling"
                                rows={3}
                                onChange={(e) => setMededeling(e.target.value)}
                                value={mededeling}
                            />
                        </Form.Group>

                        <hr />
                        <Button variant="primary" type="submit">
                            Verstuur
                        </Button>
                    </form>
                </Col>
            </Row>
        </>

    )
}

export default TransactieToevoegen