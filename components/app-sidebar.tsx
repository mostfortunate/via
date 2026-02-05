"use client";

import { useState, useMemo, useCallback, type ComponentProps } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";
import { ChevronRight, Folder, Plus, Ellipsis } from "lucide-react";
import { type Collection } from "@/app/types/models";
import { cn } from "@/lib/utils";

export interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  data: Collection[];
}
export default function AppSidebar({ ...props }: AppSidebarProps) {
  const { data, ...sidebarProps } = props;
  const [expandedCollectionIds, setExpandedCollectionIds] = useState<
    Set<string>
  >(() => new Set());
  const [hasCollectionInteraction, setHasCollectionInteraction] =
    useState(false);
  const [activeEndpointId, setActiveEndpointId] = useState<string | null>(null);
  const [lastSelectedEndpointId, setLastSelectedEndpointId] = useState<
    string | null
  >(null);

  const endpointLookup = useMemo(() => {
    const map = new Map<string, { collectionId: string }>();
    data.forEach((collection) => {
      collection.endpoints.forEach((endpoint) => {
        map.set(endpoint.id, { collectionId: collection.id });
      });
    });
    return map;
  }, [data]);

  const defaultExpandedCollectionIds = useMemo(() => {
    const firstCollection = data[0];
    return firstCollection ? new Set([firstCollection.id]) : new Set<string>();
  }, [data]);

  const effectiveExpandedCollectionIds = useMemo(() => {
    return hasCollectionInteraction
      ? expandedCollectionIds
      : defaultExpandedCollectionIds;
  }, [
    defaultExpandedCollectionIds,
    expandedCollectionIds,
    hasCollectionInteraction,
  ]);

  const resolveDefaultEndpointId = useCallback(
    (collection: Collection) => {
      if (!collection.endpoints.length) {
        return null;
      }

      const lastSelectedInCollection = collection.endpoints.find(
        (endpoint) => endpoint.id === lastSelectedEndpointId,
      );

      return (
        lastSelectedInCollection?.id ?? collection.endpoints[0]?.id ?? null
      );
    },
    [lastSelectedEndpointId],
  );

  const resolvedActiveEndpointId = useMemo(() => {
    if (!data.length) {
      return null;
    }

    if (activeEndpointId && endpointLookup.has(activeEndpointId)) {
      return activeEndpointId;
    }

    const expandedCollections = data.filter((collection) =>
      effectiveExpandedCollectionIds.has(collection.id),
    );
    const targetCollection =
      expandedCollections.find(
        (collection) => collection.endpoints.length > 0,
      ) ?? data.find((collection) => collection.endpoints.length > 0);

    if (!targetCollection) {
      return null;
    }

    return resolveDefaultEndpointId(targetCollection);
  }, [
    activeEndpointId,
    data,
    effectiveExpandedCollectionIds,
    endpointLookup,
    resolveDefaultEndpointId,
  ]);

  const handleCollectionOpenChange = useCallback(
    (collection: Collection, open: boolean) => {
      setHasCollectionInteraction(true);
      setExpandedCollectionIds((prev) => {
        const base = hasCollectionInteraction
          ? prev
          : defaultExpandedCollectionIds;
        const next = new Set(base);
        if (open) {
          next.add(collection.id);
        } else {
          next.delete(collection.id);
        }
        return next;
      });

      if (open) {
        const defaultEndpointId = resolveDefaultEndpointId(collection);
        if (defaultEndpointId) {
          setActiveEndpointId(defaultEndpointId);
        }
      }
    },
    [
      defaultExpandedCollectionIds,
      hasCollectionInteraction,
      resolveDefaultEndpointId,
    ],
  );

  const handleEndpointSelect = useCallback((endpointId: string) => {
    setActiveEndpointId(endpointId);
    setLastSelectedEndpointId(endpointId);
  }, []);

  return (
    <Sidebar {...sidebarProps}>
      <SidebarContent className="mt-2 gap-0">
        {data.map((collection) => {
          const isOpen = effectiveExpandedCollectionIds.has(collection.id);

          return (
            <Collapsible
              key={collection.id}
              open={isOpen}
              onOpenChange={(open) =>
                handleCollectionOpenChange(collection, open)
              }
              className="group/collapsible"
            >
              <SidebarGroup className="py-0">
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem className="group/collection hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="min-w-0 flex-1 hover:bg-transparent hover:text-inherit">
                          <span className="relative flex size-4 items-center justify-center">
                            <Folder className="size-4 transition-opacity group-hover/collection:opacity-0" />
                            <ChevronRight
                              className={cn(
                                "absolute size-4 opacity-0 transition-opacity group-hover/collection:opacity-100",
                                isOpen && "rotate-90",
                              )}
                            />
                          </span>
                          <span className="truncate">{collection.name}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <span className="ml-auto flex items-center gap-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="pointer-events-none size-7 opacity-0 transition-opacity group-focus-within/collection:pointer-events-auto group-focus-within/collection:opacity-100 group-hover/collection:pointer-events-auto group-hover/collection:opacity-100"
                          onClick={(event) => event.stopPropagation()}
                          aria-label="Collection actions"
                        >
                          <Ellipsis className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="pointer-events-none size-7 opacity-0 transition-opacity group-focus-within/collection:pointer-events-auto group-focus-within/collection:opacity-100 group-hover/collection:pointer-events-auto group-hover/collection:opacity-100"
                          onClick={(event) => event.stopPropagation()}
                          aria-label="Add endpoint"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </span>
                    </SidebarMenuItem>
                    <CollapsibleContent>
                      <SidebarMenuSub className="relative mx-0 translate-x-0 border-l-0 px-0">
                        <span className="bg-sidebar-border pointer-events-none absolute top-0 bottom-0 left-4 z-10 w-px" />
                        {collection.endpoints.map((endpoint) => {
                          const isActive =
                            endpoint.id === resolvedActiveEndpointId;
                          const itemColorVar = `--http-method-${endpoint.method.toLowerCase()}`;

                          return (
                            <SidebarMenuItem
                              key={endpoint.id}
                              className={cn(
                                "group/endpoint relative flex items-center gap-2 rounded-md",
                                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                isActive &&
                                  "bg-sidebar-accent text-sidebar-accent-foreground",
                              )}
                            >
                              <SidebarMenuButton
                                isActive={isActive}
                                className="min-w-0 flex-1 pl-6"
                                onClick={() =>
                                  handleEndpointSelect(endpoint.id)
                                }
                              >
                                <span className="truncate text-sm">
                                  {endpoint.name}
                                </span>
                              </SidebarMenuButton>
                              <span className="ml-auto flex items-center justify-end gap-1">
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
                                <span
                                  className="text-muted-foreground group-hover/endpoint:text-sidebar-accent-foreground w-10 font-mono text-xs font-semibold"
                                  style={{ color: `var(${itemColorVar})` }}
                                >
                                  {endpoint.method}
                                </span>
                              </span>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <Button className="mb-2 w-full justify-center" variant="outline">
          <Plus className="size-4" />
          Add Collection
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
