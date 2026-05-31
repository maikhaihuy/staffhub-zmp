import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Box,
  Route,
  SnackbarProvider,
  useLocation,
  useNavigate,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";
import ProfilePage from "@/pages/staff/profile";
import PaymentPage from "@/pages/staff/income";
import { BottomNavigationBar } from "./bottom-navigation";
import SchedulePage from "@/pages/staff/schedule";
import TaskPage from "@/pages/staff/task";
import { PATHS, TAB_PATHS } from "@/constants/paths";
import { incomeRouteElements } from "./routes";

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
    <Box flex flexDirection="column" className="h-screen overflow-hidden">
      <Box className="flex-1 min-h-0 overflow-hidden">
        <AnimationRoutes>
          <Route path={PATHS.CALENDAR} element={<SchedulePage />}></Route>
          <Route path={PATHS.TASK} element={<TaskPage />}></Route>
          <Route path={PATHS.PAYMENT} element={<PaymentPage />}></Route>
          {incomeRouteElements}
          <Route path={PATHS.PROFILE} element={<ProfilePage />}></Route>
        </AnimationRoutes>
      </Box>
      <Box className="shrink-0">
        <BottomNavigationBar activeKey={location.pathname} onTabChange={handleTabChange} />
      </Box>
    </Box>
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
