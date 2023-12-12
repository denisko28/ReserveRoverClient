import { FC, ReactNode, useEffect, useState } from "react"
import styles from "./FriendsPage.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { Badge, TabsComponent } from "flowbite-react";
import TabItem from "flowbite-react/lib/esm/components/Tab/TabItem";
import FriendCard from "../../components/friend-card/FriendCard";
import SearchInput from "../../components/search-input/search-input";
import { acceptFriend, addFriend, fetchFriendRequests, fetchFriends, getFriendsCount, refuseFriend, 
    removeFriend, searchNewFriends } from "../../redux/slices/friendsSlice";
import FriendRequestCard from "../../components/friend-card/FriendRequestCard";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";
import PublicUserCard from "../../components/friend-card/PublicUserCard";
import { HiOutlineArchive, HiOutlineCheckCircle, HiOutlineInbox, HiOutlineUsers } from "react-icons/hi";

const FriendsPage: FC = function () {
    const { status, error, publicUsers, friendships, friendsCount } = useAppSelector(state => state.friends);
    const dispatch = useAppDispatch();

    const [activeTab, setActiveTab] = useState<number>();
    const [myFriendsSearchQuery, setMyFriendsSearchQuery] = useState<string | null>(null);
    const [newFriendsSearchQuery, setNewFriendsSearchQuery] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchFriends(myFriendsSearchQuery));
        dispatch(getFriendsCount());
    }, [])

    const onTabChange = (activeTab: number) => {
        setActiveTab(activeTab);
        switch (activeTab) {
            case 0:
                dispatch(fetchFriends(myFriendsSearchQuery));
                break;
            case 1:
                dispatch(fetchFriendRequests())
                break;
            case 2:
                dispatch(searchNewFriends(newFriendsSearchQuery));
                break;
        }
    }

    var statusContent: ReactNode | null = <div className="flex flex-row items-center h-96"><LoadingIndicator /></div>
    if (status === 'failed') {
        statusContent = <p>{error}</p>;
    } else if (status === 'succeeded') {
        if ((activeTab !== 2 && friendships.length > 0) || (activeTab === 2 && publicUsers.length > 0))
            statusContent = null;
        else {
            statusContent = <div className="flex flex-col w-full items-center 
                justify-center gap-2 h-96 rounded-lg border">
                <HiOutlineUsers className="text-gray-500" size={80} />
                <p className='text-gray-500 font-medium'>Список порожній</p>
            </div>
        }
    }

    return (
        <div className={`w-full bg-white ${styles["friends-page"]}`}>
            <div>
                <h3 className="text-3xl font-bold mb-1">
                    Друзі
                </h3>
                <p className="text-base text-gray-500 dark:text-gray-300">
                    Тут ви можете додавати, видаляти та переглядати друзів
                </p>
            </div>
            <div className="flex flex-row gap-3">
                <TabsComponent className="w-full gap-4" style="underline" onActiveTabChange={onTabChange}>
                    <TabItem title={
                        <div className="flex flex-row gap-3 items-center">
                            <h3>МОЇ ДРУЗІ</h3>
                            <Badge color="red">{friendsCount?.friendsCount}</Badge>
                        </div>} >
                        <div className="flex flex-col gap-3">
                            <SearchInput className="w-96" placeholder="Введіть ім'я друга..."
                                onChange={(e) => setMyFriendsSearchQuery(e.target.value)}
                                onSubmit={() => dispatch(fetchFriends(myFriendsSearchQuery))} />
                            {
                                statusContent ??
                                <div className={styles["cards-cont"]}>
                                    {
                                        friendships.map((friendship, index) =>
                                            <FriendCard key={index} friendship={friendship}
                                                onRemoveFriendClick={friendshipId =>
                                                    removeFriend(friendshipId)} />)
                                    }
                                </div>
                            }
                        </div>
                    </TabItem>
                    <TabItem title={
                        <div className="flex flex-row gap-3 items-center">
                            <h3>ЗАПИТИ В ДРУЗІ</h3>
                            <Badge color="red">{friendsCount?.requestsCount}</Badge>
                        </div>} >
                        <div className="flex flex-col gap-3">
                            <div className={styles["cards-cont"]}>
                                {
                                    statusContent ??
                                    friendships.map((friendship, index) =>
                                        <FriendRequestCard
                                            onAcceptClick={(friendshipId => acceptFriend(friendshipId))}
                                            onRefuseClick={friendshipId => refuseFriend(friendshipId)}
                                            friendship={friendship} key={index} />
                                    )
                                }
                            </div>
                        </div>
                    </TabItem>
                    <TabItem title="ПОШУК ДРУЗІВ">
                        <div className="flex flex-col gap-3">
                            <SearchInput className="w-96" placeholder="Введіть ім'я..."
                                onChange={(e) => setNewFriendsSearchQuery(e.target.value)}
                                onSubmit={() => dispatch(searchNewFriends(newFriendsSearchQuery))} />
                            <div className={styles["cards-cont"]}>
                                {
                                    statusContent ??
                                    publicUsers.map((user, index) =>
                                        <PublicUserCard key={index}
                                            onAddFriendClick={(friendId) => addFriend(friendId)}
                                            publicUser={user} />
                                    )
                                }
                            </div>
                        </div>
                    </TabItem>
                </TabsComponent>
            </div>
        </div>
    )
}

export default FriendsPage;