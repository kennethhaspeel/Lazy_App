import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { axiosUrls } from '../../api/axios';
import { Form, Button, Col, Row, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { DateToYYYYMMDD, DatumVoorbij } from '../../components/DatumFuncties';

const TransactieToevoegen = () => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient()
    const [toonFoutmelding, setToonFoutmelding] = useState(false)
    const [foutmelding, setFoutmelding] = useState([])
    const [nieuweTransactie, setNieuweTransactie] = useState({
        datum: DateToYYYYMMDD(new Date()),
        bedrag: 0,
        mededeling: '',
        deelnemer: true,
        werkingskost: false,
        missieUitgave: false,
        appUserId: '0'
    })

    const {
        data: allUsers,
        isLoading: usersLoading,
        isError: usersError,
    } = useQuery({
        queryKey: ["allUsers"],
        queryFn: async () => {
            const response = await axiosPrivate.get(axiosUrls("GetAllUsers"));
            console.log(response.data)
            return response.data;
        },
    });
    const { mutate, isLoading } = useMutation({
        mutationFn: async (kost) => {
            console.log(kost)
            return axiosPrivate.post(axiosUrls("NieuweTransactie"), kost);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["spaarboekTransacties"]);
        },
    });

    const handleFormSubmit = (e) => {
        e.preventDefault()
        setToonFoutmelding(false)
        setFoutmelding([])
        let allesOK = true;
        if (!DatumVoorbij(nieuweTransactie.datum)) {
            setFoutmelding(foutmelding => [...foutmelding, "Een datum in de toekomst is niet mogelijk"])
            allesOK = false;
        }
        if (nieuweTransactie.deelnemer && nieuweTransactie.appUserId == '0') {
            allesOK = false;
            setFoutmelding(foutmelding => [...foutmelding, "U moet iemand selecteren"])
        }

        if (allesOK) {
            console.log(nieuweTransactie)
        }
mutate(nieuweTransactie)
    }

    useEffect(() => {
        if (foutmelding.length > 0) {
            setToonFoutmelding(true)
        }
    }, [foutmelding])


    return (
        <>
            <h4>Transactie toevoegen</h4>
            <Alert key='dangerAlert' variant='danger' hidden={!toonFoutmelding}>
                <ul>
                    {
                        foutmelding.map((m, i) => (
                            <li key={i}>{m}</li>
                        ))
                    }
                </ul>
            </Alert>
            <Row>
                <Col xs={12} lg={8}>
                    <Form onSubmit={handleFormSubmit} id="formNieuweTransactie" className='pt-1'>
                        <Form.Group className="mb-3">
                            <Form.Label>Datum</Form.Label>
                            <Form.Control
                                type="date"
                                id="startdatum"
                                autoComplete="off"
                                value={nieuweTransactie.datum}
                                onChange={(e) => {
                                    setNieuweTransactie({
                                        ...nieuweTransactie,
                                        datum: e.target.value
                                    });
                                    setToonFoutmelding(false)
                                }
                                }
                                required
                            ></Form.Control>
                        </Form.Group>
                        <hr />
                        <Form.Group className="mb-3">
                            <Row>
                                <Col xs={1} lg={1}>
                                    <Form.Check
                                        id="radioDeelnemer"
                                        type="radio"
                                        aria-label="deelnemer"
                                        onChange={() => {
                                            setNieuweTransactie({ ...nieuweTransactie, deelnemer: !nieuweTransactie.deelnemer, werkingskost: false, missieUitgave: false })
                                            setToonFoutmelding(false)
                                        }}
                                        checked={nieuweTransactie.deelnemer}
                                        name='typeKost'

                                    />
                                </Col>
                                <Col>
                                    <Form.Select aria-label="Selecteer persoon"
                                        onChange={(e) => {
                                            setNieuweTransactie({ ...nieuweTransactie, appUserId: e.target.value, })
                                            setToonFoutmelding(false)
                                        }
                                        }
                                        value={nieuweTransactie.appUserId}
                                        disabled={!nieuweTransactie.deelnemer}
                                    >
                                        <option value="0" key="00">Selecteer</option>
                                        {
                                            allUsers?.map((user) => (
                                                <option key={user.id} value={user.id}>{user.volledigeNaam}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Col>
                            </Row>


                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Row>
                                <Col xs={1} lg={1}>
                                    <Form.Check
                                        id="radioWerking"
                                        type="radio"
                                        aria-label="Werkingskost"
                                        onChange={() => {
                                            setNieuweTransactie({ ...nieuweTransactie, werkingskost: !nieuweTransactie.werkingskost, deelnemer: false, missieUitgave: false })
                                            setToonFoutmelding(false)
                                        }}
                                        checked={nieuweTransactie.werkingskost}
                                        name='typeKost'

                                    />
                                </Col>
                                <Col>
                                    Werkingskost
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Row>
                                <Col xs={1} lg={1}>
                                    <Form.Check
                                        id="radioUitgave"
                                        type="radio"
                                        aria-label="Missie Uitgave"
                                        onChange={() => {
                                            setNieuweTransactie({ ...nieuweTransactie, missieUitgave: !nieuweTransactie.missieUitgave, werkingskost: false, deelnemer: false })
                                            setToonFoutmelding(false)
                                        }}
                                        checked={nieuweTransactie.missieUitgave}
                                        name='typeKost'
                                    />
                                </Col>
                                <Col>
                                    Missie Uitgave
                                </Col>
                            </Row>
                        </Form.Group>
                        <hr />
                        <Form.Group className="mb-3">

                            <Form.Label>Bedrag</Form.Label>
                            <Form.Control
                                type="number"
                                id="bedrag"
                                autoComplete="off"
                                value={nieuweTransactie.bedrag}
                                onChange={(e) => {
                                    setNieuweTransactie({ ...nieuweTransactie, bedrag: e.target.value })
                                    setToonFoutmelding(false)
                                }}
                                min="0.01"
                                step="0.01"
                                required
                            ></Form.Control>
                        </Form.Group>
                        <hr />
                        <Form.Group className="mb-3">
                            <Form.Label>Titel</Form.Label>
                            <Form.Control
                                type="text"
                                id="titel"
                                autoComplete="off"
                                value={nieuweTransactie.mededeling}
                                placeholder="mededeling"
                                onChange={(e) => {
                                    setNieuweTransactie({ ...nieuweTransactie, mededeling: e.target.value })
                                    setToonFoutmelding(false)
                                }}

                            ></Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Bewaar
                        </Button>
                    </Form>
                </Col>
            </Row>

        </>
    )
}

export default TransactieToevoegen