import { Avatar, Sidebar } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import styles from "./custom-sidebar.module.scss"
import {
  HiOutlineClipboardCopy,
  HiOutlineFlag,
  HiOutlineIdentification,
  HiOutlineKey,
  HiOutlineLogout,
  HiOutlineOfficeBuilding,
  HiOutlineTemplate,
} from "react-icons/hi";
import useAuth, { UserRoles } from "../../hooks/useAuth";
import Skeleton from "react-loading-skeleton";
import { IconType } from "react-icons";
import { useAppSelector } from "../../hooks/redux-hooks";
import { useNavigate } from "react-router";

type SidebarItemData = {
  href: string;
  icon: IconType;
  text: string;
}

const MANAGER_ITEMS_DATA: SidebarItemData[] = [
  { href: "/place-reservs", icon: HiOutlineFlag, text: "Резервації" },
  { href: "/my-place/edit", icon: HiOutlineOfficeBuilding, text: "Мій заклад" },
  { href: "/tables", icon: HiOutlineTemplate, text: "Керування столиками" },
]

const MODERATOR_ITEMS_DATA: SidebarItemData[] = [
  { href: "/moderation", icon: HiOutlineClipboardCopy, text: "Запити на модерацію" },
]

const COMMON_ITEMS_DATA: SidebarItemData[] = [
  { href: "/profile", icon: HiOutlineIdentification, text: "Профіль" },
  { href: "/security", icon: HiOutlineKey, text: "Налаштування безпеки" }
]

const CustomSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState("");
  const { currentUser, isLoading, signOutRequest } = useAuth();
  const { role } = useAppSelector(state => state.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    const newPage = window.location.pathname;
    setCurrentPage(newPage);
  }, [setCurrentPage]);

  let sidebarItemData: SidebarItemData[];
  switch (role) {
    case UserRoles.Admin:
      sidebarItemData = [];
      break;
    case UserRoles.Moderator:
      sidebarItemData = MODERATOR_ITEMS_DATA;
      break;
    case UserRoles.Manager:
      sidebarItemData = MANAGER_ITEMS_DATA;
      break;
    default:
      sidebarItemData = [];
      break;
  }

  return (
    <Sidebar className={styles["sidebar"]}>
      <div>
        <div className="flex flex-row px-3 mb-5">
          <img alt="" src="/images/logo.svg" className="mr-4 h-6 sm:h-11" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            RESERVE ROVER
          </span>
        </div>
        <div className="flex flex-row gap-5 items-center bg-primary-400 rounded-xl p-3 mb-3 h-16">
          {
            isLoading
              ? <Skeleton containerClassName="w-full" count={2} baseColor="#fff6d4" />
              : <>
                <Avatar
                  alt='User settings'
                  img={(currentUser?.photoURL) ?? ""}
                />
                <div>
                  <span className='block text-sm font-medium'>{currentUser?.displayName}</span>
                  <span className='block text-xs'>Менеджер</span>
                </div>
              </>
          }
        </div>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            {
              sidebarItemData.map(item =>
                <Sidebar.Item
                  {...item}
                  key={item.href}
                  className={item.href === currentPage ? "bg-gray-100" : ""}
                >
                  {item.text}
                </Sidebar.Item>
              )
            }
            
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            {
              COMMON_ITEMS_DATA.map(item =>
                <Sidebar.Item
                  {...item}
                  key={item.href}
                  className={item.href === currentPage ? "bg-gray-100" : ""}
                >
                  {item.text}
                </Sidebar.Item>
              )
            }
            <Sidebar.Item
              onClick={() => signOutRequest().then(() => navigate("/"))}
              icon={HiOutlineLogout}
            >
              Вихід
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </div>
    </Sidebar>
  );
};

export default CustomSidebar;
