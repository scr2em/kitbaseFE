import { Button } from '@mantine/core';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: 'filled' | 'light' | 'outline' | 'subtle';
  color?: string;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  illustration?: 'projects' | 'events' | 'team' | 'webhooks' | 'api-keys' | 'builds' | 'changelog' | 'environments';
  compact?: boolean;
}

function getIllustrationGradient(type?: string): { from: string; to: string } {
  switch (type) {
    case 'projects':
      return { from: 'blue', to: 'cyan' };
    case 'events':
      return { from: 'violet', to: 'purple' };
    case 'team':
      return { from: 'teal', to: 'green' };
    case 'webhooks':
      return { from: 'orange', to: 'red' };
    case 'api-keys':
      return { from: 'yellow', to: 'orange' };
    case 'builds':
      return { from: 'indigo', to: 'blue' };
    case 'changelog':
      return { from: 'pink', to: 'rose' };
    case 'environments':
      return { from: 'emerald', to: 'teal' };
    default:
      return { from: 'gray', to: 'slate' };
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  illustration,
  compact = false,
}: EmptyStateProps) {
  const gradient = getIllustrationGradient(illustration);

  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'py-8' : 'py-12'}`}>
      {/* Decorative background pattern */}
      <div className="relative mb-6">
        {/* Animated rings */}
        <div 
          className="absolute inset-0 -m-8 rounded-full opacity-10 animate-pulse"
          style={{
            background: `radial-gradient(circle, var(--mantine-color-${gradient.from}-3) 0%, transparent 70%)`,
          }}
        />
        <div 
          className="absolute inset-0 -m-4 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, var(--mantine-color-${gradient.from}-2) 0%, transparent 70%)`,
          }}
        />
        
        {/* Main icon container */}
        <div 
          className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, var(--mantine-color-${gradient.from}-1) 0%, var(--mantine-color-${gradient.to}-1) 100%)`,
            border: `1px solid var(--mantine-color-${gradient.from}-2)`,
          }}
        >
          <Icon 
            size={36} 
            strokeWidth={1.5}
            className="text-slate-400"
            style={{
              color: `var(--mantine-color-${gradient.from}-5)`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {primaryAction && (
            <Button
              leftSection={primaryAction.icon}
              onClick={primaryAction.onClick}
              variant={primaryAction.variant || 'filled'}
              color={primaryAction.color}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              leftSection={secondaryAction.icon}
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'subtle'}
              color={secondaryAction.color || 'gray'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}


