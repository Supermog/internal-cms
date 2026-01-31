import { NavigationItem } from "@/features/navigation/types/navigation";
import { Building, Clock, Home, Users } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/navigation/components/app-sidebar";
import { Content } from "@/features/navigation/components/content";
import { useAuthUser } from "@/features/auth/auth-user.context";

type MainLayoutProps = {
  children?: React.ReactNode;
};

const adminNavigation: NavigationItem[] = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Clients", href: "/clients", icon: Building },
];

const clientNavigation: NavigationItem[] = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Users", href: "/users", icon: Users },
  { name: "Support Hours", href: "/support-hours", icon: Clock },
];

const bottomNavigation: NavigationItem[] = [];

function MainLayout({ children }: MainLayoutProps) {
  const { isClientUser } = useAuthUser();

  const navigation = isClientUser ? clientNavigation : adminNavigation;

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
