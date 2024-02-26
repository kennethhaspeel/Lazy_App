
import useSWR from "swr"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { axiosUrls } from "../../../api/axios"
import { Suspense } from "react"
import SuspenseParagraaf from "../../../components/SuspenseParagraaf"
import { Button, Card, Row, Col, CardGroup, Image, ListGroup } from "react-bootstrap"
import { DateToDDMMYYYY } from "../../../components/DatumFuncties"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"

const MissieOverzicht = () => {
    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate();
    const { data: missions, isLoading, error, isValidating } =
        useSWR('GetMissions', async () => { const response = await axiosPrivate(axiosUrls('GetOverzichtMissies')); return response.data }, {
            onSuccess(data, key, config) {
                console.log(data)
            },
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                console.log(missions)
                if (error.status === 404) return
                if (retryCount >= 3) return

                revalidate({ retryCount })
            }

        })


    let content
    if (isLoading || isValidating) { content = <p>Loading</p> }
    if (error) { content = <p>{error.message}</p> }
    content = missions?.map((mission) => {
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
                            <ListGroup.Item>Organisatyor: {mission.isOrganisator ? <span className="text-success "><FaThumbsUp /></span> : <span className="text-danger"><FaThumbsDown /></span>}</ListGroup.Item>
                        </ListGroup>
                </Card.Body>
                <Card.Footer>
                    {mission.isOrganisator ? <Button variant='info' onClick={()=>{navigate({pathname: '/missie/missiedetail', search: `?missieid=${mission.id}`})}}>Details</Button> : <Button variant='info' disabled>Details</Button>}
                </Card.Footer>
            </Card>
        )
    })



    return (
        <main>
            <h2>Mission List</h2>
            <CardGroup>
                {content}
            </CardGroup>

        </main>
    )

}
//<ListGroup.Item key={mission.id}>{mission.titel}</ListGroup.Item>
export default MissieOverzicht