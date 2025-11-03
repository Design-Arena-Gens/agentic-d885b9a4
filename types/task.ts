export type PartyGroup = "Party A" | "Party B";

export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO date string
  group: PartyGroup;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
