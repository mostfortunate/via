import { useState } from "react";
import { type Collection, type CollectionEndpoint } from "@/app/types/models";

export type UseCollectionsResult = {
  collections: Collection[];
  activeEndpointId: string | null;
  selectEndpoint: (endpointId: string) => void;
  getEndpointById: (endpointId: string) => CollectionEndpoint | null;
  addCollection: (collection: Collection) => void;
  addEndpoint: (collectionId: string, endpoint: CollectionEndpoint) => void;
  deleteEndpoint: (collectionId: string, endpointId: string) => void;
  renameEndpoint: (
    collectionId: string,
    endpointId: string,
    name: string,
  ) => void;
};

export function useCollections(
  initialCollections: Collection[] = [],
): UseCollectionsResult {
  const [collections, setCollections] =
    useState<Collection[]>(initialCollections);
  const [activeEndpointId, setActiveEndpointId] = useState<string | null>(null);

  const endpointLookup = () => {
    const map = new Map<string, CollectionEndpoint>();
    collections.forEach((collection) => {
      collection.endpoints.forEach((endpoint) => {
        map.set(endpoint.id, endpoint);
      });
    });
    return map;
  };

  const selectEndpoint = (endpointId: string) => {
    setActiveEndpointId(endpointId);
  };

  const getEndpointById = (endpointId: string) =>
    endpointLookup().get(endpointId) ?? null;

  const addCollection = (collection: Collection) => {
    setCollections((prev) => [...prev, collection]);
  };

  const addEndpoint = (collectionId: string, endpoint: CollectionEndpoint) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              endpoints: [...collection.endpoints, endpoint],
            }
          : collection,
      ),
    );
  };

  const deleteEndpoint = (collectionId: string, endpointId: string) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              endpoints: collection.endpoints.filter(
                (endpoint) => endpoint.id !== endpointId,
              ),
            }
          : collection,
      ),
    );
    setActiveEndpointId((prev) => (prev === endpointId ? null : prev));
  };

  const renameEndpoint = (
    collectionId: string,
    endpointId: string,
    name: string,
  ) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              endpoints: collection.endpoints.map((endpoint) =>
                endpoint.id === endpointId ? { ...endpoint, name } : endpoint,
              ),
            }
          : collection,
      ),
    );
  };

  return {
    collections,
    activeEndpointId,
    selectEndpoint,
    getEndpointById,
    addCollection,
    addEndpoint,
    deleteEndpoint,
    renameEndpoint,
  };
}
