import { FC } from "react"
import { IconBaseProps } from "react-icons";

const IconAndInfo: FC<{ icon: IconBaseProps, info: string, className?: string }> = function ({ 
    icon, info, className }) {
    return (
        <div className={`flex gap-2 items-center ${className}`}>
            <>{icon}</>
            <p>{info}</p>
        </div>
    )
}

export default IconAndInfo;