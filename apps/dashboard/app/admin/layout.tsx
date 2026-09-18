'use client';

import { AdminNav } from '@/components/admin-nav';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Statutory legal dossier (/admin/users/[id]) and statutory report (/admin/analytics/report) hide AdminNav for official A4 print standard
  const isDossierPage =
    Boolean(pathname?.match(/^\/admin\/users\/[^/]+$/)) ||
    pathname === '/admin/analytics/report';

  if (isDossierPage) {
    return (
      <div className="min-h-screen bg-white text-[#09090B] selection:bg-black selection:text-white font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#09090B] selection:bg-black selection:text-white font-sans">
      <AdminNav />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white">
        {children}
      </main>
    </div>
  );
}
