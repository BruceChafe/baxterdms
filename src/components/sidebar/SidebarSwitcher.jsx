import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ResponsiveSidebar from "./ResponsiveSidebar";

const SidebarSwitcher = ({ collapsed, setCollapsed }) => {
  return <ResponsiveSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
};

export default SidebarSwitcher;
