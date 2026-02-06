"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

type EndpointActionsProps = {
  onRename: () => void;
  onDelete: () => void;
};

export default function EndpointActions({
  onRename,
  onDelete,
}: EndpointActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="pointer-events-none size-7 opacity-0 transition-opacity group-focus-within/endpoint:pointer-events-auto group-focus-within/endpoint:opacity-100 group-hover/endpoint:pointer-events-auto group-hover/endpoint:opacity-100"
          onClick={(event) => event.stopPropagation()}
          aria-label="Endpoint actions"
        >
          <Ellipsis className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" sideOffset={62}>
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
  );
}
