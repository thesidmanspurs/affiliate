import { PublicHeader } from '@/components/public-header';
import { PublicFooter } from '@/components/public-footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#09090B] selection:bg-black selection:text-white">
      <PublicHeader />
      <main className="flex-1 w-full bg-white">{children}</main>
      <PublicFooter />
    </div>
  );
}
