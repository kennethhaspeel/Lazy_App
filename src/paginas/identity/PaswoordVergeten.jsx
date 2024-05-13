import axios, { axiosUrls } from "../../api/axios";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Alert, Button, Row, Col } from "react-bootstrap";

const PaswoordVergeten = () => {
  const [emailadres, setEmailadres] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [hasError, setHasError] = useState(false);
  const [verbergButton, setVerbergButton] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const origin = window.location.origin;

  const handleSubmit = async (e) => {
    setVerbergButton(true);
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setVerbergButton(false);
      e.stopPropagation();
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${axiosUrls("paswoordvergeten")}?email=${emailadres}&origin=${origin}`
      );
      console.log(response.message)
      setIsSuccess(true);
      setLoading(false);
      setHasError(false)
    } catch (err) {
        setLoading(false)
      setErrMsg(err.response.data);
      setHasError(true);
      setVerbergButton(false);
    }
  };

  return (
    <section>
      {loading ? <Alert variant="info">Even geduld... </Alert> : ""}
      <Alert variant="danger" hidden={!hasError}>
        <p>{errMsg}</p>
      </Alert>
      <Alert variant="success" hidden={!isSuccess}>
        <p>Uw aanvraag is verwerkt...</p>
        <p>U hebt normaal gezien een email ontvangen</p>
      </Alert>
      <Row>
        <Col xs={12} md={6}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Uw emailadres
              </label>
              <input
                className="form-control"
                type="email"
                id="email"
                autoComplete="off"
                onChange={(e) => setEmailadres(e.target.value)}
                value={emailadres}
                required
              />
            </div>
            <Button variant="primary" type="submit" hidden={verbergButton}>
              Versturen
            </Button>
          </form>
        </Col>
      </Row>
    </section>
  );
};

export default PaswoordVergeten;
