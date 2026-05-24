"use client";

import { type HTTPMethod } from "@/app/types/http";
import { cn } from "@/lib/utils";
import { type CollectionEndpoint } from "@/app/types/models";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import EndpointActions from "@/components/app-sidebar/endpoint-actions";

type EndpointItemProps = {
  endpoint: CollectionEndpoint;
  isActive: boolean;
  onSelect: () => void;
  onRename: () => void;
  onMethodChange: (method: HTTPMethod) => void;
  onDelete: () => void;
};

export default function EndpointItem({
  endpoint,
  isActive,
  onSelect,
  onRename,
  onMethodChange,
  onDelete,
}: EndpointItemProps) {
  const itemColorVar = `--http-method-${endpoint.method.toLowerCase()}`;

  return (
    <SidebarMenuItem
      className={cn(
        "group/endpoint relative flex items-center gap-2 rounded-md",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
      )}
    >
      <SidebarMenuButton
        isActive={isActive}
        className="min-w-0 flex-1 pl-6"
        onClick={onSelect}
      >
        <span className="truncate text-sm">{endpoint.name}</span>
      </SidebarMenuButton>
      <span className="ml-auto flex items-center justify-end gap-1">
        <EndpointActions
          onRename={onRename}
          onMethodChange={onMethodChange}
          onDelete={onDelete}
          currentMethod={endpoint.method}
        />
        <span
          className="text-muted-foreground group-hover/endpoint:text-sidebar-accent-foreground w-11 font-mono text-xs font-semibold"
          style={{ color: `var(${itemColorVar})` }}
        >
          {endpoint.method}
        </span>
      </span>
    </SidebarMenuItem>
  );
}
