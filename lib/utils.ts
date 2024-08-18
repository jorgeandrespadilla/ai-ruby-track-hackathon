import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function startsWithPrefixes(str: string, prefixes: string[]) {
  return prefixes.some(prefix => str.startsWith(prefix));
}

export function generateUniqueFilename(filename: string) {
  const fileExtension = filename.split('.').pop();
  const uniqueFilename = `${uuidv4()}.${fileExtension}`;
  return uniqueFilename;
}
