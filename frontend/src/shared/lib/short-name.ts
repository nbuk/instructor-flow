export function shortName(
  firstName: string | null,
  middleName: string | null,
  lastName: string | null,
) {
  if (!firstName || !middleName || !lastName) return '';
  return `${lastName} ${firstName[0]}. ${middleName[0]}.`;
}
