/** Logic tính hoa hồng thuần - không phụ thuộc DB hay framework.
 * Tách riêng để dễ unit test và dễ mở rộng (tier, cap, currency rounding...). */
export function calculateCommission(amount: number, commissionRate: number): number {
  if (amount < 0) throw new Error('Amount must not be negative');
  if (commissionRate < 0 || commissionRate > 1) throw new Error('Commission rate must be between 0 and 1');
  return Math.round(amount * commissionRate);
}
