export function normalizePhone(phone: string): string {
  const hasPlus = phone.trim().startsWith('+');
  const digits = phone.replace(/\D/g, '');

  return hasPlus ? `+${digits}` : digits;
}
