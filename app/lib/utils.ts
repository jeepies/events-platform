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
  const hours = date.getHours().toString();
  const minutes = date.getMinutes().toString();

  const formattedHours = hours.length === 1 ? `0${hours}` : hours;
  const formattedMinutes = minutes.length === 1 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes}`;
}
