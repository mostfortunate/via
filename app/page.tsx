"use client";

import { useState } from "react";
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

type RequestInputsProps = {
  url: string;
  setUrl: (url: string) => void;
  method: string;
  methods: string[];
  setMethod: (method: string) => void;
};

const RequestInputs = ({
  method,
  setMethod,
  url,
  setUrl,
  methods,
}: RequestInputsProps) => (
  <>
    <Select>
      <SelectTrigger className="w-full max-w-48">
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
    <Button type="submit" onClick={() => console.log(url)}>
      Send
    </Button>
  </>
);

const QueryParamEntry = () => (
  <>
    <div className="flex flex-row items-center gap-2">
      <Input placeholder="Key" />
      <Input placeholder="Value" />
      <Button variant="destructive" size="sm">
        Remove
      </Button>
    </div>
  </>
);

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<string>("GET");
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  const tabs = ["Query Params", "Headers", "JSON"];

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-row gap-4">
          <RequestInputs
            method={method}
            methods={methods}
            setMethod={setMethod}
            url={url}
            setUrl={setUrl}
          />
        </div>
        <Tabs defaultValue={tabs[0]} className="w-100">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="Query Params">
            <Card className="gap-4">
              <CardContent>
                <QueryParamEntry />
              </CardContent>
              <CardFooter>
                <CardAction className="w-full">
                  <Button variant="outline" size="sm">
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
