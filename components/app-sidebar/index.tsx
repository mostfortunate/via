"use client";

import { useState, type ComponentProps } from "react";
import { type Collection } from "@/app/types/models";
import { useWorkspace } from "@/components/workspace-provider";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

import AppSidebarFooter from "@/components/app-sidebar/sidebar-footer";
import RenameDialog from "@/components/app-sidebar/rename-dialog";
import CollectionHeader from "@/components/app-sidebar/collection-row";
import EndpointItem from "@/components/app-sidebar/endpoint-item";

export type AppSidebarProps = ComponentProps<typeof Sidebar>;
export default function AppSidebar({ ...sidebarProps }: AppSidebarProps) {
  const {
    collections: data,
    activeEndpointId,
    selectEndpoint,
    addCollection,
    addEndpoint,
    deleteEndpoint,
    renameEndpoint,
    renameCollection,
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
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameTarget, setRenameTarget] = useState<{
    collectionId: string;
    endpointId: string;
  } | null>(null);
  const [collectionRenameDialogOpen, setCollectionRenameDialogOpen] =
    useState(false);
  const [collectionRenameValue, setCollectionRenameValue] = useState("");
  const [collectionRenameTarget, setCollectionRenameTarget] = useState<
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

  const handleDeleteEndpoint = (collectionId: string, endpointId: string) => {
    deleteEndpoint(collectionId, endpointId);
  };

  const handleRenameStart = (
    collectionId: string,
    endpointId: string,
    currentName: string,
  ) => {
    setRenameTarget({ collectionId, endpointId });
    setRenameValue(currentName);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = () => {
    if (!renameTarget) {
      return;
    }

    const nextName = renameValue.trim() || "Untitled";
    renameEndpoint(
      renameTarget.collectionId,
      renameTarget.endpointId,
      nextName,
    );
    setRenameDialogOpen(false);
  };

  const handleCollectionRenameStart = (
    collectionId: string,
    currentName: string,
  ) => {
    setCollectionRenameTarget(collectionId);
    setCollectionRenameValue(currentName);
    setCollectionRenameDialogOpen(true);
  };

  const handleCollectionRenameSubmit = () => {
    if (!collectionRenameTarget) {
      return;
    }

    const nextName = collectionRenameValue.trim() || "New Collection";
    renameCollection(collectionRenameTarget, nextName);
    setCollectionRenameDialogOpen(false);
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
                    <CollectionHeader
                      name={collection.name}
                      isOpen={isOpen}
                      onRename={() =>
                        handleCollectionRenameStart(
                          collection.id,
                          collection.name,
                        )
                      }
                      onAddEndpoint={() => handleAddEndpoint(collection.id)}
                    />
                    <CollapsibleContent>
                      <SidebarMenuSub className="relative mx-0 translate-x-0 border-l-0 px-0">
                        <span className="bg-sidebar-border pointer-events-none absolute top-0 bottom-0 left-4 z-10 w-px" />
                        {collection.endpoints.map((endpoint) => (
                          <EndpointItem
                            key={endpoint.id}
                            endpoint={endpoint}
                            isActive={endpoint.id === resolvedActiveEndpointId}
                            onSelect={() => handleEndpointSelect(endpoint.id)}
                            onRename={() =>
                              handleRenameStart(
                                collection.id,
                                endpoint.id,
                                endpoint.name,
                              )
                            }
                            onDelete={() =>
                              handleDeleteEndpoint(collection.id, endpoint.id)
                            }
                          />
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
      <RenameDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        kind="endpoint"
        value={renameValue}
        onValueChange={setRenameValue}
        onSave={handleRenameSubmit}
      />
      <RenameDialog
        open={collectionRenameDialogOpen}
        onOpenChange={setCollectionRenameDialogOpen}
        kind="collection"
        value={collectionRenameValue}
        onValueChange={setCollectionRenameValue}
        onSave={handleCollectionRenameSubmit}
      />
      <AppSidebarFooter onAddCollection={handleAddCollection} />
      <SidebarRail />
    </Sidebar>
  );
}
