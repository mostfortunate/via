"use client";

import { useState, type ComponentProps } from "react";
import { useWorkspace } from "@/components/workspace-provider";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

import AppSidebarFooter from "@/components/app-sidebar/sidebar-footer";
import RenameDialog from "@/components/app-sidebar/rename-dialog";
import CollectionList from "@/components/app-sidebar/collection-list";
import {
  buildEndpointLookup,
  createAppSidebarHandlers,
  getDefaultExpandedCollectionIds,
  getEffectiveExpandedCollectionIds,
  getResolvedActiveEndpointId,
} from "@/components/app-sidebar/helpers";

export type AppSidebarProps = ComponentProps<typeof Sidebar>;
export default function AppSidebar({ ...sidebarProps }: AppSidebarProps) {
  const {
    collections: data,
    activeEndpointId,
    selectEndpoint,
    addCollection,
    deleteCollection,
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

  const effectiveExpandedCollectionIds = getEffectiveExpandedCollectionIds(
    hasCollectionInteraction,
    expandedCollectionIds,
    defaultExpandedCollectionIds,
  );

  const resolvedActiveEndpointId = getResolvedActiveEndpointId(
    data,
    activeEndpointId,
    endpointLookup,
    effectiveExpandedCollectionIds,
    lastSelectedEndpointId,
  );

  const {
    handleCollectionOpenChange,
    handleEndpointSelect,
    handleAddCollection,
    handleAddEndpoint,
    handleDeleteCollection,
    handleDeleteEndpoint,
    handleRenameStart,
    handleRenameSubmit,
    handleCollectionRenameStart,
    handleCollectionRenameSubmit,
  } = createAppSidebarHandlers({
    collections: data,
    draft,
    selectEndpoint,
    addCollection,
    deleteCollection,
    addEndpoint,
    deleteEndpoint,
    renameEndpoint,
    renameCollection,
    hasCollectionInteraction,
    defaultExpandedCollectionIds,
    setHasCollectionInteraction,
    setExpandedCollectionIds,
    setLastSelectedEndpointId,
    renameTarget,
    renameValue,
    setRenameTarget,
    setRenameValue,
    setRenameDialogOpen,
    collectionRenameTarget,
    collectionRenameValue,
    setCollectionRenameTarget,
    setCollectionRenameValue,
    setCollectionRenameDialogOpen,
  });

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
          onCollectionDelete={(collection) =>
            handleDeleteCollection(collection.id)
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
