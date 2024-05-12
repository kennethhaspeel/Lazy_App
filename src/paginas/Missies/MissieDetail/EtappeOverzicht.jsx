import { useQuery, } from '@tanstack/react-query'
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../../../components/ErrorFallback';
import { useState, useEffect } from 'react';
import { CompareDates, DateToDDMMYYYY, GetMissieDagen, DateToYYYYMMDDstring } from '../../../components/DatumFuncties';
import { Accordion, Button, ButtonGroup, Col, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faImages, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect'
import SuspenseParagraaf from '../../../components/SuspenseParagraaf';

const EtappeOverzicht = ({ missieId, startDatum, eindDatum, totaalKost, setTotaalKost, missieAfgesloten }) => {
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
        etappes?.map(e =>  totaleKost += e.kost)
        setTotaalKost(totaleKost.toFixed(2))
    }, [etappes])

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            {!isMobile ? (
                missiedata?.length ? (
                    missiedata?.map((dag, index) =>
                         
                            <div key={DateToDDMMYYYY(dag).toString()}>
                                <ListGroup as="ul" className='pb-2' key={`listgroup_${DateToDDMMYYYY(dag).toString()}`}>
                                    <ListGroup.Item as="li" variant='dark' key={'listgroupitem_0'}>
                                        {index == 0 ? 'Algemeen' : DateToDDMMYYYY(dag)}
                                        {!missieAfgesloten ? (
                                            <Button variant="info" className='ms-3' disabled={missieAfgesloten} onClick={() => { navigate({ pathname: ('/Missie/EtappeToevoegen'), search: `missieid=${missieId}&etappedatum=${DateToYYYYMMDDstring(dag)}` }) }}>
                                                Toevoegen
                                            </Button>
                                        ) : ('')}
                                    </ListGroup.Item>
                                    </ListGroup>
                                    <Accordion className='pb-2' defaultActiveKey="0" border="primary">
                                    {
                                        etappes
                                            .filter((etappe) => CompareDates(dag, etappe.datumTijd)).length > 0 ? (
                                            etappes
                                                .filter((etappe) => CompareDates(dag, etappe.datumTijd))
                                                .map((et, indexEt) => 
                                                        <>
                                                            <Accordion.Item eventKey={indexEt} className='pb-1 pt-1 border-1 border-dark'>
                                                                <Accordion.Header>
                                                                    <span style={{ width: '65%' }}>
                                                                        {et.titel}
                                                                    </span>

                                                                    <span className='text-end pe-1' style={{ width: '35%' }}>
                                                                        &euro; {et.kost.toFixed(2)} {() => { setTotaalKost(totaalKost + et.kost) }}
                                                                    </span>
                                                                </Accordion.Header>
                                                                <Accordion.Body className='bg-secondary  bg-opacity-25'>
                                                                    <Row>
                                                                        <Col xs={6}>
                                                                            Foto's
                                                                        </Col>
                                                                        <Col xs={6}>
                                                                            <ButtonGroup style={{width: '100%'}}>
                                                                                <Button key={`btn_aantalfotos_${et.id.toString()}`} variant={et.aantalEtappeFotos > 0 ? 'success' : 'outline-secondary'}><FontAwesomeIcon icon={faImages} />&nbsp;{et.aantalEtappeFotos}</Button>
                                                                                <Button key={`btn_bekijkfotos_${et.id.toString()}`} variant='success'><FontAwesomeIcon icon={faPlus} /></Button>
                                                                            </ButtonGroup>
                                                                        </Col>
                                                                    </Row>
                                                                    <hr/>
                                                                     <Row>
                                                                        <Col>
                                                                            Betaald door&nbsp; <strong>{et.betaaldDoor}</strong> 
                                                                        </Col>
                                                                       
                                                                    </Row>                                                                   
                                                                    <Row className='pt-1 pb-1'>
                                                                        <Col xs={6}>
                                                                            Bewijsstukken
                                                                        </Col>
                                                                        <Col xs={6}>
                                                                            <ButtonGroup  style={{width: '100%'}}>
                                                                                <Button key={`btn_aantalbewijsstukken_${et.id.toString()}`} variant={et.aantalKostBewijsstukken > 0 ? 'success' : 'outline-secondary'}><FontAwesomeIcon icon={faFile} />&nbsp;{et.aantalKostBewijsstukken}</Button>
                                                                                <Button key={`btn_toonbewijsstukken_${et.id.toString()}`} variant='success'><FontAwesomeIcon icon={faPlus} /></Button>
                                                                            </ButtonGroup>
                                                                        </Col>
                                                                    </Row>

                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        </>
                                                    )
                                                
                                        ) : (
                                            <Row>
                                                <Col>Nog geen etappes</Col>
                                            </Row>
                                        )
                                    }    
                                    </Accordion>
                                    
                                
                            </div>
                        
                    )
                ) : <SuspenseParagraaf />
            ) : (
                <div className='mb-3'>
                    {
                        missiedata?.length ? (
                            missiedata?.map((dag, index) => 
                                    <div key={DateToDDMMYYYY(dag).toString()}>
                                        <ListGroup as="ul" className='pt-2 ps-4' key={`listgroup_${DateToDDMMYYYY(dag).toString()}`}>
                                            <ListGroup.Item as="li" variant='dark' key={'listgroupitem_0'}>
                                                {index == 0 ? 'Algemeen' : DateToDDMMYYYY(dag)}
                                                {!missieAfgesloten ? (
                                                    <Button variant="info" className='ms-3' disabled={missieAfgesloten} onClick={() => { navigate({ pathname: ('/Missie/EtappeToevoegen'), search: `missieid=${missieId}&etappedatum=${DateToYYYYMMDDstring(dag)}` }) }}>
                                                        Toevoegen
                                                    </Button>
                                                ) : ('')}
                                            </ListGroup.Item>
                                            <ListGroup.Item key={'listgroupitem_01'} variant='secondary'>
                                                <Row>
                                                    <Col xs={6} lg={4} key={`listgroup_titel_${index}`}>Titel</Col>
                                                    <Col xs={6} lg={2} key={`listgroup_fotos_${index}`} className='text-center'>
                                                        Foto's
                                                    </Col>
                                                    <Col xs={6} lg={3} key={`listgroup_financieel_${index}`} className='text-center'>
                                                        Financieel
                                                    </Col>

                                                    <Col xs={6} lg={3} key={`listgroup_betaler_${index}`}>Betaler</Col>

                                                </Row>
                                            </ListGroup.Item>
                                            {
                                                etappes
                                                    .filter((etappe) => CompareDates(dag, etappe.datumTijd)).length > 0 ? (
                                                    etappes
                                                        .filter((etappe) => CompareDates(dag, etappe.datumTijd))
                                                        .map((et) => 
                                                                <>
                                                                    <ListGroup.Item key={`listgroupitem_${et.id.toString()}`}>
                                                                        <Row>
                                                                            <Col xs={6} lg={4} key={`col_titel_${et.id.toString()}`}>{et.titel}</Col>
                                                                            <Col xs={6} lg={2} key={`col_fotos_${et.id.toString()}`} className='text-center'>
                                                                                <ButtonGroup>
                                                                                    <Button key={`btn_aantalfotos_${et.id.toString()}`} variant={et.aantalEtappeFotos > 0 ? 'success' : 'outline-secondary'}><FontAwesomeIcon icon={faImages} />&nbsp;{et.aantalEtappeFotos}</Button>
                                                                                    <Button key={`btn_bekijkfotos_${et.id.toString()}`} variant='success'><FontAwesomeIcon icon={faPlus} /></Button>
                                                                                </ButtonGroup>
                                                                            </Col>
                                                                            <Col xs={6} lg={3} key={`col_kosten_${et.id.toString()}`} className='border-left'>
                                                                                <Row>
                                                                                    <Col className='text-end pe-2' key={`col_totalekost_${et.id.toString()}`}>
                                                                                        &euro; {et.kost.toFixed(2)} {() => { setTotaalKost(totaalKost + et.kost) }}
                                                                                    </Col>
                                                                                    <Col key={`col_bewijsstuk_${et.id.toString()}`}>
                                                                                        <ButtonGroup>
                                                                                            <Button key={`btn_aantalbewijsstukken_${et.id.toString()}`} variant={et.aantalKostBewijsstukken > 0 ? 'success' : 'outline-secondary'}><FontAwesomeIcon icon={faFile} />&nbsp;{et.aantalKostBewijsstukken}</Button>
                                                                                            <Button key={`btn_toonbewijsstukken_${et.id.toString()}`} variant='success'><FontAwesomeIcon icon={faPlus} /></Button>
                                                                                        </ButtonGroup>

                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>

                                                                            <Col key={`col_betaler_${et.id.toString()}`} xs={6} lg={3}>{et.betaaldDoor}</Col>

                                                                        </Row>

                                                                    </ListGroup.Item>
                                                                </>
                                                            )
                                                        
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
                            

                        ) : (
                            <p>geen data gevonden</p>
                        )
                    }
                </div>
            )}
        </ErrorBoundary>

    )
}

export default EtappeOverzicht