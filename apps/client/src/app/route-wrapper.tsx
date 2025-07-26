import * as React from "react";
import { Outlet } from "react-router-dom";

export type RouteWrapperProps = {
  guard?: React.FC | null;
  layout?: React.FC | null;
};

function RouteWrapper({ guard, layout }: RouteWrapperProps) {
  const Guard = guard ?? React.Fragment;
  const Layout = layout ?? React.Fragment;

  return (
    <Guard>
      <Layout>
        <Outlet />
      </Layout>
    </Guard>
  );
}

export { RouteWrapper };
