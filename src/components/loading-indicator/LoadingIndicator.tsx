
import { FC } from 'react'
import styles from "./LoadingIndicator.module.scss"

const LoadingIndicator: FC = () => {
    return (
        <div className="mx-auto flex flex-row justify-center">
            <div className={styles["dot-elastic"]}/>
        </div>
    )
}

export default LoadingIndicator;
