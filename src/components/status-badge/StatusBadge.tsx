import { FC } from "react"
import IconAndInfo from "../icon-and-info"
import { IconType } from "react-icons"
import { HiOutlineCheck, HiOutlineX } from "react-icons/hi"

export enum ReservStatus {
    RESERVED,
    DONE,
    CANCELED
}

interface AssociativeArray {
    [key: number]: {icon: IconType, text: string, color: string, fontColor: string}
 }

const stateIcons: AssociativeArray = {
    [ReservStatus.RESERVED]: {icon: HiOutlineCheck, text: "Зарезервовано", color: "bg-green-100", fontColor: "text-green-600"},
    [ReservStatus.DONE]: {icon: HiOutlineCheck, text: "Виконано", color: "bg-gray-100", fontColor: "text-gray-600"},
    [ReservStatus.CANCELED]: {icon: HiOutlineX, text: "Скасовано", color: "bg-red-100", fontColor: "text-red-600"}
}

const StatusBadge: FC<{ status: ReservStatus }> = function ({status}) {
    const combo = stateIcons[status];
    if(!combo)
        return null;

    return (
        <IconAndInfo className={`w-fit px-3 py-1 text-sm font-medium rounded-full ${combo.color} ${combo.fontColor}`}
            icon={<combo.icon className="icon-16" />} info={combo.text} />
    )
}

export default StatusBadge;