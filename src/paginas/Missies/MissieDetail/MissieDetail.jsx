import useSWR from "swr"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { axiosUrls } from "../../../api/axios"
import { useState } from "react"
import SuspenseParagraaf from "../../../components/SuspenseParagraaf"
import { useSearchParams } from "react-router-dom"
import useAuth from "../../../hooks/useAuth"
import Deelnemers from "./Deelnemers"
import { Alert } from "react-bootstrap"
//import { GetMissie } from "./GetMissie"

const MissieDetail = async () => {
    const axiosPrivate = useAxiosPrivate()
    const [queryParam] = useSearchParams()
    const missieid = queryParam.get("missieid")
    const { auth } = useAuth();
    const currentUser = auth?.user
    const [isOrganisator, setIsOrganisator] = useState(false)
    const [isDeelnemer, setIsDeelnemer] = useState(false)

    const { data: missiedetail, isLoading, error, isValidating } =
        useSWR(`GetMissieDetail_${missieid}`, async () => { const response = await axiosPrivate(`${axiosUrls('MissieDetails')}/${missieid}`); return response.data }, {
            revalidateOnFocus: false,
            onSuccess(data, key, config) {
                console.log(data)
            },
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                if (error.status === 404) return
                if (retryCount >= 3) return
                revalidate({ retryCount })
            }
        })
    return (
        <>
            <Alert variant='info'>
                <Alert.Heading>
                    Missie {missiedetail?.titel}
                </Alert.Heading>
            </Alert>
            <Alert variant='primary'>
                Deelnemers
            </Alert>
            {/* <Deelnemers missieid={missieid} setUsers={setUsers} isOrganisator={isOrganisator} setIsOrganisator={setIsOrganisator} setIsDeelnemer={setIsDeelnemer} currentUser={currentUser}/> */}
        </>
    )
}

export default MissieDetail