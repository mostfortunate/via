import { getStatusColorClass } from "@/lib/utils";
import { type HistoryItem } from "@/app/types/models";

export interface RequestHistoryRowProps {
  item: HistoryItem;
}

export const RequestHistoryRow = ({ item }: RequestHistoryRowProps) => {
  const methodColorVar = `--http-method-${item.method.toLowerCase()}`;
  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-1 items-center gap-6 font-mono">
        <span
          className="flex justify-start font-mono text-xs font-semibold"
          style={{ color: `var(${methodColorVar})` }}
        >
          {item.method}
        </span>
        <span className="text-left text-xs">{item.url}</span>
      </div>
      <div className="flex items-center gap-4 font-mono font-medium">
        <span className="text-muted-foreground text-left text-xs">
          {item.time} ms
        </span>
        <span
          className={`flex w-8 justify-center text-xs ${getStatusColorClass(item.status)}`}
        >
          {item.status}
        </span>
        <span className="text-muted-foreground text-left text-xs truncate">
          {item.statusText}
        </span>
      </div>
    </div>
  );
};
