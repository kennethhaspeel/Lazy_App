import { useState, useEffect } from "react"
import { useSearchParams } from 'react-router-dom'

import useSWR from "swr"
import { GetMissions } from "../../../api/missieApi"
import axios, { axiosPrivate, axiosUrls } from "../../../api/axios"


const MissieDetail = () => {

    const { data: missions, isLoading, error } =
        useSWR('GetMissions', GetMissions, {
            onSuccess(data, key, config) {
                console.log(data)
            }
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