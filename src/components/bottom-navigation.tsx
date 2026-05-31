import { BottomNavigation, Icon } from "zmp-ui";
import { BottomNavigationItem } from "@/types/bottom-nav";
import { PATHS } from "@/constants/paths";

const BottomNavigationItems: Record<string, BottomNavigationItem> = {
  [PATHS.CALENDAR]: {
    label: "Ban vụ",
    icon: <Icon icon="zi-calendar" />,
  },
  [PATHS.TASK]: {
    label: "Nhiệm vụ",
    icon: <Icon icon="zi-note" />,
  },
  [PATHS.PAYMENT]: {
    label: "Thu nhập",
    icon: <Icon icon="zi-favorite-list" />,
  },
  [PATHS.PROFILE]: {
    label: "Cá nhân",
    icon: <Icon icon="zi-user" />,
  },
}

export const BottomNavigationBar = ({ activeKey, onTabChange }: { activeKey: string; onTabChange: (key: string) => void }) => {
  return (
    <BottomNavigation
      id="footer"
      activeKey={activeKey}
      onChange={onTabChange}
      className="z-50"
      >
      {Object.entries(BottomNavigationItems).map(([path, item]) => (
        <BottomNavigation.Item
          key={path}
          icon={item.icon}
          label={item.label}
        />
      ))}
    </BottomNavigation>
  );
}
