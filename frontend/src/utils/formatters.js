import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'h:mm a');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy · h:mm a');
};

export const timeAgo = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const isExpired = (date) => {
  if (!date) return false;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isPast(d);
};

export const getTimeUntil = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isPast(d)) return 'Expired';
  return `Expires ${formatDistanceToNow(d, { addSuffix: true })}`;
};
