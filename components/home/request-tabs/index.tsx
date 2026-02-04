import { type HTTPMethod } from "@/app/types/http";
import { type QueryParam, type Header } from "@/app/types/models";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BodyTab } from "@/components/home/request-tabs/body-tab";
import { HeadersTab } from "@/components/home/request-tabs/headers-tab";
import { ParamsTab } from "@/components/home/request-tabs/params-tab";

interface RequestTabsProps {
  method: HTTPMethod;
  queryParams: QueryParam[];
  updateQueryParam: (index: number, updates: Partial<QueryParam>) => void;
  deleteQueryParam: (index: number) => void;
  setQueryParams: (params: QueryParam[]) => void;
  headers: Header[];
  updateHeader: (index: number, updates: Partial<Header>) => void;
  deleteHeader: (index: number) => void;
  setHeaders: (headers: Header[]) => void;
  requestBody: string;
  onRequestBodyChange: (body: string) => void;
}

const RequestTabs = ({
  method,
  queryParams,
  updateQueryParam,
  deleteQueryParam,
  setQueryParams,
  headers,
  updateHeader,
  deleteHeader,
  setHeaders,
  requestBody,
  onRequestBodyChange,
}: RequestTabsProps) => {
  const ignoreJSON = method == "GET";
  const requestTabs = ["Params", "Headers", "JSON"];

  return (
    <Tabs defaultValue={requestTabs[0]} className="w-full">
      <TabsList variant="line" className="mb-4">
        {requestTabs.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <ParamsTab
        queryParams={queryParams}
        updateQueryParam={updateQueryParam}
        deleteQueryParam={deleteQueryParam}
        setQueryParams={setQueryParams}
      />
      <HeadersTab
        headers={headers}
        updateHeader={updateHeader}
        deleteHeader={deleteHeader}
        setHeaders={setHeaders}
      />
      <BodyTab
        ignoreJSON={ignoreJSON}
        requestBody={requestBody}
        onRequestBodyChange={onRequestBodyChange}
      />
    </Tabs>
  );
};

export default RequestTabs;
