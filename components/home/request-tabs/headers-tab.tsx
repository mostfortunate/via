import { type Header } from "@/app/types/models";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HeaderRow } from "@/components/home/request-tabs/header-row";

import { Plus, Trash2 } from "lucide-react";

export interface HeadersTabProps {
  headers: Header[];
  updateHeader: (index: number, updates: Partial<Header>) => void;
  deleteHeader: (index: number) => void;
  setHeaders: (headers: Header[]) => void;
}

export const HeadersTab = ({
  headers,
  updateHeader,
  deleteHeader,
  setHeaders,
}: HeadersTabProps) => (
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
          <HeaderRow
            key={index}
            header={header}
            count={index + 1}
            onKeyChange={(value) => updateHeader(index, { key: value })}
            onValueChange={(value) => updateHeader(index, { value })}
            onDelete={() => deleteHeader(index)}
          />
        ))}
      </CardContent>
      <CardFooter className="flex flex-row gap-4">
        <CardAction className="">
          <Button
            className="font-bold"
            variant="secondary"
            size="icon-sm"
            onClick={() => setHeaders([...headers, { key: "", value: "" }])}
          >
            <Plus />
          </Button>
        </CardAction>
        {headers.length > 0 && (
          <CardAction>
            <Button
              className="font-bold"
              size="icon-sm"
              variant="destructive"
              onClick={() => setHeaders([])}
            >
              <Trash2 />
            </Button>
          </CardAction>
        )}
      </CardFooter>
    </Card>
  </TabsContent>
);
