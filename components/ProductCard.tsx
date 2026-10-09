import Link from 'next/link';

interface ProductCardProps {
  slug: string;
  name: string;
  emoji: string;
  unit: string;
  price: number;
  change: number;
  changeDir: 'up' | 'down' | 'flat';
}

const toBengaliNumber = (num: number) => {
  if (num === undefined || num === null || isNaN(num)) return '০';
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return Math.round(num).toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d)]);
};

export default function ProductCard({
  slug,
  name,
  emoji,
  unit,
  price,
  change,
  changeDir,
}: ProductCardProps) {
  const isUp = changeDir === 'up';
  const isDown = changeDir === 'down';

  return (
    <Link
      href={`/product/${slug}`}
      className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100"
    >
      <div className="text-4xl mb-2">{emoji}</div>
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-xs text-gray-500 mb-2">{unit}</p>
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-400 block">আজকের দাম</span>
          <p className="text-lg font-bold text-gray-800">
            {toBengaliNumber(price)} টাকা
          </p>
        </div>
        <span
          className={`text-sm font-semibold ${
            isUp ? 'text-red-500' : isDown ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          {isUp ? '▲' : isDown ? '▼' : '—'} {toBengaliNumber(Math.abs(change))}%
        </span>
      </div>
    </Link>
  );
}