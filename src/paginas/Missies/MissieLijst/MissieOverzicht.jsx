
import useSWR from "swr"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { useNavigate } from "react-router-dom"
import { axiosUrls } from "../../../api/axios"
import { Suspense } from "react"
import SuspenseParagraaf from "../../../components/SuspenseParagraaf"
import { Button, Card, Row, Col, CardGroup, Image, ListGroup } from "react-bootstrap"
import { DateToDDMMYYYY } from "../../../components/DatumFuncties"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "../../../components/ErrorFallback"

const MissieOverzicht = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate()

    const { data: missions, isLoading, isValidating } =
        useSWR('GetMissions', async () => { const response = await axiosPrivate.get(axiosUrls('GetOverzichtMissies')); return response.data }, {
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


    return (
        isLoading ? (<SuspenseParagraaf />) :
            (
                <main>
                    <h2>Mission List</h2>

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
            )

    )

}
export default MissieOverzicht