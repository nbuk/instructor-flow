import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortName(
  firstName: string | null,
  middleName: string | null,
  lastName: string | null,
) {
  if (!firstName || !middleName || !lastName) return '';
  return `${lastName} ${firstName[0]}. ${middleName[0]}.`;
}

export function normalizePhone(phone: string): string {
  const hasPlus = phone.trim().startsWith('+');
  const digits = phone.replace(/\D/g, '');

  return hasPlus ? `+${digits}` : digits;
}
