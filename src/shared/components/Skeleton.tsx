import { Skeleton as MantineSkeleton, Card } from '@mantine/core';

interface SkeletonCardProps {
  withImage?: boolean;
}

export function SkeletonCard({ withImage = false }: SkeletonCardProps) {
  return (
    <Card withBorder padding="lg" radius="md">
      <div className="flex flex-col gap-3">
        {withImage && (
          <MantineSkeleton height={120} radius="md" />
        )}
        <MantineSkeleton height={20} width="60%" radius="sm" />
        <MantineSkeleton height={14} width="80%" radius="sm" />
        <MantineSkeleton height={14} width="40%" radius="sm" />
      </div>
    </Card>
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <Card withBorder padding={0} radius="md" className="bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d]">
      <div className="p-4 border-b border-slate-200 dark:border-[#30363d]">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <MantineSkeleton key={i} height={14} width={`${100 / columns - 2}%`} radius="sm" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex} 
          className={`p-4 ${rowIndex < rows - 1 ? 'border-b border-slate-100 dark:border-[#21262d]' : ''}`}
        >
          <div className="flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <MantineSkeleton 
                key={colIndex} 
                height={16} 
                width={colIndex === 0 ? '30%' : `${(100 - 30) / (columns - 1)}%`} 
                radius="sm" 
              />
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}

interface SkeletonStatsProps {
  count?: number;
}

export function SkeletonStats({ count = 4 }: SkeletonStatsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} withBorder padding="lg" radius="md">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <MantineSkeleton height={12} width={80} radius="sm" />
              <MantineSkeleton height={28} width={60} radius="sm" />
            </div>
            <MantineSkeleton height={44} width={44} radius="md" />
          </div>
        </Card>
      ))}
    </div>
  );
}

interface SkeletonProjectsGridProps {
  count?: number;
}

export function SkeletonProjectsGrid({ count = 6 }: SkeletonProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} withBorder padding="lg" radius="md" className="bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d]">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-2 items-center flex-1">
                <MantineSkeleton height={20} width={20} radius="sm" />
                <MantineSkeleton height={18} width="60%" radius="sm" />
              </div>
              <MantineSkeleton height={24} width={24} radius="sm" />
            </div>
            <MantineSkeleton height={14} width="80%" radius="sm" />
            <MantineSkeleton height={14} width="50%" radius="sm" />
            <div className="pt-3 border-t border-slate-100 dark:border-[#21262d]">
              <MantineSkeleton height={12} width="40%" radius="sm" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface SkeletonDashboardProps {
  hasOrganization?: boolean;
}

export function SkeletonDashboard({ hasOrganization = true }: SkeletonDashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <MantineSkeleton height={28} width={250} radius="sm" />
          <MantineSkeleton height={16} width={180} radius="sm" />
        </div>
        {hasOrganization && (
          <MantineSkeleton height={36} width={120} radius="md" />
        )}
      </div>

      {/* Stats */}
      {hasOrganization && <SkeletonStats count={4} />}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {hasOrganization && (
          <div className="lg:col-span-2">
            <Card withBorder padding="lg" radius="md" className="bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d]">
              <div className="flex justify-between items-center mb-4">
                <MantineSkeleton height={20} width={150} radius="sm" />
                <MantineSkeleton height={24} width={80} radius="sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border border-slate-200 dark:border-[#30363d]">
                    <div className="flex items-start gap-3">
                      <MantineSkeleton height={40} width={40} radius="md" />
                      <div className="flex-1 flex flex-col gap-2">
                        <MantineSkeleton height={16} width="70%" radius="sm" />
                        <MantineSkeleton height={12} width="50%" radius="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Onboarding card */}
        <div className={hasOrganization ? 'lg:col-span-1' : 'lg:col-span-3'}>
          <Card withBorder padding="lg" radius="md" className="bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d]">
            <div className="flex items-center gap-3 mb-4">
              <MantineSkeleton height={40} width={40} radius="md" />
              <div className="flex-1 flex flex-col gap-2">
                <MantineSkeleton height={18} width="60%" radius="sm" />
                <MantineSkeleton height={12} width="40%" radius="sm" />
              </div>
            </div>
            <MantineSkeleton height={8} width="100%" radius="xl" mb="md" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-[#30363d]">
                  <div className="flex items-start gap-3">
                    <MantineSkeleton height={20} width={20} radius="sm" />
                    <div className="flex-1 flex flex-col gap-2">
                      <MantineSkeleton height={14} width="60%" radius="sm" />
                      <MantineSkeleton height={12} width="80%" radius="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
