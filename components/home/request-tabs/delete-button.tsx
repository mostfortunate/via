import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export interface DeleteButtonProps {
  onClick: () => void;
}

export const DeleteButton = ({ onClick }: DeleteButtonProps) => (
  <Button variant="destructive" size="icon" onClick={onClick}>
    <Trash />
  </Button>
);
