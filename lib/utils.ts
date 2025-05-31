import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string.
 * This utility function is used to conditionally join class names together.
 * It uses clsx for conditional classes and tailwind-merge to prevent duplicates.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
