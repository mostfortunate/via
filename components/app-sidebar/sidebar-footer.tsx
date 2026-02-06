"use client";

import { Button } from "@/components/ui/button";
import { SidebarFooter } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Plus } from "lucide-react";

type SidebarFooterProps = {
  onAddCollection: () => void;
};

export default function AppSidebarFooter({
  onAddCollection,
}: SidebarFooterProps) {
  return (
    <SidebarFooter className="mb-2 flex w-full flex-row gap-2">
      <Button variant="outline" className="flex-1" onClick={onAddCollection}>
        <Plus className="size-4" />
        Add Collection
      </Button>
      <ModeToggle />
    </SidebarFooter>
  );
}
