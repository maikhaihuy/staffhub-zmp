export const PATHS = {
  CALENDAR: "/calendar",
  TASK: "/task",
  PAYMENT: "/payment",
  PROFILE: "/profile",
}as const;

export const TAB_PATHS = [
  PATHS.CALENDAR,
  PATHS.TASK,
  PATHS.PAYMENT,
  PATHS.PROFILE,
] as const;
