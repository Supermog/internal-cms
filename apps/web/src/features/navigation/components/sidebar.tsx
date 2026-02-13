import { NavigationItem } from "@/admin/features/navigation/types/navigation";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Logo } from "@/components/logo";
import { kebabCase } from "lodash-es";
import { LogoutNavigationItem } from "./logout-navigation-item";

const renderItem = (item: NavigationItem) => {
  if (item.disabled) {
    return (
      <a
        key={item.href}
        className="flex cursor-not-allowed gap-x-3 rounded-md p-2 text-base font-medium leading-6 text-gray-400"
      >
        <item.icon
          className="h-6 w-6 shrink-0 text-gray-300"
          aria-hidden="true"
        />
        {item.name}
      </a>
    );
  }

  return (
    <NavLink
      key={item.href}
      to={item.href}
      id={kebabCase(item.name)}
      className={({ isActive }) =>
        twMerge(
          "navigation-item group",
          isActive ? "navigation-item-active" : "",
        )
      }
    >
      <div className="flex items-center gap-x-2">
        <item.icon
          className="navigation-icon group-hover:text-primary-800 group-[.is-active]:text-primary-800"
          aria-hidden="true"
        />
        <span>{item.name}</span>
      </div>
      {item.hasNewMarking && (
        <div className="h-3 w-3 animate-pulse rounded-full border-2 border-red-100 bg-red-500" />
      )}
    </NavLink>
  );
};

interface SidebarProps {
  navigation: NavigationItem[];
  bottomNavigation: NavigationItem[];
}

function Sidebar(props: SidebarProps) {
  const { navigation, bottomNavigation } = props;

  return (
    <div className="flex grow flex-col bg-gray-100 gap-y-5 border-r border-gray-200 pb-4">
      <div
        className={twMerge("mb-3 mt-8 ml-10 flex h-12 shrink-0 items-center")}
      >
        <Logo />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name} className="mx-6">
                  {renderItem(item)}
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <ul className="-mx-2 space-y-1">
              {bottomNavigation.map((item) => (
                <li key={item.name} className="mx-6">
                  {renderItem(item)}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>

      <LogoutNavigationItem />
    </div>
  );
}

export { renderItem, Sidebar };
