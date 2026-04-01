/**
 * SOC Platform Utilities
 * Centralized logic for formatting and telemetry processing.
 */

export const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
};

export const maskIP = (ip) => {
  if (!ip) return "**.**.**.**";
  const parts = ip.split('.');
  if (parts.length !== 4) return ip;
  return `${parts[0]}.${parts[1]}.**.**`;
};

export const getSeverityColor = (sev, SEV_COLOR) => {
  return SEV_COLOR[sev?.toLowerCase()] || SEV_COLOR.normal;
};

export const getRelativeTime = (ts) => {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};
