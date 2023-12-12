import { FC, useState } from "react";
import styles from "./FriendCard.module.scss"
import { HiCheckCircle, HiOutlinePencilAlt, HiOutlineX } from "react-icons/hi";
import { Button } from "flowbite-react";
import IconAndInfo from "../icon-and-info";
import { Friendship } from "../../redux/slices/friendsSlice";
import { Link } from "react-router-dom";

enum ButtonState {
    Initial,
    Pending,
    Success
}

interface FriendCardProps {
    friendship: Friendship
    onWriteMessageClick?: (friendId: string) => Promise<boolean>;
    onRemoveFriendClick: (friendshipId: string) => Promise<boolean>;
}

const FriendCard: FC<FriendCardProps> = function (props) {
    const [buttonState, setButtonState] = useState<ButtonState>(ButtonState.Initial);

    const onWriteMessageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(!props.onWriteMessageClick)
            return;

        props.onWriteMessageClick(props.friendship.friendId);
    }

    const onDeleteUserClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        props.onRemoveFriendClick(props.friendship.id)
            .then((success) => setButtonState(success ? ButtonState.Success : ButtonState.Initial));
    }

    const friendLink = "/friend/" + props.friendship.id;

    return (
        <Link to={friendLink} className={`${styles["friend-card"]} rounded-2xl p-4 border `}>
            <div><img src={props.friendship.avatar ??  "../../images/users/no-avatar.svg"} /></div>
            <div className={styles["info"]}>
                <p className="text-lg mb-1 font-semibold font-medium">
                    {props.friendship.firstName + " " + props.friendship.lastName}
                </p>
                {
                    buttonState === ButtonState.Initial
                        ? <div className="flex flex-col gap-2">
                            <Button type="button" onClick={onWriteMessageClick} color="primary" size="xs" className={`w-fit icon-button 
                        bg-primary-500`}>
                                <HiOutlinePencilAlt className="icon-16" />
                                Повідомлення
                            </Button>
                            <Button onClick={onDeleteUserClick} color="gray" size="xs" className={`w-fit icon-button
                        border-none bg-gray-100`}>
                                <HiOutlineX className="icon-16" />
                                Видалити друга
                            </Button>
                        </div>
                        : <IconAndInfo className="font-medium text-gray-500"
                            icon={<HiCheckCircle size={25} className='text-green-500' />}
                            info="Друга успішно видалено" />
                }
            </div>
        </Link>
    )
}

export default FriendCard;