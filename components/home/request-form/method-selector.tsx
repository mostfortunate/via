import { type HTTPMethod } from "@/app/types/http";

import { InputGroupButton } from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HTTP_METHODS: HTTPMethod[] = ["GET", "POST", "PATCH", "PUT", "DELETE"];

export interface MethodSelectorProps {
  method: HTTPMethod;
  setMethod: (method: HTTPMethod) => void;
}

export const MethodSelector = ({ method, setMethod }: MethodSelectorProps) => {
  const methodColorVar = `--http-method-${method.toLowerCase()}`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <InputGroupButton
          className="font-mono"
          style={{ color: `var(${methodColorVar})` }}
          variant="outline"
        >
          {method}
        </InputGroupButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-38">
        {HTTP_METHODS.map((name) => {
          const itemColorVar = `--http-method-${name.toLowerCase()}`;
          return (
            <DropdownMenuCheckboxItem
              key={name}
              checked={method === name}
              onCheckedChange={() => setMethod(name)}
              className="font-mono"
              style={{ color: `var(${itemColorVar})` }}
            >
              {name}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
