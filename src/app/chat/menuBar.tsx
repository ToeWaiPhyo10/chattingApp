import { UserButton } from "@clerk/nextjs";
import { Moon, Sun, Users } from "lucide-react";
import React from "react";
import { useTheme } from "../ThemeProvider";
import { dark } from "@clerk/themes";
interface MenuBarProps {
  onUserManualClick: () => void;
}

export default function MenuBar({ onUserManualClick }: MenuBarProps) {
  const { theme } = useTheme();
  return (
    <div className="flex flex-row items-center justify-between gap-3 border-e border-e-[#dbdde1] bg-white p-3 dark:border-e-gray-800 dark:bg-[#17191c]">
      <UserButton
        afterSignOutUrl="/"
        appearance={{ baseTheme: theme == "dark" ? dark : undefined }}
      />
      <div className="flex gap-6">
        <span title="Show users">
          <Users className="cursor-pointer" onClick={onUserManualClick} />
        </span>
        <ThemeToggleButton />
      </div>
    </div>
  );
}
function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  if (theme === "dark") {
    return (
      <span title="Switch to light theme">
        <Sun className="cursor-pointer" onClick={() => setTheme("light")} />
      </span>
    );
  }
  return (
    <span title="Switch to dark theme">
      <Moon className="cursor-pointer" onClick={() => setTheme("dark")} />
    </span>
  );
}
