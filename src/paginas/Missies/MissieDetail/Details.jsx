import { Button, Card, Row, Col, CardGroup, Image, ListGroup, Modal, Form, FloatingLabel, Alert } from "react-bootstrap"
import { DateToDDMMYYYY, DateToYYYYMMDD } from "../../../components/DatumFuncties"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6"
import { useQuery } from "@tanstack/react-query"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";

const Details = ({missieid}) => {
  console.log(missieid)
  const axiosPrivate = useAxiosPrivate();

  const { data: missie, isLoading: DetailsLoading, isError: DetailsError } = useQuery({
    queryKey: ["missiedetail", missieid],
    queryFn: async () => {
      const url = `${axiosUrls("MissieDetails")}/${missieid}`
      console.log(url)
      const response = await axiosPrivate.get(url)
      console.log(response.data)
      return response.data
    }
  })
  return (
    <>
      <Alert variant='info'>
        <Alert.Heading>
          {
            DetailsLoading ?
              (
                <span>laden</span>
              ) :
              (
                <><span>Missie </span> {missie?.titel}</>
              )
          }
        </Alert.Heading>
      </Alert>

      {/* {
        DetailsLoading ? (
          <span>Laden</span>
        ) :
          (
            <>
              <Form className="pt-1" id="formNieuweMissie">
                <Form.Group className="mb-3">
                  <Form.Label>Titel</Form.Label>
                  <Form.Control
                    type="text"
                    id="titel"
                    autoComplete="off"
                    //value={missie.titel}
                    placeholder="Geef een titel"
                    //onChange={(e) => setNieuweMissie({ ...nieuweMissie, titel: e.target.value })}
                    required
                  >
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Omschrijving</Form.Label>
                  <Form.Control
                    type="text"
                    id="omschrijving"
                    autoComplete="off"
                   // value={missie.omschrijving}
                    placeholder="Geef een korte omschrijving"
                  //onChange={(e) => setNieuweMissie({ ...nieuweMissie, omschrijving: e.target.value })}
                  >
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Locatie</Form.Label>
                  <Form.Control
                    type="text"
                    id="locatie"
                    autoComplete="off"
                    //value={missie.locatie}
                    placeholder="Wat is de algemene locatie"
                  //onChange={(e) => setNieuweMissie({ ...nieuweMissie, locatie: e.target.value })}
                  >

                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Startdatum</Form.Label>
                  <Form.Control
                    type="date"
                    id="startdatum"
                    autoComplete="off"
                    //value={missie.startdatum}
                    //onChange={(e) => setNieuweMissie({ ...nieuweMissie, startdatum: e.target.value, einddatum: e.target.value })}
                    required
                  >

                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Einddatum</Form.Label>
                  <Form.Control
                    type="date"
                    id="einddatum"
                    autoComplete="off"
                   // value={missie.einddatum}
                    //onChange={(e) => setNieuweMissie({ ...nieuweMissie, einddatum: e.target.value })}
                    required
                  >
                  </Form.Control>
                </Form.Group>
                <hr />
                {/* <Button variant="primary" type="button" onClick={BewaarNieuweMissie}>
                                    Bewaar
                                </Button>
              </Form>
            </>
          )
      } */}

    </>
  )
}

export default Details