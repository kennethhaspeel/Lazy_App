import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { useNavigate } from "react-router-dom"
import { axiosUrls } from "../../../api/axios"
import SuspenseParagraaf from "../../../components/SuspenseParagraaf"
import { Button, Card, Row, Col, CardGroup, Image, ListGroup ,Modal} from "react-bootstrap"
import { DateToDDMMYYYY } from "../../../components/DatumFuncties"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"


const MissieOverzicht = () => {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate()
    const { toonModaal, setToonModaal } = useState(false)

    const { data: missions, isLoading } = useQuery({
        queryFn: async () => {
            const response = await axiosPrivate.get(axiosUrls('GetOverzichtMissies')); return response.data
        },
        queryKey: ["MissieLijst"],
    })

    const { mutateAsync: addMissie, isLoading: LoadUpdate } = useMutation({
        mutationFn: async () => {
            console.log("gelukt")
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["MissieLijst"])
        }
    })
    const handleClose = () => setToonModaal(false);
    const handleShow = () => setToonModaal(true);
    return (
        isLoading || LoadUpdate ? (<SuspenseParagraaf />) :
            (
                <>
                    <main>
                        <h2>Mission List <Button variant="info" onClick={handleShow}>Nieuwe Missie</Button> </h2>
                        <CardGroup>
                            {
                                missions?.map((mission) => {
                                    return (
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
                                                {mission.isOrganisator ? <Button variant='info' onClick={() => { navigate({ pathname: '/missie/missiedetail', search: `?missieid=${mission.id}` }) }}>Details</Button> : <Button variant='info' disabled>Details</Button>}
                                            </Card.Footer>
                                        </Card>
                                    )
                                })
                            }
                        </CardGroup>

                    </main>
                    <Modal show={toonModaal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )

    )

}
export default MissieOverzicht