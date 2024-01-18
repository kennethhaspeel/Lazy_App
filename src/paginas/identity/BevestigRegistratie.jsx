import { useState,useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios, { axiosUrls } from '../../api/axios';

const BevestigRegistratie = () => {
  const [loading, setLoading] = useState(false);
  const [queryParam] = useSearchParams()
  const data = {
    uuid: queryParam.get("uuid"),
    email: queryParam.get("email"),
    token: queryParam.get("token")
  }

  const VerzendBevestiging = async () => {
    setLoading(true)
    try {
      const response = await axios.post(axiosUrls('bevestigRegistratie'),
        JSON.stringify(data),
        {
          headers: { 'Content-Type': 'application/json' }
        })
      console.log(response.data)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    } 

  }
useEffect(()=>{
  VerzendBevestiging()
},[])
  
  return (
    <>
    <h2>Bevestig Registratie</h2>
      {loading ? (
        <p>Even geduld... De bevestiging van uw registratie wordt verwerkt</p>
      ) : (
        <p>Uw registratie werd verwerkt. U kunt nu inloggen</p>
      )}
      
    </>
  )
}

export default BevestigRegistratie