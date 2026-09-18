import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'affiliate_token';

export async function getAffiliateToken(): Promise<string | undefined> {
  return cookies().get(COOKIE_NAME)?.value;
}

export async function setAffiliateToken(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 ngày, khớp AFFILIATE_JWT_EXPIRES_IN phía backend
  });
}

export async function clearAffiliateToken() {
  cookies().delete(COOKIE_NAME);
}

/** Gọi ở đầu mỗi server component cần affiliate đã đăng nhập. */
export async function requireAuth(): Promise<string> {
  const token = await getAffiliateToken();
  if (!token) redirect('/login');
  return token;
}
