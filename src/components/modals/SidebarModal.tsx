import { FC, ReactNode } from "react";
import { HiX } from "react-icons/hi";

export interface SidebarModalProps {
    children?: ReactNode;
    headerText?: string;
    footerContent?: ReactNode;
    isOpen: boolean;
    toggle: () => void;
    className?: string;
    size?: "sm" | "lg";
}

const SidebarModal: FC<SidebarModalProps> = function (props) {
    var sizeStyle = "";
    switch (props.size) {
        case "lg":
            sizeStyle = "max-w-4xl"
            break;
        default:
            sizeStyle = "max-w-md"
            break;
    }

    const hasFooter = props.footerContent ? true : false;

    return (
        <div id="popup-modal" onClick={() => props.toggle()} className={`${props.isOpen ? "" : "hidden"} fixed top-0 right-0 left-0 z-50 h-modal overflow-x-hidden md:inset-0 md:h-full items-center justify-center flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80`}>
            <div onClick={(e) => { e.stopPropagation(); }} className={"fixed top-0 bottom-0 right-0 z-50 p-4 overflow-x-hidden"}>
                <div className={`relative bg-white rounded-2xl shadow dark:bg-gray-700 h-full ${sizeStyle}`}>
                    <div className="flex items-center justify-between rounded-t dark:border-gray-600 border-b p-5">
                        <h3 className="text-md font-medium text-gray-900">
                            {props.headerText}
                        </h3>
                        <button onClick={() => props.toggle()}><HiX className="icon-24 text-gray-500" /></button>
                    </div>
                    <div className="overflow-y-scroll" style={{ height: `calc(100% - ${hasFooter ? "9.5rem" : "4rem"})` }}>
                        <div className={`${props.className} p-6`}>
                            {props.children}
                        </div>
                    </div>
                    {
                        hasFooter && <div className="flex items-center justify-end p-5 gap-4 border-t border-gray-200 rounded-b dark:border-gray-600">
                            {props.footerContent}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default SidebarModal;