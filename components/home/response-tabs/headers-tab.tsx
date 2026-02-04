import { type AxiosResponse } from "axios";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { HeaderRow } from "@/components/home/response-tabs/header-row";

export interface HeadersTabProps {
  headers: AxiosResponse["headers"];
}

export const HeadersTab = ({ headers }: HeadersTabProps) => (
  <TabsContent value="Headers">
    <Card>
      <CardContent className="flex flex-col gap-2">
        {Object.entries(headers).map(([key, value], index) => (
          <HeaderRow key={index} headerKey={key} headerValue={value} />
        ))}
      </CardContent>
    </Card>
  </TabsContent>
);
