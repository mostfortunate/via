"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";

import { type HTTPMethod } from "@/app/types/http";
import { type HistoryItem } from "@/app/types/models";

import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { MethodSelector } from "@/components/home/request-form/method-selector";
import { Actions } from "@/components/home/request-form/actions";
import { HistoryList } from "@/components/home/request-form/history-list";
import { AddressBar } from "@/components/home/request-form/address-bar";

interface RequestFormProps {
  url: string;
  method: HTTPMethod;
  requestHistory: HistoryItem[];
  setMethod: (method: HTTPMethod) => void;
  setUrl: (url: string) => void;
  onSend: () => void;
}

const RequestForm = ({
  url,
  method,
  requestHistory,
  setMethod,
  setUrl,
  onSend,
}: RequestFormProps) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const containerRef = useClickOutside(
    () => setIsHistoryOpen(false),
    isHistoryOpen,
  );

  const handleHistoryItemClick = (historyItem: HistoryItem) => {
    setUrl(historyItem.url);
    setMethod(historyItem.method);
    setIsHistoryOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <InputGroup
        className={cn(
          isHistoryOpen && "rounded-b-none",
          "has-[[data-slot=input-group-control]:focus-visible]:ring-0",
        )}
      >
        <InputGroupAddon align="inline-start">
          <MethodSelector method={method} setMethod={setMethod} />
        </InputGroupAddon>
        <AddressBar url={url} onUrlChange={setUrl} />
        <InputGroupAddon className="gap-2" align="inline-end">
          <Actions
            isHistoryOpen={isHistoryOpen}
            onToggleHistory={setIsHistoryOpen}
            onSend={onSend}
          />
        </InputGroupAddon>
      </InputGroup>
      <div
        id="request-history-menu"
        role="menu"
        aria-label="Request History"
        className={cn(
          "bg-background absolute right-0 left-0 z-50 overflow-hidden rounded-b-md border border-t-0 shadow-lg transition-all duration-100 ease-in-out",
          isHistoryOpen
            ? "max-h-125 opacity-100"
            : "max-h-0 border-0 opacity-0",
        )}
      >
        <div>
          <HistoryList
            requestHistory={requestHistory}
            handleHistoryItemClick={handleHistoryItemClick}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
