import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { PageIcon, ChevronDownIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Semua menu
const allNavItems: NavItem[] = [
  {
    icon: <PageIcon />,
    name: "Dashboard",
    subItems: [
      { name: "Data Pegawai", path: "/pegawai", pro: false },
      { name: "Data Lokasi", path: "/lokasi", pro: false },
      { name: "Data Aset", path: "/aset", pro: false },
      { name: "Riwayat Aset", path: "/riwayat", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);

  const [subMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role); // pastikan di backend token user punya field 'role'
    }
  }, []);

  // Filter menu berdasarkan role
  const navItems = allNavItems.map((item) => ({
    ...item,
    subItems: item.subItems?.filter((sub) => {
      if (userRole === "admin") return sub.name === "Data Pegawai";
      if (userRole === "pegawai") return sub.name !== "Data Pegawai";
      return false;
    }),
  }));

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.index === index) return null;
      return { type: "main", index };
    });
  };

  const renderMenuItems = () => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`menu-item group ${
                  openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer`}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                    }`}
                  />
                )}
              </button>

              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  style={{
                    height:
                      openSubmenu?.index === index
                        ? `${subMenuHeight[`main-${index}`] || "auto"}`
                        : "0px",
                    overflow: "hidden",
                    transition: "height 0.3s",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems?.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path!}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path!) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
      ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-8 flex justify-start">
        <Link to="/">
          <img
            className="dark:hidden"
            src="/images/logo/logo.svg"
            alt="Logo"
            width={150}
            height={40}
          />
          <img
            className="hidden dark:block"
            src="/images/logo/logo.svg"
            alt="Logo"
            width={150}
            height={40}
          />
        </Link>
      </div>
      <nav className="flex flex-col overflow-y-auto">{renderMenuItems()}</nav>
    </aside>
  );
};

export default AppSidebar;
