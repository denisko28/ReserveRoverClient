import { FC, useEffect, useState } from "react";
import { Avatar, Badge, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import styles from './navbar.module.scss';
import { HiChevronDown, HiChevronRight, HiOutlineBookmark, HiOutlineChatAlt2, HiOutlineFlag, HiOutlineIdentification, HiOutlineKey, HiOutlineLocationMarker, HiOutlineLogout, HiOutlineSearch, HiOutlineUsers } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Skeleton from "react-loading-skeleton";
import useModal from "../../hooks/useModal";
import CustomModal from "../modals/CustomModal";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { City, fetchCities } from "../../redux/slices/citiesSlice";
import { setUserCity } from '../../redux/slices/userInfoSlice';
import SearchInput from "../search-input/search-input";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { serverUrl } from "../../services/axios-config";

const CustomNavbar: FC = function () {
  const { currentUser, isLoading, signOutRequest } = useAuth();
  console.log(currentUser);
  const [searchString, setSearchString] = useState<string | null>(null);
  const [messagesNum, setMessagesNum] = useState<number>(0);
  const navigator = useNavigate();
  const { isOpen, toggle } = useModal();

  const { cities: citiesSelector, userInfo } = useAppSelector(state => state);
  const { cities } = citiesSelector;
  const { city } = userInfo;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch])

  useEffect(() => {
    if (!currentUser)
      return;

    const startHubConnection = async () => {

      const connection = new HubConnectionBuilder()
        .withUrl(serverUrl + "/chatHub", {
          accessTokenFactory: async () =>
            `${await currentUser.getIdToken()}`
        })
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveMessage", (_: any) => {
        setMessagesNum(prevMessagesNum => prevMessagesNum + 1);
      });
      await connection.start();
    }
    startHubConnection().catch(console.error);
  }, [currentUser]);

  const onSignOut = () => {
    signOutRequest().then(() => navigator("/"));
  }

  const onSearchClick = () => {
    if (searchString == "" || searchString == null) {
      navigator("/main");
      return;
    }

    navigator({
      pathname: "/main",
      search: new URLSearchParams({ searchString }).toString(),
    });
  }

  const onCityChange = (newCity: City) => {
    dispatch(setUserCity(newCity));
    toggle();
  }

  return (
    <Navbar className={styles["custom-navbar"]}>
      <div className="w-full flex items-center justify-between gap-10 py-3">
        <div className="flex items-center">
          <Navbar.Brand href="/" className="w-56">
            <img alt="" src="/images/logo.svg" className="mr-4 h-6 sm:h-11" />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              RESERVE ROVER
            </span>
          </Navbar.Brand>
        </div>
        <div className="flex w-full justify-center items-center gap-5">
          <SearchInput
            placeholder="Введіть назву закладу..."
            onChange={(e) => setSearchString(e.target.value)}
            onSubmit={onSearchClick}
          />
          <Button color="light" className={`${styles["city-picker"]}`} onClick={toggle}>
            <HiOutlineLocationMarker className="icon-16" />
            {city.name}
            <HiChevronDown className="icon-16" />
          </Button>
        </div>
        <Navbar.Collapse className={styles["collapse"]}>
          {
            isLoading
              ? <Skeleton style={{width: 439}} count={2} />
              : (currentUser
                ? <div className='block md:flex gap-3'>
                  <Navbar.Link href='/user-reservations' className='w-screen md:w-auto'>
                    <div className='flex md:flex-col items-center'>
                      <HiOutlineFlag className="icon-24" />
                      <span>Мої резервації</span>
                    </div>
                  </Navbar.Link>
                  <Navbar.Link href='/user-saved' className='w-screen md:w-auto'>
                    <div className='flex md:flex-col items-center'>
                      <HiOutlineBookmark className="icon-24" />
                      <span >Збережені</span>
                    </div>
                  </Navbar.Link>
                  <Navbar.Link href='/friends' className='w-screen md:w-auto'>
                    <div className='flex md:flex-col items-center'>
                      <HiOutlineUsers className="icon-24" />
                      <span>Друзі</span>
                    </div>
                  </Navbar.Link>
                  <Navbar.Link href='/chats' className='w-screen md:w-auto'>
                    <div className='flex md:flex-col items-center'>
                      <div className="relative">
                        <HiOutlineChatAlt2 className="icon-24" />
                        {messagesNum > 0 &&
                          <Badge color="red" className="badge-corner">{messagesNum}</Badge>}
                      </div>
                      <span>Повідомлення</span>
                    </div>
                  </Navbar.Link>
                  <div className='flex md:order-2 w-11'>
                    <Dropdown
                      arrowIcon={false}
                      inline={true}
                      className={styles["dropdown"]}
                      label={
                        <Avatar
                          alt='User settings'
                          img={(currentUser.photoURL) ?? ""}
                        />
                      }>
                      <Dropdown.Header>
                        <span className='block text-sm'>{currentUser?.displayName}</span>
                      </Dropdown.Header>
                      <Dropdown.Item>
                        <HiOutlineIdentification className="icon-24" />
                        Профіль
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <HiOutlineKey className="icon-24" />
                        Налаштування безпеки
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={onSignOut}>
                        <HiOutlineLogout className="icon-24" />
                        Вихід
                      </Dropdown.Item>
                    </Dropdown>
                    <Navbar.Toggle />
                  </div>
                </div>
                : <div className="flex flex-row gap-4">
                  <Link to="/auth"><Button color="gray">Увійти</Button></Link>
                  <Link to="/auth"><Button color="primary">Зареєструватися</Button></Link>
                </div>
              )
          }
        </Navbar.Collapse>
      </div>
      <CustomModal
        isOpen={isOpen}
        toggle={toggle}
        size="sm"
        className="flex flex-col gap-2 items-center"
      >
        <h3 className="text-xl flex flex-row gap-3 font-medium mb-3 items-center">
          <HiOutlineLocationMarker className="icon-24" />
          Оберіть ваше місто
        </h3>
        <TextInput className="w-full" icon={HiOutlineSearch} placeholder="Назва міста..." />
        <div className="w-full">
          {
            cities.map((city, index) =>
              <div key={index} onClick={() => onCityChange(city)}
                className="py-3 px-3 text-sm flex flex-row justify-between border-b font-medium hover:bg-gray-100">
                {city.name}
                <HiChevronRight className="text-gray-500 icon-16" />
              </div>
            )
          }
        </div>
      </CustomModal>
    </Navbar >
  );
};

export default CustomNavbar;

