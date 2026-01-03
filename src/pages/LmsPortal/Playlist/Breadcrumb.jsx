import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <Link
        to="/lmsDashboard/Playlists"
        className="flex items-center gap-1 hover:text-red-600 transition-colors"
        title="Playlists"
      >
        <Home className="w-4 h-4" />
        <span className="font-medium">Playlists</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 font-medium truncate max-w-[200px]" title={item.label}>
                {item.label}
              </span>
            ) : item.to ? (
              <Link
                to={item.to}
                className="hover:text-red-600 transition-colors truncate max-w-[200px]"
                title={item.label}
              >
                {item.label}
              </Link>
            ) : (
              <span className="truncate max-w-[200px]" title={item.label}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

