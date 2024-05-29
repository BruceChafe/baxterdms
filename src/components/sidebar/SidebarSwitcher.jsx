import React from "react";
import { useLocation } from "react-router-dom";
import SidebarComponent from "./SidebarComponent";

const SidebarItems = {
  home: {
    navigationLinks: [
      { text: "Contacts", to: "/contacts" },
      { text: 'Leads', to: "/leads" },
      { text: "Account Overview", to: "/account/overview" },
      { text: "Configuration", to: "/configuration" },
      { text: "Inventory", to: "/inventory" },
      { text: "Document Archive", to: "/documentarchive" },
      { text: "License Scanner", to: "/licensescanner" },

    ],
  },
  account: {
    pageName: "Account",
    navigationLinks: [
      { text: "Overview", to: "/account/overview", color: "white" },
      // { text: "Personal Info", to: "/account/userprofile" },
      // { text: "Theme", to: "/account/theme" },
      // { text: "Update Password", to: "/account/updatepassword" },
    ],
  },
  contacts: {
    pageName: "Contacts",
    navigationLinks: [
      { text: "Contacts", to: "/contacts" },
      { text: "New Contact", to: "/contacts/newcontact" },
    ],
  },
  leads: {
    pageName: "Leads",
    navigationLinks: [
      { text: "Leads", to: "/leads" },
      { text: "New Lead", to: "/leads/newlead" },
    ],
  },
  configuration: {
    pageName: "Configuration",
    navigationLinks: [
      { text: "Configuration", to: "/configuration" },
    ],
  },
  inventory: {
    pageName: "Inventory",
    navigationLinks: [
      { text: "Inventory", to: "/inventory" },
    ],
  },
  documentArchive: {
    pageName: "Document Archive",
    navigationLinks: [
      { text: "Document Archive", to: "/documentarchive" },
    ],
  },
};

const SidebarSwitcher = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'home';

  return (
    <SidebarComponent
      {...(SidebarItems[path] || SidebarItems.home)}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
    />
  );
};

export default SidebarSwitcher;
