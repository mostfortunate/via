"use client";

import { Button } from "@/components/ui/button";
import { Ellipsis, Plus } from "lucide-react";

type CollectionActionsProps = {
  onRename: () => void;
  onAddEndpoint: () => void;
};

export default function CollectionActions({
  onRename,
  onAddEndpoint,
}: CollectionActionsProps) {
  return (
    <span className="ml-auto flex items-center gap-0">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="pointer-events-none size-7 opacity-0 transition-opacity group-hover/collection:pointer-events-auto group-hover/collection:opacity-100"
        onClick={(event) => {
          event.stopPropagation();
          onRename();
        }}
        aria-label="Collection actions"
      >
        <Ellipsis className="size-4" />
      </Button>
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
