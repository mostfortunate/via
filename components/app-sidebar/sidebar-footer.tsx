"use client";

import { Button } from "@/components/ui/button";
import { SidebarFooter } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Plus, Import, Upload } from "lucide-react";

type SidebarFooterProps = {
  onAddCollection: () => void;
};

export default function AppSidebarFooter({
  onAddCollection,
}: SidebarFooterProps) {
  return (
    <SidebarFooter className="mb-2 flex w-full flex-col gap-2">
      <div className="flex flex-row justify-between gap-2">
        <Button variant="outline" className="flex-1" onClick={onAddCollection}>
          <Plus className="size-4" />
          Add Collection
        </Button>
        <ModeToggle />
      </div>
      <div className="flex flex-row justify-between gap-2">
        <Button variant="outline" className="flex-1">
          <Import className="size-4" /> Import
        </Button>
        <Button variant="outline" className="flex-1">
          <Upload className="size-4" />
          Export
        </Button>
      </div>
    </SidebarFooter>
  );
}
