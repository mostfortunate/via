import { useCallback, useEffect } from "react";
import axios, { type AxiosResponse } from "axios";
import { toast, type ExternalToast } from "sonner";

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
  TOAST_PROPS: ExternalToast;
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
    } catch (e: any) {
      toast.error("Please enter a valid URL.", {
        ...TOAST_PROPS,
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
          return response;
        } else {
          // 4xx/5xx: treat as error, but still show response tab
          const bodyString = stringifyResponseBody(response.data);
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
        success: (_: AxiosResponse) => {
          return "Success!";
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
    TOAST_PROPS,
  ]);

  return { sendRequest };
}
