import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../api/axios";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../components/ErrorFallback";
import { Row,Col, Image } from "react-bootstrap";

const ToonEtappeBestanden = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [queryParam] = useSearchParams()
    const etappeId = queryParam.get("etappeid")

    const {
        data: bestanden,
        isLoading,
        isError,
      } = useQuery({
        queryKey: ["etappebestanden", etappeId],
        queryFn: async () => {
          const response = await axiosPrivate.get(
            `${axiosUrls("GetEtappeBestanden")}?etappeid=${etappeId}`
          );
          console.log(response.data);
          return response.data;
        },
      });


  return (
    <>
          <ErrorBoundary fallback={ErrorFallback}>
              <section>
                  <Row>
                      {
                          bestanden?.map((bestand) =>
                              <Col xs={6} md={3} lg={4}>
                                  <Image src={bestand.thumbnail} thumbnail key={bestand.id}/>
                              </Col>
                          )}
                  </Row>

              </section>
          </ErrorBoundary>
    </>
    
  )
}

export default ToonEtappeBestanden