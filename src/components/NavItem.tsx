import { useNavigate, useLocation } from "react-router-dom";

interface NavItemProps {
  path: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ path, icon, label, collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <li>
      <div
        onClick={() => navigate(path)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all 
          ${
            isActive
              ? "bg-[#4f46e5]/10 text-[#4f46e5]"
              : "text-[#475569] hover:bg-gray-100"
          }
        `}
      >
        {icon}
        {!collapsed && <span className="font-medium text-sm">{label}</span>}
      </div>
    </li>
  );
};

export default NavItem;
