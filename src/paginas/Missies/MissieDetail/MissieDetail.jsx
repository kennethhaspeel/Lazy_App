import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { axiosUrls } from "../../../api/axios"
import { useState } from "react"
import SuspenseParagraaf from "../../../components/SuspenseParagraaf"
import { useSearchParams } from "react-router-dom"
import useAuth from "../../../hooks/useAuth"
//import Deelnemers from "./Deelnemers"
import { Alert } from "react-bootstrap"
import { useQuery } from "@tanstack/react-query"
//import { GetMissie } from "./GetMissie"
import Details from "./Details"
import Deelnemers from "./Deelnemers"

const MissieDetail = () => {
     const axiosPrivate = useAxiosPrivate()
    const [queryParam] = useSearchParams()
    const missieid = queryParam.get("missieid")
    const { auth } = useAuth();
    const currentUser = auth?.user
    const [isOrganisator, setIsOrganisator] = useState(false)
    const [isDeelnemer, setIsDeelnemer] = useState(false)

    const {data:missie,isLoading: DetailsLoading,isError:DetailsError} = useQuery({
        queryKey: ["missiedetail",missieid],
        queryFn: async()=>{
            const url = `${axiosUrls("MissieDetails")}/${missieid}`
            const response = await axiosPrivate.get(url)
            console.log(response.data)
            return response.data
        }
    })


// const missiedetail = []


    return (
        <>
            <Alert variant='info'>
                <Alert.Heading>
                    Missie {missie?.titel}
                </Alert.Heading>
            </Alert>
            <Details details={missie}/>
            <Alert variant='primary'>
                Deelnemers
            </Alert>
            <Deelnemers missieid={missieid} currentUser={currentUser} isOrganisator={isOrganisator} setIsOrganisator={setIsOrganisator}
            isDeelnemer={isDeelnemer} setIsDeelnemer={setIsDeelnemer}/>
            </>
    )
}

export default MissieDetail