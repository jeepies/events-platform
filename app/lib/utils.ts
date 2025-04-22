import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateObjectToYMDString(date: Date): string {
  // https://stackoverflow.com/a/35494888/13076866
  return date.toISOString().split('T')[0];
}

export function dateObjectToHMString(date: Date): string {
  return `${date.getHours()}:${date.getMinutes()}`;
}
