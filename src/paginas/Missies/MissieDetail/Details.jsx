import Form from 'react-bootstrap/Form'
import { Button, Col, InputGroup, Row } from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faTrashCan, faPlus, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { DateToYYYYMMDD } from '../../../components/DatumFuncties'
import { useEffect, useState } from 'react'
import { axiosUrls } from '../../../api/axios'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import SuspenseParagraaf from '../../../components/SuspenseParagraaf'

const DetailComponent = ({ missieid, missiedetail, setMissiedetail, isOrganisator }) => {
    const axiosPrivate = useAxiosPrivate();
    const [saveEdits, setSaveEdits] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getMissieDetails = async () => {
            try {
                const response = await axiosPrivate.get(`${axiosUrls('MissieDetails')}?missieid=${missieid}`);
                setMissiedetail(response.data)
                console.log(response.data)
                setIsLoading(false)
            } catch (err) {
                console.error(err);
            }
        }

        getMissieDetails()
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault()
    }
    return (
        <>
            {
                isLoading ? (<SuspenseParagraaf />) :
                    (
                        Object.keys(missiedetail).length ? (
                            <>
                                <form className='mb-4'>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column md={2} sm={12}>Titel</Form.Label>
                                        <Col md={6} sm={12}>
                                            <Form.Control
                                                id="formTitel"
                                                type="text"
                                                onChange={(e) => { setMissiedetail({ ...missiedetail, titel: e.target.value }); setSaveEdits(true) }}
                                                readOnly={isOrganisator ? false : true}
                                                value={missiedetail?.titel}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column md={2} sm={12}>Locatie</Form.Label>
                                        <Col md={6} sm={12}>
                                            <Form.Control
                                                id="formLocatie"
                                                type="text"
                                                onChange={(e) => { setMissiedetail({ ...missiedetail, locatie: e.target.value }); setSaveEdits(true) }}
                                                readOnly={isOrganisator ? false : true}
                                                value={missiedetail.locatie}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column md={2} sm={12}>Omschrijving</Form.Label>
                                        <Col md={6} sm={12}>
                                            <Form.Control as="textarea"
                                                id="formOmschrijving"
                                                rows={3}
                                                onChange={(e) => { setMissiedetail({ ...missiedetail, omschrijving: e.target.value }); setSaveEdits(true) }}
                                                readOnly={isOrganisator ? false : true}
                                                value={missiedetail.omschrijving}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column md={2} sm={12}>Startdatum</Form.Label>
                                        <Col md={6} sm={12}>

                                            <Form.Control
                                                id="formDatumStart"
                                                type="date"
                                                onChange={(e) => { setMissiedetail({ ...missiedetail, startDatum: e.target.value }); setSaveEdits(true) }}
                                                readOnly={isOrganisator ? false : true}
                                                value={DateToYYYYMMDD(missiedetail.startDatum)}
                                            />

                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column md={2} sm={12}>Einddatum</Form.Label>
                                        <Col md={6} sm={12}>
                                            <Form.Control
                                                id="formDatumEinde"
                                                type="date"
                                                onChange={(e) => { setMissiedetail({ ...missiedetail, eindDatum: e.target.value }); setSaveEdits(true) }}
                                                readOnly={isOrganisator ? false : true}
                                                value={DateToYYYYMMDD(missiedetail.eindDatum)}
                                            />
                                        </Col>
                                    </Form.Group>

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
                                </form>
                            </>
                        ) : (
                            <p>Geen details</p>
                        )
                    )
            }

        </>
    )
}

export default DetailComponent