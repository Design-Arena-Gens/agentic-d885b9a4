"use client";

import { PartyGroup } from "@/types/task";

export function PartySwitcher({
  value,
  onChange,
}: {
  value: PartyGroup;
  onChange: (g: PartyGroup) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-xl bg-white/5 p-1 border border-white/10">
      {(["Party A", "Party B"] as PartyGroup[]).map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={
            "px-4 py-2 rounded-lg text-sm font-medium transition " +
            (value === g
              ? "bg-primary text-black shadow"
              : "text-white hover:bg-white/10")
          }
        >
          {g}
        </button>
      ))}
    </div>
  );
}
