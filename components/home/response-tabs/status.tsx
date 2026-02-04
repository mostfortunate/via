import { type AxiosResponse } from "axios";
import { getStatusColorClass } from "@/lib/utils";
import prettyBytes from "pretty-bytes";

export interface StatusProps {
  response: AxiosResponse;
  getStatusText: (res: AxiosResponse) => string;
}

export const Status = ({ response, getStatusText }: StatusProps) => (
  <div className="ml-auto flex gap-4 font-mono text-xs font-semibold">
    <span className={`font-bold ${getStatusColorClass(response.status)}`}>
      {response.status} {getStatusText(response)}
    </span>
    <span>{response.customData?.time} ms</span>
    <span>
      {prettyBytes(
        new Blob([
          JSON.stringify(response.data),
          JSON.stringify(response.headers),
        ]).size,
      )}
    </span>
  </div>
);
