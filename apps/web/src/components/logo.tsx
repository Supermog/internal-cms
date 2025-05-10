import logo from "@/app/assets/logomark.svg";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn(className, "flex items-center gap-2")}>
      <img alt="ClassView" src={logo} className="h-8 w-auto" />
      <p>Service Desk</p>
    </Link>
  );
}
