export interface DemoTask {
  title: string;
  description?: string;
  completed: boolean;
  pinned: boolean;
  order: number;
  createdAt: Date;
}

export const DEMO_TASKS: DemoTask[] = [
  { title: "Welcome to Astrobun! 🚀", description: "Your personal productivity workspace", completed: false, pinned: true, order: 1, createdAt: new Date() },
  { title: "Try dragging tasks to reorder", completed: false, pinned: false, order: 2, createdAt: new Date() },
  { title: "Click the checkmark to complete", completed: false, pinned: false, order: 3, createdAt: new Date() },
  { title: "Pin important tasks to the top", completed: false, pinned: false, order: 4, createdAt: new Date() },
];