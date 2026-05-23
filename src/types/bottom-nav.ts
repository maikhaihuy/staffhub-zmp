import { ReactNode } from "react";

export interface BottomNavigationItem {
  label: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
}