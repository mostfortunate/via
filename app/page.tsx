"use client";

import { useState, useCallback } from "react";
import { useHttpRequest } from "@/hooks/useHttpRequest";
import { type AxiosResponse } from "axios";

import { updateAt, deleteAt, getStatusText } from "@/lib/utils";
import { type HTTPMethod } from "@/app/types/http";

import { type ExternalToast } from "sonner";
import RequestForm from "@/components/request-form";
import RequestTabs from "@/components/request-tabs";
import ResponseTabs from "@/components/response-tabs";

type QueryParam = {
  key: string;
  value: string;
};

type Header = {
  key: string;
  value: string;
};

const methods: HTTPMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const TOAST_PROPS: ExternalToast = {
  position: "top-center",
  duration: 2500,
  closeButton: true,
};

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
    setQueryParams((prev) => updateAt(prev, index, updates));
  };

  const deleteQueryParam = (index: number) => {
    setQueryParams((prev) => deleteAt(prev, index));
  };

  const updateHeader = (index: number, updates: Partial<Header>) => {
    setHeaders((prev) => updateAt(prev, index, updates));
  };

  const deleteHeader = (index: number) => {
    setHeaders((prev) => deleteAt(prev, index));
  };

  const onRequestBodyChange = useCallback((body: string) => {
    setRequestBody(body);
  }, []);

  const { sendRequest } = useHttpRequest({
    url,
    method,
    queryParams,
    headers,
    requestBody,
    setResponse,
    setResponseBody,
    TOAST_PROPS,
    updateEndTime,
  });

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <RequestForm
          url={url}
          setUrl={setUrl}
          method={method}
          setMethod={setMethod}
          methods={methods}
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
          <ResponseTabs
            response={response}
            responseBody={responseBody}
            getStatusText={getStatusText}
          />
        )}
      </div>
    </>
  );
}
