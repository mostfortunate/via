"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";

import { type HTTPMethod } from "@/app/types/http";
import { type HistoryItem } from "@/app/types/models";

import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { MethodSelector } from "@/components/home/request-form/method-selector";
import { Actions } from "@/components/home/request-form/actions";
import { RequestHistoryRow } from "@/components/home/request-form/history-row";
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
      <InputGroup className={cn(isHistoryOpen && "rounded-b-none")}>
        <AddressBar
          url={url}
          onUrlChange={setUrl}
        />
        <InputGroupAddon align="inline-start">
          <MethodSelector method={method} setMethod={setMethod} />
        </InputGroupAddon>
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
          <div className="max-h-125 overflow-y-auto py-1">
            {requestHistory.map((item, index) => (
              <button
                key={index}
                role="menuitem"
                onClick={() => handleHistoryItemClick(item)}
                className="hover:bg-accent flex w-full items-center justify-between rounded-sm px-3 py-1.5"
              >
                <RequestHistoryRow item={item} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
