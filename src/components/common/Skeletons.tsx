import React from 'react';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#E2E8F0] dark:bg-[#1E293B] rounded-lg ${className}`} />
);

export const AssignmentCardSkeleton: React.FC = () => (
  <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-3">
    <div className="flex items-center justify-between">
      <SkeletonBox className="h-4 w-24 rounded-full" />
      <SkeletonBox className="h-4 w-16 rounded-md" />
    </div>
    <SkeletonBox className="h-5 w-3/4" />
    <SkeletonBox className="h-3 w-full" />
    <SkeletonBox className="h-3 w-2/3" />
    <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between">
      <SkeletonBox className="h-4 w-28" />
      <SkeletonBox className="h-6 w-20 rounded-lg" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div className="px-4 py-3.5 flex items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
    <div className="flex items-center gap-3 flex-1">
      <SkeletonBox className="w-8 h-8 rounded-full shrink-0" />
      <div className="space-y-1.5 flex-1">
        <SkeletonBox className="h-4 w-40" />
        <SkeletonBox className="h-3 w-24" />
      </div>
    </div>
    <SkeletonBox className="h-4 w-20" />
    <SkeletonBox className="h-6 w-16 rounded-md" />
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-3">
    <div className="flex items-center justify-between">
      <SkeletonBox className="h-3 w-28" />
      <SkeletonBox className="w-4 h-4 rounded-md" />
    </div>
    <SkeletonBox className="h-8 w-20" />
    <SkeletonBox className="h-3 w-36" />
  </div>
);
