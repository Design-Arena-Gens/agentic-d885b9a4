"use client";

import { useState } from "react";
import { PartySwitcher } from "@/components/PartySwitcher";
import { Kanban } from "@/components/Kanban";
import { PartyGroup } from "@/types/task";

export default function Page() {
  const [group, setGroup] = useState<PartyGroup>("Party A");

  return (
    <main className="container-max py-10 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Party Task Tracker</h1>
          <p className="text-muted mt-1">Track your work group-wise ? Party A and Party B.</p>
        </div>
        <PartySwitcher value={group} onChange={setGroup} />
      </header>

      <section className="card p-4 md:p-6">
        <Kanban group={group} />
      </section>

      <footer className="text-center text-xs text-muted">
        <span>Data is saved locally in your browser.</span>
      </footer>
    </main>
  );
}
