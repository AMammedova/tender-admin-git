export interface SidebarItemProps {
    item: {
      label: string;
      route: string;
      icon?: JSX.Element;
      children?: {
        label: string;
        route: string;
      }[];
    };
    pageName: string;
    setPageName: (pageName: string) => void;
  }
 export interface SidebarItem {
    label: string;
    route: string;
    children?: SidebarItem[];
  }