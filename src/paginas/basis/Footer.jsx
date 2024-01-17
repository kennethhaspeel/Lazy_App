import { Col, Row } from "react-bootstrap";

const Footer = ({ huidige_gebruiker }) => {
    const datum = new Date();
    const naam = huidige_gebruiker?.user?.volledigenaam
    console.log(naam)
  return (
  <div className="Footer bg-body-tertiary">
    <Row>
      <Col xs={0} md={6}>
        <div className="d-none d-md-block ps-2">&copy; {datum.getFullYear()} Kenneth Haspeel</div>
      
      </Col>
      <Col  xs={12} md={6}>
      {huidige_gebruiker?.rollen  ? (
                <>
                  <p>
                    Ingelogd als <strong>{naam}</strong>
                </p>
                </>
              ) : (
                <>
                  Niet ingelogd
                </>
              )}
      </Col>
    </Row>

    </div>
  )
};

export default Footer;
