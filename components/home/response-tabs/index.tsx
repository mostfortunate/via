import { type AxiosResponse } from "axios";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { HeadersTab } from "@/components/home/response-tabs/headers-tab";
import { BodyTab } from "@/components/home/response-tabs/body-tab";
import { Status } from "@/components/home/response-tabs/status";

const responseTabs = ["Body", "Headers"];

interface ResponseTabsProps {
  response: AxiosResponse;
  responseBody: string;
  getStatusText: (res: AxiosResponse) => string;
}

const ResponseTabs = ({
  response,
  responseBody,
  getStatusText,
}: ResponseTabsProps) => {
  if (!response) return <></>;

  return (
    <Tabs defaultValue={responseTabs[0]} className="w-full">
      <TabsList variant="line" className="mb-4 flex w-full items-center">
        <div>
          {responseTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </div>
        <Status response={response} getStatusText={getStatusText} />
      </TabsList>
      <BodyTab responseBody={responseBody} />
      <HeadersTab headers={response.headers} />
    </Tabs>
  );
};

export default ResponseTabs;
