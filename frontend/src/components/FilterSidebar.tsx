'use client';

import { useState } from 'react';

const EMIRATES = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
];

const BOX_SIZES = [
  { value: 'small', label: 'Small (1-5 sqm)' },
  { value: 'medium', label: 'Medium (5-10 sqm)' },
  { value: 'large', label: 'Large (10-20 sqm)' },
  { value: 'xlarge', label: 'Extra Large (20+ sqm)' },
];

const FEATURES = [
  'Climate Control',
  '24/7 Access',
  'Security Cameras',
  'Parking Available',
  'Ground Floor',
  'Elevator Access',
  'Insurance Available',
];

interface FilterSidebarProps {
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

export interface FilterValues {
  emirate: string;
  boxSize: string;
  minPrice: string;
  maxPrice: string;
  features: string[];
}

export function FilterSidebar({ onFilterChange, initialFilters }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterValues>(
    initialFilters || {
      emirate: '',
      boxSize: '',
      minPrice: '',
      maxPrice: '',
      features: [],
    }
  );

  const handleFilterChange = (key: keyof FilterValues, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature];
    handleFilterChange('features', newFeatures);
  };

  const clearFilters = () => {
    const emptyFilters: FilterValues = {
      emirate: '',
      boxSize: '',
      minPrice: '',
      maxPrice: '',
      features: [],
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Emirate Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emirate
          </label>
          <select
            value={filters.emirate}
            onChange={(e) => handleFilterChange('emirate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Emirates</option>
            {EMIRATES.map((emirate) => (
              <option key={emirate} value={emirate}>
                {emirate}
              </option>
            ))}
          </select>
        </div>

        {/* Box Size Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Box Size
          </label>
          <select
            value={filters.boxSize}
            onChange={(e) => handleFilterChange('boxSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Size</option>
            {BOX_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (AED/month)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Features Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features
          </label>
          <div className="space-y-2">
            {FEATURES.map((feature) => (
              <label key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
