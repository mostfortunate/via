"use client";

import { useState, useCallback } from "react";
import { status } from "http-status";
import { json } from "@codemirror/lang-json";
import { useTheme } from "next-themes";
import axios, { type AxiosResponse } from "axios";
import prettyBytes from "pretty-bytes";

import { EditorView } from "@uiw/react-codemirror";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type QueryParam = {
  key: string;
  value: string;
};

type Header = {
  key: string;
  value: string;
};

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<string>("GET");
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [requestBody, setRequestBody] = useState<string>("");
  const [responseBody, setResponseBody] = useState<string>("");
  const [headers, setHeaders] = useState<Header[]>([]);
  const [response, setResponse] = useState<AxiosResponse | null>(null);
  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  const requestTabs = ["Params", "Headers", "JSON"];
  const responseTabs = ["Body", "Headers"];

  const { resolvedTheme } = useTheme();
  const noFocusOutlineRule = EditorView.theme({
    "&.cm-focused": {
      outline: "none",
    },
  });

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

  const sendRequest = () => {
    // TODO: add proper validation and error handling and make it async
    if (!url) return;
    axios({
      url: url,
      method: method.toLowerCase(),
      params: keyValueArrayToObject(queryParams),
      headers: keyValueArrayToObject(headers),
    }).then((response: AxiosResponse) => {
      console.log(response);
      setResponse(response);
    });
  };

  axios.interceptors.request.use((request) => {
    request.customData = request.customData || {};
    request.customData.startTime = new Date().getTime();
    return request;
  });

  axios.interceptors.response.use(updateEndTime, (e) => {
    return Promise.reject(updateEndTime(e.response));
  });

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-row gap-4">
          <Select>
            <SelectTrigger className="font-semibold w-full max-w-48">
              <SelectValue placeholder={method} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {methods.map((m) => (
                  <SelectItem key={m} value={m} onSelect={() => setMethod(m)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button className="font-semibold" type="submit" onClick={sendRequest}>
            Send
          </Button>
        </div>
        <Tabs defaultValue={requestTabs[0]} className="w-full">
          <TabsList variant="line" className="mb-4">
            {requestTabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="Params">
            <Card>
              <CardHeader>
                <CardTitle>Query Parameters</CardTitle>
                <CardDescription>
                  Add, edit, or remove query parameters for your request.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {queryParams.map((param, index) => (
                  <div key={index} className="flex flex-row items-center gap-2">
                    <Input
                      placeholder="Key"
                      value={param.key}
                      onChange={(e) =>
                        updateQueryParam(index, { key: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={param.value}
                      onChange={(e) =>
                        updateQueryParam(index, { value: e.target.value })
                      }
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteQueryParam(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <CardAction className="w-full">
                  <Button
                    size="sm"
                    onClick={() =>
                      setQueryParams([...queryParams, { key: "", value: "" }])
                    }
                  >
                    Add
                  </Button>
                </CardAction>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="Headers">
            <Card>
              <CardHeader>
                <CardTitle>Headers</CardTitle>
                <CardDescription>
                  Add, edit, or remove headers for your request.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex flex-row items-center gap-2">
                    <Input
                      placeholder="Key"
                      value={header.key}
                      onChange={(e) =>
                        updateHeader(index, { key: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) =>
                        updateHeader(index, { value: e.target.value })
                      }
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteHeader(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <CardAction className="w-full">
                  <Button
                    size="sm"
                    onClick={() =>
                      setHeaders([...headers, { key: "", value: "" }])
                    }
                  >
                    Add
                  </Button>
                </CardAction>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="JSON">
            <TabsContent value="JSON">
              <Card>
                <CardHeader>
                  <CardTitle>JSON</CardTitle>
                  <CardDescription>
                    Edit JSON data for your request.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <CodeMirror
                    value={requestBody}
                    onChange={onRequestBodyChange}
                    extensions={[json(), noFocusOutlineRule]}
                    theme={resolvedTheme === "dark" ? githubDark : githubLight}
                  />
                </CardContent>
                <CardFooter>
                  <CardAction className="w-full"></CardAction>
                </CardFooter>
              </Card>
            </TabsContent>
          </TabsContent>
        </Tabs>
        {response && (
          <Tabs defaultValue={responseTabs[0]} className="w-full">
            <TabsList variant="line" className="mb-4 w-full flex items-center">
              <div>
                {responseTabs.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    {tab}
                  </TabsTrigger>
                ))}
              </div>
              <div className="flex gap-4 text-xs font-semibold ml-auto">
                <span>
                  {response.status}{" "}
                  {/* definitely need to refactor this, it's confusing, essentially TypeScript is mad that status[response.status] is potentially nil, even though that will not be the case 99.999% of the time - and using the backup "" also doesn't silence it */}
                  {response.statusText === ""
                    ? (status as any)[response.status] || ""
                    : response.statusText}
                </span>
                <span>{response.customData.time} ms</span>
                <span>
                  {prettyBytes(
                    JSON.stringify(response.data).length +
                      JSON.stringify(response.headers).length,
                  )}
                </span>
              </div>
            </TabsList>
            <TabsContent value="Body">
              <Card>
                <CardContent className="flex flex-col gap-2"></CardContent>
                <CardFooter>
                  <CardAction className="w-full"></CardAction>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="Headers">
              <Card>
                <CardContent className="flex flex-col gap-2">
                  {Object.entries(response.headers).map(
                    ([key, value], index) => (
                      <div
                        key={index}
                        className="flex flex-row items-center gap-2"
                      >
                        <Input readOnly value={key} />
                        <Input readOnly value={value} />
                      </div>
                    ),
                  )}
                </CardContent>
                <CardFooter>
                  <CardAction className="w-full"></CardAction>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}
