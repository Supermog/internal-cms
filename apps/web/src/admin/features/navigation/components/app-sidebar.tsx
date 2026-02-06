import { NavigationItem } from "@/admin/features/navigation/types/navigation";
import { NavLink } from "react-router-dom";
import { Logo } from "@/components/logo";
import { LogoutNavigationItem } from "./logout-navigation-item";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  navigation: NavigationItem[];
  bottomNavigation: NavigationItem[];
}

const renderNavigationItem = (item: NavigationItem) => {
  if (item.disabled) {
    return (
      <SidebarMenuButton
        key={item.href}
        disabled
        className="cursor-not-allowed"
      >
        <item.icon className="h-4 w-4" />
        <span>{item.name}</span>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem key={item.name}>
      <SidebarMenuButton asChild>
        <NavLink to={item.href} className="text-black">
          <item.icon className="h-4 w-4" />
          <span>{item.name}</span>
          {item.hasNewMarking && (
            <div className="ml-auto h-2 w-2 rounded-full bg-red-500" />
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar({ navigation, bottomNavigation }: AppSidebarProps) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex h-12 items-center px-2">
          <Logo />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => renderNavigationItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {bottomNavigation.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Additional</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {bottomNavigation.map((item) => renderNavigationItem(item))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <LogoutNavigationItem />
      </SidebarFooter>
    </Sidebar>
  );
}
