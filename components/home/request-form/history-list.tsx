import { type HistoryItem } from "@/app/types/models";
import { RequestHistoryRow } from "@/components/home/request-form/history-row";

export interface HistoryListProps {
  requestHistory: HistoryItem[];
  handleHistoryItemClick: (historyItem: HistoryItem) => void;
}

export const HistoryList = ({
  requestHistory,
  handleHistoryItemClick,
}: HistoryListProps) => {
  const isEmpty = requestHistory.length === 0;

  return (
    <div className="max-h-125 overflow-y-auto py-1">
      {isEmpty ? (
        <div className="text-muted-foreground py-1.5 text-center text-sm italic">
          Your last few requests will appear here.
        </div>
      ) : (
        requestHistory.map((item, index) => (
          <button
            key={index}
            role="menuitem"
            onClick={() => handleHistoryItemClick(item)}
            className="hover:bg-accent flex w-full items-center justify-between rounded-sm px-3 py-1.5"
          >
            <RequestHistoryRow item={item} />
          </button>
        ))
      )}
    </div>
  );
};
