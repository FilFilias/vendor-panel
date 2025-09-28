import { Link, useLocation } from "react-router";
import { 
  BarChart3, 
  Calendar, 
  ChevronRight, 
  Home, 
  Menu, 
  Package, 
  PieChart, 
  PlusCircle, 
  Settings, 
  ShoppingCart, 
  Users,
  LayoutGrid,
  UserCheck,
  Mail,
  Moon,
  Sun,
  LogOut,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import VentorLogo from "../VentorLogo";
import { useTheme } from "~/contexts/ThemeContext";

export function Sidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true); // Default to expanded for SSR
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') return;
    
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 1024;
      setIsSmallScreen(isSmall);
      setExpanded(!isSmall);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    const handleResize = () => {
      checkScreenSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  let {t} = useTranslation() 

  const navItems = [
    { name: t('dashboard'), path: "/", icon: <Home className="h-5 w-5" /> },
    { name: t('customers'), path: "/customers", icon: <Users className="h-5 w-5" /> },
    // { name: t('customer_groups'), path: "/customer-groups", icon: <UserCheck className="h-5 w-5" /> },
    { name: t('invitations'), path: "/invitations", icon: <Mail className="h-5 w-5" /> },
    { name: t('products'), path: "/products", icon: <Package className="h-5 w-5" /> },
    // { name: t('collections'), path: "/collections", icon: <LayoutGrid className="h-5 w-5" /> },
    { name: t('orders'), path: "/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    // { name: t('price_lists'), path: "/price-lists", icon: <PlusCircle className="h-5 w-5" /> },
    // { name: t('campaigns'), path: "/campaigns", icon: <Calendar className="h-5 w-5" /> },
    // { name: t('analytics'), path: "/analytics", icon: <PieChart className="h-5 w-5" /> },
    { name: t('settings'), path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div 
      className={`py-5 fixed inset-y-0 left-0 z-40 flex h-screen flex-col justify-between border-r bg-primary dark:bg-gray-900 transition-all duration-300 ${
        isSmallScreen && expanded 
          ? "w-64 px-4 shadow-xl" 
          : expanded 
            ? "w-64 px-4" 
            : "w-16 px-2"
      }`}
    >
      <div className="flex flex-col h-full pt-16">

        {isSmallScreen && (
          <div className="flex justify-end">
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="absolute -right-3 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md"
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}

        <nav className="mt-12 space-y-1.5 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group relative flex w-full items-center rounded-md py-2 transition-colors ${
                isActive(item.path) 
                  ? "bg-white/10" 
                  : "hover:bg-white/10"
              } ${expanded ? "px-3" : "justify-center px-2"}`}
            >
              <div className="text-white">{item.icon}</div>
              {expanded && <span className="ml-3 text-white">{item.name}</span>}
              
              {!expanded && (
                <div className="absolute left-full ml-6 hidden w-auto min-w-[120px] origin-left scale-95 rounded-md bg-gray-800 px-2 py-1 text-sm text-white opacity-0 shadow-md transition-all group-hover:scale-100 group-hover:opacity-100">
                  {item.name}
                </div>
              )}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col justify-end flex-grow space-y-1.5 ">
          <button 
            onClick={toggleTheme}
            className={`group relative flex w-full items-center rounded-md py-2 transition-colors hover:bg-white/10 ${expanded ? "px-3" : "justify-center px-2"}`}
          >
            <div className="text-white">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </div>
              {expanded && <span className="ml-3 text-white">Light / Dark Mode</span>}
              
              {!expanded && (
                <div className="absolute left-full ml-6 hidden w-auto min-w-[120px] origin-left scale-95 rounded-md bg-gray-800 px-2 py-1 text-sm text-white opacity-0 shadow-md transition-all group-hover:scale-100 group-hover:opacity-100">
                  Light / Dark Mode
                </div>
              )}
            </button>
            <button 
              className={`group relative flex w-full items-center rounded-md py-2 transition-colors hover:bg-white/10 text-white ${expanded ? "px-3" : "justify-center px-2"}`}
            >
                <LogOut className="mr-2 h-5 w-5 text-white" />
                Logout
            </button>
            <Link 
              to='/docs'
              className={`group relative flex w-full items-center rounded-md py-2 transition-colors hover:bg-white/10 text-white ${expanded ? "px-3" : "justify-center px-2"}`}
            >
                <FileText className="mr-2 h-5 w-5 text-white" />
                Docs
            </Link>
        </div>
      </div>
    </div>
  );
}