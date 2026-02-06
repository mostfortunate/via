"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RenameDialogKind = "collection" | "endpoint";

type RenameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: RenameDialogKind;
  value: string;
  onValueChange: (value: string) => void;
  onSave: () => void;
};

const copyByKind: Record<
  RenameDialogKind,
  { title: string; placeholder: string }
> = {
  collection: {
    title: "Rename collection",
    placeholder: "Collection name",
  },
  endpoint: {
    title: "Rename endpoint",
    placeholder: "Endpoint name",
  },
};

export default function RenameDialog({
  open,
  onOpenChange,
  kind,
  value,
  onValueChange,
  onSave,
}: RenameDialogProps) {
  const { title, placeholder } = copyByKind[kind];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Input
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder={placeholder}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
