"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useHttpRequest } from "@/hooks/use-http-request";
import { useRequestHistory } from "@/hooks/use-request-history";
import {
  getStatusText,
  deleteKeyValueRow,
  updateKeyValueRows,
} from "@/lib/utils";

import { MOCK_HISTORY } from "@/mocks/request-history";

import { type AxiosResponse } from "axios";
import { type HTTPMethod } from "@/app/types/http";
import { type QueryParam, type Header } from "@/app/types/models";

import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import RequestForm from "@/components/home/request-form";
import RequestTabs from "@/components/home/request-tabs";
import ResponseTabs from "@/components/home/response-tabs";

const USE_MOCK_DATA = false;

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<HTTPMethod>("GET");
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [requestBody, setRequestBody] = useState<string>("");
  const [responseBody, setResponseBody] = useState<string>("");
  const [headers, setHeaders] = useState<Header[]>([]);
  const [response, setResponse] = useState<AxiosResponse | null>(null);

  function updateEndTime(response: AxiosResponse): AxiosResponse {
    response.customData = response.customData || {};
    response.customData.time =
      new Date().getTime() - response.config.customData.startTime;
    return response;
  }

  // MARK: Handlers
  const updateQueryParam = (index: number, updates: Partial<QueryParam>) => {
    setQueryParams((prev) => updateKeyValueRows(prev, index, updates));
  };

  const deleteQueryParam = (index: number) => {
    setQueryParams((prev) => deleteKeyValueRow(prev, index));
  };

  const updateHeader = (index: number, updates: Partial<Header>) => {
    setHeaders((prev) => updateKeyValueRows(prev, index, updates));
  };

  const deleteHeader = (index: number) => {
    setHeaders((prev) => deleteKeyValueRow(prev, index));
  };

  const onRequestBodyChange = useCallback((body: string) => {
    setRequestBody(body);
  }, []);

  const { history: requestHistory, addFromResponse } = useRequestHistory(
    USE_MOCK_DATA ? MOCK_HISTORY : [],
  );

  const { sendRequest } = useHttpRequest({
    url,
    method,
    queryParams,
    headers,
    requestBody,
    setResponse,
    setResponseBody,
    addFromResponse,
    updateEndTime,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        sendRequest();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sendRequest]);

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <RequestForm
          url={url}
          method={method}
          requestHistory={requestHistory}
          setMethod={setMethod}
          setUrl={setUrl}
          onSend={sendRequest}
        />
        <RequestTabs
          method={method}
          queryParams={queryParams}
          updateQueryParam={updateQueryParam}
          deleteQueryParam={deleteQueryParam}
          setQueryParams={setQueryParams}
          headers={headers}
          updateHeader={updateHeader}
          deleteHeader={deleteHeader}
          setHeaders={setHeaders}
          requestBody={requestBody}
          onRequestBodyChange={onRequestBodyChange}
        />
        {response && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResponseTabs
              response={response}
              responseBody={responseBody}
              getStatusText={getStatusText}
            />
          </motion.div>
        )}
        <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <KbdGroup>
                <Kbd>Ctrl or ⌘</Kbd>
                <span>+</span>
                <Kbd>B</Kbd>
              </KbdGroup>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle sidebar</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <KbdGroup>
                <Kbd>Ctrl or ⌘</Kbd>
                <span>+</span>
                <Kbd>↵</Kbd>
              </KbdGroup>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send request</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
