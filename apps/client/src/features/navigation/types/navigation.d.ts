export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  children?: NavigationItem[];
  disabled?: boolean;
  hasNewMarking?: boolean;
}
