import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
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
      <div className={cn("flex-1 overflow-auto p-6", contentWidth)}>
        {children}
      </div>
    </SidebarInset>
  );
}

export { Content };
