import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { axiosUrls } from "../../api/axios";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../components/ErrorFallback";
import { Row,Col, Image, Button } from "react-bootstrap";
import ImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css"

const ToonEtappeBestanden = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [queryParam] = useSearchParams()
    const etappeId = queryParam.get("etappeid")
    const missieId = queryParam.get("missieid")
    const etappetitel = queryParam.get("etappetitel")
    const[images, setImages] = useState([])

    const {
        data: bestanden,
        isLoading,
        isError,
      } = useQuery({
        queryKey: ["etappebestanden", etappeId],
        queryFn: async () => {
          const response = await axiosPrivate.get(
            `${axiosUrls("GetImageGalleryBestanden")}?etappeid=${etappeId}`
          );
          //console.log(afbeeldingen)
          return response.data;
        },
      });

  return (
    <>
          <ErrorBoundary fallback={ErrorFallback}>
              <section>
<h2>Etappe "{etappetitel}" <Button variant="outline-info" onClick={()=>{navigate({ pathname: '/missie/missiedetail', search: `?missieid=${missieId}` })}}>Terug naar missie</Button></h2>
<hr/>
                  {
                    bestanden?.length ? (
                      <ImageGallery items={bestanden} showPlayButton={false}/>
                    ) : ('')
                  }

              </section>
          </ErrorBoundary>
    </>
    
  )
}

export default ToonEtappeBestanden