import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Col, Row, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import BestandPreview from "./BestandPreview";


const BestandOpladen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  console.log(from)
  const [queryParam] = useSearchParams()
  const etappeId = queryParam.get("etappeid")
  const onderwerp = queryParam.get("onderwerp")
  const missieId = queryParam.get('missieid')

  const [files, setFiles] = useState([]);
  const [verkleind, setVerkleind] = useState([])
  const [uploadBlokVerborgen, setUploadBlokVerborgen] = useState(true)
  const [uploadStarted, setUploadStarted] = useState(false)
  const [toonModalNogFoto, setToonModalNogFoto] = useState(false)
  const [aantalUploaded, setAantalUploaded] = useState(0)

  const fileUploadRef = useRef()
  const handleImageUploadClick = () => {
    fileUploadRef.current.click()
  }

  const handleChange = (e) => {
    const bestanden = Array.prototype.slice.call(e.target.files)
    setFiles(bestanden)
    setUploadBlokVerborgen(false)
    e.target.value = null
  }

  const handleUpload = async () => {
    if (!files) {
      return;
    }
    setUploadBlokVerborgen(true)
    setUploadStarted(true)
  };

  useEffect(() => {
    if (aantalUploaded > 0 && aantalUploaded === files?.length) {
      console.log('gedaan met uploaden')
      setUploadStarted(false)
      setToonModalNogFoto(true)
    } else {
      console.log(`${aantalUploaded} bestanden opgeladen`)
    }
  }, [aantalUploaded])
  return (
    <section>
      <h2>Bestand Opladen</h2>
      <div
        style={{
          backgroundColor: "rgba(39, 245, 228, 0.1)",
          outlineStyle: "dashed",
        }}
        className="text-center p-3"
        onClick={handleImageUploadClick}
      >
        <Row>
          <Col>
            <FontAwesomeIcon icon={faImage} className="fa-6x" />
          </Col>
        </Row>
        <Row>
          <Col>Klik om een afbeelding te selecteren</Col>
        </Row>
      </div>
      <hr />
      <Row>
        {files?.map((bestand, index) => (
          <BestandPreview
            file={bestand}
            setFiles={setFiles}
            key={index}
            uploadStarted={uploadStarted}
            etappeid={etappeId}
            onderwerp={onderwerp}
            aantalUploaded={aantalUploaded}
            setAantalUploaded={setAantalUploaded}
          />
        ))}
      </Row>
      <div hidden={uploadBlokVerborgen}>
        <hr />
        <Row className="justify-content-md-center">
          <Col xs={6} md={4} lg={3} className="d-grid gap-2">
            <Button variant="success" onClick={handleUpload}>
              Start upload
            </Button>
          </Col>
        </Row>
      </div>

      <input
        type="file"
        onChange={handleChange}
        hidden
        multiple={true}
        ref={fileUploadRef}
      />
      <Modal show={toonModalNogFoto}>
        <Modal.Dialog>
          <Modal.Body>
            <p>Wilt u nog bestanden opladen?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button 
            variant="secondary"
            onClick={()=>(navigate(`/missie/missiedetail?missieid=${missieId}`, { replace: true }))}
            >
              Nee
            </Button>
            <Button 
            variant="primary"
            onClick={()=>{
              setFiles([])
            setToonModalNogFoto(false)
            }}
            >
              Ja
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    </section>
  );
};

export default BestandOpladen;
