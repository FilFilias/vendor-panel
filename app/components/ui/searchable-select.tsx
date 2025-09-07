import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

export function SearchableSelect({
  items,
  value,
  onValueChange,
  placeholder = "Select an option",
  disabled=false
}: {
  items: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?:boolean;
}) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);

  // Fallback label so the selected value shows even when the item isn't mounted (virtualized)
  const selectedLabel = React.useMemo(
    () => items.find((i) => i.value === value)?.label ?? "",
    [items, value]
  );

  // Normalize for faster filter
  const normalized = React.useMemo(
    () =>
      items.map((i) => ({
        ...i,
        _label: i.label.toLowerCase(),
        _value: i.value.toLowerCase(),
      })),
    [items]
  );

  const filtered = React.useMemo(() => {
    if (!query.trim()) return normalized;
    const q = query.toLowerCase();
    return normalized.filter(
      (i) => i._label.includes(q) || i._value.includes(q)
    );
  }, [normalized, query]);

  // Virtualization
  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => 36,
    overscan: 6,
  });

  React.useEffect(() => {
    if (!open) return;
    // measure + reset scroll whenever filter changes while open
    rowVirtualizer.measure();
    viewportRef.current?.scrollTo({ top: 0 });
    rowVirtualizer.scrollToIndex?.(0);
  }, [query, open, rowVirtualizer]);

  return (
    <Select.Root
      disabled={disabled}
      value={value}
      onValueChange={(v) => {
        onValueChange?.(v);
        setQuery("");
      }}
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          // wait for portal to mount, then focus & measure
          setTimeout(() => {
            rowVirtualizer.measure();
            inputRef.current?.focus();
          }, 0);
        } else {
          setQuery("");
        }
      }}
    >
      {/* Trigger */}
      <Select.Trigger
        className="
          group inline-flex w-full items-center justify-between gap-2
          rounded-xl border px-3 py-2 text-left text-sm shadow-none
          bg-white border-gray-300 text-gray-900
          dark:bg-gray-800 dark:border-gray-700 dark:text-white
          hover:text-orange dark:hover:text-orange
          focus:outline-none
        "
        aria-label="Searchable select"
      >
        <Select.Value placeholder={placeholder}>
          {selectedLabel}
        </Select.Value>
        <Select.Icon>
          <ChevronDown className="
            h-4 w-4 text-gray-500 dark:text-gray-400
            group-hover:text-orange dark:group-hover:text-orange
          " />
        </Select.Icon>
      </Select.Trigger>

      {/* Content */}
      <Select.Portal>
        <Select.Content
          forceMount
          position="popper"
          className="
            z-50 min-w-[--radix-select-trigger-width] overflow-hidden
            rounded-xl border shadow-2xl
            bg-white border-gray-200 shadow-black/10
            dark:bg-gray-800 dark:border-gray-700 dark:shadow-black/40
          "
          onCloseAutoFocus={() => setQuery("")}
        >
          <Select.ScrollUpButton className="flex h-6 items-center justify-center text-gray-500 dark:text-gray-400">
            <ChevronUp className="h-4 w-4" />
          </Select.ScrollUpButton>

          {/* Search bar */}
          <div className="
            flex items-center gap-2 border-b p-2
            bg-white border-gray-200
            dark:bg-gray-800 dark:border-gray-700
          ">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to filter…"
              className="
                w-full rounded-md border px-2 py-1 text-sm outline-none
                bg-transparent text-gray-900 placeholder:text-gray-500 border-gray-300
                dark:text-white dark:placeholder:text-gray-400 dark:border-gray-700
                focus:outline-none
              "
              onKeyDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Viewport (virtualized list) */}
          <Select.Viewport
            ref={viewportRef}
            className="
              max-h-64 overflow-auto p-1
              bg-white dark:bg-gray-800
            "
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No results
              </div>
            ) : (
              <div
                style={{
                  height: rowVirtualizer.getTotalSize(),
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((vItem) => {
                  const item = filtered[vItem.index];
                  return (
                    <div
                      key={item.value}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${vItem.start}px)`,
                      }}
                    >
                      <Select.Item
                        value={item.value}
                        className="
                          relative flex cursor-pointer select-none items-center
                          rounded-md px-2 py-2 text-sm outline-none
                          text-gray-900 dark:text-white
                          hover:text-orange dark:hover:text-orange
                          data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800
                          data-[highlighted]:text-orange dark:data-[highlighted]:text-orange
                        "
                      >
                        <Select.ItemText>{item.label}</Select.ItemText>
                        <Select.ItemIndicator className="
                          ml-auto text-gray-600 dark:text-gray-300
                          group-hover:text-orange dark:group-hover:text-orange
                        ">
                          <Check className="h-4 w-4" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    </div>
                  );
                })}
              </div>
            )}
          </Select.Viewport>

          <Select.ScrollDownButton className="flex h-6 items-center justify-center text-gray-500 dark:text-gray-400">
            <ChevronDown className="h-4 w-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
