/**
 * Formats monetary amounts strictly to Indian standard currency layout or standard financial layout.
 * e.g., 42850 -> "₹42,850.00", -2000 -> "-₹2,000.00"
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);
  
  return isNegative ? `-${formatted}` : formatted;
};

/**
 * Format numbers with thousands separators
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Format percentage values
 */
export const formatPercent = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0.0%';
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
};

/**
 * Format date string into editorial readable date
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: true } : {}),
  };

  return date.toLocaleDateString('en-IN', options);
};

/**
 * Capitalize first letter helper
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
