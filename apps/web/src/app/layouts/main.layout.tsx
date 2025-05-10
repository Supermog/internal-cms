import { Sidebar } from "@/features/navigation/components/sidebar";
import { NavigationItem } from "@/features/navigation/types/navigation";
import { Building, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type MainLayoutProps = {
  children?: React.ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [bottomNavigation] = useState<NavigationItem[]>([]);

  useEffect(() => {
    setNavigation([
      { name: "Clients", href: "/clients", icon: Building },
      { name: "Overview", href: "/overview", icon: Home },
    ]);
  }, []);

  return (
    <>
      <div className={twMerge("h-full")}>
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

        <div className={twMerge("h-full transition-all", "lg:pl-72")}>
          <main className="mt-14 h-full px-4 py-6 sm:px-6 lg:mt-0 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export { MainLayout };
