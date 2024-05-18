import { axiosPrivateFile } from "../api/axios"
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import isJwtTokenExpired from "jwt-check-expiry";

const useAxiosPrivateFile = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivateFile.interceptors.request.use(
            async config => {

                    //console.log(`Token ongeldig? : ${isJwtTokenExpired(auth?.accessToken)}`)
                    if(isJwtTokenExpired(auth?.accessToken)){
                        const newAccessToken = await refresh()
                        console.log(`Nieuw accesstoken: ${newAccessToken}`)
                    }
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                    config.headers['Content-Type'] = 'multipart/form-data'
                
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivateFile.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if ((error?.response?.status === 401 )&& !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    prevRequest.headers['Content-Type'] = 'multipart/form-data'
                    return axiosPrivateFile(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivateFile.interceptors.request.eject(requestIntercept);
            axiosPrivateFile.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosPrivateFile;
}

export default useAxiosPrivateFile
