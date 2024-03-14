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

const MissieDetail = () => {
     const axiosPrivate = useAxiosPrivate()
    const [queryParam] = useSearchParams()
    const missieid = queryParam.get("missieid")
    const { auth } = useAuth();
    const currentUser = auth?.user
    const [isOrganisator, setIsOrganisator] = useState(false)
    const [isDeelnemer, setIsDeelnemer] = useState(false)

    // const missieQuery = useQuery({
    //     queryKey: ["MissieLijst",missieid],
    //     queryFn: async()=>{
    //         const params = {
    //             id: missieid
    //         }
    //         const response = await axiosPrivate.get(axiosUrls("MissieDetails"),{params})
    //         console.log(response.data)
    //         return response.data
    //     }
    // })
// const missiedetail = []


    return (
        <>
            <Alert variant='info'>
                <Alert.Heading>
                    Missie 
                </Alert.Heading>
            </Alert>
            <Alert variant='primary'>
                Deelnemers
            </Alert>
            </>
    )
}

export default MissieDetail