import { type Dispatch, type SetStateAction } from "react";
import { type Collection, type CollectionEndpoint } from "@/app/types/models";

type EndpointLookup = Map<string, { collectionId: string }>;

export const buildEndpointLookup = (
  collections: Collection[],
): EndpointLookup => {
  const lookup: EndpointLookup = new Map();

  collections.forEach((collection) => {
    collection.endpoints.forEach((endpoint) => {
      lookup.set(endpoint.id, { collectionId: collection.id });
    });
  });

  return lookup;
};

export const getDefaultExpandedCollectionIds = (
  collections: Collection[],
): Set<string> => {
  const firstCollection = collections[0];

  return firstCollection ? new Set([firstCollection.id]) : new Set<string>();
};

export const getEffectiveExpandedCollectionIds = (
  hasCollectionInteraction: boolean,
  expandedCollectionIds: Set<string>,
  defaultExpandedCollectionIds: Set<string>,
): Set<string> =>
  hasCollectionInteraction
    ? expandedCollectionIds
    : defaultExpandedCollectionIds;

export const resolveDefaultEndpointId = (
  collection: Collection,
  lastSelectedEndpointId: string | null,
): string | null => {
  if (!collection.endpoints.length) {
    return null;
  }

  const lastSelectedInCollection = collection.endpoints.find(
    (endpoint) => endpoint.id === lastSelectedEndpointId,
  );

  return lastSelectedInCollection?.id ?? collection.endpoints[0]?.id ?? null;
};

export const getResolvedActiveEndpointId = (
  collections: Collection[],
  activeEndpointId: string | null,
  endpointLookup: Map<string, { collectionId: string }>,
  expandedCollectionIds: Set<string>,
  lastSelectedEndpointId: string | null,
): string | null => {
  if (!collections.length) {
    return null;
  }

  if (activeEndpointId && endpointLookup.has(activeEndpointId)) {
    return activeEndpointId;
  }

  const expandedCollections = collections.filter((collection) =>
    expandedCollectionIds.has(collection.id),
  );
  const targetCollection =
    expandedCollections.find((collection) => collection.endpoints.length > 0) ??
    collections.find((collection) => collection.endpoints.length > 0);

  if (!targetCollection) {
    return null;
  }

  return resolveDefaultEndpointId(targetCollection, lastSelectedEndpointId);
};

export const getNextCollectionName = (collections: Collection[]): string => {
  const baseName = "New Collection";
  const namePattern = new RegExp(`^${baseName}(?: (\\d+))?$`);
  const existingSuffixes = collections
    .map((collection) => collection.name.match(namePattern))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => Number(match[1] ?? 1));
  const nextSuffix =
    existingSuffixes.length > 0 ? Math.max(...existingSuffixes) + 1 : 1;

  return nextSuffix === 1 ? baseName : `${baseName} ${nextSuffix}`;
};

type RenameTarget = {
  collectionId: string;
  endpointId: string;
};

type AppSidebarHandlersArgs = {
  collections: Collection[];
  draft: { method: CollectionEndpoint["method"]; url: string };
  selectEndpoint: (endpointId: string) => void;
  addCollection: (collection: Collection) => void;
  deleteCollection: (collectionId: string) => void;
  addEndpoint: (collectionId: string, endpoint: CollectionEndpoint) => void;
  deleteEndpoint: (collectionId: string, endpointId: string) => void;
  renameEndpoint: (
    collectionId: string,
    endpointId: string,
    name: string,
  ) => void;
  renameCollection: (collectionId: string, name: string) => void;
  hasCollectionInteraction: boolean;
  defaultExpandedCollectionIds: Set<string>;
  setHasCollectionInteraction: Dispatch<SetStateAction<boolean>>;
  setExpandedCollectionIds: Dispatch<SetStateAction<Set<string>>>;
  setLastSelectedEndpointId: Dispatch<SetStateAction<string | null>>;
  renameTarget: RenameTarget | null;
  renameValue: string;
  setRenameTarget: Dispatch<SetStateAction<RenameTarget | null>>;
  setRenameValue: Dispatch<SetStateAction<string>>;
  setRenameDialogOpen: Dispatch<SetStateAction<boolean>>;
  collectionRenameTarget: string | null;
  collectionRenameValue: string;
  setCollectionRenameTarget: Dispatch<SetStateAction<string | null>>;
  setCollectionRenameValue: Dispatch<SetStateAction<string>>;
  setCollectionRenameDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export const createAppSidebarHandlers = ({
  collections,
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
}: AppSidebarHandlersArgs) => {
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
    const name = getNextCollectionName(collections);

    addCollection({
      id: crypto.randomUUID(),
      name,
      baseUrl: "",
      endpoints: [],
    });
  };

  const handleAddEndpoint = (collectionId: string) => {
    setHasCollectionInteraction(true);
    setExpandedCollectionIds((prev) => {
      const base = hasCollectionInteraction
        ? prev
        : defaultExpandedCollectionIds;
      const next = new Set(base);
      next.add(collectionId);
      return next;
    });
    addEndpoint(collectionId, {
      id: crypto.randomUUID(),
      name: "Untitled",
      method: draft.method,
      url: draft.url,
    });
  };

  const handleDeleteCollection = (collectionId: string) => {
    setHasCollectionInteraction(true);
    setExpandedCollectionIds((prev) => {
      const base = hasCollectionInteraction
        ? prev
        : defaultExpandedCollectionIds;
      const next = new Set(base);
      next.delete(collectionId);
      return next;
    });
    deleteCollection(collectionId);
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

  return {
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
  };
};
