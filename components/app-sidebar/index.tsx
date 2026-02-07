"use client";

import { useState, type ComponentProps } from "react";
import { type Collection } from "@/app/types/models";
import { useWorkspace } from "@/components/workspace-provider";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

import AppSidebarFooter from "@/components/app-sidebar/sidebar-footer";
import RenameDialog from "@/components/app-sidebar/rename-dialog";
import CollectionList from "@/components/app-sidebar/collection-list";
import {
  buildEndpointLookup,
  getDefaultExpandedCollectionIds,
  resolveDefaultEndpointId,
} from "@/components/app-sidebar/helpers";

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

  const endpointLookup = buildEndpointLookup(data);

  const defaultExpandedCollectionIds = getDefaultExpandedCollectionIds(data);

  const effectiveExpandedCollectionIds = hasCollectionInteraction
    ? expandedCollectionIds
    : defaultExpandedCollectionIds;

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

    return resolveDefaultEndpointId(targetCollection, lastSelectedEndpointId);
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
        <CollectionList
          collections={data}
          expandedCollectionIds={effectiveExpandedCollectionIds}
          resolvedActiveEndpointId={resolvedActiveEndpointId}
          onCollectionOpenChange={handleCollectionOpenChange}
          onCollectionRename={(collection) =>
            handleCollectionRenameStart(collection.id, collection.name)
          }
          onAddEndpoint={(collection) => handleAddEndpoint(collection.id)}
          onEndpointSelect={(_, endpointId) => handleEndpointSelect(endpointId)}
          onEndpointRename={(collection, endpointId, endpointName) =>
            handleRenameStart(collection.id, endpointId, endpointName)
          }
          onEndpointDelete={(collection, endpointId) =>
            handleDeleteEndpoint(collection.id, endpointId)
          }
        />
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
