import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const AuthRequired = ({allowedRoles}) => {
    const { auth } = useAuth();
    const location = useLocation();
    return (
        auth?.rollen?.find(role=> allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.user 
                ? <Navigate to="identity/geentoegang" state={{ from: location }} replace />
                : <Navigate to="identity/login" state={{ from: location }} replace />

    )
}

export default AuthRequired