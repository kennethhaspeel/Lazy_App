import { Button, Card, Row, Col, CardGroup, Image, ListGroup, Modal, Form, FloatingLabel, Alert } from "react-bootstrap"
import { DateToDDMMYYYY, DateToYYYYMMDD } from "../../../components/DatumFuncties"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6"
import { useMutation, useQuery } from "@tanstack/react-query"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";
import { useEffect, useState } from "react";
import SuspenseParagraaf from "../../../components/SuspenseParagraaf";

const Details = ({missieid, setStartdatum, setEinddatum, isOrganisator}) => {
  const axiosPrivate = useAxiosPrivate();

  const [missieDetail, setMissieDetail]= useState({})
  const { data: missie, isLoading: DetailsLoading, isError: DetailsError } = useQuery({
    queryKey: ["missiedetail", missieid],
    queryFn: async () => {
      const response = await axiosPrivate.get(`${axiosUrls("MissieDetails")}/${missieid}`)
      //console.log(response.data)
      setStartdatum(response.data.startDatum)
      setEinddatum(response.data.eindDatum)
      setMissieDetail(response.data)
      return response.data
    }
  })

  const {mutate: updateMissie, isLoading: isUpdating} = useMutation({

  })

  useEffect(()=>{
    console.log(missieDetail)
  },[missieDetail])
  return (
    <>
      {DetailsLoading ? (
        <SuspenseParagraaf/>
      ) : (
        <>
          <Form className="pt-1" id="formNieuweMissie">
            <Row className="mb-2">
              <Col md={2} sm={12}>
                <Form.Label>Titel</Form.Label>
              </Col>
              <Col md={10} sm={12}>
                <Form.Control
                  type="text"
                  id="titel"
                  autoComplete="off"
                  value={missieDetail.titel}
                  placeholder="Geef een titel"
                  readOnly={isOrganisator}
                  onChange={(e) => setMissieDetail({ ...missieDetail, titel: e.target.value })}
                  required
                ></Form.Control>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2} sm={12}>
                <Form.Label>Omschrijving</Form.Label>
              </Col>
              <Col md={10} sm={12}>
                <Form.Control
                  type="text"
                  id="omschrijving"
                  autoComplete="off"
                  value={missieDetail.omschrijving}
                  placeholder="Geef een korte omschrijving"
                  readOnly={isOrganisator}
                  onChange={(e) => setMissieDetail({ ...missieDetail, omschrijving: e.target.value })}
                ></Form.Control>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2} sm={12}>
                <Form.Label>Locatie</Form.Label>
              </Col>
              <Col md={10} sm={12}>
                <Form.Control
                  type="text"
                  id="omschrijving"
                  autoComplete="off"
                  value={missieDetail.locatie}
                  placeholder="Geef een korte omschrijving"
                  readOnly={isOrganisator}
                  onChange={(e) => setMissieDetail({ ...missieDetail, omschrijving: e.target.value })}
                ></Form.Control>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2} sm={12}>
                <Form.Label>Startdatum</Form.Label>
              </Col>
              <Col md={10} sm={12}>
                <Form.Control
                  type="date"
                  id="startdatum"
                  autoComplete="off"
                  value={DateToYYYYMMDD(new Date(missieDetail.startDatum))}
                  readOnly={isOrganisator}
                  onChange={(e) => setMissieDetail({ ...missieDetail, startDatum: e.target.value, eindDatum: e.target.value })}
                  required
                ></Form.Control>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md={2} sm={12}>
                <Form.Label>Einddatum</Form.Label>
              </Col>
              <Col md={10} sm={12}>
                <Form.Control
                  type="date"
                  id="einddatum"
                  autoComplete="off"
                  value={DateToYYYYMMDD(new Date(missieDetail.eindDatum))}
                  readOnly={isOrganisator}
                  onChange={(e) => setMissieDetail({ ...missieDetail, eindDatum: e.target.value })}
                  required
                ></Form.Control>
              </Col>
            </Row>
            {!isOrganisator ? (
              <Row>
                <Col sm={12} md={{ span: 10, offset: 2 }}>
                  <Button variant="success">Bewaar</Button>
                </Col>
              </Row>
            ) : (
              ""
            )}

            <hr />
          </Form>
        </>
      )}
    </>
  );
}

export default Details