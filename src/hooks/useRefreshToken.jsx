import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post('/auth/NewAccessToken', undefined,{
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        setAuth(prev => {
            return {
                ...prev,
                rollen: response.data.rollen,
                accessToken: response.data.accessToken
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;