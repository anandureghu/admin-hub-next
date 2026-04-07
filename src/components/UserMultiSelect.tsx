import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Added
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
    const { t } = useTranslation(); // Initialize translation
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setSearchQuery(""); 
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
            setSearchQuery("");
        }
    }

    const selectedUsers = users.filter((u) => selectedIds.includes(u.id));
    const hasSelection = selectedIds.length > 0;

    const filteredUsers = users.filter((user) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    });

    return (
        <div ref={ref} className="relative w-76">
            <button
                type="button"
                onClick={handleOpen}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-border bg-input text-sm text-foreground hover:bg-secondary/50 focus:ring-1 focus:ring-ring transition-colors min-h-[38px]"
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                    {hasSelection ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {selectedUsers.slice(0, 2).map((u) => (
                                <span
                                    key={u.id}
                                    className="flex items-center gap-1 bg-primary text-primary-foreground rounded px-2 py-0.5 text-xs font-medium"
                                >
                                    {u.name.split(" ")[0]}
                                    <X
                                        className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                                        onClick={(e) => removeTag(u.id, e)}
                                    />
                                </span>
                            ))}
                            {selectedUsers.length > 2 && (
                                <span className="text-xs font-medium text-foreground whitespace-nowrap bg-secondary px-2 py-0.5 rounded">
                                    {t("common.userMultiSelect.more", { count: selectedUsers.length - 2 })}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-muted-foreground whitespace-nowrap">
                            {t("common.userMultiSelect.placeholder")}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
                    {hasSelection && (
                        <X
                            className="w-3.5 h-3.5 cursor-pointer hover:text-foreground transition-colors"
                            onClick={clearAll}
                        />
                    )}
                    <ChevronDown
                        className={`w-4 h-4 transition-transform ${open ? "rotate-180 text-foreground" : ""}`}
                    />
                </div>
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-full rounded-md border border-border bg-secondary shadow-xl overflow-hidden">
                    <div className="p-2 border-b border-border/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={t("common.userMultiSelect.searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="px-3 py-4 text-sm text-center text-muted-foreground">
                            {t("common.userMultiSelect.loading")}
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-center text-muted-foreground">
                            {searchQuery ? t("common.userMultiSelect.noMatch") : t("common.userMultiSelect.noUsers")}
                        </div>
                    ) : (
                        <div>
                            {searchQuery && (
                                <div className="px-3 py-1 text-xs text-muted-foreground border-b border-border">
                                    {t("common.userMultiSelect.found", { count: filteredUsers.length })}
                                </div>
                            )}
                            <ul className="max-h-56 overflow-y-auto py-1">
                                {filteredUsers.map((user) => {
                                    const selected = selectedIds.includes(user.id);
                                    return (
                                        <li
                                            key={user.id}
                                            onClick={() => toggle(user.id)}
                                            className={`flex items-center gap-3 px-3 py-2 text-sm cursor-pointer transition-colors ${selected
                                                ? "bg-primary/10 hover:bg-primary/20"
                                                : "hover:bg-white/5"
                                                }`}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${selected
                                                        ? "bg-primary border-primary"
                                                        : "border-muted-foreground/70 bg-transparent"
                                                    }`}
                                            >
                                                {selected && (
                                                    <Check className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className={`font-medium truncate ${selected ? "text-primary" : "text-foreground"}`}>
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