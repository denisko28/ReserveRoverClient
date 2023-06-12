import type { FC } from "react";
import Navbar from "../components/navbar/navbar";
import { Outlet } from "react-router";
import CustomFooter from "../components/CustomFooter";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const NavbarLayout: FC<NavbarSidebarLayoutProps> =
  function ({ isFooter = true }) {
    return (
      <div>
        <Navbar />
        <div className="flex items-start justify-center pt-16">
          <main className="pt-6 flex flex-wrap items-center justify-between container" style={{ margin: "auto min(1.2rem)" }}>
            <Outlet />
            {isFooter && (
              <div className="w-full mt-4">
                <CustomFooter />
              </div>
            )}
          </main>
        </div>
      </div>
    );
  };

export default NavbarLayout;
