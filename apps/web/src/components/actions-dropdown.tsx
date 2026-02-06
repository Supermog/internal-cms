import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ActionsDropdownItem = {
  label: React.ReactNode;
  onClick: (date: any) => void;
};

type ActionsDropdownProps = {
  /** Content rendered inside the trigger button. */
  trigger: React.ReactNode;
  /** Menu items: label and onClick for each. */
  items: ActionsDropdownItem[];
  /** Optional alignment of the dropdown content. */
  align?: "start" | "center" | "end";
  /** Optional class name for the trigger button. */
  triggerClassName?: string;
};

export function ActionsDropdown({
  trigger,
  items,
  align = "end",
  triggerClassName,
}: ActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={triggerClassName ?? "h-8 w-8"}
        >
          {trigger}
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {items.map((item, index) => (
          <DropdownMenuItem
            className="cursor-pointer"
            key={index}
            onClick={item.onClick}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
