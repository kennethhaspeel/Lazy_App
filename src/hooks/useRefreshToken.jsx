import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post('/auth/NewAccessToken', undefined,{
            headers: { 'Content-Type': 'application/json', refresh: JSON.parse(localStorage.getItem('rt'))},
            withCredentials: true
        });
        setAuth(prev => {
            return {
                user : {
                    naam: response?.data?.naam,
                    voornaam: response?.data?.voornaam,
                    volledigenaam: response?.data?.volledigenaam,
                    username: response?.data?.username,
                    id: response?.data?.id
                },
                rollen: response.data.rollen,
                accessToken: response.data.accessToken
            }
        });
        sessionStorage.setItem('at',JSON.stringify(response.data.accessToken))
        localStorage.setItem('rt', JSON.stringify(response?.data?.refreshtoken))
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;