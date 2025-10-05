import { LogOut } from "lucide-react";
import supabase from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

function LogoutNavigationItem() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenuButton>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Log Out</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleLogout}>Log out</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export { LogoutNavigationItem };
