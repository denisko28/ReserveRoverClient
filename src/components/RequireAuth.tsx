import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const RequireAuth: FC<{ allowedRoles?: Array<string>, allowAllRoles?: boolean, verifyEmail?: boolean }> =
    function ({ allowedRoles, allowAllRoles }) {
        const userRole = useSelector((state: RootState) => state.userInfo.role);
        const { currentUser, isLoading } = useAuth();

        return (
            isLoading
                ? null
                : (currentUser
                    ? allowAllRoles || (userRole && allowedRoles?.includes(userRole))
                        ? <Outlet />
                        : <Navigate to="/unauthorized" replace />
                    : <Navigate to="/auth" replace />)
        );
    }

export default RequireAuth;