import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatEther } from 'viem';
import { intervalToDuration } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTokenAmount(amount: bigint | undefined, decimals = 4): string {
  if (typeof amount === 'undefined') {
    return Number(0).toFixed(decimals);
  }
  const formatted = formatEther(amount);
  const [integer, fraction] = formatted.split('.');

  if (fraction) {
    const truncatedFraction = fraction.slice(0, decimals);
    return `${integer}.${truncatedFraction.padEnd(decimals, '0')}`;
  }
  
  return `${integer}.${''.padEnd(decimals, '0')}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 0) seconds = 0;
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  const parts: string[] = [];
  if (duration.days && duration.days > 0) parts.push(`${duration.days}d`);
  if (duration.hours && duration.hours > 0) parts.push(`${duration.hours}h`);
  if (duration.minutes && duration.minutes > 0) parts.push(`${duration.minutes}m`);
  
  if (parts.length === 0 && seconds > 0) {
    return "< 1m";
  }

  if (parts.length === 0 && seconds === 0) {
    return "0m";
  }

  return parts.slice(0, 2).join(' ');
}
