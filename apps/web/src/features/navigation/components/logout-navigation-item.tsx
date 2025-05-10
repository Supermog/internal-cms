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

function LogoutNavigationItem() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <div className="mx-6 flex items-center border-t border-gray-200 pb-4 pt-6">
        {/* <div className="hide-account-info-if-collapsed mr-3 min-w-0 flex-1">
          <Link
            to={routePaths.home}
            className="navigation-item flex-col items-start"
          >
            <span className="block truncate text-left text-sm font-semibold text-gray-700">
              {user.givenName} {user.familyName}
            </span>
            <span className="block truncate text-left text-xs font-normal">
              {user.email}
            </span>
          </Link>
        </div> */}
        <div className="ml-auto">
          <Dialog>
            <DialogTrigger asChild>
              <button type="button" id="logout-button" className="bg-gray-100">
                <LogOut aria-hidden="true" />
                <span className="sr-only">Log out</span>
              </button>
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
        </div>
      </div>
    </>
  );
}

export { LogoutNavigationItem };
