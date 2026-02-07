"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Plus } from "lucide-react";

type CollectionActionsProps = {
  onRename: () => void;
  onDelete: () => void;
  onAddEndpoint: () => void;
};

export default function CollectionActions({
  onRename,
  onDelete,
  onAddEndpoint,
}: CollectionActionsProps) {
  return (
    <span className="ml-auto flex items-center gap-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="pointer-events-none size-7 opacity-0 transition-opacity group-hover/collection:pointer-events-auto group-hover/collection:opacity-100"
            onClick={(event) => event.stopPropagation()}
            aria-label="Collection actions"
          >
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={40}>
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onRename();
            }}
          >
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="pointer-events-none size-7 opacity-0 transition-opacity group-hover/collection:pointer-events-auto group-hover/collection:opacity-100"
        onClick={(event) => {
          event.stopPropagation();
          onAddEndpoint();
        }}
        aria-label="Add endpoint"
      >
        <Plus className="size-4" />
      </Button>
    </span>
  );
}
