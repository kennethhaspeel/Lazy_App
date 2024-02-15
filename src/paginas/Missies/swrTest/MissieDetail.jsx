import { useState, useEffect } from "react"
import { useSearchParams } from 'react-router-dom'

import useSWR from "swr"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { axiosUrls } from "../../../api/axios"


const MissieDetail = () => {
    const axiosPrivate = useAxiosPrivate();
    const { data: missions, isLoading, error } =
        useSWR('GetMissions', async ()=>{const response = await axiosPrivate(axiosUrls('GetAllMissions')); return response.data}, {
            // onSuccess(data, key, config) {
            //     console.log(data)
            // }
        })


    let content
    if (isLoading) { content = <p>Loading...</p> }
    if (error) { content = <p>{error.message}</p> }
    content =
        <ul>
            {
                missions?.length ? (
                    missions.map((mission) => {
                        return <li key={mission.id}>{mission.titel}</li>
                    })) : (
                    <li>Geen gegevens</li>
                )
            }
        </ul>
    return (
        <main>
            <h2>Mission List</h2>
            {content}
        </main>
    )

}

export default MissieDetail