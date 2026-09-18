'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { loginAction, googleAuthAction } from '../actions';
import { ArrowRight, Lock, Mail } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
    >
      <span>{pending ? 'Verifying credentials…' : 'Sign in to Partner Portal'}</span>
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, {});

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 text-[#09090B] font-sans">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="h-9 w-auto mx-auto flex items-center justify-center">
              <img
                src="/logos/innotek.png"
                alt="Innotek Global"
                className="h-8 w-auto object-contain"
              />
            </div>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B] mt-5 tracking-tight">
            Partner Portal Login
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-600">
            Access your multi-product referral links and financial ledger.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          {/* Main Email & Password Form */}
          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="partner@example.com"
                  className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-black focus:ring-1 focus:ring-black shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-neutral-800" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-black focus:ring-1 focus:ring-black shadow-2xs"
                />
              </div>
            </div>

            {state.error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
                {state.error}
              </div>
            )}

            <SubmitButton />
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <span className="relative bg-white px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Or continue with
            </span>
          </div>

          {/* Google Sign In Button at the bottom */}
          <form action={() => googleAuthAction()}>
            <button
              type="submit"
              className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 px-4 text-xs sm:text-sm font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          <div className="border-t border-neutral-100 pt-5 text-center text-xs text-neutral-600">
            <span>Don&apos;t have a partner account? </span>
            <Link href="/register" className="font-semibold text-black hover:underline">
              Apply to Programme
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-neutral-500">
          <Link href="/" className="hover:text-black transition">← Back to Innotek Global</Link>
        </div>
      </div>
    </main>
  );
}
