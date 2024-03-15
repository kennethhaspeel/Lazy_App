import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { axiosUrls } from '../../../api/axios'
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faTrashCan, faPlus, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import SuspenseParagraaf from '../../../components/SuspenseParagraaf'
import { Row, Col, Button } from 'react-bootstrap'


const Deelnemers = ({ missieid, currentUser, isOrganisator, setIsOrganisator, isDeelnemer, setIsDeelnemer }) => {
    const axiosPrivate = useAxiosPrivate()
    console.log(missieid)
    const { data: missiedeelnemers, isLoading: DeelnemersLoading, isError: DeelnemersError } = useQuery({
        queryKey: ["missiedeelnemers", missieid],
        queryFn: async () => {
            const url = `${axiosUrls("MissieDeelnemers")}/${missieid}`
            const response = await axiosPrivate.get(url)
            console.log(response.data)
            checkOrganisator(response.data)
            return response.data
        }
    })

    const checkOrganisator = (users) => {
        users.forEach(u => {
            if (currentUser.id === u.id) {
                setIsOrganisator(u.isOrganisator)
                setIsDeelnemer(u.isDeelnemer)
                return
            }
            return
        })
    }
    if (DeelnemersError) return <h1>{JSON.stringify(DeelnemersError)}</h1>
    if (DeelnemersLoading) return <SuspenseParagraaf />
    return (
        <>
            {
                missiedeelnemers?.length ? (
                    <>
                        <Row className="mb-3">
                            <Col md={2} sm={12} >Organisatoren
                                {isOrganisator ? (<Button variant="info"><FontAwesomeIcon icon={faPlus} /></Button>) : ''}
                            </Col>
                            <Col md={8} sm={12}>
                                {
                                    missiedeelnemers.filter((u) => { if (u.isOrganisator) { return true } else { return false } }).map((u) => (
                                        isOrganisator ? (
                                            <Button key={u.id} variant="info" className='me-2 mb-2'>
                                                <FontAwesomeIcon icon={faTrashCan} /> {u.volledigeNaam}
                                            </Button>
                                        ) : (
                                            <Button key={u.id} variant="info" className='me-2 mb-2' disabled>
                                                {u.volledigeNaam}
                                            </Button>
                                        )

                                    ))
                                }
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={10} sm={12} >
                                Deelnemers
                                {isOrganisator ? (<Button variant="info"><FontAwesomeIcon icon={faPlus} /></Button>) : ''}
                            </Col>
                            <Col md={10} sm={12}>
                                {

                                    missiedeelnemers.filter((u) => { if (!u.isOrganisator && u.isDeelnemer) { return true } else { return false } })
                                        .map((u) => (
                                            !isOrganisator ? (
                                                <Button
                                                    key={u.id}
                                                    variant="info"
                                                    className='me-2 mb-2'
                                                //onClick={() => { ToggleDeelnemer(u.id); setSaveEdits(true) }}
                                                >
                                                    <FontAwesomeIcon icon={faTrashCan} /> {u.volledigeNaam}
                                                </Button>
                                            ) : (
                                                <Button
                                                    key={u.id}
                                                    variant="info"
                                                    className='me-2 mb-2'
                                                    disabled
                                                //onClick={() => { ToggleDeelnemer(u.id); setSaveEdits(true) }}
                                                >
                                                    {u.volledigeNaam}
                                                </Button>
                                            )


                                        ))
                                }
                            </Col>
                        </Row>
                        {
                            !isDeelnemer ? (
                                <Row>
                                    <Col md={{ span: 8, offset: 2 }} sm={12}>
                                        <Button variant="success">Ik doe mee</Button>
                                    </Col>
                                </Row>

                            ) : ('')
                        }
                        <hr />
                    </>
                )
                    : (
                        <p>'Geen deelnemers'</p>
                    )

            }
        </>
    )
}

export default Deelnemers