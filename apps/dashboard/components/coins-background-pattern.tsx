'use client';

import React from 'react';

export function CoinsBackgroundPattern() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden -z-50 opacity-20 print:hidden"
    >
      {/* Ambient soft glow spots for subtle depth */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-neutral-500/20 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-neutral-500/15 blur-3xl" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-neutral-500/15 blur-3xl" />

      {/* --- SCATTERED RANDOM NON-GRID COINS & DECORATIVE PATTERNS --- */}

      {/* 1. Top Left Area */}
      <div className="absolute top-[4%] left-[3%] rotate-[-15deg] transition-transform">
        {/* Large $ Coin with double rim & milled edge */}
        <svg width="68" height="68" viewBox="0 0 68 68" fill="none" className="text-neutral-900">
          <circle cx="34" cy="34" r="32" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
          <circle cx="34" cy="34" r="27" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="34" cy="34" r="23" fill="currentColor" fillOpacity="0.04" />
          <text x="34" y="42" textAnchor="middle" fill="currentColor" fontSize="24" fontWeight="bold" fontFamily="monospace">$</text>
        </svg>
      </div>

      {/* Sparkle near top-left coin */}
      <div className="absolute top-[8%] left-[10%] rotate-12">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-800">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      <div className="absolute top-[2%] left-[22%] rotate-[30deg]">
        {/* Small Tilted 3D Coin */}
        <svg width="42" height="28" viewBox="0 0 42 28" fill="none" className="text-neutral-900">
          <ellipse cx="21" cy="14" rx="19" ry="11" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.04" />
          <ellipse cx="21" cy="14" rx="14" ry="8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <text x="21" y="18" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="bold" fontFamily="monospace">$</text>
        </svg>
      </div>

      {/* 2. Top Center & Right Area */}
      <div className="absolute top-[5%] right-[28%] rotate-[-25deg]">
        {/* Star Medallion Coin */}
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="text-neutral-900">
          <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="2" />
          <circle cx="28" cy="28" r="21" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
          <path d="M28 16L30.5 24L38.5 26.5L30.5 29L28 37L25.5 29L17.5 26.5L25.5 24L28 16Z" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute top-[2%] right-[12%] rotate-[18deg]">
        {/* Medium £ Coin */}
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" className="text-neutral-900">
          <circle cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="2" />
          <circle cx="26" cy="26" r="19" stroke="currentColor" strokeWidth="1.2" />
          <text x="26" y="34" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="bold" fontFamily="monospace">£</text>
        </svg>
      </div>

      <div className="absolute top-[9%] right-[4%] rotate-[-8deg]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-800">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      {/* Random Non-Grid Scattered Plus & Rings (Top) */}
      <div className="absolute top-[14%] left-[34%] rotate-45 text-neutral-800 font-bold text-lg select-none">+</div>
      <div className="absolute top-[18%] left-[48%] rotate-12">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-neutral-800">
          <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="14" cy="14" r="4" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute top-[12%] right-[19%] rotate-[-15deg] text-neutral-800 font-bold text-sm select-none">✦</div>

      {/* 3. Upper Mid Section */}
      <div className="absolute top-[24%] left-[1%] rotate-[35deg]">
        {/* € Euro Coin */}
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-neutral-900">
          <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="2.2" strokeDasharray="4 2" />
          <circle cx="30" cy="30" r="22" stroke="currentColor" strokeWidth="1.2" />
          <text x="30" y="38" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="bold" fontFamily="monospace">€</text>
        </svg>
      </div>

      <div className="absolute top-[28%] left-[14%] rotate-[-20deg]">
        {/* Small coin */}
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="text-neutral-900">
          <circle cx="17" cy="17" r="15" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="17" cy="17" r="11" stroke="currentColor" strokeWidth="1" />
          <text x="17" y="22" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="bold" fontFamily="monospace">$</text>
        </svg>
      </div>

      <div className="absolute top-[22%] right-[7%] rotate-[40deg]">
        {/* Double Coin Stack */}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-neutral-900">
          {/* Bottom Coin */}
          <ellipse cx="28" cy="36" rx="20" ry="12" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.03" />
          {/* Top Coin */}
          <ellipse cx="36" cy="26" rx="20" ry="12" stroke="currentColor" strokeWidth="2" fill="#E5E8EC" />
          <ellipse cx="36" cy="26" rx="15" ry="9" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
          <text x="36" y="30" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="bold" fontFamily="monospace">$</text>
        </svg>
      </div>

      <div className="absolute top-[32%] right-[22%] rotate-[15deg]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-800">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      {/* Random floating dots & mini crosses (Upper-Mid) */}
      <div className="absolute top-[36%] left-[28%] rotate-12 text-neutral-800 text-xs font-mono">✦</div>
      <div className="absolute top-[30%] left-[42%] w-2 h-2 rounded-full bg-neutral-900" />
      <div className="absolute top-[38%] right-[38%] text-neutral-800 font-bold text-base select-none">+</div>
      <div className="absolute top-[26%] right-[45%] w-1.5 h-1.5 rounded-full bg-neutral-800" />

      {/* 4. Mid Section (Center Body) */}
      <div className="absolute top-[46%] left-[6%] rotate-[-28deg]">
        {/* Innotek Emblem Coin */}
        <svg width="62" height="62" viewBox="0 0 62 62" fill="none" className="text-neutral-900">
          <circle cx="31" cy="31" r="29" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="31" cy="31" r="23" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="31" cy="31" r="18" fill="currentColor" fillOpacity="0.04" />
          <path d="M25 22H37M31 22V40M25 40H37" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute top-[52%] left-[18%] rotate-[22deg]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-800">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      <div className="absolute top-[44%] right-[3%] rotate-[12deg]">
        {/* Large $ Coin */}
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-neutral-900">
          <circle cx="36" cy="36" r="34" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="36" cy="36" r="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="36" cy="36" r="22" stroke="currentColor" strokeWidth="1" />
          <text x="36" y="45" textAnchor="middle" fill="currentColor" fontSize="26" fontWeight="bold" fontFamily="monospace">$</text>
        </svg>
      </div>

      <div className="absolute top-[54%] right-[16%] rotate-[-35deg]">
        {/* Tilted Coin */}
        <svg width="48" height="32" viewBox="0 0 48 32" fill="none" className="text-neutral-900">
          <ellipse cx="24" cy="16" rx="22" ry="13" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.03" />
          <ellipse cx="24" cy="16" rx="16" ry="9" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
          <text x="24" y="21" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="bold" fontFamily="monospace">£</text>
        </svg>
      </div>

      {/* Non-grid floating organic marks in mid section */}
      <div className="absolute top-[48%] left-[52%] rotate-45 text-neutral-800 font-bold text-sm select-none">✕</div>
      <div className="absolute top-[56%] left-[36%]">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-neutral-800">
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute top-[50%] right-[32%] rotate-[-15deg] text-neutral-800 text-base font-mono">✦</div>
      <div className="absolute top-[42%] left-[24%] w-2 h-2 rounded-full bg-neutral-800" />

      {/* 5. Lower Mid Section */}
      <div className="absolute top-[66%] left-[2%] rotate-[16deg]">
        {/* Star Coin */}
        <svg width="54" height="54" viewBox="0 0 54 54" fill="none" className="text-neutral-900">
          <circle cx="27" cy="27" r="25" stroke="currentColor" strokeWidth="2" />
          <circle cx="27" cy="27" r="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M27 15L29 23L37 25L29 27L27 35L25 27L17 25L25 23L27 15Z" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute top-[72%] left-[12%] rotate-[-10deg]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-800">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      <div className="absolute top-[64%] right-[8%] rotate-[-22deg]">
        {/* Medium $ Coin */}
        <svg width="58" height="58" viewBox="0 0 58 58" fill="none" className="text-neutral-900">
          <circle cx="29" cy="29" r="27" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="29" cy="29" r="21" stroke="currentColor" strokeWidth="1.2" />
          <text x="29" y="37" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="bold" fontFamily="monospace">$</text>
        </svg>
      </div>

      <div className="absolute top-[74%] right-[25%] rotate-[32deg]">
        {/* Mini Euro coin */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-neutral-900">
          <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="18" r="12" stroke="currentColor" strokeWidth="1" />
          <text x="18" y="23" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" fontFamily="monospace">€</text>
        </svg>
      </div>

      {/* Non-grid accents (Lower Mid) */}
      <div className="absolute top-[68%] left-[45%] rotate-12 text-neutral-800 font-bold text-base select-none">+</div>
      <div className="absolute top-[72%] left-[30%] w-2 h-2 rounded-full bg-neutral-900" />
      <div className="absolute top-[65%] right-[42%] text-neutral-800 font-mono text-xs">✦</div>
      <div className="absolute top-[76%] right-[14%] w-1.5 h-1.5 rounded-full bg-neutral-800" />

      {/* 6. Bottom Area */}
      <div className="absolute top-[84%] left-[5%] rotate-[-18deg]">
        {/* Large $ Coin */}
        <svg width="66" height="66" viewBox="0 0 66 66" fill="none" className="text-neutral-900">
          <circle cx="33" cy="33" r="31" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="33" cy="33" r="25" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="33" cy="33" r="20" fill="currentColor" fillOpacity="0.04" />
          <text x="33" y="41" textAnchor="middle" fill="currentColor" fontSize="24" fontWeight="bold" fontFamily="monospace">$</text>
        </svg>
      </div>

      <div className="absolute top-[88%] left-[20%] rotate-[25deg]">
        {/* Tilted 3D Coin */}
        <svg width="44" height="30" viewBox="0 0 44 30" fill="none" className="text-neutral-900">
          <ellipse cx="22" cy="15" rx="20" ry="12" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.03" />
          <ellipse cx="22" cy="15" rx="14" ry="8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <text x="22" y="19" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="bold" fontFamily="monospace">$</text>
        </svg>
      </div>

      <div className="absolute top-[82%] right-[5%] rotate-[30deg]">
        {/* £ Coin */}
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-neutral-900">
          <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="2.2" strokeDasharray="4 2" />
          <circle cx="30" cy="30" r="22" stroke="currentColor" strokeWidth="1.2" />
          <text x="30" y="38" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="bold" fontFamily="monospace">£</text>
        </svg>
      </div>

      <div className="absolute top-[92%] right-[18%] rotate-[-12deg]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-800">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      <div className="absolute top-[90%] left-[48%] rotate-[-25deg]">
        {/* Star Coin */}
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="text-neutral-900">
          <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="2" />
          <circle cx="25" cy="25" r="18" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
          <path d="M25 14L27 21L34 23L27 25L25 32L23 25L16 23L23 21L25 14Z" fill="currentColor" />
        </svg>
      </div>

      {/* Random Bottom non-grid accents */}
      <div className="absolute top-[86%] left-[35%] rotate-45 text-neutral-800 font-bold text-sm select-none">+</div>
      <div className="absolute top-[94%] left-[10%] text-neutral-800 font-mono text-xs">✦</div>
      <div className="absolute top-[92%] right-[38%] rotate-12">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-neutral-800">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>
      <div className="absolute top-[88%] right-[48%] w-1.5 h-1.5 rounded-full bg-neutral-800" />
    </div>
  );
}
