import React from "react";

export interface NavigationItem {
  label?: string;
  path: string;
  icon?: React.JSXElementConstructor<any>;
  element: React.JSXElementConstructor<any>;
  subItems?: NavigationItem[];
}
