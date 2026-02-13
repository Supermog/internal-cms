import { Building, Home } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NavigationItem } from "@/features/navigation/types/navigation";
import { AppSidebar } from "@/features/navigation/components/app-sidebar";
import { Content } from "@/features/navigation/components/content";

type AdminLayoutProps = {
  children?: React.ReactNode;
};

const adminNavigation: NavigationItem[] = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Clients", href: "/clients", icon: Building },
];

const bottomNavigation: NavigationItem[] = [];

function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar
          navigation={adminNavigation}
          bottomNavigation={bottomNavigation}
        />
        <Content>{children}</Content>
      </div>
    </SidebarProvider>
  );
}

export { AdminLayout };
