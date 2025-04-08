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

export function breakSecondsIntoComponents(seconds: number) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - hours * 3600) / 60);
  let secondsRemaining = Math.floor(seconds - hours * 3600 - minutes * 60);

  return { hours, minutes, secondsRemaining };
}

export function turnComponentsIntoString(components: { hours: number; minutes: number; secondsRemaining: number }) {
  let result = '';
  if(components.hours < 0 || components.minutes < 0 || components.secondsRemaining < 0) return "0 seconds";
  if (components.hours > 0) result = `${components.hours} hours,`;
  if (components.minutes > 0) result += ` ${components.minutes} minutes`;
  if (components.secondsRemaining > 0) result += ` and ${components.secondsRemaining} seconds`;
  return result + "";
}
