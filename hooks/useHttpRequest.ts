import { useCallback, useEffect } from "react";
import axios, { type AxiosResponse } from "axios";
import { toast, type ExternalToast } from "sonner";
import { type HistoryItem } from "@/app/types/models";

import {
  keyValueArrayToObject,
  stringifyResponseBody,
  getStatusText,
  hasEmptyKeys,
} from "@/lib/utils";

export interface UseHttpRequestParams {
  url: string;
  method: string;
  queryParams: { key: string; value: string }[];
  headers: { key: string; value: string }[];
  requestBody: string;
  setResponse: (res: AxiosResponse | null) => void;
  setResponseBody: (body: string) => void;
  addFromResponse: (params: HistoryItem) => void;
  TOAST_PROPS: ExternalToast;
  updateEndTime: (response: AxiosResponse) => AxiosResponse;
}

// type guard for AxiosError with response
function isAxiosErrorWithResponse(
  error: unknown,
): error is { response: AxiosResponse } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object"
  );
}

// type guard for Error with message
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  );
}

export function useHttpRequest({
  url,
  method,
  queryParams,
  headers,
  requestBody,
  setResponse,
  setResponseBody,
  addFromResponse,
  TOAST_PROPS,
  updateEndTime,
}: UseHttpRequestParams) {
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((request) => {
      request.customData = request.customData || {};
      request.customData.startTime = new Date().getTime();
      return request;
    });

    const responseInterceptor = axios.interceptors.response.use(
      updateEndTime,
      (e) => {
        if (e && e.response) {
          return Promise.reject(updateEndTime(e.response));
        }
        return Promise.reject(e);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [updateEndTime]);

  const sendRequest = useCallback(async () => {
    setResponse(null);
    setResponseBody("");

    if (!url) {
      toast.warning("Please enter a URL.", {
        ...TOAST_PROPS,
      });
      return;
    }

    if (hasEmptyKeys(headers) && hasEmptyKeys(queryParams)) {
      toast.warning("Query parameters and headers must have non-empty keys.", {
        ...TOAST_PROPS,
      });
      return;
    } else if (hasEmptyKeys(headers)) {
      toast.warning("Headers must have non-empty keys.", {
        ...TOAST_PROPS,
      });
      return;
    } else if (hasEmptyKeys(queryParams)) {
      toast.warning("Query parameters must have non-empty keys.", {
        ...TOAST_PROPS,
      });
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!/^https?:$/.test(parsedUrl.protocol)) {
        throw new Error("Only HTTP and HTTPS protocols are supported.");
      }
    } catch {
      toast.error("Please enter a valid URL.", {
        ...TOAST_PROPS,
      });
      return;
    }

    let parsedBody: unknown = undefined;
    if (requestBody) {
      try {
        parsedBody = JSON.parse(requestBody);
      } catch {
        toast.error("Request body must be valid JSON.", {
          ...TOAST_PROPS,
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
          setResponseBody(stringifyResponseBody(response.data));
          setResponse(response);
          addFromResponse({
            method,
            url,
            status: response.status,
            statusText: getStatusText(response),
            time: response.customData?.time || 0,
          });
          return response;
        } else {
          // 4xx/5xx: treat as error, but still show response tab
          const bodyString = stringifyResponseBody(response.data);
          setResponseBody(bodyString);
          setResponse(response);
          addFromResponse({
            method,
            url,
            status: response.status,
            statusText: getStatusText(response),
            time: response.customData?.time || 0,
          });

          // throw to trigger error toast, pass response for error message
          const error = new Error(
            `HTTP Error: ${response.status} ${getStatusText(response)}`,
          ) as Error & {
            response?: AxiosResponse;
            status?: number;
            statusText?: string;
          };

          error.response = response;
          error.status = response.status;
          error.statusText = getStatusText(response);

          throw error;
        }
      }),
      {
        loading: "Sending...",
        success: () => {
          return "Success!";
        },
        error: (error: unknown) => {
          if (isAxiosErrorWithResponse(error)) {
            return `HTTP Error: ${error.response.status} ${getStatusText(error.response)}`;
          }
          if (isErrorWithMessage(error)) {
            return `Error: ${error.message}`;
          }
          return "Network or unknown error occurred.";
        },
        ...TOAST_PROPS,
      },
    );
  }, [
    url,
    method,
    queryParams,
    headers,
    requestBody,
    setResponse,
    setResponseBody,
    addFromResponse,
    TOAST_PROPS,
  ]);

  return { sendRequest };
}
