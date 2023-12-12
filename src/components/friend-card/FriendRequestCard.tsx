import { FC, useState } from "react";
import styles from "./FriendCard.module.scss"
import { HiCheck, HiCheckCircle, HiOutlineX } from "react-icons/hi";
import { Button } from "flowbite-react";
import IconAndInfo from "../icon-and-info";
import LoadingIndicator from "../loading-indicator/LoadingIndicator";
import { Friendship } from "../../redux/slices/friendsSlice";
import { Link } from "react-router-dom";

enum ButtonState {
    Initial,
    Pending,
    SuccessAccepted,
    SuccessRefused
}

interface FriendRequestCardProps {
    friendship: Friendship;
    onAcceptClick: (friendshipId: string) => Promise<boolean>;
    onRefuseClick: (friendshipId: string) => Promise<boolean>;
}

const FriendRequestCard: FC<FriendRequestCardProps> = function (props) {
    const [buttonState, setButtonState] = useState<ButtonState>(ButtonState.Initial);

    const onAcceptClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        props.onAcceptClick(props.friendship.id)
            .then((success) => setButtonState(success ? ButtonState.SuccessAccepted : ButtonState.Initial));
    }

    const onRefuseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        props.onRefuseClick(props.friendship.id)
            .then((success) => setButtonState(success ? ButtonState.SuccessRefused : ButtonState.Initial));
    }

    var innerContent = null;

    switch (buttonState) {
        case ButtonState.Pending:
            <LoadingIndicator/>
            break;
        case ButtonState.SuccessAccepted:
            innerContent = <IconAndInfo className="font-medium text-gray-500"
                icon={<HiCheckCircle size={25} className='text-green-500' />}
                info="Запит прийнято" />
            break;
        case ButtonState.SuccessRefused:
            innerContent = <IconAndInfo className="font-medium text-gray-500"
                icon={<HiCheckCircle size={25} className='text-green-500' />}
                info="Запит відхилено" />
            break;
        default:
            innerContent = <div className="flex flex-col gap-y-2">
                <p className="text-base text-gray-500">Прийняти запит у друзі?</p>
                <div className="flex flex-row gap-3">
                    <Button onClick={onAcceptClick} color="primary" size="xs"
                        className={`w-fit icon-button border-none}`}>
                        <HiCheck className="icon-16" />
                        Так
                    </Button>
                    <Button onClick={onRefuseClick} color="gray" size="xs" className={`w-fit icon-button`}>
                        <HiOutlineX className="icon-16" />
                        Ні
                    </Button>
                </div>
            </div>;
            break;
    }

    const friendLink = "/friend/" + props.friendship.friendId;

    return (
        <Link to={friendLink} className={`${styles["friend-card"]} rounded-2xl p-4 border `}>
            <img src={props.friendship.avatar ?? "../../images/users/no-avatar.svg"} />
            <div className={styles["info"]}>
                <p className="text-lg mb-1 font-semibold font-medium">
                    {props.friendship.firstName + " " + props.friendship.lastName}
                </p>
                {innerContent}
            </div>
        </Link>
    )
}

export default FriendRequestCard;