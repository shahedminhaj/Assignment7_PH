'use client';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">সাজান:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="default">ডিফল্ট</option>
        <option value="low-to-high">দাম: কম থেকে বেশি</option>
        <option value="high-to-low">দাম: বেশি থেকে কম</option>
      </select>
    </div>
  );
}