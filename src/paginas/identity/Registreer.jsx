import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Col, FloatingLabel, Form, Row, Spinner } from "react-bootstrap";
import axios, {axiosUrls} from '../../api/axios';


const Registreer = () => {
  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState('');

  const [user, setUser] = useState('');
  const [naam, setNaam] = useState('');
  const [voornaam, setVoornaam] = useState('');
  const [straat, setStraat] = useState('');
  const [huisnr, setHuisnr] = useState('');
  const [busnr, setBusnr] = useState('');
  const [postcode, setPostcode] = useState('');
  const [gemeente, setGemeente] = useState('');
  const [geheimevraag, setGeheimeVraag] = useState('');
  const [paswoord, setPaswoord] = useState('');
  const [paswoordBevestig, setPaswoordBevestig] = useState('');
  const [loading, setLoading] = useState(false)
 
  const VerwerkRegistratie = async (e) => {
    e.preventDefault()
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    const body = {
      email: user,
      paswoord,
      paswoordBevestig,
      voornaam,
      naam,
      volledigenaam: `${voornaam} ${naam}`,
      straat,
      huisnr,
      busnr,
      postcode,
      gemeente,
      geheimevraag
    }

    setLoading(true)
    try {

        const response = await axios.post(axiosUrls('registratie'),
            JSON.stringify(body),
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
        console.log(response.data);
        setLoading(false)
        navigate('/identity/registreeringediend', { replace: true });
    } catch (err) {
        console.log(err)
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else {
            setErrMsg(err.response.data);
        }
        errRef.current.focus();
        setLoading(false)
    }
  }
  return (
    <>

      <h2>Registreer</h2>
      {loading ? (<Alert variant='info'>Even geduld... Uw registratie wordt verwerkt</Alert>):('')}
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <Form className="pt-3" onSubmit={VerwerkRegistratie} name="RegistratieFormulier">
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="validationEmail">
              <FloatingLabel label="Het antwoord *" className="mb-3">
                <Form.Control
                  type="text"
                  id="antwoord"
                  autoComplete="off"
                  onChange={(e) => setGeheimeVraag(e.target.value)}
                  value={geheimevraag}
                  placeholder="Het Antwoord"
                  required
                  title="Geef het geheime woord in"
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <Form.Group className="mb-3">
          <FloatingLabel label="Uw emailadres *" className="mb-3">
            <Form.Control
              type="email"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              placeholder="Uw emailadres"
              required
              title="Gelieve uw emailadres in te geven"
            />
          </FloatingLabel>
        </Form.Group>
        <hr />
        <Row>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <FloatingLabel label="Uw voornaam *" className="mb-3">
                <Form.Control
                  type="text"
                  id="voornaam"
                  autoComplete="off"
                  onChange={(e) => setVoornaam(e.target.value)}
                  value={voornaam}
                  placeholder="Uw voornaam"
                  required
                  title="Gelieve uw voornaam in te geven"
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <FloatingLabel label="Uw familienaam *" className="mb-3">
                <Form.Control
                  type="text"
                  id="naam"
                  autoComplete="off"
                  onChange={(e) => setNaam(e.target.value)}
                  value={naam}
                  placeholder="Uw familienaam"
                  required
                  title="Gelieve uw familienaam in te geven"
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <FloatingLabel label="Straatnaam *" className="mb-3">
                <Form.Control
                  type="text"
                  id="straatnaam"
                  autoComplete="off"
                  onChange={(e) => setStraat(e.target.value)}
                  value={straat}
                  placeholder="Straatnaam"
                  required
                  title="Gelieve een straatnaam in te geven"
                />
              </FloatingLabel>

            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group className="mb-3">
              <FloatingLabel label="Huisnummer *" className="mb-3">
                <Form.Control
                  type="text"
                  id="huisnr"
                  autoComplete="off"
                  onChange={(e) => setHuisnr(e.target.value)}
                  value={huisnr}
                  placeholder="Huisnummer"
                  required
                  title="Gelieve een huisnummer in te geven"
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group className="mb-3">
              <FloatingLabel label="Busnummer" className="mb-3">
                <Form.Control
                  type="text"
                  id="busnummer"
                  autoComplete="off"
                  onChange={(e) => setBusnr(e.target.value)}
                  value={busnr}
                  placeholder="Busnummer"
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={3}>
            <Form.Group className="mb-3">
              <FloatingLabel label="Postcode *" className="mb-3">
                <Form.Control
                  type="text"
                  id="postcode"
                  autoComplete="off"
                  onChange={(e) => setPostcode(e.target.value)}
                  value={postcode}
                  placeholder="Postcode"
                  required
                  title="Gelieve een postcode in te geven"
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
          <Col xs={12} md={9}>
            <Form.Group className="mb-3">
              <FloatingLabel label="Gemeente *" className="mb-3">
                <Form.Control
                  type="text"
                  id="gemeente"
                  autoComplete="off"
                  onChange={(e) => setGemeente(e.target.value)}
                  value={gemeente}
                  placeholder="Gemeente"
                  required
                  title="Gelieve een gemeente in te geven"
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <FloatingLabel label="Paswoord *" className="mb-3">
                <Form.Control
                  type="password"
                  id="paswoord"
                  autoComplete="off"
                  onChange={(e) => setPaswoord(e.target.value)}
                  value={paswoord}
                  placeholder="Paswoord"
                  pattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
                  title="Paswoord niet complex genoeg: minimum 1 kleine letter, 1 hoofdletter, 1 cijfer en 1 speciaal teken"
                  required
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <FloatingLabel label="Bevestig Paswoord *" className="mb-3">
                <Form.Control
                  type="password"
                  id="bevestigpaswoord"
                  autoComplete="off"
                  onChange={(e) => setPaswoordBevestig(e.target.value)}
                  value={paswoordBevestig}
                  pattern={paswoord}
                  title="Paswoorden komen niet overeen"
                  placeholder="Bevestig Paswoord"
                  required
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
        </Row>
        <hr />
        {loading ? (
          <Button variant="primary" disabled><Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner> Registreren</Button>
        ) : ( 
          <Button variant="primary" type="submit">Registreren</Button>
        )}
        
      </Form>
    </>
  )
}

export default Registreer