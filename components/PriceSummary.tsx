interface PriceSummaryProps {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

const toBengaliNumber = (num: number) => {
  if (num === undefined || num === null || isNaN(num)) return '০';
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return Math.round(num).toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d)]);
};

export default function PriceSummary({ minPrice, maxPrice, avgPrice }: PriceSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">সর্বনিম্ন দাম</p>
        <p className="text-2xl font-bold text-green-600">{toBengaliNumber(minPrice)} টাকা</p>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">সর্বোচ্চ দাম</p>
        <p className="text-2xl font-bold text-red-600">{toBengaliNumber(maxPrice)} টাকা</p>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">গড় দাম</p>
        <p className="text-2xl font-bold text-gray-800">{toBengaliNumber(avgPrice)} টাকা</p>
      </div>
    </div>
  );
}