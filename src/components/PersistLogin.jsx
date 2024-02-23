import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                console.log('accestoken via persistlogin')
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                console.log(auth?.accessToken)
                isMounted && setIsLoading(false);
            }
        }
        console.log(auth?.accessToken)
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);
        return () => isMounted = false;
    }, [])

    // useEffect(() => {
    //     console.log(`isLoading: ${isLoading}`)
    //     console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    // }, [isLoading])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin