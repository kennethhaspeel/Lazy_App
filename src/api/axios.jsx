import axios from 'axios';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

export const axiosUrls = (url) => {
    const overzicht = {
      base_url: 'https://api.lazy-company.be',
        base_url_dev: 'https://localhost:7023',
        login: '/Auth/login',
        loguit: 'Auth/loguit',
        registratie: 'Auth/registreer',
        bevestigRegistratie: 'Auth/BevestigRegistratie',
        paswoordvergeten: 'Auth/PaswoordVergeten',
        paswoordinstellen: 'Auth/PaswoordInstellen',
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
        PostMissieEtappe: 'MissieEtappe/PostNieuweEtappe',
        DeleteEtappe: '/MissieEtappe/DeleteEtappe',
        GetMissieEtappeKosten: '/MissieEtappeKost/GetMissieEtappeKosten',
        PostMissieEtappeKost: '/MissieEtappeKost/PostMissieEtappeKost',
        PostMissieAfsluiten:'/Missie/PostMissieAfsluiten',

        PostBestand:'/FileManagement/PostBestand',
        GetEtappeBestanden:'/FileManagement/GetEtappeBestanden',
        GetImageGalleryBestanden:'/FileManagement/GetImageGalleryBestanden',
        }

    return overzicht[url]
}

export default axios.create({
    baseURL: window.location.hostname ==='localhost' ? axiosUrls('base_url_dev') : axiosUrls('base_url')
});

export const axiosPrivate = axios.create({
    baseURL: window.location.hostname ==='localhost' ? axiosUrls('base_url_dev') : axiosUrls('base_url'),
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const axiosPrivateFile = axios.create({
    baseURL: window.location.hostname ==='localhost' ? axiosUrls('base_url_dev') : axiosUrls('base_url'),
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
});

// export const axiosSecure = axios.create({
//     baseURL: axiosUrls('base_url'),
//     headers: { 'Content-Type': 'multipart/form-data' },
//     withCredentials: true
// });

// axiosSecure.interceptors.response.use(
//     response=>response,
//     async (error) => {
//         const prevRequest = error?.config;
//         if ((error?.response?.status === 401 )&& !prevRequest?.sent) {
//             prevRequest.sent = true;
//             const newAccessToken = await refresh();
//             prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//             return axiosPrivate(prevRequest);
//         }
//         return Promise.reject(error);
//     }
// )

