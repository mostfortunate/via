import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

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

import JSONEditor from "@/components/json-editor";
import { Copy } from "lucide-react";

export interface BodyTabProps {
  responseBody: string;
}

export const BodyTab = ({ responseBody }: BodyTabProps) => (
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
);
