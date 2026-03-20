"use client";
import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search, Type } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMsg } from "@/store/editor-i18n";
import { useGhostDrag } from "@/features/library-dnd/useGhostDrag";

export interface CopywritingItem {
  label: string;
  text: string;
  category: string;
}

type CopyPage = {
  items: CopywritingItem[];
  hasMore?: boolean;
};

type CopyPageResult = CopywritingItem[] | CopyPage;

type CopyPageLoader = (
  query: string,
  page: number,
  pageSize: number,
) => Promise<CopyPageResult> | CopyPageResult;

type CopyRenderItem =
  | {
      type: "header";
      key: string;
      category: string;
      isFirst: boolean;
    }
  | {
      type: "item";
      key: string;
      item: CopywritingItem;
    };

export interface CopywritingProps {
  items?: CopywritingItem[];
  loadPage?: CopyPageLoader;
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 24;
const LOAD_MORE_THRESHOLD = 6;
const HEADER_ESTIMATE = 26;
const ITEM_ESTIMATE = 72;

const DEFAULT_SNIPPETS: CopywritingItem[] = [
  { category: "Headlines", label: "Bold statement", text: "The Future Starts Here" },
  { category: "Headlines", label: "Question hook", text: "Ready to Transform Your Business?" },
  { category: "Headlines", label: "Value prop", text: "Simple, Powerful, Built for Teams" },
  { category: "Headlines", label: "Action-led", text: "Ship Faster. Break Less. Sleep Better." },
  { category: "Subheadings", label: "Feature intro", text: "Everything you need, nothing you don't." },
  { category: "Subheadings", label: "Social proof", text: "Trusted by over 10,000 teams worldwide." },
  { category: "Subheadings", label: "CTA support", text: "Get started in minutes — no credit card required." },
  { category: "Body", label: "Product description", text: "Our platform helps teams collaborate in real time, ship products faster, and stay aligned across every stage of the process." },
  { category: "Body", label: "Feature benefit", text: "With built-in analytics and smart automation, you can focus on what matters most — building great products." },
  { category: "Body", label: "About us", text: "We're a small team on a big mission: to make software development feel effortless for everyone." },
  { category: "CTAs", label: "Primary", text: "Get Started Free" },
  { category: "CTAs", label: "Secondary", text: "Learn More" },
  { category: "CTAs", label: "Soft sell", text: "See How It Works" },
  { category: "CTAs", label: "Urgency", text: "Start Your Free Trial Today" },
];

function filterSnippets(
  snippets: CopywritingItem[],
  query: string,
): CopywritingItem[] {
  if (!query) return snippets;

  const normalizedQuery = query.toLowerCase();
  return snippets.filter(
    (snippet) =>
      snippet.text.toLowerCase().includes(normalizedQuery) ||
      snippet.label.toLowerCase().includes(normalizedQuery) ||
      snippet.category.toLowerCase().includes(normalizedQuery),
  );
}

function getLocalPage(
  query: string,
  page: number,
  pageSize: number,
): Required<CopyPage> {
  const filtered = filterSnippets(DEFAULT_SNIPPETS, query);
  const start = page * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    hasMore: start + pageSize < filtered.length,
  };
}

function normalizePageResult(
  result: CopyPageResult,
  pageSize: number,
): Required<CopyPage> {
  if (Array.isArray(result)) {
    return {
      items: result,
      hasMore: result.length >= pageSize,
    };
  }

  return {
    items: result.items,
    hasMore: result.hasMore ?? result.items.length >= pageSize,
  };
}

function buildRenderItems(
  snippets: CopywritingItem[],
  isSearchMode: boolean,
): CopyRenderItem[] {
  if (isSearchMode) {
    return snippets.map((item, index) => ({
      type: "item",
      key: `item:${index}:${item.category}:${item.label}:${item.text}`,
      item,
    }));
  }

  const grouped = new Map<
    string,
    Array<{ item: CopywritingItem; sourceIndex: number }>
  >();

  snippets.forEach((item, sourceIndex) => {
    const categoryItems = grouped.get(item.category);
    if (categoryItems) {
      categoryItems.push({ item, sourceIndex });
      return;
    }

    grouped.set(item.category, [{ item, sourceIndex }]);
  });

  const renderItems: CopyRenderItem[] = [];
  let categoryIndex = 0;

  grouped.forEach((categoryItems, category) => {
    if (categoryItems.length === 0) return;

    renderItems.push({
      type: "header",
      key: `header:${category}`,
      category,
      isFirst: categoryIndex === 0,
    });

    categoryItems.forEach(({ item, sourceIndex }) => {
      renderItems.push({
        type: "item",
        key: `item:${sourceIndex}:${item.category}:${item.label}:${item.text}`,
        item,
      });
    });

    categoryIndex += 1;
  });

  return renderItems;
}

function createTextGhost(text: string): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cssText = `
    position: fixed; top: -9999px; left: -9999px; z-index: 99999;
    max-width: 200px; padding: 6px 10px; border-radius: 6px;
    background: #1e1e2e; color: #fff; font-size: 12px; line-height: 1.4;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3); pointer-events: none;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  `;
  el.textContent = text.length > 40 ? text.slice(0, 40) + "…" : text;
  document.body.appendChild(el);
  return el;
}

function CategoryHeader({
  category,
  isFirst,
}: {
  category: string;
  isFirst: boolean;
}): React.ReactElement {
  return (
    <div
      className={
        isFirst
          ? "px-1 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1"
          : "px-1 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1"
      }
    >
      <Type className="h-3 w-3" />
      {category}
    </div>
  );
}

function CopySnippetCard({
  item,
  startDrag,
}: {
  item: CopywritingItem;
  startDrag: ReturnType<typeof useGhostDrag>["startDrag"];
}): React.ReactElement {
  return (
    <div className="pb-1">
      <div
        onPointerDown={(e) => startDrag(e, "text", item.text)}
        className="rounded-md border border-border bg-muted/40 px-2.5 py-2 cursor-grab select-none hover:bg-muted hover:ring-1 hover:ring-primary/40 active:cursor-grabbing transition-all"
      >
        <div className="text-xs font-medium text-foreground/70 mb-0.5">
          {item.label}
        </div>
        <div className="text-xs text-foreground leading-snug line-clamp-2">
          {item.text}
        </div>
      </div>
    </div>
  );
}

function LoadingRow(): React.ReactElement {
  return (
    <div className="pt-2">
      <div className="h-5 rounded bg-muted/40 animate-pulse" />
    </div>
  );
}

function ErrorRow({ message }: { message: string }): React.ReactElement {
  return (
    <div className="pt-2 text-xs text-destructive">
      {message}
    </div>
  );
}

export function CopyLibrary({
  items: customItems,
  loadPage,
  pageSize,
}: CopywritingProps = {}): React.ReactElement {
  const resolvedPageSize = typeof pageSize === "number" && pageSize > 0
    ? Math.floor(pageSize)
    : DEFAULT_PAGE_SIZE;
  const hasCustomItems = customItems !== undefined;
  const hasPagedLoader = loadPage !== undefined;
  const initialLocalPage = !hasCustomItems && !hasPagedLoader
    ? getLocalPage("", 0, resolvedPageSize)
    : null;

  const [query, setQuery] = React.useState("");
  const [pagedItems, setPagedItems] = React.useState<CopywritingItem[]>(
    () => initialLocalPage?.items ?? [],
  );
  const [hasMore, setHasMore] = React.useState(
    () => initialLocalPage?.hasMore ?? hasPagedLoader,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const requestIdRef = React.useRef(0);
  const pageRef = React.useRef(initialLocalPage ? 0 : -1);
  const hasMoreRef = React.useRef(initialLocalPage?.hasMore ?? hasPagedLoader);
  const isLoadingRef = React.useRef(false);
  const didInitializeRef = React.useRef(false);
  const loadPageRef = React.useRef(loadPage);
  const trimmedQuery = query.trim();
  const deferredQuery = React.useDeferredValue(trimmedQuery);
  const activeQuery = hasPagedLoader ? deferredQuery : trimmedQuery;
  const visibleSnippets = React.useMemo(
    () => (hasCustomItems ? filterSnippets(customItems, activeQuery) : pagedItems),
    [activeQuery, customItems, hasCustomItems, pagedItems],
  );
  const isSearchMode = activeQuery.length > 0;
  const renderItems = React.useMemo(
    () => buildRenderItems(visibleSnippets, isSearchMode),
    [isSearchMode, visibleSnippets],
  );
  const libraryTitle = useMsg("copy-library.title");
  const searchPlaceholder = useMsg("copy-library.search.placeholder");

  const { startDrag } = useGhostDrag({ createGhostEl: createTextGhost });
  const virtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: renderItems.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: (index) => (renderItems[index]?.type === "header"
      ? HEADER_ESTIMATE
      : ITEM_ESTIMATE),
    getItemKey: (index) => renderItems[index]?.key ?? index,
    overscan: 8,
  });
  const virtualItems = virtualizer.getVirtualItems();

  React.useEffect(() => {
    loadPageRef.current = loadPage;
  }, [loadPage]);

  const fetchPage = React.useCallback(
    async (nextQuery: string, page: number): Promise<Required<CopyPage>> => {
      const result = loadPageRef.current
        ? await loadPageRef.current(nextQuery, page, resolvedPageSize)
        : getLocalPage(nextQuery, page, resolvedPageSize);

      return normalizePageResult(result, resolvedPageSize);
    },
    [resolvedPageSize],
  );

  const loadRequestedPage = React.useCallback(
    async (nextQuery: string, page: number, replace = false) => {
      if (!replace && (isLoadingRef.current || !hasMoreRef.current)) return;

      const requestId = requestIdRef.current;
      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        const result = await fetchPage(nextQuery, page);
        if (requestId !== requestIdRef.current) return;

        setPagedItems((current) => (replace ? result.items : [...current, ...result.items]));
        pageRef.current = page;
        hasMoreRef.current = result.hasMore;
        setHasMore(result.hasMore);
        setError(null);
      } catch (cause) {
        if (requestId !== requestIdRef.current) return;

        const message = cause instanceof Error
          ? cause.message
          : "Unable to load snippets.";

        console.error("Failed to load copy library page", cause);
        hasMoreRef.current = false;
        setHasMore(false);
        setError(message);
      } finally {
        if (requestId === requestIdRef.current) {
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      }
    },
    [fetchPage],
  );

  React.useEffect(() => {
    const shouldSkipInitialLocalLoad =
      !didInitializeRef.current &&
      !hasCustomItems &&
      !hasPagedLoader &&
      activeQuery === "";

    didInitializeRef.current = true;

    if (hasCustomItems) {
      requestIdRef.current += 1;
      isLoadingRef.current = false;
      hasMoreRef.current = false;
      pageRef.current = -1;
      setHasMore(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (shouldSkipInitialLocalLoad) {
      return;
    }

    requestIdRef.current += 1;
    isLoadingRef.current = false;
    hasMoreRef.current = true;
    pageRef.current = -1;
    setPagedItems([]);
    setHasMore(true);
    setIsLoading(false);
    setError(null);
    viewportRef.current?.scrollTo({ top: 0 });
    void loadRequestedPage(activeQuery, 0, true);
  }, [activeQuery, hasCustomItems, hasPagedLoader, loadRequestedPage]);

  React.useEffect(() => {
    if (hasCustomItems || isLoading || !hasMore || renderItems.length === 0) return;

    const lastVirtualItem = virtualItems[virtualItems.length - 1];
    if (!lastVirtualItem) return;
    if (lastVirtualItem.index < renderItems.length - LOAD_MORE_THRESHOLD) return;

    void loadRequestedPage(activeQuery, pageRef.current + 1);
  }, [
    activeQuery,
    hasCustomItems,
    hasMore,
    isLoading,
    loadRequestedPage,
    renderItems.length,
    virtualItems,
  ]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {libraryTitle}
      </div>
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1" viewportRef={viewportRef}>
        <div className="p-2" aria-busy={isLoading}>
          <div
            className="relative"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualItems.map((virtualItem) => {
              const renderItem = renderItems[virtualItem.index];
              if (!renderItem) return null;

              return (
                <div
                  key={renderItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  className="absolute inset-x-0"
                  style={{ transform: `translateY(${virtualItem.start}px)` }}
                >
                  {renderItem.type === "header" ? (
                    <CategoryHeader
                      category={renderItem.category}
                      isFirst={renderItem.isFirst}
                    />
                  ) : (
                    <CopySnippetCard item={renderItem.item} startDrag={startDrag} />
                  )}
                </div>
              );
            })}
          </div>
          {isLoading && <LoadingRow />}
          {error && <ErrorRow message={error} />}
        </div>
      </ScrollArea>
    </div>
  );
}
