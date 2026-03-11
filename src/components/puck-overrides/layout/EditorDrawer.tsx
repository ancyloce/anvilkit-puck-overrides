"use client";

import React, { ReactNode, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditorDrawerProps {
  children: ReactNode;
}

/**
 * EditorDrawer — overrides the `drawer` slot of Puck.
 *
 * Renders the left-side component palette with a search box and a scrollable
 * area for component drag sources, all styled with Shadcn UI primitives.
 */
export function EditorDrawer({ children }: EditorDrawerProps) {
  const [search, setSearch] = useState("");

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Components
        </span>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search components…"
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search components"
          />
        </div>
      </div>

      {/* Component list */}
      <ScrollArea className="flex-1 px-2 py-2">
        {/* Puck injects draggable drawer items as children */}
        <div
          className="space-y-1"
          data-search-filter={search.toLowerCase() || undefined}
        >
          {children}
        </div>
      </ScrollArea>
    </aside>
  );
}
