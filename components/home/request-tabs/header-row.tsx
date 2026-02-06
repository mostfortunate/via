import { type Header } from "@/app/types/models";

import { Input } from "@/components/ui/input";
import { DeleteButton } from "@/components/home/request-tabs/delete-button";

export interface HeaderRowProps {
  header: Header;
  count: number;
  onKeyChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onDelete: () => void;
}

export const HeaderRow = ({
  header,
  count,
  onKeyChange,
  onValueChange,
  onDelete,
}: HeaderRowProps) => (
  <div className="flex flex-row items-center gap-2">
    <div className="text-muted-foreground font-mono font-medium text-xs">{count}.</div>
    <Input
      placeholder="Key"
      value={header.key}
      onChange={(e) => onKeyChange(e.target.value)}
    />
    <Input
      placeholder="Value"
      value={header.value}
      onChange={(e) => onValueChange(e.target.value)}
    />
    <DeleteButton onClick={onDelete} />
  </div>
);
