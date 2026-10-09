interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface MarketTableProps {
  markets: Market[];
}

const toBengaliNumber = (num: number) => {
  if (num === undefined || num === null || isNaN(num)) return '০';
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return Math.round(num).toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d)]);
};

export default function MarketTable({ markets }: MarketTableProps) {
  if (!markets || markets.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
        কোনো বাজারের তথ্য পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">বাজার</th>
              <th className="px-4 py-3 text-left font-semibold">বিভাগ</th>
              <th className="px-4 py-3 text-right font-semibold">সর্বনিম্ন</th>
              <th className="px-4 py-3 text-right font-semibold">সর্বোচ্চ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {markets.map((m, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{m.market}</td>
                <td className="px-4 py-3 text-gray-500">{m.division}</td>
                <td className="px-4 py-3 text-right text-green-600 font-medium">
                  {toBengaliNumber(m.min)} টাকা
                </td>
                <td className="px-4 py-3 text-right text-red-600 font-medium">
                  {toBengaliNumber(m.max)} টাকা
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}