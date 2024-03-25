import axios from 'axios';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

export const axiosUrls = (url) => {
    const overzicht = {
        base_url: 'https://lazy-api.azurewebsites.net',
        //base_url: 'https://localhost:7023',
        login: '/Auth/login',
        loguit: 'Auth/loguit',
        registratie: 'Auth/registreer',
        bevestigRegistratie: 'Auth/BevestigRegistratie',
        GetOverzichtTransacties: 'Financieel/GetOverzichtTransacties',
        NieuweTransactie: 'Financieel/NieuweTransactie',
        GetAllUsers: 'user/GetAllUsers',
        GetAllMissions: 'missie/GetAllMissions',
        GetOverzichtMissies: 'missie/GetOverzichtMissies',
        NieuweMissie: 'missie/NieuweMissie',
        GetMissieDetail: 'missie/GetMissieDetail',
        PostMissieDetail: 'missie/PostMissieDetail',
        GetMissieDeelnemers: 'MissieDeelnemer/GetMissieDeelnemers',
        UpdateMissieDeelnemer: 'MissieDeelnemer/UpdateMissieDeelnemer',

        GetMissieEtappes: '/MissieEtappe/GetMissieEtappes',
        PostMissieEtappe: 'MissieEtappe/NieuweEtappe'
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



export const axiosSecure = axios.create({
    baseURL: axiosUrls('base_url'),
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

axiosSecure.interceptors.response.use(
    response=>response,
    async (error) => {
        const prevRequest = error?.config;
        if ((error?.response?.status === 401 )&& !prevRequest?.sent) {
            prevRequest.sent = true;
            const newAccessToken = await refresh();
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
    }
)

