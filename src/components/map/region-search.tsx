"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui";
import { KAZAKHSTAN_REGIONS, searchRegions } from "@/lib/map/regions";
import type { Region } from "@/types";

export function RegionSearch({
  onSelectRegion,
}: {
  onSelectRegion: (region: Region) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = query.trim() ? searchRegions(query) : KAZAKHSTAN_REGIONS;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(region: Region) {
    setQuery(region.name);
    setOpen(false);
    onSelectRegion(region);
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <Input
        icon={<Search className="h-4 w-4" />}
        placeholder="Найти область или город..."
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && results.length > 0 && (
        <ul className="animate-fade-in absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-lg border border-border bg-surface-elevated p-1.5 shadow-card-hover">
          {results.map((region) => (
            <li key={region.id}>
              <button
                type="button"
                onClick={() => handleSelect(region)}
                className="flex w-full flex-col items-start rounded-md px-3 py-2 text-left transition-colors hover:bg-surface-overlay"
              >
                <span className="text-sm font-medium text-foreground">
                  {region.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {region.capital}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
