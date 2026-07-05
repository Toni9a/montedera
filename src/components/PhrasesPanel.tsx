"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { phrases } from "@/data/phrases";

export default function PhrasesPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="chip inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--purple-soft)]/60 px-3.5 py-1.5 text-[var(--purple-deep)] hover:bg-white"
      >
        🗣️ Phrases
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
            onClick={() => setOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-[var(--cream)] p-5 shadow-xl sm:rounded-3xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-[var(--purple-deep)]">
                  Useful phrases
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="chip rounded-full border border-[var(--brown-light)]/40 px-3 py-1 text-[var(--ink)]/60 hover:bg-white"
                >
                  ✕
                </button>
              </div>
              <p className="mb-4 text-xs text-[var(--ink)]/50">
                English → Montenegrin
              </p>
              <ul className="flex flex-col gap-2">
                {phrases.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3.5 py-2.5"
                  >
                    <span className="text-sm text-[var(--ink)]/70">{p.en}</span>
                    <span className="font-display text-base font-semibold text-[var(--purple-deep)]">
                      {p.local}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
