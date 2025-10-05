import { NavigationItem } from "@/features/navigation/types/navigation";
import { Building, Home } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/navigation/components/app-sidebar";
import { Content } from "@/features/navigation/components/content";

type MainLayoutProps = {
  children?: React.ReactNode;
};

const navigation: NavigationItem[] = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Clients", href: "/clients", icon: Building },
];

const bottomNavigation: NavigationItem[] = [];

function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar
          navigation={navigation}
          bottomNavigation={bottomNavigation}
        />
        <Content>{children}</Content>
      </div>
    </SidebarProvider>
  );
}

export { MainLayout };
