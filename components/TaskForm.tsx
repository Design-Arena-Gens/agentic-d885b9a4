"use client";

import { useEffect, useMemo, useState } from "react";
import { PartyGroup, TaskItem, TaskPriority, TaskStatus } from "@/types/task";

export function TaskForm({
  initial,
  group,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<TaskItem>;
  group: PartyGroup;
  onSubmit: (t: Omit<TaskItem, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? "todo");
  const [priority, setPriority] = useState<TaskPriority>(
    initial?.priority ?? "medium"
  );
  const [dueDate, setDueDate] = useState<string>(initial?.dueDate ?? "");

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate || undefined,
      group,
    });
  }

  useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setStatus(initial?.status ?? "todo");
    setPriority(initial?.priority ?? "medium");
    setDueDate(initial?.dueDate ?? "");
  }, [initial]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-muted mb-1">Title</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Prepare contract" />
      </div>
      <div>
        <label className="block text-sm text-muted mb-1">Description</label>
        <textarea className="input min-h-[90px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-muted mb-1">Status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Priority</label>
          <select className="input" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Due date</label>
          <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="btn-muted px-4 py-2">Cancel</button>
        <button disabled={!canSubmit} className="btn-primary px-4 py-2 disabled:opacity-50">Save task</button>
      </div>
    </form>
  );
}
