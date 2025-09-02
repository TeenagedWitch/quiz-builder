import { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <div>{children}</div>;
};

export default Layout;
