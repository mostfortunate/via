"use client";

import { useTheme } from "next-themes";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-row gap-4">
      <Select value={method} onValueChange={setMethod}>
        <SelectTrigger
          className={`w-full max-w-48 font-semibold ${HTTP_METHODS[method][theme]}`}
        >
          <SelectValue placeholder={method} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(HTTP_METHODS).map(([name, color]) => (
              <SelectItem
                key={name}
                value={name}
                className={`font-semibold ${color[theme]}`}
              >
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button className="font-semibold" type="submit" onClick={onSend}>
        Send
      </Button>
    </div>
  );
};

export default RequestForm;
