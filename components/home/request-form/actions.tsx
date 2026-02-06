import { InputGroupButton } from "@/components/ui/input-group";
import { History, Send } from "lucide-react";

export interface ActionsProps {
  isHistoryOpen: boolean;
  onToggleHistory: (isOpen: boolean) => void;
  onSend: () => void;
}

export const Actions = ({
  isHistoryOpen,
  onToggleHistory,
  onSend,
}: ActionsProps) => {
  return (
    <>
      <InputGroupButton
        className="bg-transparent"
        variant="secondary"
        onClick={() => onToggleHistory(!isHistoryOpen)}
        aria-haspopup="menu"
        aria-expanded={isHistoryOpen}
        aria-controls="request-history-menu"
      >
        <History />
        <span className="sr-only">Request History</span>
      </InputGroupButton>
      <InputGroupButton variant="outline" onClick={onSend}>
        <Send fill="#5e17eb" className="text-primary" />
      </InputGroupButton>
    </>
  );
};
