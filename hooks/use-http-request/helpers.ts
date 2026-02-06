import axios, { type AxiosResponse } from "axios";
import { type ExternalToast, toast } from "sonner";
import { type HistoryItem } from "@/app/types/models";

import {
  getStatusText,
  hasEmptyKeys,
  keyValueArrayToHeaderValues,
  keyValueArrayToSearchParams,
} from "@/lib/utils";

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

export type UrlValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function validateUrl(url: string): UrlValidationResult<URL> {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return { ok: false, error: "The address bar is empty." };
  }

  try {
    const hasHttpScheme = /^https?:\/\//i.test(trimmedUrl);
    const hasAnyScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmedUrl);

    // case 1: scheme, other -> deny
    if (hasAnyScheme && !hasHttpScheme) {
      return {
        ok: false,
        error: "Only HTTP and HTTPS protocols are supported.",
      };
    }

    // case 2: scheme, http -> use http || case 3: scheme, https -> use https
    if (hasHttpScheme) {
      return { ok: true, value: new URL(trimmedUrl) };
    }

    const isLocalhost = /^localhost(?::|\/|$)/i.test(trimmedUrl);
    // case 4: no scheme, localhost -> use http | case 5: no scheme, not localhost -> use https
    const normalizedUrl = `${isLocalhost ? "http" : "https"}://${trimmedUrl}`;
    return { ok: true, value: new URL(normalizedUrl) };
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
    return { ok: false, error: "Request body must contain valid JSON." };
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
    params: keyValueArrayToSearchParams(params.queryParams),
    headers: keyValueArrayToHeaderValues(params.headers),
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
