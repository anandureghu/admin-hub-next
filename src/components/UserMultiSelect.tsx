import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X, Users, Search } from "lucide-react";
import { User } from "@/modules/trips/schemas/user.schema";

interface UserMultiSelectProps {
  users: User[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  isLoading?: boolean;
}

export function UserMultiSelect({
  users,
  selectedIds,
  onChange,
  isLoading,
}: UserMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchQuery(""); // Clear search when closing
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggle(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id]
    );
  }

  function removeTag(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(selectedIds.filter((s) => s !== id));
  }

  function clearAll(e: React.MouseEvent) {
    e.stopPropagation();
    onChange([]);
    setSearchQuery("");
  }

  function handleOpen() {
    setOpen((o) => !o);
    if (!open) {
      setSearchQuery(""); // Clear search when opening
    }
  }

  const selectedUsers = users.filter((u) => selectedIds.includes(u.id));
  const hasSelection = selectedIds.length > 0;

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  return (
    <div ref={ref} className="relative w-56">
      <button
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-border bg-input text-sm text-foreground hover:bg-accent transition-colors min-h-[38px]"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Users className="w-4 h-4 text-muted-foreground shrink-0" />
          {hasSelection ? (
            <div className="flex items-center gap-1 flex-wrap">
              {selectedUsers.slice(0, 2).map((u) => (
                <span
                  key={u.id}
                  className="flex items-center gap-1 bg-primary/20 text-primary rounded px-1.5 py-0.5 text-xs font-medium"
                >
                  {u.name.split(" ")[0]}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={(e) => removeTag(u.id, e)}
                  />
                </span>
              ))}
              {selectedUsers.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{selectedUsers.length - 2} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">All Users</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {hasSelection && (
            <X
              className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground"
              onClick={clearAll}
            />
          )}
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="px-3 py-4 text-sm text-center text-muted-foreground">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-3 py-4 text-sm text-center text-muted-foreground">
              {searchQuery ? "No users match your search" : "No users found"}
            </div>
          ) : (
            <div>
              {searchQuery && (
                <div className="px-3 py-1 text-xs text-muted-foreground border-b border-border">
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                </div>
              )}
              <ul className="max-h-56 overflow-y-auto py-1">
                {filteredUsers.map((user) => {
                const selected = selectedIds.includes(user.id);
                return (
                  <li
                    key={user.id}
                    onClick={() => toggle(user.id)}
                    className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-accent transition-colors"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        selected
                          ? "bg-primary border-primary"
                          : "border-border bg-transparent"
                      }`}
                    >
                      {selected && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-foreground truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}