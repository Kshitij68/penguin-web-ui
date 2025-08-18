import classNames from "classnames";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface RouteItem {
  route: string;
  label: string;
}

interface SideBarInterface {
  routes: RouteItem[];
}

const Sidebar = ({ routes }: SideBarInterface) => {
  const location = useLocation();

  if (!routes.length) return null;
  return (
    <nav className="sidebar">
      <ul>
        {routes.map(({ route, label }, index) => (
          <li
            key={`${label}_${index}`}
            className={classNames({ selected: location.pathname === route })}
          >
            <Link to={route}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
