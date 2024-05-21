import { useEffect, useState } from 'react'
import { Button, Card, Col, Image, ProgressBar, Row } from 'react-bootstrap'
import { AfbeeldingVerkleinen } from './AfbeeldingBewerken'
import useAxiosPrivateFile from "../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../api/axios";

const BestandPreview = ({ file, setFiles, uploadStarted, etappeid, onderwerp, aantalUploaded, setAantalUploaded }) => {
    const axiosPrivate = useAxiosPrivateFile();
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [uploadEnded,setUploadEnded]=useState(false)
    useEffect(() => {
        if (file?.name.length > 0) {

            setImage(URL.createObjectURL(file))
        }
    }, [file])

    useEffect(() => {
        const startUpload = async () => {
            setProgress(10)
            let klein = await AfbeeldingVerkleinen(file, 3000, 3000, 80)
            console.log(`Originele grootte: ${file.size}, nieuwe grootte: ${klein.size} => verschil ${file.size - klein.size}`)
            setProgress(15)
            const fd = new FormData();
            fd.append("file", file);
            fd.append("etappeId", etappeid)
            fd.append("onderwerp", onderwerp)
            await axiosPrivate
                .post(axiosUrls("PostBestand"), fd, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (ProgressEvent) => {
                        setProgress(ProgressEvent.progress * 100)
                    },
                })
                .then((res) => {
                    setAantalUploaded(aantalUploaded => aantalUploaded + 1)
                    setUploadEnded(true)
                    
                })
                .catch((err) => console.log(err));

        }

        if (uploadStarted) {
            startUpload()
        }
    }, [uploadStarted])

    return (
        <>

            <Col xs={6} md={4} xl={3} >
                <Card style={{ backgroundColor: 'rgba(195, 195, 195, 0.25)' }}>
                    <Card.Img variant="top" src={image} className='p-2' style={{ objectFit: 'contain', height: 200 }} />
                    <hr />
                    <div className='d-grid gap-2'>
                        <Button variant="danger" hidden={uploadStarted || uploadEnded}>Verwijder</Button>
                        <ProgressBar now={progress} animated hidden={!uploadStarted &&!uploadEnded} />
                        <Button variant="success" hidden={!uploadEnded} disabled>Upload Afgewerkt</Button>
                    </div>
                </Card>
            </Col>

        </>
    )
}

export default BestandPreview

//https://imagekit.io/blog/how-to-resize-image-in-javascript/