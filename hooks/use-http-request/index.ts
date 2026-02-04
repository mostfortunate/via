import { useCallback, useEffect } from "react";
import { stringifyResponseBody, getStatusText } from "@/lib/utils";

import axios, { type AxiosResponse } from "axios";
import { toast, type ExternalToast } from "sonner";
import { type HistoryItem } from "@/app/types/models";

import {
  buildAxiosConfig,
  buildHistoryItem,
  formatErrorMessage,
  isSuccessStatus,
  parseJsonBody,
  validateKeyValueInputs,
  validateUrl,
  registerAxiosInterceptors,
  showWarning,
  showError,
} from "@/hooks/use-http-request/helpers";

const TOAST_PROPS: ExternalToast = {
  position: "bottom-right",
  duration: 2500,
  closeButton: true,
};

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
