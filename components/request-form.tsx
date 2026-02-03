"use client";

import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { HTTPMethod } from "@/app/types/http";

interface RequestFormProps {
  url: string;
  method: HTTPMethod;
  setUrl: (url: string) => void;
  setMethod: (method: HTTPMethod) => void;
  onSend: () => void;
}

type MethodColor = {
  light: string;
  dark: string;
};

const HTTP_METHODS: Record<HTTPMethod, MethodColor> = {
  GET: { light: "text-blue-500", dark: "text-blue-500" },
  POST: { light: "text-green-600", dark: "text-green-500" },
  PATCH: { light: "text-green-500", dark: "text-green-300" },
  PUT: { light: "text-orange-500", dark: "text-orange-500" },
  DELETE: { light: "text-red-500", dark: "text-red-500" },
};

const RequestForm = ({
  url,
  setUrl,
  method,
  setMethod,
  onSend,
}: RequestFormProps) => {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme ?? "light") as "light" | "dark";

  return (
    <InputGroup>
      <InputGroupInput
        id="inline-start-input"
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <InputGroupAddon align="inline-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton
              className={`font-mono ${HTTP_METHODS[method][theme]}`}
              variant="outline"
            >
              {method}
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start"  className="w-38">
            {Object.entries(HTTP_METHODS).map(([name, color]) => (
              <DropdownMenuCheckboxItem
                key={name}
                checked={method === name}
                onCheckedChange={() => setMethod(name as HTTPMethod)}
                className={`font-mono ${color[theme]}`}
              >
                {name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          variant="default"
          className="text-primary-foreground font-semibold"
          onClick={onSend}
        >
          Send
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default RequestForm;
