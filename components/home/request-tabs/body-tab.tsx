import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
import { ClipboardPaste, Trash2, AlertTriangleIcon } from "lucide-react";

export interface BodyTabProps {
  ignoreJSON: boolean;
  requestBody: string;
  onRequestBodyChange: (body: string) => void;
}

export const BodyTab = ({
  ignoreJSON,
  requestBody,
  onRequestBodyChange,
}: BodyTabProps) => (
  <TabsContent value="JSON">
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-3">
          <CardTitle>Request Body</CardTitle>
          <CardDescription>
            {ignoreJSON ? (
              <Alert variant="warning">
                <AlertTriangleIcon />
                <AlertTitle className="font-bold">Warning</AlertTitle>
                <AlertDescription>
                  <p>
                    Request body will not be sent for <strong>GET</strong>{" "}
                    requests.
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              <p>Edit the JSON request body.</p>
            )}
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
