import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { useNavigate } from "react-router-dom"
import { axiosUrls } from "../../../api/axios"
import SuspenseParagraaf from "../../../components/SuspenseParagraaf"
import { Button, Card, Row, Col, CardGroup, Image, ListGroup, Modal, Form, FloatingLabel } from "react-bootstrap"
import { DateToDDMMYYYY, DateToYYYYMMDD, DatumVoorbij } from "../../../components/DatumFuncties"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {  useState } from "react"



const MissieOverzicht = () => {

    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate()
    const [toonModaal, setToonModaal] = useState(false)
const [toonFout,setToonFout] = useState(false)
const [fout, setFout] = useState('')
    const [nieuweMissie, setNieuweMissie] = useState({
        titel: '',
        omschrijving: '',
        startdatum: DateToYYYYMMDD(new Date()),
        einddatum: DateToYYYYMMDD(new Date()),
        locatie: ''
    })

    const { data: missions, isLoading, error, isError } = useQuery({
        queryFn: async () => {
            const response = await axiosPrivate.get(axiosUrls('GetOverzichtMissies'));
            console.log(response.data)
            return response.data
        },
        queryKey: ["MissieLijst"],
    })

    const { mutate: addMissie, isLoading: LoadUpdate } = useMutation({
        mutationFn: async (nieuwemissie) => {
            return axiosPrivate.post(axiosUrls('NieuweMissie'), nieuwemissie);
        },
        onError: (error)=>{
            setFout(error.message)
            setToonFout(true)
        },
        onSuccess: nieuw => {
            queryClient.setQueryData(["missiedetail", nieuw.data.id], nieuw.data)
            queryClient.invalidateQueries(["MissieLijst"])
            navigate({ pathname: ('/Missie/MissieDetail'), search: `missieid=${nieuw.data.id}` })
        }
    })
    const AnnuleerNieuweMissie = () => {
        console.log('nieuwe missie geannuleerd')
        setToonModaal(false)
    }
    const BewaarNieuweMissie = (e) => {
        e.preventDefault()
        const form = document.getElementById('formNieuweMissie');
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        console.log('nieuwe missie bewaren')
        addMissie(nieuweMissie)

    }
    return (
        isLoading || LoadUpdate ? (<SuspenseParagraaf />) :
            (
                <>
                    <main>
                        <h2>Mission List <Button variant="info" onClick={() => { setToonModaal(true) }}>Nieuw Missie</Button> </h2>
                        {isError? (
                            <p>{error.message}</p>
                        ):('')}
                        <Row xs={1} md={2} xl={3}>
                            {
                                missions?.map((mission) => {
                                    return (
                                        <Col key={mission.id}>
                                            <Card className="m-3" key={mission.id}>
                                                <Card.Header className="text-center">
                                                    <Image src="https://placehold.co/150x150" thumbnail />
                                                </Card.Header>
                                                <Card.Body>
                                                    <Card.Title>{mission.titel}</Card.Title>

                                                    <ListGroup variant="flush">
                                                        <ListGroup.Item>Startdatum: {DateToDDMMYYYY(mission.startDatum)}</ListGroup.Item>
                                                        <ListGroup.Item> Einddatum: {DateToDDMMYYYY(mission.eindDatum)}</ListGroup.Item>
                                                        <ListGroup.Item>Deelnemer: {mission.isDeelnemer ? <span className="text-success "><FaThumbsUp /></span> : <span className="text-danger"><FaThumbsDown /></span>}</ListGroup.Item>
                                                        <ListGroup.Item>Organisator: {mission.isOrganisator ? <span className="text-success "><FaThumbsUp /></span> : <span className="text-danger"><FaThumbsDown /></span>}</ListGroup.Item>
                                                    </ListGroup>
                                                </Card.Body>
                                                <Card.Footer>
                                                    {mission.isOrganisator || DatumVoorbij(mission.startDatum)? <Button variant='info' onClick={() => { navigate({ pathname: '/missie/missiedetail', search: `?missieid=${mission.id}` }) }}>Details</Button> : <Button variant='info' disabled>Details</Button>}
                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    )
                                })
                            }

                        </Row>
                    </main>
                    <Modal show={toonModaal} onHide={() => { setToonModaal(false) }}>
                        <Modal.Header closeButton>
                            <Modal.Title>Nieuwe missie aanmaken</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form className="pt-1" id="formNieuweMissie">
                                <Form.Group className="mb-3">
                                    <Form.Label>Titel</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="titel"
                                        autoComplete="off"
                                        value={nieuweMissie.titel}
                                        placeholder="Geef een titel"
                                        onChange={(e) => setNieuweMissie({ ...nieuweMissie, titel: e.target.value })}
                                        required
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Omschrijving</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="omschrijving"
                                        autoComplete="off"
                                        value={nieuweMissie.omschrijving}
                                        placeholder="Geef een korte omschrijving"
                                        onChange={(e) => setNieuweMissie({ ...nieuweMissie, omschrijving: e.target.value })}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Locatie</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="locatie"
                                        autoComplete="off"
                                        value={nieuweMissie.locatie}
                                        placeholder="Wat is de algemene locatie"
                                        onChange={(e) => setNieuweMissie({ ...nieuweMissie, locatie: e.target.value })}
                                    >

                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Startdatum</Form.Label>
                                    <Form.Control
                                        type="date"
                                        id="startdatum"
                                        autoComplete="off"
                                        value={nieuweMissie.startdatum}
                                        onChange={(e) => setNieuweMissie({ ...nieuweMissie, startdatum: e.target.value, einddatum: e.target.value })}
                                        required
                                    >

                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Einddatum</Form.Label>
                                    <Form.Control
                                        type="date"
                                        id="einddatum"
                                        autoComplete="off"
                                        value={nieuweMissie.einddatum}
                                        onChange={(e) => setNieuweMissie({ ...nieuweMissie, einddatum: e.target.value })}
                                        required
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <hr />
                                <Button variant="primary" type="button" onClick={BewaarNieuweMissie}>
                                    Bewaar
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </>
            )

    )

}
export default MissieOverzicht