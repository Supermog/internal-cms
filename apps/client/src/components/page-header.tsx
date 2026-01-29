import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

function PageHeader({ children, className }: PageHeaderProps) {
  return (
    <div
      className={cn("flex items-center gap-2 border-b pb-4 mb-6", className)}
    >
      <SidebarTrigger className="-ml-1 shrink-0" />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export { PageHeader };
