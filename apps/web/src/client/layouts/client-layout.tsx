import { Clock, Home, Ticket, Users } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NavigationItem } from "@/features/navigation/types/navigation";
import { AppSidebar } from "@/features/navigation/components/app-sidebar";
import { Content } from "@/features/navigation/components/content";

type ClientLayoutProps = {
  children?: React.ReactNode;
};

const clientNavigation: NavigationItem[] = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Users", href: "/users", icon: Users },
  { name: "Support Hours", href: "/support-hours", icon: Clock },
  { name: "Tickets", href: "/tickets", icon: Ticket },
];

const bottomNavigation: NavigationItem[] = [];

function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar
          navigation={clientNavigation}
          bottomNavigation={bottomNavigation}
        />
        <Content>{children}</Content>
      </div>
    </SidebarProvider>
  );
}

export { ClientLayout };
