import { FC } from "react";
import styles from "./ReservationCard.module.scss"
import { HiChevronRight, HiOutlineClock, HiOutlineUsers } from "react-icons/hi";
import IconAndInfo from "../icon-and-info";
import StatusBadge from "../status-badge/StatusBadge";
import { UserReservation } from "../../redux/slices/reservationSlice";
import { format, formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";

const ReservationCard: FC<{ reservation: UserReservation, onClick: (reservation : UserReservation) => void }> = function ({ reservation, onClick }) {
  const reservDateTime = format(new Date(reservation.reservDate), "d MMMM", { locale: uk }) +
    `, ${reservation.beginTime.slice(0, -3)} - ${reservation.endTime.slice(0, -3)}`;

  return (
    <div className={`${styles["reserv-card"]}`} onClick={() => onClick(reservation)}>
      <img src={reservation.placeImageUrl} />
      <div className={styles["info"]}>
        <div className="w-full flex flex-row justify-between items-center">
          <p className="flex flex-row gap-2 items-center">
            Переглянути деталі
            <HiChevronRight className="icon-24" />
          </p>
          <p className="text-gray-400 text-sm">
            {"Створено: " + formatDistanceToNow(
              new Date(reservation.creationDateTime), { locale: uk, addSuffix: true })}
          </p>
        </div>
        <a href={"/details/" + reservation.placeId} onClick={(e) => {e.stopPropagation();}} className="text-2xl w-fit mb-1 font-bold hover:underline">
          {reservation.placeTitle}
        </a>
        <div className="flex flex-row flex-wrap gap-3 mb-2">
          <IconAndInfo className={styles["info-badge"]}
            icon={<HiOutlineClock className="icon-16" />}
            info={reservDateTime} />
          <IconAndInfo className={styles["info-badge"]}
            icon={<HiOutlineUsers className="icon-16" />} info={`${reservation.peopleNum} особи`} />
        </div>
        <StatusBadge status={reservation.status} />
      </div>
    </div>
  )
}

export default ReservationCard;