import React from "react";
import { useLocation } from "react-router-dom";
import SidebarComponent from "./SidebarComponent";

const SidebarItems = {
  home: {
    navigationLinks: [
      { text: "CRM", to: "/crm/newcontact", color: "white" },
      { text: "Account Overview", to: "/account/overview", color: "white" },
    ],
  },
  crm: {
    pageName: "CRM",
    navigationLinks: [
      { text: "Contacts", to: "/crm/contacts", color: "white" },
      { text: "New Contact", to: "/crm/newcontact", color: "white" },
    ],
  },
  account: {
    pageName: "Account",
    navigationLinks: [
      { text: "Overview", to: "/account/overview", color: "white" },
      { text: "Personal Info", to: "/account/userprofile", color: "white" },
      { text: "Theme", to: "/account/theme", color: "white" },
    ],
  },
};

const SidebarSwitcher = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  return <SidebarComponent {...SidebarItems[path]} />;
};

export default SidebarSwitcher;
