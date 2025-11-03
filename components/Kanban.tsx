"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { PartyGroup, TaskItem, TaskStatus } from "@/types/task";
import { loadTasks, saveTasks } from "@/lib/storage";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";

interface State {
  tasks: TaskItem[];
}

type Action =
  | { type: "load"; tasks: TaskItem[] }
  | { type: "add"; task: TaskItem }
  | { type: "update"; task: TaskItem }
  | { type: "delete"; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "load":
      return { tasks: action.tasks };
    case "add":
      return { tasks: [action.task, ...state.tasks] };
    case "update":
      return { tasks: state.tasks.map((t) => (t.id === action.task.id ? action.task : t)) };
    case "delete":
      return { tasks: state.tasks.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function Kanban({ group }: { group: PartyGroup }) {
  const [state, dispatch] = useReducer(reducer, { tasks: [] });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    const tasks = loadTasks();
    dispatch({ type: "load", tasks });
  }, []);

  useEffect(() => {
    saveTasks(state.tasks);
  }, [state.tasks]);

  const grouped = useMemo(() => {
    const tasks = state.tasks.filter((t) => t.group === group);
    const filtered = tasks.filter((t) => {
      const matchesQuery = query.trim()
        ? (t.title + " " + (t.description ?? "")).toLowerCase().includes(query.trim().toLowerCase())
        : true;
      const matchesStatus = statusFilter === "all" ? true : t.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
    return {
      todo: filtered.filter((t) => t.status === "todo"),
      in_progress: filtered.filter((t) => t.status === "in_progress"),
      done: filtered.filter((t) => t.status === "done"),
    } as Record<TaskStatus, TaskItem[]>;
  }, [state.tasks, group, query, statusFilter]);

  function handleAdd(data: Omit<TaskItem, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const task: TaskItem = { ...data, id: newId(), createdAt: now, updatedAt: now };
    dispatch({ type: "add", task });
    setShowForm(false);
  }

  function handleEditSave(data: Omit<TaskItem, "id" | "createdAt" | "updatedAt">) {
    if (!editTask) return;
    const updated: TaskItem = {
      ...editTask,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "update", task: updated });
    setEditTask(null);
  }

  function handleDelete(t: TaskItem) {
    if (typeof window !== "undefined" && !confirm("Delete this task?")) return;
    dispatch({ type: "delete", id: t.id });
  }

  function handleToggleStatus(t: TaskItem) {
    const next: TaskStatus = t.status === "todo" ? "in_progress" : t.status === "in_progress" ? "done" : "todo";
    const updated: TaskItem = { ...t, status: next, updatedAt: new Date().toISOString() };
    dispatch({ type: "update", task: updated });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
        <div className="flex items-center gap-2">
          <input
            className="input w-[280px]"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="input w-[200px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All statuses</option>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button className="btn-primary px-4 py-2" onClick={() => setShowForm(true)}>Add task</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="kb-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">To do</h3>
            <span className="badge bg-white/5 border border-white/10">{grouped.todo.length}</span>
          </div>
          {grouped.todo.map((t) => (
            <TaskCard key={t.id} task={t} onEdit={(tt) => setEditTask(tt)} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
          ))}
        </div>
        <div className="kb-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">In progress</h3>
            <span className="badge bg-white/5 border border-white/10">{grouped.in_progress.length}</span>
          </div>
          {grouped.in_progress.map((t) => (
            <TaskCard key={t.id} task={t} onEdit={(tt) => setEditTask(tt)} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
          ))}
        </div>
        <div className="kb-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Done</h3>
            <span className="badge bg-white/5 border border-white/10">{grouped.done.length}</span>
          </div>
          {grouped.done.map((t) => (
            <TaskCard key={t.id} task={t} onEdit={(tt) => setEditTask(tt)} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
          ))}
        </div>
      </div>

      {(showForm || editTask) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-3 z-50">
          <div className="card w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editTask ? "Edit task" : `New task ? ${group}`}
              </h3>
              <button className="btn-muted px-3 py-1" onClick={() => { setShowForm(false); setEditTask(null); }}>Close</button>
            </div>
            <TaskForm
              initial={editTask ?? undefined}
              group={group}
              onSubmit={editTask ? handleEditSave : handleAdd}
              onCancel={() => { setShowForm(false); setEditTask(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
