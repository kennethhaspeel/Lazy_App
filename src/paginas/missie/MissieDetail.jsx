import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { axiosUrls } from '../../api/axios'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { format,parse,isValid } from 'date-fns'
import useAuth from "../../hooks/useAuth"

const MissieDetail = () => {
    const [queryParam] = useSearchParams()
    const missieid = queryParam.get("missieid")
    const { auth } = useAuth()
    const currentUser = auth?.user
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(true)
    const [allesInOrde, setAllesInOrde] = useState(true)
    const [foutmelding, setFoutmelding] = useState([])
    const [allesBewaard, setAllesBewaard] = useState(false)

    const [missie,setMissie]=useState()

    
  return (
    <>
    <h2>Details Missie</h2>
        <div>{missieid}</div>
    </>

  )
}

export default MissieDetail