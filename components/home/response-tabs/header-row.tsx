import { Input } from "@/components/ui/input";

export interface HeaderRowProps {
  headerKey: string;
  headerValue: string;
}

export const HeaderRow = ({
  headerKey,
  headerValue,
}: HeaderRowProps) => (
  <div className="flex flex-row items-center gap-2">
    <Input readOnly value={headerKey} />
    <Input readOnly value={headerValue} />
  </div>
);
