import { useState,useEffect } from 'react'
import axios, { axiosUrls } from '../../api/axios';
import useAuth from '../../hooks/useAuth';

const Loguit = () => {
    const { setAuth, persist, setPersist } = useAuth();
  const [loading, setLoading] = useState(false);

  const VerzendBevestiging = async () => {
    setLoading(true)
    try {
      const response = await axios.post(axiosUrls('loguit'),
        undefined,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true

        })
      console.log(response.data)
      setAuth({ });
      localStorage.setItem("persist", false);
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
    <h2>Uitloggen</h2>
      {loading ? (
        <p>Even geduld... U wordt uitgelogd</p>
      ) : (
        <p>U bent uitgelogd</p>
      )}
      
    </>
  )
}

export default Loguit