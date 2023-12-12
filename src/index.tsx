import { createRoot } from "react-dom/client";

import "./index.css";
import 'react-loading-skeleton/dist/skeleton.css'
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route, Navigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import SignInPhonePage from "./pages/AuthPages/SignInPhonePage";
import DetailsPage from "./pages/DetailsPage/DetailsPage";
import SignUpPage from "./pages/AuthPages/SignUpPage";
import SignInEmailPage from "./pages/AuthPages/SignInEmailPage";
import RestorePassPage from "./pages/AuthPages/RestorePassPage";
import UserReservPage from "./pages/UserReservationsPage/UserReservPage";
import UserSavedPage from "./pages/UserSavedPage/UserSavedPage";
import { persistor, store } from "./redux";
import { Provider } from "react-redux";
import NavbarLayout from "./layouts/navbar-layout";
import AuthLayout from "./layouts/auth-layout/auth-layout";
import RequireGuest from "./components/RequireGuest";
import RequireAuth from "./components/RequireAuth";
import InitialRoute from "./components/InitialRoute";
import { UserRoles } from "./hooks/useAuth";
import { PersistGate } from "redux-persist/integration/react";
import UserNameAndPhotoPage from "./pages/AuthPages/UserNameAndPhotoPage";
import EmailVerifPage from "./pages/AuthPages/EmailVerifPage";
import MyPlacePage from "./pages/MyPlacePage/MyPlacePage";
import SidebarLayout from "./layouts/sidebar-layout";
import TablesPage from "./pages/TablesPage/TablesPage";
import PlaceReservationsPage from "./pages/PlaceReservationsPage/PlaceReservationsPage";
import ModerationPage from "./pages/ModerationPage/ModerationPage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import ChatsPage from "./pages/ChatsPage/ChatsPage";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  // <StrictMode>
    <Flowbite theme={{ theme }}>
      <div id="recaptcha-container"></div>
      <ToastContainer />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<InitialRoute />} >
                <Route element={<NavbarLayout />}>
                  <Route path="/main" element={<MainPage />} index />
                  <Route path="/details/:placeId" element={<DetailsPage />} />

                  <Route element={<RequireAuth allowedRoles={[UserRoles.User]} />}>
                    <Route path="/user-reservations" element={<UserReservPage />} />
                  </Route>
                  <Route element={<RequireAuth allowedRoles={[UserRoles.User]} />}>
                    <Route path="/user-saved" element={<UserSavedPage />} />
                  </Route>
                  <Route element={<RequireAuth allowedRoles={[UserRoles.User]} />}>
                    <Route path="/friends" element={<FriendsPage />} />
                  </Route>
                  <Route element={<RequireAuth allowedRoles={[UserRoles.User]} />}>
                    <Route path="/chats" element={<ChatsPage />} />
                  </Route>
                  <Route element={<RequireAuth allowedRoles={[UserRoles.User]} />}>
                    <Route path="/chat/:chatId" element={<ChatsPage />} />
                  </Route>
                </Route>
                <Route element={<SidebarLayout />}>
                  <Route element={<RequireAuth allowedRoles={[UserRoles.Manager]} />}>
                    <Route path="/place-reservs" element={<PlaceReservationsPage />} />
                  </Route>
                  <Route element={<RequireAuth allowedRoles={[UserRoles.Manager]} />}>
                    <Route path="/my-place/:action" element={<MyPlacePage />} />
                  </Route>
                  <Route element={<RequireAuth allowedRoles={[UserRoles.Manager]} />}>
                    <Route path="/tables" element={<TablesPage />} />
                  </Route>
                  
                  <Route element={<RequireAuth allowedRoles={[UserRoles.Moderator]} />}>
                    <Route path="/moderation" element={<ModerationPage />} />
                  </Route>
                </Route>
              </Route>

              <Route element={<AuthLayout />}>
                <Route element={<RequireAuth allowAllRoles={true} verifyEmail={false} />}>
                  <Route path="/auth/email-verif" element={<EmailVerifPage />} />
                </Route>
                <Route element={<RequireAuth allowAllRoles={true} />}>
                  <Route path="/auth/set-profile" element={<UserNameAndPhotoPage />} />
                </Route>

                <Route element={<RequireGuest />}>
                  <Route path="/auth" element={<Navigate to="/auth/sign-in-phone" replace />} />
                  <Route path="/auth/sign-in-phone" element={<SignInPhonePage />} />
                  <Route path="/auth/sign-in-email" element={<SignInEmailPage />} />
                  <Route path="/auth/restore-pass" element={<RestorePassPage />} />
                  <Route path="/auth/sign-up" element={<SignUpPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </Flowbite>
  // </StrictMode >
);
