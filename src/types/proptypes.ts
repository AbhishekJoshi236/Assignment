import { Habit, Task, User, DashboardStats } from './index';

// Common modal types
export type ModalType = 'addHabit' | 'addTask' | 'settings' | null;

// Form state types
export interface HabitFormState {
  name: string;
  frequency: 'daily' | 'weekly';
  color: string;
}

export interface TaskFormState {
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface SettingsState {
  notifications: boolean;
  weekStartsOn: string;
}

// Component prop types
export interface HeaderProps {
  user: User;
  isNavOpen: boolean;
  setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: (type: ModalType) => void;
}

export interface SidebarProps {
  activeView: 'dashboard' | 'habits' | 'tasks';
  setActiveView: React.Dispatch<React.SetStateAction<'dashboard' | 'habits' | 'tasks'>>;
  isNavOpen: boolean;
  openModal: (type: ModalType) => void;
}

export interface DashboardProps {
  stats: DashboardStats;
  user: User;
}

export interface HabitsListProps {
  habits: Habit[];
  toggleHabitCompletion: (id: string) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id'>>) => void;
  openModal: (type: ModalType) => void;
}

export interface TaskListProps {
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  openModal: (type: ModalType) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: ModalType;
  newHabit: HabitFormState;
  setNewHabit: React.Dispatch<React.SetStateAction<HabitFormState>>;
  newTask: TaskFormState;
  setNewTask: React.Dispatch<React.SetStateAction<TaskFormState>>;
  settings: SettingsState;
  setSettings: (settings: SettingsState) => void;
  addHabit: () => void;
  addTask: () => void;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
} 