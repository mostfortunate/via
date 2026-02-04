import { type HistoryItem } from "@/app/types/models";

export interface RequestHistoryRowProps {
  item: HistoryItem;
}

export const RequestHistoryRow = ({ item }: RequestHistoryRowProps) => {
  const methodColorVar = `--http-method-${item.method.toLowerCase()}`;
  return (
    <>
      <div className="flex flex-1 items-center gap-3 font-mono">
        <span
          className="flex w-12 justify-start font-mono text-xs font-semibold"
          style={{ color: `var(${methodColorVar})` }}
        >
          {item.method}
        </span>
        <span className="text-left text-xs">{item.url}</span>
      </div>
      <div className="flex items-center gap-4 font-mono font-medium">
        <span className="text-muted-foreground text-left text-xs">
          {item.time}
        </span>
        <span
          className={`flex w-8 justify-center text-xs ${item.status === 200 ? "text-green-500" : "text-orange-500"}`}
        >
          {item.status}
        </span>
        <span className="text-muted-foreground w-32 text-left text-xs">
          {item.statusText}
        </span>
      </div>
    </>
  );
};
