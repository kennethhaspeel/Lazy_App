import { useRef, useState, useEffect } from "react";
import axios from '../../api/axios';
import { Link } from "react-router-dom";
import { Alert, Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";

const pw_regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
const email_regex = /^[^.\s@]+(\.[^.\s@]+)*@[^.\s@]+(\.[^.\s@]+)+$/

const Registreer = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [userError, setUserError] = useState('');

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
  const [paswoordvalid, setPaswoordvalid] = useState(true)
  const [paswoordInvalidBoodschap, setPaswoordInvalidBoodschap] = useState([])
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    console.log(email_regex.test(user))
  }, [user])

  useEffect(() => {
    setPaswoordvalid(true)
    setPaswoordInvalidBoodschap([])
    if (!pw_regex.test(paswoord)) {
      setPaswoordvalid(false)
      setPaswoordInvalidBoodschap(oldArr => [...oldArr, "Paswoord niet complex genoeg: minimum 1 kleine letter, 1 hoofdletter, 1 cijfer en 1 speciaal teken"])
    }
    if (paswoord !== paswoordBevestig) {
      setPaswoordvalid(false)
      setPaswoordInvalidBoodschap(oldArr => [...oldArr, "Paswoord en bevestiging komen niet overeen"])
    }
    console.log(paswoordvalid)
  },[paswoord,paswoordBevestig,paswoordvalid])

  // aparte useeffect gebruiken misschien

  const VerwerkRegistratie = async (e) => {
    console.log('indienen registratie')
    e.preventDefault()
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    console.log(form.checkValidity())
    setValidated(true);
  }
  return (
    <>
      <h2>Registreer</h2>
      <Form className="pt-3" noValidate validated={validated} onSubmit={VerwerkRegistratie}>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="validationEmail">
              <FloatingLabel label="Het antwoord" className="mb-3">
                <Form.Control
                  type="text"
                  id="antwoord"
                  autoComplete="off"
                  onChange={(e) => setGeheimeVraag(e.target.value)}
                  value={geheimevraag}
                  placeholder="Het Antwoord"
                  required
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                Gelieve het antwoord in te geven
              </Form.Control.Feedback>
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
            />
          </FloatingLabel>
          <Form.Control.Feedback type="invalid">
            Gelieve uw emailadres in te geven
          </Form.Control.Feedback>
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
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                Gelieve uw emailadres in te geven
              </Form.Control.Feedback>
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
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                Gelieve uw emailadres in te geven
              </Form.Control.Feedback>
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
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                Gelieve een straat in te geven
              </Form.Control.Feedback>
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
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                Gelieve een huisnummer in te geven
              </Form.Control.Feedback>
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
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                Gelieve een postcode in te geven
              </Form.Control.Feedback>
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
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                Gelieve een gemeente in te geven
              </Form.Control.Feedback>
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
                  required
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                Gelieve een paswoord in te geven
              </Form.Control.Feedback>
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
                  placeholder="Bevestig Paswoord"
                  required
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">

              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        {paswoordvalid ? (
          <>
            <Row>
              <Col>
                <Alert variant="danger">
                  <ul>
                    <li>dit is een foutboodschap</li>
                    {paswoordInvalidBoodschap.map((boodschap) => {
                      <li>{boodschap}</li>
                    })}
                  </ul>
                </Alert>
              </Col>
            </Row>
          </>
        ) : ('')}

        <hr />
        <Button variant="primary" type="submit">Registreren</Button>
      </Form>
    </>
  )
}

export default Registreer