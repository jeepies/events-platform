import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDateToComfyLocalTime(date: Date) {
  const localeTime = date.toLocaleTimeString();
  const localeDate = date.toLocaleDateString();
  return `${localeDate} @ ${localeTime}`
} 