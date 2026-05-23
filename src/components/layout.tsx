import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import HomePage from "@/pages/index";
import ProfilePage from "@/pages/profile";
import DashboardPage from "@/pages/payment";
import { BottomNavigationBar } from "./bottom-navigation";
import CalendarPage from "@/pages/calendar";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/dashboard" element={<DashboardPage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/calendar" element={<CalendarPage />}></Route>
          </AnimationRoutes>
          <BottomNavigationBar />
        </ZMPRouter>
        
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
