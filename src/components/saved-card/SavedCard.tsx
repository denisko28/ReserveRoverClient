import { FC } from "react";
import styles from "./SavedCard.module.scss"
import { HiChevronRight, HiOutlineTrash } from "react-icons/hi";
import { Button } from "flowbite-react";

interface SavedCardProps {
    title: string,
    imgUrl: string,
    placeLink: string
}

const ReservationCard: FC<SavedCardProps> = function (props) {
    return (
        <div className={`${styles["reserv-card"]}`}>
            <img src={props.imgUrl} />
            <div className={styles["info"]}>
                <a href={props.placeLink} className="flex flex-col w-fit">
                    <div className="flex flex-row gap-2 items-center">
                        Переглянути деталі
                        <HiChevronRight className="icon-24" />
                    </div>
                    <p className="text-2xl mb-1 font-bold">
                        {props.title}
                    </p>
                </a>
                <Button color="gray" size="xs" className="w-fit icon-button">
                    <HiOutlineTrash className="icon-16" />
                    Видалити зі збережених
                </Button>
                <br />
            </div>
        </div>
    )
}

export default ReservationCard;