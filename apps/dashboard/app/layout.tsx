import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Innotek Affiliate Programme | Innotek Global',
  description: 'Partner with Innotek Global to earn industry-leading recurring commissions across our premier suite of AI and SaaS applications.',
  icons: {
    icon: 'https://innotek.global/wp-content/uploads/2024/07/cropped-logo122-copy-1-192x192.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="scroll-smooth">
      <body className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} font-sans bg-white text-[#09090B] antialiased selection:bg-black selection:text-white relative min-h-screen`}>
        <div className="relative z-10 min-h-screen flex flex-col bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
