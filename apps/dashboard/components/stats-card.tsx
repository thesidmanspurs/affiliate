function formatMoney(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(cents / 100);
}

export function StatsCard({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'pending' | 'money';
}) {
  const display = tone === 'money' ? formatMoney(value) : value.toLocaleString('vi-VN');
  const valueColor = tone === 'pending' ? 'text-amber-600' : tone === 'money' ? 'text-teal-600' : 'text-ink';

  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className={`mt-2 font-display text-3xl ${valueColor}`}>{display}</p>
    </div>
  );
}
