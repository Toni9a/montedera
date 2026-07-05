"use client";

import { useEffect, useRef, useState } from "react";

const GBP_TO_EUR = 1.167;

export default function CurrencyConverter() {
  const [open, setOpen] = useState(false);
  const [gbp, setGbp] = useState("10");
  const [eur, setEur] = useState((10 * GBP_TO_EUR).toFixed(2));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function onGbpChange(value: string) {
    setGbp(value);
    const n = parseFloat(value);
    setEur(Number.isFinite(n) ? (n * GBP_TO_EUR).toFixed(2) : "");
  }

  function onEurChange(value: string) {
    setEur(value);
    const n = parseFloat(value);
    setGbp(Number.isFinite(n) ? (n / GBP_TO_EUR).toFixed(2) : "");
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="chip inline-flex items-center gap-1 rounded-full border border-[var(--purple-soft)]/60 px-3.5 py-1.5 text-[var(--purple-deep)] hover:bg-white"
      >
        💵 £ ⇄ €
      </button>

      {open && (
        <div className="absolute left-0 z-40 mt-2 w-64 rounded-2xl border border-[var(--brown-light)]/30 bg-white p-4 shadow-lg">
          <p className="chip mb-2 text-[var(--brown)]">Quick converter</p>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-xs text-[var(--ink)]/50">GBP (£)</label>
              <input
                type="number"
                value={gbp}
                onChange={(e) => onGbpChange(e.target.value)}
                className="w-full rounded-lg border border-[var(--brown-light)]/30 px-2 py-1.5 text-sm"
              />
            </div>
            <span className="mt-4 text-[var(--brown)]">⇄</span>
            <div className="flex-1">
              <label className="block text-xs text-[var(--ink)]/50">EUR (€)</label>
              <input
                type="number"
                value={eur}
                onChange={(e) => onEurChange(e.target.value)}
                className="w-full rounded-lg border border-[var(--brown-light)]/30 px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <p className="mt-2 text-[10px] text-[var(--ink)]/40">
            Approx rate (~{GBP_TO_EUR}), Montenegro uses the Euro
          </p>
        </div>
      )}
    </div>
  );
}
