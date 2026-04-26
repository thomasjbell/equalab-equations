'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'category', label: 'Category' },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={(v) => v !== null && onChange(v)}>
      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 min-w-[140px]">
        <SelectValue placeholder="Sort by…" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            Sort by {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
