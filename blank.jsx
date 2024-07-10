const SidebarItems = {
  home: {
    navigationLinks: [
      { text: "Contacts", to: "/contacts", icon: <FaUsers /> },
      { text: "Leads", to: "/leads", icon: <FaChartLine /> },
      { text: "Account Overview", to: "/account/overview", icon: <FaHouse /> },
      { text: "Configuration", to: "/configuration", icon: <FaGear /> },
      { text: "Inventory", to: "/inventory", icon: <FaWarehouse /> },
      { text: "Document Archive", to: "/documentarchive", icon: <FaBoxArchive /> },
      { text: "License Scanner", to: "/licensescanner", icon: <FaRegIdCard /> },
    ],
  },
  account: {
    pageName: "Account",
    navigationLinks: [
      { text: "Overview", to: "/account/overview", icon: <FaHouse /> },
    ],
  },
  contacts: {
    pageName: "Contacts",
    navigationLinks: [
      { text: "Contacts", to: "/contacts", icon: <FaUsers /> },
      { text: "New Contact", to: "/contacts/newcontact", icon: <FaRegIdCard /> },
    ],
  },
  leads: {
    pageName: "Leads",
    navigationLinks: [
      { text: "Leads", to: "/leads", icon: <FaChartLine /> },
      { text: "New Lead", to: "/leads/newlead", icon: <FaRegIdCard /> },
    ],
  },
  configuration: {
    pageName: "Configuration",
    navigationLinks: [
      { text: "Configuration", to: "/configuration", icon: <FaGear /> },
    ],
  },
  inventory: {
    pageName: "Inventory",
    navigationLinks: [
      { text: "Inventory", to: "/inventory", icon: <FaWarehouse /> },
    ],
  },
  documentarchive: {
    pageName: "Document Archive",
    navigationLinks: [
      { text: "Document Archive", to: "/documentarchive", icon: <FaBoxArchive /> },
    ],
  },
  licensescanner: {
    pageName: "License Scanner",
    navigationLinks: [
      { text: "Dashboard", to: "/licensescanner", icon: <FaBoxArchive /> },
      { text: "Reports", to: "/licensescanner", icon: <FaBoxArchive /> },
      { text: "History", to: "/licensescanner/history", icon: <FaBoxArchive /> },
      { text: "Visitors", to: "/licensescanner", icon: <FaBoxArchive /> },
      { text: "Groups", to: "/licensescanner", icon: <FaBoxArchive /> },
      { text: "Tags", to: "/licensescanner", icon: <FaBoxArchive /> },
      { text: "Alerts", to: "/licensescanner", icon: <FaBoxArchive /> },
      { text: "Locations", to: "/licensescanner", icon: <FaBoxArchive /> },
      { text: "Settings", to: "/licensescanner", icon: <FaBoxArchive /> },
      { text: "Access Management", to: "/licensescanner", icon: <FaBoxArchive /> },
    ],
  },
};