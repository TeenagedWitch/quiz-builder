import { ReactNode } from "react";
import Toasts from "./Toasts";
import Link from "next/link";

export type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Toasts />
      <header className="mb-3">
        <nav className="navbar navbar-expand-lg navbar-light  bg-dark px-3">
          <Link className="navbar-brand text-white" href="/">
            Quiz Builder
          </Link>
          <div className="ms-auto">
            <Link className="btn btn-primary" href="/quiz/edit">
              Create Quiz
            </Link>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
};

export default Layout;
