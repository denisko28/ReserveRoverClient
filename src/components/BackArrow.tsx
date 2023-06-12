import { FC } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router";

const BackArrow: FC<{className?: string, children: string}> = function ({className, children}) {
    const navigate = useNavigate();

    return (
        <a className={`flex flex-row items-center gap-2 my-4 cursor-pointer w-auto font-medium ${className}`} onClick={() => navigate(-1)}>
            <HiArrowNarrowLeft className="icon-16" />
            {children}
        </a>
    )
}

export default BackArrow;