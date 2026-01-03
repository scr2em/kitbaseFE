import { useLocation, useNavigate } from 'react-router';
import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
}

interface FeatureTabNavigationProps {
  tabs: TabItem[];
  basePath: string;
}

export function FeatureTabNavigation({ tabs, basePath }: FeatureTabNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isTabActive = (tab: TabItem) => {
    const fullPath = `${basePath}/${tab.path}`;
    // Check if current path starts with the tab path (handles nested routes like /flags/:flagKey)
    return location.pathname === fullPath || location.pathname.startsWith(`${fullPath}/`);
  };

  return (
    <div className="border-b border-slate-200 mb-6">
      <nav className="-mb-px flex gap-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(`${basePath}/${tab.path}`)}
              className={`
                group relative flex items-center gap-2 py-3 text-sm font-medium transition-colors
                ${isActive
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
                }
              `}
            >
              {tab.icon && (
                <span className={`transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
