export function isValidBRPhone(value: string): boolean {
  if (!value) return false;
  const str = String(value).trim();
  const pattern = /^(?:\(\d{2}\)\s?\d{4,5}-\d{4}|\d{2}\s?\d{4,5}-\d{4}|\d{10,11})$/;
  return pattern.test(str);
}

export function isValidMonthYear(value: string): boolean {
  if (!value) return false;
  return /^(0[1-9]|1[0-2])\/\d{4}$/.test(value.trim());
}
