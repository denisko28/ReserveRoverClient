import type { FC } from "react";
import { Outlet } from "react-router";
import CustomSidebar from "../components/custom-sidebar/custom-sidebar";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const SidebarLayout: FC<NavbarSidebarLayoutProps> =
  function () {
    return (
      <div>
        <CustomSidebar />
        <div className="flex items-start justify-center w-full">
          <main className="px-6 flex flex-wrap items-center justify-between ml-72" style={{ padding: "auto min(1.2rem)", width: "calc(100% - 18rem)" }}>
            <Outlet />
            <p className="w-full my-8 text-center text-sm text-gray-500 dark:text-gray-300">
              &copy; 2023 ReserveRover.com. All rights reserved.
            </p>
          </main>
        </div>
      </div>
    );
  };

export default SidebarLayout;
