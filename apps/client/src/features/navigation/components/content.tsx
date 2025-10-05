import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type ContentProps = {
  children: React.ReactNode;
};

function Content({ children }: ContentProps) {
  const { open, isMobile } = useSidebar();

  const contentWidth =
    open && !isMobile ? "w-[calc(100vw-16rem-8px)]" : "w-[calc(100vw-8px)]";

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1" />
      </header>
      <div className={cn("flex-1 overflow-auto p-6", contentWidth)}>
        {children}
      </div>
    </SidebarInset>
  );
}

export { Content };
