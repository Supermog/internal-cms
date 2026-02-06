import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

function PageHeader({ title, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start gap-2 border-b pb-4 mb-6", className)}>
      <SidebarTrigger className="-ml-1 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
        <div className="min-w-0">{title}</div>
        {actions != null ? (
          <div className="shrink-0 flex items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}

export { PageHeader };
