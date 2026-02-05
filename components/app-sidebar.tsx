"use client";

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
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { type CollectionEndpoint } from "@/app/types/models";
import { Button } from "@/components/ui/button";
import { ChevronRight, Folder, Plus, Ellipsis } from "lucide-react";

type Collection = {
  name: string;
  endpoints: CollectionEndpoint[];
};

const data: Collection[] = [
  {
    name: "Drafts",
    endpoints: [
      {
        id: "1",
        name: "My First Request",
        method: "GET",
        url: "/first-request",
      },
    ],
  },
  {
    name: "FindEats",
    endpoints: [
      { id: "2", name: "Restaurants", method: "GET", url: "/restaurants" },
      { id: "3", name: "Onboard", method: "POST", url: "/onboard" },
    ],
  },
];

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((group) => (
                <SidebarMenuItem key={group.name}>
                  <Collapsible
                    className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                    defaultOpen={group.name === "Drafts"}
                  >
                    <div className="group/menu-row hover:bg-sidebar-accent relative flex w-full flex-row items-center justify-start rounded px-1">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex-1 rounded-xs">
                          <span className="flex items-center justify-center">
                            <Folder className="text-muted-foreground size-4 group-hover/menu-row:hidden" />
                            <ChevronRight className="text-muted-foreground hidden size-4 transition-transform group-hover/menu-row:block group-data-[state=open]/collapsible:rotate-90" />
                          </span>
                          <div className="flex flex-1 flex-row justify-between font-medium">
                            <span className="line-clamp-1 w-full text-left break-all">
                              {group.name}
                            </span>
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <div className="relative flex">
                        <div className="hidden items-center opacity-0 group-hover/menu-row:flex group-hover/menu-row:opacity-100 group-focus-visible:opacity-100">
                          <Button
                            type="button"
                            size="xs"
                            variant="ghost"
                            className="text-muted-foreground"
                            onClick={() => console.log("Show dropdown")}
                          >
                            <Ellipsis />
                          </Button>
                          <Button
                            type="button"
                            size="xs"
                            variant="ghost"
                            className="text-muted-foreground"
                            onClick={() => console.log("Add a request")}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.endpoints.map((item) => {
                          const itemColorVar = `--http-method-${item.method.toLowerCase()}`;
                          return (
                            <SidebarMenuButton
                              key={item.id}
                              className="flex flex-row items-center justify-between rounded-xs data-[active=true]:bg-transparent"
                            >
                              <span>{item.name}</span>
                              <span
                                className="font-mono text-xs font-semibold"
                                style={{ color: `var(${itemColorVar})` }}
                              >
                                {item.method}
                              </span>
                            </SidebarMenuButton>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
