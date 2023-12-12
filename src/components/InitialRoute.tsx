import { FC } from "react"
import useAuth, { UserRoles } from "../hooks/useAuth"
import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../hooks/redux-hooks";

const InitialRoute: FC = function () {
    const userRole = useAppSelector(state => state.userInfo.role);
    const { currentUser } = useAuth();
    const location = useLocation();

    if (currentUser && currentUser.email && !currentUser.emailVerified)
        return <Navigate to="/auth/email-verif" replace />

    if (currentUser && (!currentUser.displayName || currentUser.displayName.length <= 0))
        return <Navigate to="/auth/set-profile" replace />;

    if (location.pathname !== "/")
        return <Outlet />;

    switch (userRole) {
        case UserRoles.Admin:
            return <Navigate to="/admin" replace />;
        case UserRoles.Moderator:
            return <Navigate to="/moderation" replace />;
        case UserRoles.Manager:
            return <Navigate to="/place-reservs" replace />;
        case UserRoles.User:
            return <Navigate to="/main" replace />;
        default:
            return <Navigate to="/main" replace />;
    }
}

export default InitialRoute
