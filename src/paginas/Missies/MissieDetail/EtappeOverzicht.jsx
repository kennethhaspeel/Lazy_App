import { useQuery,  } from '@tanstack/react-query'
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../../../components/ErrorFallback';
import { useState, useEffect } from 'react';
import { CompareDates, DateToDDMMYYYY, GetMissieDagen, DateToYYYYMMDDstring } from '../../../components/DatumFuncties';
import { Button, ButtonGroup, Col, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faImages, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const EtappeOverzicht = ({ missieId, startDatum, eindDatum, totaalKost, setTotaalKost }) => {
    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate();
    const [missiedata, setMissiedata] = useState([])

    let totaleKost = 0
    const { data: etappes, isLoading, isError } = useQuery({
        queryKey: ["missieetappes", missieId],
        queryFn: async () => {
            const response = await axiosPrivate.get(
                `${axiosUrls("GetMissieEtappes")}?missieid=${missieId}`
            );
            console.log(response.data)
            setMissiedata(GetMissieDagen(startDatum, eindDatum))
            return response.data;
        },
    })

    useEffect(() => {
        etappes?.map((e) => {
          return  totaleKost += e.kost
        })
        setTotaalKost(totaleKost.toFixed(2))
    }, [etappes])

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className='mb-3'>
                {
                    missiedata?.length ? (
                        missiedata?.map((dag, index) => {
                            return (
                                <div key={DateToDDMMYYYY(dag).toString()}>
                                    <ListGroup as="ul" className='pt-2 ps-4' key={`listgroup_${DateToDDMMYYYY(dag).toString()}`}>
                                        <ListGroup.Item as="li" variant='dark' key={'listgroupitem_0'}>
                                            {index == 0 ? 'Algemeen' : DateToDDMMYYYY(dag)}<Button variant="info" className='ms-3' onClick={() => {
                                                navigate({ pathname: ('/Missie/EtappeToevoegen'), search: `missieid=${missieId}&etappedatum=${DateToYYYYMMDDstring(dag)}` })
                                            }}>Toevoegen</Button>
                                        </ListGroup.Item>
                                        <ListGroup.Item key={'listgroupitem_01'} variant='secondary'>
                                            <Row>
                                                <Col xs={6} lg={4}  key={`listgroup_titel_${index}`}>Titel</Col>
                                                <Col xs={6} lg={2}  key={`listgroup_fotos_${index}`}className='text-center'>
                                                    Foto's
                                                </Col>
                                                <Col xs={6} lg={3}  key={`listgroup_financieel_${index}`}className='text-center'>
                                                    Financieel
                                                </Col>

                                                <Col xs={6} lg={3}  key={`listgroup_betaler_${index}`}>Betaler</Col>

                                            </Row>
                                        </ListGroup.Item>
                                         {
                                            etappes
                                                .filter((etappe) =>  CompareDates(dag, etappe.datumTijd)).length > 0 ? (
                                                etappes
                                                    .filter((etappe) => CompareDates(dag, etappe.datumTijd))
                                                    .map((et) => {
                                                        return (
                                                            <>
                                                                <ListGroup.Item key={`listgroupitem_${et.id.toString()}`}>
                                                                    <Row>
                                                                        <Col xs={6} lg={4} key={`col_titel_${et.id.toString()}`}>{et.titel}</Col>
                                                                        <Col xs={6} lg={2} key={`col_fotos_${et.id.toString()}`} className='text-center'>
                                                                            <ButtonGroup>
                                                                                <Button  key={`btn_aantalfotos_${et.id.toString()}`} variant={et.aantalEtappeFotos > 0 ? 'success' : 'outline-secondary'}><FontAwesomeIcon icon={faImages} />&nbsp;{et.aantalEtappeFotos}</Button>
                                                                                <Button key={`btn_bekijkfotos_${et.id.toString()}`} variant='success'><FontAwesomeIcon icon={faPlus} /></Button>
                                                                            </ButtonGroup>
                                                                        </Col>
                                                                        <Col xs={6} lg={3}  key={`col_kosten_${et.id.toString()}`} className='border-left'>
                                                                            <Row>
                                                                                <Col className='text-end pe-2'  key={`col_totalekost_${et.id.toString()}`}>
                                                                                    &euro; {et.kost.toFixed(2)} {() => { setTotaalKost(totaalKost + et.kost) }}
                                                                                </Col>
                                                                                <Col  key={`col_bewijsstuk_${et.id.toString()}`}>
                                                                                    <ButtonGroup>
                                                                                        <Button  key={`btn_aantalbewijsstukken_${et.id.toString()}`} variant={et.aantalKostBewijsstukken > 0 ? 'success' : 'outline-secondary'}><FontAwesomeIcon icon={faFile} />&nbsp;{et.aantalKostBewijsstukken}</Button>
                                                                                        <Button key={`btn_toonbewijsstukken_${et.id.toString()}`} variant='success'><FontAwesomeIcon icon={faPlus} /></Button>
                                                                                    </ButtonGroup>

                                                                                </Col>
                                                                            </Row>
                                                                        </Col>

                                                                        <Col  key={`col_betaler_${et.id.toString()}`} xs={6} lg={3}>{et.betaaldDoor}</Col>

                                                                    </Row>

                                                                </ListGroup.Item>
                                                            </>
                                                        )
                                                    })
                                            ) : (
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Nog geen etappes</Col>
                                                    </Row>
                                                </ListGroup.Item>

                                            )

                                        } 
                                    </ListGroup>
                                </div>
                            )
                        })

                    ) : (
                        <p>geen data gevonden</p>
                    )
                }
            </div>
        </ErrorBoundary>

    )
}

export default EtappeOverzicht