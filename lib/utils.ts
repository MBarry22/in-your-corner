export function cn(...inputs: (string | undefined | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatPhoneDisplay(phone: string): string {
  if (phone.length <= 4) return phone;
  const last = phone.slice(-4);
  const rest = phone.slice(0, -4);
  return `${rest.replace(/\d/g, "•")}${last}`;
}
