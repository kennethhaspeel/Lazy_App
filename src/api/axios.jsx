import axios from 'axios';

export const axiosUrls = (url)=>{
    const overzicht = {
        base_url:'https://localhost:7023',
        login:'/Auth/login',
        loguit: 'Auth/loguit',
        bevestigRegistratie: 'Auth/BevestigRegistratie'
    }

  return overzicht[url]
}

export default axios.create({
    baseURL: axiosUrls('base_url')
});

export const axiosPrivate = axios.create({
    baseURL: axiosUrls('base_url'),
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

