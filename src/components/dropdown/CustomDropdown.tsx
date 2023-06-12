import { Dropdown } from "flowbite-react";
import { FC, ReactNode } from "react";
import { IconBaseProps } from "react-icons";

const CustomDropdown: FC<{ children?: ReactNode, text: string, icon?: IconBaseProps, className?:string }> =
    function ({ children, text, icon, className }) {
        return (
            <Dropdown
                color="gray"
                label={
                    <div className={`flex items-center gap-3 ${className}`}>
                        <>{icon}</>
                        {text}
                    </div>
                }
            >
                {children}
            </Dropdown>
        )
    }

export default CustomDropdown;