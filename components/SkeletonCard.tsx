export default function SkeletonCard() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-pulse">
      <div className="h-10 w-10 bg-gray-200 rounded-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between pt-2 border-t border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}