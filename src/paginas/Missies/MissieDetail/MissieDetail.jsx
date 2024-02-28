import useSWR from "swr"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { axiosUrls } from "../../../api/axios"
import { Suspense } from "react"
import SuspenseParagraaf from "../../../components/SuspenseParagraaf"
import { useSearchParams } from "react-router-dom"
import useAuth from "../../../hooks/useAuth"
import Deelnemers from "./Deelnemers"
import { Alert } from "react-bootstrap"

const MissieDetail = () => {
    const axiosPrivate = useAxiosPrivate()
    const [queryParam] = useSearchParams()
    const missieid = queryParam.get("missieid")

    const {auth} = useAuth();
    const currentUser = auth?.user

    const { data: missions, isLoading, error, isValidating } =
        useSWR(`GetMissieDetail_${missieid}`, async () => { const response = await axiosPrivate(`${axiosUrls('MissieDetails')}/${missieid}`) ; return response.data }, {
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
    <Alert variant='primary'>
                Deelnemers
            </Alert>
    <Deelnemers missieid={missieid}/>
    </>
  )
}

export default MissieDetail