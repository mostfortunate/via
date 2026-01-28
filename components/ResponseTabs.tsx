import { type AxiosResponse } from "axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import prettyBytes from "pretty-bytes";

interface ResponseTabsProps {
  response: AxiosResponse;
  responseBody: string;
  getStatusText: (res: AxiosResponse) => string;
  editorSettings: any;
}

const responseTabs = ["Body", "Headers"];

const ResponseTabs = ({
  response,
  responseBody,
  getStatusText,
  editorSettings,
}: ResponseTabsProps) => {
  if (!response) return <></>;
  return (
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
            {response.status} {getStatusText(response)}
          </span>
          <span>{response.customData?.time} ms</span>
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
                    className="hover:bg-muted/90 hover:text-secondary transition-colors"
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
            <CodeMirror
              value={responseBody}
              editable={false}
              {...editorSettings}
            />
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
