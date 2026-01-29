"use client";

import { useState, useCallback, useEffect } from "react";
import { status, type HttpStatus } from "http-status";
import axios, { type AxiosResponse } from "axios";

import { type HTTPMethod } from "@/app/types/http";

import { toast, type ExternalToast } from "sonner";
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

export type NumericKeys<T> = Extract<keyof T, number>;
export type HttpStatusCode = NumericKeys<HttpStatus>;

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<HTTPMethod>("GET");
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [requestBody, setRequestBody] = useState<string>("");
  const [responseBody, setResponseBody] = useState<string>("");
  const [headers, setHeaders] = useState<Header[]>([]);
  const [response, setResponse] = useState<AxiosResponse | null>(null);
  const methods: HTTPMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];

  // MARK: Helpers
  function updateAt<T>(arr: T[], index: number, updates: Partial<T>): T[] {
    return arr.map((item, i) => (i === index ? { ...item, ...updates } : item));
  }

  function deleteAt<T>(arr: T[], index: number): T[] {
    return arr.filter((_, i) => i !== index);
  }

  function keyValueArrayToObject(
    arr: { key: string; value: string }[],
  ): Record<string, string> {
    const obj: Record<string, string> = {};
    arr.forEach(({ key, value }) => {
      if (key) {
        obj[key] = value;
      }
    });
    return obj;
  }

  function updateEndTime(response: AxiosResponse): AxiosResponse {
    response.customData = response.customData || {};
    response.customData.time =
      new Date().getTime() - response.config.customData.startTime;
    return response;
  }

  function isHttpStatusCode(code: number): code is HttpStatusCode {
    return code in status;
  }

  function getStatusText(res: AxiosResponse): string {
    if (res.statusText) return res.statusText;

    if (isHttpStatusCode(res.status)) {
      return status[res.status];
    }

    return "";
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

  const sendRequest = async () => {
    const TOAST_PROPS: ExternalToast = {
      position: "top-center",
      duration: 1200,
      closeButton: true,
    };

    setResponse(null);
    setResponseBody("");

    if (!url) {
      toast.warning("Please enter a URL.", {
        ...TOAST_PROPS,
        duration: Infinity,
      });
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!/^https?:$/.test(parsedUrl.protocol)) {
        throw new Error("Only HTTP and HTTPS protocols are supported.");
      }
    } catch (e: any) {
      toast.error("Please enter a valid URL.", {
        ...TOAST_PROPS,
        duration: Infinity,
      });
      return;
    }

    let parsedBody: any = undefined;
    if (requestBody) {
      try {
        parsedBody = JSON.parse(requestBody);
      } catch (e: any) {
        toast.error("Request body must be valid JSON.", {
          ...TOAST_PROPS,
          duration: Infinity,
        });
        return;
      }
    }

    const axiosPromise = axios({
      url: url,
      method: method.toLowerCase(),
      params: keyValueArrayToObject(queryParams),
      headers: keyValueArrayToObject(headers),
      data: parsedBody,
      validateStatus: () => true, // always resolve, so we can handle 4xx/5xx in .then
    });

    toast.promise(
      axiosPromise.then((response: AxiosResponse) => {
        // 2xx: treat as success
        if (response.status >= 200 && response.status < 300) {
          setResponseBody(JSON.stringify(response.data, null, 2));
          setResponse(response);
          return response;
        } else {
          // 4xx/5xx: treat as error, but still show response tab

          let bodyString = "";
          if (response.data === undefined || response.data === null) {
            bodyString = "";
          } else if (typeof response.data === "string") {
            bodyString = response.data;
          } else {
            bodyString = JSON.stringify(response.data, null, 2);
          }

          setResponseBody(bodyString);
          setResponse(response);

          // throw to trigger error toast, pass response for error message
          const error: any = new Error(
            `HTTP Error: ${response.status} ${getStatusText(response)}`,
          );
          error.response = response;
          throw error;
        }
      }),
      {
        loading: "Sending...",
        success: (response: AxiosResponse) => {
          return `Success: ${response.status} ${getStatusText(response)}`;
        },
        error: (error: any) => {
          if (error?.response) {
            return `HTTP Error: ${error.response.status} ${getStatusText(error.response)}`;
          }
          return error?.message
            ? `Error: ${error.message}`
            : "Network or unknown error occurred.";
        },
        ...TOAST_PROPS,
        duration: Infinity,
      },
    );
  };

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((request) => {
      request.customData = request.customData || {};
      request.customData.startTime = new Date().getTime();
      return request;
    });

    const responseInterceptor = axios.interceptors.response.use(
      updateEndTime,
      (e) => {
        return Promise.reject(updateEndTime(e.response));
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

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
