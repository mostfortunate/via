"use client";

import { type Collection } from "@/app/types/models";
import CollectionRow from "@/components/app-sidebar/collection-row";
import EndpointItem from "@/components/app-sidebar/endpoint-item";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

type CollectionListProps = {
  collections: Collection[];
  expandedCollectionIds: Set<string>;
  resolvedActiveEndpointId: string | null;
  onCollectionOpenChange: (collection: Collection, open: boolean) => void;
  onCollectionRename: (collection: Collection) => void;
  onCollectionDelete: (collection: Collection) => void;
  onAddEndpoint: (collection: Collection) => void;
  onEndpointSelect: (collection: Collection, endpointId: string) => void;
  onEndpointRename: (
    collection: Collection,
    endpointId: string,
    endpointName: string,
  ) => void;
  onEndpointDelete: (collection: Collection, endpointId: string) => void;
};

export default function CollectionList({
  collections,
  expandedCollectionIds,
  resolvedActiveEndpointId,
  onCollectionOpenChange,
  onCollectionRename,
  onCollectionDelete,
  onAddEndpoint,
  onEndpointSelect,
  onEndpointRename,
  onEndpointDelete,
}: CollectionListProps) {
  return collections.map((collection) => {
    const isOpen = expandedCollectionIds.has(collection.id);

    return (
      <Collapsible
        key={collection.id}
        open={isOpen}
        onOpenChange={(open) => onCollectionOpenChange(collection, open)}
        className="group/collapsible"
      >
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <CollectionRow
                name={collection.name}
                isOpen={isOpen}
                onRename={() => onCollectionRename(collection)}
                onDelete={() => onCollectionDelete(collection)}
                onAddEndpoint={() => onAddEndpoint(collection)}
              />
              <CollapsibleContent>
                <SidebarMenuSub className="relative mx-0 translate-x-0 border-l-0 px-0">
                  <span className="bg-sidebar-border pointer-events-none absolute top-0 bottom-0 left-4 z-10 w-px" />
                  {collection.endpoints.map((endpoint) => (
                    <EndpointItem
                      key={endpoint.id}
                      endpoint={endpoint}
                      isActive={endpoint.id === resolvedActiveEndpointId}
                      onSelect={() => onEndpointSelect(collection, endpoint.id)}
                      onRename={() =>
                        onEndpointRename(collection, endpoint.id, endpoint.name)
                      }
                      onDelete={() => onEndpointDelete(collection, endpoint.id)}
                    />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Collapsible>
    );
  });
}
