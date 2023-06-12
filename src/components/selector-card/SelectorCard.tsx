import { FC } from "react"
import styles from "./SelectorCard.module.scss"

const SelectorCard: FC<{ selected: boolean, value: string, title: string, onClick?: () => void, 
    className?: string }> = function ({ selected, value, title, onClick, className }) {
        return (
            <div className={`${styles["selector-card"]} ${className} ${selected ? styles["selected"] : ""}`}
                onClick={() => onClick?.()}>
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-base font-medium">{title}</p>
            </div>
        )
    }

export default SelectorCard;