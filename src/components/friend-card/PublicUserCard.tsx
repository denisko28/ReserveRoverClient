import { FC, useState } from "react";
import styles from "./FriendCard.module.scss"
import { HiCheckCircle, HiOutlineUserAdd } from "react-icons/hi";
import { Button } from "flowbite-react";
import IconAndInfo from "../icon-and-info";
import { PublicUser } from "../../redux/slices/friendsSlice";
import { Link } from "react-router-dom";

enum ButtonState {
    Initial,
    Pending,
    Success
}

interface PublicUserCardProps {
    publicUser: PublicUser;
    onAddFriendClick: (friendId: string) => Promise<boolean>;
}

const PublicUserCard: FC<PublicUserCardProps> = function (props) {
    const [buttonState, setButtonState] = useState<ButtonState>(ButtonState.Initial);

    const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        props.onAddFriendClick(props.publicUser.id)
            .then((success) => setButtonState(success ? ButtonState.Success : ButtonState.Initial));
    }

    const friendLink = "/friend/" + props.publicUser.id;

    return (
        <Link to={friendLink} className={`${styles["friend-card"]} rounded-2xl p-4 border `}>
            <div><img src={props.publicUser.avatar ?? "../../images/users/no-avatar.svg"} /></div>
            <div className={styles["info"]}>
                <p className="text-lg mb-1 font-semibold font-medium">
                    {props.publicUser.firstName + " " + props.publicUser.lastName}
                </p>
                {
                    buttonState === ButtonState.Initial
                        ? <Button onClick={onButtonClick} color="primary" size="xs"
                            className={`w-fit icon-button bg-primary-500`}>
                            <HiOutlineUserAdd className="icon-16" />
                            Додати друга
                        </Button>
                        : <IconAndInfo className="font-medium text-gray-500"
                            icon={<HiCheckCircle size={25} className='text-green-500' />}
                            info="Запит в друзі відправлено!" />
                }
            </div>
        </Link>
    )
}

export default PublicUserCard;