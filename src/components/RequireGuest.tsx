import { useLocation, Navigate, Outlet } from "react-router-dom";
import { FC } from "react";
import useAuth from "../hooks/useAuth";

const RequireGuest: FC = function () {
    const { currentUser } = useAuth();
    const location = useLocation();

    return (
        currentUser == null
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />
    );
}

export default RequireGuest;