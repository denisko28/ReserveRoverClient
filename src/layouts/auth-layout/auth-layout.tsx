import { FC } from "react"
import { Outlet } from "react-router"
import { Link } from "react-router-dom";
import styles from "./auth-layout.module.scss"

const AuthLayout: FC = function () {
    return (
        <div className="flex flex-crow items-center justify-between h-screen">
            <div className={styles["left-part"]}>
                <Link to="/" className="flex items-center gap-x-1">
                    <img alt="" src="/images/logo.svg" className="mr-4 h-6 sm:h-11" />
                    <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                        RESERVE ROVER
                    </span>
                </Link>
                <Outlet />
                <p className="my-8 text-sm text-gray-500 dark:text-gray-300">
                    &copy; 2023 ReserveRover.com. All rights reserved.
                </p>
            </div>
            <div className={styles["right-part"]}>
                <img src="/images/auth/auth-illustr.png" />
            </div>
        </div>
    )
}

export default AuthLayout;