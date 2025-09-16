import { Sidebar } from "@/features/navigation/components/sidebar";
import { NavigationItem } from "@/features/navigation/types/navigation";
import { Building, Home } from "lucide-react";
import { twMerge } from "tailwind-merge";

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
    <>
      <div className={twMerge("h-screen")}>
        {/* <MobileNavigation
      navigation={navigation}
      bottomNavigation={bottomNavigation}
    /> */}
        {/* Static sidebar for desktop */}
        <div
          className={twMerge(
            "group/sidebar hidden transition-all lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col",
            "lg:w-72"
          )}
        >
          <Sidebar
            navigation={navigation}
            bottomNavigation={bottomNavigation}
          />
        </div>

        <div className={twMerge("w-screen transition-all", "lg:pl-72")}>
          <main className="py-12 px-6 h-full w-full">{children}</main>
        </div>
      </div>
    </>
  );
}

export { MainLayout };
