import { type QueryParam } from "@/app/types/models";

import { Input } from "@/components/ui/input";
import { DeleteButton } from "@/components/home/request-tabs/delete-button";

export interface QueryParamRowProps {
  param: QueryParam;
  onKeyChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onDelete: () => void;
}

export const QueryParamRow = ({
  param,
  onKeyChange,
  onValueChange,
  onDelete,
}: QueryParamRowProps) => (
  <div className="flex flex-row items-center gap-2">
    <Input
      placeholder="Key"
      value={param.key}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onKeyChange(e.target.value)
      }
    />
    <Input
      placeholder="Value"
      value={param.value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onValueChange(e.target.value)
      }
    />
    <DeleteButton onClick={onDelete} />
  </div>
);
