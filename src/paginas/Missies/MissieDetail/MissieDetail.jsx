import useSWR from "swr"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { axiosUrls } from "../../../api/axios"
import { Suspense } from "react"
import SuspenseParagraaf from "../../../components/SuspenseParagraaf"


const MissieDetail = () => {
    const axiosPrivate = useAxiosPrivate();
    const { data: missions, isLoading, error, isValidating } =
        useSWR('GetMissions', async () => { const response = await axiosPrivate(axiosUrls('GetOverzichtMissies')); return response.data }, {
            onSuccess(data, key, config) {
                console.log(data)
            },
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                if (error.status === 404) return
                if (retryCount >= 3) return
                revalidate({ retryCount })
            },
            suspense: true

        })
  return (
    <div>MissieDetail</div>
  )
}

export default MissieDetail