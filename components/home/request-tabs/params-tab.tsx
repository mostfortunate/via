import { type QueryParam } from "@/app/types/models";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { QueryParamRow } from "@/components/home/request-tabs/query-param-row";

import { Plus, Trash2 } from "lucide-react";

export interface ParamsTabProps {
  queryParams: QueryParam[];
  updateQueryParam: (index: number, updates: Partial<QueryParam>) => void;
  deleteQueryParam: (index: number) => void;
  setQueryParams: (params: QueryParam[]) => void;
}

export const ParamsTab = ({
  queryParams,
  updateQueryParam,
  deleteQueryParam,
  setQueryParams,
}: ParamsTabProps) => (
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
          <QueryParamRow
            key={index}
            param={param}
            count={index + 1}
            onKeyChange={(value) => updateQueryParam(index, { key: value })}
            onValueChange={(value) => updateQueryParam(index, { value })}
            onDelete={() => deleteQueryParam(index)}
          />
        ))}
      </CardContent>
      <CardFooter className="flex flex-row items-center gap-4">
        <CardAction className="">
          <Button
            size="icon-sm"
            variant="secondary"
            onClick={() =>
              setQueryParams([...queryParams, { key: "", value: "" }])
            }
          >
            <Plus />
          </Button>
        </CardAction>
        {queryParams.length > 0 && (
          <CardAction>
            <Button
              size="icon-sm"
              variant="destructive"
              onClick={() => setQueryParams([])}
            >
              <Trash2 />
            </Button>
          </CardAction>
        )}
      </CardFooter>
    </Card>
  </TabsContent>
);
