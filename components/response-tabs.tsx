import { type AxiosResponse } from "axios";
import prettyBytes from "pretty-bytes";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import JSONEditor from "@/components/json-editor";
import { Copy } from "lucide-react";

interface ResponseTabsProps {
  response: AxiosResponse;
  responseBody: string;
  getStatusText: (res: AxiosResponse) => string;
}

const ResponseTabs = ({
  response,
  responseBody,
  getStatusText,
}: ResponseTabsProps) => {
  if (!response) return <></>;

  const responseTabs = ["Body", "Headers"];
  const getStatusColorClass = (code: number) => {
    if (code >= 200 && code < 300) return "text-green-500";
    if (code >= 300 && code < 400) return "text-yellow-500";
    if (code >= 400) return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <Tabs defaultValue={responseTabs[0]} className="w-full">
      <TabsList variant="line" className="mb-4 flex w-full items-center">
        <div>
          {responseTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </div>
        <div className="ml-auto flex gap-4 text-xs font-semibold">
          <span className={`font-bold ${getStatusColorClass(response.status)}`}>
            {response.status} {getStatusText(response)}
          </span>
          <span>{response.customData?.time} ms</span>
          <span>
            {prettyBytes(
              new Blob([
                JSON.stringify(response.data),
                JSON.stringify(response.headers),
              ]).size,
            )}
          </span>
        </div>
      </TabsList>
      <TabsContent value="Body">
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-3">
              <CardTitle>Response Body</CardTitle>
              <CardDescription>
                View the JSON response body from your request.
              </CardDescription>
            </div>
            <CardAction>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon-xs"
                    aria-label="Copy response body"
                  >
                    <Copy />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <JSONEditor value={responseBody} editable={false} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Headers">
        <Card>
          <CardContent className="flex flex-col gap-2">
            {Object.entries(response.headers).map(([key, value], index) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <Input readOnly value={key} />
                <Input readOnly value={value} />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ResponseTabs;
