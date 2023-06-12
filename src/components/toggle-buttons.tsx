import { Button } from 'flowbite-react'
import { FC, useState } from 'react'


const ToggleButtons: FC<{ members: Array<string>, onChange?: (index: number) => void }> = function ({ members, onChange }) {
    const [selectedIndex, setSelectedIndex] = useState<number>(0)

    const handleClick = (index: number) => {
        setSelectedIndex(index);
        onChange?.(index);
    }

    return (
        <Button.Group>
            {
                members.map((member, index) =>
                    <Button key={index} color="gray" onClick={() => handleClick(index)}
                        className={index == selectedIndex ? 
                            "bg-primary-500 border border-yellow-300 hover:bg-primary-500" : ""}>
                        {member}
                    </Button>
                )
            }
        </Button.Group>
    )
}

export default ToggleButtons
