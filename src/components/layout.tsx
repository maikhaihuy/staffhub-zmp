import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  useLocation,
  useNavigate,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";
import ProfilePage from "@/pages/profile";
import PaymentPage from "@/pages/payment";
import { BottomNavigationBar } from "./bottom-navigation";
import SchedulePage from "@/pages/schedule";
import TaskPage from "@/pages/task";
import { PATHS, TAB_PATHS } from "@/constants/paths";

const AnimateRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (key: string): void => {
    const currentTab = location.pathname;
    const targetTab = key;
    if (currentTab === targetTab) return;
  
    const currentIdx = TAB_PATHS.indexOf(currentTab as typeof TAB_PATHS[number]);
    const targetIdx = TAB_PATHS.indexOf(targetTab as typeof TAB_PATHS[number]);
    if (targetIdx === -1) return;

    const direction = targetIdx > currentIdx ? 'forward' : 'backward';
    navigate(targetTab, { replace: true, direction });
  };

  return (
    <div className="flex flex-col h-screen">
      <AnimationRoutes>
        <Route path={PATHS.CALENDAR} element={<SchedulePage />}></Route>
        <Route path={PATHS.TASK} element={<TaskPage />}></Route>
        <Route path={PATHS.PAYMENT} element={<PaymentPage />}></Route>
        <Route path={PATHS.PROFILE} element={<ProfilePage />}></Route>
      </AnimationRoutes>
      <BottomNavigationBar activeKey={location.pathname} onTabChange={handleTabChange} />
    </div>
  )
}

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <SnackbarProvider>
        <ZMPRouter>
          <AnimateRoutes />
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
