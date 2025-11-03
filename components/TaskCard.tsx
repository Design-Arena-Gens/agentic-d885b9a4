"use client";

import { TaskItem } from "@/types/task";

export function TaskCard({ task, onEdit, onDelete, onToggleStatus }: {
  task: TaskItem;
  onEdit: (t: TaskItem) => void;
  onDelete: (t: TaskItem) => void;
  onToggleStatus: (t: TaskItem) => void;
}) {
  const statusLabel = task.status === "todo" ? "To do" : task.status === "in_progress" ? "In progress" : "Done";
  const badgeClass = task.priority === "high" ? "badge-red" : task.priority === "medium" ? "badge-amber" : "badge-green";

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold leading-6">{task.title}</h4>
        <span className={`badge ${badgeClass}`}>{task.priority}</span>
      </div>
      {task.description && (
        <p className="text-sm text-muted leading-6 whitespace-pre-wrap">{task.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="badge bg-white/5 border border-white/10">{statusLabel}</span>
          {task.dueDate && (
            <span className="badge bg-white/5 border border-white/10">Due {new Date(task.dueDate).toLocaleDateString()}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-muted px-2 py-1" onClick={() => onToggleStatus(task)}>Next status</button>
          <button className="btn-muted px-2 py-1" onClick={() => onEdit(task)}>Edit</button>
          <button className="btn-muted px-2 py-1" onClick={() => onDelete(task)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
