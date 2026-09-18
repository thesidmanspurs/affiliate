import { randomBytes } from 'crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bỏ ký tự dễ nhầm (I, O, 0, 1)

/** Sinh mã giới thiệu ngắn, dễ đọc, dễ gõ tay khi cần (vd trên livestream). */
export function generateAffiliateCode(length = 7): string {
  const bytes = randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}
