export const FOOD_TYPES = [
  { value: 'PREPARED_MEAL', label: 'Prepared Meal', icon: '🍽️' },
  { value: 'BAKERY', label: 'Bakery', icon: '🥐' },
  { value: 'FRUITS', label: 'Fruits', icon: '🍎' },
  { value: 'VEGETABLES', label: 'Vegetables', icon: '🥬' },
  { value: 'DAIRY', label: 'Dairy', icon: '🧀' },
  { value: 'PACKAGED_FOOD', label: 'Packaged Food', icon: '📦' },
  { value: 'BEVERAGES', label: 'Beverages', icon: '🥤' },
  { value: 'OTHER', label: 'Other', icon: '🍽️' },
];

export const UNITS = [
  { value: 'KG', label: 'KG' },
  { value: 'GRAM', label: 'Gram' },
  { value: 'LITRE', label: 'Litre' },
  { value: 'ML', label: 'ML' },
  { value: 'PORTION', label: 'Portion' },
  { value: 'PACK', label: 'Pack' },
  { value: 'PIECE', label: 'Piece' },
];

export const LISTING_TYPES = [
  { value: 'DONATION', label: 'Donation' },
  { value: 'SALE', label: 'Sale' },
];

// Food statuses matching actual backend
export const FOOD_STATUSES = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'CLAIMED', label: 'Claimed' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const STATUS_COLORS = {
  AVAILABLE: { bg: '#f0fdf4', text: '#16a34a' },
  RESERVED: { bg: '#fffbeb', text: '#d97706' },
  SOLD: { bg: '#eff6ff', text: '#2563eb' },
  CLAIMED: { bg: '#f0f4ff', text: '#4f46e5' },
  EXPIRED: { bg: '#f3f4f6', text: '#6b7280' },
  CANCELLED: { bg: '#fef2f2', text: '#dc2626' },
};

export const CURRENCY_SYMBOL = '₹';

export const getFoodTypeLabel = (value) =>
  FOOD_TYPES.find((t) => t.value === value)?.label || value;

export const getFoodTypeIcon = (value) =>
  FOOD_TYPES.find((t) => t.value === value)?.icon || '🍽️';

export const getUnitLabel = (value) =>
  UNITS.find((u) => u.value === value)?.label || value;
