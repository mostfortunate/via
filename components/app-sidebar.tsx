"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { type Collection } from "@/app/types/models";
import { useWorkspace } from "@/components/workspace-provider";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

import { ChevronRight, Folder, Plus, Ellipsis } from "lucide-react";

export type AppSidebarProps = ComponentProps<typeof Sidebar>;
export default function AppSidebar({ ...sidebarProps }: AppSidebarProps) {
  const {
    collections: data,
    activeEndpointId,
    selectEndpoint,
    addCollection,
    addEndpoint,
    draft,
  } = useWorkspace();
  const [expandedCollectionIds, setExpandedCollectionIds] = useState<
    Set<string>
  >(() => new Set());
  const [hasCollectionInteraction, setHasCollectionInteraction] =
    useState(false);
  const [lastSelectedEndpointId, setLastSelectedEndpointId] = useState<
    string | null
  >(null);

  const endpointLookup = new Map<string, { collectionId: string }>();
  data.forEach((collection) => {
    collection.endpoints.forEach((endpoint) => {
      endpointLookup.set(endpoint.id, { collectionId: collection.id });
    });
  });

  const firstCollection = data[0];
  const defaultExpandedCollectionIds = firstCollection
    ? new Set([firstCollection.id])
    : new Set<string>();

  const effectiveExpandedCollectionIds = hasCollectionInteraction
    ? expandedCollectionIds
    : defaultExpandedCollectionIds;

  const resolveDefaultEndpointId = (collection: Collection) => {
    if (!collection.endpoints.length) {
      return null;
    }

    const lastSelectedInCollection = collection.endpoints.find(
      (endpoint) => endpoint.id === lastSelectedEndpointId,
    );

    return lastSelectedInCollection?.id ?? collection.endpoints[0]?.id ?? null;
  };

  const resolvedActiveEndpointId = (() => {
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
  })();

  const handleCollectionOpenChange = (
    collection: Collection,
    open: boolean,
  ) => {
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
  };

  const handleEndpointSelect = (endpointId: string) => {
    selectEndpoint(endpointId);
    setLastSelectedEndpointId(endpointId);
  };

  const handleAddCollection = () => {
    const baseName = "New Collection";
    const namePattern = new RegExp(`^${baseName}(?: (\\d+))?$`);
    const existingSuffixes = data
      .map((collection) => collection.name.match(namePattern))
      .filter((match): match is RegExpMatchArray => match !== null)
      .map((match) => Number(match[1] ?? 1));
    const nextSuffix =
      existingSuffixes.length > 0 ? Math.max(...existingSuffixes) + 1 : 1;
    const name = nextSuffix === 1 ? baseName : `${baseName} ${nextSuffix}`;

    addCollection({
      id: crypto.randomUUID(),
      name,
      baseUrl: "",
      endpoints: [],
    });
  };

  const handleAddEndpoint = (collectionId: string) => {
    addEndpoint(collectionId, {
      id: crypto.randomUUID(),
      name: "Untitled",
      method: draft.method,
      url: draft.url,
    });
  };

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
                            <Folder className="text-muted-foreground size-4 transition-opacity group-hover/collection:opacity-0" />
                            <ChevronRight
                              className={cn(
                                "absolute size-4 opacity-0 transition-opacity group-hover/collection:opacity-100",
                                isOpen && "rotate-90",
                              )}
                            />
                          </span>
                          <span className="truncate font-semibold">
                            {collection.name}
                          </span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <span className="ml-auto flex items-center gap-0">
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="pointer-events-none size-7 opacity-0 transition-opacity group-hover/collection:pointer-events-auto group-hover/collection:opacity-100"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAddEndpoint(collection.id);
                          }}
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
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="pointer-events-none size-7 opacity-0 transition-opacity group-focus-within/endpoint:pointer-events-auto group-focus-within/endpoint:opacity-100 group-hover/endpoint:pointer-events-auto group-hover/endpoint:opacity-100"
                                      onClick={(event) =>
                                        event.stopPropagation()
                                      }
                                      aria-label="Endpoint actions"
                                    >
                                      <Ellipsis className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    side="right"
                                    align="start"
                                    sideOffset={62}
                                  >
                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <span
                                  className="text-muted-foreground group-hover/endpoint:text-sidebar-accent-foreground w-11 font-mono text-xs font-semibold"
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
      <SidebarFooter className="mb-2 flex w-full flex-row gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleAddCollection}
        >
          <Plus className="size-4" />
          Add Collection
        </Button>
        <ModeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
