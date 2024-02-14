import { useState, useEffect } from "react"
import { useSearchParams } from 'react-router-dom'

import useSWR from "swr"
import { getMissions, missionEndpoint } from "../../../api/missieApi"


const MissieDetail = () => {
    const {
        data,
        isLoading,
        error

    } = useSWR(missionEndpoint, getMissions())


    if (isLoading) return <p>Loading...</p>

    if (error) return <p>{error.message}</p>

    return (
        <>
            <h2>Mission List</h2>
            <div>
                {
                    data.map(mission => {
                        <p key={mission.id}>{mission.titel}</p>
                    })
                }
            </div>
        </>
    )

}

export default MissieDetail