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
            onKeyChange={(value) => updateQueryParam(index, { key: value })}
            onValueChange={(value) => updateQueryParam(index, { value })}
            onDelete={() => deleteQueryParam(index)}
          />
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
);
