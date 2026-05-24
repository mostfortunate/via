"use client";

import { type HTTPMethod } from "@/app/types/http";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

const HTTP_METHODS: HTTPMethod[] = ["GET", "POST", "PATCH", "PUT", "DELETE"];

type EndpointActionsProps = {
  onRename: () => void;
  onMethodChange: (method: HTTPMethod) => void;
  onDelete: () => void;
  currentMethod: HTTPMethod;
};

export default function EndpointActions({
  onRename,
  onMethodChange,
  onDelete,
  currentMethod,
}: EndpointActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="pointer-events-none size-7 opacity-0 transition-opacity group-focus-within/endpoint:pointer-events-auto group-focus-within/endpoint:opacity-100 group-hover/endpoint:pointer-events-auto group-hover/endpoint:opacity-100"
          onClick={(event) => event.stopPropagation()}
          aria-label="Endpoint actions"
        >
          <Ellipsis className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" sideOffset={62}>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onRename();
          }}
        >
          Rename
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger onClick={(event) => event.stopPropagation()}>
            Method
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {HTTP_METHODS.map((method) => {
              const methodColorVar = `--http-method-${method.toLowerCase()}`;
              return (
                <DropdownMenuCheckboxItem
                  key={method}
                  checked={currentMethod === method}
                  onCheckedChange={() => {
                    onMethodChange(method);
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  className="font-mono font-semibold"
                  style={{ color: `var(${methodColorVar})` }}
                >
                  {method}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          variant="destructive"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
