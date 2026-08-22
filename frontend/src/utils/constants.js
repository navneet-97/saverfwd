export const FOOD_TYPES = [
  { value: 'PREPARED_MEAL', label: 'Prepared Meal' },
  { value: 'BAKERY', label: 'Bakery' },
  { value: 'FRUITS', label: 'Fruits' },
  { value: 'VEGETABLES', label: 'Vegetables' },
  { value: 'DAIRY', label: 'Dairy' },
  { value: 'PACKAGED_FOOD', label: 'Packaged Food' },
  { value: 'BEVERAGES', label: 'Beverages' },
  { value: 'OTHER', label: 'Other' },
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

export const LISTING_STATUSES = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'CLAIMED', label: 'Claimed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const STATUS_COLORS = {
  AVAILABLE: { bg: '#f0fdf4', text: '#16a34a' },
  RESERVED: { bg: '#fffbeb', text: '#d97706' },
  CLAIMED: { bg: '#eff6ff', text: '#2563eb' },
  COMPLETED: { bg: '#f0fdf4', text: '#16a34a' },
  EXPIRED: { bg: '#f3f4f6', text: '#6b7280' },
  CANCELLED: { bg: '#fef2f2', text: '#dc2626' },
  PENDING: { bg: '#fffbeb', text: '#d97706' },
  CONFIRMED: { bg: '#eff6ff', text: '#2563eb' },
};

export const CURRENCY_SYMBOL = '₹';

export const getFoodTypeLabel = (value) =>
  FOOD_TYPES.find((t) => t.value === value)?.label || value;

export const getUnitLabel = (value) =>
  UNITS.find((u) => u.value === value)?.label || value;
