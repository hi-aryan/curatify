"use client";

import { useState } from "react";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface User {
  id: string | number;
  spotifyId: string;
  name: string;
  topArtists?: { name: string }[];
}

interface FriendsComboboxProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchResults: User[];
  isLoading: boolean;
  onSelectUser: (user: User) => void;
  placeholder?: string;
}

export function FriendsCombobox({
  searchValue,
  onSearchChange,
  searchResults,
  isLoading,
  onSelectUser,
  placeholder = "Search username...",
}: FriendsComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-light/5 border border-light/10 rounded-lg hover:bg-light/10 hover:border-green/50 transition-all duration-300"
        >
          <span className="text-light/50">{placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-light/40" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 bg-dark border border-light/10 rounded-lg shadow-xl shadow-black/20"
        align="start"
      >
        <Command shouldFilter={false} className="bg-transparent">
          <CommandInput
            placeholder={placeholder}
            value={searchValue}
            onValueChange={onSearchChange}
            className="text-light placeholder:text-light/40 border-b border-light/10"
          />
          <CommandList className="max-h-[200px] custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-green" />
              </div>
            ) : searchResults.length === 0 ? (
              <CommandEmpty className="py-6 text-center text-sm text-light/50">
                {searchValue.length > 0
                  ? "No users found."
                  : "Start typing to search..."}
              </CommandEmpty>
            ) : (
              <CommandGroup className="p-1">
                {searchResults.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.spotifyId}
                    onSelect={() => {
                      onSelectUser(user);
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-light hover:bg-green/10 data-[selected=true]:bg-green/20 data-[selected=true]:text-green transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-green/20 flex items-center justify-center text-green text-xs font-medium shrink-0">
                      {user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium truncate">{user.name}</span>
                      {user.topArtists?.[0] && (
                        <span className="text-[10px] text-light/50 truncate">
                          Top: {user.topArtists[0].name}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

