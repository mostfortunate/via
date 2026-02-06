import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import JSONEditor from "@/components/json-editor";
import { ClipboardPaste, Trash2 } from "lucide-react";

export interface BodyTabProps {
  requestBody: string;
  onRequestBodyChange: (body: string) => void;
}

export const BodyTab = ({ requestBody, onRequestBodyChange }: BodyTabProps) => (
  <TabsContent value="JSON">
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-3">
          <CardTitle>Request Body</CardTitle>
          <CardDescription>
            <p>Edit the JSON request body.</p>
          </CardDescription>
        </div>
        <div className="flex flex-row gap-2">
          <CardAction>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon-xs"
                  aria-label="Paste request body"
                  onClick={() => {
                    navigator.clipboard.readText().then((text) => {
                      onRequestBodyChange(text);
                    });
                  }}
                >
                  <ClipboardPaste />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Paste</p>
              </TooltipContent>
            </Tooltip>
          </CardAction>
          <CardAction>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon-xs"
                  aria-label="Remove request body"
                  onClick={() => onRequestBodyChange("")}
                >
                  <Trash2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear</p>
              </TooltipContent>
            </Tooltip>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <JSONEditor value={requestBody} onChange={onRequestBodyChange} />
      </CardContent>
    </Card>
  </TabsContent>
);
