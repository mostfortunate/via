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

const TOAST_PROPS: ExternalToast = {
  position: "bottom-right",
  duration: 2500,
  closeButton: true,
};

// type guard for AxiosError with response
export function isAxiosErrorWithResponse(
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
export function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  );
}

export type ValidationResult<T = undefined> =
  | { ok: true; value?: T }
  | { ok: false; error: string };

export function validateUrl(url: string): ValidationResult<URL> {
  if (!url) {
    return { ok: false, error: "Please enter a URL." };
  }

  try {
    const parsedUrl = new URL(url);
    if (!/^https?:$/.test(parsedUrl.protocol)) {
      return {
        ok: false,
        error: "Only HTTP and HTTPS protocols are supported.",
      };
    }
    return { ok: true, value: parsedUrl };
  } catch {
    return { ok: false, error: "Please enter a valid URL." };
  }
}

export function validateKeyValueInputs(
  headers: { key: string; value: string }[],
  queryParams: { key: string; value: string }[],
): ValidationResult {
  if (hasEmptyKeys(headers) && hasEmptyKeys(queryParams)) {
    return {
      ok: false,
      error: "Query parameters and headers must have non-empty keys.",
    };
  }

  if (hasEmptyKeys(headers)) {
    return { ok: false, error: "Headers must have non-empty keys." };
  }

  if (hasEmptyKeys(queryParams)) {
    return {
      ok: false,
      error: "Query parameters must have non-empty keys.",
    };
  }

  return { ok: true };
}

export function parseJsonBody(requestBody: string): ValidationResult<unknown> {
  if (!requestBody) {
    return { ok: true, value: undefined };
  }

  try {
    return { ok: true, value: JSON.parse(requestBody) };
  } catch {
    return { ok: false, error: "Request body must be valid JSON." };
  }
}

export function buildAxiosConfig(params: {
  url: string;
  method: string;
  queryParams: { key: string; value: string }[];
  headers: { key: string; value: string }[];
  data: unknown;
}) {
  return {
    url: params.url,
    method: params.method.toLowerCase(),
    params: keyValueArrayToObject(params.queryParams),
    headers: keyValueArrayToObject(params.headers),
    data: params.data,
    validateStatus: () => true,
  };
}

export function isSuccessStatus(status: number) {
  return status >= 200 && status < 300;
}

export function buildHistoryItem(params: {
  method: string;
  url: string;
  response: AxiosResponse;
}): HistoryItem {
  return {
    method: params.method,
    url: params.url,
    status: params.response.status,
    statusText: getStatusText(params.response),
    time: params.response.customData?.time || 0,
  };
}

export function formatErrorMessage(error: unknown) {
  if (isAxiosErrorWithResponse(error)) {
    return `HTTP Error: ${error.response.status} ${getStatusText(error.response)}`;
  }
  if (isErrorWithMessage(error)) {
    return `Error: ${error.message}`;
  }
  return "Network or unknown error occurred.";
}

export function registerAxiosInterceptors(
  updateEndTime: (response: AxiosResponse) => AxiosResponse,
) {
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
}

export function showWarning(message: string, toastProps: ExternalToast) {
  toast.warning(message, { ...toastProps });
}

export function showError(message: string, toastProps: ExternalToast) {
  toast.error(message, { ...toastProps });
}

export interface UseHttpRequestParams {
  url: string;
  method: string;
  queryParams: { key: string; value: string }[];
  headers: { key: string; value: string }[];
  requestBody: string;
  setResponse: (res: AxiosResponse | null) => void;
  setResponseBody: (body: string) => void;
  addFromResponse: (params: HistoryItem) => void;
  updateEndTime: (response: AxiosResponse) => AxiosResponse;
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
  updateEndTime,
}: UseHttpRequestParams) {
  useEffect(() => {
    return registerAxiosInterceptors(updateEndTime);
  }, [updateEndTime]);

  const sendRequest = useCallback(async () => {
    setResponse(null);
    setResponseBody("");

    const urlValidation = validateUrl(url);
    if (!urlValidation.ok) {
      showWarning(urlValidation.error, TOAST_PROPS);
      return;
    }

    const inputValidation = validateKeyValueInputs(headers, queryParams);
    if (!inputValidation.ok) {
      showWarning(inputValidation.error, TOAST_PROPS);
      return;
    }

    const bodyValidation = parseJsonBody(requestBody);
    if (!bodyValidation.ok) {
      showError(bodyValidation.error, TOAST_PROPS);
      return;
    }

    const axiosPromise = axios(
      buildAxiosConfig({
        url,
        method,
        queryParams,
        headers,
        data: bodyValidation.value,
      }),
    );

    toast.promise(
      axiosPromise.then((response: AxiosResponse) => {
        const bodyString = stringifyResponseBody(response.data);
        setResponseBody(bodyString);
        setResponse(response);
        addFromResponse(buildHistoryItem({ method, url, response }));

        if (isSuccessStatus(response.status)) {
          return response;
        }

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
      }),
      {
        loading: "Sending...",
        success: () => {
          return "Success!";
        },
        error: formatErrorMessage,
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
  ]);

  return { sendRequest };
}
