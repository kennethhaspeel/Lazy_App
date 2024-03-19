import { Button, Card, Row, Col, CardGroup, Image, ListGroup, Modal, Form, FloatingLabel, Alert } from "react-bootstrap"
import { DateToYYYYMMDD } from "../../../components/DatumFuncties"
import { FaSpinner} from "react-icons/fa6"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../../api/axios";
import { useState } from "react";
import SuspenseParagraaf from "../../../components/SuspenseParagraaf";

const Details = ({missieid, setStartdatum, setEinddatum, isOrganisator}) => {
  const axiosPrivate = useAxiosPrivate();
const queryClient = useQueryClient();
  const [missieDetail, setMissieDetail]= useState({})

  const { data: missie, isLoading: DetailsLoading, isError: DetailsError } = useQuery({
    queryKey: ["missiedetail", missieid],
    queryFn: async () => {
      const response = await axiosPrivate.get(`${axiosUrls("GetMissieDetail")}/${missieid}`)
      console.log(response.data)
      setStartdatum(response.data.startDatum)
      setEinddatum(response.data.eindDatum)
      setMissieDetail(response.data)
      return response.data
    }
  })

  const updateMutation = useMutation({
      mutationFn: async (detail) => {
        return axiosPrivate.post(
          axiosUrls("PostMissieDetail"),
          detail
        );
      },
      onSuccess: (data) => {
        queryClient.setQueryData(["missiedetail", missieid],data)
        queryClient.invalidateQueries(["missiedetail", missieid]);
      },
  })

  const BewaarDetails = (e) => {
    e.preventDefault
    const form = document.getElementById('formMissieDetail');
    if (form.checkValidity() === false) {
        e.stopPropagation();
    }
    updateMutation.mutate(missieDetail)

}
  return (
    <>
      {DetailsLoading ? (
        <SuspenseParagraaf/>
      ) : (
        <>
        {
          Object.keys(missieDetail).length > 0 ?(
<Form className="pt-1" id="formMissieDetail">
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
                  readOnly={!isOrganisator}
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
                  readOnly={!isOrganisator}
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
                  readOnly={!isOrganisator}
                  onChange={(e) => setMissieDetail({ ...missieDetail, locatie: e.target.value })}
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
                  value={DateToYYYYMMDD(missieDetail?.startDatum)}
                  readOnly={!isOrganisator}
                  onChange={(e) => setMissieDetail({ ...missieDetail, startDatum: (new Date(e.target.value).toISOString()), eindDatum: (new Date(e.target.value).toISOString()) })}
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
                  value={DateToYYYYMMDD(missieDetail?.eindDatum)}
                  readOnly={!isOrganisator}
                  onChange={(e) => setMissieDetail({ ...missieDetail, eindDatum: (new Date(e.target.value).toISOString()) })}
                  required
                ></Form.Control>
              </Col>
            </Row>
            
            {isOrganisator ? (
              <Row>
                {
                  updateMutation.isPending ? (
                    <Col sm={12} md={{ span: 10, offset: 2 }}>
                    <Button variant="outline-success" disabled><FaSpinner className="loading-icon"/></Button>
                  </Col>
                  ) : (
                    <Col sm={12} md={{ span: 10, offset: 2 }}>
                    <Button variant="success" onClick={BewaarDetails}>Bewaar</Button>
                  </Col>
                  )
                }

              </Row>
            ) : (
              ""
            )}

            <hr />
          </Form>
          ):('')
        }
          
        </>
      )}
    </>
  );
}

export default Details