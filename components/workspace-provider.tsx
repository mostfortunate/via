"use client";

import { createContext, useContext } from "react";

import { type Collection, type CollectionEndpoint } from "@/app/types/models";
import { useCollections } from "@/hooks/use-collections";
import {
  useRequestDraft,
  type RequestDraft,
  type RequestDraftActions,
} from "@/hooks/use-request-draft";

export type WorkspaceContextValue = {
  collections: Collection[];
  activeEndpointId: string | null;
  draft: RequestDraft;
  draftActions: Omit<RequestDraftActions, "draft">;
  selectEndpoint: (endpointId: string) => void;
  addCollection: (collection: Collection) => void;
  addEndpoint: (collectionId: string, endpoint: CollectionEndpoint) => void;
  deleteEndpoint: (collectionId: string, endpointId: string) => void;
  renameEndpoint: (
    collectionId: string,
    endpointId: string,
    name: string,
  ) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export type WorkspaceProviderProps = {
  initialCollections: Collection[];
  children: React.ReactNode;
};

export function WorkspaceProvider({
  initialCollections,
  children,
}: WorkspaceProviderProps) {
  const {
    collections,
    activeEndpointId,
    selectEndpoint: selectEndpointBase,
    getEndpointById,
    addCollection,
    addEndpoint,
    deleteEndpoint,
    renameEndpoint,
  } = useCollections(initialCollections);

  const {
    draft,
    setMethod,
    setUrl,
    updateQueryParam,
    deleteQueryParam,
    setQueryParams,
    updateHeader,
    deleteHeader,
    setHeaders,
    setBody,
    loadFromEndpoint,
    reset,
  } = useRequestDraft();

  const selectEndpoint = (endpointId: string) => {
    selectEndpointBase(endpointId);
    const endpoint = getEndpointById(endpointId);
    if (!endpoint) return;

    // build the url by combining collection's baseUrl and endpoint's path, make sure that there's exactly one slash between them
    const collection = collections.find((col) =>
      col.endpoints.some((ep) => ep.id === endpointId),
    );

    const baseUrl = collection?.baseUrl || "";
    const path = endpoint.url || "";
    const url =
      baseUrl.endsWith("/") && path.startsWith("/")
        ? baseUrl + path.slice(1)
        : baseUrl + path;

    loadFromEndpoint(endpoint.method, url);
  };

  const draftActions = {
    setMethod,
    setUrl,
    updateQueryParam,
    deleteQueryParam,
    setQueryParams,
    updateHeader,
    deleteHeader,
    setHeaders,
    setBody,
    loadFromEndpoint,
    reset,
  };

  const value = {
    collections,
    activeEndpointId,
    selectEndpoint,
    addCollection,
    addEndpoint,
    deleteEndpoint,
    renameEndpoint,
    draft,
    draftActions,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
}
