import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { axiosUrls } from "../../../api/axios"
import { useState } from "react"
import SuspenseParagraaf from "../../../components/SuspenseParagraaf"
import { useSearchParams } from "react-router-dom"
import useAuth from "../../../hooks/useAuth"
//import Deelnemers from "./Deelnemers"
import { Alert } from "react-bootstrap"

//import { GetMissie } from "./GetMissie"
import Details from "./Details"
import Deelnemers from "./Deelnemers"
import EtappeOverzicht from "./EtappeOverzicht"

const MissieDetail = () => {
    const [queryParam] = useSearchParams()
    const missieid = queryParam.get("missieid")
    const { auth } = useAuth();
    const currentUser = auth?.user
    const [isOrganisator, setIsOrganisator] = useState(false)
    const [isDeelnemer, setIsDeelnemer] = useState(false)
    const [startdatum, setStartdatum] = useState()
    const [einddatum, setEinddatum] = useState()



    // const missiedetail = []


    return (
        <>

            <Alert variant='primary'>
                Details
            </Alert>
            <Details missieid={missieid} setStartdatum={setStartdatum} setEinddatum={setEinddatum} isOrganisator={isOrganisator} />
            <Alert variant='primary'>
                Deelnemers
            </Alert>
            <Deelnemers missieid={missieid} currentUser={currentUser} isOrganisator={isOrganisator} setIsOrganisator={setIsOrganisator}
                isDeelnemer={isDeelnemer} setIsDeelnemer={setIsDeelnemer} />
            <Alert variant='primary'>
                Etappes
            </Alert>
            {
                startdatum != null && einddatum != null ? (
                    <EtappeOverzicht missieId={missieid} startDatum={startdatum} eindDatum={einddatum} />
                ) : (
                    <SuspenseParagraaf />
                )
            }

        </>
    )
}

export default MissieDetail