import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertDateToComfyLocalTime(date: Date) {
  const localeTime = date.toLocaleTimeString();
  const localeDate = date.toLocaleDateString();
  return `${localeDate} @ ${localeTime}`;
}

export function calculateSecondsUntil(date: Date) {
  const now = new Date();
  return (date.getTime() - now.getTime()) / 1000;
}
