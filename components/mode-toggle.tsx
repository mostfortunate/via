"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const theme = resolvedTheme;

  return resolvedTheme === "dark" ? (
    <Button size="icon" onClick={() => setTheme("light")}>
      <Moon />
    </Button>
  ) : (
    <Button size="icon" onClick={() => setTheme("dark")}>
      <Sun />
    </Button>
  );
}
