import React from "react";
import ResponsiveSidebar from "./ResponsiveSidebar";

const SidebarSwitcher = ({ collapsed, setCollapsed }) => {
  return <ResponsiveSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
};

export default SidebarSwitcher;
