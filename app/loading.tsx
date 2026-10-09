import SkeletonCard from '@/components/SkeletonCard';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}