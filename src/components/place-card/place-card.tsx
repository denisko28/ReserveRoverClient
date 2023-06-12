import { FC } from "react";
import styles from "./place-card.module.scss"
import IconAndInfo from "../icon-and-info";
import { HiOutlineClock, HiOutlineStar } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Place } from "../../redux/slices/placesSlice";
import { format, parse } from "date-fns";

const PlaceCard: FC<{ place: Place }> = function ({ place }) {
    const openingTime = format(parse(place.opensAt, 'HH:mm:ss', new Date()), "HH:mm");
    const closingTime = format(parse(place.closesAt, 'HH:mm:ss', new Date()), "HH:mm");

    return (
        <Link to={`/details/${place.id}`} className={`bg-white ${styles["card"]}`}>
            <img src={place.mainImageUrl} />
            <div className={styles["info-panel"]}>
                <h2 className="font-medium text-lg">{place.title}</h2>
                <div className="flex gap-5">
                    <IconAndInfo icon={<HiOutlineClock className="icon-16" />} info={openingTime + "-" + closingTime} />
                    <IconAndInfo icon={<HiOutlineStar className="icon-16" />} info={place.avgMark?.toString() ?? "..."} />
                </div>
            </div>
        </Link>
    )
}

export default PlaceCard;