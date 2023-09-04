import { UserButton } from "@clerk/nextjs";
import { Users } from "lucide-react";
import React from "react";
interface MenuBarProps {
  onUserManualClick: () => void;
}

export default function MenuBar({ onUserManualClick }: MenuBarProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-3 border-e border-e-[#dbdde1] bg-white p-3">
      <UserButton afterSignOutUrl="/" />
      <div className="flex gap-6">
        <span title="Show users">
          <Users className="cursor-pointer" onClick={onUserManualClick} />
        </span>
      </div>
    </div>
  );
}
