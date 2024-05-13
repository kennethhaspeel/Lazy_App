import { Form, Row, Alert, Col, Button } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios, {axiosUrls} from '../../api/axios';
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../components/ErrorFallback";

const PaswoordInstellen = () => {
    const [queryParam] = useSearchParams();
    const UUID = queryParam.get("uuid");
    const Email = queryParam.get("email");
    const Token = queryParam.get("token");
    const [paswoord, setPaswoord] = useState('8940@Wervik')
    const [bevestigPaswoord, setBevestigPaswoord] = useState('8940@Wervik')
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [hasError, setHasError] = useState(false);
    const [verbergButton, setVerbergButton] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [sucMsg, setSucMsg] = useState("");

    const handleSubmit = async (e) => {
        console.log('geklikt')
        setVerbergButton(true);
        e.preventDefault()
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            setVerbergButton(false);
            e.stopPropagation();

        }
        setLoading(true);
        try {
            const response = await axios.put(axiosUrls('paswoordinstellen'),
                JSON.stringify({ UUID, Email, paswoord, Token }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(response.message)
            setIsSuccess(true);
            setLoading(false);
            setHasError(false)
        } catch (err) {
            console.log(err)
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.message);
            }
            setLoading(false)
            setHasError(true);
            setVerbergButton(false);
        }
    }
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
        <section>
            <h2>Paswoord instellen</h2>
            {loading ? <Alert variant="info">Even geduld... </Alert> : ""}
            <Alert variant="danger" hidden={!hasError}>
                <p>{errMsg}</p>
            </Alert>
            <Alert variant="success" hidden={isSuccess}>
                <p>Uw paswoord werd ingesteld... U kunt nu <Link to='/identity/login'>inloggen</Link> </p>

            </Alert>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Paswoord</Form.Label>
                            <Form.Control
                                type="password"
                                id="paswoord"
                                autoComplete="off"
                                onChange={(e) => setPaswoord(e.target.value)}
                                value={paswoord}
                                placeholder="Paswoord"
                                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
                                title="Paswoord niet complex genoeg: minimum 1 kleine letter, 1 hoofdletter, 1 cijfer en 1 speciaal teken"
                                required
                            />

                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Herhaal paswoord</Form.Label>
                            <Form.Control
                                type="password"
                                id="bevestigpaswoord"
                                autoComplete="off"
                                onChange={(e) => setBevestigPaswoord(e.target.value)}
                                value={bevestigPaswoord}
                                pattern={paswoord}
                                title="Paswoorden komen niet overeen"
                                placeholder="Bevestig Paswoord"
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                 <Button variant="primary" type="submit" hidden={verbergButton}>
                Versturen
            </Button>           
            </Form>

        </section>
        </ErrorBoundary>
    )
}

export default PaswoordInstellen