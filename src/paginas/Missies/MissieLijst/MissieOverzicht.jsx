
import useSWR from "swr"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { axiosUrls } from "../../../api/axios"
import { Suspense } from "react"
import SuspenseParagraaf from "../../../components/SuspenseParagraaf"
import { ListGroup } from "react-bootstrap"

const MissieOverzicht = () => {
    const axiosPrivate = useAxiosPrivate();
    const { data: missions, isLoading, error, isValidating } =
        useSWR('GetMissions', async () => { const response = await axiosPrivate(axiosUrls('GetAllMissions')); return response.data }, {
            onSuccess(data, key, config) {
                console.log(data)
            },
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                console.log(missions)
                if (error.status === 404) return
                if (retryCount >= 3) return
                
                revalidate({ retryCount })
            }

        })


    let content
    if (isLoading || isValidating) { content = <p>Loading</p> }
    if (error) { content = <p>{error.message}</p> }
    content =
        <ListGroup>
            {

                missions?.map((mission) => {
                    return <ListGroup.Item key={mission.id}>{mission.titel}</ListGroup.Item>
                })
            }
        </ListGroup>
    return (
        <main>
            <h2>Mission List</h2>
            {content}
        </main>
    )

}

export default MissieOverzicht