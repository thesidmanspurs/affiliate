import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { logoutAction } from './actions';

const NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/conversions', label: 'Conversions' },
  { href: '/payouts', label: 'Payouts' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-56 flex-col justify-between bg-ink px-5 py-6">
        <div>
          <span className="font-display text-xl text-white">Affiliate</span>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-white/50 hover:text-white/80">Sign Out</button>
        </form>
      </aside>

      <main className="flex-1 px-10 py-8">{children}</main>
    </div>
  );
}
