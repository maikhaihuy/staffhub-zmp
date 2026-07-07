import type { Employee, Shift, TodoTask } from '@/types/shift'

const TODAY = new Date().toISOString().split('T')[0]
const TOMORROW = new Date(Date.now() + 86_400_000).toISOString().split('T')[0]

export const MOCK_EMPLOYEE: Employee = {
  id: 'emp-001',
  name: 'Linh Nguyễn',
  initials: 'LN',
  role: 'Barista',
}

export const MOCK_SHIFT: Shift = {
  id: 'shift-today-am',
  date: TODAY,
  startTime: '08:00',
  endTime: '17:00',
  branch: 'Gong Cha – Q1 Branch',
  team: 'Team A',
  supervisor: 'Minh Trần',
  totalTasks: 8,
  mandatoryCount: 2,
  label: 'Morning Shift',
}

export const MOCK_NEXT_SHIFT: Shift = {
  id: 'shift-tomorrow-am',
  date: TOMORROW,
  startTime: '08:00',
  endTime: '17:00',
  branch: 'Gong Cha – Q1 Branch',
  team: 'Team A',
  supervisor: 'Minh Trần',
  totalTasks: 8,
  mandatoryCount: 2,
  label: 'Morning Shift',
}

export const DEFAULT_TODOS: TodoTask[] = [
  { id: 1, label: 'Clean bar counter',              tag: 'urgent', done: false },
  { id: 2, label: 'Refill toppings (pearls, jelly)', tag: 'normal', done: false },
  { id: 3, label: 'Clean customer seating area',    tag: 'normal', done: false },
  { id: 4, label: 'Restock takeaway cups & lids',   tag: 'normal', done: false },
  { id: 5, label: 'Wipe down blenders & shakers',   tag: 'urgent', done: false },
  { id: 6, label: 'Update whiteboard menu',         tag: 'normal', done: false },
]

export const CHECKIN_WINDOW_MINUTES = 15
export const SHIFT_GRACE_PERIOD_MINUTES = 60

export const THUMB_COLORS = [
  '#d1fae5', '#dbeafe', '#fef3c7', '#fce7f3',
  '#ede9fe', '#fee2e2', '#d1fae5', '#fef9c3',
]
