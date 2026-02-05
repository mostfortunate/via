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
  const ignoreBody = method == "GET";
  const requestTabs = ignoreBody
    ? ["Params", "Headers"]
    : ["Params", "Headers", "JSON"];

  return (
    <Tabs
      key={ignoreBody ? "no-body" : "body"}
      defaultValue={requestTabs[0]}
      className="w-full"
    >
      <TabsList variant="line">
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
      {!ignoreBody && (
        <BodyTab
          requestBody={requestBody}
          onRequestBodyChange={onRequestBodyChange}
        />
      )}
    </Tabs>
  );
};

export default RequestTabs;
