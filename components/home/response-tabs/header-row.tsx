import { Input } from "@/components/ui/input";

export interface HeaderRowProps {
  count: number;
  headerKey: string;
  headerValue: string;
}

export const HeaderRow = ({ count, headerKey, headerValue }: HeaderRowProps) => (  
  <>
    <div className="flex flex-row items-center gap-2">
      <div className="text-muted-foreground font-mono text-xs font-medium">
        {count}.
      </div>
      <Input readOnly value={headerKey} />
      <Input readOnly value={headerValue} />
    </div>
  </>
);
