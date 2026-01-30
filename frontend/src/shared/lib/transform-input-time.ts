export function transformInputTime(value: string) {
  let digits = value.replace(/\D/g, '').slice(0, 4);

  if (digits.length === 1 && Number(digits[0]) > 2) {
    digits = '0' + digits;
  }
  if (digits.length >= 2) {
    const hours = Number(digits.slice(0, 2));
    if (hours > 23) {
      digits = '23' + digits.slice(2);
    }
  }
  if (digits.length >= 4) {
    const minutes = Number(digits.slice(2, 4));
    if (minutes > 59) {
      digits = digits.slice(0, 2) + '59';
    }
  }

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}
