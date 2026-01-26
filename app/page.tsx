"use client";

import { useState } from "react";
import axios from "axios";

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
  const [headers, setHeaders] = useState<Header[]>([]);
  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  const tabs = ["Query Params", "Headers", "JSON"];

  // MARK: Helpers
  function updateAt<T>(arr: T[], index: number, updates: Partial<T>): T[] {
    return arr.map((item, i) => (i === index ? { ...item, ...updates } : item));
  }

  function deleteAt<T>(arr: T[], index: number): T[] {
    return arr.filter((_, i) => i !== index);
  }

  function keyValueArrayToObject(arr: { key: string; value: string }[]): Record<string, string> {
    const obj: Record<string, string> = {};
    arr.forEach(({ key, value }) => {
      if (key) {
        obj[key] = value;
      }
    });
    return obj;
  };

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

  const sendRequest = () => {
    axios({
      url: url,
      method: method.toLowerCase(),
      params: keyValueArrayToObject(queryParams),
      headers: keyValueArrayToObject(headers),
    }).then((response) => {
      console.log(response);
    });
  };

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
        <Tabs defaultValue={tabs[0]} className="w-full">
          <TabsList variant="line" className="mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="Query Params">
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
        </Tabs>
      </div>
    </>
  );
}
