"use client";

import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import CollectionActions from "@/components/app-sidebar/collection-actions";
import { ChevronRight, Folder } from "lucide-react";

type CollectionHeaderProps = {
  name: string;
  isOpen: boolean;
  onRename: () => void;
  onDelete: () => void;
  onAddEndpoint: () => void;
};

export default function CollectionHeader({
  name,
  isOpen,
  onRename,
  onDelete,
  onAddEndpoint,
}: CollectionHeaderProps) {
  return (
    <SidebarMenuItem className="group/collection hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md">
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="min-w-0 flex-1 hover:bg-transparent hover:text-inherit">
          <span className="relative flex size-4 items-center justify-center">
            <Folder className="text-muted-foreground size-4 transition-opacity group-hover/collection:opacity-0" />
            <ChevronRight
              className={cn(
                "absolute size-4 opacity-0 transition-opacity group-hover/collection:opacity-100",
                isOpen && "rotate-90",
              )}
            />
          </span>
          <span className="truncate font-semibold">{name}</span>
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollectionActions
        onRename={onRename}
        onDelete={onDelete}
        onAddEndpoint={onAddEndpoint}
      />
    </SidebarMenuItem>
  );
}
