/**
 * Format a number as Vietnamese currency (e.g. 3.500.000đ)
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

/**
 * Shorthand for large amounts (e.g. 3.5tr, 500k)
 */
export function formatVNDShort(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return (Number.isInteger(m) ? m.toString() : m.toFixed(1)) + "tr";
  }
  if (amount >= 1_000) {
    return Math.round(amount / 1_000) + "k";
  }
  return amount + "đ";
}
