import { FC, ReactNode } from "react";

export interface CustomModalProps {
    children?: ReactNode;
    isOpen: boolean;
    toggle: () => void;
    size?: string;
    className?: string;
}

const CustomModal: FC<CustomModalProps> = function(props) {
    const { size="3xl" } = props;

    return (
        <div id="popup-modal" onClick={() => props.toggle()} className={`${props.isOpen ? "" : "hidden"} fixed top-0 right-0 left-0 z-50 h-modal overflow-y-auto overflow-x-hidden md:inset-0 md:h-full items-center justify-center flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80`}>
            <div onClick={(e) => {e.stopPropagation();}} className={`relative w-full max-w-${size} max-h-full`}>
                <div className="relative bg-white rounded-3xl shadow dark:bg-gray-700">
                    <div className={`${props.className} p-6 text-center`}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomModal;